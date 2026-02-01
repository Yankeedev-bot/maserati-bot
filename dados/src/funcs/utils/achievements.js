/**
 * Système de Conquêtes Prestige - Édition Maserati
 * Badges, XP, Gold et récompenses automatiques
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FICHIER_CONQUETES = path.join(__dirname, '../../../database/conquetes.json');

// Liste prestige des conquêtes Maserati
const CONQUETES_MASERATI = {
  // Messages – Circuit social
  premier_message: {
    id: 'premier_message',
    nom: '🏁 Premier Tour',
    description: 'A envoyé son premier message sur le circuit',
    icone: '🏁',
    xp: 10,
    gold: 50
  },
  messages_100: {
    id: 'messages_100',
    nom: '💨 Pilote Bavard',
    description: 'A envoyé 100 messages à pleine vitesse',
    icone: '💨',
    xp: 50,
    gold: 200
  },
  messages_1000: {
    id: 'messages_1000',
    nom: '📢 Commentateur du Paddock',
    description: 'A envoyé 1 000 messages – voix du circuit',
    icone: '📢',
    xp: 200,
    gold: 1000
  },
  messages_10000: {
    id: 'messages_10000',
    nom: '🔊 Légende du Microphone',
    description: 'A envoyé 10 000 messages – roi des ondes',
    icone: '🔊',
    xp: 1000,
    gold: 5000
  },

  // Commandes – Maître des commandes
  premier_commande: {
    id: 'premier_commande',
    nom: '🛠️ Premier Démarrage',
    description: 'A utilisé sa première commande prestige',
    icone: '🛠️',
    xp: 10,
    gold: 25
  },
  commandes_50: {
    id: 'commandes_50',
    nom: '🎮 Pilote Amateur',
    description: 'A exécuté 50 commandes avec style',
    icone: '🎮',
    xp: 50,
    gold: 150
  },
  commandes_500: {
    id: 'commandes_500',
    nom: '🕹️ Pilote Confirmé',
    description: 'A maîtrisé 500 commandes – pro du volant',
    icone: '🕹️',
    xp: 200,
    gold: 750
  },
  commandes_5000: {
    id: 'commandes_5000',
    nom: '🏆 Maître du Cockpit',
    description: 'A utilisé 5 000 commandes – légende vivante',
    icone: '🏆',
    xp: 1000,
    gold: 3000
  },

  // Jeux – Circuit de victoires
  premiere_victoire: {
    id: 'premiere_victoire',
    nom: '🥇 Premier Drapeau à Damier',
    description: 'A remporté sa première victoire',
    icone: '🥇',
    xp: 25,
    gold: 100
  },
  victoires_10: {
    id: 'victoires_10',
    nom: '🎖️ Pilote Compétitif',
    description: 'A gagné 10 courses',
    icone: '🎖️',
    xp: 100,
    gold: 500
  },
  victoires_50: {
    id: 'victoires_50',
    nom: '🏅 Champion du Podium',
    description: 'A triomphé 50 fois',
    icone: '🏅',
    xp: 300,
    gold: 1500
  },
  victoires_100: {
    id: 'victoires_100',
    nom: '👑 Roi de la Piste',
    description: 'A remporté 100 victoires – légende absolue',
    icone: '👑',
    xp: 1000,
    gold: 5000
  },
  connect4_master: {
    id: 'connect4_master',
    nom: '🔴 Maître du Connect4',
    description: 'A gagné 25 parties de Connect4',
    icone: '🔴',
    xp: 500,
    gold: 2000
  },
  uno_master: {
    id: 'uno_master',
    nom: '🃏 Maître du UNO',
    description: 'A gagné 25 parties de UNO',
    icone: '🃏',
    xp: 500,
    gold: 2000
  },
  memory_master: {
    id: 'memory_master',
    nom: '🧠 Mémoire de V8',
    description: 'A terminé Memory en moins de 12 essais',
    icone: '🧠',
    xp: 300,
    gold: 1000
  },

  // Social – Prestige relationnel
  premier_cadeau: {
    id: 'premier_cadeau',
    nom: '🎁 Donateur de Luxe',
    description: 'A offert son premier cadeau prestige',
    icone: '🎁',
    xp: 25,
    gold: 50
  },
  cadeaux_25: {
    id: 'cadeaux_25',
    nom: '🎄 Père Noël du Trident',
    description: 'A offert 25 cadeaux',
    icone: '🎄',
    xp: 150,
    gold: 500
  },
  rep_positive_10: {
    id: 'rep_positive_10',
    nom: '⭐ Étoile Montante',
    description: 'A reçu 10 réputations positives',
    icone: '⭐',
    xp: 100,
    gold: 300
  },
  rep_positive_50: {
    id: 'rep_positive_50',
    nom: '🌟 Superstar du Paddock',
    description: 'A reçu 50 réputations positives',
    icone: '🌟',
    xp: 500,
    gold: 1500
  },

  // Économie/RPG – Richesse prestige
  premier_or: {
    id: 'premier_or',
    nom: '💰 Premier Lingot',
    description: 'A gagné son premier or',
    icone: '💰',
    xp: 5,
    gold: 100
  },
  or_1000: {
    id: 'or_1000',
    nom: '💵 Collectionneur Bleu Nuit',
    description: 'A accumulé 1 000 or',
    icone: '💵',
    xp: 50,
    gold: 0
  },
  or_10000: {
    id: 'or_10000',
    nom: '💎 Magnat du Trident',
    description: 'A accumulé 10 000 or',
    icone: '💎',
    xp: 200,
    gold: 0
  },
  or_100000: {
    id: 'or_100000',
    nom: '🤑 Milliardaire Maserati',
    description: 'A accumulé 100 000 or',
    icone: '🤑',
    xp: 1000,
    gold: 0
  },

  // Niveaux – Ascension royale
  niveau_10: {
    id: 'niveau_10',
    nom: '📈 En Pleine Accélération',
    description: 'A atteint le niveau 10',
    icone: '📈',
    xp: 100,
    gold: 500
  },
  niveau_25: {
    id: 'niveau_25',
    nom: '🚀 Pilote Expérimenté',
    description: 'A atteint le niveau 25',
    icone: '🚀',
    xp: 250,
    gold: 1000
  },
  niveau_50: {
    id: 'niveau_50',
    nom: '⚡ Vétéran du Circuit',
    description: 'A atteint le niveau 50',
    icone: '⚡',
    xp: 500,
    gold: 2500
  },
  niveau_100: {
    id: 'niveau_100',
    nom: '🌈 Légende Éternelle',
    description: 'A atteint le niveau 100',
    icone: '🌈',
    xp: 2000,
    gold: 10000
  },

  // Spéciales – Exclusivité
  streak_7: {
    id: 'streak_7',
    nom: '📅 Fidèle du Paddock',
    description: 'A maintenu une streak de 7 jours',
    icone: '📅',
    xp: 100,
    gold: 500
  },
  streak_30: {
    id: 'streak_30',
    nom: '🔥 Légende Quotidienne',
    description: 'A maintenu une streak de 30 jours',
    icone: '🔥',
    xp: 500,
    gold: 2500
  },
  night_owl: {
    id: 'night_owl',
    nom: '🦉 Roi de la Nuit',
    description: 'A utilisé des commandes entre 00:00 et 05:00',
    icone: '🦉',
    xp: 25,
    gold: 100
  },
  early_bird: {
    id: 'early_bird',
    nom: '🐦 Aurore du Trident',
    description: 'A utilisé des commandes entre 05:00 et 07:00',
    icone: '🐦',
    xp: 25,
    gold: 100
  },
  collectionneur: {
    id: 'collectionneur',
    nom: '🎯 Chasseur de Badges',
    description: 'A débloqué 20 conquêtes',
    icone: '🎯',
    xp: 500,
    gold: 2000
  },
  completionniste: {
    id: 'completionniste',
    nom: '✨ Roi Absolu',
    description: 'A débloqué toutes les conquêtes prestige',
    icone: '✨',
    xp: 5000,
    gold: 25000
  }
};

// Charger les données prestige
const chargerConquetes = () => {
  try {
    if (fs.existsSync(FICHIER_CONQUETES)) {
      return JSON.parse(fs.readFileSync(FICHIER_CONQUETES, 'utf8'));
    }
  } catch (err) {
    console.error('[Maserati-Conquêtes] Erreur chargement :', err.message);
  }
  return { utilisateurs: {}, statsGlobales: {} };
};

// Sauvegarder les données
const sauvegarderConquetes = (data) => {
  try {
    const dossier = path.dirname(FICHIER_CONQUETES);
    if (!fs.existsSync(dossier)) {
      fs.mkdirSync(dossier, { recursive: true });
    }
    fs.writeFileSync(FICHIER_CONQUETES, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('[Maserati-Conquêtes] Erreur sauvegarde :', err.message);
  }
};

// Obtenir profil utilisateur prestige
const obtenirProfilUtilisateur = (data, userId) => {
  if (!data.utilisateurs[userId]) {
    data.utilisateurs[userId] = {
      conquetesDebloquees: [],
      stats: {
        messages: 0,
        commandes: 0,
        victoires: 0,
        partiesJouees: 0,
        connect4Victoires: 0,
        unoVictoires: 0,
        memoryMeilleurScore: null,
        cadeauxEnvoyes: 0,
        cadeauxRecus: 0,
        repPositive: 0,
        repNegative: 0,
        streakQuotidienne: 0,
        dernierDaily: null
      }
    };
  }
  return data.utilisateurs[userId];
};

// Vérifier & débloquer une conquête prestige
const verifierEtDebloquer = (userId, idConquete, verificationCustom = null) => {
  const data = chargerConquetes();
  const profil = obtenirProfilUtilisateur(data, userId);
  const conquete = CONQUETES_MASERATI[idConquete];

  if (!conquete) return null;
  if (profil.conquetesDebloquees.includes(idConquete)) return null;

  if (verificationCustom && !verificationCustom(profil.stats)) return null;

  profil.conquetesDebloquees.push(idConquete);
  sauvegarderConquetes(data);

  return {
    debloquee: true,
    conquete,
    message: `🏆 *CONQUÊTE PRESTIGE DÉBLOQUÉE !* 🏎️👑✨\n\n` +
             `\( {conquete.icone} * \){conquete.nom}*\n` +
             `📝 ${conquete.description}\n\n` +
             `🎁 Récompenses :\n` +
             `\( {conquete.xp > 0 ? `   ⭐ + \){conquete.xp} XP\n` : ''}` +
             `\( {conquete.gold > 0 ? `   💰 + \){conquete.gold} Gold\n` : ''}`
  };
};

// Incrémenter une stat et vérifier conquêtes liées
const maseratiIncrementerStat = (userId, stat, montant = 1) => {
  const data = chargerConquetes();
  const profil = obtenirProfilUtilisateur(data, userId);

  profil.stats[stat] = (profil.stats[stat] || 0) + montant;
  sauvegarderConquetes(data);

  const conquetesDebloquees = [];

  switch (stat) {
    case 'messages':
      if (profil.stats.messages >= 1) {
        const res = verifierEtDebloquer(userId, 'premier_message');
        if (res) conquetesDebloquees.push(res);
      }
      if (profil.stats.messages >= 100) {
        const res = verifierEtDebloquer(userId, 'messages_100');
        if (res) conquetesDebloquees.push(res);
      }
      if (profil.stats.messages >= 1000) {
        const res = verifierEtDebloquer(userId, 'messages_1000');
        if (res) conquetesDebloquees.push(res);
      }
      if (profil.stats.messages >= 10000) {
        const res = verifierEtDebloquer(userId, 'messages_10000');
        if (res) conquetesDebloquees.push(res);
      }
      break;

    case 'commandes':
      if (profil.stats.commandes >= 1) {
        const res = verifierEtDebloquer(userId, 'premier_commande');
        if (res) conquetesDebloquees.push(res);
      }
      if (profil.stats.commandes >= 50) {
        const res = verifierEtDebloquer(userId, 'commandes_50');
        if (res) conquetesDebloquees.push(res);
      }
      if (profil.stats.commandes >= 500) {
        const res = verifierEtDebloquer(userId, 'commandes_500');
        if (res) conquetesDebloquees.push(res);
      }
      if (profil.stats.commandes >= 5000) {
        const res = verifierEtDebloquer(userId, 'commandes_5000');
        if (res) conquetesDebloquees.push(res);
      }
      const heure = new Date().getHours();
      if (heure >= 0 && heure < 5) {
        const res = verifierEtDebloquer(userId, 'night_owl');
        if (res) conquetesDebloquees.push(res);
      }
      if (heure >= 5 && heure < 7) {
        const res = verifierEtDebloquer(userId, 'early_bird');
        if (res) conquetesDebloquees.push(res);
      }
      break;

    case 'victoires':
      if (profil.stats.victoires >= 1) {
        const res = verifierEtDebloquer(userId, 'premiere_victoire');
        if (res) conquetesDebloquees.push(res);
      }
      if (profil.stats.victoires >= 10) {
        const res = verifierEtDebloquer(userId, 'victoires_10');
        if (res) conquetesDebloquees.push(res);
      }
      if (profil.stats.victoires >= 50) {
        const res = verifierEtDebloquer(userId, 'victoires_50');
        if (res) conquetesDebloquees.push(res);
      }
      if (profil.stats.victoires >= 100) {
        const res = verifierEtDebloquer(userId, 'victoires_100');
        if (res) conquetesDebloquees.push(res);
      }
      break;

    case 'connect4Victoires':
      if (profil.stats.connect4Victoires >= 25) {
        const res = verifierEtDebloquer(userId, 'connect4_master');
        if (res) conquetesDebloquees.push(res);
      }
      break;

    case 'unoVictoires':
      if (profil.stats.unoVictoires >= 25) {
        const res = verifierEtDebloquer(userId, 'uno_master');
        if (res) conquetesDebloquees.push(res);
      }
      break;

    case 'cadeauxEnvoyes':
      if (profil.stats.cadeauxEnvoyes >= 1) {
        const res = verifierEtDebloquer(userId, 'premier_cadeau');
        if (res) conquetesDebloquees.push(res);
      }
      if (profil.stats.cadeauxEnvoyes >= 25) {
        const res = verifierEtDebloquer(userId, 'cadeaux_25');
        if (res) conquetesDebloquees.push(res);
      }
      break;

    case 'repPositive':
      if (profil.stats.repPositive >= 10) {
        const res = verifierEtDebloquer(userId, 'rep_positive_10');
        if (res) conquetesDebloquees.push(res);
      }
      if (profil.stats.repPositive >= 50) {
        const res = verifierEtDebloquer(userId, 'rep_positive_50');
        if (res) conquetesDebloquees.push(res);
      }
      break;
  }

  // Conquêtes de collection
  if (profil.conquetesDebloquees.length >= 20) {
    const res = verifierEtDebloquer(userId, 'collectionneur');
    if (res) conquetesDebloquees.push(res);
  }
  if (profil.conquetesDebloquees.length >= Object.keys(CONQUETES_MASERATI).length) {
    const res = verifierEtDebloquer(userId, 'completionniste');
    if (res) conquetesDebloquees.push(res);
  }

  return conquetesDebloquees;
};

// Vérif spéciale Memory (score)
const maseratiVerifierMemory = (userId, essais) => {
  const data = chargerConquetes();
  const profil = obtenirProfilUtilisateur(data, userId);

  if (profil.stats.memoryMeilleurScore === null || essais < profil.stats.memoryMeilleurScore) {
    profil.stats.memoryMeilleurScore = essais;
    sauvegarderConquetes(data);
  }

  if (essais <= 12) {
    return verifierEtDebloquer(userId, 'memory_master');
  }
  return null;
};

// Vérif niveau prestige
const maseratiVerifierNiveau = (userId, niveau) => {
  const conquetes = [];

  if (niveau >= 10) {
    const res = verifierEtDebloquer(userId, 'niveau_10');
    if (res) conquetes.push(res);
  }
  if (niveau >= 25) {
    const res = verifierEtDebloquer(userId, 'niveau_25');
    if (res) conquetes.push(res);
  }
  if (niveau >= 50) {
    const res = verifierEtDebloquer(userId, 'niveau_50');
    if (res) conquetes.push(res);
  }
  if (niveau >= 100) {
    const res = verifierEtDebloquer(userId, 'niveau_100');
    if (res) conquetes.push(res);
  }

  return conquetes;
};

// Vérif or accumulé
const maseratiVerifierOr = (userId, or) => {
  const conquetes = [];

  if (or >= 1) {
    const res = verifierEtDebloquer(userId, 'premier_or');
    if (res) conquetes.push(res);
  }
  if (or >= 1000) {
    const res = verifierEtDebloquer(userId, 'or_1000');
    if (res) conquetes.push(res);
  }
  if (or >= 10000) {
    const res = verifierEtDebloquer(userId, 'or_10000');
    if (res) conquetes.push(res);
  }
  if (or >= 100000) {
    const res = verifierEtDebloquer(userId, 'or_100000');
    if (res) conquetes.push(res);
  }

  return conquetes;
};

// Vérif streak quotidienne
const maseratiVerifierStreak = (userId) => {
  const data = chargerConquetes();
  const profil = obtenirProfilUtilisateur(data, userId);
  const aujourdhui = new Date().toDateString();

  if (profil.stats.dernierDaily === aujourdhui) {
    return [];
  }

  const hier = new Date(Date.now() - 86400000).toDateString();
  if (profil.stats.dernierDaily === hier) {
    profil.stats.streakQuotidienne++;
  } else {
    profil.stats.streakQuotidienne = 1;
  }
  profil.stats.dernierDaily = aujourdhui;
  sauvegarderConquetes(data);

  const conquetes = [];
  if (profil.stats.streakQuotidienne >= 7) {
    const res = verifierEtDebloquer(userId, 'streak_7');
    if (res) conquetes.push(res);
  }
  if (profil.stats.streakQuotidienne >= 30) {
    const res = verifierEtDebloquer(userId, 'streak_30');
    if (res) conquetes.push(res);
  }

  return conquetes;
};

// Profil complet prestige
const maseratiObtenirProfil = (userId) => {
  const data = chargerConquetes();
  const profil = obtenirProfilUtilisateur(data, userId);

  const debloquees = profil.conquetesDebloquees.map(id => CONQUETES_MASERATI[id]).filter(Boolean);
  const bloquees = Object.values(CONQUETES_MASERATI).filter(
    c => !profil.conquetesDebloquees.includes(c.id)
  );

  return {
    debloquees,
    bloquees,
    total: Object.keys(CONQUETES_MASERATI).length,
    debloqueesCount: debloquees.length,
    stats: profil.stats
  };
};

// Liste formatée prestige
const maseratiFormaterListeConquetes = (userId) => {
  const { debloquees, bloquees, total, debloqueesCount, stats } = maseratiObtenirProfil(userId);

  let msg = `🏆 *CONQUÊTES PRESTIGE* (\( {debloqueesCount}/ \){total})\n\n`;

  if (debloquees.length > 0) {
    msg += `✅ *Débloquées :*\n`;
    debloquees.forEach(c => {
      msg += `${c.icone} ${c.nom}\n`;
    });
    msg += '\n';
  }

  if (bloquees.length > 0) {
    msg += `🔒 *Bloquées :*\n`;
    bloquees.slice(0, 10).forEach(c => {
      msg += `${c.icone} ???\n`;
    });
    if (bloquees.length > 10) {
      msg += `   _... et ${bloquees.length - 10} autres trophées cachés_\n`;
    }
  }

  msg += `\n📊 *Stats Circuit :*\n`;
  msg += `💬 Messages : ${stats.messages || 0}\n`;
  msg += `⌨️ Commandes : ${stats.commandes || 0}\n`;
  msg += `🎮 Victoires : ${stats.victoires || 0}\n`;
  msg += `🔥 Streak : ${stats.streakQuotidienne || 0} jours`;

  return msg;
};

// Liste complète des conquêtes disponibles
const maseratiObtenirToutesConquetes = () => CONQUETES_MASERATI;

// Exports prestige
export {
  CONQUETES_MASERATI,
  maseratiIncrementerStat,
  verifierEtDebloquer,
  maseratiVerifierMemory,
  maseratiVerifierNiveau,
  maseratiVerifierOr,
  maseratiVerifierStreak,
  maseratiObtenirProfil,
  maseratiFormaterListeConquetes,
  maseratiObtenirToutesConquetes
};

export default {
  CONQUETES_MASERATI,
  incrementerStat: maseratiIncrementerStat,
  verifierEtDebloquer,
  verifierMemory: maseratiVerifierMemory,
  verifierNiveau: maseratiVerifierNiveau,
  verifierOr: maseratiVerifierOr,
  verifierStreak: maseratiVerifierStreak,
  obtenirProfil: maseratiObtenirProfil,
  formaterListe: maseratiFormaterListeConquetes,
  obtenirToutes: maseratiObtenirToutesConquetes
};
