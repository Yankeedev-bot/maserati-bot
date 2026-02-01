/**
 * Téléchargement & Recherche SoundCloud - Édition Prestige
 * Thème Maserati 🏎️👑✨🇨🇮
 * Implémentation directe sans API externe
 * Utilise nayan-video-downloader comme source
 * Créé par yankee Hells 🙂
 */

import axios from 'axios';
import { mediaClient } from '../../utils/httpClient.js';

const BASE_URL = 'https://nayan-video-downloader.vercel.app';

// Cache haute performance – style Maserati : rapide, fluide, exclusif
const cache = new Map();
const DUREE_CACHE = 30 * 60 * 1000; // 30 minutes

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
  if (cache.size >= 500) {
    const plusAncienne = cache.keys().next().value;
    cache.delete(plusAncienne);
  }
  cache.set(cle, { valeur, timestamp: Date.now() });
}

/**
 * Télécharge directement une piste SoundCloud via son URL
 * @param {string} url - Lien complet de la piste SoundCloud
 * @returns {Promise<Object>} Buffer audio + métadonnées
 */
async function maseratiDownload(url) {
  try {
    // Vérification cache – accélération maximale
    const cleCache = `sc_download:${url}`;
    const enCache = recupererCache(cleCache);
    if (enCache) return enCache;

    const reponse = await axios.get(`${BASE_URL}/soundcloud`, {
      params: { url },
      timeout: 120000
    });

    if (reponse.data.status !== 200 || !reponse.data.data) {
      return {
        succes: false,
        message: 'Impossible de traiter la piste SoundCloud'
      };
    }

    const data = reponse.data.data;

    // Téléchargement du fichier audio
    const audioReponse = await mediaClient.get(data.download_url, {
      timeout: 120000
    });

    const resultat = {
      succes: true,
      buffer: Buffer.from(audioReponse.data),
      titre: data.title,
      artiste: data.artist,
      miniature: data.thumbnail,
      nomFichier: `${data.title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`
    };

    enregistrerCache(cleCache, resultat);
    return resultat;
  } catch (erreur) {
    console.error('[Maserati-SoundCloud Download] Erreur :', erreur.message);

    if (erreur.response?.status === 404) {
      return {
        succes: false,
        message: 'Piste introuvable sur SoundCloud'
      };
    }

    if (erreur.code === 'ECONNABORTED' || erreur.code === 'ETIMEDOUT') {
      return {
        succes: false,
        message: 'Délai dépassé pendant le téléchargement – la piste est peut-être trop longue'
      };
    }

    return {
      succes: false,
      message: erreur.message || 'Erreur lors du téléchargement SoundCloud'
    };
  }
}

/**
 * Recherche de pistes sur SoundCloud
 * @param {string} recherche - Nom de la musique, artiste ou mots-clés
 * @param {number} limite - Nombre max de résultats (défaut 10)
 * @returns {Promise<Object>} Liste des pistes trouvées
 */
async function maseratiSearch(recherche, limite = 10) {
  try {
    if (!recherche || typeof recherche !== 'string' || recherche.trim() === '') {
      return {
        succes: false,
        message: 'Recherche invalide – envoie un titre ou artiste boss !'
      };
    }

    const cleCache = `sc_search:\( {recherche.trim().toLowerCase()}: \){limite}`;
    const enCache = recupererCache(cleCache);
    if (enCache) return enCache;

    const reponse = await axios.get(`${BASE_URL}/soundcloud-search`, {
      params: {
        name: recherche,
        limit: Math.min(limite, 50)
      },
      timeout: 120000
    });

    if (reponse.data.status !== 200 || !reponse.data.results) {
      return {
        succes: false,
        message: 'Aucun résultat trouvé sur SoundCloud'
      };
    }

    const resultats = reponse.data.results.map(piste => ({
      id: piste.id,
      titre: piste.title,
      artiste: piste.user_id,
      pochette: piste.artwork_url,
      duree: Math.floor(piste.duration / 1000),
      lien: piste.permalink_url,
      ecoutes: piste.playback_count,
      likes: piste.likes_count,
      genre: piste.genre || 'Inconnu',
      dateCreation: piste.created_at
    }));

    const sortie = {
      succes: true,
      recherche,
      total: resultats.length,
      pistes: resultats
    };

    enregistrerCache(cleCache, sortie);
    return sortie;
  } catch (erreur) {
    console.error('[Maserati-SoundCloud Search] Erreur :', erreur.message);
    return {
      succes: false,
      message: 'Erreur lors de la recherche SoundCloud'
    };
  }
}

/**
 * Recherche + Téléchargement automatique de la meilleure piste
 * @param {string} recherche - Nom de la musique ou artiste
 * @returns {Promise<Object>} Buffer + infos piste
 */
async function maseratiSearchDownload(recherche) {
  try {
    await new Promise(r => setTimeout(r, 500)); // Petite pause pour fluidité UI si besoin

    const resultatRecherche = await maseratiSearch(recherche, 1);

    if (!resultatRecherche.succes || !resultatRecherche.pistes?.length) {
      return {
        succes: false,
        message: 'Aucune piste trouvée pour cette recherche'
      };
    }

    const piste = resultatRecherche.pistes[0];

    const resultatDownload = await maseratiDownload(piste.lien);

    if (!resultatDownload.succes) {
      return resultatDownload;
    }

    return {
      succes: true,
      buffer: resultatDownload.buffer,
      recherche,
      piste: {
        id: piste.id,
        titre: piste.titre,
        artiste: piste.artiste,
        pochette: piste.pochette,
        duree: piste.duree,
        lien: piste.lien,
        ecoutes: piste.ecoutes,
        likes: piste.likes,
        genre: piste.genre,
        dateCreation: piste.dateCreation
      },
      titre: resultatDownload.titre,
      artiste: resultatDownload.artiste,
      miniature: resultatDownload.miniature,
      nomFichier: resultatDownload.nomFichier,
      source: 'Maserati-Bot • SoundCloud Prestige 🏎️👑✨🇨🇮',
      cree_par: 'yankee Hells 🙂'
    };
  } catch (erreur) {
    console.error('[Maserati-SoundCloud Combo] Erreur :', erreur.message);
    return {
      succes: false,
      message: erreur.message || 'Erreur lors de la recherche/téléchargement SoundCloud'
    };
  }
}

export default {
  download: maseratiDownload,
  search: maseratiSearch,
  searchDownload: maseratiSearchDownload
};
