/*
 * Vérifie que chaque texte de l'interface existe en français ET en néerlandais.
 * Lancer avec :  node tests/traductions.test.js
 */
const path = require("path");
global.window = {};
require(path.join(__dirname, "../js/lang/fr.js"));
require(path.join(__dirname, "../js/lang/nl.js"));
const { fr, nl } = window.TEXTES;

function cles(objet, prefixe) {
  return Object.keys(objet).flatMap((k) => {
    const chemin = prefixe ? prefixe + "." + k : k;
    return objet[k] && typeof objet[k] === "object" ? cles(objet[k], chemin) : [chemin];
  });
}

const cfr = new Set(cles(fr)), cnl = new Set(cles(nl));
const manquantNl = [...cfr].filter((k) => !cnl.has(k));
const manquantFr = [...cnl].filter((k) => !cfr.has(k));
manquantNl.forEach((k) => console.log("Manque en néerlandais : " + k));
manquantFr.forEach((k) => console.log("Manque en français : " + k));
const total = manquantNl.length + manquantFr.length;
console.log(total ? total + " texte(s) manquant(s)." : "Les " + cfr.size + " textes existent dans les deux langues.");
process.exit(total ? 1 : 0);
