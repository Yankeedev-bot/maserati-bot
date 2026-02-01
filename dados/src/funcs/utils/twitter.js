/**
 * Module Téléchargement Twitter/X Prestige - Édition Maserati
 * Récupère infos et médias sans API officielle
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import axios from 'axios';

// ── CONFIGURATION PRESTIGE ──
const CONFIG_TWITTER_MASERATI = {
  USER_AGENT: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
  URL_API: (id) => `https://info.tweeload.site/status/${id}.json`,
  URL_AUTH: 'https://pastebin.com/raw/SnCfd4ru',
  CACHE_TTL_MS: 30 * 60 * 1000,          // 30 min – infos fraîches sur le circuit
  CACHE_MAX_ENTREES: 200,                // Limite paddock – on garde que l’essentiel
  TIMEOUT_MS: 60000                      // 60s – pas de panne en pleine course
};

// Paddock Cache – stockage ultra-rapide
const cachePaddock = new Map();
let authCache = null;
let authCacheTime = null;

function obtenirCache(key) {
  const entree = cachePaddock.get(key);
  if (!entree) return null;
  if (Date.now() - entree.timestamp > CONFIG_TWITTER_MASERATI.CACHE_TTL_MS) {
    cachePaddock.delete(key);
    return null;
  }
  return entree.valeur;
}

function definirCache(key, valeur) {
  if (cachePaddock.size >= CONFIG_TWITTER_MASERATI.CACHE_MAX_ENTREES) {
    const plusAncienne = cachePaddock.keys().next().value;
    cachePaddock.delete(plusAncienne);
  }
  cachePaddock.set(key, { valeur, timestamp: Date.now() });
}

async function obtenirAutorisation() {
  if (authCache && authCacheTime && (Date.now() - authCacheTime < 5 * 60 * 1000)) {
    return authCache;
  }

  try {
    const reponse = await axios.get(CONFIG_TWITTER_MASERATI.URL_AUTH, { timeout: 30000 });
    authCache = reponse.data.trim();
    authCacheTime = Date.now();
    return authCache;
  } catch (err) {
    console.error('[Maserati-Twitter] Erreur obtention autorisation :', err.message);
    throw new Error('Impossible d’obtenir l’autorisation – circuit bloqué');
  }
}

function extraireIdTweet(url) {
  if (!url) throw new Error('URL non fournie – donne-moi une piste valide !');

  const motifs = [
    /twitter\.com\/\w+\/status\/(\d+)/,
    /x\.com\/\w+\/status\/(\d+)/,
    /\/status\/(\d+)/,
    /\/(\d{10,})/
  ];

  for (const motif of motifs) {
    const match = url.match(motif);
    if (match && match[1]) return match[1];
  }

  throw new Error('URL Twitter/X invalide – vérifie le lien !');
}

/**
 * Récupère infos et médias d’un tweet prestige
 * @param {string} url - Lien du tweet
 * @returns {Promise<Object>} Infos formatées luxe
 */
async function maseratiGetTweetInfo(url) {
  try {
    if (!url || (!url.includes('twitter.com') && !url.includes('x.com'))) {
      return { succes: false, message: '❌ URL invalide – envoie un vrai lien Twitter/X !' };
    }

    const idTweet = extraireIdTweet(url);

    // Vérifier paddock cache
    const cleCache = `twitter:${idTweet}`;
    const cache = obtenirCache(cleCache);
    if (cache) {
      return { succes: true, ...cache, depuisCache: true };
    }

    console.log(`[Maserati-Twitter] Recherche tweet prestige ID → ${idTweet}`);

    const autorisation = await obtenirAutorisation();

    const reponse = await axios.get(CONFIG_TWITTER_MASERATI.URL_API(idTweet), {
      headers: {
        'Authorization': autorisation,
        'User-Agent': CONFIG_TWITTER_MASERATI.USER_AGENT,
        'Accept': 'application/json'
      },
      timeout: CONFIG_TWITTER_MASERATI.TIMEOUT_MS
    });

    const data = reponse.data;

    if (data.code !== 200) {
      return { succes: false, message: '❌ Tweet introuvable ou indisponible – supprimé ou privé ?' };
    }

    // Auteur prestige
    const auteur = {
      id: data.tweet.author.id,
      nom: data.tweet.author.name,
      pseudo: data.tweet.author.screen_name,
      avatar: data.tweet.author.avatar_url,
      banniere: data.tweet.author.banner_url
    };

    // Médias luxe
    let medias = [];
    let type = 'texte';

    if (data.tweet?.media?.videos?.length > 0) {
      type = 'video';

      for (const video of data.tweet.media.videos) {
        const variantes = [];

        if (video.video_urls && Array.isArray(video.video_urls)) {
          for (const v of video.video_urls) {
            const matchResolution = v.url.match(/([\d]{2,5}[x][\d]{2,5})/);
            variantes.push({
              bitrate: v.bitrate,
              typeContenu: v.content_type,
              resolution: matchResolution ? matchResolution[0] : 'inconnue',
              url: v.url
            });
          }
        }

        variantes.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));

        if (variantes.length > 0 || video.type === 'gif') {
          medias.push({
            type: video.type,
            duree: video.duration,
            miniature: video.thumbnail_url,
            variantes: video.type === 'video' ? variantes : undefined,
            url: video.type === 'gif' ? video.url : (variantes[0]?.url || null),
            meilleureQualite: variantes[0] || null
          });
        }
      }
    } else if (data.tweet?.media?.photos?.length > 0) {
      type = 'photo';

      for (const photo of data.tweet.media.photos) {
        const urlBase = photo.url || photo;
        medias.push({
          type: 'photo',
          url: urlBase,
          urlHD: urlBase.replace(/\.(jpg|png)$/, '?format=$1&name=large')
        });
      }
    }

    const resultat = {
      id: data.tweet.id,
      texte: data.tweet.text,
      creeLe: data.tweet.created_at,
      url: data.tweet.url || `https://x.com/i/status/${idTweet}`,
      stats: {
        reponses: data.tweet.replies,
        retweets: data.tweet.retweets,
        likes: data.tweet.likes
      },
      auteur,
      type,
      medias: medias.length > 0 ? medias : null,
      aMedias: medias.length > 0
    };

    definirCache(cleCache, resultat);

    return { succes: true, ...resultat };
  } catch (err) {
    console.error('[Maserati-Twitter] Erreur :', err.message);

    let msg = '❌ Erreur lors de la récupération du tweet';
    if (err.response?.status === 404) msg = '❌ Tweet introuvable ou supprimé';
    else if (err.code === 'ECONNABORTED') msg = '❌ Temps dépassé – serveur en pleine course';

    return { succes: false, message: msg };
  }
}

// Exports prestige
export default { maseratiGetTweetInfo };

export { maseratiGetTweetInfo };
