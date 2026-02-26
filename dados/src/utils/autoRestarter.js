/**
 * Système Auto-Restart Prestige - Édition Maserati
 * Redémarrage automatique en cas d’erreurs critiques ou surcharge mémoire – V8 boosté
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import { spawn } from 'child_process';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SystemeRestartPrestigeMaserati {
  constructor() {
    this.compteurRestart = 0;
    this.maxRestarts = 5;
    this.delaiCooldown = 30000; // 30 secondes – pas de surchauffe
    this.dernierRestart = 0;
    this.erreursCritiques = [
      'ENOSPC', // Espace disque épuisé
      'ENOMEM', // Mémoire épuisée
      'EMFILE', // Trop de fichiers ouverts
      'ECONNRESET', // Connexion reset
      'ERR_UNHANDLED_ERROR',
      'UnhandledPromiseRejectionWarning'
    ];
    this.fichierLogs = path.join(__dirname, '../../../logs/auto-restart-maserati.log');
    this.fichierPid = path.join(__dirname, '../../../maserati.pid');
    this.enArret = false;
    this.processusEnfant = null;

    this.configurerGestionErreurs();
    this.configurerArretGracieux();
  }

  /**
   * Configure les handlers pour erreurs non traitées
   */
  configurerGestionErreurs() {
    // Capture erreurs non traitées
    process.on('uncaughtException', async (erreur) => {
      await this.gererErreurCritique('uncaughtException', erreur);
    });

    // Capture rejets promises non traités
    process.on('unhandledRejection', async (raison, promise) => {
      await this.gererErreurCritique('unhandledRejection', raison);
    });

    // Capture warnings
    process.on('warning', async (avertissement) => {
      if (avertissement.name === 'MaxListenersExceededWarning') {
        await this.logEvenement('warning', `MaxListeners dépassé : ${avertissement.message}`);
      }
    });

    // Moniteur usage mémoire
    setInterval(async () => {
      await this.verifierUsageMemoire();
    }, 60000); // Toutes les minutes – surveillance paddock
  }

  /**
   * Configure arrêt gracieux du bolide
   */
  configurerArretGracieux() {
    const signaux = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

    signaux.forEach((signal) => {
      process.on(signal, async () => {
        await this.arretGracieux(signal);
      });
    });
  }

  /**
   * Gère les erreurs critiques – diagnostic prestige
   */
  async gererErreurCritique(type, erreur) {
    try {
      const messageErreur = erreur?.message || erreur?.toString() || 'Erreur inconnue';
      const codeErreur = erreur?.code || erreur?.errno || 'INCONNU';

      await this.logEvenement('erreur_critique', {
        type,
        message: messageErreur,
        code: codeErreur,
        stack: erreur?.stack || 'Stack indisponible',
        timestamp: new Date().toISOString(),
        usageMemoire: process.memoryUsage(),
        compteurRestart: this.compteurRestart
      });

      // Vérifie si erreur nécessite restart
      const besoinRestart = this.erreursCritiques.some(erreurCritique =>
        messageErreur.includes(erreurCritique) || codeErreur === erreurCritique
      );

      if (besoinRestart) {
        await this.lancerRestart(`Erreur critique détectée : ${codeErreur} - ${messageErreur}`);
      } else {
        console.error(`❌ Erreur non critique capturée (${type}) :`, messageErreur);
      }
    } catch (erreurLog) {
      console.error('❌ Erreur lors du traitement critique :', erreurLog.message);
      await this.forceRestart('Défaillance système logs');
    }
  }

  /**
   * Vérifie usage mémoire – surveillance V8
   */
  async verifierUsageMemoire() {
    try {
      const usageMemoire = process.memoryUsage();
      const memUtiliseeMB = Math.round(usageMemoire.heapUsed / 1024 / 1024);
      const memTotaleMB = Math.round(usageMemoire.heapTotal / 1024 / 1024);

      // Log usage élevé
      if (memUtiliseeMB > 512) { // > 512MB – alerte paddock
        await this.logEvenement('usage_memoire_haut', {
          heapUtilisee: memUtiliseeMB,
          heapTotale: memTotaleMB,
          rss: Math.round(usageMemoire.rss / 1024 / 1024),
          externe: Math.round(usageMemoire.external / 1024 / 1024)
        });
      }

      // Restart si critique
      if (memUtiliseeMB > 1024) { // > 1GB – surcharge critique
        await this.lancerRestart(`Surcharge mémoire critique : ${memUtiliseeMB}MB`);
      }
    } catch (erreur) {
      console.error('❌ Erreur vérification mémoire :', erreur.message);
    }
  }

  /**
   * Lance procédure restart – redémarrage turbo
   */
  async lancerRestart(raison) {
    if (this.enArret) return;

    const maintenant = Date.now();

    // Vérifie cooldown
    if (maintenant - this.dernierRestart < this.delaiCooldown) {
      await this.logEvenement('restart_bloque', `Restart bloqué par cooldown. Raison : ${raison}`);
      return;
    }

    // Vérifie limite restarts
    if (this.compteurRestart >= this.maxRestarts) {
      await this.logEvenement('limite_restart', `Limite de ${this.maxRestarts} restarts atteinte. Arrêt système.`);
      await this.arretGracieux('MAX_RESTARTS_ATTEINT');
      return;
    }

    this.compteurRestart++;
    this.dernierRestart = maintenant;
    this.enArret = true;

    await this.logEvenement('restart_lance', {
      raison,
      compteur: this.compteurRestart,
      maxRestarts: this.maxRestarts
    });

    try {
      // Nettoyage d’urgence avant restart
      await this.nettoyageUrgence();

      // Sauvegarde état
      await this.sauvegarderEtatRestart();

      // Restart processus
      await this.redemarrerProcessus();
    } catch (erreur) {
      console.error('❌ Erreur pendant restart :', erreur.message);
      await this.logEvenement('restart_echoue', erreur.message);
    }
  }

  /**
   * Restart forcé immédiat – mode urgence paddock
   */
  async forceRestart(raison) {
    try {
      await this.logEvenement('restart_force', raison);
      await this.sauvegarderEtatRestart();
    } catch {
      // Ignore si log échoue
    }

    await this.arretGracieux('RESTART_FORCE');
  }

  /**
   * Arrêt gracieux – garage fermé proprement
   */
  async arretGracieux(signal) {
    if (this.enArret) return;
    this.enArret = true;

    try {
      await this.logEvenement('arret_gracieux', signal);

      // Nettoie fichier PID
      try {
        await fs.unlink(this.fichierPid);
      } catch {
        // Ignore si fichier absent
      }

      // Arrête processus enfant si existe
      if (this.processusEnfant && !this.processusEnfant.killed) {
        this.processusEnfant.kill('SIGTERM');
      }

      // Garbage collection finale
      if (global.gc) {
        global.gc();
      }

      // Arrêt après delay
      setTimeout(() => {
        process.exit(signal === 'MAX_RESTARTS_ATTEINT' ? 1 : 0);
      }, 2000);

    } catch (erreur) {
      console.error('❌ Erreur pendant arrêt :', erreur.message);
      process.exit(1);
    }
  }

  /**
   * Log un événement – journal de bord prestige
   */
  async logEvenement(type, data) {
    try {
      // Assure dossier logs existe
      const dossierLogs = path.dirname(this.fichierLogs);
      await fs.mkdir(dossierLogs, { recursive: true });

      const entreeLog = {
        timestamp: new Date().toISOString(),
        type,
        data,
        pid: process.pid,
        uptime: process.uptime(),
        usageMemoire: process.memoryUsage()
      };

      const ligneLog = JSON.stringify(entreeLog) + '\n';
      await fs.appendFile(this.fichierLogs, ligneLog);

    } catch (erreur) {
      console.error('❌ Erreur écriture log :', erreur.message);
    }
  }

  /**
   * Sauvegarde état restart – checkpoint paddock
   */
  async sauvegarderEtatRestart() {
    try {
      const etat = {
        timestamp: new Date().toISOString(),
        compteurRestart: this.compteurRestart,
        dernierRestart: this.dernierRestart,
        pid: process.pid
      };

      await fs.writeFile(path.join(__dirname, '../../../etat-restart-maserati.json'), JSON.stringify(etat));
    } catch (erreur) {
      console.warn('⚠️ Erreur sauvegarde état :', erreur.message);
    }
  }

  /**
   * Charge état précédent – reprise circuit
   */
  async chargerEtatRestart() {
    try {
      const fichierEtat = path.join(__dirname, '../../../etat-restart-maserati.json');
      const dataEtat = await fs.readFile(fichierEtat, 'utf8');
      const etat = JSON.parse(dataEtat);

      // Vérifie si même jour
      const dateEtat = new Date(etat.timestamp).toDateString();
      const aujourdHui = new Date().toDateString();

      if (dateEtat === aujourdHui) {
        this.compteurRestart = etat.compteurRestart || 0;
        this.dernierRestart = etat.dernierRestart || 0;

        await this.logEvenement('etat_charge', {
          restartsPrecedents: this.compteurRestart,
          pidPrecedent: etat.pid
        });
      } else {
        // Nouveau jour – reset
        this.compteurRestart = 0;
        this.dernierRestart = 0;
      }
    } catch (erreur) {
      // Fichier absent ou erreur – non critique
      this.compteurRestart = 0;
      this.dernierRestart = 0;
    }
  }

  /**
   * Redémarre le processus – turbo restart
   */
  async redemarrerProcessus() {
    try {
      // Arguments processus actuel
      const args = process.argv.slice(1);
      const argsNode = [];

      // Préserve args importants
      if (process.execArgv.includes('--expose-gc')) {
        argsNode.push('--expose-gc');
      }

      // Lance nouveau processus
      const enfant = spawn(process.execPath, [...argsNode, ...args], {
        detached: true,
        stdio: ['ignore', 'inherit', 'inherit'],
        env: {
          ...process.env,
          MASERATI_RESTARTED: 'true',
          MASERATI_COMPTEUR_RESTART: this.compteurRestart.toString()
        }
      });

      this.processusEnfant = enfant;

      enfant.on('spawn', () => {
        console.log('🏎️ Nouveau bolide démarré – PID :', enfant.pid);
      });

      enfant.on('error', async (erreur) => {
        console.error('❌ Erreur démarrage bolide :', erreur.message);
        await this.logEvenement('restart_echoue', erreur.message);
      });

      // Détache enfant
      enfant.unref();

      // Planifie arrêt actuel
      setTimeout(() => {
        process.exit(0);
      }, 5000);

    } catch (erreur) {
      console.error('❌ Défaillance critique restart :', erreur.message);
      await this.logEvenement('echec_restart_critique', erreur.message);
      process.exit(1);
    }
  }

  /**
   * Démarre le système auto-restart – allumage moteur prestige
   */
  async demarrer() {
    try {
      await this.chargerEtatRestart();

      await this.logEvenement('systeme_restart_demarre', {
        compteurRestart: this.compteurRestart,
        maxRestarts: this.maxRestarts,
        pid: process.pid
      });

      // Vérifie si restarté
      if (process.env.MASERATI_RESTARTED === 'true') {
        await this.logEvenement('restart_reussi', {
          compteurRestartPrecedent: process.env.MASERATI_COMPTEUR_RESTART || 'inconnu'
        });
      }
    } catch (erreur) {
      console.error('❌ Erreur démarrage système restart :', erreur.message);
    }
  }

  /**
   * Arrête le système – garage fermé
   */
  async arreter() {
    this.enArret = true;
    await this.logEvenement('systeme_restart_arrete', 'Arrêt manuel');
  }

  /**
   * Obtient stats système – tableau de bord paddock
   */
  obtenirStats() {
    return {
      compteurRestart: this.compteurRestart,
      maxRestarts: this.maxRestarts,
      dernierRestart: this.dernierRestart,
      enArret: this.enArret,
      uptime: process.uptime(),
      usageMemoire: process.memoryUsage(),
      pid: process.pid
    };
  }

  /**
   * Restart manuel – pour commande proprietaire
   */
  async restartManuel(raison = 'Restart manuel prestige') {
    await this.logEvenement('restart_manuel', raison);
    await this.lancerRestart(raison);
  }
}

export default SystemeRestartPrestigeMaserati;