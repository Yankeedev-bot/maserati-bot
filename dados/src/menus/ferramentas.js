/**
 * Menu Outils Prestige - Édition Maserati
 * Menu des fonctionnalités utilitaires – style circuit luxe
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

export default async function menuFerramentas(
  prefix,
  botName = "MaseratiBot",
  userName = "Pilote",
  {
    header = `╭┈⊰ 🏎️ 『 *${botName}* 』\n┊Salut, #user#! Bienvenue au paddock.\n╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯`,
    menuTopBorder = "╭┈",
    bottomBorder = "╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯",
    menuTitleIcon = "🏁",
    menuItemIcon = "• 🔹",
    separatorIcon = "🔱",
    middleBorder = "┊",
    nicknameMenuTitle = "📱 GÉNÉRATEUR D’IDENTITÉ & PSEUDO",
    captureMenuTitle = "📸 CAPTURES & ANALYSE VISUELLE",
    linkMenuTitle = "🌐 LIENS & TRANSFERTS PRESTIGE",
    securityMenuTitle = "🔒 SÉCURITÉ & VÉRIFICATION",
    timeMenuTitle = "🕰️ TEMPS & MÉTÉO MONDIALE",
    languageMenuTitle = "📚 TRADUCTION & DICTIONNAIRE",
    reminderMenuTitle = "⏰ AGENDA & RAPPELS PERSONNELS"
  } = {}
) {
  const formattedHeader = header.replace(/#user#/g, userName);

  return `${formattedHeader}

\( {menuTopBorder} \){separatorIcon} *${nicknameMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}gerarnick – Pseudo prestige instantané
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${captureMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}ssweb <url> – Capture d’écran site
\( {middleBorder} \){menuItemIcon}${prefix}qrcode <texte> – Générer QR luxe
\( {middleBorder} \){menuItemIcon}${prefix}lerqr – Scanner QR (réponds image)
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *🧮 CALCULATRICE MC20*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}calc <expression> – Calcul rapide
\( {middleBorder} \){menuItemIcon}${prefix}calc converter <valeur> <de> <vers> – Conversion unités
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *📝 CARNET DE BORD PERSONNEL*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}nota add <texte> – Nouvelle note
\( {middleBorder} \){menuItemIcon}${prefix}notas – Liste carnet
\( {middleBorder} \){menuItemIcon}${prefix}nota ver <id> – Lire note
\( {middleBorder} \){menuItemIcon}${prefix}nota del <id> – Supprimer
\( {middleBorder} \){menuItemIcon}${prefix}nota fixar <id> – Épingler
\( {middleBorder} \){menuItemIcon}${prefix}nota buscar <terme> – Recherche
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${linkMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}encurtalink <url> – Raccourcir lien
\( {middleBorder} \){menuItemIcon}${prefix}upload – Envoi fichier prestige
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${securityMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}verificar <lien> – Analyse sécurité
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${timeMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}hora <ville/pays> – Heure mondiale
\( {middleBorder} \){menuItemIcon}${prefix}clima <ville> – Météo actuelle
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${languageMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}dicionario <mot> – Définition
\( {middleBorder} \){menuItemIcon}${prefix}tradutor <texte> – Traduction instantanée
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${reminderMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}lembrete <texte> <date/heure> – Créer rappel
\( {middleBorder} \){menuItemIcon}${prefix}meuslembretes – Liste rappels
\( {middleBorder} \){menuItemIcon}${prefix}apagalembrete <id> – Supprimer
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *AUTRES FONCTIONNALITÉS LUXE* ${menuTitleIcon}
\( {middleBorder} \){menuItemIcon}${prefix}aniversario – Gestion anniversaires
\( {middleBorder} \){menuItemIcon}${prefix}estatisticas – Stats bot & usage
${bottomBorder}
`;
    }
