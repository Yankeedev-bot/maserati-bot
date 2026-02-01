/**
 * Service de Recherche Prestige - Édition Maserati
 * Recherche web via DuckDuckGo – sans API externe
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import axios from 'axios';
import { parseHTML } from 'linkedom';

// ── CONFIGURATION PRESTIGE ──
const CONFIG_SEARCH_MASERATI = {
  USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  CACHE_TTL_MS: 15 * 60 * 1000,          // 15 min – infos fraîches sur le circuit
  CACHE_MAX_ENTREES: 500,                // Limite paddock – on garde que l’essentiel
  TIMEOUT_MS: 60000,                     // 60s – pas de panne en pleine course
  TAILLE_RESULTATS_DEFAUT: 10
};

// Paddock Cache – stockage ultra-rapide
const cachePaddock = new Map();

function obtenirCache(key) {
  const entree = cachePaddock.get(key);
  if (!entree) return null;
  if (Date.now() - entree.timestamp > CONFIG_SEARCH_MASERATI.CACHE_TTL_MS) {
    cachePaddock.delete(key);
    return null;
  }
  return entree.valeur;
}

function definirCache(key, valeur) {
  if (cachePaddock.size >= CONFIG_SEARCH_MASERATI.CACHE_MAX_ENTREES) {
    const plusAncienne = cachePaddock.keys().next().value;
    cachePaddock.delete(plusAncienne);
  }
  cachePaddock.set(key, { valeur, timestamp: Date.now() });
}

/**
 * Recherche prestige sur le web via DuckDuckGo
 * @param {string} requete - Terme à chercher
 * @param {number} [maxResultats=10] - Nombre max de résultats
 * @returns {Promise<Object>} Résultats formatés luxe
 */
async function maseratiRechercher(requete, maxResultats = CONFIG_SEARCH_MASERATI.TAILLE_RESULTATS_DEFAUT) {
  try {
    if (!requete || requete.trim() === '') {
      return { succes: false, message: '❌ Terme de recherche invalide – envoie une requête précise !' };
    }

    // Vérifier paddock cache
    const cleCache = `search:\( {requete}: \){maxResultats}`;
    const cache = obtenirCache(cleCache);
    if (cache) {
      return { succes: true, ...cache, depuisCache: true };
    }

    console.log(`[Maserati-Search] Lancement recherche prestige → "${requete}"`);

    const urlRecherche = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(requete)}`;

    const reponse = await axios.get(urlRecherche, {
      headers: {
        'User-Agent': CONFIG_SEARCH_MASERATI.USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
      },
      timeout: CONFIG_SEARCH_MASERATI.TIMEOUT_MS
    });

    const { document } = parseHTML(reponse.data);
    const resultats = [];

    document.querySelectorAll('.result').forEach((element, index) => {
      if (index >= maxResultats) return;

      const titreEl = element.querySelector('.result__title a');
      const extraitEl = element.querySelector('.result__snippet');
      const urlEl = element.querySelector('.result__url');

      const titre = titreEl?.textContent?.trim();
      let url = urlEl?.getAttribute('href') || titreEl?.getAttribute('href');
      const description = extraitEl?.textContent?.trim();

      if (titre && url) {
        // Nettoyage URL DuckDuckGo redirect
        if (url.includes('uddg=')) {
          const match = url.match(/uddg=([^&]+)/);
          if (match) url = decodeURIComponent(match[1]);
        }

        let urlAffichee = '';
        try { urlAffichee = new URL(url).hostname; } catch {}

        resultats.push({
          position: resultats.length + 1,
          titre,
          url,
          description: description || '',
          urlAffichee
        });
      }
    });

    const resultatFinal = {
      requete,
      totalResultats: resultats.length,
      resultats
    };

    definirCache(cleCache, resultatFinal);

    return { succes: true, ...resultatFinal };
  } catch (err) {
    console.error('[Maserati-Search] Erreur recherche :', err.message);
    return { succes: false, message: err.message || '❌ Erreur lors de la recherche – vérifie ta connexion au paddock !' };
  }
}

/**
 * Recherche actualités prestige via DuckDuckGo
 * @param {string} requete - Terme à chercher
 * @param {number} [maxResultats=10] - Nombre max de résultats
 */
async function maseratiRechercherActualites(requete, maxResultats = CONFIG_SEARCH_MASERATI.TAILLE_RESULTATS_DEFAUT) {
  try {
    if (!requete || requete.trim() === '') {
      return { succes: false, message: '❌ Terme de recherche invalide – envoie une requête précise !' };
    }

    // Ajout "news" pour focus actualités
    const requeteNews = `${requete} news`;
    const resultat = await maseratiRechercher(requeteNews, maxResultats);

    if (resultat.succes) {
      resultat.type = 'actualites';
    }

    return resultat;
  } catch (err) {
    console.error('[Maserati-Search] Erreur recherche actualités :', err.message);
    return { succes: false, message: err.message || '❌ Erreur lors de la recherche d’actualités – piste encombrée !' };
  }
}

// Exports prestige
export default {
  maseratiRechercher,
  maseratiRechercherActualites
};

export {
  maseratiRechercher,
  maseratiRechercherActualites
};
