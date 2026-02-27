import a, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from '@whiskeysockets/baileys';
const makeWASocket = a.default;
import { Boom } from '@hapi/boom';
import NodeCache from 'node-cache';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { buildUserId, getLidFromJidCached, getUserName } from './helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUBBOTS_FILE = path.join(__dirname, '../../database/subbots.json');
const SUBBOTS_DIR  = path.join(__dirname, '../../database/subbots');
const BASE_DB_DIR   = path.join(__dirname, '../../database');

/**
 * Récupère la dernière version Baileys depuis GitHub (fallback possible)
 */
async function recupererVersionBaileysDepuisGitHub() {
    try {
        const res = await axios.get(
            'https://raw.githubusercontent.com/WhiskeySockets/Baileys/refs/heads/master/src/Defaults/baileys-version.json',
            { timeout: 120000 }
        );
        return { version: res.data.version };
    } catch (err) {
        console.error('❌ Échec récupération version GitHub → fallback:', err.message);
        return await fetchLatestBaileysVersion();
    }
}

// Map des sub-bots actifs (Maserati fleet)
const flotteActive = new Map();

// Protection double-clic génération code
const enCoursGeneration = new Set();

// Logger discret (mode furtif)
const logger = pino({ level: 'silent' });

function chargerListeSubBots() {
    try {
        if (!fs.existsSync(SUBBOTS_FILE)) {
            fs.writeFileSync(SUBBOTS_FILE, JSON.stringify({ subbots: {} }, null, 2));
            return {};
        }
        const data = JSON.parse(fs.readFileSync(SUBBOTS_FILE, 'utf-8'));
        return data.subbots || {};
    } catch (err) {
        console.error('Erreur chargement flotte:', err);
        return {};
    }
}

function sauvegarderListeSubBots(subbots) {
    try {
        fs.writeFileSync(SUBBOTS_FILE, JSON.stringify({ subbots }, null, 2));
        return true;
    } catch (err) {
        console.error('Erreur sauvegarde flotte:', err);
        return false;
    }
}

function creerDossiersSubBot(botId) {
    const base = path.join(SUBBOTS_DIR, botId);
    const dossiers = [
        base,
        path.join(base, 'auth'),
        path.join(base, 'database'),
        path.join(base, 'database/grupos'),
        path.join(base, 'database/users'),
        path.join(base, 'database/dono')
    ];

    dossiers.forEach(d => {
        if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
    });

    return {
        dossierBot: base,
        dossierAuth: dossiers[1],
        dossierDb: dossiers[2]
    };
}

function creerConfigInitialeSubBot(botId, numeroTelephone, numeroBoss) {
    const dossiers = creerDossiersSubBot(botId);

    let configPrincipal = {};
    try {
        configPrincipal = JSON.parse(
            fs.readFileSync(path.join(__dirname, '../config.json'), 'utf-8')
        );
    } catch {}

    const config = {
        numerodono:     numeroBoss       || configPrincipal.numerodono || '',
        nomedono:       configPrincipal.nomedono || 'Boss Maserati',
        nomebot:        `Maserati Sub-${botId.slice(0,8)} 🏎️`,
        prefixo:        configPrincipal.prefixo  || '!',
        apikey:         configPrincipal.apikey    || '',
        debug:          false,
        lidowner:       numeroBoss?.includes('@lid') ? numeroBoss : '',
        botNumber:      numeroTelephone
    };

    const cheminConfig = path.join(dossiers.dossierDb, 'config.json');
    fs.writeFileSync(cheminConfig, JSON.stringify(config, null, 2));

    return { config, dossiers };
}

async function demarrerSubBot(botId, numeroTelephone, numeroBoss, genererCode = false) {
    try {
        console.log(`🏎️  Démarrage bolide ${botId}...`);

        const { config, dossiers } = creerConfigInitialeSubBot(botId, numeroTelephone, numeroBoss);

        const { state, saveCreds } = await useMultiFileAuthState(
            dossiers.dossierAuth,
            makeCacheableSignalKeyStore
        );

        const version = [2, 3000, 1031821793]; // version fixe récente (2025)

        const cacheRetry = new NodeCache();

        const socket = makeWASocket({
            version,
            logger,
            browser: ['Windows', 'Edge', '143.0.3650.66'],
            emitOwnEvents: true,
            fireInitQueries: true,
            generateHighQualityLinkPreview: true,
            syncFullHistory: true,
            markOnlineOnConnect: true,
            connectTimeoutMs: 120_000,
            retryRequestDelayMs: 5_000,
            qrTimeout: 180_000,
            keepAliveIntervalMs: 30_000,
            msgRetryCounterCache: cacheRetry,
            auth: state,
            shouldResendMessageOn475AckError: true
        });

        let codePairage = null;

        if (genererCode && !socket.authState.creds.registered) {
            const numClean = numeroTelephone.replace(/\D/g, '');

            console.log(`⏳ Préparation connexion ${numeroTelephone}...`);
            await new Promise(r => setTimeout(r, 3000));

            try {
                codePairage = await socket.requestPairingCode(numClean);
                console.log(`🔑 Code généré pour ${numeroTelephone} → ${codePairage}`);

                const flotte = chargerListeSubBots();
                if (flotte[botId]) {
                    flotte[botId].pairingCode = codePairage;
                    flotte[botId].status = 'en_attente_pairage';
                    flotte[botId].lastPairingRequest = new Date().toISOString();
                    sauvegarderListeSubBots(flotte);
                }
            } catch (err) {
                throw new Error(`Impossible de générer le code pairage → ${err.message}`);
            }
        }

        socket.ev.on('creds.update', saveCreds);

        socket.ev.on('connection.update', async (upd) => {
            const { connection, lastDisconnect } = upd;

            if (connection === 'open') {
                console.log(`✅ Bolide ${botId} sur la piste !`);

                const flotte = chargerListeSubBots();
                if (flotte[botId]) {
                    flotte[botId].status = 'connecte';
                    flotte[botId].lastConnection = new Date().toISOString();

                    let numBot = socket.user?.id?.split(':')[0] || numeroTelephone;
                    try { numBot = await getLidFromJidCached(socket, numBot); } catch {}

                    flotte[botId].number = numBot;
                    sauvegarderListeSubBots(flotte);
                }

                flotteActive.set(botId, socket);
            }

            if (connection === 'close') {
                const codeErreur = new Boom(lastDisconnect?.error)?.output?.statusCode;
                console.log(`❌ ${botId} hors piste – code: ${codeErreur}`);

                flotteActive.delete(botId);

                const flotte = chargerListeSubBots();
                if (flotte[botId]) {
                    flotte[botId].status = 'deconnecte';
                    flotte[botId].lastDisconnection = new Date().toISOString();
                    flotte[botId].disconnectReason = codeErreur;
                    sauvegarderListeSubBots(flotte);
                }

                if (codeErreur === DisconnectReason.loggedOut) {
                    console.log(`🗑️ Déconnexion définitive → suppression ${botId}`);
                    await supprimerSubBot(botId);
                }
                else if (codeErreur === 428) {
                    console.log(`⏸️ ${botId} en attente pairage`);
                }
                else if (socket.authState.creds.registered) {
                    console.log(`🔄 Re-démarrage dans 10s...`);
                    setTimeout(() => demarrerSubBot(botId, numeroTelephone, numeroBoss), 10000);
                }
            }
        });

        // ─────────────────────────────────────────────
        // Traitement messages entrants (moteur principal)
        // ─────────────────────────────────────────────
        socket.ev.on('messages.upsert', async (m) => {
            if (!m.messages || m.type !== 'notify') return;

            for (const msg of m.messages) {
                if (!msg?.message || !msg.key?.remoteJid) continue;
                if (msg.key.fromMe) continue;

                // Sauvegarde config actuelle
                const envBackup = { ...process.env };

                // Injection config sub-bot
                process.env.CONFIG_PATH  = path.join(dossiers.dossierDb, 'config.json');
                process.env.DATABASE_PATH = dossiers.dossierDb;
                process.env.IS_SUBBOT     = 'true';
                process.env.SUBBOT_ID     = botId;

                try {
                    // Import dynamique du moteur principal Maserati
                    const moteurPrincipal = await import('../index.js');
                    const executerMaserati = moteurPrincipal.default || moteurPrincipal;

                    if (typeof executerMaserati !== 'function') {
                        console.error(`Moteur principal invalide pour ${botId}`);
                        continue;
                    }

                    const cacheMsg = new Map();
                    if (msg.key?.id && msg.key.remoteJid) {
                        cacheMsg.set(`\( {msg.key.remoteJid}_ \){msg.key.id}`, msg);
                    }

                    await executerMaserati(socket, msg, null, cacheMsg, null);
                } catch (err) {
                    console.error(`Erreur moteur sub-bot ${botId}:`, err);
                } finally {
                    // Restauration environnement
                    Object.assign(process.env, envBackup);
                }
            }
        });

        return { socket, codePairage };
    } catch (err) {
        console.error(`❌ Échec démarrage ${botId}:`, err);
        throw err;
    }
}

/* ────────────────────────────────────────────────
   Commandes de gestion de flotte Maserati
   ──────────────────────────────────────────────── */

async function ajouterBolide(numeroTelephone, numeroBoss, lidSubBot) {
    try {
        const numClean = numeroTelephone.replace(/\D/g, '');
        if (!/^\d{10,15}$/.test(numClean)) {
            return { success: false, message: '❌ Numéro invalide ! Format attendu : 225xxxxxxxx' };
        }

        if (!lidSubBot?.includes('@lid')) {
            return { success: false, message: '❌ LID du sub-bot invalide. Mentionne-le correctement.' };
        }

        const idBolide = `maserati_\( {Date.now()}_ \){Math.random().toString(36).slice(2,10)}`;

        const flotte = chargerListeSubBots();
        if (Object.values(flotte).some(b => b.phoneNumber === numeroTelephone)) {
            return { success: false, message: '❌ Ce numéro est déjà dans la flotte !' };
        }
        if (Object.values(flotte).some(b => b.subBotLid === lidSubBot)) {
            return { success: false, message: '❌ Ce LID est déjà utilisé !' };
        }

        flotte[idBolide] = {
            id: idBolide,
            phoneNumber: numeroTelephone,
            ownerNumber: numeroBoss,
            subBotLid: lidSubBot,
            status: 'en_attente_code',
            createdAt: new Date().toISOString(),
            pairingCode: null
        };

        sauvegarderListeSubBots(flotte);
        creerDossiersSubBot(idBolide);
        creerConfigInitialeSubBot(idBolide, numeroTelephone, numeroBoss);

        return {
            success: true,
            message: `🏎️ *BOLIDE AJOUTÉ À LA FLOTTE!*\n\n` +
                     `📱 Numéro : ${numeroTelephone}\n` +
                     `🆔 ID interne : \`${idBolide}\`\n` +
                     `🔑 LID : \`${lidSubBot}\`\n\n` +
                     `Prochaine étape : utilise la commande\n` +
                     `*!gerercodesub*  sur ce numéro pour obtenir le code de connexion.`,
            idBolide,
            numeroTelephone,
            lidSubBot
        };
    } catch (err) {
        return { success: false, message: `❌ Échec ajout bolide : ${err.message}` };
    }
}

async function supprimerBolide(idBolide) {
    try {
        const flotte = chargerListeSubBots();
        if (!flotte[idBolide]) return { success: false, message: '❌ Bolide introuvable dans la flotte' };

        const socket = flotteActive.get(idBolide);
        if (socket) {
            await socket.logout().catch(() => {});
            flotteActive.delete(idBolide);
        }

        const dossier = path.join(SUBBOTS_DIR, idBolide);
        if (fs.existsSync(dossier)) fs.rmSync(dossier, { recursive: true, force: true });

        delete flotte[idBolide];
        sauvegarderListeSubBots(flotte);

        return { success: true, message: `🗑️ Bolide ${idBolide} retiré de la piste.` };
    } catch (err) {
        return { success: false, message: `❌ Échec suppression : ${err.message}` };
    }
}

function listerFlotte() {
    const flotte = chargerListeSubBots();
    const bolides = Object.values(flotte);

    if (!bolides.length) {
        return { success: true, message: '🏁 Aucune Maserati dans la flotte pour le moment.', bolides: [] };
    }

    return {
        success: true,
        bolides: bolides.map(b => ({
            id: b.id,
            numero: b.phoneNumber,
            lid: b.subBotLid,
            statut: b.status || 'inconnu',
            creeLe: b.createdAt,
            derniereConnexion: b.lastConnection || 'Jamais',
            actif: flotteActive.has(b.id)
        }))
    };
}

async function demarrerTouteLaFlotte() {
    const flotte = chargerListeSubBots();
    const ids = Object.keys(flotte);

    if (!ids.length) {
        console.log('🏁 Flotte vide – rien à démarrer.');
        return;
    }

    console.log(`🔧 Vérification ${ids.length} bolide(s)...`);

    let connectes = 0;
    for (const id of ids) {
        const b = flotte[id];
        if (flotteActive.has(id)) continue;

        const credsPath = path.join(SUBBOTS_DIR, id, 'auth/creds.json');
        if (!fs.existsSync(credsPath)) {
            console.log(`⏸️ ${id} → en attente premier pairage`);
            continue;
        }

        try {
            console.log(`🔄 Démarrage ${id}...`);
            await demarrerSubBot(id, b.phoneNumber, b.ownerNumber, false);
            connectes++;
            await new Promise(r => setTimeout(r, 2000));
        } catch (err) {
            console.error(`Échec ${id}:`, err.message);
        }
    }

    console.log(`🏁 Flotte prête – ${connectes} bolide(s) sur la piste.`);
}

async function genererCodePourProprietaire(lidUtilisateur) {
    try {
        const flotte = chargerListeSubBots();
        const entree = Object.entries(flotte).find(([_, b]) => b.subBotLid === lidUtilisateur);

        if (!entree) {
            return { success: false, message: '❌ Ce numéro n’est pas enregistré comme sub-bot Maserati.' };
        }

        const [idBolide, bolide] = entree;

        if (enCoursGeneration.has(idBolide)) {
            return { success: false, message: '⏳ Génération déjà en cours – patiente quelques secondes.' };
        }

        enCoursGeneration.add(idBolide);

        try {
            // Nettoyage ancien socket
            if (flotteActive.has(idBolide)) {
                await flotteActive.get(idBolide).logout().catch(() => {});
                flotteActive.delete(idBolide);
            }

            // Suppression anciennes creds
            const dossierAuth = path.join(SUBBOTS_DIR, idBolide, 'auth');
            if (fs.existsSync(dossierAuth)) {
                fs.rmSync(dossierAuth, { recursive: true, force: true });
                fs.mkdirSync(dossierAuth, { recursive: true });
            }

            const resultat = await demarrerSubBot(idBolide, bolide.phoneNumber, bolide.ownerNumber, true);

            if (!resultat.codePairage) {
                return { success: false, message: '❌ Impossible de générer le code cette fois-ci.' };
            }

            const message = `🔑 *CODE DE CONNEXION MASERATI GÉNÉRÉ !*\n\n` +
                            `Ton bolide : ${bolide.phoneNumber}\n` +
                            `ID interne : \`${idBolide}\`\n\n` +
                            `Code à 8 chiffres :\n` +
                            `\`\`\`${resultat.codePairage}\`\`\`\n\n` +
                            `Instructions :\n` +
                            `1. Ouvre WhatsApp sur ce numéro\n` +
                            `2. Paramètres → Appareils connectés\n` +
                            `3. Connecter un appareil → Avec numéro de téléphone\n` +
                            `4. Entre le code ci-dessus\n\n` +
                            `⏱️ Valable quelques minutes seulement !`;

            return {
                success: true,
                message,
                codePairage: resultat.codePairage,
                idBolide
            };
        } finally {
            setTimeout(() => enCoursGeneration.delete(idBolide), 10000);
        }
    } catch (err) {
        enCoursGeneration.delete(idBolide);
        return { success: false, message: `❌ Problème génération code : ${err.message}` };
    }
}

export {
    ajouterBolide               as addSubBot,
    supprimerBolide             as removeSubBot,
    listerFlotte                as listSubBots,
    demarrerTouteLaFlotte       as initializeAllSubBots,
    genererCodePourProprietaire as generatePairingCodeForSubBot,
    flotteActive                as activeSubBots
};

// Développé par yankee Hells 🙂 🏎️👑✨🇨🇮