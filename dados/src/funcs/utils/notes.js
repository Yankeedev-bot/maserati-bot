/**
 * Système de Notes Prestige - Édition Maserati
 * Carnet de bord personnel – notes privées par pilote
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FICHIER_NOTES = path.join(__dirname, '../../../database/notes_maserati.json');

// ── CONFIGURATION PRESTIGE ──
const CONFIG_NOTES_MASERATI = {
  MAX_NOTES_PAR_PILOTE: 50,           // Limite garage – pas de surcharge
  LONGUEUR_MAX_NOTE: 1000,            // Pas de roman sur le circuit
  LONGUEUR_MAX_TITRE: 50              // Titre court et percutant
};

// Helper nom pilote prestige
const obtenirNomPilote = (userId) => {
  if (!userId || typeof userId !== 'string') return 'pilote anonyme';
  return userId.split('@')[0] || userId;
};

// Charger carnet de bord
const chargerNotes = () => {
  try {
    if (fs.existsSync(FICHIER_NOTES)) {
      return JSON.parse(fs.readFileSync(FICHIER_NOTES, 'utf8'));
    }
  } catch (err) {
    console.error('[Maserati-Notes] Erreur chargement :', err.message);
  }
  return { pilotes: {} };
};

// Sauvegarder carnet
const sauvegarderNotes = (data) => {
  try {
    const dossier = path.dirname(FICHIER_NOTES);
    if (!fs.existsSync(dossier)) {
      fs.mkdirSync(dossier, { recursive: true });
    }
    fs.writeFileSync(FICHIER_NOTES, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('[Maserati-Notes] Erreur sauvegarde :', err.message);
  }
};

// Carnet du pilote
const obtenirNotesPilote = (userId) => {
  const data = chargerNotes();
  if (!data.pilotes[userId]) {
    data.pilotes[userId] = [];
  }
  return data.pilotes[userId];
};

// Générer ID unique – plaque prestige
const genererIdNote = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

/**
 * Ajouter une note au carnet de bord
 * @param {string} userId - ID du pilote
 * @param {string} contenu - Texte de la note
 * @param {string} [titre=null] - Titre optionnel
 * @param {string} [prefixe='/'] - Préfixe commande
 */
const maseratiAjouterNote = (userId, contenu, titre = null, prefixe = '/') => {
  if (!contenu || contenu.trim() === '') {
    return {
      succes: false,
      message: `❌ Le contenu de la note ne peut pas être vide !\n\n` +
               `💡 Utilisation : ${prefixe}note <texte>\n` +
               `Exemple : ${prefixe}note Rappel : réunion paddock 20h`
    };
  }

  if (contenu.length > CONFIG_NOTES_MASERATI.LONGUEUR_MAX_NOTE) {
    return {
      succes: false,
      message: `❌ Note trop longue ! Maximum ${CONFIG_NOTES_MASERATI.LONGUEUR_MAX_NOTE} caractères.`
    };
  }

  const data = chargerNotes();
  if (!data.pilotes[userId]) {
    data.pilotes[userId] = [];
  }

  if (data.pilotes[userId].length >= CONFIG_NOTES_MASERATI.MAX_NOTES_PAR_PILOTE) {
    return {
      succes: false,
      message: `❌ Limite atteinte : ${CONFIG_NOTES_MASERATI.MAX_NOTES_PAR_PILOTE} notes max !\n\n` +
               `💡 Supprime des anciennes avec ${prefixe}note del <id>`
    };
  }

  const note = {
    id: genererIdNote(),
    titre: titre ? titre.slice(0, CONFIG_NOTES_MASERATI.LONGUEUR_MAX_TITRE) : null,
    contenu: contenu.trim(),
    creeLe: new Date().toISOString(),
    modifieLe: null,
    epingle: false
  };

  data.pilotes[userId].push(note);
  sauvegarderNotes(data);

  return {
    succes: true,
    note,
    message: `📝 *NOTE AJOUTÉE AU CARNET PRESTIGE*\n\n` +
             `🆔 ID : \`${note.id}\`\n` +
             `${note.titre ? `📌 Titre : ${note.titre}\n` : ''}` +
             `📄 \( {note.contenu.slice(0, 100)} \){note.contenu.length > 100 ? '...' : ''}\n\n` +
             `📊 Total notes : \( {data.pilotes[userId].length}/ \){CONFIG_NOTES_MASERATI.MAX_NOTES_PAR_PILOTE}`
  };
};

/**
 * Lister les notes du pilote – carnet de bord
 */
const maseratiListerNotes = (userId, page = 1, parPage = 10, prefixe = '/') => {
  const notes = obtenirNotesPilote(userId);

  if (notes.length === 0) {
    return {
      succes: true,
      message: `📝 *CARNET DE BORD PRESTIGE*\n\n📭 Vide !\n\n` +
               `💡 Crée ta première note : ${prefixe}note <texte>`
    };
  }

  // Tri : épinglées d’abord, puis par date récente
  const triees = [...notes].sort((a, b) => {
    if (a.epingle && !b.epingle) return -1;
    if (!a.epingle && b.epingle) return 1;
    return new Date(b.creeLe) - new Date(a.creeLe);
  });

  const totalPages = Math.ceil(triees.length / parPage);
  const pageActuelle = Math.min(Math.max(1, page), totalPages);
  const debut = (pageActuelle - 1) * parPage;
  const notesPage = triees.slice(debut, debut + parPage);

  let message = `📝 *CARNET DE BORD PRESTIGE* (\( {notes.length}/ \){CONFIG_NOTES_MASERATI.MAX_NOTES_PAR_PILOTE})\n`;
  message += `📄 Page \( {pageActuelle}/ \){totalPages}\n`;
  message += `━━━━━━━━━━━━━━━━━━\n\n`;

  notesPage.forEach((note, i) => {
    const epingle = note.epingle ? '📌 ' : '';
    const titre = note.titre || note.contenu.slice(0, 30);
    const date = new Date(note.creeLe).toLocaleDateString('fr-FR');
    message += `\( {epingle}* \){debut + i + 1}.* \( {titre} \){note.contenu.length > 30 && !note.titre ? '...' : ''}\n`;
    message += `   🆔 \`${note.id}\` | 📅 ${date}\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `💡 ${prefixe}note voir <id> – Lire note complète\n`;
  message += `💡 ${prefixe}note del <id> – Supprimer note`;

  if (totalPages > 1) {
    message += `\n💡 ${prefixe}notes <page> – Voir autres pages`;
  }

  return {
    succes: true,
    message,
    totalNotes: notes.length,
    totalPages,
    pageActuelle
  };
};

/**
 * Voir une note spécifique
 */
const maseratiVoirNote = (userId, idNote, prefixe = '/') => {
  const notes = obtenirNotesPilote(userId);
  const note = notes.find(n => n.id === idNote || notes.indexOf(n) + 1 === parseInt(idNote));

  if (!note) {
    return {
      succes: false,
      message: `❌ Note introuvable !\n\n` +
               `💡 Liste tes notes : ${prefixe}notes`
    };
  }

  const dateCrea = new Date(note.creeLe).toLocaleString('fr-FR');
  const dateModif = note.modifieLe ? `\n📝 Modifiée : ${new Date(note.modifieLe).toLocaleString('fr-FR')}` : '';

  return {
    succes: true,
    note,
    message: `📝 *NOTE PRESTIGE*\n\n` +
             `🆔 ID : \`${note.id}\`\n` +
             `\( {note.titre ? `📌 * \){note.titre}*\n\n` : ''}` +
             `${note.contenu}\n\n` +
             `━━━━━━━━━━━━━━━━━━\n` +
             `📅 Créée : \( {dateCrea} \){dateModif}\n` +
             `${note.epingle ? '📌 Épinglée' : ''}`
  };
};

/**
 * Modifier une note existante
 */
const maseratiModifierNote = (userId, idNote, nouveauContenu) => {
  if (!nouveauContenu || nouveauContenu.trim() === '') {
    return { succes: false, message: '❌ Le nouveau contenu ne peut pas être vide !' };
  }

  if (nouveauContenu.length > CONFIG_NOTES_MASERATI.LONGUEUR_MAX_NOTE) {
    return {
      succes: false,
      message: `❌ Note trop longue ! Maximum ${CONFIG_NOTES_MASERATI.LONGUEUR_MAX_NOTE} caractères.`
    };
  }

  const data = chargerNotes();
  const notes = data.pilotes[userId] || [];
  const indexNote = notes.findIndex(n => n.id === idNote || notes.indexOf(n) + 1 === parseInt(idNote));

  if (indexNote === -1) {
    return { succes: false, message: '❌ Note introuvable !' };
  }

  notes[indexNote].contenu = nouveauContenu.trim();
  notes[indexNote].modifieLe = new Date().toISOString();
  sauvegarderNotes(data);

  return {
    succes: true,
    message: `✅ *NOTE MODIFIÉE PRESTIGE*\n\n` +
             `🆔 ID : \`${notes[indexNote].id}\`\n` +
             `📄 \( {nouveauContenu.slice(0, 100)} \){nouveauContenu.length > 100 ? '...' : ''}`
  };
};

/**
 * Supprimer une note
 */
const maseratiSupprimerNote = (userId, idNote) => {
  const data = chargerNotes();
  const notes = data.pilotes[userId] || [];
  const indexNote = notes.findIndex(n => n.id === idNote || notes.indexOf(n) + 1 === parseInt(idNote));

  if (indexNote === -1) {
    return { succes: false, message: '❌ Note introuvable !' };
  }

  const supprimee = notes.splice(indexNote, 1)[0];
  sauvegarderNotes(data);

  return {
    succes: true,
    message: `🗑️ *NOTE SUPPRIMÉE*\n\n` +
             `📄 \( {supprimee.contenu.slice(0, 50)} \){supprimee.contenu.length > 50 ? '...' : ''}\n\n` +
             `📊 Notes restantes : ${notes.length}`
  };
};

/**
 * Épingler / désépingler une note
 */
const maseratiBasculerEpingle = (userId, idNote) => {
  const data = chargerNotes();
  const notes = data.pilotes[userId] || [];
  const note = notes.find(n => n.id === idNote || notes.indexOf(n) + 1 === parseInt(idNote));

  if (!note) {
    return { succes: false, message: '❌ Note introuvable !' };
  }

  note.epingle = !note.epingle;
  sauvegarderNotes(data);

  return {
    succes: true,
    message: note.epingle ? `📌 Note épinglée en haut du carnet !` : `📌 Note désépinglée.`
  };
};

/**
 * Rechercher dans les notes
 */
const maseratiRechercherNotes = (userId, requete) => {
  if (!requete || requete.trim().length < 2) {
    return { succes: false, message: '❌ Tape au moins 2 caractères pour rechercher !' };
  }

  const notes = obtenirNotesPilote(userId);
  const rechercheMin = requete.toLowerCase();

  const resultats = notes.filter(n =>
    n.contenu.toLowerCase().includes(rechercheMin) ||
    (n.titre && n.titre.toLowerCase().includes(rechercheMin))
  );

  if (resultats.length === 0) {
    return {
      succes: true,
      message: `🔍 *RECHERCHE CARNET*\n\nAucune note trouvée pour "${requete}".`
    };
  }

  let message = `🔍 *RECHERCHE : "${requete}"*\n`;
  message += `📊 ${resultats.length} résultat(s)\n`;
  message += `━━━━━━━━━━━━━━━━━━\n\n`;

  resultats.slice(0, 10).forEach((note, i) => {
    const titre = note.titre || note.contenu.slice(0, 30);
    message += `*${i + 1}.* \( {titre} \){note.contenu.length > 30 && !note.titre ? '...' : ''}\n`;
    message += `   🆔 \`${note.id}\`\n\n`;
  });

  if (resultats.length > 10) {
    message += `_... et ${resultats.length - 10} autres résultats_`;
  }

  return { succes: true, message, resultats };
};

/**
 * Supprimer toutes les notes du pilote
 */
const maseratiEffacerToutesNotes = (userId) => {
  const data = chargerNotes();
  const count = (data.pilotes[userId] || []).length;

  if (count === 0) {
    return { succes: false, message: '❌ Ton carnet est déjà vide !' };
  }

  data.pilotes[userId] = [];
  sauvegarderNotes(data);

  return {
    succes: true,
    message: `🗑️ *CARNET EFFACÉ*\n\n${count} note(s) supprimée(s).`
  };
};

// Exports prestige
export {
  maseratiAjouterNote,
  maseratiListerNotes,
  maseratiVoirNote,
  maseratiModifierNote,
  maseratiSupprimerNote,
  maseratiBasculerEpingle,
  maseratiRechercherNotes,
  maseratiEffacerToutesNotes,
  obtenirNotesPilote,
  CONFIG_NOTES_MASERATI
};

export default {
  ajouter: maseratiAjouterNote,
  lister: maseratiListerNotes,
  voir: maseratiVoirNote,
  modifier: maseratiModifierNote,
  supprimer: maseratiSupprimerNote,
  epingle: maseratiBasculerEpingle,
  rechercher: maseratiRechercherNotes,
  effacerTout: maseratiEffacerToutesNotes
};
