/**
 * Service Likes Free Fire Prestige - Édition Maserati
 * Envoi automatique de likes via hubsteam.com.br
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import axios from 'axios';

// ── CONFIGURATION PRESTIGE ──
const CONFIG_FF_LIKES = {
  URL_BASE: 'https://hubsteam.com.br',
  CLE_EXTERNE: 'c95b81d2-8ebc-4af7-9ae8-8de9dd48fe6d', // Clé API – garde-la secrète comme un prototype MC20
  REGION_DEFAUT: 'BR',
  TIMEOUT_MS: 120000, // 2 min – pas de panne sur le circuit
  MIN_LIKES_ATTENDUS: 100
};

// ── ERREURS CUSTOM LUXE ──
class ErreurLikesMaserati extends Error {
  constructor(message) {
    super(message);
    this.name = 'ErreurLikesMaserati';
  }
}

/**
 * Envoie une vague de likes prestige sur un joueur Free Fire
 * @param {string|number} uidJoueur - UID du joueur (doit être numérique)
 * @returns {Promise<Object>} Résultat de l’opération
 */
async function maseratiEnvoyerLikesFreeFire(uidJoueur) {
  try {
    if (!CONFIG_FF_LIKES.CLE_EXTERNE) {
      return { succes: false, message: '❌ Clé API likes non configurée – contacte le garage !' };
    }

    const uid = String(uidJoueur).trim();
    if (!uid || !/^\d+$/.test(uid)) {
      return {
        succes: false,
        message: '❌ UID invalide ! Doit contenir uniquement des chiffres (ex: 1234567890)'
      };
    }

    console.log(`[Maserati-FFLikes] Envoi likes prestige → UID: ${uid}`);

    const reponse = await axios.get(`${CONFIG_FF_LIKES.URL_BASE}/api/sendlikes`, {
      params: {
        id: uid,
        key: CONFIG_FF_LIKES.CLE_EXTERNE,
        region: CONFIG_FF_LIKES.REGION_DEFAUT
      },
      timeout: CONFIG_FF_LIKES.TIMEOUT_MS
    });

    const donnees = reponse.data;
    const succes = donnees.success === true && donnees.usageCounted === true;

    if (!succes) {
      const messagesErreur = {
        'player_not_found': 'Joueur introuvable sur le circuit',
        'INSUFFICIENT_LIKES': 'Moins de 100 likes envoyés – vague trop faible',
        'KEY_NOT_FOUND': 'Clé API introuvable',
        'KEY_INACTIVE': 'Clé API désactivée',
        'KEY_BLOCKED': 'Clé API bloquée',
        'KEY_EXPIRED': 'Clé API expirée',
        'LIMIT_EXCEEDED': 'Limite quotidienne atteinte',
        'TOTAL_LIMIT_EXCEEDED': 'Limite totale dépassée'
      };

      return {
        succes: false,
        message: messagesErreur[donnees.error] || donnees.message || 'Erreur lors de l’envoi de likes',
        details: donnees
      };
    }

    return {
      succes: true,
      message: `🔥 *VAGUE DE LIKES ENVOYÉE PRESTIGE !* 🏎️👑✨\n\n` +
               `Joueur : ${donnees.player}\n` +
               `UID : ${donnees.uid}\n` +
               `Région : ${donnees.region}\n\n` +
               `Likes avant : ${donnees.initialLikes}\n` +
               `Likes après : ${donnees.finalLikes}\n` +
               `Likes ajoutés : +${donnees.likesAdded}\n\n` +
               `Niveau : ${donnees.level} | EXP : ${donnees.exp}`,
      joueur: donnees.player,
      uid: donnees.uid,
      likesAjoutes: donnees.likesAdded,
      niveau: donnees.level,
      exp: donnees.exp,
      timestamp: donnees.timestamp,
      details: donnees
    };
  } catch (err) {
    console.error('[Maserati-FFLikes] Erreur :', err.message);

    if (err.response?.data) {
      const data = err.response.data;
      return {
        succes: false,
        message: data.message || 'Erreur lors de l’envoi des likes',
        details: data
      };
    }

    return {
      succes: false,
      message: err.code === 'ECONNABORTED'
        ? '❌ Temps de réponse dépassé – le serveur est en pleine course'
        : '❌ Impossible de contacter le service likes – vérifie ta connexion au paddock'
    };
  }
}

// Exports prestige
export default { maseratiEnvoyerLikesFreeFire };

export {
  maseratiEnvoyerLikesFreeFire
};
