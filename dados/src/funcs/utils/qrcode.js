/**
 * Module QR Code Prestige - Édition Maserati
 * Génération et lecture de QR Codes via qrserver.com
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import axios from 'axios';

// ── CONFIGURATION PRESTIGE ──
const CONFIG_QR_MASERATI = {
  TAILLE_DEFAUT: 300,                       // Taille image luxe (px)
  URL_GENERATION: 'https://api.qrserver.com/v1/create-qr-code/',
  URL_LECTURE: 'https://api.qrserver.com/v1/read-qr-code/',
  TIMEOUT_MS: 120000                        // 2 min – pas de panne sur le circuit
};

/**
 * Génère un QR Code prestige à partir de texte
 * @param {string} texte - Contenu à encoder
 * @param {number} [taille=300] - Taille en pixels
 * @param {string} [prefixe='/'] - Préfixe commande
 * @returns {Promise<{succes: boolean, buffer?: Buffer, message?: string}>}
 */
const maseratiGenererQR = async (texte, taille = CONFIG_QR_MASERATI.TAILLE_DEFAUT, prefixe = '/') => {
  if (!texte || texte.trim() === '') {
    return {
      succes: false,
      message: `❌ Fournis un texte pour générer le QR Code prestige !\n\n` +
               `💡 Utilisation : ${prefixe}qrcode <texte>\n` +
               `Exemple : ${prefixe}qrcode https://moncircuit.com`
    };
  }

  if (texte.length > 2000) {
    return {
      succes: false,
      message: `❌ Texte trop long ! Maximum 2000 caractères sur le circuit.`
    };
  }

  try {
    const url = `\( {CONFIG_QR_MASERATI.URL_GENERATION}?size= \){taille}x\( {taille}&data= \){encodeURIComponent(texte)}`;

    const reponse = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: CONFIG_QR_MASERATI.TIMEOUT_MS
    });

    return {
      succes: true,
      buffer: Buffer.from(reponse.data),
      message: `✅ *QR CODE PRESTIGE GÉNÉRÉ*\n\n` +
               `📝 Contenu : \( {texte.slice(0, 100)} \){texte.length > 100 ? '...' : ''}\n\n` +
               `Taille : \( {taille}× \){taille} px`
    };
  } catch (err) {
    console.error('[Maserati-QR] Erreur génération :', err.message);
    return {
      succes: false,
      message: `❌ Erreur lors de la génération du QR Code – vérifie ta connexion au paddock !`
    };
  }
};

/**
 * Génère l’URL directe d’un QR Code (sans télécharger l’image)
 * @param {string} texte - Contenu à encoder
 * @param {number} [taille=300] - Taille en pixels
 * @returns {string} URL de l’image QR
 */
const maseratiObtenirURLQR = (texte, taille = CONFIG_QR_MASERATI.TAILLE_DEFAUT) => {
  return `\( {CONFIG_QR_MASERATI.URL_GENERATION}?size= \){taille}x\( {taille}&data= \){encodeURIComponent(texte)}`;
};

/**
 * Lit un QR Code depuis une image (buffer ou URL)
 * @param {Buffer|string} entreeImage - Buffer ou URL de l’image
 * @returns {Promise<{succes: boolean, donnees?: string, message?: string}>}
 */
const maseratiLireQR = async (entreeImage) => {
  try {
    let reponse;

    if (Buffer.isBuffer(entreeImage)) {
      // Envoi buffer via form-data
      const FormData = (await import('form-data')).default;
      const form = new FormData();
      form.append('file', entreeImage, {
        filename: 'qrcode_prestige.png',
        contentType: 'image/png'
      });

      reponse = await axios.post(CONFIG_QR_MASERATI.URL_LECTURE, form, {
        headers: form.getHeaders(),
        timeout: CONFIG_QR_MASERATI.TIMEOUT_MS
      });
    } else if (typeof entreeImage === 'string' && entreeImage.trim()) {
      // Envoi URL
      reponse = await axios.get(`\( {CONFIG_QR_MASERATI.URL_LECTURE}?fileurl= \){encodeURIComponent(entreeImage)}`, {
        timeout: CONFIG_QR_MASERATI.TIMEOUT_MS
      });
    } else {
      return { succes: false, message: '❌ Format d’image invalide – envoie un buffer ou une URL valide !' };
    }

    const resultat = reponse.data;

    if (Array.isArray(resultat) && resultat[0]?.symbol?.[0]) {
      const symbole = resultat[0].symbol[0];

      if (symbole.error) {
        return {
          succes: false,
          message: `❌ Impossible de lire le QR Code !\n\n📌 Erreur : ${symbole.error}`
        };
      }

      const donnees = symbole.data;

      if (donnees) {
        return {
          succes: true,
          donnees,
          message: `✅ *QR CODE DÉCODÉ PRESTIGE*\n\n🏷️ Contenu :\n${donnees}`
        };
      }
    }

    return { succes: false, message: '❌ Aucun QR Code détecté dans l’image !' };
  } catch (err) {
    console.error('[Maserati-QR] Erreur lecture :', err.message);
    return {
      succes: false,
      message: `❌ Erreur lors de la lecture du QR Code – vérifie que l’image contient un code valide !`
    };
  }
};

/**
 * Lit un QR Code depuis une URL d’image
 * @param {string} urlImage - URL de l’image
 */
const maseratiLireQRDepuisURL = async (urlImage) => {
  return maseratiLireQR(urlImage);
};

/**
 * Lit un QR Code depuis un buffer d’image
 * @param {Buffer} bufferImage - Buffer de l’image
 */
const maseratiLireQRDepuisBuffer = async (bufferImage) => {
  return maseratiLireQR(bufferImage);
};

/**
 * Détecte si un texte ressemble à une URL
 * @param {string} texte
 * @returns {boolean}
 */
const estURL = (texte) => {
  try {
    new URL(texte);
    return true;
  } catch {
    return /^(https?:\/\/|www\.)/i.test(texte);
  }
};

/**
 * Formate la réponse de lecture avec détection de type prestige
 * @param {string} donnees - Données lues du QR
 * @returns {string} Message formaté luxe
 */
const formaterResultatLecture = (donnees) => {
  let type = '📝 Texte';
  let extra = '';

  if (estURL(donnees)) {
    type = '🔗 Lien';
    extra = '\n\n⚠️ Attention aux liens inconnus – sécurité trident activée !';
  } else if (donnees.startsWith('mailto:')) {
    type = '📧 Email';
  } else if (donnees.startsWith('tel:')) {
    type = '📞 Téléphone';
  } else if (donnees.startsWith('WIFI:')) {
    type = '📶 Wi-Fi';
  } else if (donnees.startsWith('BEGIN:VCARD')) {
    type = '👤 Contact vCard';
  } else if (/^[0-9]{8,}$/.test(donnees)) {
    type = '📊 Code numérique';
  }

  return `✅ *QR CODE DÉCODÉ PRESTIGE*\n\n` +
         `🏷️ Type : ${type}\n\n` +
         `📝 Contenu :\n\( {donnees} \){extra}`;
};

// Exports prestige
export {
  maseratiGenererQR,
  maseratiObtenirURLQR,
  maseratiLireQR,
  maseratiLireQRDepuisURL,
  maseratiLireQRDepuisBuffer,
  formaterResultatLecture,
  estURL
};

export default {
  generer: maseratiGenererQR,
  obtenirURL: maseratiObtenirURLQR,
  lire: maseratiLireQR,
  lireURL: maseratiLireQRDepuisURL,
  lireBuffer: maseratiLireQRDepuisBuffer,
  formaterLecture: formaterResultatLecture
};
