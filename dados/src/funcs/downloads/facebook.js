/**
 * Téléchargement Vidéo Facebook - Édition Prestige
 * Thème Maserati 🏎️👑✨🇨🇮
 * Implémentation directe sans API externe
 * Utilise nayan-video-downloader comme source
 * Créé par yankee Hells 🙂
 */

import axios from 'axios';
import { mediaClient } from '../../utils/httpClient.js';

const BASE_URL = 'https://nayan-video-downloader.vercel.app';

// Cache optimisé (style Maserati : rapide et efficace)
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
 * Télécharge une vidéo Facebook en haute qualité (HD si disponible)
 * @param {string} url - Lien de la publication/vidéo Facebook
 * @returns {Promise<Object>} Résultat du téléchargement
 */
async function telechargerHD(url) {
  try {
    // Vérification cache – vitesse Maserati
    const enCache = recupererCache(`fb_download:${url}`);
    if (enCache) return enCache;

    const reponse = await axios.get(`${BASE_URL}/ndown`, {
      params: { url },
      timeout: 120000
    });

    if (!reponse.data.status || !reponse.data.data) {
      return {
        succes: false,
        message: 'Impossible de traiter la vidéo Facebook'
      };
    }

    const videos = reponse.data.data.map(video => ({
      resolution: video.resolution,
      miniature: video.thumbnail,
      url: video.url,
      doitRendre: video.shouldRender
    }));

    let videoSelectionnee = null;
    
    // Priorité qualité – comme on choisit le meilleur bolide
    const priorites = ['1080p', '720p (HD)', '720p', '480p', '360p'];
    
    // On cherche la meilleure qualité disponible et directe
    for (const priorite of priorites) {
      const trouve = videos.find(v => 
        v.resolution === priorite && 
        !v.url.startsWith('/') && 
        !v.doitRendre
      );
      if (trouve) {
        videoSelectionnee = trouve;
        break;
      }
    }
    
    // Plan B : n’importe quelle qualité directe
    if (!videoSelectionnee) {
      videoSelectionnee = videos.find(v => !v.url.startsWith('/') && !v.doitRendre);
    }
    
    // Si rien de direct n’est trouvé
    if (!videoSelectionnee) {
      return {
        succes: false,
        message: 'Vidéo non disponible en téléchargement direct. Facebook bloque cet accès.'
      };
    }

    console.log(`[Maserati-FB] Téléchargement depuis : ${videoSelectionnee.url}`);
    console.log(`[Maserati-FB] Qualité sélectionnée : ${videoSelectionnee.resolution}`);

    // Téléchargement du fichier vidéo
    const reponseVideo = await mediaClient.get(videoSelectionnee.url, {
      timeout: 180000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    const resultat = {
      succes: true,
      buffer: Buffer.from(reponseVideo.data),
      resolution: videoSelectionnee.resolution,
      miniature: videoSelectionnee.miniature,
      toutesQualites: videos,
      nomFichier: `maserati_facebook_${videoSelectionnee.resolution}.mp4`
    };

    enregistrerCache(`fb_download:${url}`, resultat);

    return resultat;
  } catch (erreur) {
    console.error('Erreur Maserati-Facebook Download:', erreur.message);
    
    if (erreur.response?.status === 404) {
      return {
        succes: false,
        message: 'Vidéo introuvable ou plus disponible'
      };
    }
    
    if (erreur.code === 'ECONNABORTED' || erreur.code === 'ETIMEDOUT') {
      return {
        succes: false,
        message: 'Délai dépassé pendant le téléchargement. La vidéo est peut-être trop lourde.'
      };
    }

    return {
      succes: false,
      message: erreur.message || 'Erreur lors du téléchargement Facebook'
    };
  }
}

export default {
  telechargerHD
};
