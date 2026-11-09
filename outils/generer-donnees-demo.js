// Génère js/donnees-demo.js (données fictives) — usage : node outils/generer-donnees-demo.js js/donnees-demo.js
const fs = require("fs");

const clubs = [
  ["altair", "Altaïr", "ALT", "https://www.altair-co.be/"],
  ["ardoc", "ARDOC", "ARDOC", "https://www.ardoc.be/"],
  ["asub", "ASUB Orientation", "ASUB", "https://www.asub-orientation.org/"],
  ["balise10", "Balise 10", "B10", "http://www.balise10.be/"],
  ["coliege", "CO Liège", "COL", "https://www.coliege.be/"],
  ["comb", "CO Militaire Belge", "COMB", "https://sites.google.com/site/comilitairebelge/"],
  ["herma", "HERMA", "HERMA", "http://www.herma-co.be/"],
  ["hoc", "HOC", "HOC", "http://hoc-net.be/"],
  ["lost", "LOST", "LOST", "https://www.lostorientation.be/"],
  ["olveifel", "OLV Eifel", "OLV", "https://www.olv-eifel.be/"],
  ["pegase", "Pégase CO", "PEG", "https://www.xn--pgaseco-bya.be/"],
  ["sudolux", "Sudolux", "SUD", "http://sudolux.be/"],
  ["thor", "ThOR", "THOR", "https://www.thor-sport.be/"]
].map(([id, nom, abrev, site]) => ({ id, nom, abrev, site }));

// [club, nom, commune, province, type, lat, lon, rayon km, création, màj, statut, options]
const F = "foret", S = "sprint", E = "ecole", P = "parc";
const cartes = [
  ["asub", "Forêt de Soignes – Boitsfort", "Watermael-Boitsfort", "BRU", F, 50.792, 4.415, 1.3, 1998, 2019, "usage"],
  ["asub", "Bois de la Cambre", "Bruxelles", "BRU", P, 50.810, 4.374, 0.55, 2005, 2022, "usage"],
  ["asub", "Campus de la Plaine", "Ixelles", "BRU", E, 50.819, 4.398, 0.3, 2016, 2016, "usage"],
  ["comb", "Forêt de Soignes – Rouge-Cloître", "Auderghem", "BRU", F, 50.806, 4.432, 1.0, 2003, 2018, "usage"],
  ["comb", "Parc de Laeken", "Bruxelles", "BRU", P, 50.888, 4.357, 0.7, 2010, 2020, "usage"],
  ["comb", "Bois du Laerbeek", "Jette", "BRU", F, 50.890, 4.302, 0.5, 2001, 2001, "ancienne"],
  ["lost", "Louvain-la-Neuve centre", "Ottignies-Louvain-la-Neuve", "BW", S, 50.669, 4.614, 0.6, 2008, 2023, "usage"],
  ["lost", "Bois de Lauzelle (1996)", "Ottignies-Louvain-la-Neuve", "BW", F, 50.680, 4.598, 0.9, 1996, 2009, "ancienne", { remplaceePar: "Bois de Lauzelle" }],
  ["lost", "Bois de Lauzelle", "Ottignies-Louvain-la-Neuve", "BW", F, 50.681, 4.600, 1.0, 2021, 2024, "usage"],
  ["lost", "Bois des Rêves", "Ottignies-Louvain-la-Neuve", "BW", P, 50.659, 4.582, 0.5, 2012, 2019, "usage"],
  ["balise10", "Parc de la Dodaine", "Nivelles", "BW", P, 50.596, 4.330, 0.4, 2014, 2021, "usage"],
  ["balise10", "Bois de la Houssière", "Braine-le-Comte", "HAI", F, 50.620, 4.180, 1.4, 1999, 2017, "usage"],
  ["altair", "Bois de Colfontaine", "Colfontaine", "HAI", F, 50.400, 3.850, 1.5, 1995, 2016, "usage"],
  ["altair", "Mons centre", "Mons", "HAI", S, 50.454, 3.952, 0.5, 2015, 2024, "usage"],
  ["altair", "Bois d'Havré", "Mons", "HAI", F, 50.462, 4.040, 0.9, 2006, 2006, "usage"],
  ["hoc", "Forêt de Bon-Secours", "Péruwelz", "HAI", F, 50.495, 3.620, 1.3, 1997, 2021, "usage"],
  ["hoc", "Tournai centre", "Tournai", "HAI", S, 50.606, 3.389, 0.55, 2017, 2022, "usage"],
  ["hoc", "Bois de la Houppe", "Flobecq", "HAI", F, 50.735, 3.730, 0.9, 2025, null, "projet"],
  ["thor", "Thuin ville haute", "Thuin", "HAI", S, 50.339, 4.287, 0.4, 2013, 2020, "usage"],
  ["thor", "Lacs de l'Eau d'Heure", "Cerfontaine", "NAM", F, 50.190, 4.370, 1.6, 2002, 2018, "usage"],
  ["thor", "Bois de Rance", "Sivry-Rance", "HAI", F, 50.140, 4.270, 1.2, 2009, 2015, "usage"],
  ["pegase", "Citadelle de Namur", "Namur", "NAM", S, 50.458, 4.860, 0.6, 2011, 2023, "usage"],
  ["pegase", "Bois de la Marlagne", "Namur", "NAM", F, 50.430, 4.820, 1.4, 1994, 2020, "usage"],
  ["pegase", "Bois de Lustin", "Profondeville", "NAM", F, 50.372, 4.880, 1.0, 2004, 2004, "usage"],
  ["coliege", "Sart-Tilman (1993)", "Liège", "LIE", F, 50.583, 5.574, 1.2, 1993, 2005, "ancienne", { remplaceePar: "Sart-Tilman" }],
  ["coliege", "Sart-Tilman", "Liège", "LIE", F, 50.585, 5.577, 1.3, 2018, 2023, "usage"],
  ["coliege", "Liège Outremeuse", "Liège", "LIE", S, 50.638, 5.580, 0.5, 2016, 2022, "usage"],
  ["coliege", "Bois d'Esneux", "Esneux", "LIE", F, 50.530, 5.570, 1.0, 2007, 2019, "usage"],
  ["coliege", "Forêt de Spa", "Spa", "LIE", F, 50.480, 5.860, 1.5, 2000, 2021, "usage"],
  ["herma", "Huy centre", "Huy", "LIE", S, 50.518, 5.239, 0.45, 2019, 2019, "usage"],
  ["herma", "Bois d'Ampsin", "Amay", "LIE", F, 50.535, 5.285, 0.9, 2026, null, "projet"],
  ["ardoc", "Forêt de Saint-Hubert", "Saint-Hubert", "LUX", F, 50.030, 5.370, 1.8, 1996, 2022, "usage"],
  ["ardoc", "Bouillon château", "Bouillon", "LUX", S, 49.794, 5.067, 0.4, 2014, 2014, "usage"],
  ["ardoc", "Bois de La Roche", "La Roche-en-Ardenne", "LUX", F, 50.182, 5.575, 1.2, 2005, 2018, "usage"],
  ["ardoc", "Durbuy", "Durbuy", "LUX", S, 50.352, 5.456, 0.35, 2018, 2023, "usage"],
  ["sudolux", "Arlon centre", "Arlon", "LUX", S, 49.683, 5.815, 0.5, 2012, 2021, "usage"],
  ["sudolux", "Forêt d'Anlier", "Habay", "LUX", F, 49.770, 5.620, 1.8, 1998, 2020, "usage"],
  ["sudolux", "École communale de Virton", "Virton", "LUX", E, 49.568, 5.532, 0.15, 2020, 2020, "usage"],
  ["olveifel", "Sankt Vith Zentrum", "Sankt Vith", "LIE", S, 50.282, 6.127, 0.45, 2015, 2022, "usage"],
  ["olveifel", "Bütgenbacher Wald", "Bütgenbach", "LIE", F, 50.420, 6.200, 1.4, 2003, 2019, "usage"],
  ["olveifel", "Hertogenwald", "Eupen", "LIE", F, 50.590, 6.060, 1.6, 2026, null, "projet"],
  // Demandes de réservation (pas encore de numéro de cadastre)
  ["altair", "Bois de Baudour", "Saint-Ghislain", "HAI", F, 50.480, 3.830, 1.0, null, null, "demande"],
  ["comb", "Bois de la Cambre – Étangs", "Bruxelles", "BRU", P, 50.806, 4.378, 0.45, null, null, "demande"],
  ["thor", "Bois de Rance – extension", "Sivry-Rance", "HAI", F, 50.150, 4.300, 1.0, null, null, "refusee", {
    motifRefus: {
      fr: "La zone recouvre en grande partie la carte « Bois de Rance » du même club : mettre plutôt cette carte à jour.",
      nl: "De zone overlapt grotendeels met de kaart ‘Bois de Rance’ van dezelfde club: werk liever die kaart bij."
    }
  }]
];
// Statuts sans numéro de cadastre ni informations de dessin
const SANS_CADASTRE = ["demande", "refusee"];

// Générateur pseudo-aléatoire déterministe (mêmes données à chaque génération)
let graine = 42;
const alea = () => { graine = (graine * 16807) % 2147483647; return (graine - 1) / 2147483646; };

function polygone(lat, lon, rayonKm) {
  const n = 11, pts = [];
  const etirement = 0.7 + alea() * 0.6, rotation = alea() * Math.PI;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI;
    const r = rayonKm * (0.75 + alea() * 0.4);
    let dx = Math.cos(a) * r * etirement, dy = Math.sin(a) * r / etirement;
    [dx, dy] = [dx * Math.cos(rotation) - dy * Math.sin(rotation), dx * Math.sin(rotation) + dy * Math.cos(rotation)];
    const pLat = lat + dy / 111.32;
    const pLon = lon + dx / (111.32 * Math.cos(lat * Math.PI / 180));
    pts.push([+pLon.toFixed(5), +pLat.toFixed(5)]);
  }
  pts.push(pts[0]);
  return { type: "Polygon", coordinates: [pts] };
}

const echelles = { foret: [10000, 15000], sprint: [4000, 4000], ecole: [2000, 2000], parc: [5000, 7500] };
const equidistances = { foret: 5, sprint: 2.5, ecole: 2, parc: 2.5 };
const cartographes = ["J. Dumont", "M. Lambert", "P. Peeters", "C. Dubois", "A. Janssens", "L. Martin", "S. Wouters", "F. Leclercq", "H. Schmitz", "N. Renard"];
const prenoms = ["Anne", "Marc", "Sophie", "Luc", "Julie", "Pierre", "Claire", "Thomas", "Nadia", "Benoît", "Hilde", "Jonas", "Elise"];
const noms = ["Fictif", "Exemple", "Démo", "Modèle"];

// Périodes d'accès types (JJ-MM) — forêt : en dehors de la chasse ; ville : toute l'année
const periodesForet = [
  [{ du: "01-04", au: "30-09" }],
  [{ du: "01-02", au: "31-03" }, { du: "01-06", au: "15-09" }],
  [{ du: "01-01", au: "15-09" }],
  [{ du: "15-03", au: "31-08" }, { du: "01-11", au: "15-12" }]
];

const toute_annee = [{ du: "01-01", au: "31-12" }];

const parNom = {};
const resultat = cartes.map((c, i) => {
  const [clubId, nom, commune, province, type, lat, lon, rayon, creation, maj, statut, opt] = c;
  const club = clubs.find(k => k.id === clubId);
  const e = echelles[type];
  let periodes, remarque = null;
  if (i % 7 === 3) periodes = []; // période inconnue
  else if (type === F) {
    periodes = periodesForet[i % periodesForet.length];
    if (i % 3 === 0) remarque = {
      fr: "Demander l'autorisation au cantonnement du DNF au moins deux mois à l'avance.",
      nl: "Minstens twee maanden vooraf toestemming vragen aan het DNF-kantonnement."
    };
  } else periodes = toute_annee;
  const prenom = prenoms[clubs.indexOf(club) % prenoms.length];
  const carte = {
    id: "c" + String(i + 1).padStart(3, "0"),
    cadastre: 1000 + ((i * 37) % 900) + i,
    nom, clubId, commune, province, type,
    echelle: i % 2 ? e[1] : e[0],
    equidistance: equidistances[type],
    anneeCreation: creation,
    anneeMaj: maj,
    cartographe: cartographes[i % cartographes.length],
    statut,
    remplaceePar: null,
    description: i % 4 === 1
      ? { fr: "Terrain varié avec un réseau de chemins dense.", nl: "" }
      : { fr: "Carte de démonstration – " + nom + ".", nl: "Demokaart – " + nom + "." },
    periodesAcces: periodes,
    remarqueAcces: remarque,
    contact: {
      nom: prenom + " " + noms[i % noms.length],
      email: "cartes@" + club.abrev.toLowerCase() + ".example",
      telephone: "+32 470 00 " + String(10 + (i % 90)).padStart(2, "0") + " " + String(10 + clubs.indexOf(club)).padStart(2, "0")
    },
    apercu: null,
    zone: polygone(lat, lon, rayon)
  };
  if (SANS_CADASTRE.includes(statut)) {
    Object.assign(carte, { cadastre: null, echelle: null, equidistance: null, cartographe: null, periodesAcces: [], remarqueAcces: null });
  }
  carte.motifRefus = (opt && opt.motifRefus) || null;
  if (opt && opt.remplaceePar) carte._remplaceePar = opt.remplaceePar;
  parNom[nom] = carte.id;
  return carte;
});
resultat.forEach(c => {
  if (c._remplaceePar) { c.remplaceePar = parNom[c._remplaceePar]; delete c._remplaceePar; }
});
// Unicité des numéros de cadastre
const vus = new Set();
resultat.forEach(c => { if (c.cadastre === null) return; if (vus.has(c.cadastre)) throw new Error("cadastre en double " + c.cadastre); vus.add(c.cadastre); });

// Signalements d'erreurs envoyés par des membres de club
const signalements = [
  { id: "s001", carteId: "c001", auteur: { profil: "membre", clubId: "comb" }, date: "2026-10-03",
    texte: "Le parking du Rouge-Cloître n'est plus accessible : il faudrait l'indiquer dans la remarque sur l'accès.",
    statut: "ouvert", reponse: null, dateReponse: null },
  { id: "s002", carteId: "c026", auteur: { profil: "membre", clubId: "herma" }, date: "2026-10-18",
    texte: "L'équidistance indiquée (5 m) ne correspond pas à la carte imprimée, qui est en 2,5 m.",
    statut: "ouvert", reponse: null, dateReponse: null },
  { id: "s003", carteId: "c009", auteur: { profil: "membre", clubId: "lost" }, date: "2026-11-02",
    texte: "Le nom du cartographe est incomplet : la mise à jour 2024 a été faite par deux personnes.",
    statut: "ouvert", reponse: null, dateReponse: null },
  { id: "s004", carteId: "c013", auteur: { profil: "membre", clubId: "altair" }, date: "2026-09-12",
    texte: "La période d'accès a changé : le DNF autorise maintenant aussi le mois d'octobre.",
    statut: "traite", reponse: "Merci, vérifié avec le cantonnement : la période sera mise à jour.", dateReponse: "2026-09-20" }
];

const entete = `/*
 * Données de DÉMONSTRATION (fictives) — fichier généré par outils/generer-donnees-demo.js.
 * Les noms de clubs sont réels (https://frso.be/les-clubs/) ; tout le reste est inventé :
 * cartes, numéros de cadastre, contours (approximatifs), contacts, cartographes.
 * Les périodes d'accès sont au format "JJ-MM" (jour-mois), répétées chaque année.
 */
`;
fs.writeFileSync(process.argv[2],
  entete + "window.DONNEES_DEMO = " + JSON.stringify({ clubs, cartes: resultat, signalements }, null, 1) + ";\n");
console.log(resultat.length + " cartes, " + clubs.length + " clubs");
