/**
 * Module Mélange d’Emojis Prestige - Édition Maserati
 * Crée des stickers emoji fusion via l’API Tenor
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import axios from 'axios';

// ── CONFIGURATION PRESTIGE ──
const CONFIG_EMOJI_MIX = {
  API: {
    BASE_URL: 'https://tenor.googleapis.com/v2',
    CLE: "AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ",
    PARAMETRES_DEFAUT: {
      contentfilter: 'high',
      media_filter: 'png_transparent',
      component: 'proactive',
      collection: 'emoji_kitchen_v5',
    },
  },
  RETENTATIVE: {
    MAX_TENTATIVES: 3,
    DELAI_MS: 1000,
  },
};

// ── ERREUR CUSTOM LUXE ──
class ErreurMelangeMaserati extends Error {
  constructor(message) {
    super(message);
    this.name = 'ErreurMelangeMaserati';
  }
}

// ── CLIENT API TENOR – MOTEUR TRIDENT ──
class ClientEmojiMixMaserati {
  constructor(cleApi) {
    if (!cleApi) {
      throw new ErreurMelangeMaserati('Clé API Tenor non configurée – vérifie ton garage !');
    }

    // Instance Axios optimisée prestige
    this.api = axios.create({
      baseURL: CONFIG_EMOJI_MIX.API.BASE_URL,
      params: {
        key: cleApi,
        ...CONFIG_EMOJI_MIX.API.PARAMETRES_DEFAUT,
      },
    });
  }

  /**
   * Recherche une fusion d’emojis avec système de retentative
   * @param {string} emoji1 Premier emoji
   * @param {string} emoji2 Second emoji
   * @returns {Promise<string[]>} Liste d’URLs d’images fusionnées
   */
  async chercherFusion(emoji1, emoji2) {
    const requete = `\( {emoji1}_ \){emoji2}`;

    for (let tentative = 1; tentative <= CONFIG_EMOJI_MIX.RETENTATIVE.MAX_TENTATIVES; tentative++) {
      try {
        const reponse = await this.api.get('/featured', {
          params: { q: requete },
        });

        if (!reponse.data?.results?.length) {
          throw new ErreurMelangeMaserati('Cette combinaison d’emojis n’existe pas sur le circuit.');
        }

        return reponse.data.results.map(res => res.url);
      } catch (err) {
        // Gestion rate-limit 429 – attente exponentielle
        if (err.response?.status === 429 && tentative < CONFIG_EMOJI_MIX.RETENTATIVE.MAX_TENTATIVES) {
          console.warn(`[Maserati-EmojiMix] Limite atteinte – nouvelle tentative dans ${tentative}s...`);
          await new Promise(r => setTimeout(r, CONFIG_EMOJI_MIX.RETENTATIVE.DELAI_MS * tentative));
        } else {
          throw new ErreurMelangeMaserati(`Erreur lors de la recherche emoji : ${err.message}`);
        }
      }
    }
  }
}

// Instance unique – singleton prestige
const clientUnique = new ClientEmojiMixMaserati(CONFIG_EMOJI_MIX.API.CLE);

/**
 * Mélange deux emojis et retourne une URL aléatoire prestige
 * @param {string} emoji1 Premier emoji
 * @param {string} emoji2 Second emoji
 * @returns {Promise<string>} URL de l’image fusionnée
 */
async function maseratiMelangerEmojis(emoji1, emoji2) {
  try {
    const urls = await clientUnique.chercherFusion(emoji1, emoji2);

    // Sélection aléatoire – comme un tirage au sort sur le podium
    const urlChoisie = urls[Math.floor(Math.random() * urls.length)];

    console.log(`[Maserati-EmojiMix] Fusion réussie : ${emoji1} + ${emoji2} → ${urlChoisie}`);

    return urlChoisie;
  } catch (err) {
    console.error(`[Maserati-EmojiMix] Erreur finale : ${err.message}`);
    throw err; // Laisse l’appelant gérer l’erreur
  }
}

// Exports prestige
export default maseratiMelangerEmojis;

export {
  maseratiMelangerEmojis,
  ClientEmojiMixMaserati,
  ErreurMelangeMaserati
};
