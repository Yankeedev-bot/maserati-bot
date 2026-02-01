/**
 * Gestionnaire de Relations Prestige - Édition Maserati
 * Brincadeira → Namoro → Casamento + Système de trahison luxe
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import { loadRelationships, saveRelationships } from '../../utils/database.js';
import { getUserName, normalizar } from '../../utils/helpers.js';

// ── CONFIGURATION PRESTIGE ──
const CONFIG_RELATIONS_MASERATI = {
  DELAI_DEMANDE_MS: 5 * 60 * 1000,           // 5 min pour répondre – pas de pilote qui traîne
  DELAI_MINIMUM_NAMORO_AVANT_MARIAGE_MS: 48 * 60 * 60 * 1000, // 48h minimum namoro → mariage
  ORDRE_STATUTS: {
    brincadeira: 1,
    namoro: 2,
    casamento: 3
  }
};

// ── CONFIG TYPES RELATIONS – NIVEAUX PRESTIGE ──
const CONFIG_TYPES_RELATIONS = {
  brincadeira: {
    label: 'Brincadeira',
    emoji: '🎈',
    inviteLabel: 'une petite aventure',
    successHeadline: '🎈 Défi accepté !',
    successText: 'maintenant en mode flirt sur le circuit !'
  },
  namoro: {
    label: 'Namoro',
    emoji: '💞',
    inviteLabel: 'un namoro sérieux',
    successHeadline: '💞 Namoro confirmé !',
    successText: 'couple officiel – trident allumé !'
  },
  casamento: {
    label: 'Casamento',
    emoji: '💍',
    inviteLabel: 'un mariage prestige',
    successHeadline: '💍 Union sacrée !',
    successText: 'mariage célébré – alliance bleu nuit activée !'
  }
};

class GestionnaireRelationsMaserati {
  constructor() {
    this.demandesEnAttente = new Map();         // groupId → demande relation
    this.trahisonsEnAttente = new Map();        // key → demande trahison
    const timer = setInterval(() => this._nettoyerPaddock(), 60 * 1000);
    if (typeof timer.unref === 'function') timer.unref();
  }

  _normaliserId(id) {
    return typeof id === 'string' ? id.trim().toLowerCase() : '';
  }

  _normaliserType(type) {
    const normalise = normalizar(type || '');
    return ['brincadeira', 'namoro', 'casamento'].includes(normalise) ? normalise : null;
  }

  _obtenirClePaire(a, b) {
    const premier = this._normaliserId(a);
    const second = this._normaliserId(b);
    if (!premier || !second || premier === second) return null;
    return [premier, second].sort().join('::');
  }

  _chargerDonnees() {
    const data = loadRelationships();
    if (!data || typeof data !== 'object') {
      return { paires: {}, archives: [] };
    }
    if (!data.paires || typeof data.paires !== 'object') data.paires = {};
    if (!Array.isArray(data.archives)) data.archives = [];
    return data;
  }

  _sauvegarderDonnees(data) {
    return saveRelationships(data);
  }

  _formaterDuree(ms) {
    if (!ms || ms <= 0) return '0s';
    const totalSecondes = Math.floor(ms / 1000);
    const jours = Math.floor(totalSecondes / 86400);
    const heures = Math.floor((totalSecondes % 86400) / 3600);
    const minutes = Math.floor((totalSecondes % 3600) / 60);
    const secondes = totalSecondes % 60;
    const parties = [];
    if (jours) parties.push(`${jours}j`);
    if (heures) parties.push(`${heures}h`);
    if (minutes) parties.push(`${minutes}m`);
    if (!parties.length) parties.push(`${secondes}s`);
    return parties.join(' ');
  }

  _formaterDate(valeurDate) {
    const date = new Date(valeurDate);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleString('fr-FR', { timeZone: 'Africa/Abidjan' });
  }

  // ── DEMANDE RELATION ──

  creerDemande(type, idGroupe, idDemandeur, idCible, contexte = {}) {
    const typeNormalise = this._normaliserType(type);
    if (!typeNormalise) {
      return { succes: false, message: '❌ Type de demande invalide (brincadeira, namoro, casamento).' };
    }

    const demandeur = this._normaliserId(idDemandeur);
    const cible = this._normaliserId(idCible);
    if (!demandeur || !cible) {
      return { succes: false, message: '❌ Participants invalides.' };
    }
    if (demandeur === cible) {
      return { succes: false, message: '❌ Tu ne peux pas faire une demande à toi-même !' };
    }

    if (this.demandesEnAttente.has(idGroupe)) {
      const enAttente = this.demandesEnAttente.get(idGroupe);
      const config = CONFIG_TYPES_RELATIONS[enAttente.type];
      return {
        succes: false,
        message: `❌ Une demande de ${config?.label?.toLowerCase() || 'relation'} est déjà en attente dans ce groupe.`
      };
    }

    // Vérification : demandeur déjà en couple ?
    const paireDemandeur = this.obtenirPaireActivePourPilote(idDemandeur);
    if (paireDemandeur && this._normaliserId(paireDemandeur.partenaireId) !== cible) {
      const nomPartenaire = getUserName(paireDemandeur.partenaireId);
      const configActuel = CONFIG_TYPES_RELATIONS[paireDemandeur.paire.status];
      return {
        succes: false,
        message: `❌ Tu es déjà en \( {configActuel.inviteLabel} avec @ \){nomPartenaire}.\n` +
                 `Termine cette relation avant d’en commencer une nouvelle !`,
        mentions: [paireDemandeur.partenaireId]
      };
    }

    // Vérification : cible déjà en couple ?
    const paireCible = this.obtenirPaireActivePourPilote(idCible);
    if (paireCible && this._normaliserId(paireCible.partenaireId) !== demandeur) {
      const nomPartenaire = getUserName(paireCible.partenaireId);
      const nomCible = getUserName(idCible);
      const configActuel = CONFIG_TYPES_RELATIONS[paireCible.paire.status];
      return {
        succes: false,
        message: `❌ @${nomCible} est déjà en \( {configActuel.inviteLabel} avec @ \){nomPartenaire} !`,
        mentions: [idCible, paireCible.partenaireId]
      };
    }

    const clePaire = this._obtenirClePaire(idDemandeur, idCible);
    if (!clePaire) {
      return { succes: false, message: '❌ Impossible d’enregistrer la demande.' };
    }

    const data = this._chargerDonnees();
    const paireExistante = data.paires[clePaire];
    const validation = this._validerNouvelleDemande(typeNormalise, paireExistante);
    if (!validation.autorise) {
      return { succes: false, message: validation.message };
    }

    const maintenant = Date.now();
    const demande = {
      id: `\( {idGroupe}: \){maintenant}`,
      type: typeNormalise,
      idGroupe,
      demandeur,
      cible,
      demandeurRaw: idDemandeur,
      cibleRaw: idCible,
      creeLe: maintenant,
      expireLe: maintenant + CONFIG_RELATIONS_MASERATI.DELAI_DEMANDE_MS,
      contexte
    };

    this.demandesEnAttente.set(idGroupe, demande);

    return {
      succes: true,
      message: this._construireMessageInvitation(demande),
      mentions: [idDemandeur, idCible],
      demande
    };
  }

  _validerNouvelleDemande(type, paire) {
    if (!paire) {
      if (type === 'casamento') {
        return {
          autorise: false,
          message: '❌ Vous devez être en namoro pour pouvoir vous marier.'
        };
      }
      return { autorise: true };
    }

    const statutActuel = paire.status;

    if (type === 'brincadeira') {
      if (statutActuel === 'brincadeira') {
        const depuis = paire.stages?.brincadeira?.since;
        const dateTexte = depuis ? this._formaterDate(depuis) : 'récemment';
        return {
          autorise: false,
          message: `❌ Vous êtes déjà en brincadeira depuis ${dateTexte}.`
        };
      }
      if (statutActuel === 'namoro' || statutActuel === 'casamento') {
        return {
          autorise: false,
          message: `❌ Vous êtes déjà en ${CONFIG_TYPES_RELATIONS[statutActuel].label}. Termine d’abord.`
        };
      }
      return { autorise: true };
    }

    if (type === 'namoro') {
      if (statutActuel === 'namoro') {
        const depuis = paire.stages?.namoro?.since;
        const dateTexte = depuis ? this._formaterDate(depuis) : 'récemment';
        return {
          autorise: false,
          message: `❌ Vous êtes déjà en namoro depuis ${dateTexte}.`
        };
      }
      if (statutActuel === 'casamento') {
        return { autorise: false, message: '❌ Vous êtes déjà mariés !' };
      }
      return { autorise: true }; // Peut évoluer de brincadeira → namoro
    }

    if (type === 'casamento') {
      if (statutActuel === 'casamento') {
        const depuis = paire.stages?.casamento?.since;
        const dateTexte = depuis ? this._formaterDate(depuis) : 'récemment';
        return {
          autorise: false,
          message: `❌ Vous êtes déjà mariés depuis ${dateTexte}.`
        };
      }

      if (statutActuel !== 'namoro') {
        return {
          autorise: false,
          message: '❌ Vous devez être en namoro pour pouvoir vous marier.'
        };
      }

      const depuis = paire.stages?.namoro?.since;
      if (!depuis) {
        return {
          autorise: false,
          message: '❌ Impossible de valider la date du namoro. Relance le namoro avant.'
        };
      }

      const depuisTemps = Date.parse(depuis);
      if (Number.isNaN(depuisTemps)) {
        return {
          autorise: false,
          message: '❌ Date du namoro invalide. Relance le namoro.'
        };
      }

      const ecoule = Date.now() - depuisTemps;
      if (ecoule < CONFIG_RELATIONS_MASERATI.DELAI_MINIMUM_NAMORO_AVANT_MARIAGE_MS) {
        const restant = CONFIG_RELATIONS_MASERATI.DELAI_MINIMUM_NAMORO_AVANT_MARIAGE_MS - ecoule;
        return {
          autorise: false,
          message: `⏳ Il reste ${this._formaterDuree(restant)} avant de pouvoir se marier.`
        };
      }

      return { autorise: true };
    }

    return { autorise: false, message: '❌ Type de demande invalide.' };
  }

  _construireMessageInvitation(demande) {
    const config = CONFIG_TYPES_RELATIONS[demande.type];
    const nomDemandeur = getUserName(demande.demandeurRaw);
    const nomCible = getUserName(demande.cibleRaw);
    return `${config.emoji} *DEMANDE DE ${config.label.toUpperCase()} PRESTIGE*\n\n` +
           `@\( {nomDemandeur} invite @ \){nomCible} à ${config.inviteLabel} !\n\n` +
           `✅ Accepter : "oui" / "sim" / "s"\n` +
           `❌ Refuser : "non" / "não" / "n"\n\n` +
           `⏳ Expire dans ${this._formaterDuree(CONFIG_RELATIONS_MASERATI.DELAI_DEMANDE_MS)}`;
  }

  traiterReponse(idGroupe, idRepondant, reponseBrute) {
    const enAttente = this.demandesEnAttente.get(idGroupe);
    if (!enAttente) return null;

    const repondant = this._normaliserId(idRepondant);
    if (repondant !== enAttente.cible) {
      return { succes: false, raison: 'pas_la_cible' };
    }

    const decision = this._normaliserDecision(reponseBrute);
    if (!decision) {
      return {
        succes: false,
        raison: 'reponse_invalide',
        message: '❌ Réponse invalide. Dis simplement "oui" ou "non".'
      };
    }

    this.demandesEnAttente.delete(idGroupe);

    if (decision === 'refus') {
      const config = CONFIG_TYPES_RELATIONS[enAttente.type];
      const nomDemandeur = getUserName(enAttente.demandeurRaw);
      const nomCible = getUserName(enAttente.cibleRaw);
      return {
        succes: true,
        message: `${config.emoji} Demande de ${config.label.toLowerCase()} refusée.\n\n` +
                 `@\( {nomCible} n’a pas accepté l’invitation de @ \){nomDemandeur}.`,
        mentions: [enAttente.demandeurRaw, enAttente.cibleRaw]
      };
    }

    return this._appliquerDemande(enAttente);
  }

  _normaliserDecision(reponseBrute) {
    const normalise = normalizar((reponseBrute || '').trim());
    if (!normalise) return null;
    const premierMot = normalise.split(/\s+/)[0];
    if (['s', 'sim', 'oui', 'o', 'yes', 'y', 'claro'].includes(premierMot)) {
      return 'accepte';
    }
    if (['n', 'nao', 'não', 'non', 'no', 'recuso', 'rejeito'].includes(premierMot)) {
      return 'refus';
    }
    return null;
  }

  _appliquerDemande(demande) {
    const data = this._chargerDonnees();
    const cle = this._obtenirClePaire(demande.demandeurRaw, demande.cibleRaw);
    if (!cle) {
      return {
        succes: false,
        message: '❌ Impossible d’enregistrer la relation – erreur technique.'
      };
    }

    const maintenant = Date.now();
    let paire = data.paires[cle];
    if (!paire || typeof paire !== 'object') {
      paire = {
        pilotes: [this._normaliserId(demande.demandeurRaw), this._normaliserId(demande.cibleRaw)],
        statut: null,
        etapes: {},
        historique: [],
        creeLe: new Date(maintenant).toISOString()
      };
    }

    if (!Array.isArray(paire.historique)) paire.historique = [];
    if (!paire.etapes || typeof paire.etapes !== 'object') paire.etapes = {};

    const entreeEtape = {
      depuis: new Date(maintenant).toISOString(),
      demandePar: demande.demandeurRaw,
      acceptePar: demande.cibleRaw,
      idGroupe: demande.idGroupe,
      demandeLe: new Date(demande.creeLe).toISOString(),
      accepteLe: new Date(maintenant).toISOString()
    };

    paire.historique.push({
      type: demande.type,
      demandePar: demande.demandeurRaw,
      acceptePar: demande.cibleRaw,
      demandeLe: entreeEtape.demandeLe,
      accepteLe: entreeEtape.accepteLe
    });

    // Mise à jour statut et étapes
    if (demande.type === 'brincadeira') {
      paire.statut = 'brincadeira';
      if (!paire.etapes.brincadeira) paire.etapes.brincadeira = entreeEtape;
      if (!paire.creeLe) paire.creeLe = entreeEtape.depuis;
    } else if (demande.type === 'namoro') {
      paire.statut = 'namoro';
      paire.etapes.namoro = entreeEtape;
      if (!paire.etapes.brincadeira) paire.etapes.brincadeira = { ...entreeEtape };
    } else if (demande.type === 'casamento') {
      paire.statut = 'casamento';
      paire.etapes.casamento = entreeEtape;
      if (!paire.etapes.namoro) paire.etapes.namoro = { ...entreeEtape };
      if (!paire.etapes.brincadeira) paire.etapes.brincadeira = { ...entreeEtape };
    }

    paire.pilotes = [this._normaliserId(demande.demandeurRaw), this._normaliserId(demande.cibleRaw)];
    paire.modifieLe = entreeEtape.depuis;
    paire.termineLe = null;
    paire.terminePar = null;
    paire.dernierStatut = paire.statut;

    data.paires[cle] = paire;
    this._sauvegarderDonnees(data);

    return {
      succes: true,
      message: this._construireMessageAcceptation(demande, paire),
      mentions: [demande.demandeurRaw, demande.cibleRaw],
      paire
    };
  }

  _construireMessageAcceptation(demande, paire) {
    const config = CONFIG_TYPES_RELATIONS[demande.type];
    const nomDemandeur = getUserName(demande.demandeurRaw);
    const nomCible = getUserName(demande.cibleRaw);
    const etapeInfo = paire.etapes?.[demande.type];
    const depuisTexte = etapeInfo?.depuis ? this._formaterDate(etapeInfo.depuis) : null;

    const lignes = [
      config.successHeadline,
      '',
      `\( {config.emoji} @ \){nomDemandeur} & @${nomCible} ${config.successText}`
    ];

    if (depuisTexte) lignes.push(`🗓️ Début : ${depuisTexte}`);

    // Temps namoro avant mariage
    if (demande.type === 'casamento' && paire.etapes?.namoro?.depuis) {
      const namoroDepuis = Date.parse(paire.etapes.namoro.depuis);
      const mariageDepuis = Date.parse(etapeInfo.depuis);
      if (!Number.isNaN(namoroDepuis) && !Number.isNaN(mariageDepuis)) {
        const dureeNamoro = mariageDepuis - namoroDepuis;
        lignes.push(`💞 Temps de namoro avant mariage : ${this._formaterDuree(dureeNamoro)}`);
      }
    }

    // Temps brincadeira avant namoro
    if (demande.type === 'namoro' && paire.etapes?.brincadeira?.depuis) {
      const brincadeiraDepuis = Date.parse(paire.etapes.brincadeira.depuis);
      const namoroDepuis = Date.parse(etapeInfo.depuis);
      if (!Number.isNaN(brincadeiraDepuis) && !Number.isNaN(namoroDepuis) && brincadeiraDepuis !== namoroDepuis) {
        const dureeBrincadeira = namoroDepuis - brincadeiraDepuis;
        lignes.push(`🎈 Temps de brincadeira avant namoro : ${this._formaterDuree(dureeBrincadeira)}`);
      }
    }

    return lignes.join('\n');
  }

  // ── TRAHISON – CIRCUIT DES TRAHISONS ──

  creerDemandeTrahison(idPilote, idCible, idGroupe, prefixe = '/') {
    const paireActive = this.obtenirPaireActivePourPilote(idPilote);

    if (!paireActive) {
      return {
        succes: false,
        message: '❌ Tu n’es pas en relation active – impossible de trahir !'
      };
    }

    const idPartenaire = paireActive.partenaireId;

    if (this._normaliserId(idCible) === this._normaliserId(idPartenaire)) {
      return {
        succes: false,
        message: '❌ Tu ne peux pas trahir ton partenaire avec lui-même !'
      };
    }

    if (this._normaliserId(idCible) === this._normaliserId(idPilote)) {
      return { succes: false, message: '❌ Tu ne peux pas te trahir toi-même !' };
    }

    // Vérif pas de trahison en attente dans le groupe
    for (const trahison of this.trahisonsEnAttente.values()) {
      if (trahison.idGroupe === idGroupe) {
        return {
          succes: false,
          message: '⏳ Une proposition de trahison est déjà en attente dans ce groupe.'
        };
      }
    }

    const maintenant = Date.now();
    const cleTrahison = `\( {idGroupe}: \){idPilote}:\( {idCible}: \){maintenant}`;

    const demandeTrahison = {
      idPilote,
      idCible,
      idPartenaire,
      idGroupe,
      clePaire: paireActive.key,
      creeLe: maintenant,
      expireLe: maintenant + CONFIG_RELATIONS_MASERATI.DELAI_DEMANDE_MS
    };

    this.trahisonsEnAttente.set(cleTrahison, demandeTrahison);

    const nomTraitre = getUserName(idPilote);
    const nomCible = getUserName(idCible);
    const nomVictime = getUserName(idPartenaire);

    return {
      succes: true,
      message: `😈 *PROPOSITION DE TRAHISON – CIRCUIT DES OMBRES*\n\n` +
               `@\( {nomTraitre} veut trahir @ \){nomVictime} avec toi, @${nomCible} !\n\n` +
               `✅ Accepter : "oui" / "sim" / "s"\n` +
               `❌ Refuser : "non" / "não" / "n"\n\n` +
               `⏳ Expire dans ${this._formaterDuree(CONFIG_RELATIONS_MASERATI.DELAI_DEMANDE_MS)}.`,
      mentions: [idPilote, idCible, idPartenaire]
    };
  }

  traiterReponseTrahison(idGroupe, idRepondant, reponseBrute, prefixe = '/') {
    let trahisonATraiter = null;
    let cleTrahison = null;

    for (const [cle, trahison] of this.trahisonsEnAttente.entries()) {
      if (trahison.idGroupe === idGroupe && this._normaliserId(trahison.idCible) === this._normaliserId(idRepondant)) {
        trahisonATraiter = trahison;
        cleTrahison = cle;
        break;
      }
    }

    if (!trahisonATraiter) return null;

    const decision = this._normaliserDecision(reponseBrute);
    if (!decision) {
      return {
        succes: false,
        raison: 'reponse_invalide',
        message: '❌ Réponse invalide. Dis "oui" ou "non".'
      };
    }

    this.trahisonsEnAttente.delete(cleTrahison);

    const nomTraitre = getUserName(trahisonATraiter.idPilote);
    const nomCible = getUserName(trahisonATraiter.idCible);
    const nomVictime = getUserName(trahisonATraiter.idPartenaire);

    if (decision === 'refus') {
      return {
        succes: true,
        message: `😇 *CONSCIENCE SAUVÉE*\n\n` +
                 `@\( {nomCible} a refusé la proposition de trahison de @ \){nomTraitre} !\n\n` +
                 `💚 @${nomVictime} peut rouler tranquille !`,
        mentions: [trahisonATraiter.idCible, trahisonATraiter.idPilote, trahisonATraiter.idPartenaire]
      };
    }

    // Trahison acceptée – exécution complète
    return this._executerTrahisonAcceptee(trahisonATraiter, prefixe);
  }

  _executerTrahisonAcceptee(demandeTrahison, prefixe = '/') {
    const { idPilote, idCible, idPartenaire, idGroupe, clePaire } = demandeTrahison;

    const data = this._chargerDonnees();
    const paireActuelle = data.paires[clePaire];

    if (!paireActuelle || !paireActuelle.statut) {
      return {
        succes: false,
        message: '❌ Impossible de trouver ta relation active !'
      };
    }

    // Vérif si la cible est aussi en couple
    const paireCible = this.obtenirPaireActivePourPilote(idCible);
    let cibleEnRelation = false;
    let partenaireCible = nunull;

    if (paireCible) {
      cibleEnRelation = true;
      partenaireCible = paireCible.partenaireId;
    }

    const maintenant = new Date().toISOString();
    const config = CONFIG_TYPES_RELATIONS[paireActuelle.statut];

    // Enregistrement trahison historique
    if (!Array.isArray(paireActuelle.historique)) paireActuelle.historique = [];

    paireActuelle.historique.push({
      type: 'trahison',
      traitre: idPilote,
      victime: idPartenaire,
      complice: idCible,
      date: maintenant,
      idGroupe,
      ancienStatut: paireActuelle.statut
    });

    // Compteur trahisons
    if (!paireActuelle.trahisons) {
      paireActuelle.trahisons = { [idPilote]: 0, [idPartenaire]: 0 };
    }
    paireActuelle.trahisons[idPilote] = (paireActuelle.trahisons[idPilote] || 0) + 1;

    // Marque trahison récente
    paireActuelle.derniereTrahison = {
      date: maintenant,
      traitre: idPilote,
      victime: idPartenaire,
      complice: idCible
    };

    this._sauvegarderDonnees(data);

    const nomTraitre = getUserName(idPilote);
    const nomVictime = getUserName(idPartenaire);
    const nomComplice = getUserName(idCible);

    const lignes = [
      '😈 *TRAIÇÃO CONFIRMADA – CIRCUIT DES OMBRES*',
      '',
      `💔 @\( {nomTraitre} a trahi @ \){nomVictime} !`,
      `👤 Complice : @${nomComplice} a accepté !`,
      ''
    ];

    const mentions = [idPilote, idPartenaire, idCible];

    if (cibleEnRelation && partenaireCible) {
      lignes.push(`⚠️ @${nomComplice} était aussi en relation !`);
      lignes.push(`💔 @${getUserName(partenaireCible)} a été trahi(e) aussi !`);
      lignes.push('');
      mentions.push(partenaireCible);
    }

    lignes.push(`${config.emoji} Statut actuel : ${config.label}`);
    lignes.push(`⚠️ Trahisons enregistrées : ${paireActuelle.trahisons[idPilote]}`);
    lignes.push('');
    lignes.push('💡 La relation continue, mais la confiance est brisée...');
    lignes.push(`Utilise ${prefixe}terminar pour mettre fin à la relation.`);

    return {
      succes: true,
      message: lignes.join('\n'),
      mentions: Array.from(new Set(mentions.filter(Boolean))),
      compteurTrahisons: paireActuelle.trahisons[idPilote]
    };
  }

  // ── INFOS RELATION ──

  obtenirResumeRelation(userA, userB) {
    const cle = this._obtenirClePaire(userA, userB);
    if (!cle) {
      return { succes: false, message: '❌ Impossible d’identifier ce duo.' };
    }

    const data = this._chargerDonnees();
    const paire = data.paires[cle];
    if (!paire || !paire.statut) {
      return { succes: false, message: '❌ Aucune relation active entre ces deux pilotes.' };
    }

    const nomA = getUserName(userA);
    const nomB = getUserName(userB);
    const lignes = [
      '💞 *RELATION PRESTIGE*',
      '',
      `👥 Duo : @\( {nomA} & @ \){nomB}`
    ];

    if (paire.statut && CONFIG_TYPES_RELATIONS[paire.statut]) {
      const config = CONFIG_TYPES_RELATIONS[paire.statut];
      lignes.push(`${config.emoji} Statut actuel : ${config.label}`);

      const depuis = paire.etapes?.[paire.statut]?.depuis;
      if (depuis) {
        const formate = this._formaterDate(depuis);
        const depuisTemps = Date.parse(depuis);
        const duree = Number.isNaN(depuisTemps) ? null : this._formaterDuree(Date.now() - depuisTemps);
        lignes.push(`🗓️ Depuis : \( {formate || 'date inconnue'} \){duree ? ` (depuis ${duree})` : ''}`);
      }
    }

    // Historique étapes
    const etapesHistorique = ['brincadeira', 'namoro', 'casamento']
      .filter(etape => paire.etapes?.[etape]?.depuis)
      .map(etape => {
        const config = CONFIG_TYPES_RELATIONS[etape];
        const depuis = paire.etapes[etape].depuis;
        const formate = this._formaterDate(depuis);
        const depuisTemps = Date.parse(depuis);
        const duree = Number.isNaN(depuisTemps) ? null : this._formaterDuree(Date.now() - depuisTemps);
        return `${config.emoji} ${config.label} : \( {formate || 'date inconnue'} \){duree ? ` (depuis ${duree})` : ''}`;
      });

    if (etapesHistorique.length > 0) {
      lignes.push('', '📚 Historique étapes :', ...etapesHistorique);
    }

    // Temps restant pour mariage
    if (paire.statut === 'namoro' && paire.etapes?.namoro?.depuis) {
      const namoroDepuis = Date.parse(paire.etapes.namoro.depuis);
      if (!Number.isNaN(namoroDepuis)) {
        const ecoule = Date.now() - namoroDepuis;
        if (ecoule < CONFIG_RELATIONS_MASERATI.DELAI_MINIMUM_NAMORO_AVANT_MARIAGE_MS) {
          const restant = CONFIG_RELATIONS_MASERATI.DELAI_MINIMUM_NAMORO_AVANT_MARIAGE_MS - ecoule;
          lignes.push('', `⏳ Temps restant pour mariage : ${this._formaterDuree(restant)}`);
        } else {
          lignes.push('', `✅ Prêts pour le mariage ! Temps de namoro : ${this._formaterDuree(ecoule)}`);
        }
      }
    }

    return {
      succes: true,
      message: lignes.join('\n'),
      mentions: [userA, userB]
    };
  }
obtenirPaireActivePourPilote(userId) {
    const normalise = this._normaliserId(userId);
    if (!normalise) return null;

    const data = this._chargerDonnees();
    for (const [cle, paire] of Object.entries(data.paires)) {
      if (!paire || !Array.isArray(paire.pilotes) || !paire.statut || !CONFIG_TYPES_RELATIONS[paire.statut]) continue;
      const pilotes = paire.pilotes.map(p => this._normaliserId(p));
      const index = pilotes.indexOf(normalise);
      if (index === -1) continue;

      const indexPartenaire = index === 0 ? 1 : 0;
      const idPartenaire = paire.pilotes[indexPartenaire];
      if (!idPartenaire) continue;

      return {
        cle,
        paire,
        partenaireId: idPartenaire,
        piloteId: paire.pilotes[index]
      };
    }

    return null;
  }

  // ── FIN RELATION ──

  terminerRelation(userA, userB, declenchePar) {
    const cle = this._obtenirClePaire(userA, userB);
    if (!cle) {
      return { succes: false, message: '❌ Impossible d’identifier ce duo.' };
    }

    const data = this._chargerDonnees();
    const paire = data.paires[cle];
    if (!paire || !paire.statut || !CONFIG_TYPES_RELATIONS[paire.statut]) {
      return { succes: false, message: '❌ Aucune relation active entre ces pilotes.' };
    }

    const statut = paire.statut;
    const config = CONFIG_TYPES_RELATIONS[statut];
    const etapeInfo = paire.etapes?.[statut];
    const depuis = etapeInfo?.depuis ? Date.parse(etapeInfo.depuis) : null;
    const duree = depuis && !Number.isNaN(depuis) ? this._formaterDuree(Date.now() - depuis) : null;
    const depuisFormate = etapeInfo?.depuis ? this._formaterDate(etapeInfo.depuis) : null;
    const termineLe = new Date().toISOString();

    if (!Array.isArray(paire.historique)) paire.historique = [];
    paire.historique.push({
      type: 'fin',
      ancienStatut: statut,
      declenchePar,
      termineLe
    });

    const paireArchivee = JSON.parse(JSON.stringify(paire));
    paireArchivee.termineLe = termineLe;
    paireArchivee.terminePar = declenchePar;
    paireArchivee.statutFinal = statut;
    paireArchivee.statut = 'termine';
    if (!Array.isArray(data.archives)) data.archives = [];
    data.archives.push(paireArchivee);

    delete data.paires[cle];
    this._sauvegarderDonnees(data);

    const nomDeclencheur = getUserName(declenchePar);
    const nomUn = getUserName(userA);
    const nomDeux = getUserName(userB);
    const lignes = [
      '💔 *RELATION TERMINÉE !*',
      '',
      `${config.emoji} Statut terminé : ${config.label}`
    ];

    if (depuisFormate && duree) {
      lignes.push(`📆 Durée totale : ${duree}`);
      lignes.push(`🗓️ Début : ${depuisFormate}`);
    } else if (depuisFormate) {
      lignes.push(`🗓️ Début : ${depuisFormate}`);
    }

    lignes.push('', `👤 Qui a mis fin : @${nomDeclencheur}`);
    lignes.push(`👥 Ex-couple : @\( {nomUn} & @ \){nomDeux}`);

    return {
      succes: true,
      message: lignes.join('\n'),
      mentions: Array.from(new Set([userA, userB, declenchePar].filter(Boolean)))
    };
  }

  // ── HISTORIQUE TRAHISONS ──

  obtenirHistoriqueTrahisons(userA, userB) {
    const cle = this._obtenirClePaire(userA, userB);
    if (!cle) {
      return { succes: false, message: '❌ Impossible d’identifier ce duo.' };
    }

    const data = this._chargerDonnees();
    const paire = data.paires[cle];

    if (!paire || !paire.statut) {
      return { succes: false, message: '❌ Aucune relation active entre ces pilotes.' };
    }

    const trahisons = (paire.historique || []).filter(h => h.type === 'trahison');

    if (trahisons.length === 0) {
      return {
        succes: true,
        message: '✨ Ce couple n’a aucun historique de trahison !',
        mentions: [userA, userB],
        compteurTrahisons: 0
      };
    }

    const nomA = getUserName(userA);
    const nomB = getUserName(userB);

    const lignes = [
      '📜 *HISTORIQUE TRAHISONS – CIRCUIT DES OMBRES*',
      '',
      `👥 Couple : @\( {nomA} & @ \){nomB}`,
      `💔 Total trahisons : ${trahisons.length}`,
      ''
    ];

    trahisons.slice(-5).forEach((trahison, index) => {
      const nomTraitre = getUserName(trahison.traitre);
      const nomVictime = getUserName(trahison.victime);
      const nomComplice = getUserName(trahison.complice);
      const date = this._formaterDate(trahison.date);

      lignes.push(`\( {index + 1}. 😈 @ \){nomTraitre} a trahi @${nomVictime}`);
      lignes.push(`   👤 Avec : @${nomComplice}`);
      lignes.push(`   📅 Date : ${date || 'N/A'}`);
      lignes.push('');
    });

    if (trahisons.length > 5) {
      lignes.push(`... et ${trahisons.length - 5} trahisons antérieures.`);
    }

    return {
      succes: true,
      message: lignes.join('\n'),
      mentions: Array.from(new Set([userA, userB, ...trahisons.map(t => t.traitre), ...trahisons.map(t => t.complice)].filter(Boolean))),
      compteurTrahisons: trahisons.length
    };
  }

  // ── NETTOYAGE ──
  _nettoyerPaddock() {
    const maintenant = Date.now();
    for (const [idGroupe, demande] of this.demandesEnAttente.entries()) {
      if (demande.expireLe && demande.expireLe <= maintenant) {
        this.demandesEnAttente.delete(idGroupe);
      }
    }
    for (const [cle, trahison] of this.trahisonsEnAttente.entries()) {
      if (trahison.expireLe && trahison.expireLe <= maintenant) {
        this.trahisonsEnAttente.delete(cle);
      }
    }
  }

  demandeEnAttente = (idGroupe) => this.demandesEnAttente.has(idGroupe);
  trahisonEnAttente = (idGroupe) => {
    for (const trahison of this.trahisonsEnAttente.values()) {
      if (trahison.idGroupe === idGroupe) return true;
    }
    return false;
  };
}

export default new GestionnaireRelationsMaserati();
