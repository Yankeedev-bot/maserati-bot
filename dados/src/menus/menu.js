/**
 * Menu Principal Prestige - Édition Maserati
 * Menu racine listant tous les sous-menus – style circuit luxe
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

export default async function menu(
  prefix,
  botName = "MaseratiBot",
  userName = "Pilote",
  {
    header = `╭┈⊰ 🏎️ 『 *${botName}* 』\n┊Salut, #user#! Prêt pour le circuit ?\n╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯`,
    menuTopBorder = "╭┈",
    bottomBorder = "╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯",
    menuTitleIcon = "🏁",
    menuItemIcon = "• 🔹",
    separatorIcon = "🔱",
    middleBorder = "┊"
  } = {}
) {
  const formattedHeader = header.replace(/#user#/g, userName);

  return `${formattedHeader}

\( {menuTopBorder} \){separatorIcon} *MENU PRINCIPAL MC20*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}menuia       → Intelligence Artificielle Prestige
\( {middleBorder} \){menuItemIcon}${prefix}menudown     → Téléchargements & Médias Luxe
\( {middleBorder} \){menuItemIcon}${prefix}menuadm      → Administration & Contrôle Paddock
\( {middleBorder} \){menuItemIcon}${prefix}menubn       → Blacklist & Anti-Toxic
\( {middleBorder} \){menuItemIcon}${prefix}menudono     → Commandes Propriétaire Trident
\( {middleBorder} \){menuItemIcon}${prefix}menumemb     → Outils Membres & Communauté
\( {middleBorder} \){menuItemIcon}${prefix}ferramentas  → Outils & Utilitaires Prestige
\( {middleBorder} \){menuItemIcon}${prefix}menufig      → Création Stickers & Figures
\( {middleBorder} \){menuItemIcon}${prefix}alteradores  → Effets Vidéo / Audio / Image V8
\( {middleBorder} \){menuItemIcon}${prefix}menurpg      → Système RPG & Quêtes
\( {middleBorder} \){menuItemIcon}${prefix}menuvip      → Avantages & Commandes VIP
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *INFOS RAPIDES*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}ping         → Vitesse du circuit
\( {middleBorder} \){menuItemIcon}${prefix}stats        → Tableau de bord bot
\( {middleBorder} \){menuItemIcon}${prefix}uptime       → Temps en piste
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *LÉGENDE*
${middleBorder}
${middleBorder}🔹 = Commande active
${middleBorder}🏁 = Accès rapide
${middleBorder}🔱 = Exclusivité Maserati
${bottomBorder}
`;
}
