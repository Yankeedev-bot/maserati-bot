/**
 * Menu Intelligence Artificielle Prestige - Édition Maserati
 * Chatbots IA, génération texte & outils cognitifs – cerveau V12 du paddock
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

export default async function menuIa(
  prefix,
  botName = "MaseratiBot",
  userName = "Pilote",
  {
    header = `╭┈⊰ 🏎️ 『 *${botName}* 』\n┊Salut, #user#! Active le cerveau trident.\n╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯`,
    menuTopBorder = "╭┈",
    bottomBorder = "╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯",
    menuTitleIcon = "🏁",
    menuItemIcon = "• 🔹",
    separatorIcon = "🔱",
    middleBorder = "┊",
    chatBotMenuTitle = "🤖 IA & ASSISTANTS MC20",
    textMenuTitle = "✍️ GÉNÉRATION DE TEXTE V8",
    toolsMenuTitle = "🛠️ OUTILS COGNITIFS PRESTIGE"
  } = {}
) {
  const formattedHeader = header.replace(/#user#/g, userName);

  return `${formattedHeader}

\( {menuTopBorder} \){separatorIcon} *${chatBotMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}gemma          → Assistant Gemma prestige
\( {middleBorder} \){menuItemIcon}${prefix}gemma2         → Gemma 2 – boost vitesse
\( {middleBorder} \){menuItemIcon}${prefix}codegemma      → Codeur IA ultra-précis
\( {middleBorder} \){menuItemIcon}${prefix}qwen           → Qwen – cerveau chinois luxe
\( {middleBorder} \){menuItemIcon}${prefix}qwen2          → Qwen 2 – version améliorée
\( {middleBorder} \){menuItemIcon}${prefix}qwen3          → Qwen 3 – nouvelle génération
\( {middleBorder} \){menuItemIcon}${prefix}qwencoder      → Qwen Code – programmation
\( {middleBorder} \){menuItemIcon}${prefix}llama          → Llama – puissance brute
\( {middleBorder} \){menuItemIcon}${prefix}llama3         → Llama 3 – top tier
\( {middleBorder} \){menuItemIcon}${prefix}phi            → Phi – compact & rapide
\( {middleBorder} \){menuItemIcon}${prefix}phi3           → Phi 3 – mini génie
\( {middleBorder} \){menuItemIcon}${prefix}yi             → Yi – IA asiatique premium
\( {middleBorder} \){menuItemIcon}${prefix}kimi           → Kimi – conversation fluide
\( {middleBorder} \){menuItemIcon}${prefix}kimik2         → Kimi K2 – version boostée
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${textMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}cog            → Cognima – texte intelligent
\( {middleBorder} \){menuItemIcon}${prefix}mistral        → Mistral – prose élégante
\( {middleBorder} \){menuItemIcon}${prefix}magistral      → Magistral – style maître
\( {middleBorder} \){menuItemIcon}${prefix}baichuan       → Baichuan – texte chinois luxe
\( {middleBorder} \){menuItemIcon}${prefix}marin          → Marin – narration fluide
\( {middleBorder} \){menuItemIcon}${prefix}rakutenai      → Rakuten AI – commerce & texte
\( {middleBorder} \){menuItemIcon}${prefix}rocket         → Rocket – génération rapide
\( {middleBorder} \){menuItemIcon}${prefix}swallow        → Swallow – texte agile
\( {middleBorder} \){menuItemIcon}${prefix}falcon         → Falcon – puissance brute
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *${toolsMenuTitle}*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}ideias         → Brainstorming trident
\( {middleBorder} \){menuItemIcon}${prefix}explicar       → Explications claires MC20
\( {middleBorder} \){menuItemIcon}${prefix}resumir        → Résumé ultra-précis
\( {middleBorder} \){menuItemIcon}${prefix}corrigir       → Correction orthographe & style
\( {middleBorder} \){menuItemIcon}${prefix}resumirurl     → Résumé lien web
\( {middleBorder} \){menuItemIcon}${prefix}resumirchat <nb> → Résumé conversation
\( {middleBorder} \){menuItemIcon}${prefix}recomendar <type> <genre> → Suggestions luxe
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *🔮 HOROSCOPE & MYSTICISME*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}horoscopo <signe> → Ton horoscope du jour
\( {middleBorder} \){menuItemIcon}${prefix}signos          → Liste signes astrologiques
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *💬 DÉBATS & ARGUMENTATION*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}debater <thème> → Débat IA puissance
${bottomBorder}

\( {menuTopBorder} \){separatorIcon} *📖 HISTOIRES INTERACTIVES*
${middleBorder}
\( {middleBorder} \){menuItemIcon}${prefix}aventure <genre> → Lance aventure interactive
\( {middleBorder} \){menuItemIcon}${prefix}aventure choix <1/2/3> → Fais ton choix
\( {middleBorder} \){menuItemIcon}${prefix}aventure status → État de l’aventure
\( {middleBorder} \){menuItemIcon}${prefix}aventure quitter → Arrêter l’histoire
${middleBorder}
\( {middleBorder} \){menuTitleIcon} *Alias : historia* ${menuTitleIcon}
${bottomBorder}
`;
}