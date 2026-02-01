/**
 * Système Anti-Toxic Prestige - Édition Maserati
 * Détection intelligente de toxicité + actions automatiques
 * Configurable par groupe - Réservé aux administrateurs
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FICHIER_ANTITOXIC = path.join(__dirname, '../../../database/antitoxic.json');

// Configuration prestige Maserati
const CONFIG_MASERATI = {
  DELAI_COOLDOWN_MS: 30 * 1000,                // Temps entre deux avertissements (30s)
  SEUIL_TOXICITE: 70,                          // Score minimum pour action (0-100)
  MAX_AVERTISSEMENTS: 3,                       // Avertissements avant escalade
  RESET_AVERTISSEMENTS_MS: 24 * 60 * 60 * 1000, // Reset après 24h
  ACTIONS_DISPONIBLES: ['avertir', 'supprimer', 'mute'],
  ACTION_PAR_DEFAUT: 'avertir'
};

// Mots-clés rapides (fallback si IA indisponible)
const MOTS_TOXIQUES_RAPIDES = [
  // Offenses générales
  'idiot', 'con', 'imbécile', 'débile', 'abruti', 'connard',
  'stupide', 'crétin', 'ordure', 'merde',
  // Termes graves
  'f*der', 'p*te', 'v*de', 'c*ralho', 'enc*lé',
  // Menaces
  'je vais te tuer', 'je vais te choper', 'tu vas crever'
];

// Helper nom utilisateur prestige
const obtenirNomPrestige = (userId) => {
  if (!userId || typeof userId !== 'string') return 'inconnu';
  return userId.split('@')[0] || userId;
};

// --- PERSISTANCE LUXE ---

const chargerConfigAntiToxic = () => {
  try {
    if (fs.existsSync(FICHIER_ANTITOXIC)) {
      return JSON.parse(fs.readFileSync(FICHIER_ANTITOXIC, 'utf8'));
    }
  } catch (err) {
    console.error('[Maserati-AntiToxic] Erreur chargement config :', err.message);
  }
  return { groupes: {}, avertissements: {} };
};

const sauvegarderConfigAntiToxic = (data) => {
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

// --- COMMANDS ADMIN (PRESTIGE) ---

/**
 * Active le bouclier Anti-Toxic dans le groupe
 */
const maseratiActiverBouclier = (idGroupe, action = CONFIG_MASERATI.ACTION_PAR_DEFAUT) => {
  if (!CONFIG_MASERATI.ACTIONS_DISPONIBLES.includes(action)) {
    action = CONFIG_MASERATI.ACTION_PAR_DEFAUT;
  }

  const data = chargerConfigAntiToxic();
  data.groupes[idGroupe] = {
    actif: true,
    action,
    seuil: CONFIG_MASERATI.SEUIL_TOXICITE,
    activeLe: new Date().toISOString(),
    stats: { detectes: 0, avertis: 0, supprimes: 0, mutes: 0 }
  };

  sauvegarderConfigAntiToxic(data);

  return {
    succes: true,
    message: `🛡️ *BOUCLIER ANTI-TOXIC MASERATI ACTIVÉ* 🏎️👑✨\n\n` +
             `⚠️ *AVIS PRESTIGE* :\n` +
             `Ce système utilise l’IA pour détecter les messages toxiques et *peut parfois se tromper*.\n` +
             `Certaines phrases innocentes peuvent être marquées, d’autres toxiques peuvent passer inaperçues.\n\n` +
             `📌 *Configuration actuelle* :\n` +
             `• Action automatique : ${action}\n` +
             `• Sensibilité : ${CONFIG_MASERATI.SEUIL_TOXICITE}%\n\n` +
             `💡 Commande pour désactiver : /antitoxic off`
  };
};

/**
 * Désactive le bouclier
 */
const maseratiDesactiverBouclier = (idGroupe) => {
  const data = chargerConfigAntiToxic();
  if (data.groupes[idGroupe]) {
    data.groupes[idGroupe].actif = false;
  }
  sauvegarderConfigAntiToxic(data);

  return {
    succes: true,
    message: `🛡️ *BOUCLIER ANTI-TOXIC MASERATI DÉSACTIVÉ*\n\n` +
             `Le paddock est maintenant ouvert à tous les styles de conduite.`
  };
};

/**
 * Change l’action automatique
 */
const maseratiChangerAction = (idGroupe, action) => {
  if (!CONFIG_MASERATI.ACTIONS_DISPONIBLES.includes(action)) {
    return {
      succes: false,
      message: `❌ Action invalide !\n\nActions prestige disponibles : ${CONFIG_MASERATI.ACTIONS_DISPONIBLES.join(', ')}`
    };
  }

  const data = chargerConfigAntiToxic();
  if (!data.groupes[idGroupe] || !data.groupes[idGroupe].actif) {
    return { succes: false, message: '❌ Le bouclier Anti-Toxic n’est pas activé dans ce groupe !' };
  }

  data.groupes[idGroupe].action = action;
  sauvegarderConfigAntiToxic(data);

  return {
    succes: true,
    message: `🛡️ *BOUCLIER MASERATI*\n\nAction automatique changée pour : *${action}*`
  };
};

/**
 * Ajuste la sensibilité du radar
 */
const maseratiAjusterSensibilite = (idGroupe, seuil) => {
  const valeur = parseInt(seuil);
  if (isNaN(valeur) || valeur < 1 || valeur > 100) {
    return { succes: false, message: '❌ Sensibilité doit être entre 1 et 100 !' };
  }

  const data = chargerConfigAntiToxic();
  if (!data.groupes[idGroupe] || !data.groupes[idGroupe].actif) {
    return { succes: false, message: '❌ Le bouclier n’est pas activé dans ce groupe !' };
  }

  data.groupes[idGroupe].seuil = valeur;
  sauvegarderConfigAntiToxic(data);

  return {
    succes: true,
    message: `🛡️ *RADAR MASERATI*\n\nSensibilité ajustée à : *${valeur}%*\n\n` +
             `💡 Plus le seuil est élevé, moins de messages seront interceptés.`
  };
};

/**
 * Statut du bouclier dans le groupe
 */
const maseratiStatutBouclier = (idGroupe) => {
  const data = chargerConfigAntiToxic();
  const groupe = data.groupes[idGroupe];

  if (!groupe || !groupe.actif) {
    return {
      succes: true,
      actif: false,
      message: `🛡️ *BOUCLIER MASERATI*\n\n❌ Désactivé dans ce groupe.\n\n💡 Active-le avec /antitoxic on`
    };
  }

  return {
    succes: true,
    actif: true,
    message: `🛡️ *BOUCLIER PRESTIGE MASERATI* 🏎️👑✨\n\n` +
             `✅ État : Activé\n` +
             `⚡ Action automatique : ${groupe.action}\n` +
             `📊 Sensibilité radar : ${groupe.seuil}%\n\n` +
             `📈 Statistiques circuit :\n` +
             `• Messages interceptés : ${groupe.stats.detectes}\n` +
             `• Avertissements envoyés : ${groupe.stats.avertis}\n` +
             `• Messages supprimés : ${groupe.stats.supprimes}\n` +
             `• Mutes appliqués : ${groupe.stats.mutes}`
  };
};

// --- DÉTECTION HAUTE PERFORMANCE ---

// Détection rapide par mots-clés (fallback)
const radarRapide = (message) => {
  const minuscule = message.toLowerCase();
  for (const mot of MOTS_TOXIQUES_RAPIDES) {
    if (minuscule.includes(mot)) {
      return { toxique: true, score: 80, motif: `Mot détecté : ${mot}` };
    }
  }
  return { toxique: false, score: 0 };
};

// Analyse complète avec IA (si disponible)
const maseratiAnalyserMessage = async (message, fonctionIA = null) => {
  if (!fonctionIA) {
    return radarRapide(message);
  }

  try {
    const prompt = `Analyse ce message et détermine s’il est toxique, offensant ou haineux.
Réponds UNIQUEMENT avec un JSON :

{"score": <0-100>, "raison": "<courte explication>"}

Règles de score :
- 0-30  : Acceptable / neutre
- 31-60 : Légèrement inapproprié
- 61-80 : Offensant / agressif
- 81-100: Très toxique / haineux

Message : "${message.slice(0, 500)}"

Réponds uniquement le JSON.`;

    const reponse = await fonctionIA(prompt);
    const match = reponse.match(/\{[\s\S]*\}/);

    if (match) {
      const resultat = JSON.parse(match[0]);
      return {
        toxique: resultat.score >= CONFIG_MASERATI.SEUIL_TOXICITE,
        score: resultat.score,
        raison: resultat.raison,
        parIA: true
      };
    }
  } catch (err) {
    console.error('[Maserati-AntiToxic] Erreur analyse IA :', err.message);
  }

  return radarRapide(message);
};

// Traitement complet d’un message (décide l’action prestige)
const maseratiTraiterMessage = async (idGroupe, idUtilisateur, texte, fonctionIA = null) => {
  const data = chargerConfigAntiToxic();
  const groupe = data.groupes[idGroupe];

  if (!groupe || !groupe.actif) {
    return { action: 'aucune' };
  }

  // Cooldown utilisateur
  const cle = `\( {idGroupe}: \){idUtilisateur}`;
  if (data.avertissements[cle]) {
    const dernier = data.avertissements[cle].dernier;
    if (Date.now() - dernier < CONFIG_MASERATI.DELAI_COOLDOWN_MS) {
      return { action: 'aucune', raison: 'cooldown prestige' };
    }
  }

  // Analyse
  const analyse = await maseratiAnalyserMessage(texte, fonctionIA);

  if (!analyse.toxique) {
    return { action: 'aucune' };
  }

  // Stats
  groupe.stats.detectes++;

  // Gestion avertissements
  if (!data.avertissements[cle]) {
    data.avertissements[cle] = { count: 0, dernier: 0 };
  }

  const avert = data.avertissements[cle];

  if (Date.now() - avert.dernier > CONFIG_MASERATI.RESET_AVERTISSEMENTS_MS) {
    avert.count = 0;
  }

  avert.count++;
  avert.dernier = Date.now();

  // Escalade action
  let action = groupe.action;
  if (avert.count >= CONFIG_MASERATI.MAX_AVERTISSEMENTS && action === 'avertir') {
    action = 'supprimer';
  }

  // Stats action
  if (action === 'avertir') groupe.stats.avertis++;
  else if (action === 'supprimer') groupe.stats.supprimes++;
  else if (action === 'mute') groupe.stats.mutes++;

  sauvegarderConfigAntiToxic(data);

  return {
    action,
    score: analyse.score,
    raison: analyse.raison || 'Comportement potentiellement toxique détecté',
    avertissements: avert.count,
    max: CONFIG_MASERATI.MAX_AVERTISSEMENTS,
    parIA: analyse.parIA || false
  };
};

// Message d'avertissement prestige
const genererAvertissementMaserati = (userId, resultat) => {
  const disclaimer = resultat.parIA
    ? '\n\n_⚠️ Analyse IA – possible erreur de jugement._'
    : '';

  if (resultat.action === 'avertir') {
    return {
      texte: `🛡️ *ANTI-TOXIC MASERATI* 🏎️👑✨\n\n` +
             `⚠️ @${obtenirNomPrestige(userId)}, ton message a été signalé comme toxique.\n\n` +
             `📊 Score : ${resultat.score}/100\n` +
             `📌 Motif : ${resultat.raison}\n` +
             `⚡ Avertissements : \( {resultat.avertissements}/ \){resultat.max}` +
             disclaimer,
      mentions: [userId]
    };
  }

  if (resultat.action === 'supprimer') {
    return {
      texte: `🛡️ *ANTI-TOXIC MASERATI* 🏎️👑✨\n\n` +
             `🗑️ Message de @${obtenirNomPrestige(userId)} supprimé du paddock.\n\n` +
             `📌 Motif : ${resultat.raison}` +
             disclaimer,
      mentions: [userId]
    };
  }

  if (resultat.action === 'mute') {
    return {
      texte: `🛡️ *ANTI-TOXIC MASERATI* 🏎️👑✨\n\n` +
             `🔇 @${obtenirNomPrestige(userId)} mis en silence temporaire.\n\n` +
             `📌 Motif : ${resultat.raison}` +
             disclaimer,
      mentions: [userId]
    };
  }

  return null;
};

// Statut actif
const maseratiBouclierActif = (idGroupe) => {
  const data = chargerConfigAntiToxic();
  return data.groupes[idGroupe]?.actif || false;
};

const maseratiActionActive = (idGroupe) => {
  const data = chargerConfigAntiToxic();
  return data.groupes[idGroupe]?.action || CONFIG_MASERATI.ACTION_PAR_DEFAUT;
};

// --- EXPORTS PRESTIGE ---

export {
  maseratiActiverBouclier,
  maseratiDesactiverBouclier,
  maseratiChangerAction,
  maseratiAjusterSensibilite,
  maseratiStatutBouclier,
  maseratiActionActive,
  maseratiAnalyserMessage,
  maseratiTraiterMessage,
  genererAvertissementMaserati,
  maseratiBouclierActif,
  CONFIG_MASERATI
};

export default {
  maseratiActiverBouclier,
  maseratiDesactiverBouclier,
  maseratiChangerAction,
  maseratiAjusterSensibilite,
  maseratiStatutBouclier,
  maseratiActionActive,
  maseratiAnalyserMessage,
  maseratiTraiterMessage,
  genererAvertissementMaserati,
  maseratiBouclierActif
};
