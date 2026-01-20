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
    console.log(`[CMD] Chargée : ${cmd.name}`);
  }
}

async function connectBot() {
  const { state, saveCreds } = await useMultiFileAuthState('session_maserati');
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,               // QR toujours affiché en fallback
    logger: require('pino')({ level: 'silent' }),
    browser: Browsers.ubuntu('Chrome'),    // Config plus stable pour pairing
    syncFullHistory: false,
    markOnlineOnConnect: true
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('\n🔗 QR fallback (scan si pairing bloque) :');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'close') {
      const status = (lastDisconnect?.error)?.output?.statusCode;
      console.log(`❌ Connexion fermée | Code: ${status || 'inconnu'} | Reconnexion ? ${status !== DisconnectReason.loggedOut}`);
      if (status !== DisconnectReason.loggedOut) {
        setTimeout(connectBot, 8000); // Re-tente après 8s
      } else {
        console.log('Session invalide (logged out) → supprime session_maserati et relance');
      }
    }

    if (connection === 'open') {
      console.log(`\n${BOT_NAME} CONNECTÉ AVEC SUCCÈS ! ${THEME}\nPrêt à rouler 🏎️`);
    }

    // Pairing code avec délai important (solution #1774)
    if ((connection === 'connecting' || update.isOnline) && !state.creds.registered) {
      setTimeout(async () => {  // Délai 10 secondes pour laisser la connexion s'établir
        try {
          const phoneNumber = '2250585256740'; // ← TON NUMÉRO SANS + NI ESPACES
          console.log('\n⏳ Génération pairing code (attente 10s terminée)...');
          const code = await sock.requestPairingCode(phoneNumber);
          
          console.log(`
╔════════════════════════════════════════════╗
║     ${BOT_NAME}     ║
║                                            ║
║   CODE PAIRING :   ${code.padEnd(12)}   ║
║   (entre-le vite dans WhatsApp !)          ║
║                                            ║
║   Appareils liés → Lier avec numéro        ║
║   Créé par ${CREATOR} • ${CREATOR_NUMBER} ║
╚════════════════════════════════════════════╝
          `);
        } catch (err) {
          console.error('❌ Erreur pairing :', err.message || err);
          console.log('→ Essaie le QR ci-dessus (scan-le depuis WhatsApp)');
          console.log('→ Ou supprime le dossier "session_maserati" et relance');
        }
      }, 10000); // 10 secondes de délai → clé du fix
    }
  });

  // Gestion messages (inchangée)
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
        await sock.sendMessage(msg.key.remoteJid, { text: `Erreur commande 😓 Réessaie ! ${THEME}` });
      }
    }
  });

  return sock;
}

loadCommands();
connectBot().catch(err => {
  console.error('Erreur fatale démarrage :', err);
});
