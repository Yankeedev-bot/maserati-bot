import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin du fichier des privilèges Maserati (commandes exclusives)
const PRIVILEGES_FILE = path.join(__dirname, '../../database/maserati/privileges.json');

/**
 * Vérifie / crée le fichier des privilèges Maserati
 */
function verifierFichierPrivileges() {
  const dossier = path.dirname(PRIVILEGES_FILE);

  if (!fs.existsSync(dossier)) {
    fs.mkdirSync(dossier, { recursive: true });
  }

  if (!fs.existsSync(PRIVILEGES_FILE)) {
    const structureInitiale = {
      privileges: [],
      categories: {
        turbo: '🚀 Turbo / Vitesse',
        luxe: '👑 Luxe & Prestige',
        media: '📥 Téléchargements Premium',
        style: '✨ Personnalisation & Style',
        intel: '🧠 Intelligence Avancée',
        garage: '🛠️ Gestion Garage',
        info: 'ℹ️ Informations VIP',
        exclusif: '🔥 Exclusivités'
      }
    };
    fs.writeFileSync(PRIVILEGES_FILE, JSON.stringify(structureInitiale, null, 2));
  }
}

/**
 * Charge la liste des privilèges Maserati
 */
function chargerPrivileges() {
  verifierFichierPrivileges();
  try {
    const contenu = fs.readFileSync(PRIVILEGES_FILE, 'utf8');
    return JSON.parse(contenu);
  } catch (err) {
    console.error('❌ Erreur chargement privilèges Maserati:', err);
    return { privileges: [], categories: {} };
  }
}

/**
 * Sauvegarde les privilèges Maserati
 */
function sauvegarderPrivileges(data) {
  verifierFichierPrivileges();
  try {
    fs.writeFileSync(PRIVILEGES_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error('❌ Erreur sauvegarde privilèges:', err);
    return false;
  }
}

/**
 * Ajoute un nouveau privilège exclusif Maserati
 * @param {string} commande - Nom de la commande (sans préfixe)
 * @param {string} description - Description luxe
 * @param {string} categorie - Catégorie (turbo, luxe, etc.)
 * @param {string} exemple - Exemple d’utilisation
 */
function ajouterPrivilege(commande, description, categorie = 'exclusif', exemple = '') {
  const data = chargerPrivileges();

  const cmdNormalisee = commande.toLowerCase().trim();

  // Vérification doublon
  if (data.privileges.some(p => p.commande === cmdNormalisee)) {
    return {
      succes: false,
      message: `❌ Le privilège "${cmdNormalisee}" existe déjà dans la collection Maserati !`
    };
  }

  // Catégorie valide ?
  if (!data.categories[categorie]) {
    categorie = 'exclusif';
  }

  const nouveauPrivilege = {
    commande: cmdNormalisee,
    description: description.trim(),
    categorie,
    exemple: exemple.trim() || cmdNormalisee,
    ajouteLe: new Date().toISOString(),
    actif: true
  };

  data.privileges.push(nouveauPrivilege);

  if (sauvegarderPrivileges(data)) {
    return {
      succes: true,
      message: `🏆 Privilège exclusif **${cmdNormalisee}** ajouté au garage Maserati !`,
      privilege: nouveauPrivilege
    };
  }

  return {
    succes: false,
    message: '❌ Échec lors de l’enregistrement du privilège.'
  };
}

/**
 * Retire un privilège de la collection
 */
function retirerPrivilege(commande) {
  const data = chargerPrivileges();
  const cmdNormalisee = commande.toLowerCase().trim();

  const index = data.privileges.findIndex(p => p.commande === cmdNormalisee);

  if (index === -1) {
    return {
      succes: false,
      message: `❌ Privilège "${cmdNormalisee}" introuvable dans la flotte exclusive.`
    };
  }

  const retire = data.privileges[index];
  data.privileges.splice(index, 1);

  if (sauvegarderPrivileges(data)) {
    return {
      succes: true,
      message: `🗑️ Privilège **${cmdNormalisee}** retiré de la collection.`,
      privilege: retire
    };
  }

  return {
    succes: false,
    message: '❌ Échec suppression privilège.'
  };
}

/**
 * Vérifie si une commande est un privilège exclusif actif
 */
function estPrivilegeExclusif(commande) {
  const data = chargerPrivileges();
  const cmdNormalisee = commande.toLowerCase().trim();
  return data.privileges.some(p => p.commande === cmdNormalisee && p.actif);
}

/**
 * Liste les privilèges (tous ou par catégorie)
 */
function listerPrivileges(categorie = null) {
  const data = chargerPrivileges();

  const filtres = data.privileges.filter(p => p.actif);

  if (categorie) {
    return filtres.filter(p => p.categorie === categorie);
  }

  return filtres;
}

/**
 * Détails d’un privilège spécifique
 */
function detailsPrivilege(commande) {
  const data = chargerPrivileges();
  const cmdNormalisee = commande.toLowerCase().trim();
  return data.privileges.find(p => p.commande === cmdNormalisee);
}

/**
 * Regroupe les privilèges par catégorie (pour menu élégant)
 */
function regrouperParCategorie() {
  const data = chargerPrivileges();
  const groupes = {};

  // Initialisation des catégories
  for (const [cle, label] of Object.entries(data.categories)) {
    groupes[cle] = { label, privileges: [] };
  }

  // Remplissage
  data.privileges.forEach(p => {
    if (p.actif && groupes[p.categorie]) {
      groupes[p.categorie].privileges.push(p);
    }
  });

  // Nettoyage catégories vides
  Object.keys(groupes).forEach(cle => {
    if (groupes[cle].privileges.length === 0) {
      delete groupes[cle];
    }
  });

  return groupes;
}

/**
 * Active / désactive un privilège exclusif
 */
function basculerPrivilege(commande, actif) {
  const data = chargerPrivileges();
  const cmdNormalisee = commande.toLowerCase().trim();

  const index = data.privileges.findIndex(p => p.commande === cmdNormalisee);

  if (index === -1) {
    return {
      succes: false,
      message: `❌ Privilège "${cmdNormalisee}" non trouvé.`
    };
  }

  data.privileges[index].actif = actif;

  if (sauvegarderPrivileges(data)) {
    const etat = actif ? 'activé' : 'désactivé';
    return {
      succes: true,
      message: `🔧 Privilège **${cmdNormalisee}** ${etat} avec succès !`
    };
  }

  return {
    succes: false,
    message: '❌ Échec mise à jour statut privilège.'
  };
}

/**
 * Liste des catégories disponibles
 */
function obtenirCategories() {
  return chargerPrivileges().categories;
}

/**
 * Ajoute une nouvelle catégorie de privilèges
 */
function ajouterCategorie(cle, label) {
  const data = chargerPrivileges();

  if (data.categories[cle]) {
    return {
      succes: false,
      message: `❌ La catégorie "${cle}" existe déjà.`
    };
  }

  data.categories[cle] = label;

  if (sauvegarderPrivileges(data)) {
    return {
      succes: true,
      message: `✅ Catégorie exclusive **${label}** ajoutée !`
    };
  }

  return {
    succes: false,
    message: '❌ Échec ajout catégorie.'
  };
}

/**
 * Statistiques de la collection privilèges
 */
function statsPrivileges() {
  const data = chargerPrivileges();
  const groupes = regrouperParCategorie();

  return {
    total: data.privileges.length,
    actifs: data.privileges.filter(p => p.actif).length,
    inactifs: data.privileges.filter(p => !p.actif).length,
    categories: Object.keys(groupes).length,
    parCategorie: Object.entries(groupes).map(([_, g]) => ({
      categorie: g.label,
      nombre: g.privileges.length
    }))
  };
}

export {
  ajouterPrivilege,
  retirerPrivilege,
  estPrivilegeExclusif,
  listerPrivileges,
  detailsPrivilege,
  regrouperParCategorie,
  basculerPrivilege,
  obtenirCategories,
  ajouterCategorie,
  statsPrivileges,
  chargerPrivileges,
  sauvegarderPrivileges
};

// Développé par yankee Hells 🙂 🏎️👑✨🇨🇮