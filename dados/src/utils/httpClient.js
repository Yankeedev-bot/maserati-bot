/**
 * Client HTTP Prestige Partagé avec Pool de Connexions - Édition Maserati
 * Instance axios optimisée pour réutilisation connexions, limitation sockets, timeouts & headers luxe
 * Thème Maserati 🏎️👑✨🇨🇮 – Circuit ultra-rapide & fiable
 * Créé par yankee Hells 🙂
 */

import axios from 'axios';
import http from 'http';
import https from 'https';

// Agents HTTP/HTTPS prestige – keep-alive & limitation sockets (pas de surchauffe paddock)
const agentHttp = new http.Agent({
  keepAlive: true,
  maxSockets: 50,          // Max connexions simultanées par host – contrôle circuit
  maxFreeSockets: 10,      // Sockets libres gardés en standby – réactivité MC20
  timeout: 120000,         // Timeout socket inactif 2 min – sécurité
  scheduling: 'lifo'       // Last-in-first-out – meilleure réutilisation
});

const agentHttps = new https.Agent({
  keepAlive: true,
  maxSockets: 50,
  maxFreeSockets: 10,
  timeout: 120000,
  scheduling: 'lifo',
  rejectUnauthorized: true  // Validation SSL stricte – sécurité trident
});

/**
 * Client principal pour APIs JSON (cog.api.br, etc.) – moteur V8
 */
const clientApi = axios.create({
  httpAgent: agentHttp,
  httpsAgent: agentHttps,
  timeout: 120000,           // 2 min max par requête – endurance circuit
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'MaseratiBot/2.0 Prestige'
  },
  // Accepte < 500, gère 401/403/429 manuellement via interceptor
  validateStatus: (status) => status < 500
});

/**
 * Intercepteur réponse – détection erreurs Cognima (401/403/429) – alerte paddock
 */
clientApi.interceptors.response.use(
  (reponse) => {
    const estCognima = typeof reponse?.config?.url === 'string' && reponse.config.url.includes('cog.api.br');
    if (estCognima && [401, 403, 429].includes(reponse.status)) {
      const erreur = new Error(reponse.data?.message || 'Erreur authentification Cognima (clé API expirée/invalide)');
      erreur.reponse = reponse;
      throw erreur;
    }
    return reponse;
  },
  (erreur) => Promise.reject(erreur)
);

/**
 * Client dédié téléchargement médias (buffers, streams) – flux HD rapide
 */
const clientMedia = axios.create({
  httpAgent: agentHttp,
  httpsAgent: agentHttps,
  timeout: 120000,
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
  responseType: 'arraybuffer',
  headers: {
    'User-Agent': 'MaseratiBot/2.0 Prestige',
    'Accept': '*/*'
  }
});

/**
 * Client scraping/HTML – navigation paddock
 */
const clientScraping = axios.create({
  httpAgent: agentHttp,
  httpsAgent: agentHttps,
  timeout: 120000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br'
  }
});

/**
 * Ajoute intercepteur logging erreurs réseau (optionnel) – diagnostic garage
 */
const ajouterIntercepteurErreur = (client, nom) => {
  client.interceptors.response.use(
    reponse => reponse,
    erreur => {
      // Log seulement erreurs réseau (pas erreurs HTTP)
      if (!erreur.response) {
        console.error(`[Maserati-HTTP:${nom}] Erreur réseau :`, erreur.code || erreur.message);
      }
      return Promise.reject(erreur);
    }
  );
};

// Activation interceptors prestige
ajouterIntercepteurErreur(clientApi, 'API');
ajouterIntercepteurErreur(clientMedia, 'Media');
ajouterIntercepteurErreur(clientScraping, 'Scraping');

/**
 * Statistiques connexions – tableau de bord paddock
 */
const obtenirStatsConnexions = () => ({
  http: {
    sockets: Object.keys(agentHttp.sockets || {}).reduce((acc, key) => acc + (agentHttp.sockets[key]?.length || 0), 0),
    socketsLibres: Object.keys(agentHttp.freeSockets || {}).reduce((acc, key) => acc + (agentHttp.freeSockets[key]?.length || 0), 0),
    requetes: Object.keys(agentHttp.requests || {}).reduce((acc, key) => acc + (agentHttp.requests[key]?.length || 0), 0)
  },
  https: {
    sockets: Object.keys(agentHttps.sockets || {}).reduce((acc, key) => acc + (agentHttps.sockets[key]?.length || 0), 0),
    socketsLibres: Object.keys(agentHttps.freeSockets || {}).reduce((acc, key) => acc + (agentHttps.freeSockets[key]?.length || 0), 0),
    requetes: Object.keys(agentHttps.requests || {}).reduce((acc, key) => acc + (agentHttps.requests[key]?.length || 0), 0)
  }
});

/**
 * Nettoie sockets inactifs – économie carburant
 */
const detruireSocketsInactifs = () => {
  agentHttp.destroy();
  agentHttps.destroy();
};

/**
 * Helper requête API avec clé – signature trident
 * @param {string} url - Endpoint
 * @param {object} data - Payload
 * @param {string} cleApi - Clé API
 * @param {object} options - Options axios supplémentaires
 */
const requeteApi = async (url, data, cleApi, options = {}) => {
  return clientApi.post(url, data, {
    ...options,
    headers: {
      ...options.headers,
      'X-API-Key': cleApi
    }
  });
};

/**
 * Helper téléchargement média – flux direct HD
 * @param {string} url - Lien fichier
 * @param {object} options - Options axios
 * @returns {Promise<Buffer>}
 */
const telechargerMedia = async (url, options = {}) => {
  const reponse = await clientMedia.get(url, options);
  return reponse.data;
};

export {
  clientApi,
  clientMedia,
  clientScraping,
  agentHttp,
  agentHttps,
  obtenirStatsConnexions,
  detruireSocketsInactifs,
  requeteApi,
  telechargerMedia
};

export default clientApi;