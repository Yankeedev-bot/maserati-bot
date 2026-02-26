/**
 * Menu RPG Prestige - Édition Maserati
 * Système RPG, économie, quêtes, clans & pets – empire trident sur le circuit
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

export default async function menurpg(
  prefix,
  botName = "MaseratiBot",
  userName = "Pilote",
  {
    header = `╭┈⊰ 🏎️ 『 *MODE RPG* 』\n┊Salut, #user#! Construis ton empire MC20.\n╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯`,
    menuTopBorder = "╭┈",
    bottomBorder = "╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯",
    menuTitleIcon = "🏆",
    menuItemIcon = "• 🔹",
    separatorIcon = "🔱",
    middleBorder = "┊",
    profileMenuTitle = "👤 PROFIL & STATUT PILOTE",
    economyMenuTitle = "💰 ÉCONOMIE & TRÉSORERIE V12",
    activitiesMenuTitle = "🎯 ACTIVITÉS QUOTIDIENNES",
    adventureMenuTitle = "🗺️ AVENTURES & EXPEDITIONS",
    combatMenuTitle = "⚔️ DUELS & BATAILLES CIRCUIT",
    craftingMenuTitle = "🔨 FORGE & ÉQUIPEMENTS PRESTIGE",
    socialMenuTitle = "💝 ALLIANCES & RELATIONS",
    familyMenuTitle = "👑 DYNASTIE & HÉRITAGE",
    guildMenuTitle = "🏰 CLANS & EMPIRES",
    questMenuTitle = "📜 QUÊTES & CONQUÊTES",
    petsMenuTitle = "🐾 COMPAGNONS & MONTURES",
    reputationMenuTitle = "⭐ RÉPUTATION & LÉGENDE",
    investmentMenuTitle = "📈 INVESTISSEMENTS & BOURSE LUXE",
    gamblingMenuTitle = "🎰 CASINO & PARIS TRIDENT",
    evolutionMenuTitle = "🌟 ÉVOLUTION & ASCENSION",
    eventsMenuTitle = "🎉 ÉVÉNEMENTS & GRAND PRIX",
    premiumMenuTitle = "💎 BOUTIQUE VIP & EXCLUSIVITÉS",
    adminMenuTitle = "🔧 ADMINISTRATION RPG (PROPRIÉTAIRE)"
  } = {}
) {
  const h = header.replace(/#user#/g, userName);

  return `${h}

\( {menuTopBorder} \){separatorIcon} *${profileMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}profilrpg       → Ton profil pilote prestige
\( {middleBorder} \){menuItemIcon}${prefix}portefeuille    → Ton coffre-fort
\( {middleBorder} \){menuItemIcon}${prefix}toprpg          → Top pilotes RPG
\( {middleBorder} \){menuItemIcon}${prefix}rankglobal      → Classement mondial
\( {middleBorder} \){menuItemIcon}${prefix}ranklvl         → Top niveaux
\( {middleBorder} \){menuItemIcon}${prefix}inventaire      → Ton garage d’objets
\( {middleBorder} \){menuItemIcon}${prefix}equipements     → Équipements équipés
\( {middleBorder} \){menuItemIcon}${prefix}conquetes       → Tes trophées légendaires
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${evolutionMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}evoluer         → Évoluer ton niveau
\( {middleBorder} \){menuItemIcon}${prefix}prestige        → Reset prestige
\( {middleBorder} \){menuItemIcon}${prefix}streak          → Série quotidienne
\( {middleBorder} \){menuItemIcon}${prefix}reclamer        → Réclamer récompenses
\( {middleBorder} \){menuItemIcon}${prefix}acceleration    → Boost vitesse progression
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${economyMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}depot <montant|all> → Déposer argent
\( {middleBorder} \){menuItemIcon}${prefix}retrait <montant|all> → Retirer argent
\( {middleBorder} \){menuItemIcon}${prefix}pix @pilote <montant> → Transfert instantané
\( {middleBorder} \){menuItemIcon}${prefix}boutique        → Marché prestige
\( {middleBorder} \){menuItemIcon}${prefix}acheter <item>  → Acheter objet
\( {middleBorder} \){menuItemIcon}${prefix}vendre <item> <qte> → Vendre objet
\( {middleBorder} \){menuItemIcon}${prefix}emplois         → Liste emplois disponibles
\( {middleBorder} \){menuItemIcon}${prefix}emploi <poste>  → Postuler
\( {middleBorder} \){menuItemIcon}${prefix}demission        → Quitter emploi
\( {middleBorder} \){menuItemIcon}${prefix}competences     → Tes compétences
\( {middleBorder} \){menuItemIcon}${prefix}defishebdo      → Défis hebdomadaires
\( {middleBorder} \){menuItemIcon}${prefix}defismensuel    → Défis mensuels
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${investmentMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}investir        → Voir bourse
\( {middleBorder} \){menuItemIcon}${prefix}investir <action> <qte> → Acheter actions
\( {middleBorder} \){menuItemIcon}${prefix}vendre <action> <qte> → Vendre actions
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${gamblingMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}des <montant>   → Jeu de dés
\( {middleBorder} \){menuItemIcon}${prefix}piece <face|pile> <montant> → Pile ou face
\( {middleBorder} \){menuItemIcon}${prefix}crash <montant> → Crash betting
\( {middleBorder} \){menuItemIcon}${prefix}slots <montant> → Machines à sous
\( {middleBorder} \){menuItemIcon}${prefix}parier <montant> → Pari simple
\( {middleBorder} \){menuItemIcon}${prefix}roulette <montant> <couleur> → Roulette
\( {middleBorder} \){menuItemIcon}${prefix}blackjack <montant> → Blackjack
\( {middleBorder} \){menuItemIcon}${prefix}loto            → Loterie
\( {middleBorder} \){menuItemIcon}${prefix}loto acheter <qte> → Acheter tickets
\( {middleBorder} \){menuItemIcon}${prefix}course <montant> <cheval> → Paris hippiques
\( {middleBorder} \){menuItemIcon}${prefix}enchere         → Enchères
\( {middleBorder} \){menuItemIcon}${prefix}topfortune      → Top richesses
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${activitiesMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}journalier      → Récompense quotidienne
\( {middleBorder} \){menuItemIcon}${prefix}travailler      → Job rapide
\( {middleBorder} \){menuItemIcon}${prefix}miner           → Miner ressources
\( {middleBorder} \){menuItemIcon}${prefix}pecher          → Pêche
\( {middleBorder} \){menuItemIcon}${prefix}recolter        → Récolter
\( {middleBorder} \){menuItemIcon}${prefix}cueillir        → Cueillir
\( {middleBorder} \){menuItemIcon}${prefix}chasser         → Chasse
\( {middleBorder} \){menuItemIcon}${prefix}planter <plante> → Planter culture
\( {middleBorder} \){menuItemIcon}${prefix}cultiver <plante> → Cultiver
\( {middleBorder} \){menuItemIcon}${prefix}plantation      → Voir plantation
\( {middleBorder} \){menuItemIcon}${prefix}cuire <recette> → Cuisiner
\( {middleBorder} \){menuItemIcon}${prefix}recettes        → Liste recettes
\( {middleBorder} \){menuItemIcon}${prefix}ingredients     → Tes ingrédients
\( {middleBorder} \){menuItemIcon}${prefix}manger <plat>   → Consommer
\( {middleBorder} \){menuItemIcon}${prefix}vendremanger <item> → Vendre plats
\( {middleBorder} \){menuItemIcon}${prefix}graines         → Tes graines
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${adventureMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}explorer        → Exploration
\( {middleBorder} \){menuItemIcon}${prefix}donjon          → Donjons
\( {middleBorder} \){menuItemIcon}${prefix}bossrpg         → Boss épiques
\( {middleBorder} \){menuItemIcon}${prefix}evenements      → Événements spéciaux
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *🏰 DONJONS & RAIDS*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}donjon          → Liste donjons
\( {middleBorder} \){menuItemIcon}${prefix}donjon creer <type> → Créer donjon
\( {middleBorder} \){menuItemIcon}${prefix}donjon entrer <id> → Rejoindre
\( {middleBorder} \){menuItemIcon}${prefix}donjon lancer   → Démarrer raid
\( {middleBorder} \){menuItemIcon}${prefix}donjon quitter  → Sortir
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *⚔️ CLASSES & MÉTIERS*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}classe         → Voir classes disponibles
\( {middleBorder} \){menuItemIcon}${prefix}classe <nom>    → Choisir classe
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *🏠 PROPRIÉTÉS & MAISONS*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}maison         → Voir ta propriété
\( {middleBorder} \){menuItemIcon}${prefix}maison acheter <type> → Acheter maison
\( {middleBorder} \){menuItemIcon}${prefix}maison recolter → Récolter revenus
\( {middleBorder} \){menuItemIcon}${prefix}maison decorer <item> → Décorer
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *🛒 MARCHÉ & ENCHÈRES*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}enchere        → Voir enchères
\( {middleBorder} \){menuItemIcon}${prefix}enchere vendre <item> <prix> → Mettre en vente
\( {middleBorder} \){menuItemIcon}${prefix}enchere acheter <n°> → Acheter
\( {middleBorder} \){menuItemIcon}${prefix}enchere mes     → Tes ventes
\( {middleBorder} \){menuItemIcon}${prefix}enchere annuler <n°> → Annuler
${middleBorder}
\( {middleBorder} \){menuTitleIcon} *MARCHÉ GÉNÉRAL* ${menuTitleIcon}
\( {middleBorder} \){menuItemIcon}${prefix}marche         → Voir marché
\( {middleBorder} \){menuItemIcon}${prefix}lister <item> <prix> → Lister objet
\( {middleBorder} \){menuItemIcon}${prefix}achetermarche <n°> → Acheter
\( {middleBorder} \){menuItemIcon}${prefix}mesannonces     → Tes annonces
\( {middleBorder} \){menuItemIcon}${prefix}annuler <n°>    → Annuler annonce
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${combatMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}duelrpg @pilote → Duel 1v1
\( {middleBorder} \){menuItemIcon}${prefix}arena           → Arène ouverte
\( {middleBorder} \){menuItemIcon}${prefix}tournoi         → Tournoi
\( {middleBorder} \){menuItemIcon}${prefix}voler @pilote   → Braquage
\( {middleBorder} \){menuItemIcon}${prefix}crime           → Activité illégale
\( {middleBorder} \){menuItemIcon}${prefix}guerre          → Guerre de clans
\( {middleBorder} \){menuItemIcon}${prefix}defi            → Défi honneur
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${craftingMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}forge <item>    → Forger objet
\( {middleBorder} \){menuItemIcon}${prefix}enchanter       → Enchanter équipement
\( {middleBorder} \){menuItemIcon}${prefix}demonter <item> → Démonter objet
\( {middleBorder} \){menuItemIcon}${prefix}reparer <item>  → Réparer
\( {middleBorder} \){menuItemIcon}${prefix}materiaux       → Tes matériaux
\( {middleBorder} \){menuItemIcon}${prefix}prix            → Prix marché
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${socialMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}epouser @pilote → Mariage prestige
\( {middleBorder} \){menuItemIcon}${prefix}divorcer         → Divorce
\( {middleBorder} \){menuItemIcon}${prefix}fiancer @pilote → Fiancer
\( {middleBorder} \){menuItemIcon}${prefix}rompre          → Rompre
\( {middleBorder} \){menuItemIcon}${prefix}relation        → Statut relation
\( {middleBorder} \){menuItemIcon}${prefix}couples         → Top couples
\( {middleBorder} \){menuItemIcon}${prefix}calinrpg @pilote → Câlin RPG
\( {middleBorder} \){menuItemIcon}${prefix}baiser @pilote  → Bisou RPG
\( {middleBorder} \){menuItemIcon}${prefix}frapper @pilote → Frapper (blague)
\( {middleBorder} \){menuItemIcon}${prefix}proteger @pilote → Protéger
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${familyMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}famille         → Voir famille
\( {middleBorder} \){menuItemIcon}${prefix}adopter @pilote → Adopter
\( {middleBorder} \){menuItemIcon}${prefix}desheriter @pilote → Déshériter
\( {middleBorder} \){menuItemIcon}${prefix}arbre           → Arbre généalogique
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${guildMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}creerclan <nom> → Créer clan
\( {middleBorder} \){menuItemIcon}${prefix}clan            → Infos clan
\( {middleBorder} \){menuItemIcon}${prefix}inviter @pilote → Inviter
\( {middleBorder} \){menuItemIcon}${prefix}quitter         → Quitter clan
\( {middleBorder} \){menuItemIcon}${prefix}accepter <id|nom> → Accepter invitation
\( {middleBorder} \){menuItemIcon}${prefix}refuser <id|nom> → Refuser
\( {middleBorder} \){menuItemIcon}${prefix}expulser @pilote → Expulser
\( {middleBorder} \){menuItemIcon}${prefix}retirerinvit @pilote → Retirer invitation
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${questMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}missions        → Tes missions
\( {middleBorder} \){menuItemIcon}${prefix}conquetes       → Conquêtes & trophées
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${petsMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}animaux         → Tes compagnons
\( {middleBorder} \){menuItemIcon}${prefix}adopter <animal> → Adopter monture/pet
\( {middleBorder} \){menuItemIcon}${prefix}nourrir <n°>    → Nourrir
\( {middleBorder} \){menuItemIcon}${prefix}entrainer <n°>  → Entraîner
\( {middleBorder} \){menuItemIcon}${prefix}evoluer <n°>    → Évoluer pet
\( {middleBorder} \){menuItemIcon}${prefix}combatpet <n°>  → Combattre avec pet
\( {middleBorder} \){menuItemIcon}${prefix}renommerpet <n°> <nom> → Renommer
\( {middleBorder} \){menuItemIcon}${prefix}paripet <montant> <n°> @pilote → Pari pet
\( {middleBorder} \){menuItemIcon}${prefix}equiperpet <n°> <item> → Équiper
\( {middleBorder} \){menuItemIcon}${prefix}desequiperpet <n°> <slot?> → Déséquiper
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${reputationMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}rep            → Voir réputation
\( {middleBorder} \){menuItemIcon}${prefix}voter @pilote   → Voter pour quelqu’un
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${eventsMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}evenements      → Événements en cours
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${premiumMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}boutiquevip     → Boutique VIP
\( {middleBorder} \){menuItemIcon}${prefix}achetervip <item> → Acheter avantage
\( {middleBorder} \){menuItemIcon}${prefix}boost           → Activer boost
\( {middleBorder} \){menuItemIcon}${prefix}proprietes      → Tes propriétés
\( {middleBorder} \){menuItemIcon}${prefix}propriete <id>  → Infos propriété
\( {middleBorder} \){menuItemIcon}${prefix}proprietesliste → Liste propriétés
\( {middleBorder} \){menuItemIcon}${prefix}tributs         → Collecter tributs
\( {middleBorder} \){menuItemIcon}${prefix}messtats        → Stats premium
\( {middleBorder} \){menuItemIcon}${prefix}don <montant>   → Donner argent
\( {middleBorder} \){menuItemIcon}${prefix}cadeau @pilote <item> → Offrir cadeau VIP
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${adminMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}rpgajouter @pilote <montant> → Ajouter argent
\( {middleBorder} \){menuItemIcon}${prefix}rpgretirer @pilote <montant> → Retirer
\( {middleBorder} \){menuItemIcon}${prefix}rpgsetniveau @pilote <niveau> → Forcer niveau
\( {middleBorder} \){menuItemIcon}${prefix}rpgajouterobjet @pilote <item> <qte> → Ajouter objet
\( {middleBorder} \){menuItemIcon}${prefix}rpgretirerobjet @pilote <item> <qte> → Retirer
\( {middleBorder} \){menuItemIcon}${prefix}rpgresetpilote @pilote → Reset joueur
\( {middleBorder} \){menuItemIcon}${prefix}rpgresetglobal confirmer → Reset serveur
\( {middleBorder} \){menuItemIcon}${prefix}rpgstats        → Stats globales RPG
${bottomBorder}
`;
}