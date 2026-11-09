/*
 * Tests du calcul « accessible au moins un jour dans la plage ».
 * Lancer avec :  node tests/acces.test.js
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

// Charge js/acces.js comme le ferait le navigateur.
const contexte = { window: {}, I18n: { langue: () => "fr", t: (cle) => cle } };
vm.createContext(contexte);
vm.runInContext(fs.readFileSync(path.join(__dirname, "../js/acces.js"), "utf8"), contexte);
const Acces = contexte.window.Acces;

const jour = (s) => new Date(s + "T00:00:00");
const carte = (...periodes) => ({ periodesAcces: periodes.map(([du, au]) => ({ du, au })) });
const accessible = (c, du, au) => Acces.accessibleDansPlage(c, jour(du), jour(au));

const ete = carte(["01-04", "30-09"]);
const hiver = carte(["01-11", "31-03"]); // passe le Nouvel An
const deux = carte(["01-02", "31-03"], ["01-06", "15-09"]);

const cas = [
  ["plage entièrement dans la période", accessible(ete, "2026-05-10", "2026-05-20"), true],
  ["plage entièrement hors période", accessible(ete, "2026-10-12", "2026-10-20"), false],
  ["un seul jour en commun (dernier jour)", accessible(ete, "2026-09-30", "2026-10-15"), true],
  ["un seul jour en commun (premier jour)", accessible(ete, "2026-03-20", "2026-04-01"), true],
  ["période d'hiver, en décembre", accessible(hiver, "2026-12-01", "2026-12-03"), true],
  ["période d'hiver, en janvier", accessible(hiver, "2027-01-10", "2027-01-12"), true],
  ["période d'hiver, en été", accessible(hiver, "2026-07-01", "2026-08-31"), false],
  ["plage à cheval sur le Nouvel An", accessible(carte(["01-01", "15-01"]), "2026-12-20", "2027-01-02"), true],
  ["deux périodes : dans le trou entre les deux", accessible(deux, "2026-04-05", "2026-05-31"), false],
  ["deux périodes : touche la seconde", accessible(deux, "2026-05-25", "2026-06-01"), true],
  ["plage de plus d'un an", accessible(carte(["10-10", "10-10"]), "2026-01-01", "2027-06-01"), true],
  ["29 février", accessible(deux, "2028-02-29", "2028-02-29"), true]
];

let echecs = 0;
cas.forEach(([nom, obtenu, attendu]) => {
  const ok = obtenu === attendu;
  if (!ok) echecs++;
  console.log((ok ? "OK   " : "ÉCHEC") + "  " + nom);
});
assert.strictEqual(Acces.estInconnue({ periodesAcces: [] }), true);
console.log(echecs ? echecs + " échec(s)" : "Tous les tests passent.");
process.exit(echecs ? 1 : 0);
