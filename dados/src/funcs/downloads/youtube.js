/**
 * Téléchargement YouTube - Système de File Rotative Multi-Sources
 * Thème Maserati 🏎️👑✨🇨🇮
 * Implémentation directe sans API externe (cog.api.br)
 * N'utilise PAS yt-dlp - uniquement APIs web
 * 
 * Sources disponibles (ordre de priorité dynamique) :
 * - Nayan Video Downloader
 * - Adonix (ytmp3.mobi)
 * - OceanSaver
 * - Y2mate
 * - SaveTube
 * 
 * Créé par yankee Hells 🙂
 */

import axios from 'axios';
import { createDecipheriv } from 'crypto';
import yts from 'yt-search';

// ============================================
// CONFIGURATION GLOBALE - Style Maserati
// ============================================

const CONFIG = {
  TIMEOUT: 60000,
  TELECHARGEMENT_TIMEOUT: 180000,
  DELAI_COOLDOWN_PROVIDER: 5 * 60 * 60 * 1000, // 5 heures
  MAX_ECHECS_AVANT_COOLDOWN: 3,
  USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  // SaveTube config (clé fixe)
  SAVETUBE_CLE_SECRETE: 'C5D58EF67A7584E4A29F6C35BBC4EB12',
  SAVETUBE_ALGORITHME: 'aes-128-cbc'
};

// ============================================
// ÉTAT GLOBAL - File rotative dynamique
// ============================================

const etatProviders = {
  cooldowns: new Map(),          // provider → timestamp fin cooldown
  echecsConsecutifs: new Map(),  // provider → compteur échecs
  ordreMethodes: ['nayan', 'adonix', 'oceansaver', 'y2mate', 'savetube'] // ordre prioritaire dynamique
};

// Cache haute performance – comme un V8 Maserati
const cache = new Map();
const DUREE_CACHE = 60 * 60 * 1000; // 1 heure

// ============================================
// FONCTIONS AUXILIAIRES
// ============================================

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

function hexToBuffer(hex) {
  return Buffer.from(hex, 'hex');
}

function decoderSavetube(encode) {
  try {
    const cle = hexToBuffer(CONFIG.SAVETUBE_CLE_SECRETE);
    const data = Buffer.from(encode, 'base64');
    const iv = data.slice(0, 16);
    const contenu = data.slice(16);
    const decipher = createDecipheriv(CONFIG.SAVETUBE_ALGORITHME, cle, iv);
    const dechiffre = Buffer.concat([decipher.update(contenu), decipher.final()]);
    return JSON.parse(dechiffre.toString());
  } catch (erreur) {
    throw new Error(`Erreur décodage SaveTube : ${erreur.message}`);
  }
}

function extraireIdVideoYoutube(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|v\/|embed\/|user\/[^\/\n\s]+\/)?(?:watch\?v=|v%3D|embed%2F|video%2F)?|youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/|youtube\.com\/playlist\?list=)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function formaterDuree(secondes) {
  const heures = Math.floor(secondes / 3600);
  const minutes = Math.floor((secondes % 3600) / 60);
  const secs = secondes % 60;
  
  if (heures > 0) {
    return `\( {heures}: \){minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `\( {minutes}: \){secs.toString().padStart(2, '0')}`;
}

// ============================================
// GESTION DES PROVIDERS - File rotative intelligente
// ============================================

function estEnCooldown(provider) {
  const jusqua = etatProviders.cooldowns.get(provider);
  if (!jusqua) return false;
  if (Date.now() >= jusqua) {
    etatProviders.cooldowns.delete(provider);
    etatProviders.echecsConsecutifs.delete(provider);
    return false;
  }
  return true;
}

function mettreEnCooldown(provider, raison) {
  const jusqua = Date.now() + CONFIG.DELAI_COOLDOWN_PROVIDER;
  etatProviders.cooldowns.set(provider, jusqua);
  console.log(`⏳ [${provider}] Mis en cooldown ${Math.round(CONFIG.DELAI_COOLDOWN_PROVIDER / 3600000)}h. Raison : ${raison}`);
}

function enregistrerEchec(provider, raison) {
  const count = (etatProviders.echecsConsecutifs.get(provider) || 0) + 1;
  etatProviders.echecsConsecutifs.set(provider, count);
  if (count >= CONFIG.MAX_ECHECS_AVANT_COOLDOWN) {
    mettreEnCooldown(provider, raison);
  }
  return count;
}

function reinitialiserEchecs(provider) {
  etatProviders.echecsConsecutifs.delete(provider);
}

function promouvoirProvider(provider) {
  etatProviders.ordreMethodes = etatProviders.ordreMethodes.filter(n => n !== provider);
  etatProviders.ordreMethodes.unshift(provider);
  console.log(`📈 [${provider}] promu en 1ère position`);
}

function retrograderProvider(provider) {
  etatProviders.ordreMethodes = etatProviders.ordreMethodes.filter(n => n !== provider);
  etatProviders.ordreMethodes.push(provider);
  console.log(`📉 [${provider}] rétrogradé en dernière position`);
}

function avecTimeout(promise, ms, provider) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout sur ${provider} après ${ms}ms`));
    }, ms);
    promise
      .then(result => { clearTimeout(timer); resolve(result); })
      .catch(error => { clearTimeout(timer); reject(error); });
  });
}

function analyserErreur(messageErreur) {
  const msg = messageErreur.toLowerCase();
  return {
    videoIndisponible: msg.includes('unavailable') || msg.includes('private') || msg.includes('removed') || msg.includes('not found'),
    erreurReseau: msg.includes('network') || msg.includes('econnrefused') || msg.includes('timeout') || msg.includes('enotfound'),
    rateLimit: msg.includes('rate') || msg.includes('429') || msg.includes('too many'),
    geoBlock: msg.includes('geo') || msg.includes('country') || msg.includes('region')
  };
}

// ============================================
// PROVIDER : NAYAN VIDEO DOWNLOADER
// ============================================

async function telechargerAvecNayan(url, format = 'mp3') {
  try {
    console.log(`🚀 [Maserati-Nayan] Téléchargement ${format}...`);

    const reponse = await axios.get('https://nayan-video-downloader.vercel.app/ytdown', {
      params: { url },
      timeout: CONFIG.TIMEOUT,
      headers: { 'User-Agent': CONFIG.USER_AGENT }
    });

    const corps = reponse.data?.data || reponse.data;

    if (!corps || !corps.audio || !corps.video) {
      throw new Error('Réponse invalide de Nayan');
    }

    const urlTelechargement = format === 'mp3' ? corps.audio : (corps.video_hd || corps.video);
    if (!urlTelechargement) {
      throw new Error(`URL ${format} indisponible chez Nayan`);
    }

    const reponseFichier = await axios.get(urlTelechargement, {
      responseType: 'arraybuffer',
      timeout: CONFIG.TELECHARGEMENT_TIMEOUT,
      headers: { 'User-Agent': CONFIG.USER_AGENT }
    });

    const buffer = Buffer.from(reponseFichier.data);

    return {
      succes: true,
      buffer,
      titre: corps.title || 'Vidéo YouTube',
      miniature: corps.thumb,
      extension: format === 'mp3' ? 'mp3' : 'mp4',
      taille: buffer.length,
      source: 'nayan'
    };
  } catch (erreur) {
    console.error(`❌ [Maserati-Nayan] Erreur :`, erreur.message);
    return { succes: false, erreur: erreur.message, source: 'nayan' };
  }
}

// ============================================
// PROVIDER : ADONIX (ytmp3.mobi)
// ============================================

async function telechargerAvecAdonix(url) {
  try {
    console.log(`🚀 [Maserati-Adonix] Téléchargement mp3...`);

    const headers = {
      "accept": "*/*",
      "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
      "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "Referer": "https://ytmp3.mobi/",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    };

    const initReponse = await axios.get(`https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Math.random()}`, {
      headers,
      timeout: CONFIG.TIMEOUT
    });

    const init = initReponse.data;

    const idVideo = extraireIdVideoYoutube(url);
    if (!idVideo) throw new Error('ID vidéo introuvable');

    const urlMp3 = init.convertURL + `&v=\( {idVideo}&f=mp3&_= \){Math.random()}`;
    const reponseMp3 = await axios.get(urlMp3, { headers, timeout: CONFIG.TIMEOUT });
    const dataMp3 = reponseMp3.data;

    let info = {};
    let tentatives = 0;
    const maxTentatives = 30;

    while (tentatives < maxTentatives) {
      const progressReponse = await axios.get(dataMp3.progressURL, { headers, timeout: CONFIG.TIMEOUT });
      info = progressReponse.data;

      if (info.progress === 3) break;
      await new Promise(r => setTimeout(r, 2000));
      tentatives++;
    }

    if (info.progress !== 3) throw new Error('Délai dépassé sur Adonix');

    const reponseFichier = await axios.get(dataMp3.downloadURL, {
      responseType: 'arraybuffer',
      timeout: CONFIG.TELECHARGEMENT_TIMEOUT
    });

    const buffer = Buffer.from(reponseFichier.data);

    return {
      succes: true,
      buffer,
      titre: info.title || 'Audio YouTube',
      extension: 'mp3',
      taille: buffer.length,
      source: 'adonix'
    };
  } catch (erreur) {
    console.error(`❌ [Maserati-Adonix] Erreur :`, erreur.message);
    return { succes: false, erreur: erreur.message, source: 'adonix' };
  }
}

// ============================================
// PROVIDER : OCEANSAVER
// ============================================

async function telechargerAvecOceanSaver(url, format = 'mp3') {
  try {
    console.log(`🚀 [Maserati-OceanSaver] Téléchargement ${format}...`);

    const formatsAudio = ['mp3', 'm4a', 'opus', 'webm'];
    const qualite = format === 'mp4' ? '360' : format;
    const estAudio = formatsAudio.includes(qualite.toLowerCase());

    const urlEncode = encodeURIComponent(url);

    const reponseDemande = await axios.get(
      `https://p.oceansaver.in/ajax/download.php?format=\( {qualite}&url= \){urlEncode}`,
      { timeout: CONFIG.TIMEOUT }
    );

    const dataDemande = reponseDemande.data;

    if (!dataDemande.success || !dataDemande.id) {
      throw new Error('Échec obtention ID tâche OceanSaver');
    }

    let tentatives = 0;
    const maxTentatives = 20;

    while (tentatives < maxTentatives) {
      const reponseProgress = await axios.get(
        `https://p.oceansaver.in/api/progress?id=${dataDemande.id}`,
        { timeout: CONFIG.TIMEOUT }
      );

      const progress = reponseProgress.data;

      if (progress?.download_url) {
        const reponseFichier = await axios.get(progress.download_url, {
          responseType: 'arraybuffer',
          timeout: CONFIG.TELECHARGEMENT_TIMEOUT
        });

        const buffer = Buffer.from(reponseFichier.data);

        return {
          succes: true,
          buffer,
          titre: progress.title || 'Média YouTube',
          qualite: estAudio ? qualite : `${qualite}p`,
          extension: estAudio ? 'mp3' : 'mp4',
          taille: buffer.length,
          source: 'oceansaver'
        };
      }

      await new Promise(r => setTimeout(r, 3000));
      tentatives++;
    }

    throw new Error('Délai dépassé sur OceanSaver');
  } catch (erreur) {
    console.error(`❌ [Maserati-OceanSaver] Erreur :`, erreur.message);
    return { succes: false, erreur: erreur.message, source: 'oceansaver' };
  }
}

// ============================================
// PROVIDER : Y2MATE
// ============================================

async function telechargerAvecY2mate(url, format = 'mp3') {
  try {
    console.log(`🚀 [Maserati-Y2mate] Téléchargement ${format}...`);

    const headers = {
      "Referer": "https://y2mate.nu/",
      "Origin": "https://y2mate.nu/",
      "user-agent": CONFIG.USER_AGENT
    };

    const idVideo = extraireIdVideoYoutube(url);
    if (!idVideo) throw new Error('ID vidéo introuvable');

    // Obtenir code auth (exécution JS dynamique)
    const homepage = await axios.get("https://y2mate.nu", { headers, timeout: CONFIG.TIMEOUT });
    const html = homepage.data;

    const scriptValue = html.match(/<script>(.*?)<\/script>/)?.[1];
    if (!scriptValue) throw new Error('Code auth non trouvé dans HTML');

    const srcJs = html.match(/src="(.*?)"/)?.[1];
    if (!srcJs) throw new Error('Chemin JS non trouvé');

    const urlJs = new URL(homepage.request.res.responseUrl || "https://y2mate.nu").origin + srcJs;
    const codeJs = (await axios.get(urlJs, { headers, timeout: CONFIG.TIMEOUT })).data;

    const codeAuth = codeJs.match(/authorization\(\){(.*?)}function/)?.[1];
    if (!codeAuth) throw new Error('Fonction auth non trouvée');

    const codeModifie = codeAuth.replace('id("y2mate").src', `"${urlJs}"`);
    const authFunc = new Function('', `${codeModifie}; return authorization();`);
    const authCode = authFunc();

    const init = await axios.get(`https://d.ecoe.cc/api/v1/init?a=\( {authCode}&_= \){Math.random()}`, {
      headers,
      timeout: CONFIG.TIMEOUT
    });

    if (init.data.error !== "0") throw new Error(`Erreur init Y2mate : ${init.data.error}`);

    const convertUrl = new URL(init.data.convertURL);
    convertUrl.searchParams.append("v", idVideo);
    convertUrl.searchParams.append("f", format);
    convertUrl.searchParams.append("_", Math.random());

    const convert = await axios.get(convertUrl.toString(), { headers, timeout: CONFIG.TIMEOUT });
    let { downloadURL, progressURL, redirectURL } = convert.data;

    if (redirectURL) {
      const redirect = await axios.get(redirectURL, { headers, timeout: CONFIG.TIMEOUT });
      downloadURL = redirect.data.downloadURL;
      progressURL = redirect.data.progressURL;
    }

    let progress = 0;
    let titre = '';

    while (progress !== 3) {
      const progressUrl = new URL(progressURL);
      progressUrl.searchParams.append("_", Math.random());

      const progReponse = await axios.get(progressUrl.toString(), { headers, timeout: CONFIG.TIMEOUT });
      const progData = progReponse.data;

      progress = progData.progress;
      titre = progData.title || titre;

      if (progData.error) throw new Error(`Erreur progression : ${progData.error}`);
      if (progress !== 3) await new Promise(r => setTimeout(r, 5000));
    }

    const fichier = await axios.get(downloadURL, {
      responseType: 'arraybuffer',
      timeout: CONFIG.TELECHARGEMENT_TIMEOUT
    });

    const buffer = Buffer.from(fichier.data);

    return {
      succes: true,
      buffer,
      titre: titre || 'Média YouTube',
      extension: format === 'mp3' ? 'mp3' : 'mp4',
      taille: buffer.length,
      source: 'y2mate'
    };
  } catch (erreur) {
    console.error(`❌ [Maserati-Y2mate] Erreur :`, erreur.message);
    return { succes: false, erreur: erreur.message, source: 'y2mate' };
  }
}

// ============================================
// PROVIDER : SAVETUBE
// ============================================

async function telechargerAvecSavetube(url, format = 'mp3') {
  try {
    console.log(`🚀 [Maserati-SaveTube] Téléchargement ${format}...`);

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36',
      'Referer': 'https://yt.savetube.me/'
    };

    const cdnReponse = await axios.get("https://media.savetube.me/api/random-cdn", { timeout: CONFIG.TIMEOUT });
    const cdn = cdnReponse.data.cdn;

    const infosReponse = await axios.post(`https://${cdn}/v2/info`, { url }, {
      headers: { ...headers, 'Content-Type': 'application/json' },
      timeout: CONFIG.TIMEOUT
    });

    const infos = decoderSavetube(infosReponse.data.data);

    const qualite = format === 'mp3' ? 128 : 360;
    const type = format === 'mp3' ? 'audio' : 'video';

    const downloadReponse = await axios.post(`https://${cdn}/download`, {
      downloadType: type,
      quality: String(qualite),
      key: infos.key
    }, {
      headers: { ...headers, 'Content-Type': 'application/json' },
      timeout: CONFIG.TIMEOUT
    });

    if (!downloadReponse.data.data?.downloadUrl) {
      throw new Error('URL téléchargement non reçue de SaveTube');
    }

    const fichier = await axios.get(downloadReponse.data.data.downloadUrl, {
      responseType: 'arraybuffer',
      timeout: CONFIG.TELECHARGEMENT_TIMEOUT
    });

    const buffer = Buffer.from(fichier.data);

    return {
      succes: true,
      buffer,
      titre: infos.title || 'Média YouTube',
      miniature: infos.thumbnail,
      qualite: `\( {qualite} \){type === "audio" ? "kbps" : "p"}`,
      extension: format === 'mp3' ? 'mp3' : 'mp4',
      taille: buffer.length,
      source: 'savetube'
    };
  } catch (erreur) {
    console.error(`❌ [Maserati-SaveTube] Erreur :`, erreur.message);
    return { succes: false, erreur: erreur.message, source: 'savetube' };
  }
}

// ============================================
// SYSTÈME DE FILE ROTATIVE AVEC FALLBACKS
// ============================================

async function telechargerAvecFallbacks(url, format = 'mp3') {
  const providers = {
    nayan: () => telechargerAvecNayan(url, format),
    adonix: () => telechargerAvecAdonix(url), // Adonix = audio seulement
    oceansaver: () => telechargerAvecOceanSaver(url, format),
    y2mate: () => telechargerAvecY2mate(url, format),
    savetube: () => telechargerAvecSavetube(url, format)
  };

  const erreurs = [];
  let countVideoIndisponible = 0;
  let countErreurReseau = 0;

  for (const nomProvider of etatProviders.ordreMethodes) {
    if (nomProvider === 'adonix' && format !== 'mp3') continue;

    if (estEnCooldown(nomProvider)) {
      console.log(`⏭️ [Maserati] Ignore ${nomProvider} (en cooldown)`);
      continue;
    }

    console.log(`🔄 [Maserati-YouTube] Tentative sur ${nomProvider}...`);

    try {
      const resultat = await avecTimeout(providers[nomProvider](), CONFIG.TIMEOUT, nomProvider);

      if (resultat?.succes) {
        console.log(`✅ Succès sur ${nomProvider} !`);

        reinitialiserEchecs(nomProvider);
        promouvoirProvider(nomProvider);

        return resultat;
      } else {
        throw new Error(resultat?.erreur || 'Échec inconnu');
      }
    } catch (erreur) {
      const msgErreur = erreur?.message || 'Erreur inconnue';
      const analyse = analyserErreur(msgErreur);

      erreurs.push({ provider: nomProvider, erreur: msgErreur, analyse });

      enregistrerEchec(nomProvider, msgErreur.slice(0, 120));
      retrograderProvider(nomProvider);

      if (analyse.videoIndisponible) countVideoIndisponible++;
      if (analyse.erreurReseau) countErreurReseau++;

      if (analyse.rateLimit) {
        console.log('⏳ Rate limit détecté - pause 5s...');
        await new Promise(r => setTimeout(r, 5000));
      }

      if (countVideoIndisponible >= 2) {
        console.log('⚠️ Multiples vidéos indisponibles - arrêt tentative');
        break;
      }

      if (countErreurReseau >= 2) {
        console.log('⚠️ Multiples erreurs réseau - pause avant prochaine');
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }

  console.log('\n📋 Rapport final des échecs :');
  erreurs.forEach((e, i) => console.log(`  ${i+1}. ${e.provider}: ${e.erreur.slice(0, 80)}...`));

  return {
    succes: false,
    erreur: 'Tous les providers ont échoué',
    erreursDetaillees: erreurs,
    recommandation: obtenirRecommandation(erreurs)
  };
}

function obtenirRecommandation(erreurs) {
  const indisponible = erreurs.some(e => e.analyse?.videoIndisponible);
  const geo = erreurs.some(e => e.analyse?.geoBlock);
  const reseau = erreurs.some(e => e.analyse?.erreurReseau);
  const rate = erreurs.some(e => e.analyse?.rateLimit);

  if (indisponible) return 'La vidéo est peut-être privée, supprimée ou indisponible';
  if (geo) return 'Vidéo bloquée par région – utilise un VPN si possible';
  if (reseau) return 'Problèmes de connexion – réessaie dans quelques minutes';
  if (rate) return 'Trop de requêtes – attends quelques minutes';
  return 'Erreur inconnue – vérifie l’URL ou réessaie plus tard';
}

// ============================================
// FONCTIONS PUBLIQUES - API Maserati
// ============================================

/**
 * Recherche une vidéo YouTube
 * @param {string} recherche - Terme (titre, artiste, etc.)
 * @returns {Promise<Object>} Premier résultat pertinent
 */
async function maseratiSearch(recherche) {
  try {
    if (!recherche || typeof recherche !== 'string' || recherche.trim() === '') {
      return { succes: false, message: 'Recherche invalide – envoie un titre boss !' };
    }

    const cleCache = `yt_search:${recherche.trim().toLowerCase()}`;
    const enCache = recupererCache(cleCache);
    if (enCache) return { succes: true, ...enCache, depuisCache: true };

    const resultats = await yts(recherche);
    const video = resultats?.videos?.[0];

    if (!video) {
      return { succes: false, message: 'Aucune vidéo trouvée sur YouTube' };
    }

    const secondes = Number.isFinite(video.seconds) ? video.seconds : 0;
    const dureeFormatee = video.timestamp || formaterDuree(secondes);

    const resultat = {
      succes: true,
      videoId: video.videoId || video.id || '',
      url: video.url,
      titre: video.title,
      description: video.description || '',
      miniature: video.thumbnail || video.image || '',
      duree: { secondes, formatee: dureeFormatee },
      vues: video.views || 0,
      auteur: video.author?.name || 'Inconnu',
      lienAuteur: video.author?.url || ''
    };

    enregistrerCache(cleCache, resultat);
    return resultat;
  } catch (erreur) {
    console.error('[Maserati-YouTube Search] Erreur :', erreur.message);
    return { succes: false, message: 'Erreur recherche YouTube' };
  }
}

/**
 * Télécharge l'audio (MP3) avec file rotative
 * @param {string} url - Lien YouTube
 * @returns {Promise<Object>} Buffer MP3 + infos
 */
async function maseratiMp3(url) {
  try {
    const id = extraireIdVideoYoutube(url);
    if (!id) return { succes: false, message: 'URL YouTube invalide' };

    const cleCache = `yt_mp3:${id}`;
    const enCache = recupererCache(cleCache);
    if (enCache) return { succes: true, ...enCache, depuisCache: true };

    const resultat = await telechargerAvecFallbacks(url, 'mp3');

    if (!resultat.succes) {
      return {
        succes: false,
        message: resultat.erreur || 'Échec téléchargement audio',
        recommandation: resultat.recommandation
      };
    }

    const sortie = {
      succes: true,
      buffer: resultat.buffer,
      titre: resultat.titre,
      miniature: resultat.miniature,
      qualite: 'mp3',
      nomFichier: `${resultat.titre.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`,
      source: resultat.source,
      cree_par: 'yankee Hells 🙂',
      theme: 'Maserati-Bot Prestige 🏎️👑✨🇨🇮'
    };

    enregistrerCache(cleCache, sortie);
    return sortie;
  } catch (erreur) {
    console.error('[Maserati-YouTube MP3] Erreur :', erreur.message);
    return { succes: false, message: 'Erreur téléchargement MP3' };
  }
}

/**
 * Télécharge la vidéo (MP4) avec file rotative
 * @param {string} url - Lien YouTube
 * @param {string} qualite - '360p' (défaut), '720p', '1080p'
 * @returns {Promise<Object>} Buffer MP4 + infos
 */
async function maseratiMp4(url, qualite = '360p') {
  try {
    const id = extraireIdVideoYoutube(url);
    if (!id) return { succes: false, message: 'URL YouTube invalide' };

    const cleCache = `yt_mp4:\( {id}: \){qualite}`;
    const enCache = recupererCache(cleCache);
    if (enCache) return { succes: true, ...enCache, depuisCache: true };

    const resultat = await telechargerAvecFallbacks(url, 'mp4');

    if (!resultat.succes) {
      return {
        succes: false,
        message: resultat.erreur || 'Échec téléchargement vidéo',
        recommandation: resultat.recommandation
      };
    }

    const sortie = {
      succes: true,
      buffer: resultat.buffer,
      titre: resultat.titre,
      miniature: resultat.miniature,
      qualite: resultat.qualite || qualite,
      nomFichier: `\( {resultat.titre.replace(/[^a-zA-Z0-9]/g, '_')} ( \){qualite}).mp4`,
      source: resultat.source,
      cree_par: 'yankee Hells 🙂',
      theme: 'Maserati-Bot Prestige 🏎️👑✨🇨🇮'
    };

    enregistrerCache(cleCache, sortie);
    return sortie;
  } catch (erreur) {
    console.error('[Maserati-YouTube MP4] Erreur :', erreur.message);
    return { succes: false, message: 'Erreur téléchargement MP4' };
  }
}

export {
  maseratiSearch,
  maseratiMp3,
  maseratiMp4
};

// Alias classiques pour compatibilité
export const ytmp3 = maseratiMp3;
export const ytmp4 = maseratiMp4;
