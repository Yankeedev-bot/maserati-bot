#!/usr/bin/env node

import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { exec } from 'child_process';
import os from 'os';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_URL = 'https://github.com/hiudyy/nazuna.git'; // ← À changer quand tu auras ton propre repo Maserati
const BACKUP_DIR = path.join(process.cwd(), `sauvegarde_${new Date().toISOString().replace(/[:.]/g, '_').replace(/T/, '_')}`);
const TEMP_DIR = path.join(process.cwd(), 'temp_maserati');
const isWindows = os.platform() === 'win32';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[1;32m',
  red: '\x1b[1;31m',
  blue: '\x1b[1;34m',
  yellow: '\x1b[1;33m',
  cyan: '\x1b[1;36m',
  magenta: '\x1b[1;35m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};

function afficherMessage(texte) {
  console.log(`\( {colors.green} \){texte}${colors.reset}`);
}

function afficherAvertissement(texte) {
  console.log(`\( {colors.red} \){texte}${colors.reset}`);
}

function afficherInfo(texte) {
  console.log(`\( {colors.cyan} \){texte}${colors.reset}`);
}

function afficherDetail(texte) {
  console.log(`\( {colors.dim} \){texte}${colors.reset}`);
}

function afficherSeparateur() {
  console.log(`\( {colors.blue}════════════════════════════════════════════ \){colors.reset}`);
}

function gererArretPropre() {
  const arreter = () => {
    console.log('\n');
    afficherAvertissement('🛑 Mise à jour annulée par l’utilisateur.');
    process.exit(0);
  };

  process.on('SIGINT', arreter);
  process.on('SIGTERM', arreter);
}

async function afficherEntete() {
  const entete = [
    `\( {colors.bold}🏎️ MASERATI-BOT - Mise à jour Prestige 👑✨ \){colors.reset}`,
    `\( {colors.bold}Créé par yankee Hells 🙂 \){colors.reset}`,
  ];

  afficherSeparateur();
  for (const ligne of entete) {
    process.stdout.write(ligne + '\n');
  }
  afficherSeparateur();
  console.log();
}

async function verifierRequis() {
  afficherInfo('🔍 Vérification des prérequis système...');

  try {
    await execAsync('git --version');
    afficherDetail('✅ Git détecté.');
  } catch {
    afficherAvertissement('⚠️ Git introuvable ! Indispensable pour la mise à jour.');
    if (isWindows) {
      afficherInfo('📥 Installe Git ici : https://git-scm.com/download/win');
    } else if (os.platform() === 'darwin') {
      afficherInfo('📥 Installe avec : brew install git');
    } else {
      afficherInfo('📥 Installe avec : sudo apt install git (ou équivalent)');
    }
    process.exit(1);
  }

  try {
    await execAsync('npm --version');
    afficherDetail('✅ NPM détecté.');
  } catch {
    afficherAvertissement('⚠️ NPM introuvable ! Nécessaire pour les dépendances.');
    afficherInfo('📥 Installe Node.js + NPM : https://nodejs.org');
    process.exit(1);
  }

  afficherDetail('✅ Tous les prérequis sont OK.');
}

async function confirmerMiseAJour() {
  afficherAvertissement('⚠️ Attention : la mise à jour écrasera les fichiers existants (sauf config & données).');
  afficherInfo('📂 Une sauvegarde automatique sera créée.');
  afficherAvertissement('🛑 Ctrl+C pour annuler à tout moment.');

  return new Promise((resolve) => {
    let compteARebours = 5;
    const timer = setInterval(() => {
      process.stdout.write(`\r⏳ Départ dans \( {compteARebours} secondes... \){' '.repeat(20)}`);
      compteARebours--;

      if (compteARebours < 0) {
        clearInterval(timer);
        process.stdout.write('\r                                  \n');
        afficherMessage('🏎️ Accélération… Mise à jour lancée !');
        resolve();
      }
    }, 1000);
  });
}

async function creerSauvegarde() {
  afficherMessage('📁 Création de la sauvegarde...');

  try {
    if (!BACKUP_DIR || BACKUP_DIR.includes('..')) {
      throw new Error('Chemin de sauvegarde invalide');
    }

    await fs.mkdir(path.join(BACKUP_DIR, 'donnees', 'database'), { recursive: true });
    await fs.mkdir(path.join(BACKUP_DIR, 'donnees', 'src'), { recursive: true });
    await fs.mkdir(path.join(BACKUP_DIR, 'donnees', 'medias'), { recursive: true });

    const dossierDatabase = path.join(process.cwd(), 'donnees', 'database');
    if (fsSync.existsSync(dossierDatabase)) {
      afficherDetail('📂 Sauvegarde de la base de données...');
      await fs.cp(dossierDatabase, path.join(BACKUP_DIR, 'donnees', 'database'), { recursive: true });
    }

    const fichierConfig = path.join(process.cwd(), 'donnees', 'src', 'config.json');
    if (fsSync.existsSync(fichierConfig)) {
      afficherDetail('📝 Sauvegarde de la configuration...');
      await fs.copyFile(fichierConfig, path.join(BACKUP_DIR, 'donnees', 'src', 'config.json'));
    }

    const dossierMedias = path.join(process.cwd(), 'donnees', 'medias');
    if (fsSync.existsSync(dossierMedias)) {
      afficherDetail('🖼️ Sauvegarde des médias...');
      await fs.cp(dossierMedias, path.join(BACKUP_DIR, 'donnees', 'medias'), { recursive: true });
    }

    afficherMessage(`✅ Sauvegarde créée ici : ${BACKUP_DIR}`);
  } catch (erreur) {
    afficherAvertissement(`❌ Erreur sauvegarde : ${erreur.message}`);
    afficherInfo('La mise à jour est annulée pour protéger tes données.');
    throw erreur;
  }
}

async function telechargerMiseAJour() {
  afficherMessage('📥 Téléchargement de la dernière version Maserati...');

  try {
    if (fsSync.existsSync(TEMP_DIR)) {
      afficherDetail('🔄 Suppression du dossier temporaire existant...');
      await fs.rm(TEMP_DIR, { recursive: true, force: true });
    }

    afficherDetail('🔄 Clonage du dépôt...');
    const gitProcess = exec(`git clone --depth 1 \( {REPO_URL} " \){TEMP_DIR}"`);

    const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    const interval = setInterval(() => {
      process.stdout.write(`\r${spinner[i]} Téléchargement en cours...`);
      i = (i + 1) % spinner.length;
    }, 100);

    return new Promise((resolve, reject) => {
      gitProcess.on('close', async (code) => {
        clearInterval(interval);
        process.stdout.write('\r                 \r');

        if (code !== 0) {
          reject(new Error(`Git clone échoué - code ${code}`));
          return;
        }

        if (!fsSync.existsSync(TEMP_DIR)) {
          reject(new Error('Dossier temporaire non créé'));
          return;
        }

        // Optionnel : suppression README si présent
        try {
          const readme = path.join(TEMP_DIR, 'README.md');
          if (fsSync.existsSync(readme)) await fs.unlink(readme);
        } catch {}

        afficherMessage('✅ Téléchargement terminé.');
        resolve();
      });

      gitProcess.on('error', (err) => {
        clearInterval(interval);
        reject(err);
      });
    });
  } catch (erreur) {
    afficherAvertissement(`❌ Échec téléchargement : ${erreur.message}`);
    throw erreur;
  }
}

async function nettoyerAnciensFichiers(options = {}) {
  const { supprimerNodeModules = true, supprimerPackageLock = true } = options;
  afficherMessage('🧹 Nettoyage des anciens fichiers...');

  try {
    const aSupprimer = [
      { chemin: path.join(process.cwd(), '.git'), type: 'dossier' },
      { chemin: path.join(process.cwd(), '.github'), type: 'dossier' },
      { chemin: path.join(process.cwd(), 'README.md'), type: 'fichier' },
    ];

    if (supprimerNodeModules) {
      aSupprimer.push({ chemin: path.join(process.cwd(), 'node_modules'), type: 'dossier' });
    }
    if (supprimerPackageLock) {
      aSupprimer.push({ chemin: path.join(process.cwd(), 'package-lock.json'), type: 'fichier' });
    }

    for (const item of aSupprimer) {
      if (fsSync.existsSync(item.chemin)) {
        afficherDetail(`🗑️ Suppression de ${path.basename(item.chemin)}...`);
        if (item.type === 'dossier') {
          await fs.rm(item.chemin, { recursive: true, force: true });
        } else {
          await fs.unlink(item.chemin);
        }
      }
    }

    afficherMessage('✅ Nettoyage terminé.');
  } catch (erreur) {
    afficherAvertissement(`❌ Erreur nettoyage : ${erreur.message}`);
    throw erreur;
  }
}

async function appliquerMiseAJour() {
  afficherMessage('🚀 Application de la mise à jour...');

  try {
    await fs.cp(TEMP_DIR, process.cwd(), { recursive: true });
    await fs.rm(TEMP_DIR, { recursive: true, force: true });
    afficherMessage('✅ Mise à jour appliquée avec succès.');
  } catch (erreur) {
    afficherAvertissement(`❌ Échec application : ${erreur.message}`);
    throw erreur;
  }
}

async function restaurerSauvegarde() {
  afficherMessage('📂 Restauration de la sauvegarde...');

  try {
    const srcDatabase = path.join(BACKUP_DIR, 'donnees', 'database');
    if (fsSync.existsSync(srcDatabase)) {
      await fs.cp(srcDatabase, path.join(process.cwd(), 'donnees', 'database'), { recursive: true });
    }

    const srcConfig = path.join(BACKUP_DIR, 'donnees', 'src', 'config.json');
    if (fsSync.existsSync(srcConfig)) {
      await fs.copyFile(srcConfig, path.join(process.cwd(), 'donnees', 'src', 'config.json'));
    }

    const srcMedias = path.join(BACKUP_DIR, 'donnees', 'medias');
    if (fsSync.existsSync(srcMedias)) {
      await fs.cp(srcMedias, path.join(process.cwd(), 'donnees', 'medias'), { recursive: true });
    }

    afficherMessage('✅ Sauvegarde restaurée.');
  } catch (erreur) {
    afficherAvertissement(`❌ Échec restauration : ${erreur.message}`);
    throw erreur;
  }
}

async function verifierChangementsDependances() {
  afficherInfo('🔍 Analyse des changements de dépendances...');

  try {
    const pkgActuelPath = path.join(process.cwd(), 'package.json');
    const pkgNouveauPath = path.join(TEMP_DIR, 'package.json');

    if (!fsSync.existsSync(pkgActuelPath) || !fsSync.existsSync(pkgNouveauPath)) {
      return 'MISSING';
    }

    const pkgActuel = JSON.parse(await fs.readFile(pkgActuelPath, 'utf8'));
    const pkgNouveau = JSON.parse(await fs.readFile(pkgNouveauPath, 'utf8'));

    const clesImportantes = ['dependencies', 'devDependencies', 'scripts'];
    let changement = false;

    for (const cle of clesImportantes) {
      if (JSON.stringify(pkgActuel[cle] || {}) !== JSON.stringify(pkgNouveau[cle] || {})) {
        changement = true;
        break;
      }
    }

    return changement ? 'CHANGED' : 'NO_CHANGE';
  } catch (erreur) {
    afficherAvertissement(`❌ Erreur vérification deps : ${erreur.message}`);
    return 'ERROR';
  }
}

async function installerDependances(resultatPrecalcule) {
  const etat = resultatPrecalcule || await verifierChangementsDependances();

  if (etat === 'NO_CHANGE') {
    afficherMessage('⚡ Dépendances déjà à jour – installation sautée.');
    return;
  }

  afficherMessage('📦 Installation / mise à jour des dépendances...');

  try {
    await execAsync('npm run config:install', { shell: isWindows });
    afficherMessage('✅ Dépendances installées.');
  } catch (erreur) {
    afficherAvertissement(`❌ Échec installation : ${erreur.message}`);
    throw erreur;
  }
}

async function nettoyageFinal() {
  try {
    if (fsSync.existsSync(TEMP_DIR)) {
      await fs.rm(TEMP_DIR, { recursive: true, force: true });
    }
    afficherDetail('🧹 Fichiers temporaires nettoyés.');
  } catch {}
}

async function main() {
  let sauvegardeCreee = false;
  let telechargementOk = false;
  let miseAJourAppliquee = false;
  let etatDeps = null;

  try {
    gererArretPropre();
    await afficherEntete();
    await verifierRequis();
    await confirmerMiseAJour();
    await creerSauvegarde();
    sauvegardeCreee = true;
    await telechargerMiseAJour();
    telechargementOk = true;
    etatDeps = await verifierChangementsDependances();
    const supprimerModules = etatDeps !== 'NO_CHANGE';
    await nettoyerAnciensFichiers({
      supprimerNodeModules: supprimerModules,
      supprimerPackageLock: supprimerModules,
    });
    await appliquerMiseAJour();
    miseAJourAppliquee = true;
    await restaurerSauvegarde();
    await installerDependances(etatDeps);
    await nettoyageFinal();

    afficherSeparateur();
    afficherMessage('🎉 Maserati-Bot mis à jour avec succès ! 🏎️💨');
    afficherMessage('Démarre le bot avec : npm start');
    afficherSeparateur();
  } catch (erreur) {
    afficherSeparateur();
    afficherAvertissement(`❌ Erreur pendant la mise à jour : ${erreur.message}`);

    if (sauvegardeCreee && !miseAJourAppliquee) {
      try {
        await restaurerSauvegarde();
        afficherInfo('📂 Version précédente restaurée automatiquement.');
      } catch (e) {
        afficherAvertissement('⚠️ Échec restauration auto.');
      }
    }

    afficherInfo(`Sauvegarde disponible ici : ${BACKUP_DIR || '—'}`);
    process.exit(1);
  }
}

main();
