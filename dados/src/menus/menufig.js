/**
 * Menu Stickers Prestige - Édition Maserati
 * Création & gestion de figurinhas – style circuit luxe
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

export default async function menuSticker(
  prefix,
  botName = "MaseratiBot",
  userName = "Pilote",
  {
    header = `╭┈⊰ 🏎️ 『 *${botName}* 』\n┊Salut, #user#! Personnalise tes stickers trident.\n╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯`,
    menuTopBorder = "╭┈",
    bottomBorder = "╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯",
    menuTitleIcon = "🏁",
    menuItemIcon = "• 🔹",
    separatorIcon = "🔱",
    middleBorder = "┊",
    createStickerMenuTitle = "🎨 CRÉATION DE STICKERS MC20",
    managementMenuTitle = "⚙️ GARAGE & GESTION FIGURINHAS"
  } = {}
) {
  const formattedHeader = header.replace(/#user#/g, userName);

  return `${formattedHeader}

\( {menuTopBorder} \){separatorIcon} *${createStickerMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}emojimix        → Fusion d’emojis luxe
\( {middleBorder} \){menuItemIcon}${prefix}ttp            → Texte → Sticker prestige
\( {middleBorder} \){menuItemIcon}${prefix}attp           → Texte animé trident
\( {middleBorder} \){menuItemIcon}${prefix}sticker        → Créer sticker classique
\( {middleBorder} \){menuItemIcon}${prefix}sticker2       → Sticker version 2 (amélioré)
\( {middleBorder} \){menuItemIcon}${prefix}sbg            → Sticker sans fond
\( {middleBorder} \){menuItemIcon}${prefix}sfondo         → Sticker fond transparent
\( {middleBorder} \){menuItemIcon}${prefix}qc             → Quote circle prestige
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${managementMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}figualeatoria   → Sticker aléatoire du garage
\( {middleBorder} \){menuItemIcon}${prefix}figurinhas      → Liste stickers disponibles
\( {middleBorder} \){menuItemIcon}${prefix}rename         → Renommer sticker
\( {middleBorder} \){menuItemIcon}${prefix}rgtake         → Prendre sticker (right-click)
\( {middleBorder} \){menuItemIcon}${prefix}take           → Capturer sticker
\( {middleBorder} \){menuItemIcon}${prefix}toimg          → Sticker → Image HD
${bottomBorder}
`;
}