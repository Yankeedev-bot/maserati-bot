/**
 * Recherche de Paroles de Chansons - Édition Prestige
 * Thème Maserati 🏎️👑✨🇨🇮
 * Optimisé avec pooling de connexions HTTP
 * Créé par yankee Hells 🙂
 */

import { scrapingClient } from '../../utils/httpClient.js';
import { parseHTML } from 'linkedom';

async function maseratiGetLyrics(recherche) {
  try {
    if (!recherche || typeof recherche !== 'string' || recherche.trim() === '') {
      throw new Error('Recherche invalide – envoie un titre ou artiste boss !');
    }

    // Étape 1 : Recherche sur l'index Letras (JSONP)
    const urlRecherche = `https://solr.sscdn.co/letras/m1/?q=${encodeURIComponent(recherche)}&wt=json&callback=LetrasSug`;
    const reponseRecherche = await scrapingClient.get(urlRecherche);

    if (reponseRecherche.status !== 200) {
      throw new Error('Impossible de contacter le moteur de recherche Letras');
    }

    // Nettoyage du JSONP → JSON pur
    let jsonBrut = reponseRecherche.data;
    jsonBrut = jsonBrut.replace('LetrasSug(', '').replace(')\n', '').trim();
    const donnees = JSON.parse(jsonBrut);

    if (!donnees?.response?.docs?.length) {
      throw new Error('Aucune chanson trouvée pour cette recherche');
    }

    // On prend le meilleur résultat (premier = le plus pertinent)
    const chanson = donnees.response.docs[0];

    if (!chanson?.dns || !chanson?.url) {
      throw new Error('Informations incomplètes sur la chanson');
    }

    // Étape 2 : Récupération de la page complète des paroles
    const urlParoles = `https://www.letras.mus.br/\( {chanson.dns}/ \){chanson.url}`;
    const reponseParoles = await scrapingClient.get(urlParoles);

    if (reponseParoles.status !== 200) {
      throw new Error('La page des paroles n\'est pas accessible');
    }

    // Parsing HTML avec linkedom
    const { document } = parseHTML(reponseParoles.data);

    // Extraction des métadonnées
    const titre = document.querySelector('h1')?.textContent?.trim() || 'Titre inconnu';
    const artiste = document.querySelector('h2.textStyle-secondary')?.textContent?.trim() || 'Artiste inconnu';

    // Extraction des paroles (strophes préservées)
    const elementsParoles = document.querySelectorAll('.lyric-original > p');

    if (!elementsParoles.length) {
      throw new Error('Aucune parole trouvée sur la page');
    }

    const parolesFormatees = Array.from(elementsParoles).map(paragraphe => {
      const spansVers = paragraphe.querySelectorAll('span.verse');

      if (spansVers.length) {
        // Cas des romanisations ou traductions alternatives
        return Array.from(spansVers)
          .map(span => span.querySelector('span.romanization')?.textContent || '')
          .filter(ligne => ligne.trim())
          .join('\n');
      }

      // Cas standard : lignes séparées par <br>
      return paragraphe.innerHTML
        .split('<br>')
        .map(ligne => ligne.trim())
        .filter(ligne => ligne)
        .join('\n');
    }).filter(strophe => strophe.trim()); // Élimine les strophes vides

    if (parolesFormatees.length === 0) {
      throw new Error('Paroles vides ou mal formatées');
    }

    // Formatage final – style Maserati luxe & classe
    const sortie = `
🏎️👑 *${titre.replace(/\n/g, '').replace(/\s{2,}/g, ' ')}* ✨
Artiste : ${artiste.replace(/\n/g, '').replace(/\s{2,}/g, ' ')}

Lien original : ${urlParoles}

📜 *Paroles complètes* :
${parolesFormatees.join('\n\n')}

Maserati-Bot • yankee Hells 🙂  🏎️💨🇨🇮
    `.trim();

    return sortie;

  } catch (erreur) {
    console.error('[Maserati-Lyrics] Erreur :', erreur.message);
    throw new Error(`Erreur Maserati : ${erreur.message}`);
  }
}

export default maseratiGetLyrics;
