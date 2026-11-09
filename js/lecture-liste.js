/*
 * Lecture d'une liste de cartes (CSV ou Excel) et contrôle ligne par ligne.
 *
 * lire(fichier)        -> Promise de lignes [[cellule, …], …] (texte)
 * analyser(lignes)     -> [{ numero, etat: "nouvelle"|"maj"|"erreur", erreurs, avertissements, carte }]
 *
 * Aucune donnée n'est enregistrée ici : voir js/import.js.
 */
window.LectureListe = (function () {
  var XLSX_URL = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";

  // Colonnes reconnues (nom interne -> en-têtes acceptés, sans accents ni majuscules).
  var COLONNES = {
    cadastre: ["cadastre", "numero_cadastre", "n_cadastre", "no_cadastre", "num_cadastre", "kadaster"],
    nom: ["nom", "nom_carte", "naam"],
    club: ["club"],
    commune: ["commune", "gemeente"],
    province: ["province", "provincie"],
    type: ["type"],
    statut: ["statut", "status"],
    echelle: ["echelle", "schaal"],
    equidistance: ["equidistance", "equidistantie"],
    anneeCreation: ["annee_creation", "creation", "jaar_aanmaak"],
    anneeMaj: ["annee_maj", "annee_mise_a_jour", "mise_a_jour", "maj", "jaar_bijwerking"],
    cartographe: ["cartographe", "kaartmaker"],
    descriptionFr: ["description_fr", "description"],
    descriptionNl: ["description_nl", "beschrijving"],
    periodesAcces: ["periodes_acces", "periode_acces", "acces", "toegang"],
    remarqueFr: ["remarque_acces_fr", "remarque_acces", "remarque_fr"],
    remarqueNl: ["remarque_acces_nl", "remarque_nl", "opmerking_toegang"],
    contactNom: ["contact_nom", "contact"],
    contactEmail: ["contact_email", "email", "e_mail"],
    contactTelephone: ["contact_telephone", "telephone", "tel", "telefoon"],
    latitude: ["latitude", "lat"],
    longitude: ["longitude", "lon", "lng"],
    fichierZone: ["fichier_zone", "fichier_kmz", "kmz", "fichier"]
  };

  // Colonnes à remplir obligatoirement (pour une nouvelle carte).
  var OBLIGATOIRES = ["cadastre", "nom", "club", "commune", "province", "type", "echelle", "equidistance", "anneeMaj"];

  // Statuts acceptés à l'import (cartes existantes).
  var STATUTS_IMPORT = ["projet", "usage", "ancienne"];

  function normaliser(texte) {
    return String(texte === null || texte === undefined ? "" : texte).trim().toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  }

  // ---- Lecture du fichier ----
  // Texte d'un CSV : UTF-8 si possible, sinon Windows-1252 (CSV enregistré par Excel).
  function decoder(octets) {
    try {
      return new TextDecoder("utf-8", { fatal: true }).decode(octets).replace(/^﻿/, "");
    } catch (e) {
      return new TextDecoder("windows-1252").decode(octets);
    }
  }

  // Découpe un CSV en lignes et cellules (guillemets, retours à la ligne, "" gérés).
  function lireCsv(texte) {
    var premiere = texte.split(/\r?\n/)[0] || "";
    var separateur = [";", ",", "\t"].sort(function (a, b) {
      return premiere.split(b).length - premiere.split(a).length;
    })[0];
    var lignes = [], ligne = [], cellule = "", entreGuillemets = false;
    for (var i = 0; i < texte.length; i++) {
      var ch = texte[i];
      if (entreGuillemets) {
        if (ch === '"' && texte[i + 1] === '"') { cellule += '"'; i++; }
        else if (ch === '"') entreGuillemets = false;
        else cellule += ch;
      } else if (ch === '"') {
        entreGuillemets = true;
      } else if (ch === separateur) {
        ligne.push(cellule); cellule = "";
      } else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && texte[i + 1] === "\n") i++;
        ligne.push(cellule); lignes.push(ligne); ligne = []; cellule = "";
      } else {
        cellule += ch;
      }
    }
    if (cellule !== "" || ligne.length) { ligne.push(cellule); lignes.push(ligne); }
    return lignes;
  }

  function lire(fichier) {
    var nom = fichier.name.toLowerCase();
    if (/\.(xlsx|xls|ods)$/.test(nom)) {
      return UI.chargerScript(XLSX_URL)
        .then(function () { return fichier.arrayBuffer(); })
        .then(function (octets) {
          var classeur = window.XLSX.read(octets, { type: "array" });
          var feuille = classeur.Sheets[classeur.SheetNames[0]];
          return window.XLSX.utils.sheet_to_json(feuille, { header: 1, raw: false, defval: "" });
        });
    }
    if (/\.(csv|txt)$/.test(nom)) {
      return fichier.arrayBuffer().then(function (octets) { return lireCsv(decoder(octets)); });
    }
    return Promise.reject(new Error("formatListe"));
  }

  // ---- Interprétation des valeurs ----
  // Table « texte saisi -> code » à partir des traductions FR et NL.
  function dictionnaire(section, codes, extras) {
    var table = {};
    codes.forEach(function (code) {
      table[normaliser(code)] = code;
      ["fr", "nl"].forEach(function (l) {
        var libelle = window.TEXTES[l][section] && window.TEXTES[l][section][code];
        if (libelle) table[normaliser(libelle)] = code;
      });
    });
    Object.keys(extras || {}).forEach(function (k) { table[normaliser(k)] = extras[k]; });
    return table;
  }

  var tables = null;
  function preparerTables() {
    tables = {
      province: dictionnaire("provinces", PageRegistre.PROVINCES, {
        "bruxelles": "BRU", "brussel": "BRU", "brussels": "BRU", "bxl": "BRU",
        "liege": "LIE", "luik": "LIE", "namen": "NAM", "henegouwen": "HAI",
        "luxemburg": "LUX", "brabant_wallon": "BW", "waals_brabant": "BW"
      }),
      type: dictionnaire("types", PageRegistre.TYPES, {
        "foret": "foret", "bos": "foret", "sprint": "sprint", "ville": "sprint", "stad": "sprint",
        "parc": "parc", "park": "parc", "ecole": "ecole", "school": "ecole"
      }),
      statut: dictionnaire("statuts", STATUTS_IMPORT, {
        "en_usage": "usage", "usage": "usage", "in_gebruik": "usage",
        "en_projet": "projet", "reservee": "projet", "projet": "projet",
        "ancienne": "ancienne", "oud": "ancienne"
      })
    };
  }

  function trouverClub(texte) {
    var n = normaliser(texte);
    return Donnees.clubs().filter(function (c) {
      return normaliser(c.abrev) === n || normaliser(c.nom) === n || c.id === n;
    })[0] || null;
  }

  // « 1:10 000 », « 1/10000 », « 10.000 » -> 10000
  function lireEchelle(texte) {
    var s = String(texte).replace(/\s| /g, "").replace(/^1[:/]/, "").replace(/[.,'](?=\d{3}\b)/g, "");
    return /^\d{3,6}$/.test(s) ? Number(s) : null;
  }

  // « 2,5 » -> 2.5
  function lireNombre(texte) {
    var s = String(texte).replace(/\s| /g, "").replace(",", ".").replace(/m$/i, "");
    return /^\d+(\.\d+)?$/.test(s) ? Number(s) : null;
  }

  function lireAnnee(texte) {
    var s = String(texte).trim();
    return /^(19|20)\d{2}$/.test(s) ? Number(s) : null;
  }

  // « 01/04-30/09; 1/11-15/12 » -> [{du:"01-04", au:"30-09"}, …] ; null si illisible
  function lirePeriodes(texte) {
    var morceaux = String(texte).split(/[;|]/).map(function (m) { return m.trim(); }).filter(Boolean);
    var periodes = [];
    for (var i = 0; i < morceaux.length; i++) {
      var m = morceaux[i].match(/^(\d{1,2})[/.](\d{1,2})\s*[-–]\s*(\d{1,2})[/.](\d{1,2})$/);
      if (!m) return null;
      var du = [m[1], m[2]], au = [m[3], m[4]];
      if (!dateValide(du) || !dateValide(au)) return null;
      periodes.push({
        du: du[0].padStart(2, "0") + "-" + du[1].padStart(2, "0"),
        au: au[0].padStart(2, "0") + "-" + au[1].padStart(2, "0")
      });
    }
    return periodes;
  }

  function dateValide(jm) {
    var j = Number(jm[0]), mois = Number(jm[1]);
    var d = new Date(2000, mois - 1, j);
    return mois >= 1 && mois <= 12 && d.getMonth() === mois - 1;
  }

  function lireCoordonnee(texte) {
    var s = String(texte).trim().replace(",", ".");
    return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : null;
  }

  function carteVide() {
    return {
      id: null, cadastre: null, nom: "", clubId: null, commune: "", province: "", type: "",
      echelle: null, equidistance: null, anneeCreation: null, anneeMaj: null, cartographe: "",
      statut: "usage", remplaceePar: null, motifRefus: null,
      description: { fr: "", nl: "" }, periodesAcces: [], remarqueAcces: { fr: "", nl: "" },
      contact: { nom: "", email: "", telephone: "" }, apercu: null, zone: null, point: null
    };
  }

  // ---- Analyse de toutes les lignes ----
  // lignes[0] = en-têtes. Renvoie { colonnesInconnues, colonnesManquantes, resultats }.
  function analyser(lignes) {
    preparerTables();
    var t = I18n.t;
    var entetes = (lignes[0] || []).map(normaliser);
    var index = {};
    var inconnues = [];
    entetes.forEach(function (e, i) {
      if (!e) return;
      var cle = Object.keys(COLONNES).filter(function (k) { return COLONNES[k].indexOf(e) !== -1; })[0];
      if (cle && !(cle in index)) index[cle] = i;
      else if (!cle) inconnues.push(lignes[0][i]);
    });
    var clubImpose = Profils.peut("creerDirectement") ? null : Profils.club();
    var manquantes = OBLIGATOIRES.filter(function (k) {
      return !(k in index) && !(k === "club" && clubImpose);
    });

    var vus = {};
    var resultats = [];
    lignes.slice(1).forEach(function (cellules, i) {
      var v = function (cle) { return cle in index ? String(cellules[index[cle]] === undefined ? "" : cellules[index[cle]]).trim() : ""; };
      // Ligne entièrement vide : ignorée.
      if (!cellules.some(function (x) { return String(x).trim(); })) return;

      var r = { numero: i + 2, erreurs: [], avertissements: [], etat: "nouvelle" };
      var cadastreTexte = v("cadastre");
      var cadastre = /^\d+$/.test(cadastreTexte) ? Number(cadastreTexte) : cadastreTexte || null;
      var existante = cadastre !== null ? Donnees.cartes().filter(function (c) { return String(c.cadastre) === String(cadastre); })[0] : null;
      var c = existante ? JSON.parse(JSON.stringify(existante)) : carteVide();
      if (existante) r.etat = "maj";

      // Colonnes dont la valeur est déjà signalée comme illisible (pas de double message).
      var illisibles = {};
      function erreur(cle, params, colonne) {
        r.erreurs.push(t("import.erreurs." + cle, params));
        if (colonne) illisibles[colonne] = true;
      }

      // Numéro de cadastre
      if (!cadastre) erreur("cadastreManquant");
      else if (vus[String(cadastre)]) erreur("cadastreDouble", { ligne: vus[String(cadastre)] });
      else vus[String(cadastre)] = r.numero;
      c.cadastre = cadastre;

      // Club
      var texteClub = v("club");
      if (texteClub) {
        var club = trouverClub(texteClub);
        if (!club) erreur("clubInconnu", { club: texteClub }, "club");
        else if (clubImpose && club.id !== clubImpose) erreur("autreClub", { club: club.nom });
        else c.clubId = club.id;
      } else if (!existante) {
        if (clubImpose) c.clubId = clubImpose;
      }
      if (existante && clubImpose && existante.clubId !== clubImpose) {
        erreur("carteAutreClub", { club: Donnees.club(existante.clubId).nom });
      }

      // Textes simples
      if (v("nom")) c.nom = v("nom");
      if (v("commune")) c.commune = v("commune");
      if (v("cartographe")) c.cartographe = v("cartographe");

      // Listes de valeurs
      [["province", "provinceInconnue"], ["type", "typeInconnu"], ["statut", "statutInconnu"]].forEach(function (p) {
        var texte = v(p[0]);
        if (!texte) return;
        var code = tables[p[0]][normaliser(texte)];
        if (code) c[p[0]] = code; else erreur(p[1], { valeur: texte }, p[0]);
      });

      // Nombres
      if (v("echelle")) { var e = lireEchelle(v("echelle")); if (e) c.echelle = e; else erreur("echelle", { valeur: v("echelle") }, "echelle"); }
      if (v("equidistance")) { var q = lireNombre(v("equidistance")); if (q) c.equidistance = q; else erreur("equidistance", { valeur: v("equidistance") }, "equidistance"); }
      [["anneeCreation", "anneeCreation"], ["anneeMaj", "anneeMaj"]].forEach(function (p) {
        if (!v(p[0])) return;
        var a = lireAnnee(v(p[0]));
        if (a) c[p[1]] = a; else erreur("annee", { valeur: v(p[0]) }, p[0]);
      });

      // Textes bilingues
      if (v("descriptionFr")) c.description.fr = v("descriptionFr");
      if (v("descriptionNl")) c.description.nl = v("descriptionNl");
      c.remarqueAcces = c.remarqueAcces || { fr: "", nl: "" };
      if (v("remarqueFr")) c.remarqueAcces.fr = v("remarqueFr");
      if (v("remarqueNl")) c.remarqueAcces.nl = v("remarqueNl");

      // Périodes d'accès
      if (v("periodesAcces")) {
        var periodes = lirePeriodes(v("periodesAcces"));
        if (periodes) c.periodesAcces = periodes; else erreur("periodes", { valeur: v("periodesAcces") });
      }

      // Contact
      if (v("contactNom")) c.contact.nom = v("contactNom");
      if (v("contactTelephone")) c.contact.telephone = v("contactTelephone");
      if (v("contactEmail")) {
        if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v("contactEmail"))) c.contact.email = v("contactEmail");
        else erreur("email", { valeur: v("contactEmail") });
      }

      // Point provisoire (si pas encore de zone)
      if (v("latitude") || v("longitude")) {
        var lat = lireCoordonnee(v("latitude")), lon = lireCoordonnee(v("longitude"));
        if (lat === null || lon === null || lat < 49 || lat > 52 || lon < 2 || lon > 7) erreur("coordonnees");
        else c.point = { type: "Point", coordinates: [lon, lat] };
      }
      if (v("fichierZone")) c.fichierZone = v("fichierZone");

      // Champs obligatoires (vérifiés sur la carte complète, après mise à jour)
      var champsCarte = { cadastre: "cadastre", nom: "nom", club: "clubId", commune: "commune", province: "province",
        type: "type", echelle: "echelle", equidistance: "equidistance", anneeMaj: "anneeMaj" };
      OBLIGATOIRES.forEach(function (k) {
        var val = c[champsCarte[k]];
        if ((val === null || val === undefined || val === "") && !(k === "cadastre" && !cadastre) && !illisibles[k]) {
          erreur("obligatoire", { champ: t("import.colonnes." + k) });
        }
      });

      // Avertissements : à compléter plus tard, sans bloquer l'import
      if (!c.zone) r.avertissements.push(t(c.point ? "import.avert.zonePoint" : "import.avert.zone"));
      var autres = Regles.champsObligatoires(c.statut).filter(function (k) {
        return ["zone", "cadastre", "nom", "commune", "province", "type", "echelle", "equidistance"].indexOf(k) === -1;
      }).filter(function (k) {
        var val = c[k];
        return val === null || val === undefined || val === "" || (k === "periodesAcces" && !val.length);
      });
      if (autres.length) {
        r.avertissements.push(t("import.avert.champs", { champs: autres.map(function (k) { return t("champs." + k); }).join(", ") }));
      }

      // Une ligne en erreur n'est pas importée : ses remarques « à compléter » sont inutiles.
      if (r.erreurs.length) { r.etat = "erreur"; r.avertissements = []; }
      r.carte = c;
      resultats.push(r);
    });

    return { colonnesInconnues: inconnues, colonnesManquantes: manquantes, resultats: resultats };
  }

  // Fichier modèle (CSV séparé par des points-virgules, lisible par Excel).
  function modele() {
    var entetes = ["cadastre", "nom", "club", "commune", "province", "type", "statut", "echelle", "equidistance",
      "annee_creation", "annee_maj", "cartographe", "description_fr", "description_nl", "periodes_acces",
      "remarque_acces_fr", "remarque_acces_nl", "contact_nom", "contact_email", "contact_telephone",
      "latitude", "longitude", "fichier_zone"];
    var exemples = [
      ["5001", "Bois d'Exemple", "ASUB", "Uccle", "Bruxelles", "Forêt", "En usage", "10000", "5", "2010", "2023",
        "A. Exemple", "Bois vallonné avec de nombreux chemins.", "Heuvelachtig bos met veel paden.",
        "01/04-30/09; 01/11-15/12", "Prévenir le garde forestier.", "De boswachter verwittigen.",
        "Prénom Nom", "cartes@exemple.org", "+32 470 00 00 00", "50.78", "4.36", ""],
      ["5002", "Centre de Démoville", "ASUB", "Ixelles", "Bruxelles", "Sprint", "En usage", "4000", "2,5", "2018", "2024",
        "B. Exemple", "", "", "01/01-31/12", "", "", "", "", "", "", "", "5002_centre.kmz"]
    ];
    var echapper = function (x) { return /[;"\n]/.test(x) ? '"' + x.replace(/"/g, '""') + '"' : x; };
    var texte = [entetes].concat(exemples).map(function (l) { return l.map(echapper).join(";"); }).join("\r\n");
    return new Blob(["﻿" + texte], { type: "text/csv;charset=utf-8" });
  }

  return {
    lire: lire,
    analyser: analyser,
    modele: modele,
    OBLIGATOIRES: OBLIGATOIRES,
    // exposés pour les tests
    _lireCsv: lireCsv, _lireEchelle: lireEchelle, _lirePeriodes: lirePeriodes
  };
})();
