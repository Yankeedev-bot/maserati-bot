/**
 * Téléchargement Instagram - Édition Prestige
 * Thème Maserati 🏎️👑✨🇨🇮
 * Implémentation directe sans API externe
 * Utilise nayan-video-downloader comme source
 * Créé par yankee Hells 🙂
 */

import axios from 'axios';
import { mediaClient } from '../../utils/httpClient.js';

const BASE_URL = 'https://nayan-video-downloader.vercel.app/ndown';

// Cache haute performance – style Maserati : rapide, efficace, exclusif
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

/**
 * Télécharge un post Instagram (photo, vidéo, carrousel)
 * @param {string} url - Lien du post Instagram
 * @returns {Promise<Object>} Résultat du téléchargement
 */
async function maseratiDl(url) {
  try {
    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return {
        succes: false,
        message: 'Lien Instagram invalide'
      };
    }

    // Vérification cache – zéro attente, comme un V8 Maserati
    const enCache = recupererCache(`ig_download:${url}`);
    if (enCache) {
      return {
        succes: true,
        ...enCache,
        depuisCache: true
      };
    }

    const reponse = await axios.get(`\( {BASE_URL}?url= \){encodeURIComponent(url)}`, {
      timeout: 120000
    });

    if (!reponse.data?.data?.length) {
      return {
        succes: false,
        message: 'Aucun post trouvé ou lien privé/invalide'
      };
    }

    const resultats = [];
    const urlsUniques = new Set();

    // Traitement de chaque média (carrousel inclus)
    for (const item of reponse.data.data) {
      if (urlsUniques.has(item.url)) continue;
      urlsUniques.add(item.url);

      try {
        // Vérification rapide du type via HEAD
        const head = await axios.head(item.url, { timeout: 30000 });
        const typeContenu = head.headers['content-type'] || '';

        // Téléchargement du média
        const mediaReponse = await mediaClient.get(item.url, { timeout: 120000 });

        resultats.push({
          type: typeContenu.startsWith('image/') ? 'photo' : 'video',
          buffer: mediaReponse.data,
          urlOriginal: item.url,
          mime: typeContenu || 'application/octet-stream'
        });
      } catch (errTelech) {
        console.error('[Maserati-IG] Erreur téléchargement média :', errTelech.message);
        // On continue avec les autres médias même si un échoue
      }
    }

    if (resultats.length === 0) {
      return {
        succes: false,
        message: 'Aucun média téléchargeable trouvé'
      };
    }

    const resultatFinal = {
      createur: 'yankee Hells 🙂',
      theme: 'Maserati-Bot Prestige 🏎️👑✨🇨🇮',
      medias: resultats,
      nombre: resultats.length
    };

    enregistrerCache(`ig_download:${url}`, resultatFinal);

    return {
      succes: true,
      ...resultatFinal
    };
  } catch (erreur) {
    console.error('[Maserati-Instagram] Erreur globale :', erreur.message);

    if (erreur.code === 'ECONNABORTED' || erreur.code === 'ETIMEDOUT') {
      return {
        succes: false,
        message: 'Délai dépassé – la publication est peut-être trop lourde ou le serveur lent'
      };
    }

    return {
      succes: false,
      message: 'Erreur lors du téléchargement Instagram : ' + (erreur.message || 'problème inconnu')
    };
  }
}

export {
  maseratiDl
};
