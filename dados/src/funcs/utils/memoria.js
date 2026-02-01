/**
 * Jeu de Mémoire Prestige - Édition Maserati
 * Memory Game revisité en mode circuit luxe
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FICHIER_RANKING_MEMOIRE = path.join(__dirname, '../../../database/ranking_memoire_maserati.json');

// ── CONFIGURATION PRESTIGE ──
const CONFIG_MEMOIRE_MASERATI = {
  DELAI_PARTIE_MS: 30 * 60 * 1000,          // 30 min max – pas de pilote qui traîne
  INTERVALLE_NETTOYAGE_MS: 5 * 60 * 1000,   // Nettoyage paddock toutes les 5 min
  TAILLE_GRILLE: 4,                         // 4×4 = 16 cases = 8 paires
  EMOJIS_DISPONIBLES: ['🍎', '🍊', '🍋', '🍇', '🍉', '🍓', '🍒', '🥝', '🍌', '🥭', '🍍', '🥥', '🍑', '🍐', '🫐', '🍈'],
  CASE_CACHEE: '🔲',
  DELAI_REVELATION_MS: 2000                 // Temps pour voir les cartes – précision MC20
};

// Helper nom pilote prestige
const obtenirNomPilote = (userId) => {
  if (!userId || typeof userId !== 'string') return 'pilote anonyme';
  return userId.split('@')[0] || userId;
};

// Mélange array – départ lancé
const melangerTableau = (array) => {
  const melange = [...array];
  for (let i = melange.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [melange[i], melange[j]] = [melange[j], melange[i]];
  }
  return melange;
};

// Position → coordonnées (ligne/colonne)
const positionVersCoords = (position) => {
  const index = position - 1;
  return {
    ligne: Math.floor(index / CONFIG_MEMOIRE_MASERATI.TAILLE_GRILLE),
    colonne: index % CONFIG_MEMOIRE_MASERATI.TAILLE_GRILLE
  };
};

// Coordonnées → position (1 à 16)
const coordsVersPosition = (ligne, colonne) => ligne * CONFIG_MEMOIRE_MASERATI.TAILLE_GRILLE + colonne + 1;

// ── MOTEUR DU JEU – V8 MÉMOIRE ──
class MoteurMemoireMaserati {
  constructor(idPilote) {
    this.pilote = idPilote;
    this.tailleGrille = CONFIG_MEMOIRE_MASERATI.TAILLE_GRILLE;
    this.pairesTotales = (this.tailleGrille * this.tailleGrille) / 2;
    this.grille = this._creerGrille();
    this.revelees = Array(this.tailleGrille).fill(null).map(() => Array(this.tailleGrille).fill(false));
    this.trouvees = Array(this.tailleGrille).fill(null).map(() => Array(this.tailleGrille).fill(false));
    this.tentatives = 0;
    this.pairesTrouvees = 0;
    this.premiereCarte = null;
    this.dernierCoup = Date.now();
    this.debutPartie = Date.now();
    this.terminee = false;
  }

  _creerGrille() {
    // Sélection aléatoire d’emojis prestige
    const emojisChoisis = melangerTableau(CONFIG_MEMOIRE_MASERATI.EMOJIS).slice(0, this.pairesTotales);
    // Duplication pour paires
    const paires = [...emojisChoisis, ...emojisChoisis];
    // Mélange final – circuit imprévisible
    const melange = melangerTableau(paires);

    const grille = [];
    for (let i = 0; i < this.tailleGrille; i++) {
      grille.push(melange.slice(i * this.tailleGrille, (i + 1) * this.tailleGrille));
    }
    return grille;
  }

  revelerCarte(position) {
    if (this.terminee) return { succes: false, raison: 'partie_terminee' };

    const { ligne, colonne } = positionVersCoords(position);

    if (ligne < 0 || ligne >= this.tailleGrille || colonne < 0 || colonne >= this.tailleGrille) {
      return { succes: false, raison: 'position_invalide' };
    }

    if (this.revelees[ligne][colonne] || this.trouvees[ligne][colonne]) {
      return { succes: false, raison: 'deja_revelee' };
    }

    this.dernierCoup = Date.now();
    this.revelees[ligne][colonne] = true;

    if (this.premiereCarte === null) {
      // Première carte du tour
      this.premiereCarte = { ligne, colonne, emoji: this.grille[ligne][colonne] };
      return {
        succes: true,
        statut: 'premiere_carte',
        emoji: this.grille[ligne][colonne],
        position
      };
    }

    // Deuxième carte – tentative complète
    this.tentatives++;
    const secondeCarte = { ligne, colonne, emoji: this.grille[ligne][colonne] };
    const premiereCarte = this.premiereCarte;
    this.premiereCarte = null;

    if (premiereCarte.emoji === secondeCarte.emoji) {
      // Paire trouvée – trident aligné !
      this.trouvees[premiereCarte.ligne][premiereCarte.colonne] = true;
      this.trouvees[secondeCarte.ligne][secondeCarte.colonne] = true;
      this.pairesTrouvees++;

      if (this.pairesTrouvees === this.pairesTotales) {
        // Victoire – drapeau à damier !
        this.terminee = true;
        const tempsPris = Math.floor((Date.now() - this.debutPartie) / 1000);
        return {
          succes: true,
          statut: 'victoire',
          tentatives: this.tentatives,
          tempsPris,
          emoji: secondeCarte.emoji
        };
      }

      return {
        succes: true,
        statut: 'paire_trouvee',
        emoji: secondeCarte.emoji,
        pairesTrouvees: this.pairesTrouvees,
        pairesTotales: this.pairesTotales
      };
    }

    // Pas une paire – retour au cache
    this.revelees[premiereCarte.ligne][premiereCarte.colonne] = false;
    this.revelees[secondeCarte.ligne][secondeCarte.colonne] = false;

    return {
      succes: true,
      statut: 'pas_de_paire',
      premiereEmoji: premiereCarte.emoji,
      secondeEmoji: secondeCarte.emoji,
      premierePos: coordsVersPosition(premiereCarte.ligne, premiereCarte.colonne),
      secondePos: coordsVersPosition(secondeCarte.ligne, secondeCarte.colonne)
    };
  }

  // Affichage grille prestige – vue cockpit
  afficherGrille(toutReveler = false) {
    let grille = '';
    let position = 1;

    // En-tête numéros colonnes – piste numérotée
    grille += '    ';
    for (let c = 1; c <= this.tailleGrille; c++) {
      grille += ` ${c}  `;
    }
    grille += '\n';

    const etiquettesLignes = ['A', 'B', 'C', 'D']; // Pour 4×4

    for (let r = 0; r < this.tailleGrille; r++) {
      grille += ` ${etiquettesLignes[r]} `;
      for (let c = 0; c < this.tailleGrille; c++) {
        if (toutReveler || this.trouvees[r][c] || this.revelees[r][c]) {
          grille += ` ${this.grille[r][c]} `;
        } else {
          const pos = coordsVersPosition(r, c);
          grille += pos < 10 ? ` \( {CONFIG_MEMOIRE_MASERATI.CASE_CACHEE} ` : ` \){CONFIG_MEMOIRE_MASERATI.CASE_CACHEE} `;
        }
      }
      grille += '\n';
    }

    return grille;
  }

  // Affichage avec numéros de cases – pour jouer
  afficherGrilleAvecNumeros() {
    let grille = '';
    let position = 1;

    for (let r = 0; r < this.tailleGrille; r++) {
      for (let c = 0; c < this.tailleGrille; c++) {
        if (this.trouvees[r][c]) {
          grille += ` ${this.grille[r][c]} `;
        } else if (this.revelees[r][c]) {
          grille += ` ${this.grille[r][c]} `;
        } else {
          const pos = coordsVersPosition(r, c);
          grille += pos < 10 ? ` \( {pos}️⃣ ` : ` \){pos} `;
        }
      }
      grille += '\n';
    }

    return grille;
  }

  obtenirStatut() {
    return {
      tentatives: this.tentatives,
      pairesTrouvees: this.pairesTrouvees,
      pairesTotales: this.pairesTotales,
      terminee: this.terminee,
      enAttenteSecondeCarte: this.premiereCarte !== null
    };
  }
}

// ── RANKING – CIRCUIT DES LÉGENDES ──
const chargerRankingMemoire = () => {
  try {
    if (fs.existsSync(FICHIER_RANKING_MEMOIRE)) {
      return JSON.parse(fs.readFileSync(FICHIER_RANKING_MEMOIRE, 'utf8'));
    }
  } catch (err) {
    console.error('[Maserati-Mémoire] Erreur chargement ranking :', err.message);
  }
  return { classements: [] };
};

const sauvegarderRankingMemoire = (data) => {
  try {
    const dossier = path.dirname(FICHIER_RANKING_MEMOIRE);
    if (!fs.existsSync(dossier)) {
      fs.mkdirSync(dossier, { recursive: true });
    }
    fs.writeFileSync(FICHIER_RANKING_MEMOIRE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('[Maserati-Mémoire] Erreur sauvegarde ranking :', err.message);
  }
};

const ajouterAuRanking = (userId, tentatives, tempsPris) => {
  const data = chargerRankingMemoire();
  data.classements.push({
    piloteId: userId,
    tentatives,
    tempsPris,
    date: new Date().toISOString()
  });

  // Tri : moins de tentatives = mieux, puis temps le plus court
  data.classements.sort((a, b) => {
    if (a.tentatives !== b.tentatives) return a.tentatives - b.tentatives;
    return a.tempsPris - b.tempsPris;
  });

  // Top 100 légendes
  data.classements = data.classements.slice(0, 100);
  sauvegarderRankingMemoire(data);

  // Position dans le classement
  return data.classements.findIndex(r => r.piloteId === userId && r.tentatives === tentatives) + 1;
};

const obtenirTopRanking = (limite = 10) => {
  const data = chargerRankingMemoire();
  return data.classements.slice(0, limite);
};

const obtenirMeilleurPilote = (userId) => {
  const data = chargerRankingMemoire();
  return data.classements.find(r => r.piloteId === userId);
};

// ── GESTIONNAIRE DU PADDOCK MÉMOIRE ──
class GestionnaireMemoireMaserati {
  constructor() {
    this.partiesActives = new Map(); // groupId → moteur
    setInterval(() => this._nettoyerPaddock(), CONFIG_MEMOIRE_MASERATI.INTERVALLE_NETTOYAGE_MS);
  }

  lancerPartie(idGroupe, idPilote) {
    if (this.partiesActives.has(idGroupe)) {
      return this._formatReponse(false, '❌ Un jeu de mémoire est déjà en cours dans ce paddock !');
    }

    const partie = new MoteurMemoireMaserati(idPilote);
    this.partiesActives.set(idGroupe, partie);

    const message = `🧠 *JEU DE MÉMOIRE PRESTIGE*\n\n` +
                    `👤 Pilote : @${obtenirNomPilote(idPilote)}\n` +
                    `🎯 Trouve les ${partie.pairesTotales} paires !\n\n` +
                    `${partie.afficherGrilleAvecNumeros()}\n` +
                    `📝 Choisis une position en tapant son numéro (1 à 16)\n` +
                    `💡 Exemple : "8" ou "memoire 12"`;

    return this._formatReponse(true, message, { mentions: [idPilote] });
  }

  jouerCoup(idGroupe, idPilote, position) {
    const partie = this.partiesActives.get(idGroupe);
    if (!partie) return this._formatReponse(false, '❌ Aucun jeu de mémoire actif !');

    if (partie.pilote !== idPilote) {
      return this._formatReponse(false, '❌ Ce n’est pas ton jeu – attends ton tour ou lance le tien !');
    }

    const resultat = partie.revelerCarte(parseInt(position));

    if (!resultat.succes) {
      const erreurs = {
        'partie_terminee': '❌ La partie est déjà terminée !',
        'position_invalide': '❌ Position invalide ! Choisis entre 1 et 16.',
        'deja_revelee': '❌ Cette carte est déjà révélée !'
      };
      return this._formatReponse(false, erreurs[resultat.raison] || '❌ Erreur inconnue');
    }

    const statut = partie.obtenirStatut();

    if (resultat.statut === 'premiere_carte') {
      const message = `🧠 *JEU DE MÉMOIRE*\n\n` +
                      `🎴 Position ${resultat.position} : ${resultat.emoji}\n` +
                      `👆 Choisis la seconde carte !\n\n` +
                      `${partie.afficherGrilleAvecNumeros()}\n` +
                      `📊 Tentatives : ${statut.tentatives} | Paires : \( {statut.pairesTrouvees}/ \){statut.pairesTotales}`;
      return this._formatReponse(true, message);
    }

    if (resultat.statut === 'paire_trouvee') {
      const message = `🧠 *JEU DE MÉMOIRE*\n\n` +
                      `✅ *PAIRE TROUVÉE !* \( {resultat.emoji} \){resultat.emoji}\n\n` +
                      `${partie.afficherGrilleAvecNumeros()}\n` +
                      `📊 Tentatives : ${statut.tentatives} | Paires : \( {statut.pairesTrouvees}/ \){statut.pairesTotales}`;
      return this._formatReponse(true, message);
    }

    if (resultat.statut === 'pas_de_paire') {
      const message = `🧠 *JEU DE MÉMOIRE*\n\n` +
                      `❌ Pas une paire !\n` +
                      `${resultat.premierePos}: ${resultat.premiereEmoji} ≠ ${resultat.secondePos}: ${resultat.secondeEmoji}\n\n` +
                      `${partie.afficherGrilleAvecNumeros()}\n` +
                      `📊 Tentatives : ${statut.tentatives} | Paires : \( {statut.pairesTrouvees}/ \){statut.pairesTotales}`;
      return this._formatReponse(true, message);
    }

    if (resultat.statut === 'victoire') {
      this.partiesActives.delete(idGroupe);
      const positionRanking = ajouterAuRanking(idPilote, resultat.tentatives, resultat.tempsPris);
      const minutes = Math.floor(resultat.tempsPris / 60);
      const secondes = resultat.tempsPris % 60;
      const tempsStr = minutes > 0 ? `${minutes}m \( {secondes}s` : ` \){secondes}s`;

      const message = `🧠 *JEU DE MÉMOIRE – VICTOIRE !*\n\n` +
                      `🏁 @${obtenirNomPilote(idPilote)} termine le circuit !\n\n` +
                      `${partie.afficherGrille(true)}\n` +
                      `📊 *Stats de course :*\n` +
                      `• Tentatives : ${resultat.tentatives}\n` +
                      `• Temps : ${tempsStr}\n` +
                      `• Position circuit : #${positionRanking}\n\n` +
                      `${resultat.tentatives <= 12 ? '🏆 *CONQUÊTE DÉBLOQUÉE : Mémoire de V8 !*' : ''}`;

      return this._formatReponse(true, message, {
        terminee: true,
        gagnant: idPilote,
        tentatives: resultat.tentatives,
        mentions: [idPilote]
      });
    }
  }

  arreterPartie(idGroupe, idPilote, estAdmin = false) {
    const partie = this.partiesActives.get(idGroupe);
    if (!partie) return this._formatReponse(false, '❌ Aucun jeu de mémoire en cours !');

    if (partie.pilote !== idPilote && !estAdmin) {
      return this._formatReponse(false, '❌ Seuls le pilote ou les admins peuvent arrêter la partie !');
    }

    this.partiesActives.delete(idGroupe);
    return this._formatReponse(true, '🧠 Partie mémoire arrêtée – retour au garage !');
  }

  obtenirRanking() {
    const classements = obtenirTopRanking(10);
    if (classements.length === 0) {
      return this._formatReponse(true, '🧠 *CIRCUIT DES LÉGENDES – MÉMOIRE*\n\nAucun record pour l’instant – sois le premier !');
    }

    let message = '🧠 *CIRCUIT DES LÉGENDES – MÉMOIRE*\n\n';
    classements.forEach((r, i) => {
      const medaille = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
      const minutes = Math.floor(r.tempsPris / 60);
      const secondes = r.tempsPris % 60;
      const tempsStr = minutes > 0 ? `\( {minutes}m \){secondes}s` : `${secondes}s`;
      message += `\( {medaille} @ \){obtenirNomPilote(r.piloteId)} – \( {r.tentatives} tentatives ( \){tempsStr})\n`;
    });

    return this._formatReponse(true, message, { mentions: classements.map(r => r.piloteId) });
  }

  partieActive = (idGroupe) => this.partiesActives.has(idGroupe);
  obtenirPartieActive = (idGroupe) => this.partiesActives.get(idGroupe);

  _formatReponse(succes, message, extras = {}) {
    return { succes, message, ...extras };
  }

  _nettoyerPaddock() {
    const maintenant = Date.now();
    for (const [idGroupe, partie] of this.partiesActives) {
      if (maintenant - partie.dernierCoup > CONFIG_MEMOIRE_MASERATI.DELAI_PARTIE_MS) {
        this.partiesActives.delete(idGroupe);
      }
    }
  }
}

// Singleton – un seul paddock mémoire maître
const gestionnaire = new GestionnaireMemoireMaserati();

// Exports prestige
export {
  MoteurMemoireMaserati,
  GestionnaireMemoireMaserati,
  gestionnaire as gestionnaireMemoire
};

export default gestionnaire;
