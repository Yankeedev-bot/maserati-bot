import a, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from '@whiskeysockets/baileys';
const makeWASocket = a.default;
import { Boom } from '@hapi/boom';
import NodeCache from 'node-cache';
import readline from 'readline';
import pino from 'pino';
import fs from 'fs/promises';
import path, { dirname, join } from 'path';
import qrcode from 'qrcode-terminal';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import axios from 'axios';

import PerformanceOptimizer from './utils/performanceOptimizer.js';
import RentalExpirationManager from './utils/rentalExpirationManager.js';
import { loadMsgBotOn } from './utils/database.js';
import { buildUserId } from './utils/helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ╔════════════════════════════════════╗
// ║         MASERATI-BOT 🏎️👑✨🇨🇮        ║
// ║     Puissance • Luxe • Élégance     ║
// ╚════════════════════════════════════╝
// Développé par yankee Hells 🙂

class MessageQueue {
    constructor(maxWorkers = 4, batchSize = 10, messagesPerBatch = 2) {
        this.queue = [];
        this.maxWorkers = maxWorkers;
        this.batchSize = batchSize;
        this.messagesPerBatch = messagesPerBatch;
        this.activeWorkers = 0;
        this.isProcessing = false;
        this.processingInterval = null;
        this.errorHandler = null;
        this.stats = {
            totalProcessed: 0,
            totalErrors: 0,
            currentQueueLength: 0,
            startTime: Date.now(),
            batchesProcessed: 0,
            avgBatchTime: 0
        };
        this.idCounter = 0;
    }

    setErrorHandler(handler) {
        this.errorHandler = handler;
    }

    async add(message, processor) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                message,
                processor,
                resolve,
                reject,
                timestamp: Date.now(),
                id: `msg_\( {++this.idCounter}_ \){Date.now()}`
            });
            
            this.stats.currentQueueLength = this.queue.length;
            
            if (!this.isProcessing) {
                this.startProcessing();
            }
        });
    }

    // ... (le reste de la classe MessageQueue reste identique, je ne le répète pas ici pour gagner de la place)

}

const messageQueue = new MessageQueue(8, 10, 2); // 8 workers, 10 lots, 2 messages par lot

const configPath = path.join(__dirname, "config.json");
let config;
let DEBUG_MODE = false;

try {
    const configContent = readFileSync(configPath, "utf8");
    config = JSON.parse(configContent);
    
    if (!config.prefix || !config.nom || !config.numerodono) {
        throw new Error('Config invalide : prefix, nom et numerodono obligatoires');
    }
    
    DEBUG_MODE = config.debug === true || process.env.MASERATI_DEBUG === '1';
    if (DEBUG_MODE) {
        console.log('🐆 Mode DEBUG activé – Logs détaillés Maserati');
    }
} catch (err) {
    console.error(`❌ Erreur chargement config Maserati : ${err.message}`);
    process.exit(1);
}

const indexModule = (await import('./index.js')).default ?? (await import('./index.js'));

const performanceOptimizer = new PerformanceOptimizer();

const {
    prefix,
    nom,               // ← anciennement nomebot
    nomdono,
    numerodono
} = config;

const rentalExpirationManager = new RentalExpirationManager(null, {
    ownerNumber: numerodono,
    ownerName: nomdono,
    checkInterval: '0 */6 * * *',
    warningDays: 3,
    finalWarningDays: 1,
    cleanupDelayHours: 24,
    enableNotifications: true,
    enableAutoCleanup: true,
    logFile: path.join(__dirname, '../logs/maserati_rental.log')
});

const logger = pino({ level: 'silent' });

const AUTH_DIR = path.join(__dirname, '..', 'database', 'qr-maserati');
const DATABASE_DIR = path.join(__dirname, '..', 'database');
const GLOBAL_BLACKLIST_PATH = path.join(__dirname, '..', 'database', 'dono', 'globalBlacklist.json');

let msgRetryCounterCache;
let messagesCache;

async function initializeOptimizedCaches() {
    // ... (même logique)
}

const codeMode = process.argv.includes('--code') || process.env.MASERATI_CODE_MODE === '1';

// ... (le reste des utilitaires reste très similaire : clearAuthDir, loadGroupSettings, etc.)

async function createGroupMessage(MaseratiSock, groupMetadata, participants, settings, isWelcome = true) {
    const jsonGp = await loadGroupSettings(groupMetadata.id);
    const mentions = participants.map(p => p);
    const bannerName = participants.length === 1 ? participants[0].split('@')[0] : `${participants.length} Légendes`;
    
    const replacements = {
        '#numerodele#': participants.map(p => `@${p.split('@')[0]}`).join(', '),
        '#nomedogp#': groupMetadata.subject,
        '#desc#': groupMetadata.desc || 'Aucune',
        '#membres#': groupMetadata.participants.length,
        '#emoji_vitesse#': '🏎️',
        '#emoji_couronne#': '👑',
        '#emoji_etincelle#': '✨',
        '#emoji_drapeau#': '🇨🇮'
    };

    const defaultWelcome = 
`╭═════ ⊱ 🏎️ *MASERATI ARRIVÉE* 👑 ⊱ ═════╮
│
│ ${replacements['#emoji_vitesse#']} #numerodele#
│
│ 🚗 Groupe : *#nomedogp#*
│ 👥 Membres : *#membres#*
│
╰═══════════════════════════════════════╯

${replacements['#emoji_etincelle#']} Bienvenue dans l'élite ! ${replacements['#emoji_couronne#']} ${replacements['#emoji_drapeau#']}`;

    const defaultExit = 
`╭═════ ⊱ 👋 *MASERATI DÉPART* 🏁 ⊱ ═════╮
│
│ ${replacements['#emoji_vitesse#']} #numerodele#
│
│ 🚪 A quitté le bolide
│ *#nomedogp#*
│
╰═══════════════════════════════════════╯

${replacements['#emoji_etincelle#']} À bientôt sur la piste ! 🏎️`;

    const textTemplate = isWelcome 
        ? (jsonGp.textbv || defaultWelcome)
        : (jsonGp.exit?.text || defaultExit);

    const text = formatMessageText(textTemplate, replacements);
    
    const message = { text, mentions };

    // Gestion image (logo Maserati, profil, etc.)
    if (settings.image) {
        let profilePicUrl = 'https://example.com/maserati-logo-luxe.png'; // ← à remplacer par un vrai lien
        if (participants.length === 1 && isWelcome) {
            profilePicUrl = await MaseratiSock.profilePictureUrl(participants[0], 'image').catch(() => profilePicUrl);
        }
        
        if (settings.image !== 'banner') {
            message.image = { url: settings.image };
            message.caption = text;
            delete message.text;
        }
    }

    return message;
}

// Fonction renommée pour cohérence
async function handleGroupParticipantsUpdate(MaseratiSock, inf) {
    // ... (logique identique mais avec MaseratiSock au lieu de NazunaSock)
    // Les messages envoyés utilisent maintenant le style Maserati ci-dessus
}

// ... (le reste du code reste structurellement identique)

async function createBotSocket(authDir) {
    // ...
    const MaseratiSock = makeWASocket({
        // ... mêmes options
        browser: ['Windows', 'Edge', 'Maserati Edition'],
        // ...
    });

    // Tous les .ev.on() utilisent maintenant MaseratiSock

    // Dans connection.update :
    if (connection === 'open') {
        console.log(`🏎️ MASERATI-BOT connecté avec succès !`);
        console.log(`Prefix : ${prefix}  |  Propriétaire : ${nomdono}`);
        console.log(`Mode : ${messageQueue.batchSize * messageQueue.messagesPerBatch} messages parallèles – Puissance maximale`);
    }

    return MaseratiSock;
}

async function startMaserati() {
    // Même logique que startNazu mais renommée
    console.log('🚀 Démarrage Maserati-Bot 🏎️👑✨🇨🇮');
    // ...
}

async function gracefulShutdown(signal) {
    console.log(`📡 Arrêt moteur – Signal ${signal} reçu`);
    // ...
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startMaserati();

export { rentalExpirationManager, messageQueue };

// Développé avec style par yankee Hells 🙂