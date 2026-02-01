/**
 * Système de Transmission Prestige - Édition Maserati
 * Liste de diffusion privée – inscriptions volontaires
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FICHIER_TRANSMISSION = path.join(__dirname, '../../../database/transmission_maserati.json');

// ── CONFIGURATION PRESTIGE ──
const CONFIG_TRANSMISSION_MASERATI = {
  DOSSIER_TEMP: path.join(__dirname, '../../../database/tmp/transmission'),
  FICHIER: FICHIER_TRANSMISSION
};

// Assure dossier temporaire prestige
function assurerDossierTemp() {
  const dossier = CONFIG_TRANSMISSION_MASERATI.DOSSIER_TEMP;
  if (!fsSync.existsSync(dossier)) {
    fsSync.mkdirSync(dossier, { recursive: true });
  }
  return dossier;
}

/**
 * Charge la liste des abonnés prestige
 */
const chargerAbonnes = async () => {
  try {
    if (await fs.access(CONFIG_TRANSMISSION_MASERATI.FICHIER).then(() => true).catch(() => false)) {
      const contenu = await fs.readFile(CONFIG_TRANSMISSION_MASERATI.FICHIER, 'utf8');
      return JSON.parse(contenu);
    }
  } catch (err) {
    console.error('[Maserati-Transmission] Erreur chargement abonnés :', err.message);
  }

  return {
    abonnes: [],
    stats: {
      totalAbonnes: 0,
      totalMessages: 0,
      derniereDiffusion: null
    }
  };
};

/**
 * Sauvegarde la liste des abonnés prestige
 */
const sauvegarderAbonnes = async (data) => {
  try {
    const dossier = path.dirname(CONFIG_TRANSMISSION_MASERATI.FICHIER);
    if (!fsSync.existsSync(dossier)) {
      fsSync.mkdirSync(dossier, { recursive: true });
    }
    await fs.writeFile(CONFIG_TRANSMISSION_MASERATI.FICHIER, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error('[Maserati-Transmission] Erreur sauvegarde abonnés :', err.message);
    return false;
  }
};

/**
 * Inscription à la transmission prestige
 * @param {string} userId - ID WhatsApp du pilote
 * @param {string} userName - Nom affiché
 */
const maseratiSInscrire = async (userId, userName) => {
  const data = await chargerAbonnes();

  // Vérification déjà abonné
  const dejaAbonne = data.abonnes.some(ab => ab.id === userId);

  if (dejaAbonne) {
    return {
      succes: false,
      message: '⚠️ Tu es déjà abonné à la transmission prestige !\n\nUtilise le même commande pour te désabonner.'
    };
  }

  // Ajout pilote prestige
  data.abonnes.push({
    id: userId,
    nom: userName || 'Pilote anonyme',
    inscritLe: new Date().toISOString(),
    messagesRecus: 0
  });

  data.stats.totalAbonnes = data.abonnes.length;

  if (await sauvegarderAbonnes(data)) {
    return {
      succes: true,
      message: `✅ *INSCRIPTION À LA TRANSMISSION PRESTIGE CONFIRMÉE !*\n\n` +
               `📡 Tu recevras désormais les annonces exclusives du paddock Maserati.\n` +
               `👥 Total abonnés : ${data.stats.totalAbonnes}\n\n` +
               `💡 Pour te désabonner : même commande.`
    };
  }

  return {
    succes: false,
    message: '❌ Erreur lors de l’inscription à la transmission prestige.'
  };
};

/**
 * Désinscription de la transmission prestige
 */
const maseratiSeDesabonner = async (userId) => {
  const data = await chargerAbonnes();

  const longueurInitiale = data.abonnes.length;
  data.abonnes = data.abonnes.filter(ab => ab.id !== userId);

  if (data.abonnes.length === longueurInitiale) {
    return {
      succes: false,
      message: '⚠️ Tu n’es pas abonné à la transmission prestige !'
    };
  }

  data.stats.totalAbonnes = data.abonnes.length;

  if (await sauvegarderAbonnes(data)) {
    return {
      succes: true,
      message: `✅ *DÉSABONNEMENT EFFECTUÉ !*\n\n` +
               `📡 Tu ne recevras plus les annonces du paddock.\n` +
               `👥 Total abonnés restants : ${data.stats.totalAbonnes}`
    };
  }

  return {
    succes: false,
    message: '❌ Erreur lors du désabonnement.'
  };
};

/**
 * Vérifie si un pilote est abonné
 */
const maseratiEstAbonne = async (userId) => {
  const data = await chargerAbonnes();
  return data.abonnes.some(ab => ab.id === userId);
};

/**
 * Récupère la liste complète des abonnés (pour diffusion)
 */
const maseratiObtenirAbonnes = async () => {
  const data = await chargerAbonnes();
  return data.abonnes;
};

/**
 * Récupère les stats du tableau de bord prestige
 */
const maseratiObtenirStats = async () => {
  const data = await chargerAbonnes();
  return {
    totalAbonnes: data.stats.totalAbonnes,
    totalMessages: data.stats.totalMessages,
    derniereDiffusion: data.stats.derniereDiffusion,
    abonnes: data.abonnes
  };
};

/**
 * Incrémente les compteurs après une diffusion réussie
 * @param {number} succesCount - Nombre de messages réellement envoyés
 */
const maseratiIncrementerCompteurMessages = async (succesCount) => {
  const data = await chargerAbonnes();
  data.stats.totalMessages += succesCount;
  data.stats.derniereDiffusion = new Date().toISOString();

  // Mise à jour individuelle
  data.abonnes.forEach(ab => {
    ab.messagesRecus = (ab.messagesRecus || 0) + 1;
  });

  await sauvegarderAbonnes(data);
};

/**
 * Retire manuellement un abonné (admin / modération)
 */
const maseratiRetirerAbonne = async (userId) => {
  const data = await chargerAbonnes();

  const abonne = data.abonnes.find(ab => ab.id === userId);
  if (!abonne) {
    return {
      succes: false,
      message: '⚠️ Pilote non trouvé dans la liste d’abonnés prestige !'
    };
  }

  data.abonnes = data.abonnes.filter(ab => ab.id !== userId);
  data.stats.totalAbonnes = data.abonnes.length;

  if (await sauvegarderAbonnes(data)) {
    return {
      succes: true,
      message: `✅ Pilote @${abonne.nom || 'inconnu'} retiré de la liste prestige !\n` +
               `👥 Total abonnés restants : ${data.stats.totalAbonnes}`
    };
  }

  return {
    succes: false,
    message: '❌ Erreur lors du retrait du pilote.'
  };
};

/**
 * Nettoyage complet de la liste (propriétaire uniquement)
 */
const maseratiEffacerTout = async () => {
  const data = await chargerAbonnes();
  const count = data.abonnes.length;

  if (count === 0) {
    return {
      succes: false,
      message: '⚠️ La liste d’abonnés prestige est déjà vide !'
    };
  }

  data.abonnes = [];
  data.stats.totalAbonnes = 0;

  if (await sauvegarderAbonnes(data)) {
    return {
      succes: true,
      message: `✅ Liste prestige effacée !\n${count} abonné(s) supprimé(s).`
    };
  }

  return {
    succes: false,
    message: '❌ Erreur lors de l’effacement de la liste.'
  };
};

// Exports prestige
export {
  maseratiSInscrire,
  maseratiSeDesabonner,
  maseratiEstAbonne,
  maseratiObtenirAbonnes,
  maseratiObtenirStats,
  maseratiIncrementerCompteurMessages,
  maseratiRetirerAbonne,
  maseratiEffacerTout
};

export default {
  sinscrire: maseratiSInscrire,
  seDesabonner: maseratiSeDesabonner,
  estAbonne: maseratiEstAbonne,
  obtenirAbonnes: maseratiObtenirAbonnes,
  obtenirStats: maseratiObtenirStats,
  incrementerMessages: maseratiIncrementerCompteurMessages,
  retirerAbonne: maseratiRetirerAbonne,
  effacerTout: maseratiEffacerTout
};
