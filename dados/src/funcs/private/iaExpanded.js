/**
 * Commandes IA Étendues Prestige - Édition Maserati
 * Horóscopo quotidien, Débats intellectuels, Histoires interactives
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FICHIER_HISTOIRES = path.join(__dirname, '../../../database/stories.json');

// --- SIGNES DU ZODIAQUE (PRESTIGE) ---

const SIGNES_MASERATI = {
  aries:     { emoji: '♈', nom: 'Bélier', periode: '21/03 - 19/04', element: '🔥 Feu' },
  taureau:   { emoji: '♉', nom: 'Taureau', periode: '20/04 - 20/05', element: '🌍 Terre' },
  gemeaux:   { emoji: '♊', nom: 'Gémeaux', periode: '21/05 - 20/06', element: '💨 Air' },
  cancer:    { emoji: '♋', nom: 'Cancer', periode: '21/06 - 22/07', element: '💧 Eau' },
  lion:      { emoji: '♌', nom: 'Lion', periode: '23/07 - 22/08', element: '🔥 Feu' },
  vierge:    { emoji: '♍', nom: 'Vierge', periode: '23/08 - 22/09', element: '🌍 Terre' },
  balance:   { emoji: '♎', nom: 'Balance', periode: '23/09 - 22/10', element: '💨 Air' },
  scorpion:  { emoji: '♏', nom: 'Scorpion', periode: '23/10 - 21/11', element: '💧 Eau' },
  sagittaire:{ emoji: '♐', nom: 'Sagittaire', periode: '22/11 - 21/12', element: '🔥 Feu' },
  capricorne:{ emoji: '♑', nom: 'Capricorne', periode: '22/12 - 19/01', element: '🌍 Terre' },
  verseau:   { emoji: '♒', nom: 'Verseau', periode: '20/01 - 18/02', element: '💨 Air' },
  poissons:  { emoji: '♓', nom: 'Poissons', periode: '19/02 - 20/03', element: '💧 Eau' }
};

// Alias naturels (français + portugais courants)
const ALIAS_SIGNES = {
  'bélier':    'aries',     'aries':     'aries',
  'taureau':   'taureau',
  'gémeaux':   'gemeaux',   'gemeos':    'gemeaux',
  'cancer':    'cancer',
  'lion':      'lion',      'leao':      'lion',
  'vierge':    'vierge',
  'balance':   'balance',   'libra':     'balance',
  'scorpion':  'scorpion',  'escorpiao': 'scorpion',
  'sagittaire':'sagittaire','sagitario': 'sagittaire',
  'capricorne':'capricorne','capricornio':'capricorne',
  'verseau':   'verseau',   'aquario':   'verseau',
  'poissons':  'poissons',  'peixes':    'poissons'
};

// --- HOROSCOPE QUOTIDIEN PRESTIGE ---

const obtenirPromptHoroscope = (signeKey) => {
  const signe = SIGNES_MASERATI[signeKey];
  const aujourdHui = new Date().toLocaleDateString('fr-FR');

  return `Tu es un astrologue mystique et charismatique de luxe. Crée l’horoscope du jour pour le signe \( {signe.nom} ( \){signe.emoji}) pour le ${aujourdHui}.

Inclure :
1. Prévision générale (2-3 phrases)
2. Amour & relations (1-2 phrases)
3. Travail & finances (1-2 phrases)
4. Santé & bien-être (1 phrase)
5. Conseil du jour
6. Numéros chanceux (3 nombres entre 1-60)
7. Couleur porte-bonheur

Style mystique mais positif et puissant. Utilise un langage élégant et poétique.
Format exact (garde les emojis) :

🌟 *PRÉVISION GÉNÉRALE*
[texte]

❤️ *AMOUR*
[texte]

💼 *TRAVAIL & FINANCES*
[texte]

🧘 *SANTÉ*
[texte]

💡 *CONSEIL DU JOUR*
[texte]

🔢 *NUMÉROS CHANCEUX* : [n1], [n2], [n3]
🎨 *COULEUR PORTE-BONHEUR* : [couleur]`;
};

const maseratiGenererHoroscope = async (signeInput, fonctionIA, prefixe = '/') => {
  const signeKey = ALIAS_SIGNES[signeInput.toLowerCase()];

  if (!signeKey) {
    const listeSignes = Object.values(SIGNES_MASERATI)
      .map(s => `\( {s.emoji} * \){s.nom}* - ${s.periode}`)
      .join('\n');
    return {
      succes: false,
      message: `❌ Signe invalide !\n\n🔮 *SIGNES PRESTIGE DISPONIBLES :*\n${listeSignes}\n\n💡 Utilisation : ${prefixe}horoscope <signe>`
    };
  }

  const signe = SIGNES_MASERATI[signeKey];

  if (!fonctionIA) {
    return { succes: false, message: '❌ Fonction IA non disponible !' };
  }

  try {
    const prompt = obtenirPromptHoroscope(signeKey);
    const reponse = await fonctionIA(prompt);

    const aujourdhui = new Date().toLocaleDateString('fr-FR');
    const entete = `${signe.emoji} *HOROSCOPE ${signe.nom.toUpperCase()}*\n` +
                   `📅 ${aujourdhui} | ${signe.element}\n` +
                   `━━━━━━━━━━━━━━━━━━━\n\n`;

    return {
      succes: true,
      message: entete + reponse
    };
  } catch (err) {
    console.error('[Maserati-Horoscope] Erreur :', err.message);
    return { succes: false, message: '❌ Erreur lors de la génération de l’horoscope. Réessaie !' };
  }
};

// --- DÉBAT INTELLECTUEL PRESTIGE ---

const obtenirPromptDebat = (theme) => {
  return `Tu es un débatteur intellectuel impartial et élégant. Présente un débat complet et équilibré sur le thème : "${theme}"

Structure exacte :

⚔️ *DÉBAT : ${theme.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━

👍 *ARGUMENTS EN FAVEUR :*
1. [argument fort + explication courte]
2. [argument fort + explication courte]
3. [argument fort + explication courte]

👎 *ARGUMENTS CONTRE :*
1. [argument fort + explication courte]
2. [argument fort + explication courte]
3. [argument fort + explication courte]

📊 *FAITS & DONNÉES CLÉS :*
• [fait pertinent 1]
• [fait pertinent 2]

🤔 *CONCLUSION ÉQUILIBRÉE :*
[conclusion neutre présentant les deux côtés]

💭 *QUESTION POUR RÉFLÉCHIR :*
[une question ouverte pour le lecteur]

Reste objectif, utilise des faits quand possible, garde l’impartialité. Style classe et puissant.`;
};

const maseratiGenererDebat = async (theme, fonctionIA, prefixe = '/') => {
  if (!theme || theme.trim().length < 3) {
    return {
      succes: false,
      message: `❌ Indique un thème pour le débat !\n\n💡 Utilisation : ${prefixe}debat <thème>\n📌 Exemple : ${prefixe}debat réseaux sociaux`
    };
  }

  if (!fonctionIA) {
    return { succes: false, message: '❌ Fonction IA non disponible !' };
  }

  try {
    const prompt = obtenirPromptDebat(theme);
    const reponse = await fonctionIA(prompt);

    return {
      succes: true,
      message: reponse
    };
  } catch (err) {
    console.error('[Maserati-Debat] Erreur :', err.message);
    return { succes: false, message: '❌ Erreur lors de la génération du débat. Réessaie !' };
  }
};

// --- HISTOIRE INTERACTIVE LUXE ---

const chargerHistoires = () => {
  try {
    if (fs.existsSync(FICHIER_HISTOIRES)) {
      return JSON.parse(fs.readFileSync(FICHIER_HISTOIRES, 'utf8'));
    }
  } catch (err) {
    console.error('[Maserati-Histoires] Erreur chargement :', err.message);
  }
  return { actives: {}, terminees: [] };
};

const sauvegarderHistoires = (data) => {
  try {
    const dossier = path.dirname(FICHIER_HISTOIRES);
    if (!fs.existsSync(dossier)) {
      fs.mkdirSync(dossier, { recursive: true });
    }
    fs.writeFileSync(FICHIER_HISTOIRES, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('[Maserati-Histoires] Erreur sauvegarde :', err.message);
  }
};

const GENRES_HISTOIRES = {
  fantasy:    { emoji: '🧙', nom: 'Fantasy', desc: 'Magie, dragons et royaumes enchantés' },
  horreur:    { emoji: '👻', nom: 'Horreur', desc: 'Suspense et terreur' },
  romance:    { emoji: '💕', nom: 'Romance', desc: 'Amour et passions' },
  aventure:   { emoji: '⚔️', nom: 'Aventure', desc: 'Action et exploration' },
  sf:         { emoji: '🚀', nom: 'Science-Fiction', desc: 'Futur et technologie' },
  mystere:    { emoji: '🔍', nom: 'Mystère', desc: 'Énigmes et enquêtes' }
};

const obtenirPromptHistoire = (genreKey, choixPrecedents = [], chapitreActuel = 1) => {
  const genre = GENRES_HISTOIRES[genreKey];
  const estPremier = choixPrecedents.length === 0;

  if (estPremier) {
    return `Tu es un maître conteur d’histoires de luxe. Crée le DÉBUT d’une aventure interactive dans le genre \( {genre.nom} ( \){genre.desc}).

Règles :
1. Présente le décor et le personnage principal de façon captivante
2. Crée une situation qui demande une décision
3. Termine avec EXACTEMENT 3 choix numérotés

Format prestige :

📖 *CHAPITRE 1*
━━━━━━━━━━━━━━━━━━━

[Récit immersif - 3-4 paragraphes]

━━━━━━━━━━━━━━━━━━━
🎭 *QUE FAIS-TU ?*

1️⃣ [Choix 1]
2️⃣ [Choix 2]
3️⃣ [Choix 3]

_Réponds simplement avec le numéro !_`;
  }

  const historiqueChoix = choixPrecedents.map((c, i) => `Chapitre ${i+1} : Choix ${c}`).join('\n');

  return `Tu continues une histoire interactive de luxe dans le genre ${genre.nom}.

Choix précédents du lecteur :
${historiqueChoix}

Dernier choix : ${choixPrecedents[choixPrecedents.length-1]}

${chapitreActuel >= 5 ? 'Ceci est le CHAPITRE FINAL. Conclus l’histoire de façon épique et satisfaisante, sans nouveaux choix.' : 'Crée une suite palpitante avec 3 nouveaux choix.'}

Format :

📖 *CHAPITRE ${chapitreActuel}*
━━━━━━━━━━━━━━━━━━━

[Suite de l’histoire - 2-3 paragraphes]

${chapitreActuel >= 5 ? '🏆 *FIN DE L’AVENTURE*\n\n[Conclusion magistrale]' : `━━━━━━━━━━━━━━━━━━━
🎭 *QUE FAIS-TU ?*

1️⃣ [Choix 1]
2️⃣ [Choix 2]
3️⃣ [Choix 3]

_Réponds avec le numéro !_`}`;
};

const maseratiDemarrerHistoire = async (idGroupe, genreInput, fonctionIA, prefixe = '/') => {
  const genreKey = genreInput.toLowerCase();

  if (!GENRES_HISTOIRES[genreKey]) {
    const listeGenres = Object.entries(GENRES_HISTOIRES)
      .map(([k, g]) => `\( {g.emoji} * \){g.nom}* - ${g.desc}`)
      .join('\n');
    return {
      succes: false,
      message: `📚 *HISTOIRE INTERACTIVE PRESTIGE*\n\n❌ Genre invalide !\n\n🎭 *Genres disponibles :*\n${listeGenres}\n\n💡 Utilisation : ${prefixe}histoire <genre>`
    };
  }

  const data = chargerHistoires();

  if (data.actives[idGroupe]) {
    return {
      succes: false,
      message: `📚 *HISTOIRE INTERACTIVE*\n\n⚠️ Une aventure est déjà en cours !\n\n💡 /histoire choisir <1-3> pour avancer\n💡 /histoire annuler pour arrêter`
    };
  }

  if (!fonctionIA) {
    return { succes: false, message: '❌ Fonction IA non disponible !' };
  }

  try {
    const prompt = obtenirPromptHistoire(genreKey);
    const reponse = await fonctionIA(prompt);

    data.actives[idGroupe] = {
      genre: genreKey,
      chapitre: 1,
      choix: [],
      debutLe: new Date().toISOString(),
      derniereActivite: Date.now()
    };

    sauvegarderHistoires(data);

    const genre = GENRES_HISTOIRES[genreKey];
    const entete = `${genre.emoji} *HISTOIRE INTERACTIVE - ${genre.nom.toUpperCase()}*\n\n`;

    return {
      succes: true,
      message: entete + reponse
    };
  } catch (err) {
    console.error('[Maserati-Histoire] Erreur démarrage :', err.message);
    return { succes: false, message: '❌ Erreur au lancement de l’aventure. Réessaie !' };
  }
};

const maseratiContinuerHistoire = async (idGroupe, choixInput, fonctionIA) => {
  const data = chargerHistoires();
  const histoire = data.actives[idGroupe];

  if (!histoire) {
    return {
      succes: false,
      message: `📚 *HISTOIRE INTERACTIVE*\n\n❌ Aucune aventure en cours !\n\n💡 Lance-en une avec /histoire <genre>`
    };
  }

  const choix = parseInt(choixInput);
  if (isNaN(choix) || choix < 1 || choix > 3) {
    return { succes: false, message: '❌ Choix invalide ! Réponds 1, 2 ou 3.' };
  }

  if (!fonctionIA) {
    return { succes: false, message: '❌ Fonction IA non disponible !' };
  }

  try {
    histoire.choix.push(choix);
    histoire.chapitre++;
    histoire.derniereActivite = Date.now();

    const prompt = obtenirPromptHistoire(histoire.genre, histoire.choix, histoire.chapitre);
    const reponse = await fonctionIA(prompt);

    // Fin de l’histoire ?
    if (histoire.chapitre >= 5) {
      data.terminees.push({
        ...histoire,
        termineeLe: new Date().toISOString()
      });
      delete data.actives[idGroupe];
    }

    sauvegarderHistoires(data);

    const genre = GENRES_HISTOIRES[histoire.genre];
    const entete = `${genre.emoji} *HISTOIRE INTERACTIVE - ${genre.nom.toUpperCase()}*\n\n`;

    return {
      succes: true,
      message: entete + reponse,
      terminee: histoire.chapitre >= 5
    };
  } catch (err) {
    console.error('[Maserati-Histoire] Erreur continuation :', err.message);
    return { succes: false, message: '❌ Erreur pendant l’aventure. Réessaie !' };
  }
};

const maseratiAnnulerHistoire = (idGroupe) => {
  const data = chargerHistoires();

  if (!data.actives[idGroupe]) {
    return { succes: false, message: '❌ Aucune histoire active à annuler !' };
  }

  delete data.actives[idGroupe];
  sauvegarderHistoires(data);

  return {
    succes: true,
    message: '📚 Aventure annulée avec classe !'
  };
};

const maseratiStatutHistoire = (idGroupe) => {
  const data = chargerHistoires();
  const histoire = data.actives[idGroupe];

  if (!histoire) {
    const genres = Object.entries(GENRES_HISTOIRES)
      .map(([k, g]) => `${g.emoji} ${g.nom}`)
      .join(' | ');
    return {
      succes: true,
      active: false,
      message: `📚 *HISTOIRE INTERACTIVE PRESTIGE*\n\n❌ Aucune aventure active.\n\n🎭 Genres : ${genres}\n\n💡 Lance-en une : /histoire <genre>`
    };
  }

  const genre = GENRES_HISTOIRES[histoire.genre];
  return {
    succes: true,
    active: true,
    message: `📚 *HISTOIRE INTERACTIVE*\n\n` +
             `${genre.emoji} Genre : ${genre.nom}\n` +
             `📖 Chapitre : ${histoire.chapitre}/5\n` +
             `🎭 Choix : ${histoire.choix.join(' → ') || 'Aucun pour l’instant'}\n\n` +
             `💡 Avance avec : /histoire choisir <1-3>`
  };
};

// --- EXPORTS MASERATI ---

export {
  SIGNES_MASERATI,
  ALIAS_SIGNES,
  GENRES_HISTOIRES,
  maseratiGenererHoroscope,
  maseratiGenererDebat,
  maseratiDemarrerHistoire,
  maseratiContinuerHistoire,
  maseratiAnnulerHistoire,
  maseratiStatutHistoire
};

export default {
  SIGNES_MASERATI,
  GENRES_HISTOIRES,
  maseratiGenererHoroscope,
  maseratiGenererDebat,
  maseratiDemarrerHistoire,
  maseratiContinuerHistoire,
  maseratiAnnulerHistoire,
  maseratiStatutHistoire
};
