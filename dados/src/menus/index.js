/**
 * Garage des Menus Prestige - Édition Maserati
 * Loader asynchrone et sécurisé de tous les menus du bot
 * Chargement dynamique, logs luxe et fallback élégant
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── CONFIGURATION PRESTIGE ──
const CONFIG_MENUS_MASERATI = {
  PREFIXE_LOGS: '[Maserati-Menus]',
  MENUS: {
    menu: './menu.js',
    menuAlterador: './alteradores.js',
    menudown: './menudown.js',
    menuadm: './menuadm.js',
    menubn: './menubn.js',
    menuDono: './menudono.js',
    menuMembros: './menumemb.js',
    menuFerramentas: './ferramentas.js',
    menuSticker: './menufig.js',
    menuIa: './menuia.js',
    menuTopCmd: './topcmd.js',
    menuRPG: './menurpg.js',
    menuVIP: './menuvip.js'
  }
};

/**
 * Charge tous les menus de façon asynchrone avec logs prestige
 * Retourne un objet proxy sécurisé pour éviter les erreurs fatales
 */
let promesseMenus;

async function maseratiChargerMenus() {
  if (promesseMenus) return promesseMenus;

  promesseMenus = (async () => {
    console.log(`${CONFIG_MENUS_MASERATI.PREFIXE_LOGS} Démarrage chargement garage menus prestige...`);

    const menus = {};

    for (const [nom, cheminRelatif] of Object.entries(CONFIG_MENUS_MASERATI.MENUS)) {
      try {
        const moduleImporte = await import(new URL(cheminRelatif, import.meta.url));
        const fonctionMenu = moduleImporte.default || moduleImporte[nom];

        if (typeof fonctionMenu === 'function') {
          menus[nom] = fonctionMenu;
          console.log(`\( {CONFIG_MENUS_MASERATI.PREFIXE_LOGS} Menu ' \){nom}' chargé avec succès depuis ${cheminRelatif}`);
        } else {
          console.warn(
            `\( {CONFIG_MENUS_MASERATI.PREFIXE_LOGS} Menu ' \){nom}' (${cheminRelatif}) n’exporte pas une fonction valide (attendu export default function)`
          );
        }
      } catch (err) {
        console.error(
          `\( {CONFIG_MENUS_MASERATI.PREFIXE_LOGS} Échec chargement menu ' \){nom}' (${cheminRelatif}) : ${err.message}`
        );
      }
    }

    const menusEchoues = Object.keys(CONFIG_MENUS_MASERATI.MENUS).filter(nom => !menus[nom]);
    if (menusEchoues.length > 0) {
      console.warn(
        `${CONFIG_MENUS_MASERATI.PREFIXE_LOGS} Les menus suivants n’ont pas été chargés correctement : ${menusEchoues.join(', ')}`
      );
      console.warn(
        `${CONFIG_MENUS_MASERATI.PREFIXE_LOGS} Vérifie que chaque fichier exporte bien "export default function(...)"`
      );
    }

    console.log(`${CONFIG_MENUS_MASERATI.PREFIXE_LOGS} Garage menus chargé – ${Object.keys(menus).length} menus prêts pour la piste`);

    return menus;
  })();

  return promesseMenus;
}

/**
 * Proxy Garage Maserati – Sécurité et logs luxe
 * Retourne undefined + warning si menu ou propriété manquante
 */
function ProxyGarageMenus(menus) {
  return new Proxy(menus, {
    get(cible, prop) {
      if (!(prop in cible)) {
        console.warn(`\( {CONFIG_MENUS_MASERATI.PREFIXE_LOGS} Menu ' \){prop}' introuvable dans le garage prestige`);
        return undefined;
      }

      const valeur = cible[prop];

      if (typeof valeur === 'object' && valeur !== null) {
        return new Proxy(valeur, {
          get(obj, key) {
            if (!(key in obj)) {
              console.warn(`\( {CONFIG_MENUS_MASERATI.PREFIXE_LOGS} Propriété ' \){key}' introuvable dans menu '${prop}'`);
              return undefined;
            }
            return obj[key];
          }
        });
      }

      return valeur;
    }
  });
}

/**
 * Accesseur asynchrone nommé – pour code explicite et moderne
 */
export async function maseratiObtenirMenus() {
  const menus = await maseratiChargerMenus();
  return ProxyGarageMenus(menus);
}

/**
 * Export par défaut – résout directement via top-level await
 * Compatible avec : const menus = (await import('./menus.js')).default;
 */
const menus = await maseratiChargerMenus();
export default ProxyGarageMenus(menus);
