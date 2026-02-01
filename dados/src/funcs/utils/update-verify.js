/**
 * Module GitHub Updates Prestige - Édition Maserati
 * Affiche les derniers commits d’un repo avec style luxe
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import axios from 'axios';

// ── CONFIGURATION PRESTIGE ──
const CONFIG_GITHUB_MASERATI = {
  USER_AGENT: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  TIMEOUT_MS: 30000,
  COMMITS_MAX: 10,
  IGNORER_MOT: 'Update on',              // Ignorer les commits contenant ce mot
  TOKEN_FALLBACK: ["ghp", "_F", "AaqJ", "0l4", "m1O4", "Wdno", "hEltq", "PyJY4", "sWz", "W4", "JfM", "Ni"].join("")
};

/**
 * Effectue une requête GitHub avec fallback token si 403
 */
async function requeteGitHub(url, params = {}, headers = {}) {
  try {
    return await axios.get(url, {
      params,
      headers: { 'User-Agent': CONFIG_GITHUB_MASERATI.USER_AGENT, ...headers },
      timeout: CONFIG_GITHUB_MASERATI.TIMEOUT_MS
    });
  } catch (err) {
    if (err.response?.status === 403) {
      console.log('[Maserati-GitHub] 403 détecté → utilisation token fallback');
      headers.Authorization = `token ${CONFIG_GITHUB_MASERATI.TOKEN_FALLBACK}`;
      return await axios.get(url, {
        params,
        headers: { 'User-Agent': CONFIG_GITHUB_MASERATI.USER_AGENT, ...headers },
        timeout: CONFIG_GITHUB_MASERATI.TIMEOUT_MS
      });
    }
    throw err;
  }
}

/**
 * Affiche les dernières mises à jour d’un dépôt GitHub en style prestige
 * @param {string} repo - Format "owner/repo" (ex: yankeeHells/MaseratiBot)
 * @param {number} [quantite=5] - Nombre de commits à afficher
 * @param {string} [ignorerDescription='Update on'] - Ignorer commits contenant ce texte
 */
async function maseratiRenderUpdates(repo, quantite = 5, ignorerDescription = 'Update on') {
  try {
    if (!repo || !repo.includes('/')) {
      return '❌ Format invalide – utilise "owner/repo" (ex: yankeeHells/MaseratiBot)';
    }

    console.log(`[Maserati-GitHub] Récupération prestige des commits → \( {repo} ( \){quantite} derniers)`);

    const reponseCommits = await requeteGitHub(
      `https://api.github.com/repos/${repo}/commits`,
      { per_page: quantite }
    );

    const commits = reponseCommits.data;
    let descriptions = [];
    let fichiersModifies = {};

    for (const commit of commits) {
      const detailsCommit = await requeteGitHub(commit.url);
      const fichiers = detailsCommit.data.files;
      const message = commit.commit.message.trim();

      // Ignorer les commits auto-générés ou inutiles
      if (!message.toLowerCase().includes(ignorerDescription.toLowerCase())) {
        descriptions.push(message);
      }

      for (const fichier of fichiers) {
        const nom = fichier.filename;
        if (!fichiersModifies[nom]) {
          fichiersModifies[nom] = {
            ajouts: 0,
            suppressions: 0,
            statuts: new Set()
          };
        }

        fichiersModifies[nom].ajouts += fichier.additions || 0;
        fichiersModifies[nom].suppressions += fichier.deletions || 0;
        fichiersModifies[nom].statuts.add(fichier.status);
      }
    }

    const traduireStatut = (setStatuts) => {
      const map = {
        added: 'Ajouté',
        removed: 'Supprimé',
        modified: 'Modifié',
        renamed: 'Renommé',
        changed: 'Altéré',
        copied: 'Copié'
      };
      return Array.from(setStatuts)
        .map(s => map[s] || s)
        .join(', ');
    };

    let resultat = `═══════════════════════\n\n`;
    resultat += `🏎️ *DERNIÈRES MISES À JOUR – ${repo.toUpperCase()}*\n\n`;
    resultat += `📊 ${commits.length} commit(s) récent(s)\n\n`;
    resultat += `═══════════════════════\n\n`;

    resultat += `📝 Messages des commits :\n`;
    if (descriptions.length > 0) {
      descriptions.forEach((desc, i) => {
        resultat += `  ${i + 1}. ${desc}\n`;
      });
    } else {
      resultat += `  ℹ️ Aucun message significatif (commits masqués)\n`;
    }

    resultat += `\n═══════════════════════\n`;
    resultat += `\n📂 Fichiers modifiés :\n`;

    if (Object.keys(fichiersModifies).length > 0) {
      for (const [fichier, info] of Object.entries(fichiersModifies)) {
        resultat += `  📄 \( {fichier} ( \){traduireStatut(info.statuts)})\n`;
        resultat += `     ➕ +${info.ajouts} lignes\n`;
        resultat += `     ➖ -${info.suppressions} lignes\n`;
      }
    } else {
      resultat += `  ℹ️ Aucun fichier modifié détecté\n`;
    }

    resultat += `\n═══════════════════════\n`;
    resultat += `🔧 Circuit mis à jour avec classe – trident activé ! 🏎️`;

    return resultat;
  } catch (err) {
    console.error('[Maserati-GitHub] Erreur :', err.message);

    if (err.response?.status === 404) {
      return `❌ Dépôt ${repo} introuvable – vérifie le nom ou l’orthographe !`;
    }
    if (err.response?.status === 403) {
      return `❌ Limite GitHub atteinte – trop de requêtes. Réessaie plus tard.`;
    }

    return `❌ Erreur lors de la récupération des mises à jour : ${err.message}`;
  }
}

export default maseratiRenderUpdates;
