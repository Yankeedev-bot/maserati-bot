/**
 * Optimisations Performance Prestige - Édition Maserati
 * Memoization, debounce, throttle, batch, cache LRU, pooling & monitoring – moteur V12 ultra-fluide
 * Thème Maserati 🏎️👑✨🇨🇮 – Circuit sans latence, tuning maximal
 * Créé par yankee Hells 🙂
 */

// ==================== MEMOIZATION PRESTIGE ====================

/**
 * Crée une version memoizée d’une fonction – cache turbo paddock
 * @param {Function} fn - Fonction à optimiser
 * @param {number} tailleMaxCache - Taille max du garage mémoire
 * @param {number} dureeVie - TTL en ms (0 = éternel)
 */
export function memoiserPrestige(fn, tailleMaxCache = 100, dureeVie = 0) {
  const garageMemoire = new Map();
  let ordreAcces = [];

  return function(...args) {
    const cle = JSON.stringify(args);

    // Vérifie cache + non expiré
    if (garageMemoire.has(cle)) {
      const entree = garageMemoire.get(cle);
      if (dureeVie === 0 || Date.now() - entree.horodatage < dureeVie) {
        // Déplace en fin (LRU – last recently used)
        ordreAcces = ordreAcces.filter(k => k !== cle);
        ordreAcces.push(cle);
        return entree.valeur;
      }
      garageMemoire.delete(cle);
    }

    // Calcul valeur – tuning circuit
    const resultat = fn.apply(this, args);

    // Éjecte le plus ancien si limite atteinte
    if (garageMemoire.size >= tailleMaxCache) {
      const plusAncien = ordreAcces.shift();
      garageMemoire.delete(plusAncien);
    }

    // Stocke – mise à jour garage
    garageMemoire.set(cle, {
      valeur: resultat,
      horodatage: Date.now()
    });
    ordreAcces.push(cle);

    return resultat;
  };
}

// ==================== DEBOUNCE & THROTTLE – FLUIDITÉ CIRCUIT ====================

/**
 * Debounce – exécute seulement après silence radio – anti-spam paddock
 */
export function debouncePrestige(fn, delai = 300) {
  let timeoutId;

  return function(...args) {
    clearTimeout(timeoutId);

    return new Promise(resolve => {
      timeoutId = setTimeout(() => {
        resolve(fn.apply(this, args));
      }, delai);
    });
  };
}

/**
 * Throttle – limite exécutions à un rythme MC20
 */
export function throttlePrestige(fn, intervalle = 1000) {
  let dernierAppel = 0;
  let timeoutId;

  return function(...args) {
    const maintenant = Date.now();
    const tempsEcoule = maintenant - dernierAppel;

    if (tempsEcoule >= intervalle) {
      dernierAppel = maintenant;
      return fn.apply(this, args);
    }

    // Planifie au prochain créneau disponible – régulateur trident
    clearTimeout(timeoutId);
    return new Promise(resolve => {
      timeoutId = setTimeout(() => {
        dernierAppel = Date.now();
        resolve(fn.apply(this, args));
      }, intervalle - tempsEcoule);
    });
  };
}

// ==================== TRAITEMENT PAR BATCH – CHAÎNE DE MONTAGE V8 ====================

/**
 * Traite tableau par lots – évite blocage moteur
 */
export async function traiterParLots(tableau, processeur, tailleLot = 10, delai = 0) {
  const resultats = [];

  for (let i = 0; i < tableau.length; i += tailleLot) {
    const lot = tableau.slice(i, i + tailleLot);
    const resultatsLot = await Promise.all(lot.map(processeur));
    resultats.push(...resultatsLot);

    // Pause entre lots – refroidissement circuit
    if (delai > 0) {
      await new Promise(resolve => setTimeout(resolve, delai));
    }
  }

  return resultats;
}

// ==================== CACHE LRU PRESTIGE ====================

/**
 * Cache LRU avec expiration – garage mémoire intelligent
 */
export class CacheLRUPrestige {
  constructor(tailleMax = 100, dureeVieMs = 0) {
    this.garage = new Map();
    this.ordreAcces = [];
    this.tailleMax = tailleMax;
    this.dureeVieMs = dureeVieMs;
    this.intervalleNettoyage = setInterval(() => this.nettoyer(), 60000);
  }

  definir(cle, valeur) {
    if (this.garage.has(cle)) {
      this.ordreAcces = this.ordreAcces.filter(k => k !== cle);
    }

    this.garage.set(cle, {
      valeur,
      horodatage: Date.now()
    });

    this.ordreAcces.push(cle);

    // Éjecte le plus ancien si plein
    if (this.garage.size > this.tailleMax) {
      const ancien = this.ordreAcces.shift();
      this.garage.delete(ancien);
    }
  }

  obtenir(cle) {
    if (!this.garage.has(cle)) return null;

    const entree = this.garage.get(cle);

    // Expiré ?
    if (this.dureeVieMs > 0 && Date.now() - entree.horodatage > this.dureeVieMs) {
      this.garage.delete(cle);
      return null;
    }

    // LRU – déplace en fin
    this.ordreAcces = this.ordreAcces.filter(k => k !== cle);
    this.ordreAcces.push(cle);

    return entree.valeur;
  }

  a(cle) {
    return this.obtenir(cle) !== null;
  }

  supprimer(cle) {
    return this.garage.delete(cle);
  }

  nettoyer() {
    const maintenant = Date.now();
    let supprimes = 0;

    for (const [cle, entree] of this.garage) {
      if (this.dureeVieMs > 0 && maintenant > entree.horodatage + this.dureeVieMs) {
        this.garage.delete(cle);
        supprimes++;
      }
    }

    if (supprimes > 0) {
      console.log(`[Maserati-CacheLRU] Nettoyage : ${supprimes} entrées expirées purgées`);
    }
  }

  vider() {
    this.garage.clear();
  }

  detruire() {
    clearInterval(this.intervalleNettoyage);
    this.vider();
  }
}

// ==================== POOL D’OBJETS – RÉUTILISATION GARAGE ====================

/**
 * Pool d’objets réutilisables – économie ressources paddock
 */
export class PoolObjetsPrestige {
  constructor(usine, reinitialiser, tailleInitiale = 10) {
    this.usine = usine;
    this.reinitialiser = reinitialiser;
    this.disponibles = [];
    this.enUtilisation = new Set();

    // Pré-allocation – stock garage
    for (let i = 0; i < tailleInitiale; i++) {
      this.disponibles.push(this.usine());
    }
  }

  acquerir() {
    let objet;

    if (this.disponibles.length > 0) {
      objet = this.disponibles.pop();
    } else {
      objet = this.usine();
    }

    this.enUtilisation.add(objet);
    return objet;
  }

  liberer(objet) {
    if (!this.enUtilisation.has(objet)) return;

    this.enUtilisation.delete(objet);
    this.reinitialiser(objet);
    this.disponibles.push(objet);
  }

  vider() {
    this.disponibles = [];
    this.enUtilisation.clear();
  }
}

// ==================== MONITEUR PERFORMANCE – TABLEAU DE BORD CIRCUIT ====================

export class MoniteurPerformancePrestige {
  constructor() {
    this.mesures = new Map();
  }

  demarrer(nom) {
    this.mesures.set(nom, {
      debut: Date.now(),
      fin: null,
      duree: null
    });
  }

  terminer(nom) {
    const mesure = this.mesures.get(nom);
    if (!mesure) return;

    mesure.fin = Date.now();
    mesure.duree = mesure.fin - mesure.debut;

    return mesure.duree;
  }

  obtenir(nom) {
    return this.mesures.get(nom);
  }

  obtenirTout() {
    return Object.fromEntries(this.mesures);
  }

  reinitialiser() {
    this.mesures.clear();
  }
}

export const moniteurPerf = new MoniteurPerformancePrestige();

// ==================== ARRAY OPTIMISÉ – FLUIDITÉ CIRCUIT ====================

/**
 * Supprime doublons tableau – unicité prestige
 */
export function tableauUnique(tableau) {
  return [...new Set(tableau)];
}

/**
 * Découpe tableau en lots – traitement par segments
 */
export function decouperTableau(tableau, taille) {
  const lots = [];
  for (let i = 0; i < tableau.length; i += taille) {
    lots.push(tableau.slice(i, i + taille));
  }
  return lots;
}

/**
 * Aplatit tableau récursivement – surface plane MC20
 */
export function aplatirTableau(tableau) {
  return tableau.reduce((acc, val) =>
    Array.isArray(val) ? acc.concat(aplatirTableau(val)) : acc.concat(val),
  []);
}