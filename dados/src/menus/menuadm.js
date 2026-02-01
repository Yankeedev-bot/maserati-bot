/**
 * Menu d'Administration Prestige - Édition Maserati
 * Système de gestion premium pour administrateurs exclusifs
 * Contrôle total avec interface luxe Maserati 🏎️👑🔱✨🇨🇮
 * Créé par yankee Hells 🙂
 */

export default async function menuadm(prefix, botName = "maserati-bot", userName = "Administrateur", {
    header = `╭┈⊰ 🏎️ 『 *${botName}* 』\n┊Accès Administration, #user# !\n╰─┈┈┈┈┈◜👑◞┈┈┈┈┈─╯`,
    menuTopBorder = "╭┈",
    bottomBorder = "╰─┈┈┈┈┈◜👑◞┈┈┈┈┈─╯",
    menuTitleIcon = "✨🇨🇮▸",
    menuItemIcon = "•⚜️",
    separatorIcon = "🔱",
    middleBorder = "┊",
    adminMenuTitle = "🛡️ GESTION DES UTILISATEURS",
    managementMenuTitle = "💬 GESTION DU GROUPE",
    securityMenuTitle = "🔒 SÉCURITÉ",
    moderatorsMenuTitle = "👥 MODÉRATEURS",
    partnershipsMenuTitle = "🤝 PARTENARIATS",
    activationsMenuTitle = "⚡ ACTIVATIONS",
    settingsMenuTitle = "🎨 CONFIGURATIONS"
} = {}) {
    const formattedHeader = header.replace(/#user#/g, userName);
    return `${formattedHeader}

${menuTopBorder}${separatorIcon} *${adminMenuTitle}*
${middleBorder}
${middleBorder}${menuItemIcon} ${prefix}ban
${middleBorder}${menuItemIcon} ${prefix}ban2
${middleBorder}${menuItemIcon} ${prefix}bam (ban simulé)
${middleBorder}${menuItemIcon} ${prefix}setbammsg
${middleBorder}${menuItemIcon} ${prefix}promouvoir
${middleBorder}${menuItemIcon} ${prefix}rétrograder
${middleBorder}${menuItemIcon} ${prefix}mute
${middleBorder}${menuItemIcon} ${prefix}démute
${middleBorder}${menuItemIcon} ${prefix}mute2
${middleBorder}${menuItemIcon} ${prefix}démute2
${middleBorder}${menuItemIcon} ${prefix}avertissement
${middleBorder}${menuItemIcon} ${prefix}rmavertissement
${middleBorder}${menuItemIcon} ${prefix}listavertissements
${middleBorder}${menuItemIcon} ${prefix}nettoyerrang
${middleBorder}${menuItemIcon} ${prefix}resetrang
${middleBorder}${menuItemIcon} ${prefix}maintenircompteur
${middleBorder}${menuItemIcon} ${prefix}activité
${middleBorder}${menuItemIcon} ${prefix}vérifieractif
${bottomBorder}

${menuTopBorder}${separatorIcon} *🔒 CONTRÔLE D'ACCÈS*
${middleBorder}
${middleBorder}${menuItemIcon} ${prefix}bloquerutilisateur
${middleBorder}${menuItemIcon} ${prefix}débloquerutilisateur
${middleBorder}${menuItemIcon} ${prefix}listebloccagegp
${middleBorder}${menuItemIcon} ${prefix}ajouterlistenoire
${middleBorder}${menuItemIcon} ${prefix}supprimerlistenoire
${middleBorder}${menuItemIcon} ${prefix}listerlistenoire
${middleBorder}${menuItemIcon} ${prefix}bloccercmd
${middleBorder}${menuItemIcon} ${prefix}débloccercmd
${bottomBorder}

${menuTopBorder}${separatorIcon} *${managementMenuTitle}*
${middleBorder}
${middleBorder}${menuItemIcon} ${prefix}supprimer
${middleBorder}${menuItemIcon} ${prefix}nettoyer
${middleBorder}${menuItemIcon} ${prefix}marquer
${middleBorder}${menuItemIcon} ${prefix}marquercaché
${middleBorder}${menuItemIcon} ${prefix}tirage
${middleBorder}${menuItemIcon} ${prefix}nomegp
${middleBorder}${menuItemIcon} ${prefix}descgroupe
${middleBorder}${menuItemIcon} ${prefix}photogroupe
${middleBorder}${menuItemIcon} ${prefix}ajouterrègle
${middleBorder}${menuItemIcon} ${prefix}supprimerrègle
${middleBorder}${menuItemIcon} ${prefix}rôle.créer
${middleBorder}${menuItemIcon} ${prefix}rôle.modifier
${middleBorder}${menuItemIcon} ${prefix}rôle.supprimer
${bottomBorder}

${menuTopBorder}${separatorIcon} *⚙️ GROUPE & AUTORISATIONS*
${middleBorder}
${middleBorder}${menuItemIcon} ${prefix}liengp
${middleBorder}${menuItemIcon} ${prefix}groupe A/F
${middleBorder}${menuItemIcon} ${prefix}ouvrirgp HH:MM|off
${middleBorder}${menuItemIcon} ${prefix}fermergp HH:MM|off
${middleBorder}${menuItemIcon} ${prefix}automsg
${middleBorder}${menuItemIcon} ${prefix}banghost
${middleBorder}${menuItemIcon} ${prefix}limitermessage
${middleBorder}${menuItemIcon} ${prefix}supprimerlimitmessage
${middleBorder}
${middleBorder}${menuTitleIcon} *DEMANDES* ${menuTitleIcon}
${middleBorder}${menuItemIcon} ${prefix}demandes
${middleBorder}${menuItemIcon} ${prefix}approuver
${middleBorder}${menuItemIcon} ${prefix}approuver all
${middleBorder}${menuItemIcon} ${prefix}refuserdemande
${bottomBorder}

${menuTopBorder}${separatorIcon} *${moderatorsMenuTitle}*
${middleBorder}
${middleBorder}${menuItemIcon} ${prefix}ajoutermode
${middleBorder}${menuItemIcon} ${prefix}supprimermode
${middleBorder}${menuItemIcon} ${prefix}listemods
${middleBorder}${menuItemIcon} ${prefix}accorderpermmode
${middleBorder}${menuItemIcon} ${prefix}révokerpermmode
${middleBorder}${menuItemIcon} ${prefix}listecommandesmod
${bottomBorder}

${menuTopBorder}${separatorIcon} *🛡️ WHITELIST DES ANTI*
${middleBorder}
${middleBorder}${menuItemIcon} ${prefix}wladd
${middleBorder}${menuItemIcon} ${prefix}wl.supprimer
${middleBorder}${menuItemIcon} ${prefix}wl.liste
${bottomBorder}

${menuTopBorder}${separatorIcon} *${partnershipsMenuTitle}*
${middleBorder}
${middleBorder}${menuItemIcon} ${prefix}partenariats
${middleBorder}${menuItemIcon} ${prefix}ajouterpartenariat
${middleBorder}${menuItemIcon} ${prefix}supprimerpartenariat
${bottomBorder}

${menuTopBorder}${separatorIcon} *${securityMenuTitle} & PROTECTION*
${middleBorder}
${middleBorder}${menuItemIcon} ${prefix}antiflood
${middleBorder}${menuItemIcon} ${prefix}antidoc
${middleBorder}${menuItemIcon} ${prefix}antiloc
${middleBorder}${menuItemIcon} ${prefix}antifig
${middleBorder}${menuItemIcon} ${prefix}antibtn
${middleBorder}${menuItemIcon} ${prefix}antiliengp
${middleBorder}${menuItemIcon} ${prefix}antiliencanal
${middleBorder}${menuItemIcon} ${prefix}antilienhard
${middleBorder}${menuItemIcon} ${prefix}antiliensoft
${middleBorder}${menuItemIcon} ${prefix}antiporn
${middleBorder}${menuItemIcon} ${prefix}antistatus
${middleBorder}${menuItemIcon} ${prefix}antitoxique <on/off>
${middleBorder}${menuItemIcon} ${prefix}antitoxique config <action>
${middleBorder}${menuItemIcon} ${prefix}antitoxique sensibilité <0-100>
${middleBorder}${menuItemIcon} ${prefix}antimot <on/off/add/del/list>
${bottomBorder}

${menuTopBorder}${separatorIcon} *${settingsMenuTitle}*
${middleBorder}
${middleBorder}${menuItemIcon} ${prefix}légendesortie
${middleBorder}${menuItemIcon} ${prefix}légendebv
${middleBorder}${menuItemIcon} ${prefix}photobv
${middleBorder}${menuItemIcon} ${prefix}rmphotobv
${middleBorder}${menuItemIcon} ${prefix}photosortie
${middleBorder}${menuItemIcon} ${prefix}rmphotosortie
${middleBorder}${menuItemIcon} ${prefix}setprefix
${bottomBorder}

${menuTopBorder}${separatorIcon} *💬 RÉPONSES AUTOMATIQUES*
${middleBorder}
${middleBorder}${menuItemIcon} ${prefix}ajouterautoadm
${middleBorder}${menuItemIcon} ${prefix}ajouterautoadmidia
${middleBorder}${menuItemIcon} ${prefix}listerautoadm
${middleBorder}${menuItemIcon} ${prefix}supprimerautoadm
${middleBorder}${menuItemIcon} ${prefix}autoresponses
${middleBorder}${menuItemIcon} ${prefix}autorepo
${bottomBorder}

${menuTopBorder}${separatorIcon} *${activationsMenuTitle} & MODES*
${middleBorder}
${middleBorder}${menuItemIcon} ${prefix}autodl
${middleBorder}${menuItemIcon} ${prefix}minmessage
${middleBorder}${menuItemIcon} ${prefix}assistant
${middleBorder}${menuItemIcon} ${prefix}modobn
${middleBorder}${menuItemIcon} ${prefix}modepartenariat
${middleBorder}${menuItemIcon} ${prefix}moderpg
${middleBorder}${menuItemIcon} ${prefix}modelite
${middleBorder}${menuItemIcon} ${prefix}bienvenue
${middleBorder}${menuItemIcon} ${prefix)sortie
${middleBorder}${menuItemIcon} ${prefix)autocollant
${middleBorder}${menuItemIcon} ${prefix)soadm
${middleBorder}${menuItemIcon} ${prefix)limitecmd
${middleBorder}${menuItemIcon} ${prefix)photomenugroupe
${middleBorder}${menuItemIcon} ${prefix)nomegp
${middleBorder}${menuItemIcon} ${prefix)infoperso
${bottomBorder}

*Système d'administration exclusif conçu par yankee Hells* 🏎️👑🔱`;
}
