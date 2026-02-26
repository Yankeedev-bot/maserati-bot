/**
 * Index Captcha Prestige - Édition Maserati
 * Index en mémoire ultra-rapide pour captchas en attente (userId → groupe + réponse)
 * Évite de scanner tous les fichiers groupes à chaque message privé
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOSSIER_GROUPES = path.join(__dirname, '..', '..', 'database', 'grupos');
const FICHIER_INDEX = path.join(__dirname, '..', '..', 'database', 'captchaIndex-maserati.json');

/**
 * Index prestige : Map<userId, { groupId, answer, expiresAt, groupFile }>
 */
let indexCaptcha = new Map();
let initialise = false;
let timeoutSauvegarde = null;

/**
 * Initialise l’index captcha prestige
 * Charge depuis disque ou reconstruit depuis groupes
 */
async function initialiserIndexCaptcha() {
  if (initialise) return;

  try {
    // Tentative de chargement depuis fichier index
    if (existsSync(FICHIER_INDEX)) {
      const contenu = await fs.readFile(FICHIER_INDEX, 'utf-8');
      const parsed = JSON.parse(contenu);

      const maintenant = Date.now();
      for (const [userId, dataCaptcha] of Object.entries(parsed)) {
        if (dataCaptcha.expiresAt > maintenant) {
          indexCaptcha.set(userId, dataCaptcha);
        }
      }

      console.log(`[Maserati-CaptchaIndex] Chargé ${indexCaptcha.size} captchas en attente depuis l’index prestige`);
    } else {
      // Reconstruction depuis les fichiers groupes
      await reconstruireIndex();
    }

    initialise = true;

    // Nettoyage périodique des captchas expirés (toutes les 5 min)
    setInterval(nettoyerExpirés, 5 * 60 * 1000);

  } catch (erreur) {
    console.error('[Maserati-CaptchaIndex] Erreur initialisation :', erreur.message);
    indexCaptcha = new Map();
    initialise = true;
  }
}

/**
 * Reconstruit l’index depuis les fichiers groupes – mode récupération paddock
 */
async function reconstruireIndex() {
  console.log('[Maserati-CaptchaIndex] Reconstruction de l’index depuis les groupes...');
  indexCaptcha.clear();

  try {
    if (!existsSync(DOSSIER_GROUPES)) {
      console.log('[Maserati-CaptchaIndex] Dossier groupes inexistant pour le moment');
      return;
    }

    const fichiers = await fs.readdir(DOSSIER_GROUPES);
    const maintenant = Date.now();

    for (const fichier of fichiers) {
      if (!fichier.endsWith('.json')) continue;

      try {
        const cheminGroupe = path.join(DOSSIER_GROUPES, fichier);
        const contenu = await fs.readFile(cheminGroupe, 'utf-8');
        const dataGroupe = JSON.parse(contenu);

        if (dataGroupe.pendingCaptchas && typeof dataGroupe.pendingCaptchas === 'object') {
          for (const [userId, dataCaptcha] of Object.entries(dataGroupe.pendingCaptchas)) {
            if (dataCaptcha.expiresAt > maintenant) {
              indexCaptcha.set(userId, {
                groupId: dataCaptcha.groupId,
                answer: dataCaptcha.answer,
                expiresAt: dataCaptcha.expiresAt,
                groupFile: fichier
              });
            }
          }
        }
      } catch {
        // Ignore fichier corrompu
      }
    }

    console.log(`[Maserati-CaptchaIndex] Index reconstruit avec ${indexCaptcha.size} captchas en attente`);
    await sauvegarderIndex();

  } catch (erreur) {
    console.error('[Maserati-CaptchaIndex] Erreur reconstruction :', erreur.message);
  }
}

/**
 * Sauvegarde l’index sur disque avec debounce (anti-surcharge)
 */
async function sauvegarderIndex() {
  if (timeoutSauvegarde) {
    clearTimeout(timeoutSauvegarde);
  }

  timeoutSauvegarde = setTimeout(async () => {
    try {
      const data = Object.fromEntries(indexCaptcha);
      await fs.mkdir(path.dirname(FICHIER_INDEX), { recursive: true });
      await fs.writeFile(FICHIER_INDEX, JSON.stringify(data, null, 2), 'utf-8');
    } catch (erreur) {
      console.error('[Maserati-CaptchaIndex] Erreur sauvegarde index :', erreur.message);
    }
  }, 2000); // 2 secondes de debounce – circuit fluide
}

/**
 * Ajoute un captcha à l’index prestige
 * @param {string} userId - JID utilisateur
 * @param {string} groupId - JID groupe
 * @param {number} reponse - Réponse correcte
 * @param {number} expireLe - Timestamp expiration
 * @param {string} fichierGroupe - Nom fichier groupe (optionnel)
 */
function ajouterCaptcha(userId, groupId, reponse, expireLe, fichierGroupe = null) {
  indexCaptcha.set(userId, {
    groupId,
    answer: reponse,
    expiresAt: expireLe,
    groupFile: fichierGroupe || `${groupId.replace('@g.us', '')}.json`
  });

  sauvegarderIndex();
}

/**
 * Supprime un captcha de l’index
 * @param {string} userId - JID utilisateur
 * @returns {boolean} Succès
 */
function supprimerCaptcha(userId) {
  if (indexCaptcha.has(userId)) {
    indexCaptcha.delete(userId);
    sauvegarderIndex();
    return true;
  }
  return false;
}

/**
 * Récupère captcha en attente pour un pilote
 * @param {string} userId - JID utilisateur
 * @returns {object|null} Données captcha ou null
 */
function obtenirCaptcha(userId) {
  const captcha = indexCaptcha.get(userId);

  if (!captcha) return null;

  // Vérifie expiration
  if (captcha.expiresAt < Date.now()) {
    indexCaptcha.delete(userId);
    sauvegarderIndex();
    return null;
  }

  return captcha;
}

/**
 * Vérifie si pilote a captcha en attente
 * @param {string} userId - JID utilisateur
 * @returns {boolean}
 */
function aCaptchaEnAttente(userId) {
  return obtenirCaptcha(userId) !== null;
}

/**
 * Nettoie les captchas expirés – ménage paddock
 */
function nettoyerExpirés() {
  const maintenant = Date.now();
  let nettoyes = 0;

  for (const [userId, captcha] of indexCaptcha) {
    if (captcha.expiresAt < maintenant) {
      indexCaptcha.delete(userId);
      nettoyes++;
    }
  }

  if (nettoyes > 0) {
    console.log(`[Maserati-CaptchaIndex] Nettoyage : ${nettoyes} captchas expirés retirés du circuit`);
    sauvegarderIndex();
  }
}

/**
 * Retourne statistiques de l’index – tableau de bord prestige
 */
function obtenirStats() {
  const maintenant = Date.now();
  let expires = 0;
  let actifs = 0;

  for (const captcha of indexCaptcha.values()) {
    if (captcha.expiresAt < maintenant) {
      expires++;
    } else {
      actifs++;
    }
  }

  return {
    total: indexCaptcha.size,
    actifs,
    expires,
    initialise
  };
}

/**
 * Liste tous les captchas en attente pour un groupe donné
 * @param {string} groupId - JID groupe
 * @returns {Array} Liste des userIds + données captcha
 */
function obtenirCaptchasPourGroupe(groupId) {
  const resultat = [];
  const maintenant = Date.now();

  for (const [userId, captcha] of indexCaptcha) {
    if (captcha.groupId === groupId && captcha.expiresAt > maintenant) {
      resultat.push({ userId, ...captcha });
    }
  }

  return resultat;
}

export {
  initialiserIndexCaptcha,
  reconstruireIndex,
  ajouterCaptcha,
  supprimerCaptcha,
  obtenirCaptcha,
  aCaptchaEnAttente,
  nettoyerExpirés,
  obtenirStats,
  obtenirCaptchasPourGroupe
};

export default {
  init: initialiserIndexCaptcha,
  reconstruire: reconstruireIndex,
  ajouter: ajouterCaptcha,
  supprimer: supprimerCaptcha,
  obtenir: obtenirCaptcha,
  enAttente: aCaptchaEnAttente,
  stats: obtenirStats,
  pourGroupe: obtenirCaptchasPourGroupe
};