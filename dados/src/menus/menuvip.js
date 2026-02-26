/**
 * Menu VIP Prestige - Édition Maserati
 * Commandes exclusives, stats & avantages – club trident ultra-sélect
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import { groupVipCommandsByCategory, getVipStats } from '../utils/vipCommandsManager.js';

/**
 * Menu VIP principal – liste dynamique des commandes exclusives
 */
async function menuVIP(
  prefix,
  botName = "MaseratiBot",
  userName = "Pilote",
  {
    header = `╭┈⊰ 🏎️ 『 *${botName}* 』\n┊Salut, #user#! Bienvenue au club VIP.\n╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯`,
    menuTopBorder = "╭┈",
    bottomBorder = "╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯",
    menuItemIcon = "• 🔹",
    separatorIcon = "🔱",
    middleBorder = "┊"
  } = {}
) {
  try {
    const grouped = groupVipCommandsByCategory();
    const stats = getVipStats();
    const formattedHeader = header.replace(/#user#/g, userName);

    let menu = `${formattedHeader}

`;

    if (stats.active === 0) {
      menu += `\( {menuTopBorder} \){separatorIcon} *👑 COMANDES VIP EXCLUSIVES*
${middleBorder}
${middleBorder}📭 Aucun privilège enregistré pour le moment
${middleBorder}
${middleBorder}💡 Le Propriétaire peut ajouter :
\( {middleBorder} \){menuItemIcon}${prefix}addcmdvip
${bottomBorder}
`;
      return menu;
    }

    menu += `\( {menuTopBorder} \){separatorIcon} *CLUB VIP – COMMANDES EXCLUSIVES*
${middleBorder}
${middleBorder}Total commandes VIP : ${stats.active}
${middleBorder}Catégories débloquées : ${stats.categories}
${bottomBorder}

`;

    Object.entries(grouped).forEach(([categoryKey, categoryData]) => {
      menu += `\( {menuTopBorder} \){separatorIcon} *${categoryData.label}*
${middleBorder}\n`;
      categoryData.commands.forEach((cmd) => {
        menu += `\( {middleBorder} \){menuItemIcon}\( {prefix} \){cmd.command}\n`;
      });
      menu += `${bottomBorder}\n\n`;
    });

    menu += `\( {menuTopBorder} \){separatorIcon} *ℹ️ STATUT VIP*
${middleBorder}
${middleBorder}• Commandes actives : ${stats.active}
${middleBorder}• Catégories : ${stats.categories}
${middleBorder}• ${prefix}infovip     → Détails & avantages
${middleBorder}• ${prefix}dono        → Contact propriétaire
${bottomBorder}
`;

    return menu;
  } catch (error) {
    console.error('[Maserati-VIP] Erreur génération menu VIP :', error);
    return `❌ Erreur garage VIP – contacte le paddock.`;
  }
}

/**
 * Infos détaillées sur le statut VIP
 */
async function menuVIPInfo(
  prefix,
  botName = "MaseratiBot",
  userName = "Pilote",
  {
    header = `╭┈⊰ 🏎️ 『 *${botName}* 』\n┊Salut, #user#! Ton pass VIP.\n╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯`,
    menuTopBorder = "╭┈",
    bottomBorder = "╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯",
    separatorIcon = "🔱",
    middleBorder = "┊"
  } = {}
) {
  const stats = getVipStats();
  const formattedHeader = header.replace(/#user#/g, userName);

  let info = `${formattedHeader}

\( {menuTopBorder} \){separatorIcon} *📊 TABLEAU DE BORD VIP*
${middleBorder}
${middleBorder}• Commandes actives : ${stats.active}
${middleBorder}• Commandes inactives : ${stats.inactive}
${middleBorder}• Total enregistrées : ${stats.total}
${middleBorder}• Catégories débloquées : ${stats.categories}
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *💎 COMMENT ACCÉDER AU CLUB VIP*
${middleBorder}
${middleBorder}1. Contacte le Propriétaire
${middleBorder}2. ${prefix}dono
${middleBorder}3. Demande ton pass VIP
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *✨ AVANTAGES EXCLUSIFS*
${middleBorder}
${middleBorder}✅ Commandes réservées au club
${middleBorder}✅ Aucune limite d’utilisation
${middleBorder}✅ Priorité absolue
${middleBorder}✅ Support dédié trident
${bottomBorder}
`;

  return info;
}

/**
 * Liste complète et détaillée de toutes les commandes VIP
 */
async function listVIPCommands(
  prefix,
  botName = "MaseratiBot",
  userName = "Pilote",
  {
    header = `╭┈⊰ 🏎️ 『 *${botName}* 』\n┊Salut, #user#! Liste VIP complète.\n╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯`,
    menuTopBorder = "╭┈",
    bottomBorder = "╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯",
    menuItemIcon = "• 🔹",
    separatorIcon = "🔱",
    middleBorder = "┊"
  } = {}
) {
  const grouped = groupVipCommandsByCategory();
  const stats = getVipStats();
  const formattedHeader = header.replace(/#user#/g, userName);

  if (stats.active === 0) {
    return `📭 Aucun privilège VIP enregistré pour le moment.

${prefix}addcmdvip <cmd> | <description> | <catégorie>

Catégories possibles : download, fun, utilitaire, ia, edition, info, autres`;
  }

  let list = `${formattedHeader}

\( {menuTopBorder} \){separatorIcon} *👑 COMMANDES VIP – CLUB TRIDENT*
${middleBorder}
${middleBorder}Total : ${stats.active}
${middleBorder}Catégories : ${stats.categories}
${bottomBorder}

`;

  Object.entries(grouped).forEach(([categoryKey, categoryData]) => {
    list += `\( {menuTopBorder} \){separatorIcon} *${categoryData.label}*
${middleBorder}\n`;
    categoryData.commands.forEach((cmd) => {
      list += `\( {middleBorder} \){menuItemIcon}\( {prefix} \){cmd.command}\n`;
      list += `${middleBorder}   └─ ${cmd.description}\n`;
    });
    list += `${bottomBorder}\n\n`;
  });

  return list;
}

export {
  menuVIP,
  menuVIPInfo,
  listVIPCommands
};