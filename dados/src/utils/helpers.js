/**
 * Garage Central de la Base de Données Prestige - Édition Maserati
 * Gestion ultra-sécurisée des JSON, économie, RPG, groupes & pilotes – V12 boosté
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { assurerDossierExiste, assurerFichierJsonExiste, chargerJsonFichier, normaliser, obtenirNomPilote, estIdGroupe, estIdUtilisateur, estLidValide, estJidValide, construireIdUtilisateur, obtenirLidDeJidCache, idsCorrespondent, chargerJsonFichierSecurise, sauvegarderJsonFichierSecurise, validerUtilisateurLeveling, validerUtilisateurEconomie, validerDonneesGroupe, creerSauvegarde, normaliserParam, comparerParams, trouverCleIgnorantAccents, trouverDansTableauIgnorantAccents, resoudreAliasParam, matcherParam, ALIAS_PARAMS } from './helpers.js';
import {
  DOSSIER_DATABASE,
  DOSSIER_GROUPES,
  DOSSIER_UTILISATEURS,
  DOSSIER_PROPRIETAIRE,
  DOSSIER_PARTENARIATS,
  DOSSIER_TMP,
  FICHIER_LEVELING,
  FICHIER_AUTOREPONSES_CUSTOM,
  FICHIER_DIVULGACAO,
  FICHIER_DIVULGACAO_PROPRIETAIRE,
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
  FICHIER_ANTIFLOOD,
  FICHIER_ANTIPV,
  FICHIER_BLOCS_GLOBAUX,
  FICHIER_LIMITE_COMMANDES,
  FICHIER_LIMITES_UTILISATEURS_COMMANDES,
  FICHIER_ANTISPAM,
  FICHIER_ETAT_BOT,
  FICHIER_HORAIRES_AUTO,
  FICHIER_MODE_LITE,
  FICHIER_SOUS_PROPRIETAIRES,
  FICHIER_LOCATIONS,
  FICHIER_CODES_ACTIVATION,
  FICHIER_RELATIONS,
  FICHIER_COMMANDES_CUSTOM,
  FICHIER_PERSONNALISATION_GROUPE,
  FICHIER_AUDIO_MENU,
  FICHIER_LERMAIS_MENU,
  FICHIER_TICKETS_SUPPORT,
  FICHIER_CONFIG
} from './chemins.js';

// Assurance garages prestige – dossiers & fichiers prêts au démarrage
assurerDossierExiste(DOSSIER_GROUPES);
assurerDossierExiste(DOSSIER_UTILISATEURS);
assurerDossierExiste(DOSSIER_PROPRIETAIRE);
assurerDossierExiste(DOSSIER_PARTENARIATS);
assurerFichierJsonExiste(FICHIER_ANTIFLOOD);
assurerFichierJsonExiste(FICHIER_LIMITE_COMMANDES, {
  commandes: {},
  utilisateurs: {}
});
assurerFichierJsonExiste(FICHIER_LIMITES_UTILISATEURS_COMMANDES, {
  commandes: {},
  utilisateurs: {}
});
assurerFichierJsonExiste(FICHIER_ANTISPAM, {
  actif: false,
  limite: 5,
  intervalle: 10,
  tempsBlocage: 600,
  utilisateurs: {},
  blocs: {}
});
assurerFichierJsonExiste(FICHIER_ANTIPV, {
  mode: 'off',
  message: '🚫 Cette commande fonctionne seulement en groupes !'
});
assurerFichierJsonExiste(DOSSIER_PROPRIETAIRE + '/premium.json');
assurerFichierJsonExiste(DOSSIER_PROPRIETAIRE + '/bangp.json');
assurerFichierJsonExiste(FICHIER_BLOCS_GLOBAUX, {
  commandes: {},
  utilisateurs: {}
});
assurerFichierJsonExiste(FICHIER_ETAT_BOT, {
  statut: 'actif'
});
assurerFichierJsonExiste(FICHIER_MODE_LITE, {
  statut: false
});
assurerDossierExiste(DOSSIER_TMP);
assurerFichierJsonExiste(FICHIER_AUTOREPONSES_CUSTOM, {
  reponses: []
});
assurerFichierJsonExiste(FICHIER_COMMANDES_SANS_PREFIXE, {
  commandes: []
});
assurerFichierJsonExiste(FICHIER_ALIAS_COMMANDES, {
  alias: []
});
assurerFichierJsonExiste(FICHIER_COMMANDES_CUSTOM, {
  commandes: []
});
assurerFichierJsonExiste(FICHIER_BLACKLIST_GLOBALE, {
  utilisateurs: {},
  groupes: {}
});
assurerFichierJsonExiste(FICHIER_DIVULGACAO_PROPRIETAIRE, {
  groupes: [],
  message: '',
  planification: {
    actif: false,
    heure: null,
    dernierLancement: null
  },
  stats: {
    totalEnvoye: 0,
    dernierManuel: null,
    dernierAuto: null
  },
  creeLe: new Date().toISOString()
});
assurerFichierJsonExiste(FICHIER_DESIGN_MENU, {
  header: `╭┈⊰ 🏎️ 『 *{nomBot}* 』\n┊Salut, {nomUtilisateur} !\n╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯`,
  bordureSupMenu: "╭┈",
  bordureInf: "╰─┈┈┈┈┈◜🔱◞┈┈┈┈┈─╯",
  iconeTitreMenu: "🏆",
  iconeElementMenu: "• 🔹",
  iconeSeparateur: "🔱",
  bordureCentrale: "┊"
});
assurerFichierJsonExiste(FICHIER_ECONOMIE, {
  utilisateurs: {},
  boutique: {
    "picareta_bronze": { nom: "Pioche de Bronze", prix: 500, type: "outil", typeOutil: "pioche", niveau: "bronze", durabilite: 20, effet: { bonusMine: 0.1 } },
    "picareta_fer": { nom: "Pioche de Fer", prix: 1500, type: "outil", typeOutil: "pioche", niveau: "fer", durabilite: 60, effet: { bonusMine: 0.25 } },
    "picareta_diamant": { nom: "Pioche de Diamant", prix: 5000, type: "outil", typeOutil: "pioche", niveau: "diamant", durabilite: 150, effet: { bonusMine: 0.5 } },
    "kit_reparation": { nom: "Kit de Réparation", prix: 350, type: "consommable", effet: { reparation: 40 } },
    "coffre": { nom: "Coffre", prix: 1000, type: "stockage" }
  }
});
assurerFichierJsonExiste(FICHIER_MSGPREFIXE);
assurerFichierJsonExiste(FICHIER_MSGBOTACTIF);
assurerFichierJsonExiste(FICHIER_REACTIONS_CUSTOM, {
  reactions: []
});
assurerFichierJsonExiste(FICHIER_RAPPELS, {
  rappels: []
});
assurerFichierJsonExiste(FICHIER_CMD_NON_TROUVE, {
  actif: false,
  message: 'Commande non trouvée'
});
assurerFichierJsonExiste(FICHIER_ANTIFLOOD);
assurerFichierJsonExiste(FICHIER_ANTIPV);
assurerFichierJsonExiste(FICHIER_BLOCS_GLOBAUX, {
  commandes: {},
  utilisateurs: {}
});
assurerFichierJsonExiste(FICHIER_ETAT_BOT, {
  statut: 'actif'
});
assurerFichierJsonExiste(FICHIER_MODE_LITE, {
  statut: false
});
assurerFichierJsonExiste(FICHIER_SOUS_PROPRIETAIRES, {
  sousProprietaires: []
});
assurerFichierJsonExiste(FICHIER_LOCATIONS, {
  modeActif: false,
  locations: {}
});
assurerFichierJsonExiste(FICHIER_CODES_ACTIVATION, {
  codes: {}
});
assurerFichierJsonExiste(FICHIER_RELATIONS, {
  relations: {}
});
assurerFichierJsonExiste(FICHIER_COMMANDES_CUSTOM);
assurerFichierJsonExiste(FICHIER_PERSONNALISATION_GROUPE, {
  personnalisations: {}
});
assurerFichierJsonExiste(FICHIER_AUDIO_MENU);
assurerFichierJsonExiste(FICHIER_LERMAIS_MENU);
assurerFichierJsonExiste(FICHIER_TICKETS_SUPPORT, {
  tickets: {}
});
assurerFichierJsonExiste(FICHIER_CONFIG, {
  config: {}
});

// Fonctions prestige exportées
export {
  executerAutoTestBaseDonnees,
  chargerMsgPrefixe,
  sauvegarderMsgPrefixe,
  chargerMsgBotActif,
  sauvegarderMsgBotActif,
  chargerConfigCmdNonTrouvee,
  sauvegarderConfigCmdNonTrouvee,
  validerModeleMessage,
  formaterMessageAvecFallback,
  chargerReactionsCustom,
  sauvegarderReactionsCustom,
  chargerRappels,
  sauvegarderRappels,
  ajouterReactionCustom,
  supprimerReactionCustom,
  chargerDivulgacao,
  sauvegarderDivulgacao,
  chargerDivulgacaoProprietaire,
  sauvegarderDivulgacaoProprietaire,
  chargerSousProprietaires,
  sauvegarderSousProprietaires,
  estSousProprietaire,
  ajouterSousProprietaire,
  retirerSousProprietaire,
  obtenirSousProprietaires,
  chargerDonneesLocations,
  sauvegarderDonneesLocations,
  estModeLocationActif,
  definirModeLocation,
  obtenirStatutLocationGroupe,
  definirLocationGroupe,
  chargerCodesActivation,
  sauvegarderCodesActivation,
  genererCodeActivation,
  validerCodeActivation,
  utiliserCodeActivation,
  prolongerLocationGroupe,
  estModeLiteActif,
  chargerDonneesPartenariats,
  sauvegarderDonneesPartenariats,
  calculerXpProchainNiveau,
  obtenirBrevet,
  chargerEconomie,
  sauvegarderEconomie,
  obtenirUtilisateurEco,
  creerUtilisateurEcoDefaut,
  migrerEtValiderUtilisateurEco,
  migrerEtValiderPet,
  diagnostiquerBaseDonnees,
  analyserMontant,
  formater,
  tempsRestant,
  appliquerBonusBoutique,
  MULTI_NIVEAU_PIOCHE,
  ORDRE_NIVEAU_PIOCHE,
  ARTICLES_BOUTIQUE,
  obtenirPiocheActive,
  assurerDefautsEconomie,
  donnerMateriel,
  genererDefiQuotidien,
  assurerDefiUtilisateur,
  mettreAJourDefi,
  estDefiComplete,
  mettreAJourProgressionQuete,
  LISTE_COMPETENCES,
  assurerCompetencesUtilisateur,
  xpPourProchainCompetence,
  ajouterXpCompetence,
  obtenirBonusCompetence,
  horodatageFinSemaine,
  horodatageFinMois,
  genererDefiHebdomadaire,
  genererDefiMensuel,
  assurerDefisPeriodeUtilisateur,
  mettreAJourDefiPeriode,
  estPeriodeComplete,
  verifierMonteeNiveau,
  verifierDescenteNiveau,
  chargerAutoreponsesCustom,
  sauvegarderAutoreponsesCustom,
  chargerAutoreponsesGroupe,
  sauvegarderAutoreponsesGroupe,
  ajouterAutoreponse,
  supprimerAutoreponse,
  traiterAutoreponse,
  envoyerAutoreponse,
  chargerCommandesCustom,
  sauvegarderCommandesCustom,
  retirerCommandeCustom,
  trouverCommandeCustom,
  chargerCommandesSansPrefixe,
  sauvegarderCommandesSansPrefixe,
  chargerAliasCommandes,
  sauvegarderAliasCommandes,
  chargerBlacklistGlobale,
  sauvegarderBlacklistGlobale,
  ajouterBlacklistGlobale,
  retirerBlacklistGlobale,
  obtenirBlacklistGlobale,
  chargerDesignMenu,
  sauvegarderDesignMenu,
  obtenirDesignMenuAvecDefauts,
  chargerRelations,
  sauvegarderRelations,
  chargerTicketsSupport,
  sauvegarderTicketsSupport,
  definirModeSupport,
  trouverTicketSupportParId,
  creerTicketSupport,
  accepterTicketSupport,
  // Fonctions limites commandes
  chargerLimitesCommandes,
  sauvegarderLimitesCommandes,
  ajouterLimiteCommande,
  retirerLimiteCommande,
  obtenirLimitesCommandes,
  verifierLimiteCommande,
  analyserCadreTemporel,
  formaterTempsRestant,
  // Fonctions sécurité JSON
  chargerJsonFichierSecurise,
  sauvegarderJsonFichierSecurise,
  validerUtilisateurLeveling,
  validerUtilisateurEconomie,
  validerDonneesGroupe,
  creerSauvegarde,
  // Fonctions leveling sécurisées
  chargerLevelingSecurise,
  sauvegarderLevelingSecurise,
  obtenirUtilisateurLeveling,
  BREVETS_DEFAUT,
  STRUCTURE_LEVELING_DEFAUT,
  // Fonctions normalisation paramètres
  normaliserParam,
  comparerParams,
  trouverCleIgnorantAccents,
  trouverDansTableauIgnorantAccents,
  resoudreAliasParam,
  matcherParam,
  ALIAS_PARAMS,
  // Système personnalisation groupe
  chargerPersonnalisationGroupe,
  sauvegarderPersonnalisationGroupe,
  estPersonnalisationGroupeActive,
  definirPersonnalisationGroupeActive,
  obtenirPersonnalisationGroupe,
  definirNomGroupeCustom,
  definirPhotoGroupeCustom,
  retirerNomGroupeCustom,
  retirerPhotoGroupeCustom,
  // Système audio menu
  chargerAudioMenu,
  sauvegarderAudioMenu,
  estAudioMenuActif,
  obtenirCheminAudioMenu,
  definirAudioMenu,
  retirerAudioMenu,
  // Système lire plus menu
  chargerLerMaisMenu,
  estLerMaisMenuActif,
  definirLerMaisMenu,
  obtenirTexteLerMaisMenu
};