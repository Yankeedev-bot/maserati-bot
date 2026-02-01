#!/usr/bin/env node

import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { spawn, execSync } from 'child_process';
import readline from 'readline/promises';
import os from 'os';

const CONFIG_PATH = path.join(process.cwd(), 'donnees', 'src', 'config.json');
const NODE_MODULES_PATH = path.join(process.cwd(), 'node_modules');
const QR_CODE_DIR = path.join(process.cwd(), 'donnees', 'database', 'qr-code');
const CONNECT_FILE = path.join(process.cwd(), 'donnees', 'src', 'connect.js');
const isWindows = os.platform() === 'win32';
const isTermux = fsSync.existsSync('/data/data/com.termux');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[1;32m',
  red: '\x1b[1;31m',
  blue: '\x1b[1;34m',
  yellow: '\x1b[1;33m',
  cyan: '\x1b[1;36m',
  bold: '\x1b[1m',
};

const message = (text) => console.log(`\( {colors.green} \){text}${colors.reset}`);
const avertissement = (text) => console.log(`\( {colors.red} \){text}${colors.reset}`);
const info = (text) => console.log(`\( {colors.cyan} \){text}${colors.reset}`);
const separateur = () => console.log(`\( {colors.blue}════════════════════════════════════════════ \){colors.reset}`);

const obtenirVersion = () => {
  try {
    const packageJson = JSON.parse(fsSync.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    return packageJson.version || 'Inconnue';
  } catch {
    return 'Inconnue';
  }
};

let processusBot = null;
const version = obtenirVersion();

async function configurerDemarrageAutoTermux() {
  if (!isTermux) {
    info('📱 Pas d\'environnement Termux détecté. Configuration autostart ignorée.');
    return;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const reponse = await rl.question(`${colors.yellow}📱 Termux détecté. Voulez-vous configurer le démarrage automatique ? (o/n) : ${colors.reset}`);
  rl.close();

  if (reponse.trim().toLowerCase() !== 'o') {
    info('📱 Configuration autostart annulée par l\'utilisateur.');
    return;
  }

  info('📱 Configuration du démarrage automatique Termux en cours...');

  try {
    const termuxProperties = path.join(process.env.HOME, '.termux', 'termux.properties');
    await fs.mkdir(path.dirname(termuxProperties), { recursive: true });
    if (!fsSync.existsSync(termuxProperties)) {
      await fs.writeFile(termuxProperties, '');
    }
    execSync(`sed '/^# *allow-external-apps *= *true/s/^# *//' ${termuxProperties} -i && termux-reload-settings`, { stdio: 'inherit' });
    message('📝 Configuration de termux.properties terminée.');

    const bashrcPath = path.join(process.env.HOME, '.bashrc');
    const commandeServiceTermux = `
am startservice --user 0 \\
  -n com.termux/com.termux.app.RunCommandService \\
  -a com.termux.RUN_COMMAND \\
  --es com.termux.RUN_COMMAND_PATH '/data/data/com.termux/files/usr/bin/npm' \\
  --esa com.termux.RUN_COMMAND_ARGUMENTS 'start' \\
  --es com.termux.RUN_COMMAND_SESSION_NAME 'Maserati-Bot' \\
  --es com.termux.RUN_COMMAND_WORKDIR '${path.join(process.cwd())}' \\
  --ez com.termux.RUN_COMMAND_BACKGROUND 'false' \\
  --es com.termux.RUN_COMMAND_SESSION_ACTION '0'
`.trim();

    let contenuBashrc = '';
    if (fsSync.existsSync(bashrcPath)) {
      contenuBashrc = await fs.readFile(bashrcPath, 'utf8');
    }

    if (!contenuBashrc.includes(commandeServiceTermux)) {
      await fs.appendFile(bashrcPath, `\n${commandeServiceTermux}\n`);
      message('📝 Commande am startservice ajoutée à ~/.bashrc');
    } else {
      info('📝 Commande am startservice déjà présente dans ~/.bashrc');
    }

    message('📱 Configuration du démarrage automatique Termux terminée ! 🏎️');
  } catch (erreur) {
    avertissement(`❌ Erreur lors de la configuration autostart Termux : ${erreur.message}`);
  }
}

function gererArretPropre() {
  const arreter = () => {
    message('🛑 Arrêt de Maserati-Bot... À bientôt sur la piste ! 👑');
    if (processusBot) {
      processusBot.removeAllListeners();
      processusBot.kill();
    }
    process.exit(0);
  };

  process.on('SIGINT', arreter);
  process.on('SIGTERM', arreter);

  if (isWindows) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.on('SIGINT', arreter);
  }
}

async function afficherEntete() {
  const entete = [
    `\( {colors.bold}🏎️ MASERATI-BOT - Connexion WhatsApp Prestige 👑✨ \){colors.reset}`,
    `${colors.bold}📦 Version : \( {version}  •  Créé par yankee Hells 🙂 \){colors.reset}`,
  ];

  separateur();
  for (const ligne of entete) {
    console.log(ligne);
    await new Promise((resolve) => setTimeout(resolve, 120));
  }
  separateur();
  console.log();
}

async function verifierPrérequis() {
  if (!fsSync.existsSync(CONFIG_PATH)) {
    avertissement('⚠️ Fichier de configuration (config.json) introuvable ! Lancement de la configuration...');
    try {
      await new Promise((resolve, reject) => {
        const processusConfig = spawn('npm', ['run', 'config'], { stdio: 'inherit', shell: isWindows });
        processusConfig.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`Échec config code ${code}`))));
        processusConfig.on('error', reject);
      });
      message('📝 Configuration terminée avec succès !');
    } catch (erreur) {
      avertissement(`❌ Échec de la configuration : ${erreur.message}`);
      message('📝 Essayez manuellement : npm run config');
      process.exit(1);
    }
  }

  if (!fsSync.existsSync(NODE_MODULES_PATH)) {
    avertissement('⚠️ Modules Node.js introuvables ! Installation automatique lancée...');
    try {
      await new Promise((resolve, reject) => {
        const processusInstall = spawn('npm', ['run', 'config:install'], { stdio: 'inherit', shell: isWindows });
        processusInstall.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`Échec install code ${code}`))));
        processusInstall.on('error', reject);
      });
      message('📦 Installation des modules terminée !');
    } catch (erreur) {
      avertissement(`❌ Échec installation modules : ${erreur.message}`);
      message('📦 Essayez manuellement : npm run config:install');
      process.exit(1);
    }
  }

  if (!fsSync.existsSync(CONNECT_FILE)) {
    avertissement(`⚠️ Fichier de connexion (${CONNECT_FILE}) introuvable !`);
    avertissement('🔍 Vérifiez l\'installation du projet.');
    process.exit(1);
  }
}

function demarrerBot(modeCode = false) {
  const args = ['--expose-gc', CONNECT_FILE];
  if (modeCode) args.push('--code');

  info(`🚀 Démarrage ${modeCode ? 'via Code de Pairing' : 'via QR Code'}... Vroum vroum !`);

  processusBot = spawn('node', args, {
    stdio: 'inherit',
    env: { ...process.env, FORCE_COLOR: '1' },
  });

  processusBot.on('error', (erreur) => {
    avertissement(`❌ Erreur démarrage bot : ${erreur.message}`);
    redemarrerBot(modeCode);
  });

  processusBot.on('close', (code) => {
    if (code === 0) {
      info(`✅ Bot arrêté normalement (code ${code}). Redémarrage...`);
    } else {
      avertissement(`⚠️ Bot arrêté avec erreur (code ${code}). Redémarrage...`);
    }
    redemarrerBot(modeCode);
  });

  return processusBot;
}

function redemarrerBot(modeCode) {
  avertissement('🔄 Redémarrage du bot dans 500 ms...');
  setTimeout(() => {
    if (processusBot) processusBot.removeAllListeners();
    demarrerBot(modeCode);
  }, 500);
}

async function verifierSessionExistante() {
  try {
    if (!fsSync.existsSync(QR_CODE_DIR)) {
      await fs.mkdir(QR_CODE_DIR, { recursive: true });
      return false;
    }
    const fichiers = await fs.readdir(QR_CODE_DIR);
    return fichiers.length > 2;
  } catch (erreur) {
    avertissement(`❌ Erreur vérification dossier QR : ${erreur.message}`);
    return false;
  }
}

async function demanderMethodeConnexion() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(`\( {colors.yellow}🔧 Choisissez votre méthode de connexion : \){colors.reset}`);
  console.log(`\( {colors.yellow}1. 📷 Connexion via QR Code \){colors.reset}`);
  console.log(`\( {colors.yellow}2. 🔑 Connexion via Code de Pairing \){colors.reset}`);
  console.log(`\( {colors.yellow}3. 🚪 Quitter \){colors.reset}`);

  const reponse = await rl.question('➡️ Entrez le numéro de votre choix : ');
  console.log();
  rl.close();

  switch (reponse.trim()) {
    case '1':
      message('📷 Lancement connexion QR Code...');
      return { methode: 'qr' };
    case '2':
      message('🔑 Lancement connexion via Code de Pairing...');
      return { methode: 'code' };
    case '3':
      message('👋 À bientôt sur la route ! 🏎️💨');
      process.exit(0);
    default:
      avertissement('⚠️ Choix invalide ! Connexion QR Code par défaut.');
      return { methode: 'qr' };
  }
}

async function main() {
  try {
    gererArretPropre();
    await afficherEntete();
    await verifierPrérequis();
    await configurerDemarrageAutoTermux();

    const sessionExistante = await verifierSessionExistante();
    if (sessionExistante) {
      message('📷 Session existante détectée. Connexion automatique en cours...');
      demarrerBot(false);
    } else {
      const { methode } = await demanderMethodeConnexion();
      demarrerBot(methode === 'code');
    }
  } catch (erreur) {
    avertissement(`❌ Erreur inattendue : ${erreur.message}`);
    process.exit(1);
  }
}

(async () => {
  await main();
})();
