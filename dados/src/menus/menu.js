/**
 * Menu Principal Prestige - Édition Maserati
 * Interface exclusive de commandes du bot maserati-bot
 * Design luxe avec thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

export default async function menu(prefix, botName = "maserati-bot", userName = "Client", {
    header = `╭┈⊰ 🏎️ 『 *${botName}* 』\n┊Bienvenue, #user# !\n╰─┈┈┈┈┈◜👑◞┈┈┈┈┈─╯`,
    menuTopBorder = "╭┈",
    bottomBorder = "╰─┈┈┈┈┈◜👑◞┈┈┈┈┈─╯",
    menuTitleIcon = "✨🇨🇮▸",
    menuItemIcon = "•⚜️",
    separatorIcon = "🏎️",
    middleBorder = "┊"
} = {}) {
    const formattedHeader = header.replace(/#user#/g, userName);
    return `${formattedHeader}

${menuTopBorder}${separatorIcon} *MENU PRESTIGE*
${middleBorder}
${middleBorder}${menuItemIcon} ${prefix}menuia
${middleBorder}${menuItemIcon} ${prefix}menudown
${middleBorder}${menuItemIcon} ${prefix}menuadm
${middleBorder}${menuItemIcon} ${prefix}menubn
${middleBorder}${menuItemIcon} ${prefix}menudono
${middleBorder}${menuItemIcon} ${prefix}menumemb
${middleBorder}${menuItemIcon} ${prefix}ferramentas
${middleBorder}${menuItemIcon} ${prefix}menufig
${middleBorder}${menuItemIcon} ${prefix}alteradores
${middleBorder}${menuItemIcon} ${prefix}menurpg
${middleBorder}${menuItemIcon} ${prefix}menuvip
${bottomBorder}

*Ingénierie par yankee Hells* 🏎️👑`;
    }
