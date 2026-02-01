/**
 * Recherche de Plugins Minecraft - Édition Prestige
 * Thème Maserati 🏎️👑✨🇨🇮
 * Optimisé pour vitesse et précision (pooling HTTP)
 * Créé par yankee Hells 🙂
 * Version: 2.0.0 - Tridente Edition
 */

import axios from 'axios';
import { parseHTML } from 'linkedom';

// Configuration globale – style Maserati : rapide, fiable, exclusif
const CONFIG = {
  API: {
    BASE_URL: 'https://modrinth.com',
    TIMEOUT: 120000,
    HEADERS: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
    }
  },
  RECHERCHE: {
    MAX_RESULTATS: 5,
    LONGUEUR_MIN_DESCRIPTION: 20
  },
  CACHE: {
    MAX_TAILLE: 100,
    DUREE_VALIDITE: 30 * 60 * 1000 // 30 minutes
  },
  RETENTATIVE: {
    MAX_TENTATIVES: 3,
    DELAI: 1000
  },
  SELECTEURS: {
    CARTE_PROJET: '.project-card.base-card.padding-bg',
    TITRE: '.name',
    DESCRIPTION: '.description',
    LIEN: 'a',
    ICONE: 'img',
    AUTEUR: '.author .title-link',
    VERSION: '.version',
    TELECHARGEMENTS: '.downloads',
    CATEGORIES: '.categories .category'
  }
};

// Cache haute performance – comme un moteur V8 Maserati
class CachePlugin {
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
    
    if (Date.now() - enCache.timestamp > CONFIG.CACHE.DUREE_VALIDITE) {
      this.cache.delete(cle);
      return null;
    }
    
    return enCache.data;
  }

  enregistrer(recherche, donnees) {
    if (this.cache.size >= CONFIG.CACHE.MAX_TAILLE) {
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

// Analyseur de pages Modrinth – précision et élégance
class AnalyseurPlugin {
  constructor(document) {
    this.document = document;
  }

  extraireTexte(element, selecteur) {
    return element.querySelector(selecteur)?.textContent.trim() || '';
  }

  extraireAttribut(element, selecteur, attribut) {
    return element.querySelector(selecteur)?.getAttribute(attribut) || '';
  }

  formaterUrl(chemin) {
    if (!chemin || chemin === '#') return '';
    return chemin.startsWith('http') ? chemin : `\( {CONFIG.API.BASE_URL} \){chemin}`;
  }

  analyserCarteProjet(carte) {
    if (!carte) return null;

    const titre = this.extraireTexte(carte, CONFIG.SELECTEURS.TITRE);
    if (!titre) return null;

    const description = this.extraireTexte(carte, CONFIG.SELECTEURS.DESCRIPTION);
    if (!description || description.length < CONFIG.RECHERCHE.LONGUEUR_MIN_DESCRIPTION) {
      return null;
    }

    const lien = this.formaterUrl(this.extraireAttribut(carte, CONFIG.SELECTEURS.LIEN, 'href'));
    if (!lien) return null;

    let icone = this.extraireAttribut(carte, CONFIG.SELECTEURS.ICONE, 'src');
    icone = this.formaterUrl(icone);

    const auteur = this.extraireTexte(carte, CONFIG.SELECTEURS.AUTEUR) || 'Inconnu';
    const version = this.extraireTexte(carte, CONFIG.SELECTEURS.VERSION);
    const telechargements = this.extraireTexte(carte, CONFIG.SELECTEURS.TELECHARGEMENTS);

    const categories = Array.from(carte.querySelectorAll(CONFIG.SELECTEURS.CATEGORIES))
      .map(cat => cat.textContent.trim())
      .filter(Boolean);

    return {
      nom: titre,
      description,
      lien,
      image: icone,
      createur: auteur,
      version,
      telechargements,
      categories
    };
  }
}

// Client Modrinth – connexion ultra-rapide
class ClientModrinth {
  constructor() {
    this.axios = axios.create({
      baseURL: CONFIG.API.BASE_URL,
      timeout: CONFIG.API.TIMEOUT,
      headers: CONFIG.API.HEADERS
    });
  }

  async requete(config, tentative = 1) {
    try {
      return await this.axios.request(config);
    } catch (erreur) {
      if (tentative < CONFIG.RETENTATIVE.MAX_TENTATIVES) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.RETENTATIVE.DELAI * tentative));
        return this.requete(config, tentative + 1);
      }
      throw erreur;
    }
  }

  async rechercherPlugins(recherche) {
    const reponse = await this.requete({
      method: 'GET',
      url: `/plugins?q=${encodeURIComponent(recherche)}`
    });

    return parseHTML(reponse.data).document;
  }
}

// Instances uniques – efficacité Maserati
const cache = new CachePlugin();
const client = new ClientModrinth();

/**
 * Recherche le plugin Minecraft le plus pertinent sur Modrinth
 * @param {string} nom - Nom ou mot-clé du plugin
 * @returns {Promise<Object>} Infos du plugin trouvé
 */
async function maseratiBuscarPlugin(nom) {
  try {
    if (!nom || typeof nom !== 'string' || nom.trim() === '') {
      return { succes: false, message: 'Nom du plugin invalide – envoie un vrai nom boss !' };
    }

    // Vérification cache – zéro attente
    const enCache = cache.recuperer(nom);
    if (enCache) return enCache;

    // Recherche sur Modrinth
    const document = await client.rechercherPlugins(nom);
    const analyseur = new AnalyseurPlugin(document);

    // On prend la première carte valide (la plus pertinente)
    const carteProjet = document.querySelector(CONFIG.SELECTEURS.CARTE_PROJET);
    const plugin = analyseur.analyserCarteProjet(carteProjet);

    if (!plugin) {
      return { succes: false, message: 'Aucun plugin correspondant trouvé sur Modrinth' };
    }

    const resultat = {
      succes: true,
      ...plugin,
      source: 'Maserati-Bot • Modrinth Recherche Prestige 🏎️👑✨🇨🇮',
      cree_par: 'yankee Hells 🙂'
    };

    // Mise en cache
    cache.enregistrer(nom, resultat);

    return resultat;
  } catch (erreur) {
    console.error('[Maserati-Plugins] Erreur :', erreur.message);
    return {
      succes: false,
      message: erreur.message.includes('network') || erreur.code === 'ECONNABORTED'
        ? 'Problème de connexion – réessaie plus tard'
        : 'Erreur lors de la recherche du plugin'
    };
  }
}

export default maseratiBuscarPlugin;
