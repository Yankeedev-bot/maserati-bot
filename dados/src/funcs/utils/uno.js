/**
 * Jeu UNO Prestige - Édition Maserati
 * Uno revisité en mode circuit luxe – vitesse, stratégie et trident
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
const CONFIG_UNO_MASERATI = {
  DELAI_INVITATION_MS: 5 * 60 * 1000,        // 5 min pour accepter – pas de pilote qui traîne
  DELAI_PARTIE_MS: 60 * 60 * 1000,           // 1h max par course
  DELAI_TOUR_MS: 1 * 60 * 1000,              // 1 min par tour – sinon pénalité
  MAX_TIMEOUTS_CONSECUTIFS: 3,               // 3 abandons = expulsion du circuit
  INTERVALLE_NETTOYAGE_MS: 5 * 60 * 1000,    // Nettoyage paddock toutes les 5 min
  MIN_JOUEURS: 2,
  MAX_JOUEURS: 10,
  CARTES_INITIALES: 7,
  COULEURS: ['🔴', '🟡', '🟢', '🔵'],
  NOMS_COULEURS: { '🔴': 'rouge', '🟡': 'jaune', '🟢': 'vert', '🔵': 'bleu' },
  CODES_COULEURS: { 'r': '🔴', 'rouge': '🔴', 'j': '🟡', 'jaune': '🟡', 'v': '🟢', 'vert': '🟢', 'b': '🔵', 'bleu': '🔵' }
};

// Création du paquet prestige
const creerPaquet = () => {
  const paquet = [];

  for (const couleur of CONFIG_UNO_MASERATI.COULEURS) {
    // Un 0 par couleur
    paquet.push({ couleur, valeur: '0', affichage: `${couleur}0` });

    // Deux de chaque numéro 1-9
    for (let i = 1; i <= 9; i++) {
      paquet.push({ couleur, valeur: String(i), affichage: `\( {couleur} \){i}` });
      paquet.push({ couleur, valeur: String(i), affichage: `\( {couleur} \){i}` });
    }

    // Cartes spéciales (2 de chaque par couleur)
    for (let i = 0; i < 2; i++) {
      paquet.push({ couleur, valeur: '🔄', affichage: `${couleur}🔄`, speciale: 'reverse' });
      paquet.push({ couleur, valeur: '⏭️', affichage: `${couleur}⏭️`, speciale: 'skip' });
      paquet.push({ couleur, valeur: '+2', affichage: `${couleur}+2`, speciale: 'draw2' });
    }
  }

  // Cartes joker (4 de chaque)
  for (let i = 0; i < 4; i++) {
    paquet.push({ couleur: '⬛', valeur: '🌈', affichage: '⬛🌈', speciale: 'wild' });
    paquet.push({ couleur: '⬛', valeur: '+4', affichage: '⬛+4', speciale: 'wild4' });
  }

  return paquet;
};

// Mélange prestige – départ lancé
const melangerPaquet = (paquet) => {
  const melange = [...paquet];
  for (let i = melange.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [melange[i], melange[j]] = [melange[j], melange[i]];
  }
  return melange;
};

// Helper nom pilote prestige
const obtenirNomPilote = (userId) => {
  if (!userId || typeof userId !== 'string') return 'pilote anonyme';
  return userId.split('@')[0] || userId;
};

// ── MOTEUR DU JEU – V8 UNO ──
class MoteurUnoMaserati {
  constructor(idHote) {
    this.hote = idHote;
    this.joueurs = [idHote];
    this.nomsJoueurs = {};
    this.mains = {};
    this.paquet = [];
    this.defausse = [];
    this.indexJoueurActuel = 0;
    this.direction = 1; // 1 = sens horaire, -1 = anti-horaire
    this.couleurActuelle = null;
    this.commence = false;
    this.gagnant = null;
    this.achatEnCours = 0;
    this.dernierCoup = Date.now();
    this.dernierTour = Date.now();
    this.debutPartie = Date.now();
    this.doitDireUno = new Set();
    this.aDitUno = new Set();
    this.timeouts = {}; // compteur timeouts consécutifs par joueur
  }

  ajouterJoueur(idJoueur) {
    if (this.commence) return { succes: false, raison: 'partie_commencee' };
    if (this.joueurs.length >= CONFIG_UNO_MASERATI.MAX_JOUEURS) return { succes: false, raison: 'partie_pleine' };
    if (this.joueurs.includes(idJoueur)) return { succes: false, raison: 'deja_inscrit' };

    this.joueurs.push(idJoueur);
    return { succes: true };
  }

  retirerJoueur(idJoueur) {
    const index = this.joueurs.indexOf(idJoueur);
    if (index === -1) return { succes: false, raison: 'pas_dans_la_partie' };

    // Si partie pas commencée, hôte ne peut pas partir
    if (!this.commence && idJoueur === this.hote) {
      return { succes: false, raison: 'hote_ne_peut_pas_partir' };
    }

    if (this.commence) {
      delete this.mains[idJoueur];
      this.doitDireUno.delete(idJoueur);
      this.aDitUno.delete(idJoueur);
      delete this.timeouts[idJoueur];

      const etaitJoueurActuel = this.indexJoueurActuel === index;

      this.joueurs.splice(index, 1);

      if (this.indexJoueurActuel >= this.joueurs.length) {
        this.indexJoueurActuel = 0;
      } else if (index < this.indexJoueurActuel) {
        this.indexJoueurActuel--;
      }

      if (this.joueurs.length === 1) {
        this.gagnant = this.joueurs[0];
        return { succes: true, partieTerminee: true, gagnant: this.gagnant, joueurParti: idJoueur };
      }

      if (etaitJoueurActuel) {
        this.dernierTour = Date.now();
      }

      return { succes: true, partieTerminee: false, joueurParti: idJoueur, prochainJoueur: this.obtenirJoueurActuel() };
    }

    this.joueurs.splice(index, 1);
    return { succes: true, partieTerminee: false };
  }

  demarrerPartie() {
    if (this.commence) return { succes: false, raison: 'deja_commencee' };
    if (this.joueurs.length < CONFIG_UNO_MASERATI.MIN_JOUEURS) return { succes: false, raison: 'pas_assez_de_joueurs' };

    this.paquet = melangerPaquet(creerPaquet());

    // Distribution cartes
    for (const joueur of this.joueurs) {
      this.mains[joueur] = [];
      for (let i = 0; i < CONFIG_UNO_MASERATI.CARTES_INITIALES; i++) {
        this.mains[joueur].push(this.paquet.pop());
      }
    }

    // Première carte (pas spéciale)
    let premiereCarte;
    do {
      premiereCarte = this.paquet.pop();
      if (premiereCarte.speciale) {
        this.paquet.unshift(premiereCarte);
        this.paquet = melangerPaquet(this.paquet);
      }
    } while (premiereCarte.speciale);

    this.defausse.push(premiereCarte);
    this.couleurActuelle = premiereCarte.couleur;
    this.commence = true;
    this.dernierCoup = Date.now();

    return { succes: true, premiereCarte };
  }

  obtenirJoueurActuel() {
    return this.joueurs[this.indexJoueurActuel];
  }

  verifierEtGererTimeout() {
    if (!this.commence) return null;

    const joueurActuel = this.obtenirJoueurActuel();
    const tempsDepuisDernierTour = Date.now() - this.dernierTour;

    if (tempsDepuisDernierTour >= CONFIG_UNO_MASERATI.DELAI_TOUR_MS) {
      this.timeouts[joueurActuel] = (this.timeouts[joueurActuel] || 0) + 1;

      // Pénalité : achat 1 carte
      if (this.paquet.length === 0) this._remelangerPaquet();
      const carteAchetee = this.paquet.pop();
      this.mains[joueurActuel].push(carteAchetee);

      const compteurTimeout = this.timeouts[joueurActuel];

      // 3 timeouts → expulsion
      if (compteurTimeout >= CONFIG_UNO_MASERATI.MAX_TIMEOUTS_CONSECUTIFS) {
        const joueurExpulse = joueurActuel;
        delete this.mains[joueurExpulse];
        this.joueurs.splice(this.indexJoueurActuel, 1);
        this.doitDireUno.delete(joueurExpulse);
        this.aDitUno.delete(joueurExpulse);
        delete this.timeouts[joueurExpulse];

        if (this.indexJoueurActuel >= this.joueurs.length) {
          this.indexJoueurActuel = 0;
        }

        if (this.joueurs.length === 1) {
          this.gagnant = this.joueurs[0];
          return {
            type: 'expulse_et_gagne',
            joueurExpulse,
            gagnant: this.gagnant,
            compteurTimeout
          };
        }

        this.dernierTour = Date.now();
        return {
          type: 'expulse',
          joueurExpulse,
          compteurTimeout,
          prochainJoueur: this.obtenirJoueurActuel()
        };
      }

      // Saut de tour
      this._prochainJoueur(false);
      this.dernierTour = Date.now();

      return {
        type: 'timeout',
        joueur: joueurActuel,
        compteurTimeout,
        carteAchetee,
        prochainJoueur: this.obtenirJoueurActuel()
      };
    }

    return null;
  }

  obtenirCarteSuperieure() {
    return this.defausse[this.defausse.length - 1];
  }

  peutJouerCarte(carte) {
    const superieure = this.obtenirCarteSuperieure();

    if (this.achatEnCours > 0) {
      if (carte.speciale === 'draw2' && superieure.speciale === 'draw2') return true;
      if (carte.speciale === 'wild4') return true;
      return false;
    }

    if (carte.couleur === '⬛') return true;
    if (carte.couleur === this.couleurActuelle) return true;
    if (carte.valeur === superieure.valeur) return true;

    return false;
  }

  jouerCarte(idJoueur, indexCarte, couleurChoisie = null) {
    if (!this.commence) return { succes: false, raison: 'pas_commencee' };
    if (this.obtenirJoueurActuel() !== idJoueur) return { succes: false, raison: 'pas_ton_tour' };

    const main = this.mains[idJoueur];
    if (indexCarte < 0 || indexCarte >= main.length) {
      return { succes: false, raison: 'carte_invalide' };
    }

    const carte = main[indexCarte];
    if (!this.peutJouerCarte(carte)) {
      return { succes: false, raison: 'impossible_jouer_carte' };
    }

    if (carte.speciale === 'wild' || carte.speciale === 'wild4') {
      if (!couleurChoisie || !CONFIG_UNO_MASERATI.CODES_COULEURS[couleurChoisie.toLowerCase()]) {
        return { succes: false, raison: 'choisir_couleur' };
      }
    }

    main.splice(indexCarte, 1);
    this.defausse.push(carte);
    this.dernierCoup = Date.now();
    this.dernierTour = Date.now();

    // Reset timeout au coup joué
    this.timeouts[idJoueur] = 0;

    if (main.length === 1) {
      this.doitDireUno.add(idJoueur);
    }
    this.aDitUno.delete(idJoueur);

    if (main.length === 0) {
      this.gagnant = idJoueur;
      return { succes: true, statut: 'victoire', gagnant: idJoueur, carte };
    }

    let sauterProchain = false;
    let message = '';

    switch (carte.speciale) {
      case 'reverse':
        this.direction *= -1;
        message = '🔄 Direction inversée – circuit retourné !';
        if (this.joueurs.length === 2) sauterProchain = true;
        break;

      case 'skip':
        sauterProchain = true;
        message = '⏭️ Prochain pilote sauté – accélération trident !';
        break;

      case 'draw2':
        this.achatEnCours += 2;
        message = `+2 ! Prochain pilote doit acheter ${this.achatEnCours} cartes ou contrer !`;
        break;

      case 'wild':
        this.couleurActuelle = CONFIG_UNO_MASERATI.CODES_COULEURS[couleurChoisie.toLowerCase()];
        message = `🌈 Couleur changée pour ${CONFIG_UNO_MASERATI.NOMS_COULEURS[this.couleurActuelle]} !`;
        break;

      case 'wild4':
        this.couleurActuelle = CONFIG_UNO_MASERATI.CODES_COULEURS[couleurChoisie.toLowerCase()];
        this.achatEnCours += 4;
        message = `+4 ! Couleur : ${CONFIG_UNO_MASERATI.NOMS_COULEURS[this.couleurActuelle]}. Prochain achète ${this.achatEnCours} ou contre !`;
        break;

      default:
        this.couleurActuelle = carte.couleur;
    }

    this._prochainJoueur(sauterProchain);

    return {
      succes: true,
      statut: 'continue',
      carte,
      message,
      prochainJoueur: this.obtenirJoueurActuel()
    };
  }

  acheterCarte(idJoueur) {
    if (!this.commence) return { succes: false, raison: 'pas_commencee' };
    if (this.obtenirJoueurActuel() !== idJoueur) return { succes: false, raison: 'pas_ton_tour' };

    this.dernierCoup = Date.now();
    this.dernierTour = Date.now();
    this.timeouts[idJoueur] = 0;

    const main = this.mains[idJoueur];

    if (this.achatEnCours > 0) {
      const cartesAchetees = [];
      for (let i = 0; i < this.achatEnCours; i++) {
        if (this.paquet.length === 0) this._remelangerPaquet();
        cartesAchetees.push(this.paquet.pop());
      }
      main.push(...cartesAchetees);
      this.achatEnCours = 0;
      this._prochainJoueur(false);

      return {
        succes: true,
        cartesAchetees,
        count: cartesAchetees.length,
        prochainJoueur: this.obtenirJoueurActuel()
      };
    }

    if (this.paquet.length === 0) this._remelangerPaquet();
    const carteAchetee = this.paquet.pop();
    main.push(carteAchetee);

    if (this.peutJouerCarte(carteAchetee)) {
      return {
        succes: true,
        carteAchetee,
        peutJouer: true,
        indexCarte: main.length - 1
      };
    }

    this._prochainJoueur(false);
    return {
      succes: true,
      carteAchetee,
      peutJouer: false,
      prochainJoueur: this.obtenirJoueurActuel()
    };
  }

  direUno(idJoueur) {
    if (this.doitDireUno.has(idJoueur)) {
      this.aDitUno.add(idJoueur);
      this.doitDireUno.delete(idJoueur);
      return { succes: true };
    }
    return { succes: false, raison: 'pas_de_uno' };
  }

  attraperUno(idAttrapeur, idCible) {
    if (this.doitDireUno.has(idCible) && !this.aDitUno.has(idCible)) {
      for (let i = 0; i < 2; i++) {
        if (this.paquet.length === 0) this._remelangerPaquet();
        this.mains[idCible].push(this.paquet.pop());
      }
      this.doitDireUno.delete(idCible);
      return { succes: true, cible: idCible };
    }
    return { succes: false, raison: 'impossible_attraper' };
  }

  obtenirMainJoueur(idJoueur) {
    return this.mains[idJoueur] || [];
  }

  formaterMain(idJoueur) {
    const main = this.mains[idJoueur];
    if (!main) return 'Tu n’es pas dans la course.';
    return main.map((carte, i) => `${i + 1}. ${carte.affichage}`).join('\n');
  }

  obtenirStatutPartie() {
    if (!this.commence) {
      return {
        commence: false,
        joueurs: this.joueurs,
        hote: this.hote,
        enAttente: CONFIG_UNO_MASERATI.MIN_JOUEURS - this.joueurs.length
      };
    }

    return {
      commence: true,
      carteSuperieure: this.obtenirCarteSuperieure(),
      couleurActuelle: this.couleurActuelle,
      joueurActuel: this.obtenirJoueurActuel(),
      direction: this.direction === 1 ? '➡️' : '⬅️',
      achatEnCours: this.achatEnCours,
      compteCartes: Object.fromEntries(
        this.joueurs.map(p => [p, this.mains[p].length])
      )
    };
  }

  afficherStatut() {
    const statut = this.obtenirStatutPartie();

    if (!statut.commence) {
      let msg = `🃏 *UNO PRESTIGE – ATTENTE DÉPART*\n\n`;
      msg += `👥 Pilotes (\( {this.joueurs.length}/ \){CONFIG_UNO_MASERATI.MAX_JOUEURS}) :\n`;
      this.joueurs.forEach((p, i) => {
        msg += `\( {i + 1}. @ \){obtenirNomPilote(p)}${p === this.hote ? ' 👑' : ''}\n`;
      });
      if (this.joueurs.length < CONFIG_UNO_MASERATI.MIN_JOUEURS) {
        msg += `\n⚠️ Encore ${CONFIG_UNO_MASERATI.MIN_JOUEURS - this.joueurs.length} pilote(s) requis.`;
      } else {
        msg += `\n✅ Prêt pour le départ ! Hôte, lance avec "demarrer".`;
      }
      return { texte: msg, mentions: this.joueurs };
    }

    let msg = `🃏 *UNO PRESTIGE – COURSE EN COURS*\n\n`;
    msg += `🎴 Carte supérieure : ${statut.carteSuperieure.affichage}\n`;
    msg += `🎨 Couleur active : ${statut.couleurActuelle} ${CONFIG_UNO_MASERATI.NOMS_COULEURS[statut.couleurActuelle] || ''}\n`;
    msg += `${statut.direction} Direction\n`;
    if (statut.achatEnCours > 0) {
      msg += `⚠️ Achat forcé : ${statut.achatEnCours} cartes\n`;
    }
    msg += `\n👥 Compte cartes :\n`;
    this.joueurs.forEach(p => {
      const estActuel = p === statut.joueurActuel;
      msg += `\( {estActuel ? '👉 ' : '   '}@ \){obtenirNomPilote(p)} : ${statut.compteCartes[p]} cartes\n`;
    });
    msg += `\n💡 À toi @${obtenirNomPilote(statut.joueurActuel)} – accélère !`;

    return { texte: msg, mentions: this.joueurs };
  }

  _prochainJoueur(sauter = false) {
    let pas = sauter ? 2 : 1;
    this.indexJoueurActuel = (this.indexJoueurActuel + (this.direction * pas) + this.joueurs.length) % this.joueurs.length;
  }

  _remelangerPaquet() {
    const carteSup = this.defausse.pop();
    this.paquet = melangerPaquet(this.defausse);
    this.defausse = [carteSup];
  }
}

// ── GESTIONNAIRE DU PADDOCK UNO ──
class GestionnaireUnoMaserati {
  constructor() {
    this.partiesActives = new Map();
    setInterval(() => this._nettoyerPaddock(), CONFIG_UNO_MASERATI.INTERVALLE_NETTOYAGE_MS);
  }

  creerPartie(idGroupe, idHote) {
    if (this.partiesActives.has(idGroupe)) {
      return this._formatReponse(false, '❌ Une course UNO est déjà en cours dans ce paddock !');
    }

    const partie = new MoteurUnoMaserati(idHote);
    this.partiesActives.set(idGroupe, partie);

    const message = `🃏 *UNO PRESTIGE – COURSE CRÉÉE !*\n\n` +
                    `👑 Hôte : @${obtenirNomPilote(idHote)}\n\n` +
                    `📝 Commandes :\n` +
                    `• "entrer" – Rejoindre la grille\n` +
                    `• "sortir" – Quitter la course\n` +
                    `• "demarrer" – Lancer (hôte)\n` +
                    `• "annuler" – Annuler (hôte)\n\n` +
                    `👥 Pilotes : 1/${CONFIG_UNO_MASERATI.MAX_JOUEURS}\n` +
                    `⏳ Minimum : ${CONFIG_UNO_MASERATI.MIN_JOUEURS} pilotes`;

    return this._formatReponse(true, message, { mentions: [idHote] });
  }

  rejoindrePartie(idGroupe, idJoueur) {
    const partie = this.partiesActives.get(idGroupe);
    if (!partie) return this._formatReponse(false, '❌ Aucune course UNO dans ce paddock !');

    const resultat = partie.ajouterJoueur(idJoueur);
    if (!resultat.succes) {
      const erreurs = {
        'partie_commencee': '❌ La course a déjà démarré !',
        'partie_pleine': '❌ Grille complète – trop tard !',
        'deja_inscrit': '❌ Tu es déjà sur la grille !'
      };
      return this._formatReponse(false, erreurs[resultat.raison]);
    }

    const statut = partie.afficherStatut();
    return this._formatReponse(true, `✅ @\( {obtenirNomPilote(idJoueur)} rejoint la course !\n\n \){statut.texte}`, { mentions: statut.mentions });
  }

  quitterPartie(idGroupe, idJoueur) {
    const partie = this.partiesActives.get(idGroupe);
    if (!partie) return this._formatReponse(false, '❌ Aucune course UNO dans ce paddock !');

    const resultat = partie.retirerJoueur(idJoueur);
    if (!resultat.succes) {
      const erreurs = {
        'pas_dans_la_partie': '❌ Tu n’es pas dans la course !',
        'hote_ne_peut_pas_partir': '❌ L’hôte ne peut pas abandonner avant le départ ! Utilise "annuler".'
      };
      return this._formatReponse(false, erreurs[resultat.raison]);
    }

    if (resultat.partieTerminee) {
      this.partiesActives.delete(idGroupe);
      return this._formatReponse(true,
        `👋 @${obtenirNomPilote(resultat.joueurParti)} a abandonné la piste !\n\n` +
        `🎉 @${obtenirNomPilote(resultat.gagnant)} remporte la victoire par forfait ! 🏆`,
        { mentions: [resultat.joueurParti, resultat.gagnant], terminee: true, gagnant: resultat.gagnant }
      );
    }

    if (resultat.prochainJoueur) {
      const statut = partie.afficherStatut();
      return this._formatReponse(true,
        `👋 @\( {obtenirNomPilote(resultat.joueurParti)} quitte la course !\n\n \){statut.texte}`,
        { mentions: [...statut.mentions, resultat.joueurParti] }
      );
    }

    return this._formatReponse(true, `👋 @${obtenirNomPilote(idJoueur)} quitte la grille.`, { mentions: [idJoueur] });
  }

  demarrerCourse(idGroupe, idJoueur) {
    const partie = this.partiesActives.get(idGroupe);
    if (!partie) return this._formatReponse(false, '❌ Aucune course UNO dans ce paddock !');
    if (partie.hote !== idJoueur) return this._formatReponse(false, '❌ Seul l’hôte peut donner le départ !');

    const resultat = partie.demarrerPartie();
    if (!resultat.succes) {
      const erreurs = {
        'deja_commencee': '❌ La course a déjà démarré !',
        'pas_assez_de_joueurs': `❌ Il faut minimum ${CONFIG_UNO_MASERATI.MIN_JOUEURS} pilotes pour lancer !`
      };
      return this._formatReponse(false, erreurs[resultat.raison]);
    }

    const statut = partie.afficherStatut();
    let message = `🃏 *UNO PRESTIGE – DÉPART DONNÉ !*\n\n`;
    message += `🎴 Première carte : ${resultat.premiereCarte.affichage}\n\n`;
    message += statut.texte;
    message += `\n\n📝 Commandes :\n`;
    message += `• "jouer <n>" – Jouer carte\n`;
    message += `• "jouer <n> <couleur>" – Joker ou +4\n`;
    message += `• "acheter" – Piocher\n`;
    message += `• "uno" – Crier UNO !\n`;
    message += `• "main" – Voir tes cartes (privé)`;

    return this._formatReponse(true, message, {
      mentions: statut.mentions,
      commencee: true,
      envoyerMains: true,
      joueurs: partie.joueurs,
      mains: Object.fromEntries(
        partie.joueurs.map(p => [p, partie.formaterMain(p)])
      )
    });
  }

  jouerCarte(idGroupe, idJoueur, indexCarte, couleurChoisie = null) {
    const partie = this.partiesActives.get(idGroupe);
    if (!partie) return this._formatReponse(false, '❌ Aucune course UNO dans ce paddock !');

    const resultat = partie.jouerCarte(idJoueur, indexCarte, couleurChoisie);
    if (!resultat.succes) {
      const erreurs = {
        'pas_commencee': '❌ La course n’a pas encore démarré !',
        'pas_ton_tour': '❌ Ce n’est pas ton tour – attends ton signal !',
        'carte_invalide': '❌ Numéro de carte invalide !',
        'impossible_jouer_carte': '❌ Cette carte ne peut pas être jouée ici !',
        'choisir_couleur': '❌ Choisis une couleur ! Ex : jouer 5 bleu'
      };
      return this._formatReponse(false, erreurs[resultat.raison]);
    }

    if (resultat.statut === 'victoire') {
      this.partiesActives.delete(idGroupe);
      const message = `🃏 *UNO PRESTIGE – ARRIVÉE !*\n\n` +
                      `🏁 @${obtenirNomPilote(resultat.gagnant)} remporte la victoire ! 🏆\n\n` +
                      `🎴 Dernière carte : ${resultat.carte.affichage}`;
      return this._formatReponse(true, message, { terminee: true, gagnant: resultat.gagnant, mentions: [resultat.gagnant] });
    }

    const statut = partie.afficherStatut();
    let message = `🎴 @${obtenirNomPilote(idJoueur)} joue ${resultat.carte.affichage}\n`;
    if (resultat.message) message += `${resultat.message}\n`;
    message += `\n${statut.texte}`;

    return this._formatReponse(true, message, { mentions: statut.mentions });
  }

  piocherCarte(idGroupe, idJoueur) {
    const partie = this.partiesActives.get(idGroupe);
    if (!partie) return this._formatReponse(false, '❌ Aucune course UNO dans ce paddock !');

    const resultat = partie.acheterCarte(idJoueur);
    if (!resultat.succes) {
      const erreurs = {
        'pas_commencee': '❌ La course n’a pas encore démarré !',
        'pas_ton_tour': '❌ Ce n’est pas ton tour !'
      };
      return this._formatReponse(false, erreurs[resultat.raison]);
    }

    if (resultat.count) {
      const statut = partie.afficherStatut();
      const message = `📥 @${obtenirNomPilote(idJoueur)} achète \( {resultat.count} cartes !\n\n \){statut.texte}`;
      return this._formatReponse(true, message, {
        mentions: statut.mentions,
        cartesAchetees: resultat.cartesAchetees,
        envoyerAuJoueur: idJoueur
      });
    }

    if (resultat.peutJouer) {
      return this._formatReponse(true,
        `📥 Tu as pioché ${resultat.carteAchetee.affichage}\n✅ Tu peux jouer cette carte ! Utilise "jouer ${resultat.indexCarte + 1}"`,
        { envoyerAuJoueur: idJoueur, peutJouer: true }
      );
    }

    const statut = partie.afficherStatut();
    const message = `📥 @\( {obtenirNomPilote(idJoueur)} pioche une carte et passe son tour.\n\n \){statut.texte}`;
    return this._formatReponse(true, message, {
      mentions: statut.mentions,
      carteAchetee: resultat.carteAchetee,
      envoyerAuJoueur: idJoueur
    });
  }

  crierUno(idGroupe, idJoueur) {
    const partie = this.partiesActives.get(idGroupe);
    if (!partie) return this._formatReponse(false, '❌ Aucune course UNO dans ce paddock !');

    const resultat = partie.direUno(idJoueur);
    if (resultat.succes) {
      return this._formatReponse(true, `🎉 @${obtenirNomPilote(idJoueur)} crie *UNO !*`, { mentions: [idJoueur] });
    }
    return this._formatReponse(false, '❌ Tu n’as pas de UNO à crier !');
  }

  attraperUno(idGroupe, idAttrapeur, idCible) {
    const partie = this.partiesActives.get(idGroupe);
    if (!partie) return this._formatReponse(false, '❌ Aucune course UNO dans ce paddock !');

    const resultat = partie.attraperUno(idAttrapeur, idCible);
    if (resultat.succes) {
      return this._formatReponse(true,
        `🚨 @\( {obtenirNomPilote(idAttrapeur)} attrape @ \){obtenirNomPilote(idCible)} sans crier UNO !\n` +
        `📥 @${obtenirNomPilote(idCible)} pioche 2 cartes de pénalité !`,
        { mentions: [idAttrapeur, idCible] }
      );
    }
    return this._formatReponse(false, '❌ Personne à attraper !');
  }

  obtenirMain(idGroupe, idJoueur) {
    const partie = this.partiesActives.get(idGroupe);
    if (!partie) return null;
    return partie.formaterMain(idJoueur);
  }

  verifierTimeout(idGroupe) {
    const partie = this.partiesActives.get(idGroupe);
    if (!partie) return null;

    const resultatTimeout = partie.verifierEtGererTimeout();
    if (!resultatTimeout) return null;

    if (resultatTimeout.type === 'expulse_et_gagne') {
      this.partiesActives.delete(idGroupe);
      return this._formatReponse(true,
        `⏰ @\( {obtenirNomPilote(resultatTimeout.joueurExpulse)} expulsé pour inactivité ( \){resultatTimeout.compteurTimeout} timeouts) !\n\n` +
        `🎉 @${obtenirNomPilote(resultatTimeout.gagnant)} gagne par forfait ! 🏆`,
        { mentions: [resultatTimeout.joueurExpulse, resultatTimeout.gagnant], terminee: true, gagnant: resultatTimeout.gagnant }
      );
    }

    if (resultatTimeout.type === 'expulse') {
      const statut = partie.afficherStatut();
      return this._formatReponse(true,
        `⏰ @\( {obtenirNomPilote(resultatTimeout.joueurExpulse)} expulsé pour inactivité ( \){resultatTimeout.compteurTimeout} timeouts) !\n\n${statut.texte}`,
        { mentions: [...statut.mentions, resultatTimeout.joueurExpulse] }
      );
    }

    if (resultatTimeout.type === 'timeout') {
      const statut = partie.afficherStatut();
      return this._formatReponse(true,
        `⏰ @${obtenirNomPilote(resultatTimeout.joueur)} trop lent !\n` +
        `📥 Pioche 1 carte et perd son tour (\( {resultatTimeout.compteurTimeout}/ \){CONFIG_UNO_MASERATI.MAX_TIMEOUTS_CONSECUTIFS} avertissements)\n\n${statut.texte}`,
        { mentions: [...statut.mentions, resultatTimeout.joueur] }
      );
    }

    return null;
  }

  obtenirStatut(idGroupe) {
    const partie = this.partiesActives.get(idGroupe);
    if (!partie) return this._formatReponse(false, '❌ Aucune course UNO dans ce paddock !');

    const statut = partie.afficherStatut();
    return this._formatReponse(true, statut.texte, { mentions: statut.mentions });
  }

  annulerCourse(idGroupe, idJoueur, estAdmin = false) {
    const partie = this.partiesActives.get(idGroupe);
    if (!partie) return this._formatReponse(false, '❌ Aucune course UNO dans ce paddock !');

    if (partie.hote !== idJoueur && !estAdmin) {
      return this._formatReponse(false, '❌ Seul l’hôte ou les admins peuvent annuler la course !');
    }

    const pilotes = partie.joueurs;
    this.partiesActives.delete(idGroupe);
    return this._formatReponse(true, '🃏 Course UNO annulée – retour au garage !', { mentions: pilotes });
  }

  courseActive = (idGroupe) => this.partiesActives.has(idGroupe);
  obtenirCourseActive = (idGroupe) => this.partiesActives.get(idGroupe);

  _formatReponse(succes, message, extras = {}) {
    return { succes, message, ...extras };
  }

  _nettoyerPaddock() {
    const maintenant = Date.now();
    for (const [idGroupe, partie] of this.partiesActives) {
      const delai = partie.commence ? CONFIG_UNO_MASERATI.DELAI_PARTIE_MS : CONFIG_UNO_MASERATI.DELAI_INVITATION_MS;
      if (maintenant - partie.dernierCoup > delai) {
        this.partiesActives.delete(idGroupe);
      }
    }
  }
}

// Singleton – un seul paddock UNO maître
const gestionnaire = new GestionnaireUnoMaserati();

// Exports prestige
export {
  UnoGame: MoteurUnoMaserati,
  UnoManager: GestionnaireUnoMaserati,
  gestionnaire as unoManager
};

export default gestionnaire;
