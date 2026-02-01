/**
 * Système de Réputation & Tribunal du Trident - Édition Maserati
 * Réputation positive/négative + Dénonciations luxe
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FICHIER_REPUTATION = path.join(__dirname, '../../../database/reputation_maserati.json');
const FICHIER_DENONCIATIONS = path.join(__dirname, '../../../database/denonciations_maserati.json');

// ── CONFIGURATION PRESTIGE ──
const CONFIG_REP_MASERATI = {
  DELAI_REP_MS: 24 * 60 * 60 * 1000,          // 24h entre reps pour la même personne
  MAX_REP_PAR_JOUR: 5,                        // Limite quotidienne – pas d’abus sur le circuit
  MOTIFS_DENONCIATION: [
    'spam', 'insulte', 'harcèlement', 'contenu_inapproprié',
    'arnaque', 'flood', 'publicité', 'autre'
  ]
};

// Helper nom pilote prestige
const obtenirNomPilote = (userId) => {
  if (!userId || typeof userId !== 'string') return 'pilote anonyme';
  return userId.split('@')[0] || userId;
};

// ── RÉPUTATION ──

// Charger réputation
const chargerReputation = () => {
  try {
    if (fs.existsSync(FICHIER_REPUTATION)) {
      return JSON.parse(fs.readFileSync(FICHIER_REPUTATION, 'utf8'));
    }
  } catch (err) {
    console.error('[Maserati-Rep] Erreur chargement réputation :', err.message);
  }
  return { pilotes: {}, historique: [] };
};

// Sauvegarder réputation
const sauvegarderReputation = (data) => {
  try {
    const dossier = path.dirname(FICHIER_REPUTATION);
    if (!fs.existsSync(dossier)) {
      fs.mkdirSync(dossier, { recursive: true });
    }
    fs.writeFileSync(FICHIER_REPUTATION, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('[Maserati-Rep] Erreur sauvegarde réputation :', err.message);
  }
};

// Profil pilote réputation
const obtenirProfilRep = (data, userId) => {
  if (!data.pilotes[userId]) {
    data.pilotes[userId] = {
      positif: 0,
      negatif: 0,
      donneesAujourdhui: 0,
      derniereDateDon: null,
      donnesA: {} // userId → timestamp dernier rep donné
    };
  }
  return data.pilotes[userId];
};

/**
 * Donner une réputation prestige (+ ou -)
 * @param {string} idDonneur - ID du pilote qui donne
 * @param {string} idReceveur - ID du pilote qui reçoit
 * @param {boolean} estPositif - true = 👍, false = 👎
 */
const maseratiDonnerRep = (idDonneur, idReceveur, estPositif = true) => {
  if (idDonneur === idReceveur) {
    return { succes: false, message: '❌ Tu ne peux pas te donner de réputation à toi-même !' };
  }

  const data = chargerReputation();
  const donneur = obtenirProfilRep(data, idDonneur);
  const receveur = obtenirProfilRep(data, idReceveur);
  const maintenant = Date.now();
  const aujourdhui = new Date().toDateString();

  // Reset compteur quotidien
  if (donneur.derniereDateDon !== aujourdhui) {
    donneur.donneesAujourdhui = 0;
    donneur.derniereDateDon = aujourdhui;
  }

  // Limite quotidienne
  if (donneur.donneesAujourdhui >= CONFIG_REP_MASERATI.MAX_REP_PAR_JOUR) {
    return {
      succes: false,
      message: `❌ Tu as déjà donné ${CONFIG_REP_MASERATI.MAX_REP_PAR_JOUR} réputations aujourd’hui !\n⏳ Reviens demain sur le circuit.`
    };
  }

  // Cooldown par personne
  if (donneur.donnesA[idReceveur]) {
    const tempsEcoule = maintenant - donneur.donnesA[idReceveur];
    if (tempsEcoule < CONFIG_REP_MASERATI.DELAI_REP_MS) {
      const restant = CONFIG_REP_MASERATI.DELAI_REP_MS - tempsEcoule;
      const heures = Math.floor(restant / (60 * 60 * 1000));
      const minutes = Math.floor((restant % (60 * 60 * 1000)) / (60 * 1000));
      return {
        succes: false,
        message: `❌ Tu as déjà donné une rep à ce pilote récemment !\n⏳ Attends encore ${heures}h ${minutes}min`
      };
    }
  }

  // Appliquer réputation
  if (estPositif) {
    receveur.positif++;
  } else {
    receveur.negatif++;
  }

  donneur.donneesAujourdhui++;
  donneur.donnesA[idReceveur] = maintenant;

  // Historique prestige
  data.historique.push({
    de: idDonneur,
    a: idReceveur,
    type: estPositif ? 'positif' : 'negatif',
    date: new Date().toISOString()
  });

  if (data.historique.length > 1000) {
    data.historique = data.historique.slice(-1000);
  }

  sauvegarderReputation(data);

  const total = receveur.positif - receveur.negatif;
  const emoji = estPositif ? '👍' : '👎';
  const type = estPositif ? 'positive' : 'négative';

  return {
    succes: true,
    message: `${emoji} *RÉPUTATION PRESTIGE*\n\n` +
             `@${obtenirNomPilote(idDonneur)} a donné une réputation \( {type} à @ \){obtenirNomPilote(idReceveur)} !\n\n` +
             `📊 Réputation de @${obtenirNomPilote(idReceveur)} : \( {total >= 0 ? '+' : ''} \){total}\n` +
             `   👍 ${receveur.positif} | 👎 ${receveur.negatif}`,
    mentions: [idDonneur, idReceveur]
  };
};

/**
 * Voir la réputation d’un pilote
 */
const maseratiVoirRep = (userId) => {
  const data = chargerReputation();
  const profil = obtenirProfilRep(data, userId);
  const total = profil.positif - profil.negatif;

  let rang = '🆕 Rookie du Circuit';
  if (total >= 100) rang = '👑 Légende du Trident';
  else if (total >= 50) rang = '⭐ Étoile MC20';
  else if (total >= 25) rang = '🌟 Pilote Populaire';
  else if (total >= 10) rang = '💫 Connu du Paddock';
  else if (total >= 5) rang = '✨ Actif sur la Piste';
  else if (total < -10) rang = '💀 Toxique du Circuit';
  else if (total < -5) rang = '⚠️ Suspect du Paddock';

  return {
    succes: true,
    message: `📊 *RÉPUTATION PRESTIGE*\n\n` +
             `👤 @${obtenirNomPilote(userId)}\n` +
             `🏆 Rang : ${rang}\n\n` +
             `📈 Total : \( {total >= 0 ? '+' : ''} \){total}\n` +
             `👍 Positives : ${profil.positif}\n` +
             `👎 Négatives : ${profil.negatif}`,
    mentions: [userId],
    data: { positif: profil.positif, negatif: profil.negatif, total, rang }
  };
};

/**
 * Ranking réputation – Circuit des Légendes
 */
const maseratiRankingRep = (limite = 10) => {
  const data = chargerReputation();

  const classements = Object.entries(data.pilotes)
    .map(([idPilote, profil]) => ({
      idPilote,
      total: profil.positif - profil.negatif,
      positif: profil.positif,
      negatif: profil.negatif
    }))
    .filter(u => u.total !== 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, limite);

  if (classements.length === 0) {
    return { succes: true, message: '📊 *CIRCUIT DES LÉGENDES – RÉPUTATION*\n\nAucun pilote classé pour l’instant !' };
  }

  let message = '📊 *CIRCUIT DES LÉGENDES – RÉPUTATION*\n\n';
  classements.forEach((pilote, i) => {
    const medaille = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
    const signe = pilote.total >= 0 ? '+' : '';
    message += `\( {medaille} @ \){obtenirNomPilote(pilote.idPilote)} – \( {signe} \){pilote.total}\n`;
  });

  return {
    succes: true,
    message,
    mentions: classements.map(p => p.idPilote)
  };
};

// ── TRIBUNAL DU TRIDENT – DENONCIATIONS ──

// Charger dénonciations
const chargerDenonciations = () => {
  try {
    if (fs.existsSync(FICHIER_DENONCIATIONS)) {
      return JSON.parse(fs.readFileSync(FICHIER_DENONCIATIONS, 'utf8'));
    }
  } catch (err) {
    console.error('[Maserati-Rep] Erreur chargement dénonciations :', err.message);
  }
  return { denonciations: [], resolues: [] };
};

// Sauvegarder dénonciations
const sauvegarderDenonciations = (data) => {
  try {
    const dossier = path.dirname(FICHIER_DENONCIATIONS);
    if (!fs.existsSync(dossier)) {
      fs.mkdirSync(dossier, { recursive: true });
    }
    fs.writeFileSync(FICHIER_DENONCIATIONS, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('[Maserati-Rep] Erreur sauvegarde dénonciations :', err.message);
  }
};

/**
 * Créer une dénonciation au Tribunal du Trident
 * @param {string} idDenonceur - ID du pilote qui dénonce
 * @param {string} idCible - ID du pilote dénoncé
 * @param {string} motif - Motif (spam, insulte, etc.)
 * @param {string} [description=''] - Détails optionnels
 * @param {string} [idGroupe=null] - Groupe où ça s’est passé
 */
const maseratiCreerDenonciation = (idDenonceur, idCible, motif, description = '', idGroupe = null) => {
  if (idDenonceur === idCible) {
    return { succes: false, message: '❌ Tu ne peux pas te dénoncer toi-même au Tribunal !' };
  }

  // Validation motif
  const motifValide = CONFIG_REP_MASERATI.MOTIFS_DENONCIATION.find(m =>
    m.toLowerCase() === motif.toLowerCase() ||
    m.replace('_', ' ').toLowerCase() === motif.toLowerCase()
  ) || 'autre';

  const data = chargerDenonciations();

  // Pas de double dénonciation pendante
  const existante = data.denonciations.find(d =>
    d.denonceur === idDenonceur &&
    d.cible === idCible &&
    d.statut === 'en_attente'
  );

  if (existante) {
    return { succes: false, message: '❌ Tu as déjà une dénonciation en attente contre ce pilote !' };
  }

  const denonciation = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    denonceur: idDenonceur,
    cible: idCible,
    motif: motifValide,
    description: description.slice(0, 500),
    idGroupe,
    statut: 'en_attente',
    creeLe: new Date().toISOString(),
    resolueLe: null,
    resoluePar: null,
    resolution: null
  };

  data.denonciations.push(denonciation);
  sauvegarderDenonciations(data);

  return {
    succes: true,
    denonciation,
    message: `🚨 *DÉNONCIATION ENREGISTRÉE AU TRIBUNAL DU TRIDENT*\n\n` +
             `📋 ID : ${denonciation.id}\n` +
             `👤 Dénoncé : @${obtenirNomPilote(idCible)}\n` +
             `📌 Motif : ${motifValide}\n` +
             `${description ? `📝 Détails : \( {description.slice(0, 100)} \){description.length > 100 ? '...' : ''}\n` : ''}` +
             `\n✅ Ta dénonciation a été enregistrée et sera examinée par les autorités du paddock.`,
    mentions: [idCible],
    notifierProprio: true
  };
};

/**
 * Lister les dénonciations pendantes (pour proprio/admins)
 */
const maseratiListerDenonciationsEnAttente = () => {
  const data = chargerDenonciations();
  const enAttente = data.denonciations.filter(d => d.statut === 'en_attente');

  if (enAttente.length === 0) {
    return { succes: true, message: '🚨 *TRIBUNAL DU TRIDENT – DÉNONCIATIONS EN ATTENTE*\n\n✅ Aucune affaire pendante !' };
  }

  let message = `🚨 *TRIBUNAL DU TRIDENT – AFFAIRES EN ATTENTE* (${enAttente.length})\n\n`;
  enAttente.slice(0, 10).forEach(d => {
    message += `📋 *ID :* ${d.id}\n`;
    message += `👤 Cible : @${obtenirNomPilote(d.cible)}\n`;
    message += `📌 Motif : ${d.motif}\n`;
    message += `📅 Date : ${new Date(d.creeLe).toLocaleDateString('fr-FR')}\n\n`;
  });

  if (enAttente.length > 10) {
    message += `_... et ${enAttente.length - 10} autres affaires_`;
  }

  return {
    succes: true,
    message,
    mentions: enAttente.slice(0, 10).map(d => d.cible)
  };
};

/**
 * Résoudre une dénonciation (pour proprio/admins)
 */
const maseratiResoudreDenonciation = (idDenonciation, idResolueur, resolution) => {
  const data = chargerDenonciations();
  const denonciation = data.denonciations.find(d => d.id === idDenonciation);

  if (!denonciation) {
    return { succes: false, message: '❌ Dénonciation introuvable au Tribunal !' };
  }

  if (denonciation.statut !== 'en_attente') {
    return { succes: false, message: '❌ Cette affaire a déjà été jugée !' };
  }

  denonciation.statut = 'resolue';
  denonciation.resolueLe = new Date().toISOString();
  denonciation.resoluePar = idResolueur;
  denonciation.resolution = resolution.slice(0, 200);

  sauvegarderDenonciations(data);

  return {
    succes: true,
    message: `✅ *AFFAIRE RÉSOLUE AU TRIBUNAL DU TRIDENT*\n\n` +
             `📋 ID : ${denonciation.id}\n` +
             `👤 Cible : @${obtenirNomPilote(denonciation.cible)}\n` +
             `📝 Verdict : ${resolution}`,
    denonciation,
    mentions: [denonciation.cible, denonciation.denonceur]
  };
};

/**
 * Voir les dénonciations concernant un pilote
 */
const maseratiVoirDenonciationsPilote = (userId) => {
  const data = chargerDenonciations();
  const enCible = data.denonciations.filter(d => d.cible === userId);
  const enAttente = enCible.filter(d => d.statut === 'en_attente').length;
  const resolues = enCible.filter(d => d.statut === 'resolue').length;

  return {
    succes: true,
    message: `🚨 *TRIBUNAL DU TRIDENT – @${obtenirNomPilote(userId)}*\n\n` +
             `📊 Total affaires : ${enCible.length}\n` +
             `⏳ En attente : ${enAttente}\n` +
             `✅ Résolues : ${resolues}`,
    mentions: [userId],
    data: { total: enCible.length, enAttente, resolues }
  };
};

/**
 * Lister les motifs valides pour dénonciation
 */
const maseratiListerMotifs = (prefixe = '/') => {
  return {
    succes: true,
    message: `🚨 *MOTIFS ACCEPTÉS AU TRIBUNAL DU TRIDENT*\n\n` +
             CONFIG_REP_MASERATI.MOTIFS_DENONCIATION.map(m => `• ${m.replace('_', ' ')}`).join('\n') +
             `\n\n💡 Utilisation : ${prefixe}denoncer @pilote <motif> [détails]`
  };
};

// Exports prestige
export {
  maseratiDonnerRep,
  maseratiVoirRep,
  maseratiRankingRep,
  maseratiCreerDenonciation,
  maseratiListerDenonciationsEnAttente,
  maseratiResoudreDenonciation,
  maseratiVoirDenonciationsPilote,
  maseratiListerMotifs,
  CONFIG_REP_MASERATI
};

export default {
  donnerRep: maseratiDonnerRep,
  voirRep: maseratiVoirRep,
  rankingRep: maseratiRankingRep,
  creerDenonciation: maseratiCreerDenonciation,
  listerDenonciations: maseratiListerDenonciationsEnAttente,
  resoudreDenonciation: maseratiResoudreDenonciation,
  voirDenonciationsPilote: maseratiVoirDenonciationsPilote,
  listerMotifs: maseratiListerMotifs
};
