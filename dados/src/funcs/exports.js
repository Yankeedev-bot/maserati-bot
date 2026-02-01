/**
 * Garage Central des Modules Prestige - Édition Maserati
 * Agrégateur unique de tous les modules du bot
 * Chargement dynamique, sécurisé et stylé
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);

// ── CONFIGURATION PRESTIGE ──
const CONFIG_GARAGE_MASERATI = {
  DOSSIER_JSON: path.join(__dirname, '../json'),
  FICHIERS_JSON: ['tools.json', 'vab.json'],
  PREFIXE_LOGS: '[Maserati-Exports]'
};

/**
 * Charge un fichier JSON de façon synchrone (compatibilité ESM)
 * @param {string} cheminRelatif - Chemin relatif depuis __dirname
 */
function chargerJsonSync(cheminRelatif) {
  try {
    const cheminComplet = path.resolve(__dirname, cheminRelatif);
    const contenu = fsSync.readFileSync(cheminComplet, 'utf-8');
    return JSON.parse(contenu);
  } catch (err) {
    console.error(`${CONFIG_GARAGE_MASERATI.PREFIXE_LOGS} Échec chargement JSON : ${cheminRelatif} → ${err.message}`);
    return undefined;
  }
}

/**
 * Charge tous les modules du garage Maserati de façon asynchrone
 * Retourne un objet proxy sécurisé avec fallback sur erreurs
 */
let promesseModules;

async function maseratiChargerModules() {
  if (promesseModules) return promesseModules;

  promesseModules = (async () => {
    console.log(`${CONFIG_GARAGE_MASERATI.PREFIXE_LOGS} Démarrage chargement garage prestige...`);

    const modules = {};

    // ── MODULES DE TÉLÉCHARGEMENT (downloads) ──
    const [
      youtubeMod, tiktokMod, pinterestMod, igdlMod, lyricsMod,
      mcpluginsMod, spotifyMod, soundcloudMod, facebookMod
    ] = await Promise.all([
      import('./downloads/youtube.js'),
      import('./downloads/tiktok.js'),
      import('./downloads/pinterest.js'),
      import('./downloads/igdl.js'),
      import('./downloads/lyrics.js'),
      import('./downloads/mcplugins.js'),
      import('./downloads/spotify.js'),
      import('./downloads/soundcloud.js'),
      import('./downloads/facebook.js')
    ]);

    modules.youtube = youtubeMod.default ?? youtubeMod;
    modules.tiktok = tiktokMod.default ?? tiktokMod;
    modules.pinterest = pinterestMod.default ?? pinterestMod;
    modules.igdl = igdlMod.default ?? igdlMod;
    modules.lyrics = lyricsMod.default ?? lyricsMod;
    modules.mcPlugin = mcpluginsMod.default ?? mcpluginsMod;
    modules.spotify = spotifyMod.default ?? spotifyMod;
    modules.soundcloud = soundcloudMod.default ?? soundcloudMod;
    modules.facebook = facebookMod.default ?? facebookMod;

    // Vérification critique YouTube (module le plus utilisé)
    if (modules.youtube) {
      const methodesYoutube = ['search', 'mp3', 'mp4'];
      methodesYoutube.forEach(methode => {
        if (typeof modules.youtube[methode] !== 'function') {
          console.warn(`\( {CONFIG_GARAGE_MASERATI.PREFIXE_LOGS} YouTube. \){methode} indisponible → fallback ajouté`);
          modules.youtube[methode] = () => { throw new Error(`YouTube ${methode} non disponible`); };
        }
      });
    } else {
      console.warn(`${CONFIG_GARAGE_MASERATI.PREFIXE_LOGS} Module YouTube non chargé`);
    }

    // ── MODULES UTILITAIRES (utils) ──
    const [
      styleTextMod, verifyUpdateMod, emojiMixMod, uploadMod,
      tictactoeMod, stickerMod, commandStatsMod, relationshipsMod,
      connect4Mod, unoMod, memoriaMod, achievementsMod,
      giftsMod, reputationMod, qrcodeMod, notesMod,
      calculatorMod, audioEditMod, transmissaoMod,
      gdriveMod, mediafireMod, twitterMod, searchMod,
      imagetoolsMod, freefireMod
    ] = await Promise.all([
      import('./utils/gerarnick.js'),
      import('./utils/update-verify.js'),
      import('./utils/emojimix.js'),
      import('./utils/upload.js'),
      import('./utils/tictactoe.js'),
      import('./utils/sticker.js'),
      import('./utils/commandStats.js'),
      import('./utils/relationships.js'),
      import('./utils/connect4.js'),
      import('./utils/uno.js'),
      import('./utils/memoria.js'),
      import('./utils/achievements.js'),
      import('./utils/gifts.js'),
      import('./utils/reputation.js'),
      import('./utils/qrcode.js'),
      import('./utils/notes.js'),
      import('./utils/calculator.js'),
      import('./utils/audioEdit.js'),
      import('./utils/transmissao.js'),
      import('./utils/gdrive.js'),
      import('./utils/mediafire.js'),
      import('./utils/twitter.js'),
      import('./utils/search.js'),
      import('./utils/imagetools.js'),
      import('./utils/freefire.js')
    ]);

    modules.styleText = styleTextMod.default ?? styleTextMod;
    modules.VerifyUpdate = verifyUpdateMod.default ?? verifyUpdateMod;
    modules.emojiMix = emojiMixMod.default ?? emojiMixMod;
    modules.upload = uploadMod.default ?? uploadMod;
    modules.tictactoe = tictactoeMod.default ?? tictactoeMod;
    modules.stickerModule = stickerMod.default ?? stickerMod;
    modules.commandStats = commandStatsMod.default ?? commandStatsMod;
    modules.relationshipManager = relationshipsMod.default ?? relationshipsMod;
    modules.connect4 = connect4Mod.default ?? connect4Mod;
    modules.uno = unoMod.default ?? unoMod;
    modules.memoria = memoriaMod.default ?? memoriaMod;
    modules.achievements = achievementsMod.default ?? achievementsMod;
    modules.gifts = giftsMod.default ?? giftsMod;
    modules.reputation = reputationMod.default ?? reputationMod;
    modules.qrcode = qrcodeMod.default ?? qrcodeMod;
    modules.notes = notesMod.default ?? notesMod;
    modules.calculator = calculatorMod.default ?? calculatorMod;
    modules.audioEdit = audioEditMod.default ?? audioEditMod;
    modules.transmissao = transmissaoMod.default ?? transmissaoMod;
    modules.gdrive = gdriveMod.default ?? gdriveMod;
    modules.mediafire = mediafireMod.default ?? mediafireMod;
    modules.twitter = twitterMod.default ?? twitterMod;
    modules.search = searchMod.default ?? searchMod;
    modules.imagetools = imagetoolsMod.default ?? imagetoolsMod;
    modules.freefire = freefireMod.default ?? freefireMod;

    // Exposition directe de sendSticker (compatibilité API précédente)
    if (modules.stickerModule?.sendSticker) {
      modules.sendSticker = modules.stickerModule.sendSticker;
    } else {
      console.warn(`${CONFIG_GARAGE_MASERATI.PREFIXE_LOGS} Fonction sendSticker indisponible`);
      modules.sendSticker = () => { throw new Error('sendSticker non disponible'); };
    }

    // ── MODULES PRIVÉS (private) ──
    const [
      iaMod, temuScammerMod, antitoxicMod,
      iaExpandedMod, antipalavraMod
    ] = await Promise.all([
      import('./private/ia.js'),
      import('./private/temuScammer.js'),
      import('./private/antitoxic.js'),
      import('./private/iaExpanded.js'),
      import('./private/antipalavra.js')
    ]);

    modules.ia = iaMod.default ?? iaMod;
    modules.temuScammer = temuScammerMod.default ?? temuScammerMod;
    modules.antitoxic = antitoxicMod.default ?? antitoxicMod;
    modules.iaExpanded = iaExpandedMod.default ?? iaExpandedMod;
    modules.antipalavra = antipalavraMod.default ?? antipalavraMod;

    // Vérification IA critique
    if (modules.ia?.makeAssistentRequest) {
      // OK
    } else {
      console.warn(`${CONFIG_GARAGE_MASERATI.PREFIXE_LOGS} IA.makeAssistentRequest indisponible`);
      modules.ia = {
        ...modules.ia,
        makeAssistentRequest: () => { throw new Error('IA non disponible'); }
      };
    }

    // ── FICHIERS JSON (chargés sync) ──
    const toolsJson = chargerJsonSync('json/tools.json');
    const vabJson = chargerJsonSync('json/vab.json');

    modules.toolsJson = () => toolsJson;
    modules.vabJson = () => vabJson;

    console.log(`${CONFIG_GARAGE_MASERATI.PREFIXE_LOGS} Garage prestige chargé – ${Object.keys(modules).length} modules prêts`);

    return modules;
  })();

  return promesseModules;
}

/**
 * Proxy de sécurité – Garage Maserati sécurisé
 * Retourne undefined + warning si module/propriété manquant
 */
const ProxyGarageMaserati = (modules) => new Proxy(modules, {
  get(cible, prop) {
    if (!(prop in cible)) {
      console.warn(`\( {CONFIG_GARAGE_MASERATI.PREFIXE_LOGS} Module ' \){prop}' introuvable dans le garage`);
      return undefined;
    }

    const valeur = cible[prop];

    if (typeof valeur === 'object' && valeur !== null) {
      return new Proxy(valeur, {
        get(obj, key) {
          if (!(key in obj)) {
            console.warn(`\( {CONFIG_GARAGE_MASERATI.PREFIXE_LOGS} Propriété ' \){key}' introuvable dans module '${prop}'`);
            return undefined;
          }
          return obj[key];
        }
      });
    }

    return valeur;
  }
});

/**
 * Accesseur asynchrone nommé – pour ceux qui préfèrent l’explicite
 */
export async function maseratiObtenirModules() {
  const modules = await maseratiChargerModules();
  return ProxyGarageMaserati(modules);
}

/**
 * Export par défaut – résout directement via top-level await
 * Compatible avec : const modules = (await import('./exports.js')).default;
 */
const modules = await maseratiChargerModules();
export default ProxyGarageMaserati(modules);
