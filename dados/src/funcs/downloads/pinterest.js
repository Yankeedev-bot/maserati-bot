/**
 * Téléchargement & Recherche Pinterest - Édition Prestige
 * Thème Maserati 🏎️👑✨🇨🇮
 * Scraping direct sans API externe
 * Créé par yankee Hells 🙂
 */

import axios from 'axios';

// Base URL Pinterest
const BASE_URL = 'https://br.pinterest.com';

// Cache haute performance – style Maserati : rapide et exclusif
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
  if (cache.size >= 1000) {
    const plusAncienne = cache.keys().next().value;
    cache.delete(plusAncienne);
  }
  cache.set(cle, { valeur, timestamp: Date.now() });
}

// Headers mobiles & desktop pour contourner restrictions
const HEADERS_MOBILE = {
  'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.152 Mobile Safari/537.36'
};

const HEADERS_DESKTOP = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
};

// Regex pour valider les liens Pinterest (pin ou short pin.it)
const REGEX_PIN = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)?pinterest\.\w{2,6}(?:\.\w{2})?\/pin\/\d+|https?:\/\/pin\.it\/[a-zA-Z0-9]+/;

function estLienPinValide(url) {
  return REGEX_PIN.test(url);
}

function extraireIdPin(url) {
  const match = url.match(/(?:\/pin\/(\d+)|\/pin\/([a-zA-Z0-9]+))/);
  return match ? match[1] || match[2] : null;
}

/**
 * Extrait les URLs d'images haute qualité depuis le HTML
 */
function extraireImagesDuHTML(html) {
  const images = new Set();
  const regexImg = /"(https:\/\/i\.pinimg\.com\/[^"]+)"/g;
  let match;
  
  while ((match = regexImg.exec(html)) !== null) {
    let url = match[1];
    // Amélioration automatique de la qualité (736x au lieu de 236x ou thumbnails)
    url = url
      .replace(/236x/g, '736x')
      .replace(/474x/g, '736x')
      .replace(/60x60/g, '736x')
      .replace(/originals/g, '736x'); // tentative pour originals → upscale
    images.add(url);
  }

  return Array.from(images);
}

/**
 * Recherche d'images sur Pinterest (scraping mobile)
 * @param {string} recherche - Terme de recherche (ex: "luxury cars", "abidjan night")
 * @returns {Promise<Object>} Résultats avec URLs haute qualité
 */
async function maseratiSearch(recherche) {
  try {
    if (!recherche || typeof recherche !== 'string' || recherche.trim() === '') {
      return {
        succes: false,
        message: 'Recherche invalide – envoie un vrai terme boss !'
      };
    }

    // Vérification cache – zéro attente
    const cleCache = `pinterest_search:${recherche.toLowerCase().trim()}`;
    const enCache = recupererCache(cleCache);
    if (enCache) {
      return { succes: true, ...enCache, depuisCache: true };
    }

    const reponse = await axios.get(`\( {BASE_URL}/search/pins/?q= \){encodeURIComponent(recherche)}`, {
      headers: HEADERS_MOBILE,
      timeout: 60000
    });

    const urlsImages = extraireImagesDuHTML(reponse.data);

    if (urlsImages.length === 0) {
      return {
        succes: false,
        message: 'Aucune image trouvée pour cette recherche'
      };
    }

    const resultat = {
      createur: 'yankee Hells 🙂',
      theme: 'Maserati-Bot Prestige 🏎️👑✨🇨🇮',
      type: 'image',
      mime: 'image/jpeg',
      recherche,
      nombre: urlsImages.length,
      urls: urlsImages.slice(0, 50) // Limite raisonnable
    };

    enregistrerCache(cleCache, resultat);

    return { succes: true, ...resultat };
  } catch (erreur) {
    console.error('[Maserati-Pinterest Search] Erreur :', erreur.message);
    return {
      succes: false,
      message: 'Erreur lors de la recherche d\'images sur Pinterest'
    };
  }
}

/**
 * Télécharge le contenu d'un pin Pinterest (image ou vidéo)
 * @param {string} url - Lien du pin (ex: https://www.pinterest.com/pin/1234567890/)
 * @returns {Promise<Object>} Infos + URLs médias directs
 */
async function maseratiDl(url) {
  try {
    if (!estLienPinValide(url)) {
      return {
        succes: false,
        message: 'Lien Pinterest invalide. Vérifie que c\'est bien un pin !'
      };
    }

    // Vérification cache
    const cleCache = `pinterest_dl:${url}`;
    const enCache = recupererCache(cleCache);
    if (enCache) {
      return { succes: true, ...enCache, depuisCache: true };
    }

    const idPin = extraireIdPin(url);
    if (!idPin) {
      return {
        succes: false,
        message: 'Impossible d\'extraire l\'ID du pin depuis le lien'
      };
    }

    // Requête GraphQL-like de Pinterest (méthode moderne 2024-2025)
    const params = {
      source_url: `/pin/${idPin}/`,
      data: JSON.stringify({
        options: {
          id: idPin,
          field_set_key: 'auth_web_main_pin',
          noCache: true,
          fetch_visual_search_objects: true
        },
        context: {}
      })
    };

    const reponse = await axios.get(`\( {BASE_URL}/resource/PinResource/get/? \){new URLSearchParams(params)}`, {
      headers: HEADERS_DESKTOP,
      timeout: 60000
    });

    const donneesPin = reponse.data.resource_response?.data;
    if (!donneesPin) {
      return {
        succes: false,
        message: 'Pin non trouvé ou accès bloqué'
      };
    }

    const videos = donneesPin.videos?.video_list;
    const images = donneesPin.images;
    const medias = [];

    if (videos) {
      Object.values(videos).forEach(v => {
        if (v.url) medias.push({ type: 'video', url: v.url });
      });
    }

    if (images) {
      Object.values(images).forEach(img => {
        if (img.url) medias.push({ type: 'image', url: img.url });
      });
    }

    if (medias.length === 0) {
      return {
        succes: false,
        message: 'Ce pin ne contient pas de média téléchargeable'
      };
    }

    const resultat = {
      createur: 'yankee Hells 🙂',
      theme: 'Maserati-Bot Prestige 🏎️👑✨🇨🇮',
      id_pin: idPin,
      type: videos ? 'video' : 'image',
      mime: videos ? 'video/mp4' : 'image/jpeg',
      titre: donneesPin.title || 'Pin Pinterest',
      description: donneesPin.description || '',
      medias
    };

    enregistrerCache(cleCache, resultat);

    return { succes: true, ...resultat };
  } catch (erreur) {
    console.error('[Maserati-Pinterest DL] Erreur :', erreur.message);
    return {
      succes: false,
      message: 'Erreur lors du téléchargement du pin Pinterest'
    };
  }
}

export {
  maseratiSearch,
  maseratiDl
};
