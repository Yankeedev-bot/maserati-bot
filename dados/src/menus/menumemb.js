/**
 * Menu Membres Prestige - Édition Maserati
 * Fonctionnalités pour pilotes & communauté – style circuit luxe
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

export default async function menuMembros(
  prefix,
  botName = "MaseratiBot",
  userName = "Pilote",
  {
    header = `╭┈⊰ 🏎️ 『 *${botName}* 』\n┊Salut, #user#! Bienvenue dans le paddock.\n╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯`,
    menuTopBorder = "╭┈",
    bottomBorder = "╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯",
    menuTitleIcon = "🏁",
    menuItemIcon = "• 🔹",
    separatorIcon = "🔱",
    middleBorder = "┊",
    perfilMenuTitle = "👤 PROFIL & STATISTIQUES PILOTE",
    botStatusMenuTitle = "🤖 INFOS & STATUT DU BOLIDE",
    personalMenuTitle = "⚙️ CONFIGURATIONS PERSONNELLES",
    rankMenuTitle = "🏆 CLASSEMENTS & GAMIFICATION",
    gamingMenuTitle = "🎮 ZONE GAMER & FREE FIRE"
  } = {}
) {
  const formattedHeader = header.replace(/#user#/g, userName);

  return `${formattedHeader}

\( {menuTopBorder} \){separatorIcon} *${perfilMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}profil          → Ton profil prestige
\( {middleBorder} \){menuItemIcon}${prefix}meustatus       → Tes stats en piste
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${botStatusMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}ping            → Vitesse du moteur
\( {middleBorder} \){menuItemIcon}${prefix}statusbot       → État du bolide
\( {middleBorder} \){menuItemIcon}${prefix}statusgp        → Infos groupe
\( {middleBorder} \){menuItemIcon}${prefix}regras          → Règlement paddock
\( {middleBorder} \){menuItemIcon}${prefix}zipbot          → Archive bot
\( {middleBorder} \){menuItemIcon}${prefix}gitbot          → Repo GitHub
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${personalMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}mention         → Mention custom
\( {middleBorder} \){menuItemIcon}${prefix}afk             → Mode absent
\( {middleBorder} \){menuItemIcon}${prefix}voltei          → Retour au circuit
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *👬 INTERACTION COMMUNAUTÉ*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}roles           → Liste rôles disponibles
\( {middleBorder} \){menuItemIcon}${prefix}role.vou        → Je participe
\( {middleBorder} \){menuItemIcon}${prefix}role.nvou       → Je ne participe pas
\( {middleBorder} \){menuItemIcon}${prefix}role.confirmes  → Participants confirmés
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${rankMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}rankactif       → Top pilotes actifs
\( {middleBorder} \){menuItemIcon}${prefix}rankinactif     → Top inactifs
\( {middleBorder} \){menuItemIcon}${prefix}rankactifs      → Classement activité
\( {middleBorder} \){menuItemIcon}${prefix}activite        → Ton activité
\( {middleBorder} \){menuItemIcon}${prefix}checkactif      → Vérifier activité
\( {middleBorder} \){menuItemIcon}${prefix}totalcmd        → Total commandes
\( {middleBorder} \){menuItemIcon}${prefix}topcmd          → Top commandes utilisées
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *🏆 CONQUÊTES & CAISSES*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}conquetes       → Tes trophées prestige
\( {middleBorder} \){menuItemIcon}${prefix}caisse quotidienne → Caisse journalière
\( {middleBorder} \){menuItemIcon}${prefix}caisse rare     → Caisse rare
\( {middleBorder} \){menuItemIcon}${prefix}caisse legendaire → Caisse légendaire
\( {middleBorder} \){menuItemIcon}${prefix}cadeau @pilote <type> → Offrir caisse
\( {middleBorder} \){menuItemIcon}${prefix}inventaire      → Ton coffre
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *⭐ RÉPUTATION & SIGNALEMENTS*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}rep + @pilote   → + Réputation
\( {middleBorder} \){menuItemIcon}${prefix}rep - @pilote   → - Réputation
\( {middleBorder} \){menuItemIcon}${prefix}rep @pilote     → Voir réputation
\( {middleBorder} \){menuItemIcon}${prefix}toprep          → Top réputation
\( {middleBorder} \){menuItemIcon}${prefix}denoncer @pilote <motif> → Signaler pilote
\( {middleBorder} \){menuItemIcon}${prefix}denonciations   → Liste signalements
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${gamingMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}likefreefire    → Like Free Fire
\( {middleBorder} \){menuItemIcon}${prefix}infofreefire    → Infos Free Fire
${bottomBorder}
`;
}