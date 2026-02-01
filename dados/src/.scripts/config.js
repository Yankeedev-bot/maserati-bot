#!/usr/bin/env node

import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { exec, spawn } from 'child_process';
import readline from 'readline';
import os from 'os';
import { promisify } from 'util';

const execAsync = promisify(exec);

const CONFIG_FILE = path.join(process.cwd(), 'donnees', 'src', 'config.json');
let version = 'Inconnue';
try {
    const pkg = JSON.parse(fsSync.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    version = pkg.version;
} catch { }

const colors = {
  reset: '\x1b[0m', green: '\x1b[1;32m', red: '\x1b[1;31m',
  blue: '\x1b[1;34m', yellow: '\x1b[1;33m', cyan: '\x1b[1;36m',
  dim: '\x1b[2m', bold: '\x1b[1m', underline: '\x1b[4m',
};

const print = {
    message: (text) => console.log(`\( {colors.green} \){text}${colors.reset}`),
    warning: (text) => console.log(`\( {colors.red} \){text}${colors.reset}`),
    info: (text) => console.log(`\( {colors.cyan} \){text}${colors.reset}`),
    detail: (text) => console.log(`\( {colors.dim} \){text}${colors.reset}`),
    separator: () => console.log(`\( {colors.blue}═════════════════════════════════════════════════ \){colors.reset}`),
    header: () => {
        print.separator();
        console.log(`\( {colors.bold}🏎️  CONFIGURATEUR MASERATI-BOT  👑✨  v \){version}  🇨🇮${colors.reset}`);
        console.log(`\( {colors.bold}Créé par yankee Hells 🙂 \){colors.reset}`);
        print.separator(); console.log();
    }
};

const SystemInfo = {
    os: os.platform(),
    isWindows: os.platform() === 'win32',
    isTermux: false,
    packageManager: null,

    async detect() {
        this.isTermux = 'TERMUX_VERSION' in process.env;
        if (this.isTermux) {
            this.packageManager = 'pkg';
        } else if (this.os === 'linux') {
            if (await commandExists('apt')) this.packageManager = 'apt';
            else if (await commandExists('dnf')) this.packageManager = 'dnf';
            else if (await commandExists('pacman')) this.packageManager = 'pacman';
        } else if (this.os === 'darwin') {
            if (await commandExists('brew')) this.packageManager = 'brew';
        } else if (this.isWindows) {
            if (await commandExists('winget')) this.packageManager = 'winget';
            else if (await commandExists('choco')) this.packageManager = 'choco';
        }
    }
};

const DEPENDANCES_CONFIG = [
    { nom: 'Git', check: 'git --version', termux: 'pkg install git -y', win: 'winget install --id Git.Git -e', linux: 'apt install -y git || dnf install -y git || pacman -S --noconfirm git', mac: 'brew install git' },
    { nom: 'Yarn', check: 'yarn --version', termux: 'npm i -g yarn', win: 'npm i -g yarn', linux: 'sudo npm i -g yarn', mac: 'npm i -g yarn' },
    { nom: 'FFmpeg', check: 'ffmpeg -version', termux: 'pkg install ffmpeg -y', win: 'winget install --id Gyan.FFmpeg -e || choco install ffmpeg', linux: 'apt install -y ffmpeg || dnf install -y ffmpeg || pacman -S --noconfirm ffmpeg', mac: 'brew install ffmpeg' }
];

async function executerCommandeAvecSpinner(commande, message) {
    const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    const interval = setInterval(() => {
        process.stdout.write(`\r\( {colors.yellow} \){spinner[i]}${colors.reset} ${message}`);
        i = (i + 1) % spinner.length;
    }, 100);
    try {
        await execAsync(commande, { shell: SystemInfo.isWindows });
    } finally {
        clearInterval(interval);
        process.stdout.write('\r' + ' '.repeat(message.length + 5) + '\r');
    }
}

async function executerCommandeHeritee(cmd, args = []) {
    return new Promise((resolve, reject) => {
        const proc = spawn(cmd, args, { stdio: 'inherit' });
        proc.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`${cmd} s'est terminé avec le code ${code}`));
        });
    });
}

async function demanderSaisie(rl, question, valeurDefaut, validateur = () => true) {
    let valeur; let valide = false;
    while (!valide) {
        const promptAffiche = `${question} ${colors.dim}(actuel : \( {valeurDefaut}) \){colors.reset} :`;
        console.log(promptAffiche);
        valeur = await new Promise(resolve => rl.question("→ ", resolve));
        valeur = valeur.trim() || valeurDefaut;
        valide = validateur(valeur);
        if (!valide) print.warning('   ➜ Saisie invalide. Réessayez svp.');
    }
    return valeur;
}

async function confirmer(rl, question, valeurDefaut = 'n') {
    const texteDefaut = valeurDefaut.toLowerCase() === 'o' ? 'O/n' : 'o/N';
    console.log(`\( {question} ( \){texteDefaut}) : `);
    const reponse = await new Promise(resolve => rl.question("→ ", resolve));
    const normalise = (reponse.trim() || valeurDefaut).toLowerCase();
    return ['o', 'oui', 'y', 'yes'].includes(normalise);
}

async function commandeExiste(commande) {
    const cmdVerif = SystemInfo.isWindows ? `where ${commande}` : `command -v ${commande}`;
    try { await execAsync(cmdVerif); return true; } catch { return false; }
}

async function installerDependancesSysteme() {
    print.separator();
    print.message('🔧 Vérification et installation des dépendances système...');
    const rapport = [];

    if (SystemInfo.isTermux) {
        print.info('ℹ️  Mise à jour des paquets Termux...');
        try {
            await executerCommandeHeritee('pkg', ['update', '-y']);
            await executerCommandeHeritee('pkg', ['upgrade', '-y']);
        } catch (e) {
            print.warning('⚠️  Échec mise à jour Termux. Poursuivez prudemment.');
        }
    }
    
    for (const dep of DEPENDANCES_CONFIG) {
        let statut = `\( {colors.green}✅ Déjà installé \){colors.reset}`;
        try {
            await execAsync(dep.check);
        } catch {
            statut = `\( {colors.yellow}⚠️  Non trouvé \){colors.reset}`;
            const cleOs = SystemInfo.isTermux ? 'termux' : (SystemInfo.os === 'darwin' ? 'mac' : SystemInfo.os);
            let commandeInstall = dep[cleOs];
            
            if (commandeInstall) {
                try {
                    if (SystemInfo.isTermux && (dep.nom === 'Git' || dep.nom === 'FFmpeg')) {
                        const [cmd, ...args] = commandeInstall.split(' ');
                        await executerCommandeHeritee(cmd, args);
                    } else {
                        await executerCommandeAvecSpinner(commandeInstall, `Installation de ${dep.nom}...`);
                    }
                    statut = `\( {colors.green}✅ Installé avec succès \){colors.reset}`;
                } catch (erreur) {
                    statut = `\( {colors.red}❌ Échec installation \){colors.reset}`;
                }
            } else {
                statut = `\( {colors.dim}⚪  Installation manuelle requise \){colors.reset}`;
            }
        }
        rapport.push({ nom: dep.nom, statut });
    }
    
    try {
        const dossiersOpti = ['temp', 'logs', 'cache', 'donnees/sauvegarde'];
        for (const dossier of dossiersOpti) {
            await fs.mkdir(dossier, { recursive: true });
        }
        print.message('📁 Dossiers d\'optimisation créés');
        rapport.push({ nom: 'Dossiers optimisation', statut: `\( {colors.green}✅ Créés \){colors.reset}` });
    } catch (erreur) {
        print.warning('⚠️  Erreur création dossiers optimisation');
        rapport.push({ nom: 'Dossiers optimisation', statut: `\( {colors.red}❌ Échec \){colors.reset}` });
    }
    
    return rapport;
}

async function installerDependancesNode() {
    print.separator();
    print.message('📦 Installation des dépendances du projet (Node.js)...');
    
    try {
        const cheminsNettoyage = [
            './temp',
            './logs/*.log', 
            '/tmp/maserati-*',
            '/tmp/baileys_media_cache'
        ];
        
        for (const chemin of cheminsNettoyage) {
            try {
                if (chemin.includes('*')) {
                    await execAsync(`rm -rf ${chemin} 2>/dev/null || true`);
                } else {
                    try {
                        await fs.access(chemin);
                        const stats = await fs.stat(chemin);
                        if (stats.isDirectory()) {
                            await fs.rm(chemin, { recursive: true, force: true });
                        }
                    } catch {}
                }
            } catch {}
        }
        print.message('🧹 Nettoyage automatique effectué');
    } catch (erreur) {
        print.warning('⚠️  Erreur lors du nettoyage automatique (on continue...)');
    }
    
    try {
        await executerCommandeAvecSpinner('npm install --no-optional --force --no-bin-links', 'Exécution de npm install...');
        print.message('✅ Dépendances installées avec succès via NPM.');
        return { nom: 'Dépendances Node (npm)', statut: `\( {colors.green}✅ Installé avec succès \){colors.reset}` };
    } catch (erreurNpm) {
        print.warning(`❌ Échec NPM : ${erreurNpm.message}`);
        print.info('ℹ️  Tentative via Yarn...');
        try {
            await executerCommandeAvecSpinner('yarn install', 'Exécution de yarn install...');
            print.message('✅ Dépendances installées avec succès via YARN.');
            return { nom: 'Dépendances Node (yarn)', statut: `\( {colors.green}✅ Installé avec succès \){colors.reset}` };
        } catch (erreurYarn) {
            print.warning(`❌ Échec YARN : ${erreurYarn.message}`);
            return { nom: 'Dépendances Node', statut: `\( {colors.red}❌ Échec installation \){colors.reset}` };
        }
    }
}

async function main() {
    process.on('SIGINT', () => { print.warning('\n🛑 Configuration annulée.'); process.exit(0); });

    await SystemInfo.detect();

    if (process.argv.includes('--install')) {
        const rapportNode = await installerDependancesNode();
        const rapportSysteme = await installerDependancesSysteme();
        print.separator();
        print.info("📋 Rapport final d'installation :");
        [...rapportSysteme, rapportNode].forEach(r => console.log(`→ ${r.nom} : ${r.statut}`));
        print.separator();
        process.exit(0);
    }

    print.header();
    
    let config = { nomProprietaire: '', numeroProprietaire: '', nomBot: 'Maserati-Bot', prefixe: '!' };
    try {
        const configExistante = JSON.parse(await fs.readFile(CONFIG_FILE, 'utf8'));
        config = { ...config, ...configExistante };
        print.info('📂 Configuration existante chargée.');
    } catch {  }

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    
    print.info(`\( {colors.bold} \){colors.underline}🔧 CONFIGURATIONS DE BASE${colors.reset}`);
    config.nomProprietaire   = await demanderSaisie(rl, '👑 Nom du propriétaire', config.nomProprietaire);
    config.numeroProprietaire = await demanderSaisie(rl, '📱 Numéro du proprio (chiffres uniquement)', config.numeroProprietaire, (v) => /^\d{10,15}$/.test(v));
    config.nomBot             = await demanderSaisie(rl, '🏎️ Nom du bot', config.nomBot);
    config.prefixe            = await demanderSaisie(rl, '🔣 Préfixe (1 seul caractère)', config.prefixe, (v) => v.length === 1);

    await fs.mkdir(path.dirname(CONFIG_FILE), { recursive: true });
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));

    print.separator();
    print.message('✅ Configuration enregistrée avec succès !');
    
    if (await confirmer(rl, '⚙️ Voulez-vous vérifier et installer toutes les dépendances maintenant ?', 'o')) {
        rl.close();
        const rapportNode = await installerDependancesNode();
        const rapportSysteme = await installerDependancesSysteme();
        print.separator();
        print.info("📋 Rapport final d'installation :");
        [...rapportSysteme, rapportNode].forEach(r => console.log(`→ ${r.nom} : ${r.statut}`));
        print.separator();
    } else {
        rl.close();
        print.info('📝 Pensez à lancer l\'installation plus tard avec : npm run config:install');
    }

    print.message(`🎉 Maserati-Bot configuré et prêt à prendre la route ! v${version} 🏎️💨`);
}

main().catch((erreur) => {
    print.warning(`❌ Erreur critique : ${erreur.message}`);
    process.exit(1);
});
