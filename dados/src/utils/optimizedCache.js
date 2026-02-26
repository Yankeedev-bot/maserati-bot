/**
 * Gestionnaire Cache Optimisé Prestige - Édition Maserati
 * Cache multi-niveaux avec monitoring mémoire, compression, LRU dynamique & nettoyage automatique – V12 ultra-efficace
 * Thème Maserati 🏎️👑✨🇨🇮 – Garage mémoire toujours fluide & puissant
 * Créé par yankee Hells 🙂
 */

import NodeCache from 'node-cache';
import path from 'path';
import zlib from 'zlib';

class GestionnaireCachePrestigeMaserati {
  constructor() {
    this.caches = new Map();
    this.seuilMemoire = 0.95;           // 95% mémoire disponible – alerte paddock
    this.intervalleNettoyage = 5 * 60 * 1000; // 5 min – entretien circuit
    this.compressionActive = true;
    this.enOptimisation = false;
    this.ordreLRU = new Map();          // Suivi LRU – priorisation récente
    this.comptageAcces = new Map();     // Compteur accès – TTL dynamique

    this.initialiserCaches();
    this.demarrerSurveillanceMemoire();
  }

  /**
   * Initialise les caches avec réglages prestige – préparation garage
   */
  initialiserCaches() {
    // Cache retry messages – TTL court, haute réactivité
    this.caches.set('retryMessages', new NodeCache({
      stdTTL: 2 * 60,           // 2 min – messages éphémères
      checkperiod: 30,          // Check rapide
      useClones: false,
      maxKeys: 1000,
      deleteOnExpire: true,
      forceString: false
    }));

    // Cache métadonnées groupes – TTL moyen, stabilité paddock
    this.caches.set('metaGroupes', new NodeCache({
      stdTTL: 10 * 60,          // 10 min
      checkperiod: 2 * 60,
      useClones: false,
      maxKeys: 500,
      deleteOnExpire: true,
      forceString: false
    }));

    // Cache groupes index.js – TTL ultra-court
    this.caches.set('metaIndexGroupes', new NodeCache({
      stdTTL: 10,               // 10 sec – fraîcheur maximale
      checkperiod: 30,
      useClones: false,
      maxKeys: 500,
      deleteOnExpire: true,
      forceString: false
    }));

    // Cache messages récents (anti-delete) – TTL très court
    this.caches.set('messages', new NodeCache({
      stdTTL: 60,               // 1 min
      checkperiod: 15,
      useClones: false,
      maxKeys: 2000,
      deleteOnExpire: true,
      forceString: false
    }));

    // Cache données utilisateurs – TTL long, sessions pilotes
    this.caches.set('donneesPilotes', new NodeCache({
      stdTTL: 30 * 60,          // 30 min
      checkperiod: 5 * 60,
      useClones: false,
      maxKeys: 2000,
      deleteOnExpire: true,
      forceString: false
    }));

    // Cache commandes & rate limiting – TTL moyen
    this.caches.set('commandes', new NodeCache({
      stdTTL: 5 * 60,           // 5 min
      checkperiod: 60,
      useClones: false,
      maxKeys: 5000,
      deleteOnExpire: true,
      forceString: false
    }));

    // Cache médias temporaires – TTL très court
    this.caches.set('medias', new NodeCache({
      stdTTL: 30,               // 30 sec
      checkperiod: 10,
      useClones: false,
      maxKeys: 1000,
      deleteOnExpire: true,
      forceString: false
    }));

    console.log('[Maserati-CachePrestige] Garage caches initialisé – 7 niveaux prêts');
  }

  /**
   * Démarre surveillance mémoire – radar paddock
   */
  demarrerSurveillanceMemoire() {
    setInterval(async () => {
      await this.optimiserMemoire();
    }, this.intervalleNettoyage);
  }

  /**
   * Optimise mémoire si seuil dépassé – purge & compression trident
   */
  async optimiserMemoire() {
    if (this.enOptimisation) return;
    this.enOptimisation = true;

    try {
      const memoire = process.memoryUsage();
      const utiliseMB = Math.round(memoire.heapUsed / 1024 / 1024);
      const totalMB = Math.round(memoire.heapTotal / 1024 / 1024);

      if (utiliseMB / totalMB > this.seuilMemoire) {
        console.log(`[Maserati-CachePrestige] Alerte surcharge mémoire (\( {utiliseMB}/ \){totalMB} Mo) – optimisation lancée`);

        // 1. Nettoyage expirés
        for (const [nom, cache] of this.caches) {
          cache.flushExpired();
        }

        // 2. Compression si activée
        if (this.compressionActive) {
          await this.compresserCaches();
        }

        // 3. Éjection LRU sur caches les plus gros
        await this.ejecterAnciensCaches(0.3); // 30% des plus anciens

        // 4. Garbage collection forcée
        if (global.gc) {
          global.gc();
        }

        const nouvelleMemoire = process.memoryUsage();
        const nouvelleUtiliseMB = Math.round(nouvelleMemoire.heapUsed / 1024 / 1024);
        console.log(`[Maserati-CachePrestige] Optimisation terminée – mémoire : ${nouvelleUtiliseMB} Mo`);
      }
    } catch (erreur) {
      console.error('[Maserati-CachePrestige] Erreur optimisation mémoire :', erreur.message);
    } finally {
      this.enOptimisation = false;
    }
  }

  /**
   * Compresse caches en zlib – réduction empreinte garage
   */
  async compresserCaches() {
    try {
      for (const [nom, cache] of this.caches) {
        const cles = cache.keys();
        let compressees = 0;

        for (const cle of cles) {
          const valeur = cache.get(cle);
          if (typeof valeur === 'string' && valeur.length > 1024) { // > 1KB
            try {
              const buffer = Buffer.from(valeur);
              const compresse = zlib.deflateSync(buffer);
              cache.set(cle, compresse, { compressed: true });
              compressees++;
            } catch {}
          }
        }

        if (compressees > 0) {
          console.log(`[Maserati-CachePrestige] ${nom} : ${compressees} entrées compressées`);
        }
      }
    } catch (erreur) {
      console.warn('[Maserati-CachePrestige] Erreur compression caches :', erreur.message);
    }
  }

  /**
   * Éjecte anciens items via LRU – purge circuit
   */
  async ejecterAnciensCaches(pourcentage = 0.3) {
    try {
      for (const [nom, cache] of this.caches) {
        const cles = cache.keys();
        const aSupprimer = Math.floor(cles.length * pourcentage);

        if (aSupprimer === 0) continue;

        // Trie par ordre LRU (plus ancien d’abord)
        const clesTriees = cles.sort((a, b) => (this.ordreLRU.get(a) || 0) - (this.ordreLRU.get(b) || 0));
        const clesASupprimer = clesTriees.slice(0, aSupprimer);

        for (const cle of clesASupprimer) {
          cache.del(cle);
          this.ordreLRU.delete(cle);
          this.comptageAcces.delete(cle);
        }

        if (clesASupprimer.length > 0) {
          console.log(`[Maserati-CachePrestige] ${nom} : ${clesASupprimer.length} entrées LRU purgées`);
        }
      }
    } catch (erreur) {
      console.error('[Maserati-CachePrestige] Erreur purge LRU :', erreur.message);
    }
  }

  /**
   * Journalise stats caches – tableau de bord prestige
   */
  journaliserStatsCaches() {
    for (const [type, cache] of this.caches) {
      const cles = cache.keys();
      const stats = cache.getStats();
      console.log(`[Maserati-CachePrestige] ${type} → ${cles.length} entrées | Stats :`, stats);
    }
  }

  /**
   * Obtient stats globales garage – diagnostic complet
   */
  obtenirStats() {
    const stats = {
      memoire: process.memoryUsage(),
      caches: {},
      enOptimisation: this.enOptimisation,
      compressionActive: this.compressionActive
    };

    for (const [type, cache] of this.caches) {
      stats.caches[type] = {
        cles: cache.keys().length,
        stats: cache.getStats()
      };
    }

    return stats;
  }

  /**
   * Configure paramètres optimisation – réglages atelier
   */
  configurer(options = {}) {
    if (options.seuilMemoire !== undefined) {
      this.seuilMemoire = Math.max(0.5, Math.min(0.95, options.seuilMemoire));
    }

    if (options.intervalleNettoyage !== undefined) {
      this.intervalleNettoyage = Math.max(60000, options.intervalleNettoyage);
    }

    if (options.compressionActive !== undefined) {
      this.compressionActive = options.compressionActive;
    }
  }

  /**
   * Nettoyage forcé total – reset garage complet
   */
  nettoyageForce() {
    for (const [type, cache] of this.caches) {
      const nbCles = cache.keys().length;
      cache.flushAll();
      console.log(`[Maserati-CachePrestige] ${type} vidé : ${nbCles} entrées purgées`);
    }

    if (global.gc) {
      global.gc();
    }
  }

  /**
   * Arrête surveillance – garage en veille
   */
  arreterSurveillance() {
    this.enOptimisation = false;
  }
}

export default GestionnaireCachePrestigeMaserati;