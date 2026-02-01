/**
 * Calculatrice Scientifique Prestige - Édition Maserati
 * Parser sécurisé d’expressions mathématiques + conversions rapides
 * Thème Maserati 🏎️👑✨🇨🇮
 * Créé par yankee Hells 🙂
 */

const CONFIG_CALCUL_MASERATI = {
  LONGUEUR_MAX_EXPRESSION: 200,         // Limite prestige – pas de formule trop longue
  DECIMES_MAX_RESULTAT: 10,             // Précision luxe
  NOMBRE_MAX: 1e15,                     // Plafond V8
  NOMBRE_MIN: -1e15
};

// Constantes prestige (prêtes à l’accélération)
const CONSTANTES_PRESTIGE = {
  'pi': Math.PI,
  'π': Math.PI,
  'e': Math.E,
  'phi': (1 + Math.sqrt(5)) / 2,     // Proportion dorée – élégance absolue
  'φ': (1 + Math.sqrt(5)) / 2
};

// Fonctions haute performance (V8 maths)
const FONCTIONS_PRESTIGE = {
  // Trigonométrie circuit
  'sin': Math.sin,   'cos': Math.cos,   'tan': Math.tan,
  'asin': Math.asin, 'acos': Math.acos, 'atan': Math.atan,
  'sinh': Math.sinh, 'cosh': Math.cosh, 'tanh': Math.tanh,

  // Logarithmes & exponentielle turbo
  'log': Math.log10,  'log10': Math.log10,
  'log2': Math.log2,  'ln': Math.log,
  'exp': Math.exp,

  // Racines & puissances MC20
  'sqrt': Math.sqrt,
  'cbrt': Math.cbrt,
  'pow': Math.pow,

  // Arrondis précision bleu nuit
  'abs': Math.abs,
  'ceil': Math.ceil,
  'floor': Math.floor,
  'round': Math.round,
  'trunc': Math.trunc,

  // Autres utilitaires
  'sign': Math.sign,
  'max': Math.max,
  'min': Math.min,
  'random': Math.random,

  // Conversions degrés/radians
  'rad': (deg) => deg * (Math.PI / 180),
  'deg': (rad) => rad * (180 / Math.PI),

  // Fatorial – puissance brute
  'fact': (n) => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n > 170) return Infinity;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  },

  // Pourcentage – calcul rapide
  'percent': (valeur, pourcent) => valeur * (pourcent / 100)
};

// Tokenisation haute précision
const tokeniserExpression = (expression) => {
  const tokens = [];
  let courant = '';
  let i = 0;

  while (i < expression.length) {
    const char = expression[i];

    // Nombres (décimaux + scientifique)
    if (/[0-9.]/.test(char)) {
      courant += char;
      i++;
      while (i < expression.length && /[0-9.eE+-]/.test(expression[i])) {
        if ((expression[i] === '+' || expression[i] === '-') &&
            !(expression[i-1] === 'e' || expression[i-1] === 'E')) break;
        courant += expression[i];
        i++;
      }
      tokens.push({ type: 'nombre', valeur: parseFloat(courant) });
      courant = '';
      continue;
    }

    // Fonctions & constantes prestige
    if (/[a-zA-Zπφ]/.test(char)) {
      courant += char;
      i++;
      while (i < expression.length && /[a-zA-Z0-9]/.test(expression[i])) {
        courant += expression[i];
        i++;
      }
      const minuscule = courant.toLowerCase();
      if (CONSTANTES_PRESTIGE[minuscule] !== undefined) {
        tokens.push({ type: 'nombre', valeur: CONSTANTES_PRESTIGE[minuscule] });
      } else if (FONCTIONS_PRESTIGE[minuscule]) {
        tokens.push({ type: 'fonction', valeur: minuscule });
      } else {
        throw new Error(`Fonction ou constante inconnue : ${courant}`);
      }
      courant = '';
      continue;
    }

    // Opérateurs circuit
    if (['+', '-', '*', '/', '^', '%'].includes(char)) {
      tokens.push({ type: 'operateur', valeur: char });
      i++;
      continue;
    }

    // Parenthèses – précision MC20
    if (char === '(') {
      tokens.push({ type: 'parenthese_ouv', valeur: '(' });
      i++;
      continue;
    }
    if (char === ')') {
      tokens.push({ type: 'parenthese_fer', valeur: ')' });
      i++;
      continue;
    }

    // Virgule – arguments multiples
    if (char === ',') {
      tokens.push({ type: 'virgule', valeur: ',' });
      i++;
      continue;
    }

    // Espaces ignorés
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    throw new Error(`Caractère interdit sur le circuit : ${char}`);
  }

  return tokens;
};

// Parser avec priorité prestige (opérateurs)
const analyserExpression = (tokens) => {
  let position = 0;

  const regarder = () => tokens[position];
  const consommer = () => tokens[position++];

  const expression = () => {
    let gauche = terme();
    while (regarder() && regarder().type === 'operateur' && ['+', '-'].includes(regarder().valeur)) {
      const op = consommer().valeur;
      const droite = terme();
      gauche = { type: 'binaire', operateur: op, gauche, droite };
    }
    return gauche;
  };

  const terme = () => {
    let gauche = puissance();
    while (regarder() && regarder().type === 'operateur' && ['*', '/', '%'].includes(regarder().valeur)) {
      const op = consommer().valeur;
      const droite = puissance();
      gauche = { type: 'binaire', operateur: op, gauche, droite };
    }
    return gauche;
  };

  const puissance = () => {
    let gauche = unaire();
    if (regarder() && regarder().type === 'operateur' && regarder().valeur === '^') {
      consommer();
      const droite = puissance(); // associativité droite
      gauche = { type: 'binaire', operateur: '^', gauche, droite };
    }
    return gauche;
  };

  const unaire = () => {
    if (regarder() && regarder().type === 'operateur' && ['+', '-'].includes(regarder().valeur)) {
      const op = consommer().valeur;
      const operande = unaire();
      return { type: 'unaire', operateur: op, operande };
    }
    return facteur();
  };

  const facteur = () => {
    const token = regarder();
    if (!token) throw new Error('Expression incomplète – circuit vide');

    if (token.type === 'nombre') {
      consommer();
      return { type: 'nombre', valeur: token.valeur };
    }

    if (token.type === 'fonction') {
      const nomFonction = consommer().valeur;
      if (!regarder() || regarder().type !== 'parenthese_ouv') {
        throw new Error(`Parenthèse ouvrante manquante après ${nomFonction}`);
      }
      consommer();

      const args = [];
      if (regarder() && regarder().type !== 'parenthese_fer') {
        args.push(expression());
        while (regarder() && regarder().type === 'virgule') {
          consommer();
          args.push(expression());
        }
      }

      if (!regarder() || regarder().type !== 'parenthese_fer') {
        throw new Error(`Parenthèse fermante manquante après ${nomFonction}`);
      }
      consommer();

      return { type: 'fonction', nom: nomFonction, args };
    }

    if (token.type === 'parenthese_ouv') {
      consommer();
      const expr = expression();
      if (!regarder() || regarder().type !== 'parenthese_fer') {
        throw new Error('Parenthèse fermante manquante');
      }
      consommer();
      return expr;
    }

    throw new Error(`Token inattendu sur la piste : ${token.valeur}`);
  };

  const resultat = expression();

  if (position < tokens.length) {
    throw new Error(`Token restant sur le circuit : ${tokens[position].valeur}`);
  }

  return resultat;
};

// Évaluation AST – puissance V8
const evaluer = (noeud) => {
  if (noeud.type === 'nombre') return noeud.valeur;

  if (noeud.type === 'unaire') {
    const operande = evaluer(noeud.operande);
    return noeud.operateur === '-' ? -operande : operande;
  }

  if (noeud.type === 'binaire') {
    const gauche = evaluer(noeud.gauche);
    const droite = evaluer(noeud.droite);

    switch (noeud.operateur) {
      case '+': return gauche + droite;
      case '-': return gauche - droite;
      case '*': return gauche * droite;
      case '/':
        if (droite === 0) throw new Error('Division par zéro – circuit bloqué');
        return gauche / droite;
      case '%': return gauche % droite;
      case '^': return Math.pow(gauche, droite);
    }
  }

  if (noeud.type === 'fonction') {
    const fonction = FONCTIONS_PRESTIGE[noeud.nom];
    const args = noeud.args.map(evaluer);
    return fonction(...args);
  }

  throw new Error('Nœud inconnu dans l’AST – panne moteur');
};

// Calcul principal prestige
const maseratiCalculer = (expression, prefixe = '/') => {
  if (!expression || expression.trim() === '') {
    return {
      succes: false,
      message: `🧮 *CALCULATRICE MASERATI*\n\n` +
               `❌ Exprime-toi, boss !\n\n` +
               `💡 Utilisation : ${prefixe}calcul <expression>\n` +
               `📌 Exemples :\n` +
               `   ${prefixe}calcul 2 + 2 * 5\n` +
               `   ${prefixe}calcul sin(π/2) + sqrt(16)\n` +
               `   ${prefixe}calcul fact(5)\n\n` +
               `📐 *Fonctions disponibles :*\n` +
               `   trig : sin, cos, tan, asin, acos, atan\n` +
               `   log  : log, ln, log2, exp\n` +
               `   racine : sqrt, cbrt, pow\n` +
               `   arrondi : abs, ceil, floor, round\n` +
               `   autres : fact, rad, deg, percent\n\n` +
               `📊 *Constantes prestige :*\n` +
               `   π (pi), e, φ (phi)`
    };
  }

  // Nettoyage expression – préparation circuit
  let expr = expression.trim()
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/,/g, '.')
    .replace(/\^/g, '^')
    .replace(/\*\*/g, '^');

  if (expr.length > CONFIG_CALCUL_MASERATI.LONGUEUR_MAX_EXPRESSION) {
    return {
      succes: false,
      message: `❌ Expression trop longue ! Maximum : ${CONFIG_CALCUL_MASERATI.LONGUEUR_MAX_EXPRESSION} caractères`
    };
  }

  try {
    const tokens = tokeniserExpression(expr);
    const ast = analyserExpression(tokens);
    let resultat = evaluer(ast);

    if (!isFinite(resultat)) {
      if (isNaN(resultat)) {
        return { succes: false, message: '❌ Résultat indéfini (NaN) – recalcule ton trajet !' };
      }
      return {
        succes: true,
        resultat: resultat > 0 ? '∞' : '-∞',
        expression: expr,
        message: `🧮 *CALCULATRICE MASERATI*\n\n` +
                 `📝 ${expr}\n\n` +
                 `📊 Résultat : ${resultat > 0 ? '∞' : '-∞'} (limite dépassée)`
      };
    }

    if (Math.abs(resultat) > CONFIG_CALCUL_MASERATI.NOMBRE_MAX) {
      return { succes: false, message: '❌ Résultat trop massif – dépasse les capacités du V8 !' };
    }

    let resultatFormate;
    if (Number.isInteger(resultat)) {
      resultatFormate = resultat.toString();
    } else {
      resultatFormate = parseFloat(resultat.toFixed(CONFIG_CALCUL_MASERATI.DECIMES_MAX_RESULTAT)).toString();
    }

    return {
      succes: true,
      resultat: resultatFormate,
      expression: expr,
      message: `🧮 *CALCULATRICE PRESTIGE*\n\n` +
               `📝 ${expr}\n\n` +
               `📊 Résultat : ${resultatFormate}`
    };
  } catch (err) {
    return {
      succes: false,
      message: `🧮 *CALCULATRICE MASERATI*\n\n` +
               `❌ Erreur : ${err.message}\n\n` +
               `💡 Vérifie ta formule et relance le moteur !`
    };
  }
};

// Conversions rapides prestige
const maseratiConvertir = (valeur, de, vers) => {
  const conversions = {
    // Température – climat Abidjan vs Monaco
    'c-f': (v) => v * 9/5 + 32,
    'f-c': (v) => (v - 32) * 5/9,
    'c-k': (v) => v + 273.15,
    'k-c': (v) => v - 273.15,

    // Distance – circuit vs route
    'km-mi': (v) => v * 0.621371,
    'mi-km': (v) => v * 1.60934,
    'm-ft': (v) => v * 3.28084,
    'ft-m': (v) => v * 0.3048,
    'cm-in': (v) => v * 0.393701,
    'in-cm': (v) => v * 2.54,

    // Poids – puissance moteur
    'kg-lb': (v) => v * 2.20462,
    'lb-kg': (v) => v * 0.453592,
    'g-oz': (v) => v * 0.035274,
    'oz-g': (v) => v * 28.3495,

    // Autres conversions utiles
    'm2-ft2': (v) => v * 10.7639,
    'ft2-m2': (v) => v * 0.092903,
    'l-gal': (v) => v * 0.264172,
    'gal-l': (v) => v * 3.78541,
    'kb-mb': (v) => v / 1024,
    'mb-gb': (v) => v / 1024
  };

  const cle = `\( {de.toLowerCase()}- \){vers.toLowerCase()}`;
  const convertisseur = conversions[cle];

  if (!convertisseur) {
    const liste = Object.keys(conversions)
      .map(k => k.replace('-', ' → ').toUpperCase())
      .join('\n');
    return {
      succes: false,
      message: `❌ Conversion non supportée !\n\n` +
               `📐 Conversions prestige disponibles :\n${liste}`
    };
  }

  const resultat = convertisseur(parseFloat(valeur));

  return {
    succes: true,
    resultat: parseFloat(resultat.toFixed(6)),
    message: `📐 *CONVERSION PRESTIGE*\n\n` +
             `${valeur} ${de.toUpperCase()} = ${parseFloat(resultat.toFixed(6))} ${vers.toUpperCase()}`
  };
};

// Exports prestige
export {
  maseratiCalculer,
  maseratiConvertir,
  FONCTIONS_PRESTIGE,
  CONSTANTES_PRESTIGE
};

export default {
  calculer: maseratiCalculer,
  convertir: maseratiConvertir,
  fonctions: FONCTIONS_PRESTIGE,
  constantes: CONSTANTES_PRESTIGE
};
