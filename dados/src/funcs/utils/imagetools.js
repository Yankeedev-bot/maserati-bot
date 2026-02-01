/**
 * Outils Image Prestige - Édition Maserati
 * Suppression de fond + Upscale via API vreden.my.id
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import axios from 'axios';

// ── CONFIGURATION PRESTIGE ──
const CONFIG_IMAGE_MASERATI = {
  URL_API: 'https://api.vreden.my.id/api/v1/artificial/imglarger',
  TIMEOUT_MS: 120000, // 2 min – pas de panne sur le circuit
  ECHELLE_DEFAUT: 2,
  ECHELLES_DISPONIBLES: [2, 4]
};

/**
 * Supprime le fond d’une image – nettoyage circuit
 * @param {string} urlImage - URL de l’image à traiter
 * @returns {Promise<Object>} Résultat avec URL sans fond
 */
async function maseratiSupprimerFond(urlImage) {
  try {
    if (!urlImage || typeof urlImage !== 'string' || !urlImage.trim()) {
      return { succes: false, message: '❌ URL de l’image obligatoire – donne-moi une piste valide !' };
    }

    console.log(`[Maserati-Image] Suppression fond → ${urlImage}`);

    const reponse = await axios.get(`${CONFIG_IMAGE_MASERATI.URL_API}/removebg`, {
      params: { url: urlImage },
      timeout: CONFIG_IMAGE_MASERATI.TIMEOUT_MS
    });

    if (!reponse.data?.result?.download) {
      return { succes: false, message: '❌ Impossible de retirer le fond – image trop complexe ou URL invalide' };
    }

    return {
      succes: true,
      message: `🖼️ *FOND SUPPRIMÉ PRESTIGE*\n\nImage nettoyée avec classe !`,
      url: reponse.data.result.download,
      details: reponse.data
    };
  } catch (err) {
    console.error('[Maserati-Image] Erreur suppression fond :', err.message);

    let messageErreur = '❌ Erreur lors du nettoyage de l’image';
    if (err.code === 'ECONNABORTED') {
      messageErreur = '❌ Temps de réponse dépassé – le serveur est en pleine course';
    } else if (err.response?.data?.message) {
      messageErreur = `❌ ${err.response.data.message}`;
    }

    return { succes: false, message: messageErreur };
  }
}

/**
 * Améliore la qualité d’une image (upscale) – boost MC20
 * @param {string} urlImage - URL de l’image à améliorer
 * @param {number} echelle - Facteur d’agrandissement (2 ou 4)
 * @returns {Promise<Object>} Résultat avec URL améliorée
 */
async function maseratiAmeliorerImage(urlImage, echelle = CONFIG_IMAGE_MASERATI.ECHELLE_DEFAUT) {
  try {
    if (!urlImage || typeof urlImage !== 'string' || !urlImage.trim()) {
      return { succes: false, message: '❌ URL de l’image obligatoire – envoie une piste nette !' };
    }

    const echelleFinale = Number(echelle);
    if (!CONFIG_IMAGE_MASERATI.ECHELLES_DISPONIBLES.includes(echelleFinale)) {
      return {
        succes: false,
        message: `❌ Échelle invalide ! Choisis 2× ou 4× (défaut : ${CONFIG_IMAGE_MASERATI.ECHELLE_DEFAUT}×)`
      };
    }

    console.log(`[Maserati-Image] Upscale ${echelleFinale}x → ${urlImage}`);

    const reponse = await axios.get(`${CONFIG_IMAGE_MASERATI.URL_API}/upscale`, {
      params: { url: urlImage, scale: echelleFinale },
      timeout: CONFIG_IMAGE_MASERATI.TIMEOUT_MS
    });

    if (!reponse.data?.result?.download) {
      return { succes: false, message: '❌ Impossible d’améliorer la qualité – image trop lourde ou URL invalide' };
    }

    return {
      succes: true,
      message: `📸 *IMAGE UPSCALE PRESTIGE* (${echelleFinale}×)\n\n` +
               `Qualité boostée – netteté trident activée !`,
      url: reponse.data.result.download,
      echelle: echelleFinale,
      details: reponse.data
    };
  } catch (err) {
    console.error('[Maserati-Image] Erreur upscale :', err.message);

    let messageErreur = '❌ Erreur lors de l’amélioration de l’image';
    if (err.code === 'ECONNABORTED') {
      messageErreur = '❌ Temps de réponse dépassé – le moteur chauffe !';
    } else if (err.response?.data?.message) {
      messageErreur = `❌ ${err.response.data.message}`;
    }

    return { succes: false, message: messageErreur };
  }
}

// Exports prestige
export default {
  maseratiSupprimerFond,
  maseratiAmeliorerImage
};

export {
  maseratiSupprimerFond,
  maseratiAmeliorerImage
};
