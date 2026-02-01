/**
 * Système Anti-Toxic Prestige - Édition Maserati
 * Détection IA + blacklist + actions auto (avertir / supprimer / mute)
 * Configurable par groupe - Réservé aux admins
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FICHIER_ANTITOXIC = path.join(__dirname, '../../../database/antitoxic.json');

// Configuration prestige
const CONFIG = {
  DELAI_COOLDOWN_MS: 30 * 1000,          // Temps entre deux avertissements pour le même utilisateur
  SEUIL_TOXICITE: 70,                    // Score minimum (0-100) pour considérer toxique
  MAX_AVERTISSEMENTS: 3,                 // Nombre d'avertissements avant action auto
  RESET_AVERTISSEMENTS_MS: 24 * 60 * 60 * 1000, // Reset après 24h
  ACTIONS_DISPONIBLES: ['avertir', 'supprimer', 'mute'],
  ACTION_PAR_DEFAUT: 'avertir'
};

// Mots-clés rapides (fallback si IA indisponible)
const MOTS_TOXIQUES_RAPIDES = [
  // Offenses générales
  'idiot', 'con', 'imbécile', 'débile', 'abruti', 'connard',
  'stupide', 'crétin', 'débile', 'ordure', 'merde',
  // Termes graves (censurés partiellement)
  'f*der', 'p*te', 'v*de', 'c*ralho', 'enc*lé',
  // Menaces
  'je vais te tuer', 'je vais te choper', 'tu vas crever'
];

// Helper nom utilisateur
const obtenirNomUtilisateur = (userId) => {
  if (!userId || typeof userId !== 'string') return 'inconnu';
  return userId.split('@')[0] || userId;
};

// --- PERSISTANCE ---

const chargerAntiToxic = () => {
  try {
    if (fs.existsSync(FICHIER_ANTITOXIC)) {
      return JSON.parse(fs.readFileSync(FICHIER_ANTITOXIC, 'utf8'));
    }
  } catch (err) {
    console.error('[Maserati-AntiToxic] Erreur chargement :', err.message);
  }
  return { groupes: {}, avertissementsUtilisateurs: {} };
};

const sauvegarderAntiToxic = (data) => {
  try {
    const dossier = path.dirname(FICHIER_ANTITOXIC);
    if (!fs.existsSync(dossier)) {
      fs.mkdirSync(dossier, { recursive: true });
    }
    fs.writeFileSync(FICHIER_ANTITOXIC, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('[Maserati-AntiToxic] Erreur sauvegarde :', err.message);
  }
};

// --- CONFIGURATION GROUPE ---

/**
 * Active le système anti-toxic dans le groupe
 */
const maseratiActiverAntiToxic = (idGroupe, action = CONFIG.ACTION_PAR_DEFAUT) => {
  if (!CONFIG.ACTIONS_DISPONIBLES.includes(action)) {
    action = CONFIG.ACTION_PAR_DEFAUT;
  }

  const data = chargerAntiToxic();
  data.groupes[idGroupe] = {
    actif: true,
    action,
    seuil: CONFIG.SEUIL_TOXICITE,
    activeLe: new Date().toISOString(),
    stats: { detectes: 0, avertis: 0, supprimes: 0, mutes: 0 }
  };

  sauvegarderAntiToxic(data);

  return {
    succes: true,
    message: `🛡️ *ANTI-TOXIC MASERATI ACTIVÉ*\n\n` +
             `⚠️ *ATTENTION PRESTIGE :*\n` +
             `Ce système utilise l’IA pour détecter les messages toxiques et *peut se tromper*. ` +
             `Certaines phrases innocentes peuvent être marquées, d’autres toxiques peuvent passer.\n\n` +
             `📌 *Configuration actuelle :*\n` +
             `• Action : ${action}\n` +
             `• Sensibilité : ${CONFIG.SEUIL_TOXICITE}%\n\n` +
             `💡 Utilise /antitoxic off pour désactiver.`
  };
};

/**
 * Désactive le système
 */
const maseratiDesactiverAntiToxic = (idGroupe) => {
  const data = chargerAntiToxic();
  if (data.groupes[idGroupe]) {
    data.groupes[idGroupe].actif = false;
  }
  sauvegarderAntiToxic(data);

  return {
    succes: true,
    message: `🛡️ *ANTI-TOXIC MASERATI DÉSACTIVÉ*\n\n` +
             `Le bouclier prestige est désactivé pour ce groupe.`
  };
};

/**
 * Change l'action à prendre
 */
const maseratiDefinirActionAntiToxic = (idGroupe, action) => {
  if (!CONFIG.ACTIONS_DISPONIBLES.includes(action)) {
    return {
      succes: false,
      message: `❌ Action invalide !\n\nActions disponibles : ${CONFIG.ACTIONS_DISPONIBLES.join(', ')}`
    };
  }

  const data = chargerAntiToxic();
  if (!data.groupes[idGroupe] || !data.groupes[idGroupe].actif) {
    return { succes: false, message: '❌ Anti-toxic n’est pas activé dans ce groupe !' };
  }

  data.groupes[idGroupe].action = action;
  sauvegarderAntiToxic(data);

  return {
    succes: true,
    message: `🛡️ *ANTI-TOXIC MASERATI*\n\nAction changée pour : *${action}*`
  };
};

/**
 * Ajuste la sensibilité (seuil)
 */
const maseratiDefinirSeuilAntiToxic = (idGroupe, seuil) => {
  const valeur = parseInt(seuil);
  if (isNaN(valeur) || valeur < 1 || valeur > 100) {
    return { succes: false, message: '❌ Sensibilité doit être entre 1 et 100 !' };
  }

  const data = chargerAntiToxic();
  if (!data.groupes[idGroupe] || !data.groupes[idGroupe].actif) {
    return { succes: false, message: '❌ Anti-toxic n’est pas activé dans ce groupe !' };
  }

  data.groupes[idGroupe].seuil = valeur;
  sauvegarderAntiToxic(data);

  return {
    succes: true,
    message: `🛡️ *ANTI-TOXIC MASERATI*\n\nSensibilité ajustée à : *${valeur}%*\n\n` +
             `💡 Plus le chiffre est élevé, moins de messages seront marqués.`
  };
};

/**
 * Statut actuel du système dans le groupe
 */
const maseratiStatutAntiToxic = (idGroupe) => {
  const data = chargerAntiToxic();
  const groupe = data.groupes[idGroupe];

  if (!groupe || !groupe.actif) {
    return {
      succes: true,
      actif: false,
      message: `🛡️ *ANTI-TOXIC MASERATI*\n\n❌ Désactivé dans ce groupe.\n\n💡 Utilise /antitoxic on pour l’activer.`
    };
  }

  return {
    succes: true,
    actif: true,
    message: `🛡️ *ANTI-TOXIC MASERATI*\n\n` +
             `✅ État : Activé\n` +
             `⚡ Action : ${groupe.action}\n` +
             `📊 Sensibilité : ${groupe.seuil}%\n\n` +
             `📈 *Statistiques prestige :*\n` +
             `• Détections : ${groupe.stats.detectes}\n` +
             `• Avertissements : ${groupe.stats.avertis}\n` +
             `• Suppressions : ${groupe.stats.supprimes}\n` +
             `• Mutes : ${groupe.stats.mutes}`
  };
};

// --- DÉTECTION TOXICITÉ ---

// Détection rapide par mots-clés (fallback)
const verificationRapide = (message) => {
  const minuscule = message.toLowerCase();
  for (const mot of MOTS_TOXIQUES_RAPIDES) {
    if (minuscule.includes(mot)) {
      return { toxique: true, score: 80, motDetecte: mot };
    }
  }
  return { toxique: false, score: 0 };
};

// Analyse complète (à appeler avec IA si disponible)
const analyserMessage = async (message, fonctionIA = null) => {
  // Sans IA → fallback mots-clés
  if (!fonctionIA) {
    return verificationRapide(message);
  }

  try {
    const prompt = `Analyse ce message et détermine s’il est toxique, offensant ou haineux.
Réponds UNIQUEMENT avec un JSON au format : {"score": <0-100>, "raison": "<courte explication>"}

Règles de score :
- 0-30  : Message normal / acceptable
- 31-60 : Légèrement inapproprié
- 61-80 : Offensant
- 81-100: Très toxique / discours de haine

Message à analyser : "${message.slice(0, 500)}"

Réponds uniquement le JSON, sans texte supplémentaire.`;

    const reponse = await fonctionIA(prompt);

    // Extraction JSON
    const matchJson = reponse.match(/\{[\s\S]*\}/);
    if (matchJson) {
      const resultat = JSON.parse(matchJson[0]);
      return {
        toxique: resultat.score >= CONFIG.SEUIL_TOXICITE,
        score: resultat.score,
        raison: resultat.raison,
        parIA: true
      };
    }
  } catch (err) {
    console.error('[Maserati-AntiToxic] Erreur IA :', err.message);
  }

  // Fallback si IA échoue
  return verificationRapide(message);
};

// Traitement d’un message (décide l’action)
const maseratiTraiterMessage = async (idGroupe, idUtilisateur, texteMessage, fonctionIA = null) => {
  const data = chargerAntiToxic();
  const groupe = data.groupes[idGroupe];

  if (!groupe || !groupe.actif) {
    return { action: 'aucune' };
  }

  // Cooldown par utilisateur
  const cleUtilisateur = `\( {idGroupe}: \){idUtilisateur}`;
  if (data.avertissementsUtilisateurs[cleUtilisateur]) {
    const dernierAvertissement = data.avertissementsUtilisateurs[cleUtilisateur].dernierAvertissement;
    if (Date.now() - dernierAvertissement < CONFIG.DELAI_COOLDOWN_MS) {
      return { action: 'aucune', raison: 'cooldown' };
    }
  }

  // Analyse
  const analyse = await analyserMessage(texteMessage, fonctionIA);

  if (!analyse.toxique) {
    return { action: 'aucune' };
  }

  // Mise à jour stats
  groupe.stats.detectes++;

  // Gestion avertissements utilisateur
  if (!data.avertissementsUtilisateurs[cleUtilisateur]) {
    data.avertissementsUtilisateurs[cleUtilisateur] = { count: 0, dernierAvertissement: 0 };
  }

  const avertUser = data.avertissementsUtilisateurs[cleUtilisateur];

  // Reset si délai dépassé
  if (Date.now() - avertUser.dernierAvertissement > CONFIG.RESET_AVERTISSEMENTS_MS) {
    avertUser.count = 0;
  }

  avertUser.count++;
  avertUser.dernierAvertissement = Date.now();

  // Décision action
  let action = groupe.action;
  if (avertUser.count >= CONFIG.MAX_AVERTISSEMENTS && action === 'avertir') {
    action = 'supprimer'; // Escalade automatique
  }

  // Stats
  if (action === 'avertir') groupe.stats.avertis++;
  else if (action === 'supprimer') groupe.stats.supprimes++;
  else if (action === 'mute') groupe.stats.mutes++;

  sauvegarderAntiToxic(data);

  return {
    action,
    score: analyse.score,
    raison: analyse.raison || 'Contenu potentiellement toxique',
    avertissements: avertUser.count,
    maxAvertissements: CONFIG.MAX_AVERTISSEMENTS,
    parIA: analyse.parIA || false
  };
};

// Génère le message d'avertissement prestige
const genererMessageAvertissement = (userId, resultat) => {
  const disclaimerIA = resultat.parIA
    ? '\n\n_⚠️ Analyse réalisée par IA – possible erreur de jugement._'
    : '';

  if (resultat.action === 'avertir') {
    return {
      message: `🛡️ *ANTI-TOXIC MASERATI*\n\n` +
               `⚠️ @${obtenirNomUtilisateur(userId)}, ton message a été détecté comme potentiellement toxique.\n\n` +
               `📊 Score : ${resultat.score}/100\n` +
               `📌 Motif : ${resultat.raison}\n` +
               `⚡ Avertissements : \( {resultat.avertissements}/ \){resultat.maxAvertissements}` +
               disclaimerIA,
      mentions: [userId]
    };
  }

  if (resultat.action === 'supprimer') {
    return {
      message: `🛡️ *ANTI-TOXIC MASERATI*\n\n` +
               `🗑️ Message de @${obtenirNomUtilisateur(userId)} supprimé.\n\n` +
               `📌 Motif : ${resultat.raison}` +
               disclaimerIA,
      mentions: [userId]
    };
  }

  if (resultat.action === 'mute') {
    return {
      message: `🛡️ *ANTI-TOXIC MASERATI*\n\n` +
               `🔇 @${obtenirNomUtilisateur(userId)} a été muté temporairement.\n\n` +
               `📌 Motif : ${resultat.raison}` +
               disclaimerIA,
      mentions: [userId]
    };
  }

  return null;
};

// Vérifie si actif dans le groupe
const maseratiEstActifAntiToxic = (idGroupe) => {
  const data = chargerAntiToxic();
  return data.groupes[idGroupe]?.actif || false;
};

const maseratiObtenirActionGroupe = (idGroupe) => {
  const data = chargerAntiToxic();
  return data.groupes[idGroupe]?.action || CONFIG.ACTION_PAR_DEFAUT;
};

// --- EXPORTS MASERATI ---

export {
  maseratiActiverAntiToxic,
  maseratiDesactiverAntiToxic,
  maseratiDefinirActionAntiToxic,
  maseratiDefinirSeuilAntiToxic,
  maseratiStatutAntiToxic,
  maseratiObtenirActionGroupe,
  analyserMessage,
  maseratiTraiterMessage,
  genererMessageAvertissement,
  maseratiEstActifAntiToxic,
  CONFIG as CONFIG_ANTI_TOXIC
};

export default {
  maseratiActiverAntiToxic,
  maseratiDesactiverAntiToxic,
  maseratiDefinirActionAntiToxic,
  maseratiDefinirSeuilAntiToxic,
  maseratiStatutAntiToxic,
  maseratiObtenirActionGroupe,
  analyserMessage,
  maseratiTraiterMessage,
  genererMessageAvertissement,
  maseratiEstActifAntiToxic
};
