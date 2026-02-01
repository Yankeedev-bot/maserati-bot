/**
 * Système de Cadeaux Prestige - Édition Maserati
 * Coffrets quotidiens, envoi de cadeaux, inventaire luxe
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FICHIER_CADEAUX = path.join(__dirname, '../../../database/cadeaux_maserati.json');

// ── COFFRETS PRESTIGE DISPONIBLES ──
const COFFRETS_MASERATI = {
  bleu_nuit: {
    id: 'bleu_nuit',
    nom: '📦 Coffret Bleu Nuit',
    cout: 0,
    delai: 24 * 60 * 60 * 1000, // 24h – exclusivité quotidienne
    recompenses: [
      { type: 'gold', min: 10, max: 50, chance: 40 },
      { type: 'xp', min: 5, max: 25, chance: 40 },
      { type: 'objet', objets: ['🍎', '🍊', '🍋'], chance: 15 },
      { type: 'rien', chance: 5 }
    ]
  },
  trident: {
    id: 'trident',
    nom: '🎁 Coffret Trident',
    cout: 500,
    delai: 0,
    recompenses: [
      { type: 'gold', min: 100, max: 500, chance: 35 },
      { type: 'xp', min: 50, max: 150, chance: 35 },
      { type: 'objet', objets: ['💎', '🏆', '⭐'], chance: 25 },
      { type: 'rien', chance: 5 }
    ]
  },
  mc20: {
    id: 'mc20',
    nom: '✨ Coffret MC20',
    cout: 2000,
    delai: 0,
    recompenses: [
      { type: 'gold', min: 500, max: 2000, chance: 30 },
      { type: 'xp', min: 200, max: 500, chance: 30 },
      { type: 'objet', objets: ['👑', '🌟', '💫', '🔮'], chance: 35 },
      { type: 'rien', chance: 5 }
    ]
  }
};

// ── CADEAUX ENVOYABLES – LUXE RELATIONNEL ──
const CADEAUX_PRESTIGE = {
  rose:      { id: 'rose', emoji: '🌹', nom: 'Rose Royale', cout: 50, message: 'une rose d’exception' },
  coeur:     { id: 'coeur', emoji: '❤️', nom: 'Cœur Trident', cout: 100, message: 'un cœur battant prestige' },
  chocolat:  { id: 'chocolat', emoji: '🍫', nom: 'Chocolat MC20', cout: 75, message: 'un chocolat fin' },
  ourson:    { id: 'ourson', emoji: '🧸', nom: 'Ours Bleu Nuit', cout: 200, message: 'un ours en peluche luxe' },
  diamant:   { id: 'diamant', emoji: '💎', nom: 'Diamant Pur', cout: 500, message: 'un diamant éclatant' },
  couronne:  { id: 'couronne', emoji: '👑', nom: 'Couronne Majestueuse', cout: 1000, message: 'une couronne royale' },
  etoile:    { id: 'etoile', emoji: '⭐', nom: 'Étoile Filante', cout: 300, message: 'une étoile brillante' },
  gateau:    { id: 'gateau', emoji: '🎂', nom: 'Gâteau Prestige', cout: 150, message: 'un gâteau somptueux' },
  bouquet:   { id: 'bouquet', emoji: '💐', nom: 'Bouquet d’Abidjan', cout: 250, message: 'un bouquet raffiné' },
  bague:     { id: 'bague', emoji: '💍', nom: 'Bague Trident', cout: 2000, message: 'une bague étincelante' }
};

// Charger données prestige
const chargerCadeaux = () => {
  try {
    if (fs.existsSync(FICHIER_CADEAUX)) {
      return JSON.parse(fs.readFileSync(FICHIER_CADEAUX, 'utf8'));
    }
  } catch (err) {
    console.error('[Maserati-Cadeaux] Erreur chargement :', err.message);
  }
  return { utilisateurs: {}, historique: [] };
};

// Sauvegarder données
const sauvegarderCadeaux = (data) => {
  try {
    const dossier = path.dirname(FICHIER_CADEAUX);
    if (!fs.existsSync(dossier)) {
      fs.mkdirSync(dossier, { recursive: true });
    }
    fs.writeFileSync(FICHIER_CADEAUX, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('[Maserati-Cadeaux] Erreur sauvegarde :', err.message);
  }
};

// Profil pilote prestige
const obtenirProfilPilote = (data, userId) => {
  if (!data.utilisateurs[userId]) {
    data.utilisateurs[userId] = {
      dernierCoffretQuotidien: null,
      cadeauxEnvoyes: 0,
      cadeauxRecus: 0,
      cadeauxAujourdhui: 0,
      derniereDateCadeau: null,
      inventaire: {}
    };
  }
  return data.utilisateurs[userId];
};

// Helper nom pilote
const obtenirNomPilote = (userId) => {
  if (!userId || typeof userId !== 'string') return 'pilote anonyme';
  return userId.split('@')[0] || userId;
};

// Tirage récompense coffret – roue de la fortune MC20
const tirerRecompense = (coffret) => {
  const tirage = Math.random() * 100;
  let cumul = 0;

  for (const recompense of coffret.recompenses) {
    cumul += recompense.chance;
    if (tirage <= cumul) {
      if (recompense.type === 'rien') {
        return { type: 'rien', message: '💨 Le coffret était vide – retour au garage !' };
      }
      if (recompense.type === 'gold') {
        const montant = Math.floor(Math.random() * (recompense.max - recompense.min + 1)) + recompense.min;
        return { type: 'gold', montant, message: `💰 Jackpot ! +${montant} gold` };
      }
      if (recompense.type === 'xp') {
        const montant = Math.floor(Math.random() * (recompense.max - recompense.min + 1)) + recompense.min;
        return { type: 'xp', montant, message: `⭐ Boost XP ! +${montant} points` };
      }
      if (recompense.type === 'objet') {
        const objet = recompense.objets[Math.floor(Math.random() * recompense.objets.length)];
        return { type: 'objet', objet, message: `🎁 Objet rare : ${objet}` };
      }
    }
  }

  return { type: 'rien', message: '💨 Le coffret était vide – chance au prochain tour !' };
};

// Ouvrir coffret quotidien – bonus paddock
const maseratiOuvrirCoffretQuotidien = (userId) => {
  const data = chargerCadeaux();
  const profil = obtenirProfilPilote(data, userId);
  const maintenant = Date.now();

  if (profil.dernierCoffretQuotidien) {
    const tempsEcoule = maintenant - profil.dernierCoffretQuotidien;
    if (tempsEcoule < COFFRETS_MASERATI.bleu_nuit.delai) {
      const restant = COFFRETS_MASERATI.bleu_nuit.delai - tempsEcoule;
      const heures = Math.floor(restant / (60 * 60 * 1000));
      const minutes = Math.floor((restant % (60 * 60 * 1000)) / (60 * 1000));
      return {
        succes: false,
        message: `⏳ Coffret quotidien déjà ouvert !\n\nProchain dans : ${heures}h ${minutes}min`
      };
    }
  }

  profil.dernierCoffretQuotidien = maintenant;
  const recompense = tirerRecompense(COFFRETS_MASERATI.bleu_nuit);

  if (recompense.type === 'objet') {
    profil.inventaire[recompense.objet] = (profil.inventaire[recompense.objet] || 0) + 1;
  }

  sauvegarderCadeaux(data);

  return {
    succes: true,
    recompense,
    message: `📦 *COFFRET BLEU NUIT OUVERT*\n\n${recompense.message}`
  };
};

// Ouvrir coffret payant – luxe instantané
const maseratiOuvrirCoffret = (userId, typeCoffret, orUtilisateur) => {
  const coffret = COFFRETS_MASERATI[typeCoffret];
  if (!coffret) {
    return { succes: false, message: '❌ Type de coffret inconnu !' };
  }

  if (coffret.cout > 0 && orUtilisateur < coffret.cout) {
    return { succes: false, message: `❌ Il te manque ${coffret.cout - orUtilisateur} gold pour ce coffret prestige !` };
  }

  const data = chargerCadeaux();
  const profil = obtenirProfilPilote(data, userId);
  const recompense = tirerRecompense(coffret);

  if (recompense.type === 'objet') {
    profil.inventaire[recompense.objet] = (profil.inventaire[recompense.objet] || 0) + 1;
  }

  sauvegarderCadeaux(data);

  return {
    succes: true,
    recompense,
    cout: coffret.cout,
    message: `\( {coffret.nom}\n\n \){recompense.message}`
  };
};

// Envoyer un cadeau prestige
const maseratiEnvoyerCadeau = (idEnvoyeur, idDestinataire, typeCadeau) => {
  if (idEnvoyeur === idDestinataire) {
    return { succes: false, message: '❌ Tu ne peux pas t’envoyer de cadeau à toi-même !' };
  }

  const cadeau = CADEAUX_PRESTIGE[typeCadeau.toLowerCase()];
  if (!cadeau) {
    const liste = Object.values(CADEAUX_PRESTIGE)
      .map(c => `\( {c.emoji} * \){c.nom}* (${c.cout}g)`)
      .join('\n');
    return {
      succes: false,
      message: `❌ Cadeau invalide !\n\n🎁 *Cadeaux prestige disponibles :*\n${liste}`
    };
  }

  const data = chargerCadeaux();
  const envoyeur = obtenirProfilPilote(data, idEnvoyeur);
  const destinataire = obtenirProfilPilote(data, idDestinataire);
  const aujourdhui = new Date().toDateString();

  if (envoyeur.derniereDateCadeau !== aujourdhui) {
    envoyeur.cadeauxAujourdhui = 0;
    envoyeur.derniereDateCadeau = aujourdhui;
  }

  if (envoyeur.cadeauxAujourdhui >= 5) {
    return { succes: false, message: '❌ Limite quotidienne atteinte : 5 cadeaux par jour max !' };
  }

  envoyeur.cadeauxEnvoyes++;
  envoyeur.cadeauxAujourdhui++;
  destinataire.cadeauxRecus++;
  destinataire.inventaire[cadeau.emoji] = (destinataire.inventaire[cadeau.emoji] || 0) + 1;

  // Historique prestige
  data.historique.push({
    de: idEnvoyeur,
    a: idDestinataire,
    cadeau: cadeau.id,
    date: new Date().toISOString()
  });

  if (data.historique.length > 1000) {
    data.historique = data.historique.slice(-1000);
  }

  sauvegarderCadeaux(data);

  return {
    succes: true,
    cadeau,
    message: `🎁 *CADEAU ENVOYÉ AVEC CLASSE !*\n\n` +
             `@${obtenirNomPilote(idEnvoyeur)} a offert ${cadeau.message} ${cadeau.emoji}\n` +
             `à @${obtenirNomPilote(idDestinataire)} !\n\n` +
             `💰 Coût : ${cadeau.cout} gold`,
    mentions: [idEnvoyeur, idDestinataire]
  };
};

// Inventaire prestige
const maseratiObtenirInventaire = (userId) => {
  const data = chargerCadeaux();
  const profil = obtenirProfilPilote(data, userId);

  const objets = Object.entries(profil.inventaire).filter(([_, qte]) => qte > 0);

  if (objets.length === 0) {
    return {
      succes: true,
      message: `🎒 *INVENTAIRE PRESTIGE*\n\n📭 Vide !\n\nOuvre des coffrets ou reçois des cadeaux pour remplir ton coffre.`
    };
  }

  let message = `🎒 *INVENTAIRE PRESTIGE*\n\n`;
  objets.forEach(([objet, qte]) => {
    message += `\( {objet} × \){qte}\n`;
  });

  message += `\n📊 *Stats circuit :*\n`;
  message += `🎁 Envoyés : ${profil.cadeauxEnvoyes}\n`;
  message += `📥 Reçus : ${profil.cadeauxRecus}`;

  return { succes: true, message };
};

// Liste cadeaux envoyables
const maseratiListerCadeaux = (prefixe = '/') => {
  let message = `🎁 *CADEAUX PRESTIGE DISPONIBLES*\n\n`;

  Object.values(CADEAUX_PRESTIGE).forEach(c => {
    message += `\( {c.emoji} * \){c.nom}* – ${c.cout} gold\n`;
  });

  message += `\n💡 Envoi : ${prefixe}cadeau @pilote <nom>\n`;
  message += `Exemple : ${prefixe}cadeau @pseudo rose`;

  return { succes: true, message };
};

// Liste coffrets disponibles
const maseratiListerCoffrets = (prefixe = '/') => {
  let message = `📦 *COFFRETS PRESTIGE DISPONIBLES*\n\n`;

  Object.values(COFFRETS_MASERATI).forEach(c => {
    const cout = c.cout === 0 ? 'Gratuit (1×/jour)' : `${c.cout} gold`;
    message += `${c.nom}\n   💰 ${cout}\n\n`;
  });

  message += `💡 Ouverture : ${prefixe}coffret <type>\n`;
  message += `Exemple : ${prefixe}coffret trident`;

  return { succes: true, message };
};

// Exports prestige
export {
  COFFRETS_MASERATI,
  CADEAUX_PRESTIGE,
  maseratiOuvrirCoffretQuotidien,
  maseratiOuvrirCoffret,
  maseratiEnvoyerCadeau,
  maseratiObtenirInventaire,
  maseratiListerCadeaux,
  maseratiListerCoffrets,
  obtenirProfilPilote,
  chargerCadeaux,
  sauvegarderCadeaux
};

export default {
  COFFRETS_MASERATI,
  CADEAUX_PRESTIGE,
  ouvrirCoffretQuotidien: maseratiOuvrirCoffretQuotidien,
  ouvrirCoffret: maseratiOuvrirCoffret,
  envoyerCadeau: maseratiEnvoyerCadeau,
  obtenirInventaire: maseratiObtenirInventaire,
  listerCadeaux: maseratiListerCadeaux,
  listerCoffrets: maseratiListerCoffrets
};
