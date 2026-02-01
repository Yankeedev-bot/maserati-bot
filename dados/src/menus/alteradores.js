/**
 * Menu Alterador Prestige - Édition Maserati
 * Menu des effets vidéo / audio / image – style circuit luxe
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

export default async function menuAlterador(
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
    middleBorder = "┊",
    videoMenuTitle = "🎬 BOOST VIDÉO MC20",
    audioMenuTitle = "🎵 TUNING AUDIO V8",
    imageMenuTitle = "🖼️ CUSTOM IMAGE TRIDENT"
  } = {}
) {
  const formattedHeader = header.replace(/#user#/g, userName);

  return `${formattedHeader}

\( {menuTopBorder} \){separatorIcon} *${videoMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuTitleIcon} *ÉDITION DE BASE* ${menuTitleIcon}
\( {middleBorder} \){menuItemIcon}${prefix}coupervideo <début> <fin>
\( {middleBorder} \){menuItemIcon}${prefix}tomp3 – Extraire l’audio
${middleBorder}
\( {middleBorder} \){menuTitleIcon} *VITESSE & ACCÉLÉRATION* ${menuTitleIcon}
\( {middleBorder} \){menuItemIcon}${prefix}videorapide – Boost vitesse max
\( {middleBorder} \){menuItemIcon}${prefix}fastvid – Accélération trident
\( {middleBorder} \){menuItemIcon}${prefix}videoslow – Mode ralenti luxe
\( {middleBorder} \){menuItemIcon}${prefix}videolent – Slow-motion MC20
${middleBorder}
\( {middleBorder} \){menuTitleIcon} *EFFETS CIRCUIT* ${menuTitleIcon}
\( {middleBorder} \){menuItemIcon}${prefix}videoreverse – Lecture arrière
\( {middleBorder} \){menuItemIcon}${prefix}videoloop – Boucle infinie
\( {middleBorder} \){menuItemIcon}${prefix}videomute – Silence total
\( {middleBorder} \){menuItemIcon}${prefix}videobw – Noir & blanc prestige
\( {middleBorder} \){menuItemIcon}${prefix}sepia – Filtre vintage paddock
\( {middleBorder} \){menuItemIcon}${prefix}miroir – Reflet latéral
\( {middleBorder} \){menuItemIcon}${prefix}rotation – Pivot 90°/180°
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${imageMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}supfond – Retrait fond auto
\( {middleBorder} \){menuItemIcon}${prefix}upscale – Boost qualité 4K
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${audioMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuTitleIcon} *ÉDITION DE BASE* ${menuTitleIcon}
\( {middleBorder} \){menuItemIcon}${prefix}couperaudi <début> <fin>
\( {middleBorder} \){menuItemIcon}${prefix}vitesse <0.5-3.0> – Régler tempo
\( {middleBorder} \){menuItemIcon}${prefix}normaliser – Équilibrage volume
${middleBorder}
\( {middleBorder} \){menuTitleIcon} *CHANGEMENT DE VOIX* ${menuTitleIcon}
\( {middleBorder} \){menuItemIcon}${prefix}voixgarcon – Timbre jeune
\( {middleBorder} \){menuItemIcon}${prefix}voixfemme – Voix féminine luxe
\( {middleBorder} \){menuItemIcon}${prefix}voixhomme – Voix grave pilote
\( {middleBorder} \){menuItemIcon}${prefix}voixenfant – Timbre enfantin
${middleBorder}
\( {middleBorder} \){menuTitleIcon} *EFFETS VITESSE* ${menuTitleIcon}
\( {middleBorder} \){menuItemIcon}${prefix}acceleration – Turbo vocal
\( {middleBorder} \){menuItemIcon}${prefix}voixrapide – Mode fast & furious
\( {middleBorder} \){menuItemIcon}${prefix}voixlente – Slow & classy
${middleBorder}
\( {middleBorder} \){menuTitleIcon} *BASS & GRAVE BOOST* ${menuTitleIcon}
\( {middleBorder} \){menuItemIcon}${prefix}bass – Boost grave standard
\( {middleBorder} \){menuItemIcon}${prefix}bass2 – Grave profond
\( {middleBorder} \){menuItemIcon}${prefix}bass3 – Sub-bass MC20
\( {middleBorder} \){menuItemIcon}${prefix}bassbn <1-20> – Niveau custom
\( {middleBorder} \){menuItemIcon}${prefix}grave – Ultra-grave
${middleBorder}
\( {middleBorder} \){menuTitleIcon} *EFFETS SPÉCIAUX* ${menuTitleIcon}
\( {middleBorder} \){menuItemIcon}${prefix}echo – Réverbération paddock
\( {middleBorder} \){menuItemIcon}${prefix}reverb – Écho luxe
\( {middleBorder} \){menuItemIcon}${prefix}reverse – Audio inversé
\( {middleBorder} \){menuItemIcon}${prefix}chorus – Effet choral
\( {middleBorder} \){menuItemIcon}${prefix}phaser – Phase psyché
\( {middleBorder} \){menuItemIcon}${prefix}flanger – Effet flanger
\( {middleBorder} \){menuItemIcon}${prefix}tremolo – Pulsation
\( {middleBorder} \){menuItemIcon}${prefix}vibrato – Vibrato vocal
${middleBorder}
\( {middleBorder} \){menuTitleIcon} *VOLUME & ÉGALISATION* ${menuTitleIcon}
\( {middleBorder} \){menuItemIcon}${prefix}boostvolume – Amplification max
\( {middleBorder} \){menuItemIcon}${prefix}equalizer – Égaliseur custom
\( {middleBorder} \){menuItemIcon}${prefix}overdrive – Distorsion rock
\( {middleBorder} \){menuItemIcon}${prefix}pitch – Modification tonalité
\( {middleBorder} \){menuItemIcon}${prefix}lowpass – Filtre basse fréquence
${bottomBorder}
`;
}
