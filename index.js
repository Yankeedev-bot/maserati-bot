const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode-terminal');
const pino = require('pino');

const PREFIX = '/';
const BOT_NAME = '🔱★✨MASERATI†BOT✨★🔱';
const CREATOR = 'Christ Evrard alias Yankee Hells 🇨🇮';
const CREATOR_NUMBER = '+2250585256740';
const THEME = '🏎️👑✨🇨🇮';

const commandsDir = path.join(__dirname, 'commands');
const commands = new Map();

function loadCommands() {
  if (!fs.existsSync(commandsDir)) fs.mkdirSync(commandsDir);
  const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const cmd = require(path.join(commandsDir, file));
    commands.set(cmd.name.toLowerCase(), cmd);
    if (cmd.aliases) cmd.aliases.forEach(alias => commands.set(alias.toLowerCase(), cmd));
    console.log(`[MASERATI] Commande chargée : ${cmd.name}`);
  }
}

async function connectBot(attempt = 1) {
  console.log(`[MASERATI] Tentative de connexion #${attempt}...`);

  const { state, saveCreds } = await useMultiFileAuthState('session_maserati_business');
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
    logger: pino({ level: 'silent' }), // Change à 'debug' si tu veux full logs
    browser: Browsers.macOS('Chrome'), // Spoof Mac/Chrome → plus stable pour Business en 2026
    markOnlineOnConnect: true,
    syncFullHistory: false, // Pas besoin pour bot simple
    connectTimeoutMs: 60000,
    qrTimeout: 0 // Pas de timeout QR
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log(`\n[QR FALLBACK – SCAN ÇA DIRECTEMENT]`);
      qrcode.generate(qr, { small: true });
      console.log(`[MASERATI] QR prêt – Ouvre WhatsApp Business > Appareils liés > Lier un appareil > Scanner`);
    }

    if (connection === 'close') {
      const status = lastDisconnect?.error?.output?.statusCode;
      console.log(`[MASERATI] Connexion fermée | Code: ${status || 'inconnu'}`);
      
      if (status === DisconnectReason.loggedOut) {
        console.log(`[MASERATI] Déconnexion forcée (logged out) → Supprime session_maserati_business et relance`);
        fs.rmSync('session_maserati_business', { recursive: true, force: true });
      } else if (status === 429) { // Rate limit
        console.log(`[MASERATI] Rate limit 429 – Attente 5 min avant retry`);
        setTimeout(() => connectBot(attempt + 1), 300000);
      } else if (attempt < 5) {
        console.log(`[MASERATI] Re-tentative dans 10s...`);
        setTimeout(() => connectBot(attempt + 1), 10000);
      } else {
        console.log(`[MASERATI] Échec après ${attempt} tentatives – Passe au QR scan manuellement`);
      }
    }

    if (connection === 'open') {
      console.log(`\n${BOT_NAME} CONNECTÉ FULL POWER ! ${THEME}`);
      console.log(`[MASERATI] Prêt pour commandes – Teste /menu ou /meteo`);
    }

    // Pairing code ultra-robuste (délai long + custom key optionnelle)
    if ((connection === 'connecting' || update.isOnline) && !state.creds.registered) {
      setTimeout(async () => {
        try {
          const phoneNumber = '2250585256740'; // ← VÉRIFIE 100% TON NUMÉRO BUSINESS (sans +, format 225XXXXXXXXXX)
          // Option : custom pairing key (8 chars alphanum) pour éviter conflits
          // const customPairKey = 'YANKEE01'; // Décommente si tu veux (optionnel)
          // const code = await sock.requestPairingCode(phoneNumber, customPairKey);

          const code = await sock.requestPairingCode(phoneNumber); // Sans custom key pour simplicité

          console.log(`
╔══════════════════════════════════════════════╗
║         ${BOT_NAME} - BUSINESS MODE          ║
║                                              ║
║   CODE PAIRING BOOSTÉ :   ${code.padEnd(14)} ║
║   (valide ~60s – entre vite !)               ║
║                                              ║
║   WhatsApp Business → Appareils liés         ║
║   → Lier avec numéro de téléphone            ║
║   Code : ${code}                             ║
║                                              ║
║   Par ${CREATOR} • ${CREATOR_NUMBER}        ║
╚══════════════════════════════════════════════╝
          `);
        } catch (err) {
          console.error(`[MASERATI] Erreur pairing : ${err.message || err}`);
          console.log(`[MASERATI] → Essaie le QR ci-dessus (scan Business) ou attends 5-10 min (rate limit)`);
        }
      }, 15000); // Délai 15s → laisse le temps à WhatsApp Business de stabiliser
    }
  });

  // Messages (inchangé)
  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;

    let text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
    if (!text.startsWith(PREFIX)) return;

    const args = text.slice(PREFIX.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();

    const cmd = commands.get(cmdName);
    if (cmd) {
      try {
        await cmd.execute(sock, msg, args);
      } catch (err) {
        console.error(`Erreur /${cmdName} :`, err);
        await sock.sendMessage(msg.key.remoteJid, { text: `Erreur commande 😓 Réessaie boss ! ${THEME}` });
      }
    }
  });

  return sock;
}

loadCommands();
connectBot().catch(err => console.error('[MASERATI] Erreur fatale :', err));
