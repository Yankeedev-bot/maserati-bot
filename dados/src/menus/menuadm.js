/**
 * Menu Administration Prestige - Édition Maserati
 * Menu complet de gestion & sécurité – style circuit luxe
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

export default async function menuadm(
  prefix,
  botName = "MaseratiBot",
  userName = "Pilote",
  {
    header = `╭┈⊰ 🏎️ 『 *${botName}* 』\n┊Salut, #user#! Contrôle total du paddock.\n╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯`,
    menuTopBorder = "╭┈",
    bottomBorder = "╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯",
    menuTitleIcon = "🏁",
    menuItemIcon = "• 🔹",
    separatorIcon = "🔱",
    middleBorder = "┊",
    adminMenuTitle = "🛡️ CONTRÔLE PILOTES & SANCTIONS",
    managementMenuTitle = "💬 GESTION DU CIRCUIT",
    securityMenuTitle = "🔒 SÉCURITÉ TRIDENT",
    moderatorsMenuTitle = "👥 ÉQUIPE MODÉRATION",
    partnershipsMenuTitle = "🤝 PARTENARIATS OFFICIELS",
    activationsMenuTitle = "⚡ ACTIVATIONS & MODES",
    settingsMenuTitle = "🎨 CONFIGURATIONS GLOBALES"
  } = {}
) {
  const formattedHeader = header.replace(/#user#/g, userName);

  return `${formattedHeader}

\( {menuTopBorder} \){separatorIcon} *${adminMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}ban           → Bannir pilote
\( {middleBorder} \){menuItemIcon}${prefix}ban2          → Bannissement renforcé
\( {middleBorder} \){menuItemIcon}${prefix}bam           → Ban anti-fake
\( {middleBorder} \){menuItemIcon}${prefix}setbammsg     → Message ban custom
\( {middleBorder} \){menuItemIcon}${prefix}promouvoir    → Promouvoir admin
\( {middleBorder} \){menuItemIcon}${prefix}rebaixar      → Rétrograder
\( {middleBorder} \){menuItemIcon}${prefix}mute          → Muet temporaire
\( {middleBorder} \){menuItemIcon}${prefix}desmute       → Retirer muet
\( {middleBorder} \){menuItemIcon}${prefix}mute2         → Muet renforcé
\( {middleBorder} \){menuItemIcon}${prefix}desmute2      → Retirer muet renforcé
\( {middleBorder} \){menuItemIcon}${prefix}adv           → Avertissement
\( {middleBorder} \){menuItemIcon}${prefix}rmadv         → Retirer avertissement
\( {middleBorder} \){menuItemIcon}${prefix}listadv       → Liste avertissements
\( {middleBorder} \){menuItemIcon}${prefix}limparrank    → Reset rank global
\( {middleBorder} \){menuItemIcon}${prefix}resetrank     → Reset rank individuel
\( {middleBorder} \){menuItemIcon}${prefix}mantercontador → Garder compteur activité
\( {middleBorder} \){menuItemIcon}${prefix}atividade      → Vérifier activité
\( {middleBorder} \){menuItemIcon}${prefix}checkativo    → Activité récente
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${securityMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}blockuser     → Bloquer utilisateur
\( {middleBorder} \){menuItemIcon}${prefix}unblockuser   → Débloquer
\( {middleBorder} \){menuItemIcon}${prefix}listblocksgp  → Liste blocs groupe
\( {middleBorder} \){menuItemIcon}${prefix}addblacklist  → Ajouter blacklist
\( {middleBorder} \){menuItemIcon}${prefix}delblacklist  → Retirer blacklist
\( {middleBorder} \){menuItemIcon}${prefix}listblacklist → Liste blacklist
\( {middleBorder} \){menuItemIcon}${prefix}blockcmd      → Bloquer commande
\( {middleBorder} \){menuItemIcon}${prefix}unblockcmd    → Débloquer commande
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${managementMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}del           → Supprimer message
\( {middleBorder} \){menuItemIcon}${prefix}limpar        → Nettoyer chat
\( {middleBorder} \){menuItemIcon}${prefix}marcar        → Mention générale
\( {middleBorder} \){menuItemIcon}${prefix}hidetag       → Mention cachée
\( {middleBorder} \){menuItemIcon}${prefix}sorteio       → Tirage au sort
\( {middleBorder} \){menuItemIcon}${prefix}nomegp        → Changer nom groupe
\( {middleBorder} \){menuItemIcon}${prefix}descgrupo     → Changer description
\( {middleBorder} \){menuItemIcon}${prefix}fotogrupo     → Changer photo groupe
\( {middleBorder} \){menuItemIcon}${prefix}addregra      → Ajouter règle
\( {middleBorder} \){menuItemIcon}${prefix}delregra      → Supprimer règle
\( {middleBorder} \){menuItemIcon}${prefix}role.criar    → Créer rôle custom
\( {middleBorder} \){menuItemIcon}${prefix}role.alterar  → Modifier rôle
\( {middleBorder} \){menuItemIcon}${prefix}role.excluir  → Supprimer rôle
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *⚙️ CONTRÔLE ACCÈS & SOLLICITATIONS*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}linkgp        → Lien invitation
\( {middleBorder} \){menuItemIcon}${prefix}grupo A/F     → Ouvrir/Fermer groupe
\( {middleBorder} \){menuItemIcon}${prefix}opengp HH:MM|off → Auto-ouvrir
\( {middleBorder} \){menuItemIcon}${prefix}closegp HH:MM|off → Auto-fermer
\( {middleBorder} \){menuItemIcon}${prefix}solicitacoes  → Liste demandes
\( {middleBorder} \){menuItemIcon}${prefix}aprovar       → Approuver demande
\( {middleBorder} \){menuItemIcon}${prefix}aprovar all   → Tout approuver
\( {middleBorder} \){menuItemIcon}${prefix}recusarsolic  → Refuser demande
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${moderatorsMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}addmod        → Ajouter modérateur
\( {middleBorder} \){menuItemIcon}${prefix}delmod        → Retirer modérateur
\( {middleBorder} \){menuItemIcon}${prefix}listmods      → Liste modérateurs
\( {middleBorder} \){menuItemIcon}${prefix}grantmodcmd   → Donner commande mod
\( {middleBorder} \){menuItemIcon}${prefix}revokemodcmd  → Retirer commande mod
\( {middleBorder} \){menuItemIcon}${prefix}listmodcmds   → Commandes mod allouées
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *🤝 ${partnershipsMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}parcerias     → Liste partenariats
\( {middleBorder} \){menuItemIcon}${prefix}addparceria   → Ajouter partenaire
\( {middleBorder} \){menuItemIcon}${prefix}delparceria   → Retirer partenaire
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${activationsMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}antiflood     → Anti-flood ON/OFF
\( {middleBorder} \){menuItemIcon}${prefix}antidoc       → Anti-document
\( {middleBorder} \){menuItemIcon}${prefix}antiloc       → Anti-localisation
\( {middleBorder} \){menuItemIcon}${prefix}antifig       → Anti-sticker
\( {middleBorder} \){menuItemIcon}${prefix}antibtn       → Anti-bouton
\( {middleBorder} \){menuItemIcon}${prefix}antilinkgp    → Anti-lien groupe
\( {middleBorder} \){menuItemIcon}${prefix}antilinkcanal → Anti-lien canal
\( {middleBorder} \){menuItemIcon}${prefix}antilinkhard  → Anti-lien strict
\( {middleBorder} \){menuItemIcon}${prefix}antilinksoft  → Anti-lien soft
\( {middleBorder} \){menuItemIcon}${prefix}antiporn      → Anti-porn
\( {middleBorder} \){menuItemIcon}${prefix}antistatus    → Anti-status
\( {middleBorder} \){menuItemIcon}${prefix}antitoxic     → Anti-toxicité
\( {middleBorder} \){menuItemIcon}${prefix}antipalavra   → Anti-mots interdits
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${settingsMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}legendasaiu   → Message départ
\( {middleBorder} \){menuItemIcon}${prefix}legendabv     → Message bienvenue
\( {middleBorder} \){menuItemIcon}${prefix}fotobv        → Photo bienvenue
\( {middleBorder} \){menuItemIcon}${prefix}rmfotobv      → Supprimer photo BV
\( {middleBorder} \){menuItemIcon}${prefix}fotosaiu      → Photo départ
\( {middleBorder} \){menuItemIcon}${prefix}rmfotosaiu    → Supprimer photo départ
\( {middleBorder} \){menuItemIcon}${prefix}setprefix     → Changer préfixe
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *💬 AUTO-RÉPONSES & MODES*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}addautoadm    → Ajouter auto-réponse admin
\( {middleBorder} \){menuItemIcon}${prefix}autorespostas → Gestion auto-réponses
\( {middleBorder} \){menuItemIcon}${prefix}modobn        → Mode blacklist
\( {middleBorder} \){menuItemIcon}${prefix}modoparceria  → Mode partenariat
\( {middleBorder} \){menuItemIcon}${prefix}modorpg       → Mode RPG
\( {middleBorder} \){menuItemIcon}${prefix}modolite      → Mode léger
\( {middleBorder} \){menuItemIcon}${prefix}bemvindo      → Message bienvenue
\( {middleBorder} \){menuItemIcon}${prefix}saida         → Message départ
\( {middleBorder} \){menuItemIcon}${prefix}autosticker   → Auto-sticker
\( {middleBorder} \){menuItemIcon}${prefix}soadm         → Groupe admins only
\( {middleBorder} \){menuItemIcon}${prefix}cmdlimit      → Limite commandes
${bottomBorder}
`;
}
