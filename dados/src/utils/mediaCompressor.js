/**
 * Compresseur Médias Prestige - Édition Maserati
 * Compression intelligente images/vidéos/audio avec file d’attente & optimisation garage
 * Thème Maserati 🏎️👑✨🇨🇮 – Tuning HD ultra-rapide & économique
 * Créé par yankee Hells 🙂
 */

import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const executerAsync = promisify(exec);

class CompresseurMediasPrestigeMaserati {
  constructor() {
    this.dossierTemp = path.join(__dirname, '../../../temp/compression-prestige');
    this.fileAttenteCompression = [];
    this.enTraitement = false;
    this.maxCompressionsSimultanees = 2;
    this.compressionsActives = 0;

    // Configuration tuning luxe
    this.reglages = {
      image: {
        qualite: 85,
        largeurMax: 1920,
        hauteurMax: 1920,
        format: 'auto', // auto, jpg, webp, png, avif
        retirerMetadonnees: true,
        progressif: true
      },
      video: {
        qualite: 25, // CRF (plus bas = meilleure qualité)
        largeurMax: 1280,
        hauteurMax: 720,
        fps: 30,
        debitAudio: '128k',
        codec: 'h264', // h264, h265, vp9, av1
        preset: 'medium'
      },
      audio: {
        debit: '128k',
        format: 'mp3', // mp3, aac, ogg, opus
        normaliser: true,
        echantillonnage: 44100
      },
      general: {
        compressionAuto: true,
        seuilTaille: 5 * 1024 * 1024, // 5 Mo – déclenchement tuning
        ratioCompressionMin: 0.7,     // Minimum 30% réduction
        garderOriginal: false,
        activerZlib: false            // Compression métadonnées
      }
    };

    this.formatsSupportes = {
      image: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp', '.heic', '.avif'],
      video: ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv', '.wmv', '.3gp', '.m4v'],
      audio: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a', '.wma']
    };

    this.initialiser();
  }

  /**
   * Initialisation garage compression – préparation paddock
   */
  async initialiser() {
    try {
      await this.assurerDossierTemp();
      await this.verifierDependances();
      this.demarrerProcesseurFileAttente();
    } catch (erreur) {
      console.error('[Maserati-Compresseur] Erreur initialisation garage :', erreur.message);
    }
  }

  /**
   * Assure existence dossier temp – atelier tuning prêt
   */
  async assurerDossierTemp() {
    try {
      await fs.access(this.dossierTemp);
    } catch {
      await fs.mkdir(this.dossierTemp, { recursive: true });
      console.log(`[Maserati-Compresseur] Atelier temporaire créé : ${this.dossierTemp}`);
    }
  }

  /**
   * Vérifie dépendances essentielles – check-up V8
   */
  async verifierDependances() {
    const dependances = [
      { commande: 'ffmpeg -version', nom: 'FFmpeg' }
    ];

    for (const dep of dependances) {
      try {
        await executerAsync(dep.commande, { timeout: 5000 });
      } catch (erreur) {
        console.warn(`[Maserati-Compresseur] ${dep.nom} non disponible :`, erreur.message);
      }
    }
  }

  /**
   * Ajoute fichier à la file d’attente compression – entrée garage
   * @param {string} cheminFichier - Chemin absolu du média
   * @param {object} options - Réglages spécifiques (optionnel)
   */
  async compresserFichier(cheminFichier, options = {}) {
    try {
      const stats = await fs.stat(cheminFichier);
      const extension = path.extname(cheminFichier).toLowerCase();
      const typeMedia = this.obtenirTypeMedia(extension);

      if (!typeMedia) {
        return { succes: false, erreur: 'Format non supporté' };
      }

      // Ajoute à la file – attente paddock
      const tache = {
        id: this.genererIdTache(),
        chemin: cheminFichier,
        type: typeMedia,
        options: { ...this.reglages[typeMedia], ...options },
        tailleOriginale: stats.size,
        ajouteLe: Date.now()
      };

      this.fileAttenteCompression.push(tache);
      console.log(`[Maserati-Compresseur] Tâche ajoutée garage : \( {cheminFichier} ( \){this.formaterOctets(stats.size)})`);

      // Démarre traitement si libre
      this.traiterFileAttente();

      return tache;
    } catch (erreur) {
      console.error('[Maserati-Compresseur] Erreur ajout compression :', erreur.message);
      return { succes: false, erreur: erreur.message };
    }
  }

  /**
   * Processeur de file d’attente – chaîne de montage V8
   */
  demarrerProcesseurFileAttente() {
    setInterval(() => {
      if (!this.enTraitement && this.fileAttenteCompression.length > 0) {
        this.traiterFileAttente();
      }
    }, 2000); // Check toutes les 2 sec – rythme circuit
  }

  /**
   * Traite la file d’attente – lancement compression
   */
  async traiterFileAttente() {
    if (this.enTraitement || this.fileAttenteCompression.length === 0) return;

    this.enTraitement = true;

    while (this.compressionsActives < this.maxCompressionsSimultanees && this.fileAttenteCompression.length > 0) {
      const tache = this.fileAttenteCompression.shift();
      this.compressionsActives++;

      try {
        console.log(`[Maserati-Compresseur] Compression démarrée : \( {tache.chemin} ( \){tache.type})`);

        let resultat;

        switch (tache.type) {
          case 'image':
            resultat = await this.compresserImage(tache.chemin, tache.options);
            break;
          case 'video':
            resultat = await this.compresserVideo(tache.chemin, tache.options);
            break;
          case 'audio':
            resultat = await this.compresserAudio(tache.chemin, tache.options);
            break;
          default:
            resultat = { succes: false, erreur: 'Type inconnu' };
        }

        if (resultat.succes) {
          console.log(`[Maserati-Compresseur] Compression réussie : ${tache.chemin} → ${this.formaterOctets(resultat.espaceGagne)} économisés`);
        } else {
          console.warn(`[Maserati-Compresseur] Compression échouée : ${tache.chemin} → ${resultat.erreur}`);
        }
      } catch (erreur) {
        console.error(`[Maserati-Compresseur] Erreur tâche ${tache.id} :`, erreur.message);
      } finally {
        this.compressionsActives--;
      }
    }

    this.enTraitement = false;

    // Relance si file non vide
    if (this.fileAttenteCompression.length > 0) {
      this.traiterFileAttente();
    }
  }

  /**
   * Compresse une image – tuning visuel luxe
   */
  async compresserImage(chemin, opts) {
    try {
      const statsOrig = await fs.stat(chemin);
      const ext = path.extname(chemin) || '.jpg';
      const cheminTemp = path.join(this.dossierTemp, `\( {path.basename(chemin, ext)}.compressed \){ext}`);

      const commande = `ffmpeg -hide_banner -loglevel error -i "${chemin}" ` +
        `-vf "scale=min(\( {opts.largeurMax}\\,iw):min( \){opts.hauteurMax}\\,ih):force_original_aspect_ratio=decrease" ` +
        `-q:v ${opts.qualite} -map_metadata -1 \( {opts.progressif ? '-progressive' : ''} -y " \){cheminTemp}"`;

      await executerAsync(commande, { timeout: 30000 });

      const statsComp = await fs.stat(cheminTemp);

      if (statsComp.size < statsOrig.size * opts.ratioCompressionMin) {
        if (!opts.garderOriginal) await fs.unlink(chemin);
        await fs.rename(cheminTemp, chemin);
        return {
          succes: true,
          espaceGagne: statsOrig.size - statsComp.size
        };
      } else {
        await fs.unlink(cheminTemp);
        return { succes: false };
      }
    } catch (erreur) {
      console.warn(`[Maserati-Compresseur] Échec compression image ${chemin} :`, erreur.message);
      return { succes: false };
    }
  }

  /**
   * Compresse une vidéo – flux HD optimisé
   */
  async compresserVideo(chemin, opts) {
    try {
      const statsOrig = await fs.stat(chemin);
      const cheminTemp = chemin + '.compressed.mp4';

      const commande = `ffmpeg -i "${chemin}" ` +
        `-c:v libx264 -preset ${opts.preset} -crf ${opts.qualite} ` +
        `-vf "scale=min(\( {opts.largeurMax}\\,iw):min( \){opts.hauteurMax}\\,ih):force_original_aspect_ratio=decrease" ` +
        `-c:a aac -b:a \( {opts.debitAudio} -movflags +faststart -y " \){cheminTemp}"`;

      await executerAsync(commande, { timeout: 60000 });

      const statsComp = await fs.stat(cheminTemp);

      if (statsComp.size < statsOrig.size * opts.ratioCompressionMin) {
        if (!opts.garderOriginal) await fs.unlink(chemin);
        await fs.rename(cheminTemp, chemin);
        return {
          succes: true,
          espaceGagne: statsOrig.size - statsComp.size
        };
      } else {
        await fs.unlink(cheminTemp);
        return { succes: false };
      }
    } catch (erreur) {
      console.warn(`[Maserati-Compresseur] Échec compression vidéo ${chemin} :`, erreur.message);
      return { succes: false };
    }
  }

  /**
   * Compresse un fichier audio – son V12 purifié
   */
  async compresserAudio(chemin, opts) {
    try {
      const statsOrig = await fs.stat(chemin);
      const ext = path.extname(chemin) || '.mp3';
      const cheminTemp = path.join(this.dossierTemp, `\( {path.basename(chemin, ext)}.compressed \){ext}`);

      const commande = `ffmpeg -i "${chemin}" ` +
        `-c:a aac -b:a ${opts.debit} ` +
        `-ar \( {opts.echantillonnage} -y " \){cheminTemp}"`;

      await executerAsync(commande, { timeout: 30000 });

      const statsComp = await fs.stat(cheminTemp);

      if (statsComp.size < statsOrig.size * opts.ratioCompressionMin) {
        if (!opts.garderOriginal) await fs.unlink(chemin);
        await fs.rename(cheminTemp, chemin);
        return {
          succes: true,
          espaceGagne: statsOrig.size - statsComp.size
        };
      } else {
        await fs.unlink(cheminTemp);
        return { succes: false };
      }
    } catch (erreur) {
      console.warn(`[Maserati-Compresseur] Échec compression audio ${chemin} :`, erreur.message);
      return { succes: false };
    }
  }

  /**
   * Détermine type média selon extension – classification garage
   */
  obtenirTypeMedia(extension) {
    extension = extension.toLowerCase();
    if (this.formatsSupportes.image.includes(extension)) return 'image';
    if (this.formatsSupportes.video.includes(extension)) return 'video';
    if (this.formatsSupportes.audio.includes(extension)) return 'audio';
    return null;
  }

  /**
   * Génère ID unique tâche compression – plaque circuit
   */
  genererIdTache() {
    return `compress_\( {Date.now()}_ \){Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Estime temps d’attente file – chronomètre paddock
   */
  estimerTempsAttente() {
    const tempsMoyenCompression = 30000; // 30 sec par fichier
    return this.fileAttenteCompression.length * tempsMoyenCompression;
  }

  /**
   * Formate octets en KB/MB/Go – affichage prestige
   */
  formaterOctets(octets) {
    const tailles = ['Octets', 'Ko', 'Mo', 'Go'];
    if (octets === 0) return '0 Octets';
    const i = Math.floor(Math.log(octets) / Math.log(1024));
    return Math.round(octets / Math.pow(1024, i) * 100) / 100 + ' ' + tailles[i];
  }

  /**
   * Obtient statistiques garage compression – tableau de bord
   */
  obtenirStatistiques() {
    return {
      tailleFileAttente: this.fileAttenteCompression.length,
      compressionsActives: this.compressionsActives,
      maxSimultanees: this.maxCompressionsSimultanees,
      reglages: this.reglages,
      formatsSupportes: this.formatsSupportes
    };
  }

  /**
   * Met à jour réglages tuning – personnalisation atelier
   */
  mettreAJourReglages(nouveauxReglages) {
    this.reglages = { ...this.reglages, ...nouveauxReglages };
  }

  /**
   * Nettoie fichiers temporaires atelier – purge garage
   */
  async nettoyerTemp() {
    try {
      const fichiers = await fs.readdir(this.dossierTemp);
      let nettoyes = 0;

      for (const fichier of fichiers) {
        const chemin = path.join(this.dossierTemp, fichier);
        const stats = await fs.stat(chemin);

        // Supprime fichiers > 1h
        if (Date.now() - stats.mtime.getTime() > 60 * 60 * 1000) {
          await fs.unlink(chemin);
          nettoyes++;
        }
      }

      if (nettoyes > 0) {
        console.log(`[Maserati-Compresseur] Atelier nettoyé : ${nettoyes} fichiers temporaires purgés`);
      }
    } catch (erreur) {
      console.error('[Maserati-Compresseur] Erreur nettoyage atelier :', erreur.message);
    }
  }

  /**
   * Arrête compresseur – garage fermé proprement
   */
  async arreter() {
    // Attend fin compressions actives
    while (this.compressionsActives > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Nettoyage final atelier
    await this.nettoyerTemp();
  }
}

export default CompresseurMediasPrestigeMaserati;