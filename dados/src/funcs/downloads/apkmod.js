/**
 * Système de Téléchargement APK Mod - Édition Prestige
 * Thème Maserati 🏎️👑✨🇨🇮
 * Développé par yankee Hells 🙂
 * Version: 2.0.0 - Tridente Edition
 * Optimisé avec pooling de connexions HTTP
 */

import { scrapingClient } from '../../utils/httpClient.js';
import { DOMParser } from 'linkedom';

// Configuration globale
const CONFIG = {
  API: {
    BASE_URL: 'https://apkmodct.com',
    TIMEOUT: 120000,
    HEADERS: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
    }
  },
  CACHE: {
    MAX_SIZE: 100,
    EXPIRE_TIME: 30 * 60 * 1000 // 30 minutes
  },
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000
  },
  SELECTORS: {
    SEARCH: {
      POST: 'div.post a',
      IMAGE: 'figure.home-icon img'
    },
    POST: {
      DESCRIPTION: 'meta[name="description"]',
      TABLE: 'table.table-bordered tr',
      MAIN_LINK: 'div.main-pic a'
    },
    DOWNLOAD: {
      LINK: 'div.col-xs-12 a'
    }
  }
};

// Cache optimisé pour les recherches APK
class CacheAPK {
  constructor() {
    this.cache = new Map();
  }

  genererCle(recherche) {
    return recherche.toLowerCase().trim();
  }

  recuperer(recherche) {
    const cle = this.genererCle(recherche);
    const enCache = this.cache.get(cle);
    
    if (!enCache) return null;
    
    if (Date.now() - enCache.timestamp > CONFIG.CACHE.EXPIRE_TIME) {
      this.cache.delete(cle);
      return null;
    }
    
    return enCache.data;
  }

  enregistrer(recherche, donnees) {
    if (this.cache.size >= CONFIG.CACHE.MAX_SIZE) {
      const plusAncienne = Array.from(this.cache.keys())[0];
      this.cache.delete(plusAncienne);
    }

    const cle = this.genererCle(recherche);
    this.cache.set(cle, {
      data: donnees,
      timestamp: Date.now()
    });
  }
}

// Analyseur de pages APK
class AnalyseurAPK {
  constructor() {
    this.parseur = new DOMParser();
  }

  analyserDocument(html) {
    return this.parseur.parseFromString(html, 'text/html');
  }

  extraireResultatRecherche(document) {
    const elementPost = document.querySelector(CONFIG.SELECTORS.SEARCH.POST);
    if (!elementPost) {
      throw new Error('Aucun résultat trouvé');
    }

    return {
      url: elementPost.href,
      titre: elementPost.title || elementPost.textContent.trim(),
      image: document.querySelector(CONFIG.SELECTORS.SEARCH.IMAGE)?.src || 'non trouvée'
    };
  }

  extraireDetailsPost(document) {
    const description = document.querySelector(CONFIG.SELECTORS.POST.DESCRIPTION)?.content || 'non disponible';
    const details = this.extraireTableauDetails(document);
    const urlImagePrincipale = document.querySelector(CONFIG.SELECTORS.POST.MAIN_LINK)?.href;

    if (!urlImagePrincipale) {
      throw new Error('Aucun lien principal trouvé');
    }

    return { description, details, urlImagePrincipale };
  }

  extraireTableauDetails(document) {
    const details = {};
    document.querySelectorAll(CONFIG.SELECTORS.POST.TABLE).forEach(ligne => {
      const cle = ligne.querySelector('th')?.textContent.trim().toLowerCase();
      const valeur = ligne.querySelector('td')?.textContent.trim();
      if (cle && valeur) details[cle] = valeur;
    });
    return details;
  }

  extraireLienTelechargement(document) {
    const lien = document.querySelector(CONFIG.SELECTORS.DOWNLOAD.LINK)?.href;
    if (!lien) {
      throw new Error('Aucun lien de téléchargement trouvé');
    }
    return lien;
  }
}

// Client principal pour le scraping APK
class ClientAPK {
  constructor() {
    this.analyseur = new AnalyseurAPK();
  }

  async requete(url, tentative = 1) {
    try {
      const reponse = (await scrapingClient.get(url, {
        timeout: CONFIG.API.TIMEOUT,
        headers: CONFIG.API.HEADERS
      })).data;
      return this.analyseur.analyserDocument(reponse);
    } catch (erreur) {
      if (tentative < CONFIG.RETRY.MAX_ATTEMPTS) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY.DELAY * tentative));
        return this.requete(url, tentative + 1);
      }
      throw erreur;
    }
  }

  async rechercher(terme) {
    const urlRecherche = `\( {CONFIG.API.BASE_URL}/?s= \){encodeURIComponent(terme)}`;
    const document = await this.requete(urlRecherche);
    return this.analyseur.extraireResultatRecherche(document);
  }

  async obtenirDetailsPost(url) {
    const document = await this.requete(url);
    return this.analyseur.extraireDetailsPost(document);
  }

  async obtenirLienTelechargement(url) {
    const document = await this.requete(url);
    return this.analyseur.extraireLienTelechargement(document);
  }

  formaterDetails(details) {
    return {
      nom: details['name'] || 'non disponible',
      mis_a_jour: details['updated'] || 'non disponible',
      version: details['version'] || 'non disponible',
      categorie: details['category'] || 'non disponible',
      info_mod: details['mod info'] || 'non disponible',
      taille: details['size'] || 'non disponible',
      note: details['rate'] || 'non disponible',
      requis_android: details['requires android'] || 'non disponible',
      developpeur: details['developer'] || 'non disponible',
      google_play: details['google play'] || 'non disponible',
      telechargements: details['downloads'] || 'non disponible'
    };
  }
}

// Instances uniques
const cache = new CacheAPK();
const client = new ClientAPK();

/**
 * Recherche et récupère les infos d'un APK Mod - Style Maserati
 * @param {string} texteRecherche - Terme à chercher (ex: "whatsapp plus", "minecraft mod")
 * @returns {Promise<Object>} Résultat avec détails et lien direct
 */
async function maseratiApkMod(texteRecherche) {
  try {
    if (!texteRecherche || typeof texteRecherche !== 'string') {
      return { erreur: 'Recherche invalide' };
    }

    // Vérification cache
    const enCache = cache.recuperer(texteRecherche);
    if (enCache) return enCache;

    // Étape 1 : Recherche
    const resultatRecherche = await client.rechercher(texteRecherche);
    
    // Étape 2 : Détails de la page
    const { description, details, urlImagePrincipale } = await client.obtenirDetailsPost(resultatRecherche.url);
    
    // Étape 3 : Lien de téléchargement direct
    const lienTelechargement = await client.obtenirLienTelechargement(urlImagePrincipale);

    const resultat = {
      titre: resultatRecherche.titre || 'sans titre',
      description,
      image: resultatRecherche.image,
      details: client.formaterDetails(details),
      telechargement: lienTelechargement,
      source: 'Maserati-Bot APK Downloader 🏎️👑✨🇨🇮',
      cree_par: 'yankee Hells 🙂'
    };

    // Mise en cache
    cache.enregistrer(texteRecherche, resultat);

    return resultat;
  } catch (erreur) {
    console.error('Erreur APK Maserati:', erreur);
    return {
      erreur: erreur.message.includes('Aucun')
        ? 'Aucun résultat trouvé pour cette recherche'
        : 'Erreur lors de la récupération de l\'APK – réessayez plus tard'
    };
  }
}

export default maseratiApkMod;
