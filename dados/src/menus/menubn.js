/**
 * Menu Brincadeiras & Fun Prestige - Édition Maserati
 * Blagues, interactions, ranks & relations – full luxe circuit vibe
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

export default async function menubn(
  prefix,
  botName = "MaseratiBot",
  userName = "Pilote",
  isLiteMode = false,
  {
    header = `╭┈⊰ 🏎️ 『 *${botName}* 』\n┊Salut, #user#! Amuse-toi sur le bitume prestige.\n╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯`,
    menuTopBorder = "╭┈",
    bottomBorder = "╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯",
    menuTitleIcon = "🏁",
    menuItemIcon = "• 🔹",
    separatorIcon = "🔱",
    middleBorder = "┊",
    gamesMenuTitle = "🎮 JEUX & DUELS V8",
    phrasesMenuTitle = "💬 PHRASES & PUNCHLINES LUXE",
    interactionsMenuTitle = "🤝 INTERACTIONS PADDOCK",
    relationshipMenuTitle = "💞 DUOS & DRAMES MC20",
    hotInteractionsMenuTitle = "🔥 INTERACTIONS INTENSES 🔥",
    maleFunMenuTitle = "🔥 BRINCADEIRAS MASCULINES TRIDENT",
    femaleFunMenuTitle = "💅 BRINCADEIRAS FÉMININES DIAMANT",
    maleRanksMenuTitle = "🏆 RANKINGS MASCULINS PRESTIGE",
    femaleRanksMenuTitle = "👑 RANKINGS FÉMININS LUXE"
  } = {}
) {
  const formattedHeader = header.replace(/#user#/g, userName);

  let menuContent = `${formattedHeader}

\( {menuTopBorder} \){separatorIcon} *${gamesMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}tictactoe @pilote     → Duel morpion circuit
\( {middleBorder} \){menuItemIcon}${prefix}connect4 @pilote      → Puissance 4 MC20
\( {middleBorder} \){menuItemIcon}${prefix}uno créer             → Lancer partie UNO
\( {middleBorder} \){menuItemIcon}${prefix}uno entrer            → Rejoindre grille UNO
\( {middleBorder} \){menuItemIcon}${prefix}uno jouer <n°>        → Poser carte
\( {middleBorder} \){menuItemIcon}${prefix}uno annuler           → Garage d’urgence
\( {middleBorder} \){menuItemIcon}${prefix}memoria               → Jeu mémoire trident
\( {middleBorder} \){menuItemIcon}${prefix}memoria classement    → Top mémoire
\( {middleBorder} \){menuItemIcon}${prefix}wordle                → Mot mystère luxe
\( {middleBorder} \){menuItemIcon}${prefix}quiz <catégorie>      → Quiz paddock
\( {middleBorder} \){menuItemIcon}${prefix}pendu                 → Pendu prestige
\( {middleBorder} \){menuItemIcon}${prefix}digitar @pilote       → Défi vitesse frappe
\( {middleBorder} \){menuItemIcon}${prefix}batalhanaval @pilote  → Bataille navale
\( {middleBorder} \){menuItemIcon}${prefix}stop                  → Arrêt course
\( {middleBorder} \){menuItemIcon}${prefix}anagramme             → Anagramme V8
\( {middleBorder} \){menuItemIcon}${prefix}dueloquiz @pilote     → Duel quiz
\( {middleBorder} \){menuItemIcon}${prefix}cacapalavras          → Mots mêlés
\( {middleBorder} \){menuItemIcon}${prefix}jogodavelha           → Morpion rapide
\( {middleBorder} \){menuItemIcon}${prefix}eununca               → Action ou vérité
\( {middleBorder} \){menuItemIcon}${prefix}vab                   → Vérité ou conséquence
\( {middleBorder} \){menuItemIcon}${prefix}chance                → % de chance
\( {middleBorder} \){menuItemIcon}${prefix}quando               → Quand ça arrivera ?
\( {middleBorder} \){menuItemIcon}${prefix}sorte                 → Tirage chance
\( {middleBorder} \){menuItemIcon}${prefix}casal                 → Compatibilité duo
\( {middleBorder} \){menuItemIcon}${prefix}shipo                 → Ship ranking
\( {middleBorder} \){menuItemIcon}${prefix}sn                    → Sorte ou non
\( {middleBorder} \){menuItemIcon}${prefix}ppt                   → Pierre-papier-ciseaux
\( {isLiteMode ? '' : `\n \){middleBorder}\( {menuItemIcon} \){prefix}suicide               → Blague dark (18+)`}
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${phrasesMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}conseil             → Conseil paddock
\( {middleBorder} \){menuItemIcon}${prefix}conseilbiblico      → Sagesse biblique
\( {middleBorder} \){menuItemIcon}${prefix}drague              → Phrase d’approche luxe
\( {middleBorder} \){menuItemIcon}${prefix}blague              → Punchline
\( {middleBorder} \){menuItemIcon}${prefix}devinette           → Charade
\( {middleBorder} \){menuItemIcon}${prefix}motivation          → Boost mental
\( {middleBorder} \){menuItemIcon}${prefix}compliment          → Éloge prestige
\( {middleBorder} \){menuItemIcon}${prefix}reflexion           → Pensée profonde
\( {middleBorder} \){menuItemIcon}${prefix}fait                → Fait insolite
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${interactionsMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}coupdepied          → Coup de pied
\( {middleBorder} \){menuItemIcon}${prefix}frapperpied         → Donner coup de pied
\( {middleBorder} \){menuItemIcon}${prefix}gifle               → Claque
\( {middleBorder} \){menuItemIcon}${prefix}poing               → Coup de poing
\( {middleBorder} \){menuItemIcon}${prefix}frapper             → Frapper
\( {middleBorder} \){menuItemIcon}${prefix}explosion           → Explosion
\( {middleBorder} \){menuItemIcon}${prefix}calin               → Câlin
\( {middleBorder} \){menuItemIcon}${prefix}embrasser           → Embrasser
\( {middleBorder} \){menuItemIcon}${prefix}mordre              → Morsure
\( {middleBorder} \){menuItemIcon}${prefix}lecher              → Coup de langue
\( {middleBorder} \){menuItemIcon}${prefix}bisou               → Bise
\( {middleBorder} \){menuItemIcon}${prefix}embrasser           → Bisou
\( {middleBorder} \){menuItemIcon}${prefix}tuer                → Éliminer (blague)
\( {middleBorder} \){menuItemIcon}${prefix}caressercheveux     → Caresser cheveux
${bottomBorder}
`;

  if (!isLiteMode) {
    menuContent += `
\( {menuTopBorder} \){separatorIcon} *${hotInteractionsMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}orgie               → Groupe intense (18+)
\( {middleBorder} \){menuItemIcon}${prefix}sexe                → Sexe (18+)
\( {middleBorder} \){menuItemIcon}${prefix}bisobouche          → French kiss (18+)
\( {middleBorder} \){menuItemIcon}${prefix}embrasserbouche     → Embrasser bouche (18+)
\( {middleBorder} \){menuItemIcon}${prefix}claquefesse         → Fessée (18+)
\( {middleBorder} \){menuItemIcon}${prefix}jouir               → Jouissance (18+)
\( {middleBorder} \){menuItemIcon}${prefix}ejaculer            → Éjaculation (18+)
\( {middleBorder} \){menuItemIcon}${prefix}sucer               → Fellation (18+)
\( {middleBorder} \){menuItemIcon}${prefix}fellation           → Oral (18+)
${bottomBorder}
`;
  }

  menuContent += `
\( {menuTopBorder} \){separatorIcon} *${maleFunMenuTitle}*
${middleBorder}
\( {isLiteMode ? '' : ` \){middleBorder}\( {menuItemIcon} \){prefix}gay\n`}
\( {middleBorder} \){menuItemIcon}${prefix}idiot              → Niveau cerveau
\( {middleBorder} \){menuItemIcon}${prefix}genie              → Intelligence MC20
\( {middleBorder} \){menuItemIcon}${prefix}otaku              → Fan anime
\( {middleBorder} \){menuItemIcon}${prefix}fidele             → Fidèle
\( {middleBorder} \){menuItemIcon}${prefix}infidele           → Infidèle
\( {isLiteMode ? '' : ` \){middleBorder}\( {menuItemIcon} \){prefix}cocu\n`}
\( {middleBorder} \){menuItemIcon}${prefix}suiveur            → Suiveur
\( {middleBorder} \){menuItemIcon}${prefix}sexy               → Charmeur
\( {middleBorder} \){menuItemIcon}${prefix}moche              → Pas beau
\( {middleBorder} \){menuItemIcon}${prefix}riche              → Milliardaire
\( {middleBorder} \){menuItemIcon}${prefix}pauvre             → Fauché
\( {isLiteMode ? '' : ` \){middleBorder}\( {menuItemIcon} \){prefix}grosmatos\n\( {middleBorder} \){menuItemIcon}\( {prefix}extremiste\n \){middleBorder}\( {menuItemIcon} \){prefix}voleur\n`}
\( {middleBorder} \){menuItemIcon}${prefix}coquin             → Coquin
\( {middleBorder} \){menuItemIcon}${prefix}louche             → Suspect
\( {middleBorder} \){menuItemIcon}${prefix}bourre             → Torché
\( {isLiteMode ? '' : ` \){middleBorder}\( {menuItemIcon} \){prefix}machiste\n\( {middleBorder} \){menuItemIcon}\( {prefix}homophobe\n \){middleBorder}\( {menuItemIcon} \){prefix}raciste\n`}
\( {middleBorder} \){menuItemIcon}${prefix}chiant             → Relou
\( {middleBorder} \){menuItemIcon}${prefix}chanceux           → Veinard
\( {middleBorder} \){menuItemIcon}${prefix}malchanceux        → Poissard
\( {middleBorder} \){menuItemIcon}${prefix}puissant           → Fort
\( {middleBorder} \){menuItemIcon}${prefix}faible             → Fragile
\( {middleBorder} \){menuItemIcon}${prefix}seducteur          → Tombeur
\( {middleBorder} \){menuItemIcon}${prefix}pigeon             → Pigeon
\( {middleBorder} \){menuItemIcon}${prefix}alpha              → Dominant
\( {middleBorder} \){menuItemIcon}${prefix}idiot              → Con
\( {middleBorder} \){menuItemIcon}${prefix}intello            → Nerd
\( {middleBorder} \){menuItemIcon}${prefix}feignant           → Paresseux
\( {middleBorder} \){menuItemIcon}${prefix}travailleur        → Bosseur
\( {middleBorder} \){menuItemIcon}${prefix}fier               → Fier
\( {middleBorder} \){menuItemIcon}${prefix}beau               → Canon
\( {middleBorder} \){menuItemIcon}${prefix}malin              → Rusé
\( {middleBorder} \){menuItemIcon}${prefix}sympa              → Cool
\( {middleBorder} \){menuItemIcon}${prefix}drôle              → Marrant
\( {middleBorder} \){menuItemIcon}${prefix}charismatique      → Charismatique
\( {middleBorder} \){menuItemIcon}${prefix}mysterieux         → Mystérieux
\( {middleBorder} \){menuItemIcon}${prefix}tendre             → Tendre
\( {middleBorder} \){menuItemIcon}${prefix}arrogant           → Arrogant
\( {middleBorder} \){menuItemIcon}${prefix}modeste            → Modeste
\( {middleBorder} \){menuItemIcon}${prefix}jaloux             → Jaloux
\( {middleBorder} \){menuItemIcon}${prefix}courageux          → Brave
\( {middleBorder} \){menuItemIcon}${prefix}lache              → Lâche
\( {middleBorder} \){menuItemIcon}${prefix}malin              → Malin
\( {isLiteMode ? '' : ` \){middleBorder}\( {menuItemIcon} \){prefix}talarico\n`}
\( {middleBorder} \){menuItemIcon}${prefix}pleurnichard       → Chialeur
\( {middleBorder} \){menuItemIcon}${prefix}taquin             → Taquin
\( {isLiteMode ? '' : ` \){middleBorder}\( {menuItemIcon} \){prefix}bolsonariste\n\( {middleBorder} \){menuItemIcon}\( {prefix}petiste\n \){middleBorder}\( {menuItemIcon} \){prefix}communiste\n\( {middleBorder} \){menuItemIcon}\( {prefix}luliste\n \){middleBorder}\( {menuItemIcon} \){prefix}traître\n\( {middleBorder} \){menuItemIcon}\( {prefix}bandit\n \){middleBorder}\( {menuItemIcon} \){prefix}chien\n\( {middleBorder} \){menuItemIcon}\( {prefix}voyou\n \){middleBorder}\( {menuItemIcon} \){prefix}pire\n`}
\( {middleBorder} \){menuItemIcon}${prefix}legende            → Légende
\( {middleBorder} \){menuItemIcon}${prefix}standard           → Standard
\( {middleBorder} \){menuItemIcon}${prefix}comique            → Comique
\( {isLiteMode ? '' : ` \){middleBorder}\( {menuItemIcon} \){prefix}psychopathe\n`}
\( {middleBorder} \){menuItemIcon}${prefix}baraqué            → Musclé
\( {middleBorder} \){menuItemIcon}${prefix}mondial            → Global
\( {middleBorder} \){menuItemIcon}${prefix}modeste            → Humble
\( {middleBorder} \){menuItemIcon}${prefix}independant        → Indépendant
\( {middleBorder} \){menuItemIcon}${prefix}pueril             → Gamin
\( {middleBorder} \){menuItemIcon}${prefix}insecure           → Insécure
\( {middleBorder} \){menuItemIcon}${prefix}introverti         → Introverti
\( {middleBorder} \){menuItemIcon}${prefix}irresponsable      → Irresponsable
\( {middleBorder} \){menuItemIcon}${prefix}leader             → Leader
\( {middleBorder} \){menuItemIcon}${prefix}liberal            → Libéral
\( {middleBorder} \){menuItemIcon}${prefix}local              → Local
\( {middleBorder} \){menuItemIcon}${prefix}mature             → Mature
\( {middleBorder} \){menuItemIcon}${prefix}maigre             → Maigre
\( {middleBorder} \){menuItemIcon}${prefix}rusé               → Rusé
\( {middleBorder} \){menuItemIcon}${prefix}mysterieux         → Mystérieux
\( {middleBorder} \){menuItemIcon}${prefix}legende            → Légende
\( {middleBorder} \){menuItemIcon}${prefix}moderne            → Moderne
\( {middleBorder} \){menuItemIcon}${prefix}nerd               → Intello
\( {middleBorder} \){menuItemIcon}${prefix}nerveux            → Nerveux
\( {middleBorder} \){menuItemIcon}${prefix}offline            → Hors ligne
\( {middleBorder} \){menuItemIcon}${prefix}online             → Connecté
\( {middleBorder} \){menuItemIcon}${prefix}optimiste          → Optimiste
\( {middleBorder} \){menuItemIcon}${prefix}standard           → Standard
\( {middleBorder} \){menuItemIcon}${prefix}patriote           → Patriote
\( {middleBorder} \){menuItemIcon}${prefix}pessimiste         → Pessimiste
\( {middleBorder} \){menuItemIcon}${prefix}pratique           → Pratique
\( {middleBorder} \){menuItemIcon}${prefix}codeur             → Programmeur
\( {middleBorder} \){menuItemIcon}${prefix}reine              → Reine
\( {middleBorder} \){menuItemIcon}${prefix}realiste           → Réaliste
\( {middleBorder} \){menuItemIcon}${prefix}religieux          → Religieux
\( {middleBorder} \){menuItemIcon}${prefix}responsable        → Responsable
\( {middleBorder} \){menuItemIcon}${prefix}romantique         → Romantique
\( {middleBorder} \){menuItemIcon}${prefix}rural              → Rural
\( {middleBorder} \){menuItemIcon}${prefix}sain               → Sain
\( {middleBorder} \){menuItemIcon}${prefix}suiveur            → Suiveur
\( {middleBorder} \){menuItemIcon}${prefix}serieux            → Sérieux
\( {middleBorder} \){menuItemIcon}${prefix}sociable           → Sociable
\( {middleBorder} \){menuItemIcon}${prefix}solitaire          → Solitaire
\( {middleBorder} \){menuItemIcon}${prefix}reveur             → Rêveur
\( {middleBorder} \){menuItemIcon}${prefix}chance             → Chance
\( {middleBorder} \){menuItemIcon}${prefix}superstitieux      → Superstitieux
\( {middleBorder} \){menuItemIcon}${prefix}technophile        → Technophile
\( {middleBorder} \){menuItemIcon}${prefix}traditionnel       → Traditionnel
\( {middleBorder} \){menuItemIcon}${prefix}urbain             → Urbain
\( {middleBorder} \){menuItemIcon}${prefix}voyageur           → Voyageur
\( {middleBorder} \){menuItemIcon}${prefix}visionnaire        → Visionnaire
\( {middleBorder} \){menuItemIcon}${prefix}blagueur           → Blagueur
\( {middleBorder} \){menuItemIcon}${prefix}milliardaire       → Milliardaire
\( {middleBorder} \){menuItemIcon}${prefix}gamer              → Gamer
\( {middleBorder} \){menuItemIcon}${prefix}codeur             → Développeur
\( {middleBorder} \){menuItemIcon}${prefix}visionnaire        → Visionnaire
\( {middleBorder} \){menuItemIcon}${prefix}milliardaire       → Milliardaire
\( {middleBorder} \){menuItemIcon}${prefix}puissant           → Puissant
\( {middleBorder} \){menuItemIcon}${prefix}vainqueur          → Vainqueur
\( {middleBorder} \){menuItemIcon}${prefix}seigneur           → Seigneur
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${femaleFunMenuTitle}*
${middleBorder}
\( {isLiteMode ? '' : ` \){middleBorder}\( {menuItemIcon} \){prefix}lesbienne\n`}
\( {middleBorder} \){menuItemIcon}${prefix}idiote             → Niveau cerveau
\( {middleBorder} \){menuItemIcon}${prefix}genie              → Génie
\( {middleBorder} \){menuItemIcon}${prefix}otaku              → Fan anime
\( {middleBorder} \){menuItemIcon}${prefix}fidele             → Fidèle
\( {middleBorder} \){menuItemIcon}${prefix}infidele           → Infidèle
\( {isLiteMode ? '' : ` \){middleBorder}\( {menuItemIcon} \){prefix}cocue\n`}
\( {middleBorder} \){menuItemIcon}${prefix}suiveuse           → Suiveuse
\( {middleBorder} \){menuItemIcon}${prefix}sexy               → Sexy
\( {middleBorder} \){menuItemIcon}${prefix}moche              → Moche
\( {middleBorder} \){menuItemIcon}${prefix}riche              → Riche
\( {middleBorder} \){menuItemIcon}${prefix}pauvre             → Pauvre
\( {isLiteMode ? '' : ` \){middleBorder}\( {menuItemIcon} \){prefix}bienfournie\n\( {middleBorder} \){menuItemIcon}\( {prefix}extremiste\n \){middleBorder}\( {menuItemIcon} \){prefix}voleuse\n`}
\( {middleBorder} \){menuItemIcon}${prefix}coquine            → Coquine
\( {middleBorder} \){menuItemIcon}${prefix}louche             → Suspecte
\( {middleBorder} \){menuItemIcon}${prefix}bourree            → Torche
\( {isLiteMode ? '' : ` \){middleBorder}\( {menuItemIcon} \){prefix}machiste\n\( {middleBorder} \){menuItemIcon}\( {prefix}homophobe\n \){middleBorder}\( {menuItemIcon} \){prefix}raciste\n`}
\( {middleBorder} \){menuItemIcon}${prefix}chiante            → Relou
\( {middleBorder} \){menuItemIcon}${prefix}chanceuse          → Veinarde
\( {middleBorder} \){menuItemIcon}${prefix}malchanceuse       → Poissarde
\( {middleBorder} \){menuItemIcon}${prefix}puissante          → Forte
\( {middleBorder} \){menuItemIcon}${prefix}faible             → Fragile
\( {middleBorder} \){menuItemIcon}${prefix}seductrice         → Séductrice
\( {middleBorder} \){menuItemIcon}${prefix}pigeon             → Pigeon
\( {middleBorder} \){menuItemIcon}${prefix}idiote             → Conne
\( {middleBorder} \){menuItemIcon}${prefix}intello            → Intello
\( {middleBorder} \){menuItemIcon}${prefix}feignante          → Paresseuse
\( {middleBorder} \){menuItemIcon}${prefix}travailleuse       → Bosseuse
\( {middleBorder} \){menuItemIcon}${prefix}fiere              → Fière
\( {middleBorder} \){menuItemIcon}${prefix}canon              → Canon
\( {middleBorder} \){menuItemIcon}${prefix}maligne            → Rusée
\( {middleBorder} \){menuItemIcon}${prefix}sympa              → Cool
\( {middleBorder} \){menuItemIcon}${prefix}drôle              → Marrante
\( {middleBorder} \){menuItemIcon}${prefix}charismatique      → Charismatique
\( {middleBorder} \){menuItemIcon}${prefix}mysterieuse        → Mystérieuse
\( {middleBorder} \){menuItemIcon}${prefix}tendre             → Tendre
\( {middleBorder} \){menuItemIcon}${prefix}arrogante          → Arrogante
\( {middleBorder} \){menuItemIcon}${prefix}modeste            → Modeste
\( {middleBorder} \){menuItemIcon}${prefix}jalouse            → Jalouse
\( {middleBorder} \){menuItemIcon}${prefix}courageuse         → Brave
\( {middleBorder} \){menuItemIcon}${prefix}lache              → Lâche
\( {middleBorder} \){menuItemIcon}${prefix}maligne            → Maline
\( {isLiteMode ? '' : ` \){middleBorder}\( {menuItemIcon} \){prefix}talarica\n`}
\( {middleBorder} \){menuItemIcon}${prefix}pleurnicharde      → Chialeuse
\( {middleBorder} \){menuItemIcon}${prefix}taquine            → Taquine
\( {isLiteMode ? '' : ` \){middleBorder}\( {menuItemIcon} \){prefix}bolsonariste\n\( {middleBorder} \){menuItemIcon}\( {prefix}petiste\n \){middleBorder}\( {menuItemIcon} \){prefix}communiste\n\( {middleBorder} \){menuItemIcon}\( {prefix}luliste\n \){middleBorder}\( {menuItemIcon} \){prefix}traîtresse\n\( {middleBorder} \){menuItemIcon}\( {prefix}bandit\n \){middleBorder}\( {menuItemIcon} \){prefix}chienne\n\( {middleBorder} \){menuItemIcon}\( {prefix}salope\n \){middleBorder}\( {menuItemIcon} \){prefix}pire\n`}
\( {middleBorder} \){menuItemIcon}${prefix}legende            → Légende
\( {middleBorder} \){menuItemIcon}${prefix}standard           → Standard
\( {middleBorder} \){menuItemIcon}${prefix}comique            → Comique
\( {isLiteMode ? '' : ` \){middleBorder}\( {menuItemIcon} \){prefix}psychopathe\n`}
\( {middleBorder} \){menuItemIcon}${prefix}baraquée           → Musclée
\( {middleBorder} \){menuItemIcon}${prefix}mondiale           → Globale
\( {middleBorder} \){menuItemIcon}${prefix}modeste            → Humble
\( {middleBorder} \){menuItemIcon}${prefix}independante       → Indépendante
\( {middleBorder} \){menuItemIcon}${prefix}puerile            → Gamine
\( {middleBorder} \){menuItemIcon}${prefix}insecure           → Insécure
\( {middleBorder} \){menuItemIcon}${prefix}introvertie        → Introvertie
\( {middleBorder} \){menuItemIcon}${prefix}irresponsable      → Irresponsable
\( {middleBorder} \){menuItemIcon}${prefix}leader             → Leader
\( {middleBorder} \){menuItemIcon}${prefix}liberale           → Libérale
\( {middleBorder} \){menuItemIcon}${prefix}locale             → Locale
\( {middleBorder} \){menuItemIcon}${prefix}mature             → Mature
\( {middleBorder} \){menuItemIcon}${prefix}maigre             → Maigre
\( {middleBorder} \){menuItemIcon}${prefix}rusée              → Rusée
\( {middleBorder} \){menuItemIcon}${prefix}mysterieuse        → Mystérieuse
\( {middleBorder} \){menuItemIcon}${prefix}legende            → Légende
\( {middleBorder} \){menuItemIcon}${prefix}moderne            → Moderne
\( {middleBorder} \){menuItemIcon}${prefix}nerveuse           → Nerveuse
\( {middleBorder} \){menuItemIcon}${prefix}offline            → Hors ligne
\( {middleBorder} \){menuItemIcon}${prefix}online             → Connectée
\( {middleBorder} \){menuItemIcon}${prefix}optimiste          → Optimiste
\( {middleBorder} \){menuItemIcon}${prefix}standard           → Standard
\( {middleBorder} \){menuItemIcon}${prefix}patriotique        → Patriote
\( {middleBorder} \){menuItemIcon}${prefix}pessimiste         → Pessimiste
\( {middleBorder} \){menuItemIcon}${prefix}pratique           → Pratique
\( {middleBorder} \){menuItemIcon}${prefix}codeuse            → Développeuse
\( {middleBorder} \){menuItemIcon}${prefix}reine              → Reine
\( {middleBorder} \){menuItemIcon}${prefix}realiste           → Réaliste
\( {middleBorder} \){menuItemIcon}${prefix}religieuse         → Religieuse
\( {middleBorder} \){menuItemIcon}${prefix}romantique         → Romantique
\( {middleBorder} \){menuItemIcon}${prefix}rurale             → Rurale
\( {middleBorder} \){menuItemIcon}${prefix}saine              → Saine
\( {middleBorder} \){menuItemIcon}${prefix}sedentaire         → Sédentaire
\( {middleBorder} \){menuItemIcon}${prefix}suiveuse           → Suiveuse
\( {middleBorder} \){menuItemIcon}${prefix}serieuse           → Sérieuse
\( {middleBorder} \){menuItemIcon}${prefix}sympa              → Sympa
\( {middleBorder} \){menuItemIcon}${prefix}sociable           → Sociable
\( {middleBorder} \){menuItemIcon}${prefix}solitaire          → Solitaire
\( {middleBorder} \){menuItemIcon}${prefix}reveuse            → Rêveuse
\( {middleBorder} \){menuItemIcon}${prefix}chance             → Chance
\( {middleBorder} \){menuItemIcon}${prefix}superstitieuse     → Superstitieuse
\( {middleBorder} \){menuItemIcon}${prefix}technophile        → Technophile
\( {middleBorder} \){menuItemIcon}${prefix}traditionnelle     → Traditionnelle
\( {middleBorder} \){menuItemIcon}${prefix}urbaine            → Urbaine
\( {middleBorder} \){menuItemIcon}${prefix}vainqueuse         → Vainqueuse
\( {middleBorder} \){menuItemIcon}${prefix}voyageuse          → Voyageuse
\( {middleBorder} \){menuItemIcon}${prefix}visionnaire        → Visionnaire
\( {middleBorder} \){menuItemIcon}${prefix}blagueuse          → Blagueuse
\( {middleBorder} \){menuItemIcon}${prefix}milliardaire       → Milliardaire
\( {middleBorder} \){menuItemIcon}${prefix}gamer              → Gamer
\( {middleBorder} \){menuItemIcon}${prefix}codeuse            → Développeuse
\( {middleBorder} \){menuItemIcon}${prefix}visionnaire        → Visionnaire
\( {middleBorder} \){menuItemIcon}${prefix}milliardaire       → Milliardaire
\( {middleBorder} \){menuItemIcon}${prefix}puissante          → Puissante
\( {middleBorder} \){menuItemIcon}${prefix}vainqueuse         → Vainqueuse
\( {middleBorder} \){menuItemIcon}${prefix}madame             → Madame
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${maleRanksMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}rankgay           → Top gay
\( {middleBorder} \){menuItemIcon}${prefix}rankidiot         → Top idiot
\( {middleBorder} \){menuItemIcon}${prefix}rankgenie         → Top génie
\( {middleBorder} \){menuItemIcon}${prefix}rankotaku         → Top otaku
\( {middleBorder} \){menuItemIcon}${prefix}rankfidele        → Top fidèle
\( {middleBorder} \){menuItemIcon}${prefix}rankinfidele      → Top infidèle
\( {middleBorder} \){menuItemIcon}${prefix}rankcocu          → Top cocu
\( {middleBorder} \){menuItemIcon}${prefix}ranksuiveur       → Top suiveur
\( {middleBorder} \){menuItemIcon}${prefix}ranksexy          → Top sexy
\( {middleBorder} \){menuItemIcon}${prefix}rankriche         → Top riche
\( {middleBorder} \){menuItemIcon}${prefix}rankpauvre        → Top pauvre
\( {middleBorder} \){menuItemIcon}${prefix}rankfort          → Top puissant
\( {middleBorder} \){menuItemIcon}${prefix}rankseducteur     → Top séducteur
\( {middleBorder} \){menuItemIcon}${prefix}rankalpha         → Top alpha
\( {middleBorder} \){menuItemIcon}${prefix}rankintello       → Top intello
\( {middleBorder} \){menuItemIcon}${prefix}rankbosseur       → Top bosseur
\( {middleBorder} \){menuItemIcon}${prefix}rankfier          → Top fier
\( {middleBorder} \){menuItemIcon}${prefix}rankcanon         → Top beau gosse
\( {middleBorder} \){menuItemIcon}${prefix}rankmalin         → Top rusé
\( {middleBorder} \){menuItemIcon}${prefix}rankdrôle         → Top drôle
\( {middleBorder} \){menuItemIcon}${prefix}rankcharismatique → Top charismatique
\( {middleBorder} \){menuItemIcon}${prefix}rankvisionnaire   → Top visionnaire
\( {middleBorder} \){menuItemIcon}${prefix}rankpuissant      → Top puissant
\( {middleBorder} \){menuItemIcon}${prefix}rankvainqueur     → Top vainqueur
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${femaleRanksMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}ranklesbienne     → Top lesbienne
\( {middleBorder} \){menuItemIcon}${prefix}rankidiote        → Top idiote
\( {middleBorder} \){menuItemIcon}${prefix}rankgenie         → Top génie
\( {middleBorder} \){menuItemIcon}${prefix}rankotaku         → Top otaku
\( {middleBorder} \){menuItemIcon}${prefix}rankfidele        → Top fidèle
\( {middleBorder} \){menuItemIcon}${prefix}rankinfidele      → Top infidèle
\( {middleBorder} \){menuItemIcon}${prefix}rankcocue         → Top cocue
\( {middleBorder} \){menuItemIcon}${prefix}ranksuiveuse      → Top suiveuse
\( {middleBorder} \){menuItemIcon}${prefix}ranksexy          → Top sexy
\( {middleBorder} \){menuItemIcon}${prefix}rankriche         → Top riche
\( {middleBorder} \){menuItemIcon}${prefix}rankpauvre        → Top pauvre
\( {middleBorder} \){menuItemIcon}${prefix}rankforte         → Top puissante
\( {middleBorder} \){menuItemIcon}${prefix}rankseductrice    → Top séductrice
\( {middleBorder} \){menuItemIcon}${prefix}rankintello       → Top intello
\( {middleBorder} \){menuItemIcon}${prefix}rankbosseuse      → Top bosseuse
\( {middleBorder} \){menuItemIcon}${prefix}rankfiere         → Top fière
\( {middleBorder} \){menuItemIcon}${prefix}rankcanon         → Top canon
\( {middleBorder} \){menuItemIcon}${prefix}rankmaligne       → Top rusée
\( {middleBorder} \){menuItemIcon}${prefix}rankdrôle         → Top drôle
\( {middleBorder} \){menuItemIcon}${prefix}rankcharismatique → Top charismatique
\( {middleBorder} \){menuItemIcon}${prefix}rankvisionnaire   → Top visionnaire
\( {middleBorder} \){menuItemIcon}${prefix}rankpuissante     → Top puissante
\( {middleBorder} \){menuItemIcon}${prefix}rankvainqueuse    → Top vainqueuse
${bottomBorder}
`;

  return menuContent;
}