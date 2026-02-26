/**
 * Cache JID → LID Prestige - Édition Maserati
 * Cache en mémoire ultra-rapide pour conversion JID → LID – accès turbo paddock
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache global prestige : Map<JID, LID> – garage mémoire rapide
let cacheMemoireJidLid = new Map();
let fichierCacheJidLid = null;
let cacheModifie = false;
let timeoutSauvegardeCache = null;

// Initialisation chemin cache – démarrage garage
function initialiserCacheJidLid(cheminFichierCache) {
  fichierCacheJidLid = cheminFichierCache;

  // Chargement cache existant depuis fichier – reprise circuit
  try {
    if (fsSync.existsSync(cheminFichierCache)) {
      const data = JSON.parse(fsSync.readFileSync(cheminFichierCache, 'utf-8'));
      cacheMemoireJidLid = new Map(Object.entries(data.mappings || {}));
      console.log(`[Maserati-CacheJidLid] Cache chargé : ${cacheMemoireJidLid.size} entrées prestige`);
    }
  } catch (erreur) {
    console.warn(`[Maserati-CacheJidLid] Erreur chargement cache : ${erreur.message}`);
  }

  // Sauvegarde auto périodique (toutes les 5 min si modifs) – maintenance paddock
  setInterval(() => {
    if (cacheModifie) {
      sauvegarderCacheJidLid();
    }
  }, 5 * 60 * 1000);
}

// Sauvegarde cache sur disque avec debounce – anti-surcharge turbo
function sauvegarderCacheJidLid(force = false) {
  if (!fichierCacheJidLid || (!cacheModifie && !force)) return;

  // Debounce : groupe sauvegardes en 3 secondes – fluidité circuit
  if (!force && timeoutSauvegardeCache) {
    clearTimeout(timeoutSauvegardeCache);
  }

  const executerSauvegarde = () => {
    try {
      const data = {
        version: '1.0',
        derniereMiseAJour: new Date().toISOString(),
        mappings: Object.fromEntries(cacheMemoireJidLid)
      };

      const cheminDossier = path.dirname(fichierCacheJidLid);
      if (!fsSync.existsSync(cheminDossier)) {
        fsSync.mkdirSync(cheminDossier, { recursive: true });
      }

      fsSync.writeFileSync(fichierCacheJidLid, JSON.stringify(data, null, 2));
      cacheModifie = false;
    } catch (erreur) {
      console.error(`[Maserati-CacheJidLid] Erreur sauvegarde : ${erreur.message}`);
    }
  };

  if (force) {
    executerSauvegarde();
  } else {
    timeoutSauvegardeCache = setTimeout(executerSauvegarde, 3000);
  }
}

// Recherche LID depuis cache ou onWhatsApp – accès rapide prestige
async function obtenirLidDeJidCache(nazu, jid) {
  if (!estJidValide(jid)) {
    return jid; // Déjà LID ou autre format
  }

  // 1. Vérification cache mémoire d’abord (turbo rapide)
  if (cacheMemoireJidLid.has(jid)) {
    const lidCache = cacheMemoireJidLid.get(jid);
    // Retire :XX si présent dans cache
    return lidCache.includes(':') ? lidCache.split(':')[0] + '@lid' : lidCache;
  }

  // 2. Absent du cache ? Recherche via API – scan paddock
  try {
    const resultat = await nazu.onWhatsApp(jid);
    if (resultat && resultat[0] && resultat[0].lid) {
      let lid = resultat[0].lid;

      // Retire :XX si présent
      if (lid.includes(':')) {
        lid = lid.split(':')[0] + '@lid';
      }

      // Ajoute au cache – mise à jour garage
      cacheMemoireJidLid.set(jid, lid);
      cacheModifie = true;

      // Debounce auto sauvegardera

      return lid;
    }
  } catch (erreur) {
    console.warn(`[Maserati-CacheJidLid] Erreur recherche LID pour ${jid} : ${erreur.message}`);
  }

  // 3. Fallback : retourne JID original – sécurité circuit
  return jid;
}

// Conversion batch IDs (JID/LID) → LID – traitement parallèle prestige
async function convertirIdsEnLid(nazu, ids) {
  if (!Array.isArray(ids) || ids.length === 0) return [];

  const convertis = [];

  // Traitement parallèle (batch de 5 – évite surcharge V8)
  const tailleBatch = 5;
  for (let i = 0; i < ids.length; i += tailleBatch) {
    const batch = ids.slice(i, i + tailleBatch);
    const promessesBatch = batch.map(id => obtenirLidDeJidCache(nazu, id));
    const resultatsBatch = await Promise.all(promessesBatch);
    convertis.push(...resultatsBatch);
  }

  return convertis;
}

// Export prestige – garage accessible
export {
  initialiserCacheJidLid,
  sauvegarderCacheJidLid,
  obtenirLidDeJidCache,
  convertirIdsEnLid
};