/**
 * Module Statistiques des Commandes Prestige - Édition Maserati
 * Suivi d’utilisation, top commandes, stats détaillées
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FICHIER_STATS_COMMANDES = path.join(__dirname, '../../../database/stats_commandes_maserati.json');

let cacheStats = null;
let ecritureEnCours = false;
let ecritureEnAttente = false;

// Initialisation prestige du circuit stats
async function maseratiInitialiserStats() {
  try {
    await fs.access(FICHIER_STATS_COMMANDES);
    const donnees = await fs.readFile(FICHIER_STATS_COMMANDES, 'utf8');
    cacheStats = JSON.parse(donnees);
  } catch (err) {
    cacheStats = { commandes: {}, derniereMaj: new Date().toISOString() };
    try {
      await fs.mkdir(path.dirname(FICHIER_STATS_COMMANDES), { recursive: true });
      await fs.writeFile(FICHIER_STATS_COMMANDES, JSON.stringify(cacheStats, null, 2));
    } catch (errEcriture) {
      console.error('[Maserati-StatsCmd] Erreur création fichier initial :', errEcriture.message);
    }
  }
}

// Sauvegarde sécurisée – pas de collision sur le circuit
async function maseratiSauvegarderStats() {
  if (ecritureEnCours) {
    ecritureEnAttente = true;
    return;
  }

  ecritureEnCours = true;
  try {
    cacheStats.derniereMaj = new Date().toISOString();
    await fs.writeFile(FICHIER_STATS_COMMANDES, JSON.stringify(cacheStats, null, 2));
  } catch (err) {
    console.error('[Maserati-StatsCmd] Erreur sauvegarde stats :', err.message);
  } finally {
    ecritureEnCours = false;
    if (ecritureEnAttente) {
      ecritureEnAttente = false;
      await maseratiSauvegarderStats();
    }
  }
}

// Suivi d’utilisation d’une commande – compteur par pilote
async function maseratiSuivreUtilisationCommande(nomCommande, idUtilisateur) {
  if (!cacheStats) await maseratiInitialiserStats();

  const statsCmd = cacheStats.commandes[nomCommande] || {
    utilisationsTotales: 0,
    pilotes: {},
    derniereUtilisation: ''
  };

  statsCmd.utilisationsTotales++;
  statsCmd.pilotes[idUtilisateur] = (statsCmd.pilotes[idUtilisateur] || 0) + 1;
  statsCmd.derniereUtilisation = new Date().toISOString();

  cacheStats.commandes[nomCommande] = statsCmd;

  await maseratiSauvegarderStats();
  return true;
}

// Top commandes les plus utilisées – classement prestige
async function maseratiObtenirTopCommandes(limite = 10) {
  if (!cacheStats) await maseratiInitialiserStats();

  const classement = Object.entries(cacheStats.commandes)
    .map(([nom, data]) => ({
      commande: nom,
      utilisations: data.utilisationsTotales,
      derniere: data.derniereUtilisation,
      pilotesUniques: Object.keys(data.pilotes).length
    }))
    .sort((a, b) => b.utilisations - a.utilisations);

  return classement.slice(0, limite);
}

// Stats détaillées d’une commande spécifique
async function maseratiObtenirStatsCommande(nomCommande) {
  if (!cacheStats) await maseratiInitialiserStats();

  const dataCmd = cacheStats.commandes[nomCommande];
  if (!dataCmd) return null;

  const topPilotes = Object.entries(dataCmd.pilotes)
    .map(([idPilote, count]) => ({ idPilote, utilisations: count }))
    .sort((a, b) => b.utilisations - a.utilisations)
    .slice(0, 5);

  return {
    commande: nomCommande,
    utilisationsTotales: dataCmd.utilisationsTotales,
    derniereUtilisation: dataCmd.derniereUtilisation,
    pilotesUniques: Object.keys(dataCmd.pilotes).length,
    topPilotes
  };
}

// Initialisation au démarrage du moteur
maseratiInitialiserStats();

// Exports prestige
export {
  maseratiSuivreUtilisationCommande,
  maseratiObtenirTopCommandes,
  maseratiObtenirStatsCommande
};

export default {
  suivreUtilisation: maseratiSuivreUtilisationCommande,
  topCommandes: maseratiObtenirTopCommandes,
  statsCommande: maseratiObtenirStatsCommande
};
