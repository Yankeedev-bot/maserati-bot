import fs from 'fs/promises';
import { execSync } from 'child_process';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * SystemMonitor – Maserati Fleet Care 🏎️👑✨🇨🇮
 * Entretien automatique du garage – Nettoyage, optimisation, alerte
 * Développé par yankee Hells 🙂
 */
class MaseratiFleetCare {
    constructor() {
        this.dossierTemp = path.join(__dirname, '../../temp');
        this.dossierMedias = path.join(__dirname, '../../medias');
        this.seuilMaxDisque = 90;       // % max avant alerte rouge
        this.intervalleCheck = 5 * 60 * 1000;   // 5 minutes
        this.ageMaxFichier = 24 * 60 * 60 * 1000; // 24h max pour les temporaires
        this.enSurveillance = false;
        this.cacheMedias = new Map();
        this.tailleMaxCache = 100;      // max entrées dans le cache mémoire
    }

    /**
     * État actuel du disque – Combien de place reste dans le garage ?
     */
    async etatDisque() {
        try {
            const sortie = execSync('df -h / | tail -1', { encoding: 'utf8' });
            const morceaux = sortie.trim().split(/\s+/);
            const utilisePourcent = morceaux[4].replace('%', '');
            return {
                utilise: parseInt(utilisePourcent),
                disponible: morceaux[3],
                total: morceaux[1]
            };
        } catch (err) {
            console.error('❌ Erreur lecture état disque:', err.message);
            return { utilise: 0, disponible: '0', total: '0' };
        }
    }

    /**
     * État de la RAM – Combien de chevaux restent disponibles ?
     */
    async etatMemoire() {
        try {
            const contenu = await fs.readFile('/proc/meminfo', 'utf8');
            const lignes = contenu.split('\n');

            const valeur = (cle) => {
                const ligne = lignes.find(l => l.startsWith(cle));
                return ligne ? parseInt(ligne.match(/\d+/)[0]) : 0;
            };

            const total = valeur('MemTotal');
            const libre = valeur('MemFree');
            const buffers = valeur('Buffers');
            const cache = valeur('Cached');

            const utilise = total - libre - buffers - cache;
            const pourcentUtilise = Math.round((utilise / total) * 100);

            return {
                totalMo: Math.round(total / 1024),
                utiliseMo: Math.round(utilise / 1024),
                libreMo: Math.round((total - utilise) / 1024),
                pourcentUtilise
            };
        } catch (err) {
            console.error('❌ Erreur lecture mémoire:', err.message);
            return { totalMo: 0, utiliseMo: 0, libreMo: 0, pourcentUtilise: 0 };
        }
    }

    /**
     * Nettoyage des fichiers temporaires – On dégage les vieux pneus usés
     */
    async nettoyerTemporaires() {
        try {
            await this.assurerDossier(this.dossierTemp);
            const fichiers = await fs.readdir(this.dossierTemp);
            let supprimes = 0;
            let espaceLibere = 0;

            for (const fichier of fichiers) {
                const chemin = path.join(this.dossierTemp, fichier);
                try {
                    const stats = await fs.stat(chemin);
                    const age = Date.now() - stats.mtime.getTime();

                    if (age > this.ageMaxFichier) {
                        espaceLibere += stats.size;
                        await fs.unlink(chemin);
                        supprimes++;
                    }
                } catch (err) {
                    console.warn(`⚠️ Problème fichier temp ${fichier}:`, err.message);
                }
            }

            return { supprimes, espaceLibere };
        } catch (err) {
            console.error('❌ Erreur nettoyage temporaires:', err.message);
            return { supprimes: 0, espaceLibere: 0 };
        }
    }

    /**
     * Nettoyage du cache médias – On vide le coffre des accessoires inutilisés
     */
    async nettoyerCacheMedias() {
        try {
            if (this.cacheMedias.size <= this.tailleMaxCache) {
                return { liberes: 0, memoireLiberee: 0 };
            }

            const entrees = Array.from(this.cacheMedias.entries());
            entrees.sort((a, b) => a[1].lastAccess - b[1].lastAccess);

            const aSupprimer = entrees.slice(0, entrees.length - this.tailleMaxCache);
            let memoireLiberee = 0;

            for (const [cle, valeur] of aSupprimer) {
                if (valeur.buffer) {
                    memoireLiberee += valeur.buffer.length;
                }
                this.cacheMedias.delete(cle);
            }

            return { liberes: aSupprimer.length, memoireLiberee };
        } catch (err) {
            console.error('❌ Erreur nettoyage cache médias:', err.message);
            return { liberes: 0, memoireLiberee: 0 };
        }
    }

    /**
     * Compression des fichiers médias lourds – On optimise le coffre
     */
    async compresserGrosFichiers() {
        try {
            await this.assurerDossier(this.dossierMedias);
            const fichiers = await fs.readdir(this.dossierMedias);
            let compresses = 0;
            let espaceGagne = 0;

            for (const fichier of fichiers) {
                const chemin = path.join(this.dossierMedias, fichier);
                try {
                    const stats = await fs.stat(chemin);
                    const tailleMo = stats.size / (1024 * 1024);

                    if (tailleMo > 10) {
                        const tailleAvant = stats.size;
                        const resultat = await this.compresserFichier(chemin);

                        if (resultat.succes) {
                            espaceGagne += (tailleAvant - resultat.nouvelleTaille);
                            compresses++;
                        }
                    }
                } catch (err) {
                    console.warn(`⚠️ Problème fichier ${fichier}:`, err.message);
                }
            }

            return { compresses, espaceGagne };
        } catch (err) {
            console.error('❌ Erreur compression médias:', err.message);
            return { compresses: 0, espaceGagne: 0 };
        }
    }

    /**
     * Force le garbage collector – On dégage la poussière du moteur
     */
    forcerNettoyageMemoire() {
        try {
            if (global.gc) {
                global.gc();
            } else {
                console.warn('⚠️ --expose-gc non activé – GC manuel indisponible');
            }
        } catch (err) {
            console.error('❌ Erreur garbage collection:', err.message);
        }
    }

    /**
     * Alerte rouge ? Faut-il un pit-stop d’urgence ?
     */
    async alerteUrgence() {
        const disque = await this.etatDisque();
        const memoire = await this.etatMemoire();

        return {
            disquePlein: disque.utilise >= this.seuilMaxDisque,
            memoireSurcharge: memoire.pourcentUtilise >= 85,
            critique: disque.utilise >= 95 || memoire.pourcentUtilise >= 95
        };
    }

    /**
     * Pit-stop d’urgence – On dégage tout ce qui peut l’être
     */
    async pitStopUrgence() {
        const resultats = {
            temporaires: await this.nettoyerTemporaires(),
            cacheMedias: await this.nettoyerCacheMedias(),
            compression: await this.compresserGrosFichiers()
        };

        this.forcerNettoyageMemoire();
        await this.nettoyerAnciensLogs();

        return resultats;
    }

    /**
     * Nettoyage des vieux logs – Adieu les anciens tours de piste
     */
    async nettoyerAnciensLogs() {
        try {
            const chemins = [
                path.join(__dirname, '../../logs'),
                '/tmp/maserati-logs',
                './logs'
            ];

            let supprimes = 0;

            for (const chemin of chemins) {
                try {
                    await this.assurerDossier(chemin);
                    const fichiers = await fs.readdir(chemin);

                    for (const fichier of fichiers) {
                        if (fichier.endsWith('.log') || fichier.endsWith('.txt')) {
                            const cheminComplet = path.join(chemin, fichier);
                            const stats = await fs.stat(cheminComplet);
                            const age = Date.now() - stats.mtime.getTime();

                            if (age > 7 * 24 * 60 * 60 * 1000) {
                                await fs.unlink(cheminComplet);
                                supprimes++;
                            }
                        }
                    }
                } catch {
                    // dossier inexistant → on passe
                }
            }
        } catch (err) {
            console.error('❌ Erreur nettoyage logs:', err.message);
        }
    }

    /**
     * Démarre la surveillance 24/7 du garage Maserati
     */
    demarrerSurveillance() {
        if (this.enSurveillance) return;

        this.enSurveillance = true;

        const surveillance = async () => {
            try {
                const etat = await this.alerteUrgence();

                if (etat.critique) {
                    console.log('🚨 PIT-STOP D’URGENCE DÉCLENCHÉ !');
                    await this.pitStopUrgence();
                }
                else if (etat.disquePlein || etat.memoireSurcharge) {
                    await this.nettoyerTemporaires();
                    await this.nettoyerCacheMedias();
                    this.forcerNettoyageMemoire();
                }
            } catch (err) {
                console.error('❌ Erreur pendant surveillance:', err.message);
            }
        };

        setInterval(surveillance, this.intervalleCheck);
        setTimeout(surveillance, 5000); // premier check rapide
    }

    arreterSurveillance() {
        this.enSurveillance = false;
    }

    async assurerDossier(chemin) {
        try {
            await fs.access(chemin);
        } catch {
            await fs.mkdir(chemin, { recursive: true });
        }
    }

    /**
     * Compression gzip d’un fichier média
     */
    async compresserFichier(chemin) {
        try {
            const stats = await fs.stat(chemin);
            const tailleAvant = stats.size;

            if (tailleAvant < 1024) {
                return { succes: false, tailleAvant, nouvelleTaille: tailleAvant };
            }

            const donnees = await fs.readFile(chemin);
            const compresse = zlib.gzipSync(donnees);

            const cheminTemp = chemin + '.gz';
            await fs.writeFile(cheminTemp, compresse);
            await fs.unlink(chemin);
            await fs.rename(cheminTemp, chemin);

            const nouvelleStats = await fs.stat(chemin);
            return {
                succes: true,
                tailleAvant,
                nouvelleTaille: nouvelleStats.size
            };
        } catch (err) {
            return { succes: false, erreur: err.message };
        }
    }

    /**
     * Tableau de bord complet – État de la flotte
     */
    async tableauDeBord() {
        const disque = await this.etatDisque();
        const memoire = await this.etatMemoire();

        return {
            disque,
            memoire,
            tailleCacheMedias: this.cacheMedias.size,
            surveillanceActive: this.enSurveillance,
            horodatage: new Date().toISOString()
        };
    }
}

export default MaseratiFleetCare;

// Développé par yankee Hells 🙂 🏎️👑✨🇨🇮