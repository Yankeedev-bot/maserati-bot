/**
 * Nettoyeur Médias Prestige - Édition Maserati
 * Nettoyage automatique cache, temp, médias & compression – garage toujours propre
 * Thème Maserati 🏎️👑✨🇨🇮 – Circuit fluide & sans surcharge
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

class NettoyeurMediasPrestigeMaserati {
  constructor() {
    this.dossierBase = path.join(__dirname, '../../../');
    this.dossiersMedias = [
      path.join(this.dossierBase, 'dados/midias'),          // Cache médias bot
      path.join(this.dossierBase, 'temp'),                  // Fichiers temporaires
      '/tmp/nazuna-media',                                  // Cache système Nazuna
      '/tmp/baileys_media_cache'                            // Cache Baileys WhatsApp
    ];
    this.prefixesTemp = ['tmp_', 'temp_', 'download_', 'media_', 'baileys_'];
    this.ageMaxFichierTemp = 2 * 60 * 60 * 1000;           // 2 heures – fichiers volants
    this.ageMaxMedias = 24 * 60 * 60 * 1000;               // 24 heures – médias généraux
    this.tailleMaxDossier = 500 * 1024 * 1024;             // 500 Mo par dossier – limite paddock
    this.extensionsAcceptees = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.webm', '.mp3', '.ogg', '.webp', '.pdf'];
  }

  /**
   * Démarre le nettoyage automatique – maintenance garage prestige
   */
  async demarrerNettoyageMedias() {
    try {
      // Assure existence dossiers – préparation paddock
      await this.assurerDossiers();

      // Nettoyage rapide de chaque dossier
      for (const dossier of this.dossiersMedias) {
        await this.nettoyerDossier(dossier);
      }

      // Nettoyage spécifique cache Baileys – vidange circuit
      await this.nettoyerCacheBaileys();

      // Nettoyage anciens téléchargements – purge historique
      await this.nettoyerAnciensTelechargements();

    } catch (erreur) {
      console.error('[Maserati-Nettoyeur] Erreur nettoyage automatique médias :', erreur.message);
    }
  }

  /**
   * Assure existence des dossiers de garage – préparation paddock
   */
  async assurerDossiers() {
    for (const dossier of this.dossiersMedias) {
      try {
        await fs.access(dossier);
      } catch {
        try {
          await fs.mkdir(dossier, { recursive: true });
          console.log(`[Maserati-Nettoyeur] Dossier créé : ${dossier}`);
        } catch (erreur) {
          console.warn(`[Maserati-Nettoyeur] Impossible de créer dossier ${dossier} :`, erreur.message);
        }
      }
    }
  }

  /**
   * Nettoie un dossier spécifique – purge circuit
   */
  async nettoyerDossier(cheminDossier) {
    try {
      const existe = await fs.access(cheminDossier).then(() => true).catch(() => false);
      if (!existe) return { fichiersSupprimes: 0, espaceLibere: 0 };

      const fichiers = await fs.readdir(cheminDossier);
      let fichiersSupprimes = 0;
      let espaceLibere = 0;

      for (const fichier of fichiers) {
        const cheminFichier = path.join(cheminDossier, fichier);

        try {
          const stats = await fs.stat(cheminFichier);

          // Ignore sous-dossiers
          if (stats.isDirectory()) continue;

          const doitSupprimer = await this.doitSupprimerFichier(cheminFichier, stats);

          if (doitSupprimer) {
            espaceLibere += stats.size;
            await fs.unlink(cheminFichier);
            fichiersSupprimes++;
          }
        } catch (erreur) {
          console.warn(`[Maserati-Nettoyeur] Erreur traitement fichier ${fichier} :`, erreur.message);
        }
      }

      if (fichiersSupprimes > 0) {
        console.log(`[Maserati-Nettoyeur] ${cheminDossier} : ${fichiersSupprimes} fichiers supprimés, ${this.formaterOctets(espaceLibere)} libérés`);
      }

      return { fichiersSupprimes, espaceLibere };
    } catch (erreur) {
      console.error(`[Maserati-Nettoyeur] Erreur nettoyage dossier ${cheminDossier} :`, erreur.message);
      return { fichiersSupprimes: 0, espaceLibere: 0 };
    }
  }

  /**
   * Décide si un fichier doit être supprimé – règle prestige
   */
  async doitSupprimerFichier(cheminFichier, stats) {
    const maintenant = Date.now();
    const age = maintenant - stats.mtimeMs;

    const ext = path.extname(cheminFichier).toLowerCase();

    // Fichiers temporaires (prefixes connus) → 2h max
    if (this.prefixesTemp.some(prefix => cheminFichier.includes(prefix))) {
      return age > this.ageMaxFichierTemp;
    }

    // Médias généraux → 24h max
    if (this.extensionsAcceptees.includes(ext)) {
      return age > this.ageMaxMedias;
    }

    // Tout le reste → suppression immédiate (inconnu = danger)
    return true;
  }

  /**
   * Nettoie spécifiquement le cache Baileys – vidange turbo WhatsApp
   */
  async nettoyerCacheBaileys() {
    try {
      const dossierBaileys = '/tmp/baileys_media_cache';
      const existe = await fs.access(dossierBaileys).then(() => true).catch(() => false);
      if (!existe) return;

      const fichiers = await fs.readdir(dossierBaileys);
      let supprimes = 0;

      for (const fichier of fichiers) {
        const chemin = path.join(dossierBaileys, fichier);
        try {
          const stats = await fs.stat(chemin);
          if (stats.isFile()) {
            await fs.unlink(chemin);
            supprimes++;
          }
        } catch {}
      }

      if (supprimes > 0) {
        console.log(`[Maserati-Nettoyeur] Cache Baileys vidé : ${supprimes} fichiers supprimés`);
      }
    } catch (erreur) {
      console.warn('[Maserati-Nettoyeur] Erreur nettoyage cache Baileys :', erreur.message);
    }
  }

  /**
   * Nettoie anciens téléchargements temporaires – purge historique
   */
  async nettoyerAnciensTelechargements() {
    try {
      const dossierTemp = path.join(this.dossierBase, 'temp');
      const existe = await fs.access(dossierTemp).then(() => true).catch(() => false);
      if (!existe) return;

      const fichiers = await fs.readdir(dossierTemp);
      let supprimes = 0;

      for (const fichier of fichiers) {
        if (fichier.startsWith('download_') || fichier.startsWith('temp_')) {
          const chemin = path.join(dossierTemp, fichier);
          try {
            const stats = await fs.stat(chemin);
            if (Date.now() - stats.mtimeMs > this.ageMaxFichierTemp) {
              await fs.unlink(chemin);
              supprimes++;
            }
          } catch {}
        }
      }

      if (supprimes > 0) {
        console.log(`[Maserati-Nettoyeur] Anciens téléchargements purgés : ${supprimes} fichiers`);
      }
    } catch (erreur) {
      console.warn('[Maserati-Nettoyeur] Erreur purge anciens téléchargements :', erreur.message);
    }
  }

  /**
   * Compression intelligente des gros médias – optimisation garage
   */
  async compresserGrosMedias() {
    for (const dossier of this.dossiersMedias) {
      try {
        await this.compresserDossier(dossier);
      } catch (erreur) {
        console.error(`[Maserati-Nettoyeur] Erreur compression dossier ${dossier} :`, erreur.message);
      }
    }
  }

  /**
   * Compresse un dossier entier – tuning médias
   */
  async compresserDossier(cheminDossier) {
    try {
      const fichiers = await fs.readdir(cheminDossier);
      let compresses = 0;
      let espaceGagne = 0;

      for (const fichier of fichiers) {
        const cheminFichier = path.join(cheminDossier, fichier);
        const stats = await fs.stat(cheminFichier);

        if (stats.isDirectory()) continue;

        const ext = path.extname(cheminFichier).toLowerCase();

        // Images → compression
        if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
          const resultat = await this.compresserImage(cheminFichier);
          if (resultat.success) {
            compresses++;
            espaceGagne += resultat.espaceGagne;
          }
        }

        // Vidéos → compression (plus lourd)
        if (['.mp4', '.webm'].includes(ext) && stats.size > 5 * 1024 * 1024) { // > 5MB
          const resultat = await this.compresserVideo(cheminFichier);
          if (resultat.success) {
            compresses++;
            espaceGagne += resultat.espaceGagne;
          }
        }
      }

      if (compresses > 0) {
        console.log(`[Maserati-Nettoyeur] ${cheminDossier} : ${compresses} fichiers compressés, ${this.formaterOctets(espaceGagne)} économisés`);
      }
    } catch (erreur) {
      console.error(`[Maserati-Nettoyeur] Erreur compression dossier ${cheminDossier} :`, erreur.message);
    }
  }

  /**
   * Compresse une image – optimisation HD luxe
   */
  async compresserImage(cheminFichier) {
    try {
      const statsOriginal = await fs.stat(cheminFichier);
      const ext = path.extname(cheminFichier) || '.jpg';
      const cheminTemp = path.join(path.dirname(cheminFichier), `\( {path.basename(cheminFichier, ext)}.compressed \){ext}`);

      // Compression ffmpeg – qualité prestige
      await executerAsync(`ffmpeg -hide_banner -loglevel error -i "\( {cheminFichier}" -vf "scale=min(1920\\,iw):min(1920\\,ih):force_original_aspect_ratio=decrease" -q:v 8 -map_metadata -1 -y " \){cheminTemp}"`, { timeout: 30000 });

      const statsCompresse = await fs.stat(cheminTemp);

      if (statsCompresse.size < statsOriginal.size * 0.8) { // Gain significatif
        await fs.rename(cheminTemp, cheminFichier);
        return {
          success: true,
          espaceGagne: statsOriginal.size - statsCompresse.size
        };
      } else {
        await fs.unlink(cheminTemp);
        return { success: false };
      }
    } catch (erreur) {
      console.warn(`[Maserati-Nettoyeur] Erreur compression image ${cheminFichier} :`, erreur.message);
      return { success: false };
    }
  }

  /**
   * Compresse une vidéo – tuning flux HD
   */
  async compresserVideo(cheminFichier) {
    try {
      const statsOriginal = await fs.stat(cheminFichier);
      const cheminTemp = cheminFichier + '.compressed.mp4';

      // Compression ffmpeg – qualité équilibrée
      await executerAsync(`ffmpeg -i "\( {cheminFichier}" -c:v libx264 -preset medium -crf 25 -c:a aac -b:a 128k -movflags +faststart -y " \){cheminTemp}"`, { timeout: 60000 });

      const statsCompresse = await fs.stat(cheminTemp);

      if (statsCompresse.size < statsOriginal.size * 0.7) { // Gain ≥ 30%
        await fs.unlink(cheminFichier);
        await fs.rename(cheminTemp, cheminFichier);
        return {
          success: true,
          espaceGagne: statsOriginal.size - statsCompresse.size
        };
      } else {
        await fs.unlink(cheminTemp);
        return { success: false };
      }
    } catch (erreur) {
      console.warn(`[Maserati-Nettoyeur] Erreur compression vidéo ${cheminFichier} :`, erreur.message);
      return { success: false };
    }
  }

  /**
   * Force limite taille dossier – contrôle carburant
   */
  async forcerLimiteDossier(cheminDossier) {
    try {
      const stats = await this.obtenirTailleDossier(cheminDossier);
      if (stats.tailleTotale <= this.tailleMaxDossier) return;

      console.log(`[Maserati-Nettoyeur] Limite dépassée \( {cheminDossier} ( \){this.formaterOctets(stats.tailleTotale)}) → purge forcée`);

      const fichiers = await fs.readdir(cheminDossier);
      const fichiersTries = [];

      for (const fichier of fichiers) {
        const chemin = path.join(cheminDossier, fichier);
        try {
          const stat = await fs.stat(chemin);
          if (stat.isFile()) {
            fichiersTries.push({ chemin, mtime: stat.mtimeMs, taille: stat.size });
          }
        } catch {}
      }

      // Trie par ancienneté (plus ancien en premier)
      fichiersTries.sort((a, b) => a.mtime - b.mtime);

      let espaceLibere = 0;
      let i = 0;

      while (stats.tailleTotale - espaceLibere > this.tailleMaxDossier * 0.8 && i < fichiersTries.length) {
        const fichier = fichiersTries[i];
        try {
          await fs.unlink(fichier.chemin);
          espaceLibere += fichier.taille;
          i++;
        } catch {}
      }

      if (espaceLibere > 0) {
        console.log(`[Maserati-Nettoyeur] Purge forcée : ${i} fichiers supprimés, ${this.formaterOctets(espaceLibere)} libérés`);
      }
    } catch (erreur) {
      console.error(`[Maserati-Nettoyeur] Erreur limite dossier ${cheminDossier} :`, erreur.message);
    }
  }

  /**
   * Calcule taille totale dossier – bilan garage
   */
  async obtenirTailleDossier(cheminDossier) {
    let taille = 0;
    try {
      const fichiers = await fs.readdir(cheminDossier);
      for (const fichier of fichiers) {
        const chemin = path.join(cheminDossier, fichier);
        const stats = await fs.stat(chemin);
        if (stats.isFile()) {
          taille += stats.size;
        }
      }
    } catch {}
    return { tailleTotale: taille };
  }

  /**
   * Formate octets en KB/MB/GB – affichage luxe
   */
  formaterOctets(octets) {
    const tailles = ['Octets', 'Ko', 'Mo', 'Go'];
    if (octets === 0) return '0 Octets';
    const i = Math.floor(Math.log(octets) / Math.log(1024));
    return Math.round(octets / Math.pow(1024, i) * 100) / 100 + ' ' + tailles[i];
  }

  /**
   * Lance nettoyage programmé – routine paddock
   */
  demarrerNettoyageProgramme() {
    // Nettoyage rapide toutes les 10 min
    setInterval(async () => {
      await this.demarrerNettoyageMedias();
    }, 10 * 60 * 1000);

    // Nettoyage profond + compression toutes les heures
    setInterval(async () => {
      await this.comprimerGrosMedias();
      for (const dossier of this.dossiersMedias) {
        await this.forcerLimiteDossier(dossier);
      }
    }, 60 * 60 * 1000);

    // Premier nettoyage après 30 secondes – démarrage propre
    setTimeout(() => {
      this.demarrerNettoyageMedias();
    }, 30000);
  }
}

export default NettoyeurMediasPrestigeMaserati;