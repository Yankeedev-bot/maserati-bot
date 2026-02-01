/**
 * Système Anti-Palavra Prestige - Édition Maserati
 * Blacklist de mots interdits avec ban automatique
 * Configurable par groupe - Réservé aux admins
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIR_GROUPS = path.join(__dirname, '../../../database/grupos');

// --- HELPERS HAUTE PERFORMANCE ---

/**
 * Normalise le texte (minuscules + suppression accents) pour comparaison
 */
const normaliserTexte = (texte) => {
  if (!texte || typeof texte !== 'string') return '';
  return texte
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime accents
    .trim();
};

/**
 * Charge les données d'un groupe
 */
const chargerDonneesGroupe = (idGroupe) => {
  try {
    const fichierGroupe = path.join(DIR_GROUPS, `${idGroupe}.json`);
    if (fs.existsSync(fichierGroupe)) {
      const data = JSON.parse(fs.readFileSync(fichierGroupe, 'utf8'));
      return data;
    }
    return {};
  } catch (err) {
    console.error(`[Maserati-AntiPalavra] Erreur chargement groupe ${idGroupe} :`, err.message);
    return {};
  }
};

/**
 * Sauvegarde les données d'un groupe
 */
const sauvegarderDonneesGroupe = (idGroupe, data) => {
  try {
    const dossier = path.dirname(path.join(DIR_GROUPS, `${idGroupe}.json`));
    if (!fs.existsSync(dossier)) {
      fs.mkdirSync(dossier, { recursive: true });
    }
    const fichierGroupe = path.join(DIR_GROUPS, `${idGroupe}.json`);
    fs.writeFileSync(fichierGroupe, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error(`[Maserati-AntiPalavra] Erreur sauvegarde groupe ${idGroupe} :`, err.message);
    return false;
  }
};

/**
 * Récupère ou initialise la config antipalavra du groupe
 */
const getConfigAntiPalavra = (donneesGroupe) => {
  if (!donneesGroupe.antipalavra) {
    donneesGroupe.antipalavra = {
      actif: false,
      blacklist: [],
      stats: {
        bansTotaux: 0,
        detectionsTotales: 0,
        derniereMaj: new Date().toISOString()
      }
    };
  }

  // Garantit l'existence des champs
  if (!donneesGroupe.antipalavra.blacklist) {
    donneesGroupe.antipalavra.blacklist = [];
  }
  if (!donneesGroupe.antipalavra.stats) {
    donneesGroupe.antipalavra.stats = {
      bansTotaux: 0,
      detectionsTotales: 0,
      derniereMaj: new Date().toISOString()
    };
  }

  return donneesGroupe.antipalavra;
};

// --- COMMANDES DE GESTION (admins seulement) ---

/**
 * Active le système anti-palavra dans le groupe
 */
const maseratiActiverAntiPalavra = (idGroupe) => {
  const donnees = chargerDonneesGroupe(idGroupe);
  const config = getConfigAntiPalavra(donnees);

  if (config.actif) {
    return {
      succes: false,
      message: '⚠️ Le système anti-palavra est déjà actif dans ce groupe !'
    };
  }

  config.actif = true;
  config.stats.derniereMaj = new Date().toISOString();

  if (sauvegarderDonneesGroupe(idGroupe, donnees)) {
    return {
      succes: true,
      message: '✅ Anti-palavra Maserati activé ! Ajoute des mots interdits avec le commande dédiée.'
    };
  }

  return {
    succes: false,
    message: '❌ Erreur lors de l’activation du système anti-palavra.'
  };
};

/**
 * Désactive le système anti-palavra
 */
const maseratiDesactiverAntiPalavra = (idGroupe) => {
  const donnees = chargerDonneesGroupe(idGroupe);
  const config = getConfigAntiPalavra(donnees);

  if (!config.actif) {
    return {
      succes: false,
      message: '⚠️ Le système anti-palavra est déjà désactivé dans ce groupe !'
    };
  }

  config.actif = false;
  config.stats.derniereMaj = new Date().toISOString();

  if (sauvegarderDonneesGroupe(idGroupe, donnees)) {
    return {
      succes: true,
      message: '✅ Anti-palavra Maserati désactivé ! La blacklist reste sauvegardée.'
    };
  }

  return {
    succes: false,
    message: '❌ Erreur lors de la désactivation du système anti-palavra.'
  };
};

/**
 * Ajoute un mot à la blacklist
 */
const maseratiAjouterMotBlacklist = (idGroupe, mot) => {
  if (!mot || typeof mot !== 'string') {
    return {
      succes: false,
      message: '❌ Mot invalide !'
    };
  }

  const donnees = chargerDonneesGroupe(idGroupe);
  const config = getConfigAntiPalavra(donnees);
  const motNormalise = normaliserTexte(mot);

  if (!motNormalise) {
    return {
      succes: false,
      message: '❌ Le mot ne peut pas être vide !'
    };
  }

  // Vérifie doublon
  const existeDeja = config.blacklist.some(item => 
    normaliserTexte(item.mot) === motNormalise
  );

  if (existeDeja) {
    return {
      succes: false,
      message: '⚠️ Ce mot est déjà dans la blacklist !'
    };
  }

  // Ajout
  config.blacklist.push({
    mot: mot.trim(),
    motNormalise: motNormalise,
    ajouteLe: new Date().toISOString(),
    detections: 0
  });

  config.stats.derniereMaj = new Date().toISOString();

  if (sauvegarderDonneesGroupe(idGroupe, donnees)) {
    return {
      succes: true,
      message: `✅ Mot "${mot}" ajouté à la blacklist Maserati !\n📊 Total mots interdits : ${config.blacklist.length}`
    };
  }

  return {
    succes: false,
    message: '❌ Erreur lors de l’ajout du mot à la blacklist.'
  };
};

/**
 * Supprime un mot de la blacklist
 */
const maseratiSupprimerMotBlacklist = (idGroupe, mot) => {
  if (!mot || typeof mot !== 'string') {
    return {
      succes: false,
      message: '❌ Mot invalide !'
    };
  }

  const donnees = chargerDonneesGroupe(idGroupe);
  const config = getConfigAntiPalavra(donnees);
  const motNormalise = normaliserTexte(mot);

  const longueurAvant = config.blacklist.length;
  config.blacklist = config.blacklist.filter(item => 
    normaliserTexte(item.mot) !== motNormalise
  );

  if (config.blacklist.length === longueurAvant) {
    return {
      succes: false,
      message: '⚠️ Ce mot n’est pas dans la blacklist !'
    };
  }

  config.stats.derniereMaj = new Date().toISOString();

  if (sauvegarderDonneesGroupe(idGroupe, donnees)) {
    return {
      succes: true,
      message: `✅ Mot "${mot}" supprimé de la blacklist !\n📊 Total restant : ${config.blacklist.length}`
    };
  }

  return {
    succes: false,
    message: '❌ Erreur lors de la suppression du mot.'
  };
};

/**
 * Liste la blacklist complète
 */
const maseratiListerBlacklist = (idGroupe) => {
  const donnees = chargerDonneesGroupe(idGroupe);
  const config = getConfigAntiPalavra(donnees);

  if (config.blacklist.length === 0) {
    return {
      succes: true,
      message: '📋 La blacklist Maserati est vide. Ajoute des mots interdits !',
      blacklist: []
    };
  }

  // Tri par détections (plus détecté en premier)
  const trie = [...config.blacklist].sort((a, b) => b.detections - a.detections);

  let msg = `📋 *BLACKLIST MASERATI PRESTIGE* 🏎️👑✨\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📊 État : ${config.actif ? '✅ Actif' : '❌ Désactivé'}\n`;
  msg += `🔢 Mots interdits : ${config.blacklist.length}\n`;
  msg += `🚫 Bans totaux : ${config.stats.bansTotaux}\n`;
  msg += `🔍 Détections totales : ${config.stats.detectionsTotales}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  trie.forEach((item, index) => {
    msg += `\( {index + 1}. " \){item.mot}"\n`;
    msg += `   ├ 🔍 Détections : ${item.detections}\n`;
    msg += `   └ 📅 Ajouté : ${new Date(item.ajouteLe).toLocaleDateString('fr-FR')}\n\n`;
  });

  return {
    succes: true,
    message: msg.trim(),
    blacklist: trie
  };
};

/**
 * Vide complètement la blacklist
 */
const maseratiViderBlacklist = (idGroupe) => {
  const donnees = chargerDonneesGroupe(idGroupe);
  const config = getConfigAntiPalavra(donnees);

  if (config.blacklist.length === 0) {
    return {
      succes: false,
      message: '⚠️ La blacklist est déjà vide !'
    };
  }

  const count = config.blacklist.length;
  config.blacklist = [];
  config.stats.derniereMaj = new Date().toISOString();

  if (sauvegarderDonneesGroupe(idGroupe, donnees)) {
    return {
      succes: true,
      message: `✅ Blacklist Maserati vidée ! ${count} mot(s) supprimé(s).`
    };
  }

  return {
    succes: false,
    message: '❌ Erreur lors du vidage de la blacklist.'
  };
};

// --- VÉRIFICATION EN TEMPS RÉEL ---

/**
 * Vérifie si un message contient un mot interdit
 * Retourne l’objet du mot détecté ou null
 */
const maseratiVerifierMessage = (idGroupe, texteMessage) => {
  if (!texteMessage || typeof texteMessage !== 'string') {
    return null;
  }

  const donnees = chargerDonneesGroupe(idGroupe);
  const config = getConfigAntiPalavra(donnees);

  if (!config.actif || config.blacklist.length === 0) {
    return null;
  }

  const texteNormalise = normaliserTexte(texteMessage);

  for (const item of config.blacklist) {
    if (texteNormalise.includes(item.motNormalise)) {
      // Incrémente les compteurs
      item.detections++;
      config.stats.detectionsTotales++;
      config.stats.derniereMaj = new Date().toISOString();
      sauvegarderDonneesGroupe(idGroupe, donnees);

      return {
        detecte: true,
        mot: item.mot,
        motOriginal: item.mot
      };
    }
  }

  return null;
};

/**
 * Enregistre un ban pour stats
 */
const maseratiEnregistrerBan = (idGroupe, idUtilisateur, mot) => {
  const donnees = chargerDonneesGroupe(idGroupe);
  const config = getConfigAntiPalavra(donnees);

  config.stats.bansTotaux++;
  config.stats.derniereMaj = new Date().toISOString();

  // Historique (limité à 100 derniers)
  if (!config.historiqueBans) {
    config.historiqueBans = [];
  }

  config.historiqueBans.push({
    utilisateurId: idUtilisateur,
    mot: mot,
    banniLe: new Date().toISOString()
  });

  if (config.historiqueBans.length > 100) {
    config.historiqueBans = config.historiqueBans.slice(-100);
  }

  sauvegarderDonneesGroupe(idGroupe, donnees);
};

/**
 * Récupère les stats du système
 */
const maseratiObtenirStats = (idGroupe) => {
  const donnees = chargerDonneesGroupe(idGroupe);
  const config = getConfigAntiPalavra(donnees);

  return {
    actif: config.actif,
    totalMots: config.blacklist.length,
    bansTotaux: config.stats.bansTotaux,
    detectionsTotales: config.stats.detectionsTotales,
    derniereMaj: config.stats.derniereMaj,
    topMots: config.blacklist
      .sort((a, b) => b.detections - a.detections)
      .slice(0, 5)
      .map(item => ({
        mot: item.mot,
        detections: item.detections
      }))
  };
};

/**
 * Vérifie si le système est actif
 */
const maseratiEstActif = (idGroupe) => {
  const donnees = chargerDonneesGroupe(idGroupe);
  const config = getConfigAntiPalavra(donnees);
  return config.actif === true;
};

// --- EXPORTS MASERATI ---

export {
  maseratiActiverAntiPalavra,
  maseratiDesactiverAntiPalavra,
  maseratiAjouterMotBlacklist,
  maseratiSupprimerMotBlacklist,
  maseratiListerBlacklist,
  maseratiViderBlacklist,
  maseratiVerifierMessage,
  maseratiEnregistrerBan,
  maseratiObtenirStats,
  maseratiEstActif
};
