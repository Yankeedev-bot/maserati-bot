/**
 * Menu Téléchargements Prestige - Édition Maserati
 * Recherches, musiques, vidéos & médias sociaux – style circuit luxe
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

export default async function menudown(
  prefix,
  botName = "MaseratiBot",
  userName = "Pilote",
  {
    header = `╭┈⊰ 🏎️ 『 *${botName}* 』\n┊Salut, #user#! Télécharge en mode MC20.\n╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯`,
    menuTopBorder = "╭┈",
    bottomBorder = "╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯",
    menuTitleIcon = "🏁",
    menuItemIcon = "• 🔹",
    separatorIcon = "🔱",
    middleBorder = "┊",
    searchMenuTitle = "🔍 RECHERCHES & CONSULTATIONS LUXE",
    audioMenuTitle = "🎵 AUDIO & VIBES V8",
    videoMenuTitle = "🎬 VIDÉOS & STREAMING PRESTIGE",
    downloadMenuTitle = "📥 TÉLÉCHARGEMENTS ULTRA-RAPIDES",
    mediaMenuTitle = "📱 MÉDIAS SOCIAUX & PLATFORMS",
    gamesMenuTitle = "🎮 GAMING & APPLICATIONS"
  } = {}
) {
  const formattedHeader = header.replace(/#user#/g, userName);

  return `${formattedHeader}

\( {menuTopBorder} \){separatorIcon} *${searchMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}google          → Recherche web instantanée
\( {middleBorder} \){menuItemIcon}${prefix}noticias        → Actu en temps réel
\( {middleBorder} \){menuItemIcon}${prefix}apps            → Recherche applications
\( {middleBorder} \){menuItemIcon}${prefix}dicionario      → Définition prestige
\( {middleBorder} \){menuItemIcon}${prefix}wikipedia       → Encyclopédie MC20
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${audioMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}letra           → Paroles de chanson
\( {middleBorder} \){menuItemIcon}${prefix}play            → Jouer musique
\( {middleBorder} \){menuItemIcon}${prefix}play2           → Jouer version 2
\( {middleBorder} \){menuItemIcon}${prefix}spotify         → Recherche Spotify
\( {middleBorder} \){menuItemIcon}${prefix}soundcloud      → Sons SoundCloud
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${videoMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}playvid         → Jouer vidéo
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${downloadMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}tiktok          → Vidéo TikTok HD
\( {middleBorder} \){menuItemIcon}${prefix}instagram       → Post / Reels / Story IG
\( {middleBorder} \){menuItemIcon}${prefix}igstory         → Stories Instagram
\( {middleBorder} \){menuItemIcon}${prefix}facebook        → Vidéo / Post FB
\( {middleBorder} \){menuItemIcon}${prefix}gdrive          → Télécharger Google Drive
\( {middleBorder} \){menuItemIcon}${prefix}mediafire       → Lien MediaFire direct
\( {middleBorder} \){menuItemIcon}${prefix}twitter         → Vidéo / Post X (Twitter)
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${mediaMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}pinterest       → Images / Pins HD
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${gamesMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}mcplugin        → Plugins Minecraft prestige
${bottomBorder}
`;
}