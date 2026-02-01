/**
 * Créateur de Stickers Prestige - Édition Maserati
 * Conversion image/vidéo → WebP animé avec metadata EXIF
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import webp from 'node-webpmux';
import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── CONFIGURATION PRESTIGE ──
const CONFIG_STICKER_MASERATI = {
  DOSSIER_TEMP: path.join(__dirname, '../../../database/tmp/stickers_maserati'),
  TAILLE_CIBLE: 320,                        // Résolution luxe (320×320 max WhatsApp)
  QUALITE_DEFAUT: 75,
  QUALITE_MIN: 15,
  QUALITE_VIDEO_DEFAUT: 45,
  MAX_TAILLE_OCTETS: 990000,                // < 1MB avec marge – limite WhatsApp
  MAX_TENTATIVES_COMPRESSION: 8,
  FPS_VIDEO: 15,
  DUREE_MAX_VIDEO_S: 8
};

// Création dossier temporaire prestige
function assurerDossierTemp() {
  const dossier = CONFIG_STICKER_MASERATI.DOSSIER_TEMP;
  if (!fsSync.existsSync(dossier)) {
    fsSync.mkdirSync(dossier, { recursive: true });
  }
  return dossier;
}

function genererNomFichierTemp(extension) {
  const dossier = assurerDossierTemp();
  return path.join(dossier, `\( {Date.now()}_ \){Math.floor(Math.random() * 1e6)}.${extension}`);
}

// Téléchargement → buffer prestige
async function obtenirBuffer(url) {
  try {
    const { data } = await axios.get(url, { responseType: 'arraybuffer' });
    if (!data || data.length === 0) throw new Error('Téléchargement vide – lien mort ou bloqué');
    return Buffer.from(data);
  } catch (err) {
    console.error('[Maserati-Sticker] Erreur téléchargement :', err.message);
    throw err;
  }
}

// Détection extension image minimale
function detecterExtensionImage(buffer) {
  if (buffer.length >= 12) {
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return 'png';
    if (buffer[0] === 0xFF && buffer[1] === 0xD8) return 'jpg';
    if (buffer.slice(0, 4).toString() === 'RIFF' && buffer.slice(8, 12).toString() === 'WEBP') return 'webp';
  }
  return 'jpg'; // fallback luxe
}

/**
 * Conversion prestige vers WebP (image ou vidéo animée)
 * @param {Buffer} mediaBuffer - Buffer média source
 * @param {boolean} estVideo - true si vidéo
 * @param {boolean} forceCarre - forcer format carré (stickers classiques)
 */
async function maseratiConvertirVersWebp(mediaBuffer, estVideo = false, forceCarre = false) {
  // Si déjà WebP statique et pas vidéo → retour direct
  if (!estVideo &&
      mediaBuffer.slice(0, 4).toString() === 'RIFF' &&
      mediaBuffer.slice(8, 12).toString() === 'WEBP') {
    return mediaBuffer;
  }

  const extensionEntree = estVideo ? 'mp4' : detecterExtensionImage(mediaBuffer);
  const fichierEntree = genererNomFichierTemp(extensionEntree);

  try {
    await fs.writeFile(fichierEntree, mediaBuffer);
    const statsEntree = await fs.stat(fichierEntree);
    if (statsEntree.size === 0) throw new Error('Fichier entrée temporaire vide');

    // Filtres vidéo prestige – format carré ou ratio préservé
    const vfBase = forceCarre
      ? `scale=\( {CONFIG_STICKER_MASERATI.TAILLE_CIBLE}: \){CONFIG_STICKER_MASERATI.TAILLE_CIBLE}:force_original_aspect_ratio=decrease,pad=\( {CONFIG_STICKER_MASERATI.TAILLE_CIBLE}: \){CONFIG_STICKER_MASERATI.TAILLE_CIBLE}:(ow-iw)/2:(oh-ih)/2:color=0x00000000,format=rgba`
      : `scale=\( {CONFIG_STICKER_MASERATI.TAILLE_CIBLE}: \){CONFIG_STICKER_MASERATI.TAILLE_CIBLE}:force_original_aspect_ratio=decrease,pad=\( {CONFIG_STICKER_MASERATI.TAILLE_CIBLE}: \){CONFIG_STICKER_MASERATI.TAILLE_CIBLE}:(ow-iw)/2:(oh-ih)/2:color=0x00000000,format=rgba`;

    const filtres = estVideo ? `\( {vfBase},fps= \){CONFIG_STICKER_MASERATI.FPS_VIDEO}` : vfBase;

    // Compression intelligente – plusieurs passes si nécessaire
    const MAX_TAILLE = CONFIG_STICKER_MASERATI.MAX_TAILLE_OCTETS;
    const QUALITE_MIN = estVideo ? 15 : 25;
    let qualite = estVideo ? CONFIG_STICKER_MASERATI.QUALITE_VIDEO_DEFAUT : CONFIG_STICKER_MASERATI.QUALITE_DEFAUT;
    let bufferSortie = null;
    let tentatives = 0;

    while (tentatives < CONFIG_STICKER_MASERATI.MAX_TENTATIVES_COMPRESSION) {
      tentatives++;
      const fichierSortie = genererNomFichierTemp('webp');

      const options = [
        '-vf', filtres,
        '-c:v', 'libwebp',
        '-lossless', '0',
        '-compression_level', '6',
        '-preset', 'default',
        ...(estVideo
          ? ['-q:v', String(qualite), '-loop', '0', '-an', '-vsync', '0', '-t', String(CONFIG_STICKER_MASERATI.DUREE_MAX_VIDEO_S)]
          : ['-q:v', String(qualite)])
      ];

      await new Promise((resolve, reject) => {
        ffmpeg(fichierEntree)
          .outputOptions(options)
          .format('webp')
          .on('error', err => reject(err))
          .on('end', () => resolve())
          .save(fichierSortie);
      });

      const statsSortie = await fs.stat(fichierSortie).catch(() => null);
      if (!statsSortie || statsSortie.size === 0) {
        await fs.unlink(fichierSortie).catch(() => {});
        throw new Error('Échec conversion : sortie vide');
      }

      bufferSortie = await fs.readFile(fichierSortie);
      await fs.unlink(fichierSortie).catch(() => {});

      // Vérification taille
      if (bufferSortie.length <= MAX_TAILLE) {
        break;
      }

      // Réduction qualité progressive
      if (qualite <= QUALITE_MIN) break;

      const facteurReduction = bufferSortie.length / MAX_TAILLE;
      if (facteurReduction > 1.5) {
        qualite = Math.max(QUALITE_MIN, Math.floor(qualite * 0.6));
      } else if (facteurReduction > 1.2) {
        qualite = Math.max(QUALITE_MIN, Math.floor(qualite * 0.75));
      } else {
        qualite = Math.max(QUALITE_MIN, qualite - 10);
      }
    }

    return bufferSortie;
  } finally {
    // Nettoyage prestige
    await fs.unlink(fichierEntree).catch(() => {});
  }
}

/**
 * Ajoute metadata EXIF prestige (packname, author, emojis)
 */
async function maseratiAjouterExif(bufferWebp, metadata) {
  try {
    const image = new webp.Image();
    await image.load(bufferWebp);

    const json = {
      "sticker-pack-id": "https://github.com/yankeeHells/MaseratiBot",
      "sticker-pack-name": metadata.packname || "Maserati Prestige",
      "sticker-pack-publisher": metadata.author || "yankee Hells 🏎️",
      "emojis": ["🏎️", "👑", "✨", "🇨🇮", "🔥"]
    };

    const exifAttr = Buffer.from([
      0x49, 0x49, 0x2A, 0x00,
      0x08, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x41, 0x57,
      0x07, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x16, 0x00,
      0x00, 0x00
    ]);

    const jsonBuff = Buffer.from(JSON.stringify(json), 'utf-8');
    const exif = Buffer.concat([exifAttr, jsonBuff]);
    exif.writeUIntLE(jsonBuff.length, 14, 4);

    image.exif = exif;
    return await image.save(null);
  } catch (err) {
    console.error('[Maserati-Sticker] Erreur EXIF :', err.message);
    return bufferWebp; // Fallback silencieux
  }
}

/**
 * Résout n’importe quel input vers buffer (URL, chemin, base64, buffer direct)
 */
async function maseratiResoudreVersBuffer(input) {
  if (Buffer.isBuffer(input)) return input;

  if (typeof input === 'string') {
    if (/^data:.*?;base64,/i.test(input)) {
      return Buffer.from(input.split(',')[1], 'base64');
    }
    if (/^https?:\/\//i.test(input)) {
      return await obtenirBuffer(input);
    }
    // Chemin local
    return await fs.readFile(input);
  }

  if (input && typeof input === 'object' && input.url) {
    return await obtenirBuffer(input.url);
  }

  throw new Error('Entrée sticker invalide – format non reconnu');
}

/**
 * Envoie un sticker prestige (image ou vidéo animée)
 * @param {object} nazu - Instance bot WhatsApp
 * @param {string} jid - JID destinataire
 * @param {object} options - Options sticker
 * @param {object} [options.quoted] - Message cité (optionnel)
 */
const maseratiEnvoyerSticker = async (nazu, jid, {
  sticker: input,
  type = 'image',                // 'image' ou 'video'
  packname = 'Maserati Prestige',
  author = 'yankee Hells 🏎️',
  forceCarre = false
}, { quoted } = {}) => {
  if (!['image', 'video'].includes(type)) {
    throw new Error('Type doit être "image" ou "video"');
  }

  const buffer = await maseratiResoudreVersBuffer(input);
  if (!buffer || buffer.length < 10) {
    throw new Error('Buffer média invalide ou vide');
  }

  let bufferWebp = await maseratiConvertirVersWebp(buffer, type === 'video', forceCarre);

  if (packname || author) {
    bufferWebp = await maseratiAjouterExif(bufferWebp, { packname, author });
  }

  await nazu.sendMessage(jid, { sticker: bufferWebp }, { quoted });
  return bufferWebp;
};

// Exports prestige
export {
  maseratiEnvoyerSticker,
  maseratiConvertirVersWebp,
  maseratiAjouterExif,
  maseratiResoudreVersBuffer
};

export default {
  envoyerSticker: maseratiEnvoyerSticker,
  convertirWebp: maseratiConvertirVersWebp,
  ajouterExif: maseratiAjouterExif,
  resoudreBuffer: maseratiResoudreVersBuffer
};
