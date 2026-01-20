module.exports = {
  name: 'menu',
  aliases: ['help', 'aide'],
  description: 'Affiche le menu',
  async execute(sock, msg) {
    const text = `
${BOT_NAME} ${THEME}
Créé par ${CREATOR} • ${CREATOR_NUMBER}

Commandes disponibles :
• /menu → Ce menu
• /meteo → Météo Abidjan 🇨🇮

Ajoute tes commandes dans le dossier /commands !

Vitesse & Luxe 🏎️👑✨
    `;
    await sock.sendMessage(msg.key.remoteJid, { text });
  }
};
