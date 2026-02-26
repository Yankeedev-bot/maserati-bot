/**
 * Chemins du Garage Prestige - Édition Maserati
 * Définitions absolues des répertoires et fichiers de la base – cartographie du paddock
 * Thème Maserati 🏎️👑✨🇨🇮 – Tous les garages et coffres-forts du bolide
 * Créé par yankee Hells 🙂
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Racines du circuit prestige
const DOSSIER_SRC = path.join(__dirname, '..');
const DOSSIER_RACINE = path.join(DOSSIER_SRC, '..');

// Détection sub-bot – ajustement chemin base prestige
const DOSSIER_BASE_DATABASE = process.env.CHEMIN_DATABASE || path.join(DOSSIER_RACINE, 'database');
const DOSSIER_DATABASE = DOSSIER_BASE_DATABASE;

// Garages principaux – zones du paddock
const DOSSIER_GROUPES = path.join(DOSSIER_DATABASE, 'groupes');
const DOSSIER_PILOTES = path.join(DOSSIER_DATABASE, 'pilotes');
const DOSSIER_PROPRIETAIRE = path.join(DOSSIER_DATABASE, 'proprietaire');
const DOSSIER_PARTENARIATS = path.join(DOSSIER_DATABASE, 'partenariats');
const DOSSIER_TMP = path.join(DOSSIER_DATABASE, 'tmp');

// Coffres-forts & fichiers critiques – coffres blindés MC20
const FICHIER_LEVELING = path.join(DOSSIER_DATABASE, 'leveling.json');
const FICHIER_AUTOREPONSES_CUSTOM = path.join(DOSSIER_DATABASE, 'autoreponses-custom.json');
const FICHIER_DIVULGATION = path.join(DOSSIER_PROPRIETAIRE, 'divulgation.json');
const FICHIER_DIVULGATION_PROPRIETAIRE = path.join(DOSSIER_PROPRIETAIRE, 'divulgation-proprietaire.json');
const FICHIER_COMMANDES_SANS_PREFIXE = path.join(DOSSIER_DATABASE, 'commandes-sans-prefixe.json');
const FICHIER_ALIAS_COMMANDES = path.join(DOSSIER_DATABASE, 'alias-commandes.json');
const FICHIER_BLACKLIST_GLOBALE = path.join(DOSSIER_PROPRIETAIRE, 'blacklist-globale.json');
const FICHIER_DESIGN_MENU = path.join(DOSSIER_PROPRIETAIRE, 'design-menu.json');
const FICHIER_ECONOMIE = path.join(DOSSIER_DATABASE, 'economie.json');
const FICHIER_MSGPREFIXE = path.join(DOSSIER_PROPRIETAIRE, 'msgprefixe.json');
const FICHIER_MSGBOTACTIF = path.join(DOSSIER_PROPRIETAIRE, 'msgbotactif.json');
const FICHIER_REACTIONS_CUSTOM = path.join(DOSSIER_DATABASE, 'reactions-custom.json');
const FICHIER_RAPPELS = path.join(DOSSIER_DATABASE, 'rappels.json');
const FICHIER_CMD_NON_TROUVE = path.join(DOSSIER_PROPRIETAIRE, 'cmd-non-trouve.json');
const FICHIER_COMMANDES_CUSTOM = path.join(DOSSIER_PROPRIETAIRE, 'commandes-custom.json');
const FICHIER_ANTIFLOOD = path.join(DOSSIER_DATABASE, 'antiflood.json');
const FICHIER_ANTIPV = path.join(DOSSIER_DATABASE, 'antipv.json');
const FICHIER_BLOCS_GLOBAUX = path.join(DOSSIER_DATABASE, 'blocs-globaux.json');
const FICHIER_LIMITE_COMMANDES = path.join(DOSSIER_DATABASE, 'limite-commandes.json');
const FICHIER_LIMITES_UTILISATEURS_COMMANDES = path.join(DOSSIER_DATABASE, 'limites-utilisateurs-commandes.json');
const FICHIER_ANTISPAM = path.join(DOSSIER_DATABASE, 'antispam.json');
const FICHIER_ETAT_BOT = path.join(DOSSIER_DATABASE, 'etat-bot.json');
const FICHIER_HORAIRES_AUTO = path.join(DOSSIER_DATABASE, 'horaires-auto.json');
const FICHIER_AUTO_MESSAGERS = path.join(DOSSIER_DATABASE, 'auto-messages.json');
const FICHIER_MODE_LITE = path.join(DOSSIER_DATABASE, 'mode-lite.json');
const FICHIER_CACHE_JID_LID = path.join(DOSSIER_DATABASE, 'cache-jid-lid.json');
const FICHIER_SOUS_PROPRIETAIRES = path.join(DOSSIER_PROPRIETAIRE, 'sous-proprietaires.json');
const FICHIER_LOCATIONS = path.join(DOSSIER_PROPRIETAIRE, 'locations.json');
const FICHIER_CODES_ACTIVATION = path.join(DOSSIER_PROPRIETAIRE, 'codes-activation.json');
const FICHIER_RELATIONS = path.join(DOSSIER_DATABASE, 'relations.json');
const FICHIER_LIMITE_MENTION_MASSIVE = path.join(DOSSIER_DATABASE, 'limite-mention-massive.json');
const FICHIER_CONFIG_MENTION_MASSIVE = path.join(DOSSIER_PROPRIETAIRE, 'config-mention-massive.json');
const FICHIER_PERSONNALISATION_GROUPE = path.join(DOSSIER_PROPRIETAIRE, 'personnalisation-groupe.json');
const FICHIER_AUDIO_MENU = path.join(DOSSIER_PROPRIETAIRE, 'audio-menu.json');
const FICHIER_LERMAIS_MENU = path.join(DOSSIER_PROPRIETAIRE, 'ler-plus-menu.json');
const FICHIER_TICKETS_SUPPORT = path.join(DOSSIER_DATABASE, 'tickets-support.json');

// Config principale – clé de contact du bolide
const FICHIER_CONFIG = process.env.CHEMIN_CONFIG || path.join(DOSSIER_SRC, 'config.json');

// Package.json – plaque d’identité du bolide
const CHEMIN_PACKAGE_JSON = path.join(DOSSIER_RACINE, '..', 'package.json');

export {
  DOSSIER_RACINE,
  DOSSIER_SRC,
  DOSSIER_DATABASE,
  DOSSIER_GROUPES,
  DOSSIER_PILOTES,
  DOSSIER_PROPRIETAIRE,
  DOSSIER_PARTENARIATS,
  DOSSIER_TMP,
  FICHIER_LEVELING,
  FICHIER_AUTOREPONSES_CUSTOM,
  FICHIER_DIVULGATION,
  FICHIER_DIVULGATION_PROPRIETAIRE,
  FICHIER_COMMANDES_SANS_PREFIXE,
  FICHIER_ALIAS_COMMANDES,
  FICHIER_BLACKLIST_GLOBALE,
  FICHIER_DESIGN_MENU,
  FICHIER_ECONOMIE,
  FICHIER_MSGPREFIXE,
  FICHIER_MSGBOTACTIF,
  FICHIER_REACTIONS_CUSTOM,
  FICHIER_RAPPELS,
  FICHIER_CMD_NON_TROUVE,
  FICHIER_COMMANDES_CUSTOM,
  FICHIER_ANTIFLOOD,
  FICHIER_ANTIPV,
  FICHIER_BLOCS_GLOBAUX,
  FICHIER_LIMITE_COMMANDES,
  FICHIER_LIMITES_UTILISATEURS_COMMANDES,
  FICHIER_ANTISPAM,
  FICHIER_ETAT_BOT,
  FICHIER_HORAIRES_AUTO,
  FICHIER_AUTO_MESSAGERS,
  FICHIER_MODE_LITE,
  FICHIER_CACHE_JID_LID,
  FICHIER_SOUS_PROPRIETAIRES,
  FICHIER_LOCATIONS,
  FICHIER_CODES_ACTIVATION,
  FICHIER_RELATIONS,
  FICHIER_LIMITE_MENTION_MASSIVE,
  FICHIER_CONFIG_MENTION_MASSIVE,
  FICHIER_PERSONNALISATION_GROUPE,
  FICHIER_AUDIO_MENU,
  FICHIER_LERMAIS_MENU,
  FICHIER_TICKETS_SUPPORT,
  FICHIER_CONFIG,
  CHEMIN_PACKAGE_JSON
};