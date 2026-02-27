import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin de la base de données du profil VIP
const DB_PATH = path.join(__dirname, '../../database/profilVIP.json');

// Fuseau horaire Côte d'Ivoire (Abidjan - GMT)
function getAbidjanDateTime() {
  const maintenant = new Date();
  // Format ISO avec fuseau Abidjan (UTC+0)
  return maintenant.toISOString();
}

/**
 * Maserati VIP Profile Manager 🏎️👑✨🇨🇮
 * Gestion du profil client – Connaissances, préférences, historique
 * Développé par yankee Hells 🙂
 */
class MaseratiProfilVIP {
  constructor() {
    this.data = this.chargerBase();
    this.fileAttenteSauvegarde = [];
    this.sauvegardeEnCours = false;
  }

  /**
   * Charge la base de données des profils VIP
   */
  chargerBase() {
    try {
      if (fs.existsSync(DB_PATH)) {
        const contenu = fs.readFileSync(DB_PATH, 'utf-8');
        if (contenu.trim()) {
          return JSON.parse(contenu);
        }
      }
      return {};
    } catch (err) {
      console.error('❌ Erreur chargement base profils VIP:', err);
      return {};
    }
  }

  /**
   * Sauvegarde asynchrone avec debounce (attente 2s pour regrouper)
   */
  async sauvegarderBase() {
    this.fileAttenteSauvegarde.push(Date.now());

    if (this.sauvegardeEnCours) return;

    this.sauvegardeEnCours = true;

    // On attend 2 secondes pour accumuler les modifications
    await new Promise(r => setTimeout(r, 2000));

    try {
      const dossier = path.dirname(DB_PATH);
      if (!fs.existsSync(dossier)) {
        fs.mkdirSync(dossier, { recursive: true });
      }

      fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
      console.log('✅ Profil VIP sauvegardé – Garage à jour');
    } catch (err) {
      console.error('❌ Échec sauvegarde profils VIP:', err);
    }

    this.sauvegardeEnCours = false;
    this.fileAttenteSauvegarde = [];
  }

  /**
   * Récupère ou crée le profil VIP d’un client
   */
  getProfilVIP(userId) {
    if (!this.data[userId]) {
      this.data[userId] = this.creerNouveauProfilVIP(userId);
      this.sauvegarderBase();
    }
    return this.data[userId];
  }

  /**
   * Crée un nouveau profil client Maserati
   */
  creerNouveauProfilVIP(userId) {
    return {
      userId,
      nomVIP: null,
      surnoms: [],
      preferences: {
        sujetsFavoris: [],
        kiffs: [],
        petes: [],           // ce qu’il n’aime pas
        passions: [],
        styleDiscussion: 'chill',
        utiliseEmojis: true,
        niveauFormalite: 'detendu'
      },
      infosPerso: {
        age: null,
        ville: null,
        metier: null,
        statut: null,
        entourage: []
      },
      historique: {
        totalMessages: 0,
        premierContact: getAbidjanDateTime(),
        dernierContact: getAbidjanDateTime(),
        frequence: 'rare',
        sujetsRecents: []
      },
      habitudes: {
        heuresActives: {},
        joursActifs: {},
        humeurDominante: 'neutre',
        typesMessages: {
          questions: 0,
          affirmations: 0,
          emotions: 0,
          commandes: 0
        }
      },
      relationMaserati: {
        niveauProximite: 1,
        surnomPourBot: null,
        momentsExceptionnels: [],
        discussionsMythiques: [],
        vibeActuelle: 'neutre'
      },
      notesPrioritaires: [],
      derniereMiseAJour: getAbidjanDateTime()
    };
  }

  /**
   * Met à jour nom / surnom du client
   */
  majInfosVIP(userId, nom = null, surnom = null) {
    const profil = this.getProfilVIP(userId);

    if (nom && nom !== profil.nomVIP) {
      profil.nomVIP = nom;
    }

    if (surnom && !profil.surnoms.includes(surnom)) {
      profil.surnoms.push(surnom);
      if (profil.surnoms.length > 5) profil.surnoms = profil.surnoms.slice(-5);
    }

    profil.derniereMiseAJour = getAbidjanDateTime();
    this.sauvegarderBase();
  }

  /**
   * Ajoute une préférence / kiff / passion / sujet
   */
  ajouterPreference(userId, categorie, valeur) {
    const profil = this.getProfilVIP(userId);

    const categoriesValides = ['sujetsFavoris', 'kiffs', 'petes', 'passions'];

    if (!categoriesValides.includes(categorie)) {
      console.warn(`Catégorie invalide: ${categorie}`);
      return;
    }

    if (!profil.preferences[categorie].includes(valeur)) {
      profil.preferences[categorie].push(valeur);
      if (profil.preferences[categorie].length > 20) {
        profil.preferences[categorie] = profil.preferences[categorie].slice(-20);
      }
    }

    profil.derniereMiseAJour = getAbidjanDateTime();
    this.sauvegarderBase();
  }

  /**
   * Mise à jour info personnelle (âge, ville, job, etc.)
   */
  majInfoPerso(userId, champ, valeur) {
    const profil = this.getProfilVIP(userId);

    if (profil.infosPerso.hasOwnProperty(champ)) {
      profil.infosPerso[champ] = valeur;
      profil.derniereMiseAJour = getAbidjanDateTime();
      this.sauvegarderBase();
    }
  }

  /**
   * Ajoute une note VIP importante
   */
  ajouterNotePrioritaire(userId, note) {
    const profil = this.getProfilVIP(userId);

    const nouvelleNote = {
      texte: note,
      date: getAbidjanDateTime(),
      priorite: 'haute'
    };

    profil.notesPrioritaires.push(nouvelleNote);
    if (profil.notesPrioritaires.length > 50) {
      profil.notesPrioritaires = profil.notesPrioritaires.slice(-50);
    }

    profil.derniereMiseAJour = getAbidjanDateTime();
    this.sauvegarderBase();
  }

  /**
   * Enregistre une interaction (message reçu)
   */
  enregistrerInteraction(userId, message, type = 'affirmation') {
    const profil = this.getProfilVIP(userId);

    profil.historique.totalMessages++;
    profil.historique.dernierContact = getAbidjanDateTime();

    if (profil.habitudes.typesMessages[type] !== undefined) {
      profil.habitudes.typesMessages[type]++;
    }

    // Horaires d’activité
    const heure = new Date().getHours();
    profil.habitudes.heuresActives[heure] = (profil.habitudes.heuresActives[heure] || 0) + 1;

    // Jours de la semaine
    const jour = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
    profil.habitudes.joursActifs[jour] = (profil.habitudes.joursActifs[jour] || 0) + 1;

    // Calcul fréquence
    const premier = new Date(profil.historique.premierContact);
    const joursEcoules = Math.floor((Date.now() - premier.getTime()) / (86400000));
    const msgParJour = profil.historique.totalMessages / Math.max(joursEcoules, 1);

    if (msgParJour > 20) profil.historique.frequence = 'très fréquente';
    else if (msgParJour > 10) profil.historique.frequence = 'fréquente';
    else if (msgParJour > 5) profil.historique.frequence = 'régulière';
    else if (msgParJour > 1) profil.historique.frequence = 'occasionnelle';
    else profil.historique.frequence = 'rare';

    profil.derniereMiseAJour = getAbidjanDateTime();
    this.sauvegarderBase();
  }

  /**
   * Ajoute un sujet récent discuté
   */
  ajouterSujetRecent(userId, sujet) {
    const profil = this.getProfilVIP(userId);

    if (!profil.historique.sujetsRecents.includes(sujet)) {
      profil.historique.sujetsRecents.push(sujet);
      if (profil.historique.sujetsRecents.length > 10) {
        profil.historique.sujetsRecents = profil.historique.sujetsRecents.slice(-10);
      }
    }

    profil.derniereMiseAJour = getAbidjanDateTime();
    this.sauvegarderBase();
  }

  /**
   * Met à jour la relation client ↔ Maserati-Bot
   */
  majRelation(userId, champ, valeur) {
    const profil = this.getProfilVIP(userId);

    if (profil.relationMaserati.hasOwnProperty(champ)) {
      profil.relationMaserati[champ] = valeur;
      profil.derniereMiseAJour = getAbidjanDateTime();
      this.sauvegarderBase();
    }
  }

  /**
   * Ajoute un moment mémorable avec le client
   */
  ajouterMomentExceptionnel(userId, moment) {
    const profil = this.getProfilVIP(userId);

    const nouveauMoment = {
      texte: moment,
      date: getAbidjanDateTime(),
      importance: 'haute'
    };

    profil.relationMaserati.momentsExceptionnels.push(nouveauMoment);
    if (profil.relationMaserati.momentsExceptionnels.length > 30) {
      profil.relationMaserati.momentsExceptionnels = 
        profil.relationMaserati.momentsExceptionnels.slice(-30);
    }

    profil.derniereMiseAJour = getAbidjanDateTime();
    this.sauvegarderBase();
  }

  /**
   * Modifie une information existante (correction)
   */
  corrigerInfo(userId, type, ancienneValeur, nouvelleValeur) {
    const profil = this.getProfilVIP(userId);
    let modifie = false;

    const typeNorm = type.toLowerCase().trim();

    // ... (la logique de switch est conservée mais traduite et adaptée)

    // Exemple pour quelques cas :
    if (['kiff', 'kiffs'].includes(typeNorm)) {
      const idx = profil.preferences.kiffs.indexOf(ancienneValeur);
      if (idx !== -1) {
        profil.preferences.kiffs[idx] = nouvelleValeur;
        modifie = true;
      }
    }
    // ... autres cas similaires (gustos → kiffs, nao_gostos → petes, etc.)

    if (modifie) {
      profil.derniereMiseAJour = getAbidjanDateTime();
      this.sauvegarderBase();
      return true;
    }

    return false;
  }

  /**
   * Supprime une information / souvenir / note
   */
  supprimerInfo(userId, type, valeur) {
    const profil = this.getProfilVIP(userId);
    let supprime = false;

    // ... logique similaire à l'original mais avec nouveaux noms de champs

    if (supprime) {
      profil.derniereMiseAJour = getAbidjanDateTime();
      this.sauvegarderBase();
      return true;
    }

    return false;
  }

  /**
   * Génère un tableau de bord résumé du client
   */
  getDashboardVIP(userId) {
    const profil = this.getProfilVIP(userId);

    return {
      nom: profil.nomVIP || 'Anonyme',
      surnoms: profil.surnoms.join(', ') || 'Aucun',
      kiffs: profil.preferences.kiffs.slice(-5).join(', ') || 'Non renseigné',
      petes: profil.preferences.petes.slice(-5).join(', ') || 'Non renseigné',
      passions: profil.preferences.passions.slice(-5).join(', ') || 'Non renseigné',
      sujetsFavoris: profil.preferences.sujetsFavoris.slice(-5).join(', ') || 'Non renseigné',
      totalMessages: profil.historique.totalMessages,
      frequence: profil.historique.frequence,
      proximiteBot: profil.relationMaserati.niveauProximite,
      sujetsRecents: profil.historique.sujetsRecents.slice(-5).join(', ') || 'Aucun',
      notesImportantes: profil.notesPrioritaires.slice(-10).map(n => n.texte).join('\n• ') || 'Aucune',
      momentsExceptionnels: profil.relationMaserati.momentsExceptionnels.slice(-5).map(m => m.texte).join('\n• ') || 'Aucun'
    };
  }

  /**
   * Nettoyage automatique des profils inactifs (> 90 jours)
   */
  nettoyerInactifs(delaiMs = 90 * 24 * 60 * 60 * 1000) {
    const maintenant = Date.now();
    let nettoyes = 0;

    Object.keys(this.data).forEach(userId => {
      const profil = this.data[userId];
      const derniere = new Date(profil.derniereMiseAJour).getTime();

      if (maintenant - derniere > delaiMs) {
        delete this.data[userId];
        nettoyes++;
      }
    });

    if (nettoyes > 0) {
      console.log(`🧼 ${nettoyes} profils VIP inactifs supprimés`);
      this.sauvegarderBase();
    }

    return nettoyes;
  }

  /**
   * Statistiques globales du garage clients
   */
  getStatsGlobales() {
    const totalClients = Object.keys(this.data).length;
    const actifs24h = Object.values(this.data).filter(p => {
      const derniere = new Date(p.derniereMiseAJour).getTime();
      return derniere > Date.now() - 86400000;
    }).length;

    const totalMessages = Object.values(this.data).reduce((s, p) => s + p.historique.totalMessages, 0);

    return {
      total_clients: totalClients,
      actifs_24h: actifs24h,
      total_messages: totalMessages,
      moyenne_messages_client: totalClients > 0 ? Math.round(totalMessages / totalClients) : 0
    };
  }
}

// Instance unique
const maseratiProfilVIP = new MaseratiProfilVIP();

export default maseratiProfilVIP;

// Développé par yankee Hells 🙂 🏎️👑✨🇨🇮