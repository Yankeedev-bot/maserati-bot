/**
 * Service d’Upload Prestige - Édition Maserati
 * Upload fichiers vers GitHub (repo privé) avec détection type et suppression auto
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import axios from 'axios';

// ── CONFIGURATION PRESTIGE ──
const CONFIG_UPLOAD_MASERATI = {
  REPO_GITHUB: 'nazuninha/uploads',                // Repo cible (peut être changé)
  URL_API_GITHUB: 'https://api.github.com/repos',
  TOKEN_FALLBACK: ["ghp", "_F", "AaqJ", "0l4", "m1O4", "Wdno", "hEltq", "PyJY4", "sWz", "W4", "JfM", "Ni"].join(""),
  TAILLE_MAX_MB: 50,
  DELAI_SUPPRESSION_AUTO_MIN: 10,
  TIMEOUT_MS: 120000,
  TYPES_FICHIERS: {
    photos: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'tiff', 'ico', 'jfif', 'heic'],
    videos: ['mp4', 'avi', 'mkv', 'mov', 'webm', 'flv', 'wmv', 'mpeg', 'mpg'],
    audios: ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac', 'wma', 'midi'],
    documents: ['pdf', 'doc', 'docx', 'xlsx', 'pptx', 'zip', 'rar', '7z', 'iso', 'apk', 'rtf', 'epub', 'txt', 'json', 'xml', 'csv', 'md', 'html', 'css', 'js', 'sql']
  },
  MOTIF_IGNORER: 'Update on'                     // Ignorer commits auto si besoin
};

// Map inverse rapide pour dossier par extension
const MAP_EXTENSION_DOSSIER = new Map();
for (const [dossier, extensions] of Object.entries(CONFIG_UPLOAD_MASERATI.TYPES_FICHIERS)) {
  for (const ext of extensions) {
    MAP_EXTENSION_DOSSIER.set(ext, dossier);
  }
}

// ── DÉTECTEUR DE TYPE FICHIER PRESTIGE ──
class DetecteurTypeFichierMaserati {
  static cacheMime = new Map();

  static SIGNATURES = {
    'ffd8ff': { ext: 'jpg', mime: 'image/jpeg' },
    '89504e47': { ext: 'png', mime: 'image/png' },
    '47494638': { ext: 'gif', mime: 'image/gif' },
    '52494646': {
      handler: (b) => ({
        '57454250': { ext: 'webp', mime: 'image/webp' },
        '41564920': { ext: 'avi', mime: 'video/x-msvideo' },
        '57415645': { ext: 'wav', mime: 'audio/wav' }
      })[b.toString('hex', 8, 12)] || { ext: 'bin', mime: 'application/octet-stream' }
    },
    '49492a00': { ext: 'tiff', mime: 'image/tiff' },
    '4d4d002a': { ext: 'tiff', mime: 'image/tiff' },
    '1a45dfa3': { ext: 'mkv', mime: 'video/x-matroska' },
    '424d': { ext: 'bmp', mime: 'image/bmp' },
    '0000001c66747970': {
      handler: (b) => b.toString('hex', 16, 24) === '6d703432'
        ? { ext: 'm4a', mime: 'audio/mp4' }
        : { ext: 'mp4', mime: 'video/mp4' }
    },
    '0000002066747970': { ext: 'mp4', mime: 'video/mp4' },
    '4f676753': { ext: 'ogg', mime: 'audio/ogg' },
    '494433': { ext: 'mp3', mime: 'audio/mpeg' },
    '25504446': { ext: 'pdf', mime: 'application/pdf' },
    '504b0304': { ext: 'zip', mime: 'application/zip' },
    '526172211a0700': { ext: 'rar', mime: 'application/vnd.rar' },
    '377abcaf271c': { ext: '7z', mime: 'application/x-7z-compressed' },
    '4d5a': { ext: 'exe', mime: 'application/x-ms-download' },
    '7b22': { ext: 'json', mime: 'application/json' },
    '3c3f786d6c': { ext: 'xml', mime: 'application/xml' },
    '3c21444f4354595045': { ext: 'html', mime: 'text/html' }
  };

  static detecter(buffer) {
    if (!Buffer.isBuffer(buffer) || buffer.length < 8) {
      return { ext: 'bin', mime: 'application/octet-stream' };
    }

    const cleCache = buffer.toString('hex', 0, 12);
    if (this.cacheMime.has(cleCache)) return this.cacheMime.get(cleCache);

    for (let len = 16; len >= 2; len -= 2) {
      const hex = buffer.toString('hex', 0, len / 2);
      if (this.SIGNATURES[hex]) {
        const sig = this.SIGNATURES[hex];
        const resultat = typeof sig.handler === 'function' ? sig.handler(buffer) : sig;
        if (resultat) {
          this.cacheMime.set(cleCache, resultat);
          return resultat;
        }
      }
    }

    // Fallback texte
    const echantillon = buffer.toString('utf8', 0, 50).trim().toLowerCase();
    if (echantillon.startsWith('<!doctype html') || echantillon.startsWith('<html>')) {
      return { ext: 'html', mime: 'text/html' };
    }
    if (echantillon.startsWith('<?xml')) {
      return { ext: 'xml', mime: 'application/xml' };
    }

    const fallback = { ext: 'txt', mime: 'text/plain' };
    this.cacheMime.set(cleCache, fallback);
    return fallback;
  }
}

// ── UPLOADER GITHUB PRESTIGE ──
class UploaderGitHubPrestige {
  constructor(token, repo) {
    this.headers = {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'MaseratiBot/1.0'
    };
    this.urlApi = `\( {CONFIG_UPLOAD_MASERATI.URL_API_GITHUB}/ \){repo}/contents`;
  }

  async uploader(buffer, cheminFichier) {
    const contenuBase64 = buffer.toString('base64');
    const reponse = await axios.put(
      `\( {this.urlApi}/ \){cheminFichier}`,
      {
        message: `Upload prestige: ${cheminFichier} – Maserati Bot 🏎️`,
        content: contenuBase64
      },
      { headers: this.headers, timeout: CONFIG_UPLOAD_MASERATI.TIMEOUT_MS }
    );

    return reponse.data.content;
  }

  async supprimer(cheminFichier, sha) {
    await axios.delete(
      `\( {this.urlApi}/ \){cheminFichier}`,
      {
        headers: this.headers,
        data: { message: `Suppression auto: ${cheminFichier}`, sha }
      }
    );
  }
}

// ── SERVICE PRINCIPAL ──
class ServiceUploadMaserati {
  constructor(config) {
    if (!config.GITHUB.TOKEN) throw new Error('Token GitHub non configuré – impossible de démarrer le garage prestige');
    this.uploader = new UploaderGitHubPrestige(config.GITHUB.TOKEN, config.GITHUB.REPO);
    this.tailleMaxOctets = config.MAX_FILE_SIZE_MB * 1024 * 1024;
  }

  /**
   * Upload un buffer vers GitHub avec style Maserati
   * @param {Buffer} buffer - Données du fichier
   * @param {boolean} [supprimerApres10Min=false] - Suppression auto après 10 min
   * @returns {Promise<string>} URL de téléchargement publique
   */
  async maseratiUploadFichier(buffer, supprimerApres10Min = false) {
    if (!Buffer.isBuffer(buffer)) {
      throw new Error('Entrée invalide – je n’accepte que des Buffers prestige !');
    }

    if (buffer.length > this.tailleMaxOctets) {
      throw new Error(`Fichier trop lourd – limite garage : ${CONFIG_UPLOAD_MASERATI.TAILLE_MAX_MB}MB`);
    }

    const { ext } = DetecteurTypeFichierMaserati.detecter(buffer);
    const dossier = MAP_EXTENSION_DOSSIER.get(ext) || 'autres';
    const nomFichier = `\( {Date.now()}_ \){Math.random().toString(36).substring(2, 10)}.${ext}`;
    const cheminComplet = `\( {dossier}/ \){nomFichier}`;

    try {
      console.log(`[Maserati-Upload] Envoi prestige → \( {cheminComplet} ( \){ext})`);

      const { download_url, sha } = await this.uploader.uploader(buffer, cheminComplet);

      if (!download_url) {
        throw new Error('Réponse GitHub sans URL de téléchargement – garage en panne ?');
      }

      // Suppression auto après 10 min si demandé
      if (supprimerApres10Min) {
        setTimeout(async () => {
          try {
            await this.uploader.supprimer(cheminComplet, sha);
            console.log(`[Maserati-Upload] Fichier temporaire supprimé : ${cheminComplet}`);
          } catch (errSuppr) {
            console.error(`[Maserati-Upload] Échec suppression auto ${cheminComplet} :`, errSuppr.message);
          }
        }, 10 * 60 * 1000);
      }

      return download_url;
    } catch (err) {
      const msgErreur = err.response?.data?.message || err.message;
      console.error('[Maserati-Upload] Échec upload :', msgErreur);
      throw new Error(`Échec upload vers GitHub – ${msgErreur}`);
    }
  }
}

// Instance unique – garage unique Maserati
const service = new ServiceUploadMaserati(CONFIG_UPLOAD_MASERATI);

/**
 * Fonction d’export principale – upload prestige
 * @param {Buffer} buffer - Données à uploader
 * @param {boolean} [supprimerApres10Min=false] - Auto-delete après 10 min
 * @returns {Promise<string>} URL publique
 */
async function maseratiUpload(buffer, supprimerApres10Min = false) {
  return service.maseratiUploadFichier(buffer, supprimerApres10Min);
}

export default maseratiUpload;
