/*
 * Page « Importer une liste » (adresse #/import).
 *  1. Liste de cartes (CSV ou Excel) : contrôle ligne par ligne, puis import.
 *  2. Zones (fichiers KML/KMZ) : associées aux cartes par le numéro de cadastre
 *     (nom du fichier = numéro) ou par la colonne « fichier_zone » de la liste.
 *
 * Responsable de club : cartes de son club uniquement ; les cartes créées sont
 * marquées « importée – à vérifier » pour l'administrateur.
 */
window.PageImport = (function () {
  var el = UI.el, t = I18n.t;
  var analyse = null;   // résultat de la dernière analyse de liste
  var zonesChoisies = []; // [{ fichier, carte }]

  function cartesAccessibles() {
    return Donnees.cartes().filter(function (c) { return Profils.peutSurCarte("importer", c); });
  }

  // Nom de fichier sans dossier ni extension, normalisé pour comparer.
  function base(nom) {
    return String(nom).split(/[\\/]/).pop().replace(/\.(kmz|kml)$/i, "").trim().toLowerCase();
  }

  function aujourdhui() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  // ---- Partie 1 : la liste ----
  function sectionListe(rafraichir) {
    var message = el("p", { class: "message-fichier", "aria-live": "polite" });
    var lienModele = el("a", {
      href: "#", class: "bouton",
      onclick: function (e) {
        e.preventDefault();
        var url = URL.createObjectURL(LectureListe.modele());
        var a = el("a", { href: url, download: "modele-registre-cartes.csv" });
        document.body.append(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      }
    }, ["⬇ " + t("import.telechargerModele")]);

    var entree = el("input", {
      type: "file", accept: ".csv,.txt,.xlsx,.xls,.ods",
      onchange: function (e) {
        var fichier = e.target.files[0];
        e.target.value = "";
        if (!fichier) return;
        message.textContent = t("edition.traitement");
        LectureListe.lire(fichier).then(function (lignes) {
          if (lignes.length < 2) throw new Error("listeVide");
          analyse = LectureListe.analyser(lignes);
          analyse.fichier = fichier.name;
          rafraichir();
        }).catch(function (err) {
          analyse = null;
          var cle = "import.erreurs." + err.message;
          message.textContent = t(cle) !== cle ? t(cle) : t("import.erreurs.listeIllisible");
        });
      }
    });

    var obligatoires = LectureListe.OBLIGATOIRES.filter(function (k) {
      return !(k === "club" && !Profils.peut("creerDirectement"));
    }).map(function (k) { return t("import.colonnes." + k); }).join(", ");

    var blocs = [
      el("h2", {}, ["1. " + t("import.titreListe")]),
      el("p", { class: "aide" }, [t("import.aideListe")]),
      el("p", { class: "aide" }, [el("strong", {}, [t("import.colonnesObligatoires") + " "]), obligatoires,
        !Profils.peut("creerDirectement") ? " " + t("import.clubAuto", { club: Donnees.club(Profils.club()).nom }) : ""]),
      el("div", { class: "actions-formulaire" }, [lienModele]),
      el("label", { class: "champ fichier" }, [el("span", { class: "libelle" }, [t("import.choisirListe")]), entree]),
      message
    ];
    if (analyse) blocs.push(resultatAnalyse(rafraichir));
    return el("section", { class: "panneau" }, blocs);
  }

  function resultatAnalyse(rafraichir) {
    var r = analyse.resultats;
    var valides = r.filter(function (x) { return x.etat !== "erreur"; });
    var compte = function (etat) { return r.filter(function (x) { return x.etat === etat; }).length; };
    var message = el("p", { class: "message-fichier", "aria-live": "polite" });

    var corps = el("tbody");
    r.forEach(function (x) {
      corps.append(el("tr", { class: "import-" + x.etat }, [
        el("td", { class: "nombre" }, [String(x.numero)]),
        el("td", {}, [x.carte.cadastre ? String(x.carte.cadastre) : "–"]),
        el("td", {}, [x.carte.nom || "–"]),
        el("td", {}, [x.carte.clubId ? Donnees.club(x.carte.clubId).nom : "–"]),
        el("td", {}, [el("span", { class: "badge badge-import-" + x.etat }, [t("import.etats." + x.etat)])]),
        el("td", {}, [
          x.erreurs.length ? el("ul", { class: "liste-erreurs" }, x.erreurs.map(function (e) { return el("li", {}, [e]); })) : null,
          x.avertissements.length ? el("ul", { class: "liste-avertissements" }, x.avertissements.map(function (e) { return el("li", {}, [e]); })) : null
        ])
      ]));
    });

    function importer() {
      var n = 0;
      for (var i = 0; i < valides.length; i++) {
        var x = valides[i];
        var c = JSON.parse(JSON.stringify(x.carte));
        var existante = Donnees.cartes().filter(function (k) { return String(k.cadastre) === String(c.cadastre); })[0];
        c.id = existante ? existante.id : Donnees.nouvelId();
        // Créée ou modifiée par un club : à vérifier par l'administrateur.
        c.aVerifier = Profils.peut("creerDirectement") ? Boolean(existante && existante.aVerifier) : true;
        c.importeLe = aujourdhui();
        if (!Donnees.enregistrerCarte(c)) {
          message.textContent = t("import.arretStockage", { n: n });
          return;
        }
        n++;
      }
      analyse = null;
      rafraichir(t("import.importees", { n: n }));
    }

    return el("div", { class: "resultat-import" }, [
      el("h3", {}, [t("import.resultatTitre", { fichier: analyse.fichier })]),
      el("p", {}, [
        el("span", { class: "badge badge-import-nouvelle" }, [t("import.compteNouvelles", { n: compte("nouvelle") })]), " ",
        el("span", { class: "badge badge-import-maj" }, [t("import.compteMaj", { n: compte("maj") })]), " ",
        el("span", { class: "badge badge-import-erreur" }, [t("import.compteErreurs", { n: compte("erreur") })])
      ]),
      analyse.colonnesManquantes.length
        ? el("p", { class: "avis avis-erreur" }, [t("import.colonnesManquantes", {
            liste: analyse.colonnesManquantes.map(function (k) { return t("import.colonnes." + k); }).join(", ") })])
        : null,
      analyse.colonnesInconnues.length
        ? el("p", { class: "avis avis-chevauchement" }, [t("import.colonnesIgnorees", { liste: analyse.colonnesInconnues.join(", ") })])
        : null,
      el("div", { class: "tableau-defilant" }, [el("table", { class: "tableau tableau-import" }, [
        el("thead", {}, [el("tr", {}, [
          el("th", { class: "nombre" }, [t("import.ligne")]), el("th", {}, [t("champs.cadastre")]),
          el("th", {}, [t("champs.nom")]), el("th", {}, [t("champs.club")]),
          el("th", {}, [t("import.etat")]), el("th", {}, [t("import.remarques")])
        ])]),
        corps
      ])]),
      message,
      el("div", { class: "actions-formulaire" }, [
        el("button", {
          type: "button", class: "bouton bouton-principal", disabled: !valides.length,
          onclick: importer
        }, [t("import.importer", { n: valides.length })]),
        el("button", { type: "button", class: "bouton", onclick: function () { analyse = null; rafraichir(); } }, [t("edition.annuler")])
      ])
    ]);
  }

  // ---- Partie 2 : les zones (KML / KMZ) ----
  function trouverCarte(nomFichier) {
    var b = base(nomFichier);
    return cartesAccessibles().filter(function (c) {
      return (c.cadastre !== null && String(c.cadastre).toLowerCase() === b) ||
        (c.fichierZone && (base(c.fichierZone) === b));
    })[0] || null;
  }

  function sectionZones(rafraichir) {
    var message = el("p", { class: "message-fichier", "aria-live": "polite" });
    var sansZone = cartesAccessibles().filter(function (c) { return !c.zone && Regles.STATUTS[c.statut].avecCadastre; });
    var entree = el("input", {
      type: "file", accept: ".kml,.kmz", multiple: true,
      onchange: function (e) {
        zonesChoisies = Array.prototype.map.call(e.target.files, function (f) {
          return { fichier: f, carte: trouverCarte(f.name) };
        });
        e.target.value = "";
        rafraichir();
      }
    });

    function appliquer() {
      var aTraiter = zonesChoisies.filter(function (z) { return z.carte; });
      var max = Regles.parametres().tailleMaxKmlMo * 1024 * 1024;
      var reussies = 0, echecs = [];
      message.textContent = t("edition.traitement");
      // Un fichier après l'autre (lecture, puis enregistrement).
      aTraiter.reduce(function (promesse, z) {
        return promesse.then(function () {
          if (z.fichier.size > max) { echecs.push(z.fichier.name + " : " + t("erreurs.kmlTropLourd", { mo: Regles.parametres().tailleMaxKmlMo })); return; }
          return Zones.depuisFichier(z.fichier).then(function (zone) {
            var c = JSON.parse(JSON.stringify(Donnees.carte(z.carte.id)));
            c.zone = zone;
            c.point = null;
            if (!Profils.peut("creerDirectement")) c.aVerifier = true;
            if (Donnees.enregistrerCarte(c)) reussies++;
            else echecs.push(z.fichier.name + " : " + t("erreurs.stockage"));
          }).catch(function (err) {
            var cle = "erreurs." + err.message;
            echecs.push(z.fichier.name + " : " + (t(cle) !== cle ? t(cle) : t("erreurs.kmlIllisible")));
          });
        });
      }, Promise.resolve()).then(function () {
        zonesChoisies = [];
        rafraichir(t("import.zonesAppliquees", { n: reussies }), echecs);
      });
    }

    var blocs = [
      el("h2", {}, ["2. " + t("import.titreZones")]),
      el("p", { class: "aide" }, [t("import.aideZones")]),
      el("p", {}, [sansZone.length
        ? t("import.sansZone", { n: sansZone.length })
        : t("import.toutesAvecZone")]),
      el("label", { class: "champ fichier" }, [el("span", { class: "libelle" }, [t("import.choisirZones")]), entree])
    ];

    if (zonesChoisies.length) {
      var trouvees = zonesChoisies.filter(function (z) { return z.carte; }).length;
      blocs.push(
        el("div", { class: "tableau-defilant" }, [el("table", { class: "tableau tableau-import" }, [
          el("thead", {}, [el("tr", {}, [
            el("th", {}, [t("import.fichier")]), el("th", {}, [t("import.carteAssociee")]), el("th", {}, [t("import.remarques")])
          ])]),
          el("tbody", {}, zonesChoisies.map(function (z) {
            return el("tr", { class: z.carte ? "" : "import-erreur" }, [
              el("td", {}, [z.fichier.name]),
              el("td", {}, [z.carte
                ? el("a", { href: "#/carte/" + z.carte.id, target: "_blank" }, [z.carte.nom + " (n° " + z.carte.cadastre + ")"])
                : el("span", { class: "badge badge-import-erreur" }, [t("import.aucuneCorrespondance")])]),
              el("td", {}, [z.carte && z.carte.zone ? t("import.remplaceZone") : ""])
            ]);
          }))
        ])]),
        message,
        el("div", { class: "actions-formulaire" }, [
          el("button", { type: "button", class: "bouton bouton-principal", disabled: !trouvees, onclick: appliquer },
            [t("import.appliquerZones", { n: trouvees })]),
          el("button", { type: "button", class: "bouton", onclick: function () { zonesChoisies = []; rafraichir(); } }, [t("edition.annuler")])
        ])
      );
    } else {
      blocs.push(message);
    }
    return el("section", { class: "panneau" }, blocs);
  }

  // ---- Page ----
  function afficher(contenu, avis, details) {
    var retour = el("p", {}, [el("a", { href: "#/" }, ["← " + t("navigation.retourRegistre")])]);
    if (!Profils.peut("importer")) {
      contenu.append(retour, el("section", { class: "panneau" }, [el("h1", {}, [t("import.nonAutorise")])]));
      return;
    }
    function rafraichir(nouvelAvis, nouveauxDetails) {
      contenu.innerHTML = "";
      afficher(contenu, nouvelAvis, nouveauxDetails);
      document.dispatchEvent(new CustomEvent("entete-a-jour"));
    }
    [
      retour,
      el("h1", {}, [t("import.titre")]),
      el("p", { class: "aide" }, [Profils.peut("creerDirectement") ? t("import.introAdmin") : t("import.introClub", { club: Donnees.club(Profils.club()).nom })]),
      avis ? el("div", { class: "avis" }, [avis, details && details.length
        ? el("ul", {}, details.map(function (d) { return el("li", {}, [d]); })) : null]) : null,
      sectionListe(rafraichir),
      sectionZones(rafraichir)
    ].forEach(function (bloc) { if (bloc) contenu.append(bloc); });
  }

  return {
    afficher: function (contenu) { afficher(contenu); }
  };
})();
