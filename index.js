const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
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
    if (cmd.aliases) {
      cmd.aliases.forEach(alias => commands.set(alias.toLowerCase(), cmd));
    }
    console.log(`[CMD] Chargée : ${cmd.name}`);
  }
}

async function connectBot() {
  const { state, saveCreds } = await useMultiFileAuthState('session_maserati');
  const { version } = await fetchLatestBaileysVersion(); // Toujours la dernière version WhatsApp

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
    logger: require('pino')({ level: 'silent' }),
    browser: ['Chrome', 'Ubuntu', '22.04'], // Important pour pairing code
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('\nQR fallback (si pairing ne marche pas) :');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(`Connexion perdue → Reconnexion ? ${shouldReconnect}`);
      if (shouldReconnect) setTimeout(connectBot, 5000); // Délai 5s pour éviter spam
    }

    if (connection === 'open') {
      console.log(`\n${BOT_NAME} CONNECTÉ ! ${THEME}\nPrêt à rouler 🏎️`);
    }

    // Pairing code : on le demande quand la connexion est en cours et pas encore enregistré
    if ((connection === 'connecting' || update.isOnline) && !state.creds.registered) {
      try {
        // ← TON NUMÉRO ICI (sans + , sans espaces, format 225XXXXXXXXXX)
        const phoneNumber = '2250585256740'; // CHANGE ÇA SI C'EST PAS TON NUMÉRO PRINCIPAL

        console.log('\nGénération du code pairing en cours...');
        const code = await sock.requestPairingCode(phoneNumber);

        console.log(`
╔════════════════════════════════════════════╗
║     ${BOT_NAME}     ║
║                                            ║
║   CODE PAIRING :   ${code.padEnd(12)}   ║
║                                            ║
║   WhatsApp → Appareils liés                ║
║   → Lier avec numéro de téléphone          ║
║   Entre ce code : ${code}                  ║
║                                            ║
║   Créé par ${CREATOR} • ${CREATOR_NUMBER} ║
╚════════════════════════════════════════════╝
        `);
      } catch (err) {
        console.error('Erreur pairing :', err.message);
        console.log('Essaie le QR ci-dessus ou relance le bot.');
      }
    }
  });

  // Messages entrants
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
        console.error(`Erreur commande ${cmdName} :`, err);
        await sock.sendMessage(msg.key.remoteJid, { text: `Erreur sur /${cmdName} 😓\nRéessaie ! ${THEME}` });
      }
    }
  });

  return sock;
}

// Démarrage
loadCommands();
connectBot().catch(err => console.error('Erreur démarrage bot :', err));
