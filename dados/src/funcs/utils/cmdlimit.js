/**
 * Système de Limites de Commandes Prestige - Édition Maserati
 * Limite les abus sur les commandes – contrôle total du paddock
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import {
  addCommandLimit,
  removeCommandLimit,
  getCommandLimits,
  checkCommandLimit,
  formatTimeLeft
} from '../../utils/database.js';

/**
 * Ajoute une limite prestige sur une commande
 * Réservé aux propriétaires et sub-propriétaires
 */
async function maseratiLimiterCommande(nazu, from, q, reply, prefix, estProprioOuSub) {
  if (!estProprioOuSub) {
    return reply("🚫 Réservé aux propriétaires et sub-propriétaires du circuit !");
  }

  const args = q.trim().split(/\s+/);
  if (args.length < 3) {
    return reply(`❌ Format prestige invalide !\n\n` +
                 `Utilisation : ${prefix}cmdlimiter <commande> <max utilisations> <durée>\n\n` +
                 `Exemple MC20 : ${prefix}cmdlimiter sticker 3 1h\n\n` +
                 `⏱ Formats de temps acceptés :\n` +
                 `• 30s → 30 secondes\n` +
                 `• 10m → 10 minutes\n` +
                 `• 1h  → 1 heure\n` +
                 `• 2d  → 2 jours`);
  }

  const commande = args[0].toLowerCase();
  const maxUtilisations = parseInt(args[1]);
  const duree = args[2];

  if (isNaN(maxUtilisations) || maxUtilisations < 1) {
    return reply("❌ Le nombre max d’utilisations doit être un entier positif !");
  }

  const resultat = addCommandLimit(commande, maxUtilisations, duree);

  return reply(resultat.message);
}

/**
 * Supprime une limite existante sur une commande
 * Réservé aux propriétaires et sub-propriétaires
 */
async function maseratiSupprimerLimite(nazu, from, q, reply, prefix, estProprioOuSub) {
  if (!estProprioOuSub) {
    return reply("🚫 Réservé aux propriétaires et sub-propriétaires du circuit !");
  }

  if (!q.trim()) {
    return reply(`❌ Indique la commande à libérer !\n\n` +
                 `Utilisation : ${prefix}cmddeslimiter <commande>\n\n` +
                 `Exemple : ${prefix}cmddeslimiter sticker`);
  }

  const commande = q.trim().toLowerCase();
  const resultat = removeCommandLimit(commande);

  return reply(resultat.message);
}

/**
 * Liste toutes les commandes limitées (vue paddock)
 * Réservé aux propriétaires et sub-propriétaires
 */
async function maseratiListerLimites(nazu, from, q, reply, prefix, estProprioOuSub) {
  if (!estProprioOuSub) {
    return reply("🚫 Réservé aux propriétaires et sub-propriétaires du circuit !");
  }

  const limites = getCommandLimits();
  const nomsCommandes = Object.keys(limites);

  if (nomsCommandes.length === 0) {
    return reply("📝 Aucune commande limitée pour le moment – paddock libre !");
  }

  let message = `🚫 *COMMANDES SOUS CONTRÔLE PRESTIGE*\n\n`;

  for (const nomCmd of nomsCommandes) {
    const limite = limites[nomCmd];

    message += `• *\( {prefix} \){nomCmd}*\n`;
    message += `  📊 Max par pilote : ${limite.maxUses}\n`;
    message += `  ⏰ Période : ${limite.timeFrame}\n`;
    message += `  🎯 Contrôle : Individuel par utilisateur\n`;
    message += `  📅 Activé le : ${new Date(limite.createdAt).toLocaleDateString('fr-FR')}\n\n`;
  }

  message += `ℹ️ *Règles du circuit :*\n`;
  message += `• Chaque pilote a son propre compteur\n`;
  message += `• Limite atteinte → attente du cooldown\n`;
  message += `• Reset individuel – pas de pénalité collective`;

  return reply(message);
}

// Exports prestige
export {
  maseratiLimiterCommande,
  maseratiSupprimerLimite,
  maseratiListerLimites
};

export default {
  limiter: maseratiLimiterCommande,
  supprimerLimite: maseratiSupprimerLimite,
  listerLimites: maseratiListerLimites
};
