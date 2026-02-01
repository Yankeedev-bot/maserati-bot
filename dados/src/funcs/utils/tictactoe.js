/**
 * Morpion Prestige - Édition Maserati
 * Tic-Tac-Toe revisité en mode circuit luxe
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── CONFIGURATION PRESTIGE ──
const CONFIG_MORPION_MASERATI = {
  DELAI_INVITATION_MS: 15 * 60 * 1000,       // 15 min pour accepter – pas de pilote qui hésite
  DELAI_PARTIE_MS: 30 * 60 * 1000,           // 30 min max par partie
  DELAI_COUP_MS: 5 * 60 * 1000,              // 5 min par coup – sinon timeout
  INTERVALLE_NETTOYAGE_MS: 5 * 60 * 1000,    // Nettoyage paddock toutes les 5 min
  TAILLE_GRILLE: 9,                          // 3×3 classique
  SYMBOLES: { X: '❌', O: '⭕' },
  CASES_VIDES: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']
};

// Helper nom pilote prestige
const obtenirNomPilote = (userId) => {
  if (!userId || typeof userId !== 'string') return 'pilote anonyme';
  return userId.split('@')[0] || userId;
};

// ── MOTEUR DU JEU – V8 MORPION ──
class MoteurMorpionMaserati {
  constructor(idPilote1, idPilote2) {
    this.grille = [...CONFIG_MORPION_MASERATI.CASES_VIDES];
    this.pilotes = { X: idPilote1, O: idPilote2 };
    this.tourActuel = 'X';
    this.coupsJoues = 0;
    this.debutPartie = Date.now();
    this.dernierCoup = Date.now();
    this.gagnant = null;
  }

  jouerCoup(idPilote, position) {
    if (idPilote !== this.pilotes[this.tourActuel]) {
      return { succes: false, raison: 'pas_ton_tour' };
    }

    const index = parseInt(position) - 1;
    if (isNaN(index) || index < 0 || index >= CONFIG_MORPION_MASERATI.TAILLE_GRILLE) {
      return { succes: false, raison: 'position_invalide' };
    }

    if (!CONFIG_MORPION_MASERATI.CASES_VIDES.includes(this.grille[index])) {
      return { succes: false, raison: 'case_occupee' };
    }

    this.grille[index] = CONFIG_MORPION_MASERATI.SYMBOLES[this.tourActuel];
    this.coupsJoues++;
    this.dernierCoup = Date.now();

    if (this._verifierVictoire()) {
      this.gagnant = this.pilotes[this.tourActuel];
      return { succes: true, statut: 'victoire', gagnant: this.gagnant };
    }

    if (this.coupsJoues === CONFIG_MORPION_MASERATI.TAILLE_GRILLE) {
      return { succes: true, statut: 'egalite' };
    }

    this.tourActuel = this.tourActuel === 'X' ? 'O' : 'X';
    return { succes: true, statut: 'continue', prochainJoueur: this.pilotes[this.tourActuel] };
  }

  afficherGrille() {
    return `${this.grille[0]}  ${this.grille[1]}  ${this.grille[2]}\n` +
           `${this.grille[3]}  ${this.grille[4]}  ${this.grille[5]}\n` +
           `${this.grille[6]}  ${this.grille[7]}  ${this.grille[8]}`;
  }

  _verifierVictoire() {
    const motifs = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],  // lignes
      [0, 3, 6], [1, 4, 7], [2, 5, 8],  // colonnes
      [0, 4, 8], [2, 4, 6]              // diagonales
    ];

    const symbole = CONFIG_MORPION_MASERATI.SYMBOLES[this.tourActuel];
    return motifs.some(motif => motif.every(i => this.grille[i] === symbole));
  }
}

// ── GESTIONNAIRE DU PADDOCK MORPION ──
class GestionnaireMorpionMaserati {
  constructor() {
    this.partiesActives = new Map();          // groupId → moteur
    this.invitationsEnAttente = new Map();    // groupId → {inviteur, invite, timestamp}
    setInterval(() => this._nettoyerPaddock(), CONFIG_MORPION_MASERATI.INTERVALLE_NETTOYAGE_MS);
  }

  inviterPilote(idGroupe, idInviteur, idInvite) {
    if (!idGroupe || !idInviteur || !idInvite || idInviteur === idInvite) {
      return this._formatReponse(false, '❌ Données invalides pour l’invitation prestige');
    }

    if (this.partiesActives.has(idGroupe) || this.invitationsEnAttente.has(idGroupe)) {
      return this._formatReponse(false, '❌ Un morpion ou une invitation est déjà en cours dans ce paddock !');
    }

    this.invitationsEnAttente.set(idGroupe, { inviteur: idInviteur, invite: idInvite, timestamp: Date.now() });

    const message = `🎮 *INVITATION MORPION PRESTIGE*\n\n` +
                    `@\( {obtenirNomPilote(idInviteur)} défie @ \){obtenirNomPilote(idInvite)} sur le circuit !\n\n` +
                    `✅ Accepter : "oui", "sim", "s"\n` +
                    `❌ Refuser : "non", "não", "n"\n\n` +
                    `⏳ Expire dans 15 minutes – pas de pilote qui hésite !`;

    return this._formatReponse(true, message, { mentions: [idInviteur, idInvite] });
  }

  traiterReponseInvitation(idGroupe, idInvite, reponse) {
    const invitation = this.invitationsEnAttente.get(idGroupe);
    if (!invitation || invitation.invite !== idInvite) {
      return this._formatReponse(false, '❌ Aucun défi en attente pour toi dans ce groupe.');
    }

    const reponseNormalisee = reponse.toLowerCase().trim();
    const accepte = ['s', 'sim', 'oui', 'o', 'yes', 'y'].includes(reponseNormalisee);
    const refuse = ['n', 'nao', 'não', 'non', 'no'].includes(reponseNormalisee);

    if (!accepte && !refuse) {
      return this._formatReponse(false, '❌ Réponse invalide. Dis simplement "oui" ou "non".');
    }

    this.invitationsEnAttente.delete(idGroupe);

    if (refuse) {
      return this._formatReponse(true, `❌ Défi refusé – pas de course aujourd’hui !`, { mentions: [invitation.inviteur, idInvite] });
    }

    const morpion = new MoteurMorpionMaserati(invitation.inviteur, invitation.invite);
    this.partiesActives.set(idGroupe, morpion);

    const message = `🎮 *MORPION PRESTIGE – COURSE LANCÉE !*\n\n` +
                    `👥 Pilotes :\n` +
                    `➤ \( {CONFIG_MORPION_MASERATI.SYMBOLES.X} : @ \){obtenirNomPilote(invitation.inviteur)}\n` +
                    `➤ \( {CONFIG_MORPION_MASERATI.SYMBOLES.O} : @ \){obtenirNomPilote(invitation.invite)}\n\n` +
                    `${morpion.afficherGrille()}\n\n` +
                    `💡 À toi de jouer @${obtenirNomPilote(invitation.inviteur)} – choisis une case (1-9) !`;

    return this._formatReponse(true, message, { mentions: [invitation.inviteur, invitation.invite] });
  }

  jouerCoup(idGroupe, idPilote, position) {
    const morpion = this.partiesActives.get(idGroupe);
    if (!morpion) {
      return this._formatReponse(false, '❌ Aucun morpion en cours dans ce paddock !');
    }

    // Timeout inactivité
    if (Date.now() - morpion.dernierCoup > CONFIG_MORPION_MASERATI.DELAI_COUP_MS) {
      this.partiesActives.delete(idGroupe);
      return this._formatReponse(false, '❌ Partie abandonnée pour inactivité (5 min sans coup) !', {
        mentions: Object.values(morpion.pilotes)
      });
    }

    const resultat = morpion.jouerCoup(idPilote, position);

    if (!resultat.succes) {
      const erreurs = {
        'pas_ton_tour': '❌ Ce n’est pas ton tour – patience pilote !',
        'position_invalide': '❌ Case invalide ! Choisis entre 1 et 9.',
        'case_occupee': '❌ Cette case est déjà prise – vise ailleurs !'
      };
      return this._formatReponse(false, erreurs[resultat.raison] || '❌ Erreur inconnue.');
    }

    if (resultat.statut === 'victoire') {
      this.partiesActives.delete(idGroupe);
      const message = `🎮 *MORPION PRESTIGE – DÉPENDU !*\n\n` +
                      `🏁 @${obtenirNomPilote(resultat.gagnant)} remporte la course ! 🏆\n\n` +
                      `${morpion.afficherGrille()}`;
      return this._formatReponse(true, message, { terminee: true, gagnant: resultat.gagnant, mentions: [resultat.gagnant] });
    }

    if (resultat.statut === 'egalite') {
      this.partiesActives.delete(idGroupe);
      const message = `🎮 *MORPION PRESTIGE – ÉGALITÉ !*\n\n` +
                      `🤝 Match nul – personne ne passe le drapeau à damier aujourd’hui !\n\n` +
                      `${morpion.afficherGrille()}`;
      return this._formatReponse(true, message, { terminee: true, egalite: true, mentions: Object.values(morpion.pilotes) });
    }

    if (resultat.statut === 'continue') {
      const message = `🎮 *MORPION PRESTIGE – COURSE EN COURS*\n\n` +
                      `👉 À toi @${obtenirNomPilote(resultat.prochainJoueur)}\n\n` +
                      `${morpion.afficherGrille()}\n\n` +
                      `💡 Choisis une case libre (1-9) – précision trident requise !`;
      return this._formatReponse(true, message, { mentions: [resultat.prochainJoueur] });
    }
  }

  arreterPartie(idGroupe) {
    if (!this.partiesActives.has(idGroupe)) {
      return this._formatReponse(false, '❌ Aucun morpion en cours dans ce paddock !');
    }

    const joueurs = Object.values(this.partiesActives.get(idGroupe).pilotes);
    this.partiesActives.delete(idGroupe);
    return this._formatReponse(true, '🎮 Morpion arrêté manuellement – retour au garage !', { mentions: joueurs });
  }

  partieActive = (idGroupe) => this.partiesActives.has(idGroupe);
  invitationEnAttente = (idGroupe) => this.invitationsEnAttente.has(idGroupe);

  _formatReponse(succes, message, extras = {}) {
    return { succes, message, ...extras };
  }

  _nettoyerPaddock() {
    const maintenant = Date.now();
    for (const [idGroupe, partie] of this.partiesActives.entries()) {
      if (maintenant - partie.debutPartie > CONFIG_MORPION_MASERATI.DELAI_PARTIE_MS) {
        this.partiesActives.delete(idGroupe);
        console.log(`[Maserati-Morpion] Partie expirée supprimée du groupe ${idGroupe}`);
      }
    }
    for (const [idGroupe, invitation] of this.invitationsEnAttente.entries()) {
      if (maintenant - invitation.timestamp > CONFIG_MORPION_MASERATI.DELAI_INVITATION_MS) {
        this.invitationsEnAttente.delete(idGroupe);
        console.log(`[Maserati-Morpion] Invitation expirée supprimée du groupe ${idGroupe}`);
      }
    }
  }
}

// Singleton – un seul paddock morpion maître
const gestionnaire = new GestionnaireMorpionMaserati();

// Exports prestige
export {
  invitePlayer: (...args) => gestionnaire.inviterPilote(...args),
  processInvitationResponse: (...args) => gestionnaire.traiterReponseInvitation(...args),
  makeMove: (...args) => gestionnaire.jouerCoup(...args),
  endGame: (...args) => gestionnaire.arreterPartie(...args),
  hasActiveGame: (...args) => gestionnaire.partieActive(...args),
  hasPendingInvitation: (...args) => gestionnaire.invitationEnAttente(...args)
};

export default gestionnaire;
