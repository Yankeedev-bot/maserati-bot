/**
 * Recalcule les bonus d’attaque/défense/vie du pilote en fonction des équipements
 * Utilise les données de la boutique prestige (econ.shop) pour sommer les bonus par slot équipé
 * Thème Maserati 🏎️👑✨🇨🇮 – Garage & tuning V8
 * Créé par yankee Hells 🙂
 */
export function recalculerBonusEquipements(pilote, boutique = {}) {
  // Vérification pilote valide
  if (!pilote || typeof pilote !== 'object') return;

  // Initialise les slots si absents – garage vide
  if (!pilote.equipements) {
    pilote.equipements = {
      arme: null,
      armure: null,
      casque: null,
      bottes: null,
      bouclier: null,
      accessoire: null
    };
  }

  let attaque = 0;
  let defense = 0;
  let vieMaxBonus = 0;

  // Parcours des slots prestige
  const slots = ['arme', 'armure', 'casque', 'bottes', 'bouclier', 'accessoire'];
  
  for (const slot of slots) {
    const idItem = pilote.equipements[slot];
    if (!idItem) continue; // Slot vide – pas de tuning

    const item = boutique[idItem];
    if (!item) continue; // Item introuvable dans la boutique MC20

    // Cumul des bonus – puissance trident
    attaque += item.bonusAttaque || 0;
    defense += item.bonusDefense || 0;
    vieMaxBonus += item.bonusVie || 0;
  }

  // Application finale – tuning validé
  pilote.bonusAttaque = attaque;
  pilote.bonusDefense = defense;
  
  // Vie max : base 100 + bonus équipement (ne descend jamais en dessous)
  pilote.vieMax = Math.max(pilote.vieMax || 100, 100 + vieMaxBonus);

  // Optionnel : log garage (pour debug prestige)
  // console.log(`[Maserati-Garage] Tuning ${pilote.id || 'inconnu'} → Att: ${attaque} | Def: ${defense} | Vie+: ${vieMaxBonus}`);
}