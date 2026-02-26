/**
 * Menu Top Commandes Prestige - Édition Maserati
 * Classement des commandes les plus utilisées – circuit des stats
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

export default async function menuTopCmd(
  prefix,
  botName = "MaseratiBot",
  userName = "Pilote",
  topCommands = [],
  {
    header = `╭┈⊰ 🏎️ 『 *${botName}* 』\n┊Salut, #user#! Voici le top circuit.\n╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯`,
    menuTopBorder = "╭┈",
    bottomBorder = "╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯",
    menuTitleIcon = "🏆",
    menuItemIcon = "• 🔹",
    separatorIcon = "🔱",
    middleBorder = "┊",
    topCommandsMenuTitle = "TOP COMMANDES CIRCUIT",
    infoSectionTitle = "INFOS & STATS"
  } = {}
) {
  const formattedHeader = header.replace(/#user#/g, userName);

  if (!topCommands || topCommands.length === 0) {
    return `${formattedHeader}

\( {menuTopBorder} \){separatorIcon} *${topCommandsMenuTitle}*
${middleBorder}
${middleBorder}Aucune commande n’a encore été utilisée sur le circuit.
${middleBorder}Utilise ${prefix}menu pour découvrir les commandes prestige !
${middleBorder}
${bottomBorder}
`;
  }

  const commandsList = topCommands.map((cmd, index) => {
    const position = index + 1;
    const emoji = position <= 3 ? ['🥇', '🥈', '🥉'][index] : '🏅';
    return `\( {middleBorder} \){emoji} \( {position}ᵉ : * \){prefix}${cmd.name}*
${middleBorder}   ↳ ${cmd.count} utilisations par ${cmd.uniqueUsers} pilotes`;
  }).join('\n');

  return `
${formattedHeader}

\( {menuTopBorder} \){separatorIcon} *TOP ${topCommands.length} COMMANDES DU CIRCUIT*
${commandsList}
${middleBorder}
\( {middleBorder}╭─▸ * \){infoSectionTitle} :*
${middleBorder}
${middleBorder}🔍 Utilise ${prefix}cmdinfo [commande]
${middleBorder}   ↳ Pour voir stats détaillées
${middleBorder}   ↳ Exemple : ${prefix}cmdinfo menu
${middleBorder}
${bottomBorder}
`;
}