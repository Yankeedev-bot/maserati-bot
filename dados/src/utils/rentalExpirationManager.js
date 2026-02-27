import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Gestionnaire d'expiration de location – Maserati-Bot System
 * Développé par yankee Hells 🙂 🏎️👑✨🇨🇮
 */
class GestionnaireExpirationLocation {
  constructor(maseratiBot, config = {}) {
    this.maseratiBot = maseratiBot;
    this.numeroProprietaire = config.numeroProprietaire || null;
    this.nomProprietaire = config.nomProprietaire || 'Boss Maserati';
    this.config = {
      intervalleVerif: config.intervalleVerif || '0 */6 * * *', // Toutes les 6h
      joursAvertissement: config.joursAvertissement || 3,
      joursDernierAvertissement: config.joursDernierAvertissement || 1,
      delaiNettoyageHeures: config.delaiNettoyageHeures || 24,
      notificationsActives: config.notificationsActives !== false,
      nettoyageAutoActif: config.nettoyageAutoActif !== false,
      fichierLog: config.fichierLog || path.join(__dirname, '../logs/expiration_maserati.log'),
      ...config
    };

    this.enCours = false;
    this.derniereVerif = null;
    this.stats = {
      verifsTotales: 0,
      avertissementsEnvoyes: 0,
      derniersAvertissements: 0,
      locationsExpireesTraitees: 0,
      erreurs: 0
    };
  }

  async initialiser() {
    try {
      const dossierLogs = path.dirname(this.config.fichierLog);
      await fs.mkdir(dossierLogs, { recursive: true });

      this.demarrerPlanificateur();

      await this.journal('🚀 Gestionnaire d’expiration Maserati initialisé avec succès');

      return true;
    } catch (err) {
      console.error('❌ Échec initialisation Gestionnaire Maserati:', err);
      return false;
    }
  }

  demarrerPlanificateur() {
    if (this.enCours) {
      console.warn('⚠️  Le moteur Maserati tourne déjà');
      return;
    }

    this.tacheCron = cron.schedule(this.config.intervalleVerif, async () => {
      await this.verifierLocationsExpirees();
    }, {
      scheduled: false,
      timezone: 'Africa/Abidjan'
    });

    this.tacheCron.start();
    this.enCours = true;

    this.journal(`Moteur lancé – Vitesse de contrôle : ${this.config.intervalleVerif}`);
  }

  arreterPlanificateur() {
    if (!this.enCours) return;

    if (this.tacheCron) this.tacheCron.stop();

    this.enCours = false;
    this.journal('Moteur Maserati coupé 🛑');
  }

  async verifierLocationsExpirees() {
    try {
      const debut = Date.now();
      await this.journal('🔍 Contrôle des bolides en location démarré...');

      this.stats.verifsTotales++;
      this.derniereVerif = new Date();

      const donnees = await this.chargerDonneesLocations();
      if (!donnees || !donnees.groupes) {
        await this.journal('Aucune location enregistrée ou structure invalide');
        return;
      }

      const maintenant = new Date();
      let traites = 0, avertis = 0, derniersAvertis = 0, expires = 0;

      for (const [idGroupe, infos] of Object.entries(donnees.groupes)) {
        try {
          if (infos.permanent) continue; // Bolide acheté cash → intouchable

          const dateFin = new Date(infos.expiresLe);
          const tempsRestantMs = dateFin - maintenant;
          const joursRestants = Math.ceil(tempsRestantMs / (1000 * 60 * 60 * 24));

          if (joursRestants <= 0) {
            await this.traiterLocationExpiree(idGroupe, infos, donnees);
            expires++;
          }
          else if (joursRestants <= this.config.joursDernierAvertissement) {
            if (infos.dernierAvertissement !== 'dernier') {
              await this.envoyerAlerteExpiration(idGroupe, 'dernier', joursRestants);
              infos.dernierAvertissement = 'dernier';
              derniersAvertis++;
            }
          }
          else if (joursRestants <= this.config.joursAvertissement) {
            if (infos.dernierAvertissement !== 'avertissement') {
              await this.envoyerAlerteExpiration(idGroupe, 'avertissement', joursRestants);
              infos.dernierAvertissement = 'avertissement';
              avertis++;
            }
          }

          traites++;
        } catch (err) {
          console.error(`❌ Problème groupe ${idGroupe}:`, err);
          await this.journal(`Erreur traitement ${idGroupe}: ${err.message}`);
          this.stats.erreurs++;
        }
      }

      await this.sauvegarderDonneesLocations(donnees);

      this.stats.avertissementsEnvoyes += avertis;
      this.stats.derniersAvertissements += derniersAvertis;
      this.stats.locationsExpireesTraitees += expires;

      const duree = Date.now() - debut;
      await this.journal(
        `Tour terminé → Groupes: ${traites} | Avertis: ${avis} | Ultime rappel: ${derniersAvertis} | Expirés: ${expires} | ${duree}ms`
      );

    } catch (err) {
      console.error('❌ Erreur critique contrôle Maserati:', err);
      await this.journal(`Erreur grave: ${err.message}`);
      this.stats.erreurs++;
    }
  }

  async traiterLocationExpiree(idGroupe, infos, donnees) {
    try {
      const meta = await this.maseratiBot.groupMetadata(idGroupe).catch(() => null);
      if (!meta) {
        await this.journal(`Groupe ${idGroupe} introuvable → suppression`);
        delete donnees.groupes[idGroupe];
        return;
      }

      if (this.config.notificationsActives) {
        await this.envoyerAlerteExpiration(idGroupe, 'expire', 0);
      }

      if (this.config.nettoyageAutoActif) {
        setTimeout(async () => {
          await this.effectuerNettoyageAuto(idGroupe, meta);
        }, this.config.delaiNettoyageHeures * 3600000);
      }

      await this.journal(`Location terminée → \( {meta.subject} ( \){idGroupe})`);
    } catch (err) {
      console.error(`❌ Erreur traitement expiration ${idGroupe}:`, err);
      await this.journal(`Erreur expiration ${idGroupe}: ${err.message}`);
    }
  }

  async envoyerAlerteExpiration(idGroupe, type, joursRestants) {
    try {
      const meta = await this.maseratiBot.groupMetadata(idGroupe).catch(() => null);
      if (!meta) return;

      const proprio = await this.infosProprietaire();
      const texte = this.construireMessageExpiration(type, joursRestants, meta, proprio);

      // Envoi dans le groupe
      await this.maseratiBot.sendMessage(idGroupe, { text: texte }).catch(() => {});

      // Envoi aux admins
      const admins = (meta.participants || []).filter(p => p.admin);
      for (const admin of admins) {
        await this.maseratiBot.sendMessage(admin.id, { text: texte }).catch(() => {});
      }

      await this.journal(`Alerte ${type} envoyée → \( {meta.subject} ( \){idGroupe})`);
    } catch (err) {
      await this.journal(`Échec alerte ${type} → ${idGroupe}: ${err.message}`);
    }
  }

  construireMessageExpiration(type, joursRestants, meta, proprio) {
    const nomGroupe = meta.subject;
    const nomBoss = proprio.nom;
    const numeroBoss = proprio.numero;

    let entete, corps, actionDemandee;

    switch (type) {
      case 'avertissement':
        entete = '⚠️  ATTENTION – MOTEUR QUI S’ÉCHAUFFE';
        corps = `La location Maserati du groupe *\( {nomGroupe}* expire dans ** \){joursRestants} jour${joursRestants > 1 ? 's' : ''}** ! 🏎️`;
        actionDemandee = `Contacte le Boss pour renouveler ou utilise un code valide avant que le bolide ne quitte la piste.`;
        break;

      case 'dernier':
        entete = '🚨 DERNIER TOUR DE PISTE';
        corps = `Le chrono tombe à zéro demain pour *${nomGroupe}* !`;
        actionDemandee = `Renouvelle MAINTENANT sinon Maserati-Bot prend la sortie...`;
        break;

      case 'expire':
        entete = '❌ GAME OVER – LOCATION TERMINÉE';
        corps = `Le plein est vide pour *${nomGroupe}*. Maserati-Bot va bientôt quitter la route.`;
        actionDemandee = `Contacte le Boss pour remettre du carburant premium et revenir sur la piste.`;
        break;

      default:
        entete = '📡 SIGNAL MASERATI';
        corps = `Information importante concernant *${nomGroupe}*`;
        actionDemandee = 'Vérifie ton statut.';
    }

    const pied = `
📞 **Contact Boss Maserati :**
• Nom : ${nomBoss}
• Numéro : ${numeroBoss}
→ Répondre : ${numeroBoss}@s.whatsapp.net

💨 **Conseils de pro :**
• Renouvelle avant la panne sèche
• Utilise uniquement des codes officiels
• Contact direct = plus rapide`;

    return `
╭────── ❗ ${entete} ❗ ──────╮
${corps}

${actionDemandee}

${pied}

🏎️ *Message automatique – Maserati-Bot System* 👑✨🇨🇮`;
  }

  async effectuerNettoyageAuto(idGroupe, meta) {
    try {
      const messageAdieu = `
👋 **AU REVOIR ${meta.subject.toUpperCase()} – LA PISTE EST TERMINÉE !**

Location expirée → Maserati-Bot quitte le groupe.

Pour remonter en selle :

📞 **Contacte le Boss :**
• Nom : ${await this.nomProprietaire()}
• Numéro : ${await this.numeroProprietaire()}
→ Répondre : ${await this.contactProprietaire()}

🎯 **Étapes pour revenir :**
1. Envoie message au Boss
2. Demande un nouveau code Maserati
3. Active-le dans le groupe
4. Vroum vroum ! On repart

🤖 Merci d’avoir roulé avec nous – À très vite sur la route ! 🏁`;

      await this.maseratiBot.sendMessage(idGroupe, { text: messageAdieu });

      await this.maseratiBot.groupLeave(idGroupe);

      const donnees = await this.chargerDonneesLocations();
      if (donnees.groupes?.[idGroupe]) {
        delete donnees.groupes[idGroupe];
        await this.sauvegarderDonneesLocations(donnees);
      }

      await this.journal(`Maserati-Bot a quitté ${idGroupe} après expiration`);
    } catch (err) {
      await this.journal(`Problème nettoyage auto ${idGroupe}: ${err.message}`);
    }
  }

  async infosProprietaire() {
    try {
      const nom = this.nomProprietaire || process.env.NOM_BOSS || 'Boss Maserati';
      const numero = this.numeroProprietaire || process.env.NUMERO_BOSS || '2250000000000';
      let contact = `${numero}@s.whatsapp.net`;

      if (this.maseratiBot?.onWhatsApp) {
        try {
          const numClean = numero.replace(/\D/g, '');
          const [resultat] = await this.maseratiBot.onWhatsApp(numClean);
          if (resultat?.jid) contact = resultat.jid;
        } catch {}
      }

      return { nom, numero, contact };
    } catch {
      return {
        nom: this.nomProprietaire || 'Boss Maserati',
        numero: this.numeroProprietaire || '2250000000000',
        contact: `${this.numeroProprietaire || '2250000000000'}@s.whatsapp.net`
      };
    }
  }

  async nomProprietaire()       { return (await this.infosProprietaire()).nom;     }
  async numeroProprietaire()    { return (await this.infosProprietaire()).numero;  }
  async contactProprietaire()   { return (await this.infosProprietaire()).contact; }

  // ────────────────────────────────────────────────
  // Gestion fichier JSON locations
  // ────────────────────────────────────────────────

  async chargerDonneesLocations() {
    try {
      const dossier = path.join(__dirname, '../../database/maserati');
      const fichier = path.join(dossier, 'locations.json');

      try {
        await fs.access(fichier);
      } catch {
        const defaut = { modeGlobal: false, groupes: {} };
        await fs.writeFile(fichier, JSON.stringify(defaut, null, 2));
        return defaut;
      }

      const contenu = await fs.readFile(fichier, 'utf8');
      return JSON.parse(contenu);
    } catch (err) {
      console.error('❌ Erreur lecture locations:', err);
      return { modeGlobal: false, groupes: {} };
    }
  }

  async sauvegarderDonneesLocations(data) {
    try {
      const dossier = path.join(__dirname, '../../database/maserati');
      const fichier = path.join(dossier, 'locations.json');
      await fs.writeFile(fichier, JSON.stringify(data, null, 2));
      return true;
    } catch (err) {
      console.error('❌ Erreur sauvegarde locations:', err);
      return false;
    }
  }

  async journal(message) {
    try {
      const heure = new Date().toISOString();
      const ligne = `[${heure}] ${message}\n`;
      await fs.appendFile(this.config.fichierLog, ligne, 'utf8');
    } catch (err) {
      console.error('❌ Erreur écriture log:', err);
    }
  }

  obtenirStats() {
    return {
      ...this.stats,
      enCours: this.enCours,
      derniereVerif: this.derniereVerif,
      config: this.config
    };
  }

  async reinitialiserStats() {
    this.stats = {
      verifsTotales: 0,
      avertissementsEnvoyes: 0,
      derniersAvertissements: 0,
      locationsExpireesTraitees: 0,
      erreurs: 0
    };
    await this.journal('Statistiques remises à zéro 🏁');
    return true;
  }
}

export default GestionnaireExpirationLocation;

// Développé par yankee Hells 🙂 🏎️👑✨🇨🇮