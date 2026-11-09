/*
 * Tests de la lecture des listes importées (CSV, échelles, périodes).
 * Lancer avec :  node tests/lecture-liste.test.js
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const contexte = { window: {} };
vm.createContext(contexte);
vm.runInContext(fs.readFileSync(path.join(__dirname, "../js/lecture-liste.js"), "utf8"), contexte);
const L = contexte.window.LectureListe;

let echecs = 0;
function cas(nom, obtenu, attendu) {
  try {
    assert.deepStrictEqual(JSON.parse(JSON.stringify(obtenu)), attendu);
    console.log("OK     " + nom);
  } catch (e) {
    echecs++;
    console.log("ÉCHEC  " + nom + "\n       obtenu : " + JSON.stringify(obtenu) + "\n       attendu : " + JSON.stringify(attendu));
  }
}

// CSV
cas("CSV point-virgule", L._lireCsv("a;b;c\r\n1;2;3\r\n"), [["a", "b", "c"], ["1", "2", "3"]]);
cas("CSV virgule", L._lireCsv("a,b\n1,2"), [["a", "b"], ["1", "2"]]);
cas("CSV guillemets avec séparateur et retour à la ligne",
  L._lireCsv('nom;desc\n"Bois; nord";"ligne 1\nligne 2"\n'), [["nom", "desc"], ["Bois; nord", "ligne 1\nligne 2"]]);
cas("CSV guillemets doublés", L._lireCsv('a;b\n"dit ""oui""";x'), [["a", "b"], ['dit "oui"', "x"]]);

// Échelles
cas("échelle 10000", L._lireEchelle("10000"), 10000);
cas("échelle 1:10 000", L._lireEchelle("1:10 000"), 10000);
cas("échelle 1/4000", L._lireEchelle("1/4000"), 4000);
cas("échelle 15.000", L._lireEchelle("15.000"), 15000);
cas("échelle illisible", L._lireEchelle("grande"), null);

// Périodes d'accès
cas("une période", L._lirePeriodes("01/04-30/09"), [{ du: "01-04", au: "30-09" }]);
cas("deux périodes, jours sans zéro", L._lirePeriodes("1/4-30/9; 1/11-15/12"),
  [{ du: "01-04", au: "30-09" }, { du: "01-11", au: "15-12" }]);
cas("toute l'année", L._lirePeriodes("01/01-31/12"), [{ du: "01-01", au: "31-12" }]);
cas("date impossible (31 avril)", L._lirePeriodes("31/04-30/09"), null);
cas("texte illisible", L._lirePeriodes("été"), null);

console.log(echecs ? echecs + " échec(s)" : "Tous les tests passent.");
process.exit(echecs ? 1 : 0);
