/**
 * Téléchargement & Recherche TikTok - Édition Prestige
 * Thème Maserati 🏎️👑✨🇨🇮
 * Implémentation directe sans API externe
 * Utilise tikwm.com comme source
 * Créé par yankee Hells 🙂
 */

import axios from 'axios';

const BASE_URL = 'https://www.tikwm.com/api';

// Cache haute performance – style Maserati : rapide et exclusif
const cache = new Map();
const DUREE_CACHE = 60 * 60 * 1000; // 1 heure

function recupererCache(cle) {
  const item = cache.get(cle);
  if (!item) return null;
  if (Date.now() - item.timestamp > DUREE_CACHE) {
    cache.delete(cle);
    return null;
  }
  return item.valeur;
}

function enregistrerCache(cle, valeur) {
  if (cache.size >= 1000) {
    const plusAncienne = cache.keys().next().value;
    cache.delete(plusAncienne);
  }
  cache.set(cle, { valeur, timestamp: Date.now() });
}

// Headers optimisés pour tikwm (mobile + langue française)
const HEADERS_TIKWM = {
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'Cookie': 'current_language=fr-FR',
  'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
  'Referer': 'https://www.tikwm.com/'
};

/**
 * Formate la réponse de téléchargement avec style Maserati
 */
function formaterReponseTelechargement(data) {
  const reponse = {
    createur: 'yankee Hells 🙂',
    theme: 'Maserati-Bot Prestige 🏎️👑✨🇨🇮'
  };

  if (data.music_info?.play) {
    reponse.audio = data.music_info.play;
  }

  if (data.images) {
    reponse.type = 'photo';
    reponse.mime = 'image/jpeg';
    reponse.urls = data.images;
  } else {
    reponse.type = 'video';
    reponse.mime = 'video/mp4';
    reponse.urls = [data.play];
  }

  if (data.title) {
    reponse.titre = data.title;
  }

  return reponse;
}

/**
 * Télécharge un contenu TikTok (vidéo ou photo) via son URL
 * @param {string} url - Lien du TikTok (ex: https://www.tiktok.com/@user/video/...)
 * @returns {Promise<Object>} Données du média + infos
 */
async function maseratiDl(url) {
  try {
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return {
        succes: false,
        message: 'Lien TikTok invalide – colle un vrai lien boss !'
      };
    }

    // Vérification cache – zéro attente
    const cleCache = `tiktok_dl:${url}`;
    const enCache = recupererCache(cleCache);
    if (enCache) {
      return { succes: true, ...enCache, depuisCache: true };
    }

    const reponse = await axios.get(`${BASE_URL}/`, {
      params: { url },
      headers: HEADERS_TIKWM,
      timeout: 120000
    });

    if (!reponse.data?.data) {
      return {
        succes: false,
        message: 'Impossible de récupérer les données du TikTok'
      };
    }

    const resultat = formaterReponseTelechargement(reponse.data.data);
    enregistrerCache(cleCache, resultat);

    return {
      succes: true,
      ...resultat
    };
  } catch (erreur) {
    console.error('[Maserati-TikTok DL] Erreur :', erreur.message);
    return {
      succes: false,
      message: 'Erreur lors du téléchargement TikTok : ' + (erreur.message || 'problème inconnu')
    };
  }
}

/**
 * Recherche de vidéos TikTok et retourne un résultat aléatoire (ou le premier)
 * @param {string} recherche - Terme de recherche (ex: "afrobeats dance", "abidjan vibe")
 * @returns {Promise<Object>} Un média aléatoire des résultats
 */
async function maseratiSearch(recherche) {
  try {
    if (!recherche || typeof recherche !== 'string' || recherche.trim() === '') {
      return {
        succes: false,
        message: 'Recherche invalide – envoie un vrai terme boss !'
      };
    }

    const cleCache = `tiktok_search:${recherche.trim().toLowerCase()}`;
    const enCache = recupererCache(cleCache);
    if (enCache) {
      return { succes: true, ...enCache, depuisCache: true };
    }

    const reponse = await axios.post(`${BASE_URL}/feed/search`, {
      keywords: recherche,
      count: 5,
      cursor: 0,
      HD: 1
    }, {
      headers: HEADERS_TIKWM,
      timeout: 120000
    });

    if (!reponse.data?.data?.videos?.length) {
      return {
        succes: false,
        message: 'Aucun TikTok trouvé pour cette recherche'
      };
    }

    // On prend un résultat aléatoire pour varier le plaisir
    const videos = reponse.data.data.videos;
    const videoAleatoire = videos[Math.floor(Math.random() * videos.length)];

    const resultat = {
      createur: 'yankee Hells 🙂',
      theme: 'Maserati-Bot Prestige 🏎️👑✨🇨🇮',
      titre: videoAleatoire.title || 'TikTok sans titre',
      urls: [videoAleatoire.play],
      type: 'video',
      mime: 'video/mp4',
      audio: videoAleatoire.music_info?.play
    };

    enregistrerCache(cleCache, resultat);

    return {
      succes: true,
      ...resultat
    };
  } catch (erreur) {
    console.error('[Maserati-TikTok Search] Erreur :', erreur.message);
    return {
      succes: false,
      message: 'Erreur lors de la recherche TikTok : ' + (erreur.message || 'problème inconnu')
    };
  }
}

export {
  maseratiSearch,
  maseratiDl
};
