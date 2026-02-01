/**
 * Jeu Connect 4 Prestige - Édition Maserati
 * Puissance 4 revisité en mode circuit luxe
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration prestige du circuit
const CONFIG_CONNECT4 = {
  DELAI_INVITATION_MS: 15 * 60 * 1000,      // 15 min pour accepter – pas de pilote qui traîne
  DELAI_PARTIE_MS: 30 * 60 * 1000,          // 30 min max par partie
  DELAI_COUP_MS: 5 * 60 * 1000,             // 5 min par coup – sinon forfait
  INTERVALLE_NETTOYAGE_MS: 5 * 60 * 1000,   // Nettoyage paddock toutes les 5 min
  LIGNES: 6,
  COLONNES: 7,
  LONGUEUR_VICTOIRE: 4,
  SYMBOLES: { 1: '🔴', 2: '🟡' },           // Rouge & Jaune – couleurs trident
  VIDE: '⚪',
  NUMEROS_COLONNES: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣']
};

// Helper nom pilote prestige
const obtenirNomPilote = (userId) => {
  if (!userId || typeof userId !== 'string') return 'pilote inconnu';
  return userId.split('@')[0] || userId;
};

// ── MOTEUR DU JEU – V8 PUISSANCE 4 ──

class MoteurConnect4Maserati {
  constructor(pilote1, pilote2) {
    this.grille = Array(CONFIG_CONNECT4.LIGNES).fill(null).map(() => Array(CONFIG_CONNECT4.COLONNES).fill(0));
    this.pilotes = { 1: pilote1, 2: pilote2 };
    this.tourActuel = 1;
    this.coupsJoues = 0;
    this.debutPartie = Date.now();
    this.dernierCoup = Date.now();
    this.gagnant = null;
    this.casesGagnantes = [];
  }

  jouerCoup(pilote, colonne) {
    if (pilote !== this.pilotes[this.tourActuel]) {
      return { succes: false, raison: 'pas_ton_tour' };
    }

    const col = parseInt(colonne) - 1;
    if (isNaN(col) || col < 0 || col >= CONFIG_CONNECT4.COLONNES) {
      return { succes: false, raison: 'colonne_invalide' };
    }

    // Trouver la ligne la plus basse libre
    let ligne = -1;
    for (let r = CONFIG_CONNECT4.LIGNES - 1; r >= 0; r--) {
      if (this.grille[r][col] === 0) {
        ligne = r;
        break;
      }
    }

    if (ligne === -1) {
      return { succes: false, raison: 'colonne_pleine' };
    }

    this.grille[ligne][col] = this.tourActuel;
    this.coupsJoues++;
    this.dernierCoup = Date.now();

    // Vérifier victoire
    if (this._verifierVictoire(ligne, col)) {
      this.gagnant = this.pilotes[this.tourActuel];
      return { succes: true, statut: 'victoire', gagnant: this.gagnant };
    }

    // Vérifier match nul
    if (this.coupsJoues === CONFIG_CONNECT4.LIGNES * CONFIG_CONNECT4.COLONNES) {
      return { succes: true, statut: 'match_nul' };
    }

    // Tour suivant
    this.tourActuel = this.tourActuel === 1 ? 2 : 1;
    return { succes: true, statut: 'continuer', prochainPilote: this.pilotes[this.tourActuel] };
  }

  // Affichage grille prestige
  afficherGrille() {
    let grille = '';

    // Numéros de colonnes – piste numérotée
    grille += CONFIG_CONNECT4.NUMEROS_COLONNES.join('') + '\n';

    // Grille de jeu
    for (let r = 0; r < CONFIG_CONNECT4.LIGNES; r++) {
      for (let c = 0; c < CONFIG_CONNECT4.COLONNES; c++) {
        const cellule = this.grille[r][c];
        grille += cellule === 0 ? CONFIG_CONNECT4.VIDE : CONFIG_CONNECT4.SYMBOLES[cellule];
      }
      grille += '\n';
    }

    return grille;
  }

  // Vérification victoire – alignement 4 tridents
  _verifierVictoire(ligne, colonne) {
    const directions = [
      [0, 1],   // Horizontal
      [1, 0],   // Vertical
      [1, 1],   // Diagonale \
      [1, -1]   // Diagonale /
    ];

    const joueur = this.grille[ligne][colonne];

    for (const [dl, dc] of directions) {
      let compteur = 1;
      const cases = [[ligne, colonne]];

      // Direction avant
      let r = ligne + dl;
      let c = colonne + dc;
      while (r >= 0 && r < CONFIG_CONNECT4.LIGNES && c >= 0 && c < CONFIG_CONNECT4.COLONNES && this.grille[r][c] === joueur) {
        compteur++;
        cases.push([r, c]);
        r += dl;
        c += dc;
      }

      // Direction arrière
      r = ligne - dl;
      c = colonne - dc;
      while (r >= 0 && r < CONFIG_CONNECT4.LIGNES && c >= 0 && c < CONFIG_CONNECT4.COLONNES && this.grille[r][c] === joueur) {
        compteur++;
        cases.push([r, c]);
        r -= dl;
        c -= dc;
      }

      if (compteur >= CONFIG_CONNECT4.LONGUEUR_VICTOIRE) {
        this.casesGagnantes = cases;
        return true;
      }
    }

    return false;
  }
}

// ── GESTIONNAIRE DU PADDOCK ──

class GestionnaireConnect4Maserati {
  constructor() {
    this.partiesActives = new Map();           // groupId → moteur
    this.invitationsEnCours = new Map();       // groupId → {inviteur, invite, timestamp}
    setInterval(() => this._nettoyerPaddock(), CONFIG_CONNECT4.INTERVALLE_NETTOYAGE_MS);
  }

  // Inviter un pilote adverse
  inviterPilote(idGroupe, inviteur, invite) {
    if (!idGroupe || !inviteur || !invite || inviteur === invite) {
      return this._formatReponse(false, '❌ Données invalides pour lancer le défi');
    }

    if (this.partiesActives.has(idGroupe) || this.invitationsEnCours.has(idGroupe)) {
      return this._formatReponse(false, '❌ Un défi ou une partie est déjà en cours dans ce paddock !');
    }

    this.invitationsEnCours.set(idGroupe, { inviteur, invite, timestamp: Date.now() });

    const message = `🔴🟡 *DÉFI CONNECT 4 PRESTIGE*\n\n` +
                    `@\( {obtenirNomPilote(inviteur)} lance un défi à @ \){obtenirNomPilote(invite)} !\n\n` +
                    `✅ Accepter : "oui", "o", "s", "sim"\n` +
                    `❌ Refuser : "non", "n", "nao"\n\n` +
                    `⏳ Expire dans 15 minutes – ne fais pas attendre le trident !`;

    return this._formatReponse(true, message, { mentions: [inviteur, invite] });
  }

  // Réponse à l’invitation – démarrage circuit
  traiterReponseInvitation(idGroupe, invite, reponse) {
    const invitation = this.invitationsEnCours.get(idGroupe);
    if (!invitation || invitation.invite !== invite) {
      return this._formatReponse(false, '❌ Aucun défi en attente pour toi.');
    }

    const reponseNormalisee = reponse.toLowerCase().trim();
    const accepte = ['oui', 'o', 's', 'sim', 'y', 'yes'].includes(reponseNormalisee);
    const refuse = ['non', 'n', 'nao', 'no'].includes(reponseNormalisee);

    if (!accepte && !refuse) {
      return this._formatReponse(false, '❌ Réponse invalide. Dis simplement "oui" ou "non".');
    }

    this.invitationsEnCours.delete(idGroupe);

    if (refuse) {
      return this._formatReponse(true, `❌ Défi refusé – pas de course aujourd’hui.`, { mentions: [invitation.inviteur, invite] });
    }

    const partie = new MoteurConnect4Maserati(invitation.inviteur, invitation.invite);
    this.partiesActives.set(idGroupe, partie);

    const message = `🔴🟡 *CONNECT 4 – CIRCUIT LANCÉ !*\n\n` +
                    `👥 Pilotes :\n` +
                    `➤ \( {CONFIG_CONNECT4.SYMBOLES[1]} : @ \){obtenirNomPilote(invitation.inviteur)}\n` +
                    `➤ \( {CONFIG_CONNECT4.SYMBOLES[2]} : @ \){obtenirNomPilote(invitation.invite)}\n\n` +
                    `${partie.afficherGrille()}\n` +
                    `💨 À toi de jouer @${obtenirNomPilote(invitation.inviteur)} – choisis une colonne (1-7) !`;

    return this._formatReponse(true, message, { mentions: [invitation.inviteur, invitation.invite] });
  }

  // Jouer un coup – accélérer sur la piste
  jouerCoup(idGroupe, pilote, colonne) {
    const partie = this.partiesActives.get(idGroupe);
    if (!partie) {
      return this._formatReponse(false, '❌ Aucun circuit actif dans ce groupe !');
    }

    // Timeout inactivité
    if (Date.now() - partie.dernierCoup > CONFIG_CONNECT4.DELAI_COUP_MS) {
      this.partiesActives.delete(idGroupe);
      return this._formatReponse(false, '❌ Partie terminée pour inactivité (5 min sans coup).', { mentions: Object.values(partie.pilotes) });
    }

    const resultat = partie.jouerCoup(pilote, colonne);

    if (!resultat.succes) {
      const messagesErreur = {
        'pas_ton_tour': '❌ Ce n’est pas ton tour – patience pilote !',
        'colonne_invalide': '❌ Colonne invalide ! Choisis entre 1 et 7.',
        'colonne_pleine': '❌ Cette colonne est pleine – choisis une autre piste !'
      };
      return this._formatReponse(false, messagesErreur[resultat.raison] || '❌ Erreur inconnue.');
    }

    if (resultat.statut === 'victoire') {
      this.partiesActives.delete(idGroupe);
      const message = `🏁 *CONNECT 4 – VICTOIRE !*\n\n` +
                      `🎉 @${obtenirNomPilote(resultat.gagnant)} remporte la course ! 🏆\n\n` +
                      `${partie.afficherGrille()}`;
      return this._formatReponse(true, message, { terminee: true, gagnant: resultat.gagnant, mentions: [resultat.gagnant] });
    }

    if (resultat.statut === 'match_nul') {
      this.partiesActives.delete(idGroupe);
      const message = `🏁 *CONNECT 4 – MATCH NUL*\n\n` +
                      `🤝 Égalité parfaite – personne ne passe la ligne !\n\n` +
                      `${partie.afficherGrille()}`;
      return this._formatReponse(true, message, { terminee: true, nul: true, mentions: Object.values(partie.pilotes) });
    }

    if (resultat.statut === 'continuer') {
      const message = `🔴🟡 *CONNECT 4 – TOUR EN COURS*\n\n` +
                      `💨 À toi @${obtenirNomPilote(resultat.prochainPilote)}\n\n` +
                      `${partie.afficherGrille()}\n` +
                      `📌 Choisis une colonne : 1 à 7`;
      return this._formatReponse(true, message, { continue: true, mentions: [resultat.prochainPilote] });
    }
  }

  // Arrêt manuel de la partie
  arreterPartie(idGroupe) {
    if (!this.partiesActives.has(idGroupe)) {
      return this._formatReponse(false, '❌ Aucun circuit actif à arrêter !');
    }

    const pilotes = Object.values(this.partiesActives.get(idGroupe).pilotes);
    this.partiesActives.delete(idGroupe);

    return this._formatReponse(true, '🏁 Partie arrêtée manuellement – retour au garage !', { mentions: pilotes });
  }

  // Helpers rapides
  aPartieActive = (idGroupe) => this.partiesActives.has(idGroupe);
  aInvitationEnCours = (idGroupe) => this.invitationsEnCours.has(idGroupe);
  obtenirPartieActive = (idGroupe) => this.partiesActives.get(idGroupe);
  obtenirInvitationEnCours = (idGroupe) => this.invitationsEnCours.get(idGroupe);

  _formatReponse(succes, message, extras = {}) {
    return { succes, message, ...extras };
  }

  // Nettoyage paddock – suppression inactifs
  _nettoyerPaddock() {
    const maintenant = Date.now();

    // Invitations expirées
    for (const [idGroupe, invitation] of this.invitationsEnCours) {
      if (maintenant - invitation.timestamp > CONFIG_CONNECT4.DELAI_INVITATION_MS) {
        this.invitationsEnCours.delete(idGroupe);
      }
    }

    // Parties inactives
    for (const [idGroupe, partie] of this.partiesActives) {
      if (maintenant - partie.dernierCoup > CONFIG_CONNECT4.DELAI_PARTIE_MS) {
        this.partiesActives.delete(idGroupe);
      }
    }
  }
}

// Singleton – un seul paddock maître
const gestionnaire = new GestionnaireConnect4Maserati();

// Exports prestige
const inviterPilote = (idGroupe, inviteur, invite) => gestionnaire.inviterPilote(idGroupe, inviteur, invite);
const traiterReponseInvitation = (idGroupe, invite, reponse) => gestionnaire.traiterReponseInvitation(idGroupe, invite, reponse);
const jouerCoup = (idGroupe, pilote, colonne) => gestionnaire.jouerCoup(idGroupe, pilote, colonne);
const arreterPartie = (idGroupe) => gestionnaire.arreterPartie(idGroupe);
const aPartieActive = (idGroupe) => gestionnaire.aPartieActive(idGroupe);
const aInvitationEnCours = (idGroupe) => gestionnaire.aInvitationEnCours(idGroupe);
const obtenirPartieActive = (idGroupe) => gestionnaire.obtenirPartieActive(idGroupe);
const obtenirInvitationEnCours = (idGroupe) => gestionnaire.obtenirInvitationEnCours(idGroupe);

export {
  inviterPilote,
  traiterReponseInvitation,
  jouerCoup,
  arreterPartie,
  aPartieActive,
  aInvitationEnCours,
  obtenirPartieActive,
  obtenirInvitationEnCours,
  MoteurConnect4Maserati,
  GestionnaireConnect4Maserati
};

export default {
  inviter: inviterPilote,
  repondreInvitation: traiterReponseInvitation,
  jouer: jouerCoup,
  arreter: arreterPartie,
  partieActive: aPartieActive,
  invitationEnCours: aInvitationEnCours
};
