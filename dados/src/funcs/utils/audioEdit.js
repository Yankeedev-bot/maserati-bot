/**
 * Module Édition Audio Prestige - Édition Maserati
 * Couper, accélérer, inverser, booster les basses, normaliser le volume
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOSSIER_TEMP_AUDIO = path.join(__dirname, '../../../../temp/audio_maserati');

// Configuration prestige
const CONFIG_AUDIO_MASERATI = {
  DUREE_MAX_SECONDES: 300,          // 5 min max – pas de limousine trop longue
  DUREE_MIN_SECONDES: 1,            // 1 sec minimum
  VITESSE_MIN: 0.5,                 // 50% – mode ralenti luxe
  VITESSE_MAX: 3.0,                 // 300% – mode turbo V8
  FORMATS_SUPPORTES: ['mp3', 'ogg', 'wav', 'm4a', 'opus', 'aac']
};

// Créer dossier temp si besoin
const creerDossierTemp = () => {
  if (!fs.existsSync(DOSSIER_TEMP_AUDIO)) {
    fs.mkdirSync(DOSSIER_TEMP_AUDIO, { recursive: true });
  }
};

// Générer chemin temporaire unique prestige
const genererCheminTemp = (extension = 'mp3') => {
  creerDossierTemp();
  const idUnique = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  return path.join(DOSSIER_TEMP_AUDIO, `maserati_audio_\( {idUnique}. \){extension}`);
};

// Nettoyage temp – paddock propre
const nettoyerTemp = (cheminFichier) => {
  try {
    if (fs.existsSync(cheminFichier)) {
      fs.unlinkSync(cheminFichier);
    }
  } catch (err) {
    console.error('[Maserati-Audio] Erreur nettoyage temp :', err.message);
  }
};

// Format temps HH:MM:SS prestige
const formaterTemps = (secondes) => {
  const h = Math.floor(secondes / 3600);
  const m = Math.floor((secondes % 3600) / 60);
  const s = Math.floor(secondes % 60);
  return `\( {h.toString().padStart(2, '0')}: \){m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

// Parser temps flexible (SS, MM:SS, HH:MM:SS)
const parserTemps = (strTemps) => {
  if (typeof strTemps === 'number') return strTemps;

  const parties = strTemps.toString().split(':').map(Number);

  if (parties.some(isNaN)) return null;

  if (parties.length === 1) return parties[0];               // secondes seules
  if (parties.length === 2) return parties[0] * 60 + parties[1]; // MM:SS
  if (parties.length === 3) return parties[0] * 3600 + parties[1] * 60 + parties[2]; // HH:MM:SS

  return null;
};

// Obtenir durée audio (ffprobe)
const obtenirDureeAudio = async (cheminFichier) => {
  try {
    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${cheminFichier}"`
    );
    return parseFloat(stdout.trim());
  } catch (err) {
    console.error('[Maserati-Audio] Erreur obtention durée :', err.message);
    return null;
  }
};

// ── COUPER AUDIO (PRÉCISION MC20) ──

const maseratiCouperAudio = async (bufferAudio, debut, fin, prefixe = '/') => {
  const tempsDebut = parserTemps(debut);
  const tempsFin   = parserTemps(fin);

  if (tempsDebut === null || tempsFin === null) {
    return {
      succes: false,
      message: `❌ Format de temps invalide !\n\n` +
               `💡 Formats prestige acceptés :\n` +
               `• Secondes : 45\n` +
               `• MM:SS     : 1:30\n` +
               `• HH:MM:SS  : 0:02:15\n\n` +
               `📌 Exemple : ${prefixe}couper 0:10 0:45`
    };
  }

  if (tempsDebut < 0 || tempsFin < 0) {
    return { succes: false, message: '❌ Les temps ne peuvent pas être négatifs !' };
  }

  if (tempsDebut >= tempsFin) {
    return { succes: false, message: '❌ Le début doit être avant la fin !' };
  }

  const dureeCoupe = tempsFin - tempsDebut;
  if (dureeCoupe > CONFIG_AUDIO_MASERATI.DUREE_MAX_SECONDES) {
    return { succes: false, message: `❌ Coupe trop longue ! Maximum : ${CONFIG_AUDIO_MASERATI.DUREE_MAX_SECONDES} secondes` };
  }

  if (dureeCoupe < CONFIG_AUDIO_MASERATI.DUREE_MIN_SECONDES) {
    return { succes: false, message: `❌ Coupe trop courte ! Minimum : ${CONFIG_AUDIO_MASERATI.DUREE_MIN_SECONDES} seconde` };
  }

  const cheminEntree  = genererCheminTemp('input');
  const cheminSortie  = genererCheminTemp('mp3');

  try {
    fs.writeFileSync(cheminEntree, bufferAudio);

    const dureeOriginale = await obtenirDureeAudio(cheminEntree);
    if (dureeOriginale && tempsFin > dureeOriginale) {
      nettoyerTemp(cheminEntree);
      return {
        succes: false,
        message: `❌ Fin (\( {formaterTemps(tempsFin)}) dépasse la durée totale ( \){formaterTemps(dureeOriginale)})`
      };
    }

    await execAsync(
      `ffmpeg -y -i "${cheminEntree}" -ss ${tempsDebut} -to \( {tempsFin} -c:a libmp3lame -q:a 2 " \){cheminSortie}"`
    );

    const bufferResultat = fs.readFileSync(cheminSortie);

    nettoyerTemp(cheminEntree);
    nettoyerTemp(cheminSortie);

    return {
      succes: true,
      buffer: bufferResultat,
      message: `✂️ *AUDIO COUPÉ PRESTIGE*\n\n` +
               `⏱️ Début : ${formaterTemps(tempsDebut)}\n` +
               `⏱️ Fin   : ${formaterTemps(tempsFin)}\n` +
               `📊 Durée : ${formaterTemps(dureeCoupe)}`
    };
  } catch (err) {
    console.error('[Maserati-Audio] Erreur coupe :', err.message);
    nettoyerTemp(cheminEntree);
    nettoyerTemp(cheminSortie);
    return { succes: false, message: '❌ Erreur lors de la coupe audio. Fichier invalide ?' };
  }
};

// ── CHANGER VITESSE (TURBO OU SLOW-MO) ──

const maseratiChangerVitesse = async (bufferAudio, vitesse) => {
  const valeurVitesse = parseFloat(vitesse);

  if (isNaN(valeurVitesse)) {
    return {
      succes: false,
      message: `❌ Vitesse invalide !\n\n` +
               `💡 Valeur entre ${CONFIG_AUDIO_MASERATI.VITESSE_MIN} et ${CONFIG_AUDIO_MASERATI.VITESSE_MAX}\n\n` +
               `Exemples prestige :\n` +
               `• 0.5 → mode ralenti luxe\n` +
               `• 1.0 → vitesse normale\n` +
               `• 1.5 → accélération sportive\n` +
               `• 2.0 → turbo V8`
    };
  }

  if (valeurVitesse < CONFIG_AUDIO_MASERATI.VITESSE_MIN || valeurVitesse > CONFIG_AUDIO_MASERATI.VITESSE_MAX) {
    return {
      succes: false,
      message: `❌ Vitesse hors limites ! (${CONFIG_AUDIO_MASERATI.VITESSE_MIN} – ${CONFIG_AUDIO_MASERATI.VITESSE_MAX})`
    };
  }

  const cheminEntree = genererCheminTemp('input');
  const cheminSortie = genererCheminTemp('mp3');

  try {
    fs.writeFileSync(cheminEntree, bufferAudio);

    const dureeOrig = await obtenirDureeAudio(cheminEntree);
    if (dureeOrig && dureeOrig / valeurVitesse > CONFIG_AUDIO_MASERATI.DUREE_MAX_SECONDES) {
      nettoyerTemp(cheminEntree);
      return { succes: false, message: `❌ Résultat trop long ! Maximum ${CONFIG_AUDIO_MASERATI.DUREE_MAX_SECONDES}s` };
    }

    // Gestion atempo (ffmpeg limite 0.5-2.0 par filtre → chaînage)
    let filtresAtempo = [];
    let resteVitesse = valeurVitesse;

    while (resteVitesse < 0.5) {
      filtresAtempo.push('atempo=0.5');
      resteVitesse /= 0.5;
    }
    while (resteVitesse > 2.0) {
      filtresAtempo.push('atempo=2.0');
      resteVitesse /= 2.0;
    }
    filtresAtempo.push(`atempo=${resteVitesse}`);

    const filtreFinal = filtresAtempo.join(',');

    await execAsync(
      `ffmpeg -y -i "\( {cheminEntree}" -filter:a " \){filtreFinal}" -c:a libmp3lame -q:a 2 "${cheminSortie}"`
    );

    const bufferResultat = fs.readFileSync(cheminSortie);

    const nouvelleDuree = dureeOrig ? dureeOrig / valeurVitesse : null;

    nettoyerTemp(cheminEntree);
    nettoyerTemp(cheminSortie);

    const emojiVitesse = valeurVitesse > 1 ? '⏩' : valeurVitesse < 1 ? '⏪' : '▶️';

    return {
      succes: true,
      buffer: bufferResultat,
      message: `${emojiVitesse} *VITESSE MODIFIÉE PRESTIGE*\n\n` +
               `📊 Vitesse : ${(valeurVitesse * 100).toFixed(0)}%\n` +
               `${nouvelleDuree ? `⏱️ Nouvelle durée : ${formaterTemps(nouvelleDuree)}` : ''}`
    };
  } catch (err) {
    console.error('[Maserati-Audio] Erreur vitesse :', err.message);
    nettoyerTemp(cheminEntree);
    nettoyerTemp(cheminSortie);
    return { succes: false, message: '❌ Erreur lors du changement de vitesse !' };
  }
};

// ── INVERSER AUDIO (MODE REWIND) ──

const maseratiInverserAudio = async (bufferAudio) => {
  const cheminEntree = genererCheminTemp('input');
  const cheminSortie = genererCheminTemp('mp3');

  try {
    fs.writeFileSync(cheminEntree, bufferAudio);

    const duree = await obtenirDureeAudio(cheminEntree);
    if (duree && duree > CONFIG_AUDIO_MASERATI.DUREE_MAX_SECONDES) {
      nettoyerTemp(cheminEntree);
      return { succes: false, message: `❌ Audio trop long ! Max : ${CONFIG_AUDIO_MASERATI.DUREE_MAX_SECONDES}s` };
    }

    await execAsync(
      `ffmpeg -y -i "\( {cheminEntree}" -af "areverse" -c:a libmp3lame -q:a 2 " \){cheminSortie}"`
    );

    const bufferResultat = fs.readFileSync(cheminSortie);

    nettoyerTemp(cheminEntree);
    nettoyerTemp(cheminSortie);

    return {
      succes: true,
      buffer: bufferResultat,
      message: `🔄 *AUDIO INVERSÉ PRESTIGE*\n\n` +
               `Le son joue maintenant en marche arrière – effet rewind MC20 !`
    };
  } catch (err) {
    console.error('[Maserati-Audio] Erreur inversion :', err.message);
    nettoyerTemp(cheminEntree);
    nettoyerTemp(cheminSortie);
    return { succes: false, message: '❌ Erreur lors de l’inversion audio !' };
  }
};

// ── BASS BOOST (SONORITÉ TRIDENT) ──

const maseratiBassBoost = async (bufferAudio, gain = 10) => {
  const gainFinal = Math.min(20, Math.max(1, parseInt(gain) || 10));

  const cheminEntree = genererCheminTemp('input');
  const cheminSortie = genererCheminTemp('mp3');

  try {
    fs.writeFileSync(cheminEntree, bufferAudio);

    await execAsync(
      `ffmpeg -y -i "\( {cheminEntree}" -af "bass=g= \){gainFinal}:f=110:w=0.6" -c:a libmp3lame -q:a 2 "${cheminSortie}"`
    );

    const bufferResultat = fs.readFileSync(cheminSortie);

    nettoyerTemp(cheminEntree);
    nettoyerTemp(cheminSortie);

    return {
      succes: true,
      buffer: bufferResultat,
      message: `🔊 *BASS BOOST ACTIVÉ*\n\n` +
               `📊 Gain : +${gainFinal} dB – basses trident puissance !`
    };
  } catch (err) {
    console.error('[Maserati-Audio] Erreur bass :', err.message);
    nettoyerTemp(cheminEntree);
    nettoyerTemp(cheminSortie);
    return { succes: false, message: '❌ Erreur lors du bass boost !' };
  }
};

// ── NORMALISER VOLUME (SON CLAIR COMME BLEU NUIT) ──

const maseratiNormaliserVolume = async (bufferAudio) => {
  const cheminEntree = genererCheminTemp('input');
  const cheminSortie = genererCheminTemp('mp3');

  try {
    fs.writeFileSync(cheminEntree, bufferAudio);

    await execAsync(
      `ffmpeg -y -i "\( {cheminEntree}" -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a libmp3lame -q:a 2 " \){cheminSortie}"`
    );

    const bufferResultat = fs.readFileSync(cheminSortie);

    nettoyerTemp(cheminEntree);
    nettoyerTemp(cheminSortie);

    return {
      succes: true,
      buffer: bufferResultat,
      message: `🔊 *VOLUME NORMALISÉ PRESTIGE*\n\n` +
               `Son équilibré – clair comme un capot bleu nuit sous le soleil d’Abidjan !`
    };
  } catch (err) {
    console.error('[Maserati-Audio] Erreur normalisation :', err.message);
    nettoyerTemp(cheminEntree);
    nettoyerTemp(cheminSortie);
    return { succes: false, message: '❌ Erreur lors de la normalisation du volume !' };
  }
};

// Exports prestige
export {
  maseratiCouperAudio,
  maseratiChangerVitesse,
  maseratiInverserAudio,
  maseratiBassBoost,
  maseratiNormaliserVolume,
  obtenirDureeAudio,
  parserTemps,
  formaterTemps,
  CONFIG_AUDIO_MASERATI
};

export default {
  couper: maseratiCouperAudio,
  vitesse: maseratiChangerVitesse,
  inverser: maseratiInverserAudio,
  bass: maseratiBassBoost,
  normaliser: maseratiNormaliserVolume
};
