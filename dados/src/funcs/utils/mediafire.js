/**
 * Module Téléchargement MediaFire Prestige - Édition Maserati
 * Récupère infos et lien direct sans API externe
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import axios from 'axios';
import { parseHTML } from 'linkedom';

// ── CONFIGURATION PRESTIGE ──
const CONFIG_MEDIAFIRE_MASERATI = {
  USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  CACHE_TTL_MS: 30 * 60 * 1000,   // 30 min – pas de surcharge sur le circuit
  CACHE_MAX_ENTREES: 200,         // Limite garage – on garde que les meilleurs
  TIMEOUT_MS: 60000               // 60s – pas de panne en pleine course
};

// Cache luxe – stockage paddock
const cachePrestige = new Map();

function obtenirCache(key) {
  const entree = cachePrestige.get(key);
  if (!entree) return null;
  if (Date.now() - entree.timestamp > CONFIG_MEDIAFIRE_MASERATI.CACHE_TTL_MS) {
    cachePrestige.delete(key);
    return null;
  }
  return entree.valeur;
}

function definirCache(key, valeur) {
  if (cachePrestige.size >= CONFIG_MEDIAFIRE_MASERATI.CACHE_MAX_ENTREES) {
    const plusAncienne = cachePrestige.keys().next().value;
    cachePrestige.delete(plusAncienne);
  }
  cachePrestige.set(key, { valeur, timestamp: Date.now() });
}

const TYPES_MIME_PRESTIGE = {
  'zip': 'application/zip',
  'rar': 'application/x-rar-compressed',
  '7z': 'application/x-7z-compressed',
  'pdf': 'application/pdf',
  'doc': 'application/msword',
  'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
  'gif': 'image/gif',
  'mp3': 'audio/mpeg',
  'wav': 'audio/wav',
  'mp4': 'video/mp4',
  'mkv': 'video/x-matroska',
  'exe': 'application/x-msdownload',
  'apk': 'application/vnd.android.package-archive'
};

function obtenirTypeMime(extension) {
  return TYPES_MIME_PRESTIGE[extension?.toLowerCase()] || 'application/octet-stream';
}

function decoderBase64(str) {
  try {
    return Buffer.from(str, 'base64').toString('utf-8');
  } catch {
    return null;
  }
}

/**
 * Récupère infos et lien direct d’un fichier MediaFire – vitesse MC20
 * @param {string} url - Lien MediaFire complet
 * @returns {Promise<Object>} Infos prestige du fichier
 */
async function maseratiGetMediaFireInfo(url) {
  try {
    if (!url || typeof url !== 'string' || !url.includes('mediafire.com')) {
      return { succes: false, message: '❌ URL invalide – envoie un vrai lien MediaFire !' };
    }

    // Vérifier cache paddock
    const cleCache = `mediafire:${url}`;
    const cache = obtenirCache(cleCache);
    if (cache) {
      return { succes: true, ...cache, depuisCache: true };
    }

    console.log(`[Maserati-MediaFire] Recherche infos prestige → ${url}`);

    let html, lienDownload = null;

    // Tentative accès direct – voie rapide
    try {
      const reponse = await axios.get(url, {
        headers: {
          'User-Agent': CONFIG_MEDIAFIRE_MASERATI.USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5'
        },
        timeout: CONFIG_MEDIAFIRE_MASERATI.TIMEOUT_MS
      });
      html = reponse.data;
    } catch (errDirect) {
      console.log('[Maserati-MediaFire] Voie directe bloquée – passage par traducteur Google');
      
      const partieUrl = url.replace(/https?:\/\/(www\.)?mediafire\.com\/?/, '');
      const urlTraduite = `https://www-mediafire-com.translate.goog/${partieUrl}?_x_tr_sl=en&_x_tr_tl=fr&_x_tr_hl=en&_x_tr_pto=wapp`;
      
      const reponse = await axios.get(urlTraduite, {
        headers: { 'User-Agent': CONFIG_MEDIAFIRE_MASERATI.USER_AGENT },
        timeout: CONFIG_MEDIAFIRE_MASERATI.TIMEOUT_MS
      });
      html = reponse.data;
    }

    const { document } = parseHTML(html);

    // Récupération bouton download prestige
    const boutonDownload = document.querySelector('#downloadButton');
    lienDownload = boutonDownload?.getAttribute('href');

    // Tentatives alternatives – comme un pilote qui contourne
    if (!lienDownload || lienDownload.includes('javascript:void(0)')) {
      lienDownload = boutonDownload?.getAttribute('data-href') ||
                     boutonDownload?.getAttribute('data-url') ||
                     boutonDownload?.getAttribute('data-link');

      // Décodage URL brouillée
      const urlBrouillee = boutonDownload?.getAttribute('data-scrambled-url');
      if (urlBrouillee) {
        const decodee = decoderBase64(urlBrouillee);
        if (decodee && decodee.startsWith('http')) lienDownload = decodee;
      }

      // Recherche regex dans HTML – plan B
      if (!lienDownload || lienDownload.includes('javascript:void(0)')) {
        const match = html.match(/href="(https:\/\/download\d+\.mediafire\.com[^"]+)"/);
        if (match) lienDownload = match[1];
      }
    }

    if (!lienDownload || lienDownload.includes('javascript:void(0)') || !lienDownload.startsWith('http')) {
      return {
        succes: false,
        message: '❌ Lien de téléchargement introuvable – fichier supprimé, privé ou bloqué'
      };
    }

    // Extraction infos luxe
    let nomFichier = document.querySelector('.promoDownloadName div')?.getAttribute('title') ||
                     document.querySelector('.dl-btn-label')?.getAttribute('title') ||
                     document.querySelector('.filename')?.textContent?.trim() ||
                     'fichier_prestige_inconnu';

    let tailleFichier = document.querySelector('#downloadButton')?.textContent || '';
    tailleFichier = tailleFichier.replace('Download', '').replace(/[()]/g, '').replace(/\n/g, '').replace(/\s+/g, ' ').trim();
    if (!tailleFichier.match(/\d+(\.\d+)?\s*(KB|MB|GB|TB|B)/i)) tailleFichier = 'Taille inconnue';

    const dateUpload = document.querySelector('.details li:nth-child(2) span')?.textContent?.trim() || 'Date inconnue';
    const extension = nomFichier.split('.').pop()?.toLowerCase() || '';

    const resultat = {
      nomFichier: nomFichier.replace(/\s+/g, ' ').replace(/\n/g, '').trim(),
      taille: tailleFichier,
      dateUpload,
      typeMime: obtenirTypeMime(extension),
      extension,
      lienTelechargement: lienDownload
    };

    definirCache(cleCache, resultat);

    return { succes: true, ...resultat };
  } catch (err) {
    console.error('[Maserati-MediaFire] Erreur :', err.message);

    let msg = '❌ Erreur lors de la récupération du fichier';
    if (err.code === 'ECONNABORTED') {
      msg = '❌ Temps de réponse dépassé – le serveur MediaFire est en pleine course';
    } else if (err.message.includes('timeout')) {
      msg = '❌ Délai dépassé – piste encombrée';
    }

    return { succes: false, message: msg };
  }
}

// Exports prestige
export default { maseratiGetMediaFireInfo };

export {
  maseratiGetMediaFireInfo
};
