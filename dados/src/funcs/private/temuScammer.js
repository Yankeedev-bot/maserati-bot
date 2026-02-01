/**
 * Module Extraction & Conversion Liens Temu - Édition Prestige Maserati
 * Extrait l'ID produit et génère un lien affilié optimisé
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

import { fileURLToPath } from 'url';
import path from 'path';

// Pour logs si besoin (optionnel)
const __filename = fileURLToPath(import.meta.url);

/**
 * Extrait l'ID du produit depuis un lien Temu classique
 * Format attendu : ...-g-XXXXXXXX.html
 * @param {string} lien - URL Temu brute
 * @returns {string|null} ID du produit ou null si invalide
 */
const maseratiExtraireIdProduit = (lien) => {
  if (typeof lien !== 'string' || !lien.trim()) {
    console.warn('[Maserati-Temu] Lien invalide ou vide');
    return null;
  }

  try {
    // Regex robuste : cherche -g- suivi de chiffres avant .html
    const match = lien.match(/-g-(\d+)\.html/);
    return match ? match[1] : null;
  } catch (err) {
    console.error('[Maserati-Temu] Erreur extraction ID :', err.message);
    return null;
  }
};

/**
 * Convertit un lien Temu classique en lien affilié optimisé prestige
 * Utilise un template affilié avec tracking (remplace {ID})
 * @param {string} lien - Lien Temu source
 * @returns {string|null} Lien affilié complet ou null si échec
 */
const maseratiConvertirLienTemu = (lien) => {
  const idProduit = maseratiExtraireIdProduit(lien);

  if (!idProduit) {
    console.warn('[Maserati-Temu] Impossible d’extraire l’ID produit');
    return null;
  }

  // Template affilié prestige (à jour 2025, peut être modifié)
  const templateAffilie = "https://www.temu.com/br/bmw.html?subj=downloadable-ads-shopping&tmpl=dn9&_x_ads_sub_channel=shopping&_p_rfs=1&_x_ns_prz_type=-1&_x_ns_sku_id={ID}&goods_id={ID}&sku_id={ID}&_x_gmc_account=5362938519&_x_login_type=Google&_p_jump_id=962&adg_ctx=a-a7937f52~c-df9607e9&locale_override=29~pt~BRL&_x_ns_gid={ID}&mrk_rec=1&_x_ads_channel=google&_bg_fs=1&_x_vst_scene=adg";

  // Remplace tous les {ID} par l’ID extrait
  const lienFinal = templateAffilie.replaceAll('{ID}', idProduit);

  console.log(`[Maserati-Temu] Lien affilié généré avec succès → ID: ${idProduit}`);

  return lienFinal;
};

// Exports prestige
export {
  maseratiExtraireIdProduit,
  maseratiConvertirLienTemu
};

export default {
  extraireId: maseratiExtraireIdProduit,
  convertirLien: maseratiConvertirLienTemu
};
