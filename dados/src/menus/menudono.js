/**
 * Menu Propriétaire Prestige - Édition Maserati
 * Contrôle total du bot – garage suprême & commandes exclusives
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

export default async function menuDono(
  prefix,
  botName = "MaseratiBot",
  userName = "Propriétaire",
  {
    header = `╭┈⊰ 🏎️ 『 *${botName}* 』\n┊Salut, #user#! Garage suprême – Trident activé.\n╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯`,
    menuTopBorder = "╭┈",
    bottomBorder = "╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯",
    menuTitleIcon = "🏆",
    menuItemIcon = "• 🔹",
    separatorIcon = "🔱",
    middleBorder = "┊",
    botConfigMenuTitle = "🤖 CONFIGURATIONS DU BOLIDE",
    menuDesignMenuTitle = "🎨 DESIGN & CARROSSERIE",
    automationMenuTitle = "⚙️ SYSTÈME & AUTOMATISATION",
    commandCustomMenuTitle = "🛠️ PERSONNALISATION COMMANDS",
    commandLimitingMenuTitle = "🚦 LIMITATION & CONTRÔLE",
    userManagementMenuTitle = "👥 GESTION PILOTES & ACCÈS",
    rentalSystemMenuTitle = "💰 SYSTÈME DE LOCATION MC20",
    subBotsMenuTitle = "🤖 FLOTTE DE SUB-BOTS",
    vipSystemMenuTitle = "💎 CLUB VIP & PREMIUM",
    botControlMenuTitle = "⚡ CONTRÔLE & MAINTENANCE",
    monitoringMenuTitle = "📊 TABLEAU DE BORD & ANALYSE",
    broadcastMenuTitle = "📡 DIFFUSION & TRANSMISSION"
  } = {}
) {
  const formattedHeader = header.replace(/#user#/g, userName);

  return `${formattedHeader}

\( {menuTopBorder} \){separatorIcon} *📚 TABLEAU DE BORD INITIAL*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}tutorial        → Guide du propriétaire
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${botConfigMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}prefixo         → Changer préfixe
\( {middleBorder} \){menuItemIcon}${prefix}numerodono      → Numéro proprio
\( {middleBorder} \){menuItemIcon}${prefix}nomedono        → Nom proprio
\( {middleBorder} \){menuItemIcon}${prefix}nomebot         → Nom du bolide
\( {middleBorder} \){menuItemIcon}${prefix}configcmdnotfound → Message commande inconnue
\( {middleBorder} \){menuItemIcon}${prefix}setcmdmsg       → Message commande custom
\( {middleBorder} \){menuItemIcon}${prefix}fotobot         → Photo profil bot
\( {middleBorder} \){menuItemIcon}${prefix}fotomenu        → Photo menu principal
\( {middleBorder} \){menuItemIcon}${prefix}videomenu       → Vidéo menu
\( {middleBorder} \){menuItemIcon}${prefix}audiomenu       → Audio menu
\( {middleBorder} \){menuItemIcon}${prefix}lermais         → Texte "lire plus"
\( {middleBorder} \){menuItemIcon}${prefix}personalizargrupo → Personnaliser groupe
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${menuDesignMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}designmenu      → Design global menu
\( {middleBorder} \){menuItemIcon}${prefix}setborda        → Bordure supérieure
\( {middleBorder} \){menuItemIcon}${prefix}setbordafim     → Bordure inférieure
\( {middleBorder} \){menuItemIcon}${prefix}setbordameio    → Bordure centrale
\( {middleBorder} \){menuItemIcon}${prefix}setitem         → Icône élément
\( {middleBorder} \){menuItemIcon}${prefix}setseparador    → Séparateur
\( {middleBorder} \){menuItemIcon}${prefix}settitulo       → Icône titre
\( {middleBorder} \){menuItemIcon}${prefix}setheader       → En-tête personnalisé
\( {middleBorder} \){menuItemIcon}${prefix}resetdesign     → Reset design
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${automationMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}addauto         → Ajouter auto-réponse
\( {middleBorder} \){menuItemIcon}${prefix}addautomidia    → Auto-réponse média
\( {middleBorder} \){menuItemIcon}${prefix}listauto        → Liste auto-réponses
\( {middleBorder} \){menuItemIcon}${prefix}delauto         → Supprimer auto-réponse
\( {middleBorder} \){menuItemIcon}${prefix}addreact        → Ajouter réaction auto
\( {middleBorder} \){menuItemIcon}${prefix}listreact       → Liste réactions
\( {middleBorder} \){menuItemIcon}${prefix}delreact        → Supprimer réaction
\( {middleBorder} \){menuItemIcon}${prefix}addnopref       → Commande sans prefix
\( {middleBorder} \){menuItemIcon}${prefix}listnopref      → Liste sans prefix
\( {middleBorder} \){menuItemIcon}${prefix}delnopref       → Supprimer sans prefix
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${commandCustomMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}addcmd          → Ajouter commande custom
\( {middleBorder} \){menuItemIcon}${prefix}addcmdmidia     → Commande custom média
\( {middleBorder} \){menuItemIcon}${prefix}listcmd         → Liste commandes custom
\( {middleBorder} \){menuItemIcon}${prefix}delcmd          → Supprimer commande
\( {middleBorder} \){menuItemIcon}${prefix}testcmd         → Tester commande
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}addalias        → Ajouter alias
\( {middleBorder} \){menuItemIcon}${prefix}listalias       → Liste alias
\( {middleBorder} \){menuItemIcon}${prefix}delalias        → Supprimer alias
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}addblackglobal  → Blacklist globale
\( {middleBorder} \){menuItemIcon}${prefix}listblackglobal → Liste blacklist globale
\( {middleBorder} \){menuItemIcon}${prefix}rmblackglobal   → Retirer blacklist globale
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${commandLimitingMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}cmdlimitar      → Limiter commande
\( {middleBorder} \){menuItemIcon}${prefix}cmddeslimitar   → Retirer limite
\( {middleBorder} \){menuItemIcon}${prefix}cmdlimites      → Liste limites
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${userManagementMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}addsubdono      → Ajouter sous-propriétaire
\( {middleBorder} \){menuItemIcon}${prefix}delsubdono      → Retirer sous-propriétaire
\( {middleBorder} \){menuItemIcon}${prefix}listasubdonos   → Liste sous-propriétaires
\( {middleBorder} \){menuItemIcon}${prefix}addpremium      → Ajouter premium
\( {middleBorder} \){menuItemIcon}${prefix}delpremium      → Retirer premium
\( {middleBorder} \){menuItemIcon}${prefix}listprem        → Liste premium
\( {middleBorder} \){menuItemIcon}${prefix}resetgold       → Reset gold utilisateur
${middleBorder}
\( {middleBorder} \){menuTitleIcon} *INDICATIONS* ${menuTitleIcon}
\( {middleBorder} \){menuItemIcon}${prefix}addindicacao    → Ajouter indication
\( {middleBorder} \){menuItemIcon}${prefix}topindica       → Top indicateurs
\( {middleBorder} \){menuItemIcon}${prefix}delindicacao    → Supprimer indication
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}bangp           → Ban global pilote
\( {middleBorder} \){menuItemIcon}${prefix}unbangp         → Déban global
\( {middleBorder} \){menuItemIcon}${prefix}listbangp       → Liste bans globaux
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${rentalSystemMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}modoaluguel     → Activer mode location
\( {middleBorder} \){menuItemIcon}${prefix}addaluguel      → Ajouter location
\( {middleBorder} \){menuItemIcon}${prefix}gerarcod        → Générer code location
\( {middleBorder} \){menuItemIcon}${prefix}listaraluguel   → Liste locations
\( {middleBorder} \){menuItemIcon}${prefix}infoaluguel     → Infos location
\( {middleBorder} \){menuItemIcon}${prefix}estenderaluguel → Prolonger location
\( {middleBorder} \){menuItemIcon}${prefix}removeraluguel  → Supprimer location
\( {middleBorder} \){menuItemIcon}${prefix}listaluguel     → Liste active
\( {middleBorder} \){menuItemIcon}${prefix}limparaluguel   → Nettoyer locations
\( {middleBorder} \){menuItemIcon}${prefix}dayfree         → Jours gratuits
\( {middleBorder} \){menuItemIcon}${prefix}setdiv          → Message pub location
\( {middleBorder} \){menuItemIcon}${prefix}divulgar        → Diffuser pub
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${subBotsMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}addsubbot       → Ajouter sub-bot
\( {middleBorder} \){menuItemIcon}${prefix}removesubbot    → Retirer sub-bot
\( {middleBorder} \){menuItemIcon}${prefix}listarsubbots   → Liste sub-bots
\( {middleBorder} \){menuItemIcon}${prefix}conectarsubbot  → Connecter sub-bot
${middleBorder}
${middleBorder}🔑 Code sub-bot : ${prefix}gerarcodigo
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${vipSystemMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}addcmdvip       → Ajouter commande VIP
\( {middleBorder} \){menuItemIcon}${prefix}removecmdvip    → Retirer commande VIP
\( {middleBorder} \){menuItemIcon}${prefix}listcmdvip      → Liste commandes VIP
\( {middleBorder} \){menuItemIcon}${prefix}togglecmdvip    → Activer/Désactiver VIP
\( {middleBorder} \){menuItemIcon}${prefix}statsvip        → Stats VIP
\( {middleBorder} \){menuItemIcon}${prefix}menuvip         → Menu VIP
\( {middleBorder} \){menuItemIcon}${prefix}infovip         → Infos VIP
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${botControlMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}atualizar       → Mettre à jour bot
\( {middleBorder} \){menuItemIcon}${prefix}reiniciar       → Redémarrer moteur
\( {middleBorder} \){menuItemIcon}${prefix}entrar          → Rejoindre groupe
\( {middleBorder} \){menuItemIcon}${prefix}sairgp          → Quitter groupe
\( {middleBorder} \){menuItemIcon}${prefix}seradm          → Devenir admin
\( {middleBorder} \){menuItemIcon}${prefix}sermembre       → Devenir membre
\( {middleBorder} \){menuItemIcon}${prefix}blockcmdg       → Bloquer commande globale
\( {middleBorder} \){menuItemIcon}${prefix}unblockcmdg     → Débloquer globale
\( {middleBorder} \){menuItemIcon}${prefix}blockuserg      → Bloquer utilisateur global
\( {middleBorder} \){menuItemIcon}${prefix}unblockuserg    → Débloquer global
\( {middleBorder} \){menuItemIcon}${prefix}listblocks      → Liste blocs globaux
\( {middleBorder} \){menuItemIcon}${prefix}antibanmarcar   → Anti-ban marquage
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${monitoringMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}listagp         → Liste groupes
\( {middleBorder} \){menuItemIcon}${prefix}antipv          → Anti-PV niveau 1
\( {middleBorder} \){menuItemIcon}${prefix}antipv2         → Anti-PV niveau 2
\( {middleBorder} \){menuItemIcon}${prefix}antipv3         → Anti-PV niveau 3
\( {middleBorder} \){menuItemIcon}${prefix}antipv4         → Anti-PV niveau 4
\( {middleBorder} \){menuItemIcon}${prefix}antipvmsg       → Message anti-PV
\( {middleBorder} \){menuItemIcon}${prefix}antispamcmd     → Anti-spam commandes
\( {middleBorder} \){menuItemIcon}${prefix}viewmsg         → Voir messages
\( {middleBorder} \){menuItemIcon}${prefix}cases           → Statistiques cases
\( {middleBorder} \){menuItemIcon}${prefix}getcase         → Infos case
\( {middleBorder} \){menuItemIcon}${prefix}modoliteglobal  → Mode lite global
\( {middleBorder} \){menuItemIcon}${prefix}iaclear         → Nettoyer IA
\( {middleBorder} \){menuItemIcon}${prefix}limpardb        → Nettoyer base de données
\( {middleBorder} \){menuItemIcon}${prefix}limparrankg     → Reset rank global
\( {middleBorder} \){menuItemIcon}${prefix}reviverqr       → Relancer QR
\( {middleBorder} \){menuItemIcon}${prefix}nuke            → Destruction complète
\( {middleBorder} \){menuItemIcon}${prefix}msgprefix       → Message préfixe
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${broadcastMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuTitleIcon} *Diffusion Groupes:*
\( {middleBorder} \){menuItemIcon}${prefix}tm               → Transmission groupes
${middleBorder}
\( {middleBorder} \){menuTitleIcon} *Diffusion Privée:*
\( {middleBorder} \){menuItemIcon}${prefix}tm2              → Transmission PV
\( {middleBorder} \){menuItemIcon}${prefix}statustm         → Statut diffusion
${middleBorder}
${middleBorder}📝 Inscription utilisateurs :
${middleBorder}   ${prefix}inscrevertm (en privé)
${middleBorder}
\( {middleBorder} \){menuTitleIcon} *Diffusion Proprio (nouveau):*
\( {middleBorder} \){menuItemIcon}${prefix}divdono add      → Ajouter message
\( {middleBorder} \){menuItemIcon}${prefix}divdono rem      → Supprimer
\( {middleBorder} \){menuItemIcon}${prefix}divdono list     → Liste
\( {middleBorder} \){menuItemIcon}${prefix}divdono msg      → Modifier texte
\( {middleBorder} \){menuItemIcon}${prefix}divdono send     → Envoyer maintenant
\( {middleBorder} \){menuItemIcon}${prefix}divdono time     → Programmer
\( {middleBorder} \){menuItemIcon}${prefix}divdono status   → État diffusion
${bottomBorder}
`;
}