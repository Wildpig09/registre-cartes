/*
 * Espace administrateur (adresse #/admin/<onglet>) :
 *   demandes         valider ou refuser les demandes de réservation
 *   chevauchements   examiner les zones qui se recouvrent
 *   clubs            ajouter ou modifier des clubs
 *   parametres       réglages du processus (voir js/regles.js)
 */
window.PageAdmin = (function () {
  var el = UI.el, t = I18n.t;
  var ONGLETS = ["demandes", "imports", "chevauchements", "clubs", "parametres"];
  var miniCartes = [];
  var montrerVerifies = false;

  function nombreDemandes() {
    return Donnees.cartes().filter(function (c) { return c.statut === "demande"; }).length;
  }

  function hectares(m2) {
    return (m2 / 10000).toLocaleString(I18n.langue() === "nl" ? "nl-BE" : "fr-BE", { maximumFractionDigits: 1 });
  }

  // Petite carte non interactive montrant une zone (et éventuellement d'autres en gris).
  function miniCarte(conteneur, principale, autres) {
    var carte = L.map(conteneur, { scrollWheelZoom: false, attributionControl: true });
    Fonds.ajouter(carte);
    (autres || []).forEach(function (c) {
      L.geoJSON(c.zone, { style: { color: "#555", weight: 1.5, fillOpacity: 0.1, dashArray: "3 3" } })
        .bindTooltip(c.nom + " – " + Donnees.club(c.clubId).nom).addTo(carte);
    });
    var zone = L.geoJSON(principale.zone, { style: UI.styleZone(principale.statut, true) }).addTo(carte);
    carte.fitBounds(zone.getBounds(), { padding: [20, 20], maxZoom: 15 });
    miniCartes.push(carte);
  }

  // ---- Onglet : demandes à valider ----
  function ongletDemandes(conteneur, rafraichir) {
    var demandes = Donnees.cartes().filter(function (c) { return c.statut === "demande"; });
    conteneur.append(el("p", { class: "aide" }, [t("admin.demandesAide")]));
    if (!demandes.length) {
      conteneur.append(el("p", { class: "panneau vide" }, [t("admin.aucuneDemande")]));
      return;
    }
    var aDemarrer = [];
    demandes.forEach(function (c) {
      var chev = Zones.chevauchements(c.zone, c.id, c.clubId);
      var zoneCarte = el("div", { class: "mini-carte" });
      var message = el("p", { class: "message-fichier", "aria-live": "polite" });
      var cadastre = el("input", { inputmode: "numeric", "aria-label": t("champs.cadastre"), placeholder: t("admin.cadastrePlaceholder") });
      var motif = { fr: "", nl: "" };

      function valider() {
        var n = cadastre.value.trim();
        if (!n) { message.textContent = t("admin.cadastreRequis"); return; }
        if (Donnees.cadastreUtilise(n, c.id)) { message.textContent = t("erreurs.cadastreUtilise", { n: n }); return; }
        var maj = JSON.parse(JSON.stringify(c));
        maj.cadastre = /^\d+$/.test(n) ? Number(n) : n;
        maj.statut = "projet";
        maj.motifRefus = null;
        if (!Donnees.enregistrerCarte(maj)) { message.textContent = t("erreurs.stockage"); return; }
        rafraichir();
      }

      function refuser() {
        if (!motif.fr.trim() && !motif.nl.trim()) { message.textContent = t("admin.motifRequis"); return; }
        var maj = JSON.parse(JSON.stringify(c));
        maj.statut = "refusee";
        maj.motifRefus = { fr: motif.fr.trim(), nl: motif.nl.trim() };
        if (!Donnees.enregistrerCarte(maj)) { message.textContent = t("erreurs.stockage"); return; }
        rafraichir();
      }

      conteneur.append(el("article", { class: "panneau demande" }, [
        el("div", { class: "demande-colonnes" }, [
          el("div", {}, [
            el("h2", {}, [el("a", { href: "#/carte/" + c.id }, [c.nom])]),
            el("p", {}, [Donnees.club(c.clubId).nom + " · " + c.commune + " · " +
              t("provinces." + c.province) + " · " + t("types." + c.type)]),
            chev.length
              ? el("div", { class: "avis avis-chevauchement" }, [
                  el("strong", {}, ["⚠ " + t("edition.chevauchementTitre")]),
                  el("ul", {}, chev.map(function (x) {
                    return el("li", {}, [x.carte.nom + " – " + Donnees.club(x.carte.clubId).nom + " – " +
                      t("edition.surface", { ha: hectares(x.surface) }) + (x.autreClub ? " – " + t("edition.autreClub") : "")]);
                  }))
                ])
              : el("p", { class: "avis" }, [t("admin.aucunChevauchement")]),
            el("div", { class: "decision" }, [
              el("h3", {}, [t("admin.valider")]),
              el("div", { class: "ligne-decision" }, [
                cadastre,
                el("button", { type: "button", class: "bouton bouton-principal", onclick: valider }, [t("admin.validerBouton")])
              ]),
              el("h3", {}, [t("admin.refuser")]),
              el("div", { class: "bilingue" }, ["fr", "nl"].map(function (l) {
                return el("label", { class: "champ-langue" }, [
                  el("span", { class: "code-langue" }, [l.toUpperCase()]),
                  el("textarea", { rows: "2", placeholder: t("admin.motifPlaceholder"),
                    oninput: function (e) { motif[l] = e.target.value; } })
                ]);
              })),
              el("button", { type: "button", class: "bouton bouton-danger", onclick: refuser }, [t("admin.refuserBouton")]),
              message
            ])
          ]),
          zoneCarte
        ])
      ]));
      aDemarrer.push(function () { miniCarte(zoneCarte, c, chev.map(function (x) { return x.carte; })); });
    });
    aDemarrer.forEach(function (f) { f(); });
  }

  // ---- Onglet : cartes importées à vérifier ----
  function nombreImports() {
    return Donnees.cartes().filter(function (c) { return c.aVerifier; }).length;
  }

  function ongletImports(conteneur, rafraichir) {
    var aVerifier = Donnees.cartes().filter(function (c) { return c.aVerifier; });
    var sansZone = Donnees.cartes().filter(function (c) { return !c.zone && Regles.STATUTS[c.statut].avecCadastre; });

    function confirmer(liste) {
      liste.forEach(function (c) {
        var maj = JSON.parse(JSON.stringify(c));
        delete maj.aVerifier;
        Donnees.enregistrerCarte(maj);
      });
      rafraichir();
    }

    conteneur.append(
      el("p", { class: "aide" }, [t("admin.importsAide")]),
      el("div", { class: "actions-formulaire" }, [
        el("a", { class: "bouton", href: "#/import" }, ["⬆ " + t("import.titre")])
      ]),
      el("p", {}, [sansZone.length ? t("import.sansZone", { n: sansZone.length }) : t("import.toutesAvecZone")])
    );
    if (!aVerifier.length) {
      conteneur.append(el("p", { class: "panneau vide" }, [t("admin.aucunImport")]));
      return;
    }
    var corps = el("tbody");
    aVerifier.forEach(function (c) {
      corps.append(el("tr", {}, [
        el("td", {}, [el("a", { href: "#/carte/" + c.id, class: "nom-carte" }, [c.nom]),
          el("div", { class: "secondaire" }, ["n° " + c.cadastre + " · " + c.commune])]),
        el("td", {}, [Donnees.club(c.clubId).nom]),
        el("td", {}, [UI.badgeStatut(c.statut)]),
        el("td", {}, [c.zone ? "✓" : el("span", { class: "badge badge-a-completer" }, [t("liste.zoneACompleter")])]),
        el("td", {}, [c.importeLe || "–"]),
        el("td", {}, [el("button", { type: "button", class: "bouton", onclick: function () { confirmer([c]); } }, [t("admin.confirmer")])])
      ]));
    });
    conteneur.append(
      el("div", { class: "panneau tableau-defilant" }, [
        el("table", { class: "tableau" }, [
          el("thead", {}, [el("tr", {}, [
            el("th", {}, [t("champs.nom")]), el("th", {}, [t("champs.club")]), el("th", {}, [t("champs.statut")]),
            el("th", {}, [t("champs.zone")]), el("th", {}, [t("admin.importeLe")]), el("th", {}, [""])
          ])]),
          corps
        ]),
        el("div", { class: "actions-formulaire" }, [
          el("button", { type: "button", class: "bouton bouton-principal",
            onclick: function () { if (window.confirm(t("admin.confirmerTout", { n: aVerifier.length }))) confirmer(aVerifier); }
          }, [t("admin.toutConfirmer", { n: aVerifier.length })])
        ])
      ])
    );
  }

  // ---- Onglet : chevauchements ----
  function ongletChevauchements(conteneur, rafraichir) {
    var tous = Zones.tousLesChevauchements().filter(function (x) {
      // Une ancienne carte et sa remplaçante se recouvrent normalement.
      x.remplacement = x.a.remplaceePar === x.b.id || x.b.remplaceePar === x.a.id;
      x.verifie = Donnees.chevauchementVerifie(x.a.id, x.b.id);
      return true;
    }).sort(function (x, y) {
      return (x.verifie - y.verifie) || (y.autreClub - x.autreClub) || (y.surface - x.surface);
    });
    var aVerifier = tous.filter(function (x) { return !x.verifie; });
    var affiches = montrerVerifies ? tous : aVerifier;

    conteneur.append(
      el("p", { class: "aide" }, [t("admin.chevauchementsAide")]),
      el("label", { class: "case" }, [
        el("input", { type: "checkbox", checked: montrerVerifies,
          onchange: function (e) { montrerVerifies = e.target.checked; rafraichir(); } }),
        " " + t("admin.montrerVerifies", { n: tous.length - aVerifier.length })
      ])
    );
    if (!affiches.length) {
      conteneur.append(el("p", { class: "panneau vide" }, [t("admin.aucunChevauchementAVerifier")]));
      return;
    }
    var corps = el("tbody");
    affiches.forEach(function (x) {
      function cellule(c) {
        return el("td", {}, [
          el("a", { href: "#/carte/" + c.id, class: "nom-carte" }, [c.nom]), " ", UI.badgeStatut(c.statut),
          el("div", { class: "secondaire" }, [Donnees.club(c.clubId).nom])
        ]);
      }
      corps.append(el("tr", { class: x.verifie ? "verifie" : "" }, [
        cellule(x.a),
        cellule(x.b),
        el("td", { class: "nombre" }, [hectares(x.surface) + " ha"]),
        el("td", {}, [
          x.autreClub ? el("span", { class: "badge badge-refusee" }, [t("admin.deuxClubs")]) : el("span", { class: "badge badge-ancienne" }, [t("admin.memeClub")]),
          x.remplacement ? el("div", { class: "secondaire" }, [t("admin.remplacement")]) : null
        ]),
        el("td", {}, [
          el("button", {
            type: "button", class: x.verifie ? "bouton-lien" : "bouton",
            onclick: function () { Donnees.marquerChevauchement(x.a.id, x.b.id, !x.verifie); rafraichir(); }
          }, [t(x.verifie ? "admin.annulerVerifie" : "admin.marquerVerifie")])
        ])
      ]));
    });
    conteneur.append(el("div", { class: "panneau tableau-defilant" }, [el("table", { class: "tableau" }, [
      el("thead", {}, [el("tr", {}, [
        el("th", {}, [t("admin.carteA")]), el("th", {}, [t("admin.carteB")]),
        el("th", { class: "nombre" }, [t("admin.surfaceCommune")]), el("th", {}, [t("admin.type")]), el("th", {}, [""])
      ])]),
      corps
    ])]));
  }

  // ---- Onglet : clubs ----
  function ongletClubs(conteneur, rafraichir) {
    var message = el("p", { class: "message-fichier", "aria-live": "polite" });

    function formulaire(club, estNouveau) {
      var b = Object.assign({ id: "", nom: "", abrev: "", site: "" }, club || {});
      function saisie(cle, attrs) {
        return el("input", Object.assign({ value: b[cle] || "", oninput: function (e) { b[cle] = e.target.value; } }, attrs || {}));
      }
      return el("tr", { class: "edition-club" }, [
        el("td", {}, [saisie("nom", { "aria-label": t("admin.clubNom"), maxlength: "80" })]),
        el("td", {}, [saisie("abrev", { "aria-label": t("admin.clubAbrev"), maxlength: "12" })]),
        el("td", {}, [saisie("site", { "aria-label": t("admin.clubSite"), type: "url", placeholder: "https://…" })]),
        el("td", {}, [estNouveau ? "" : String(Donnees.cartesDuClub(b.id).length)]),
        el("td", {}, [el("button", {
          type: "button", class: "bouton bouton-principal",
          onclick: function () {
            b.nom = b.nom.trim(); b.abrev = b.abrev.trim(); b.site = b.site.trim();
            if (!b.nom || !b.abrev) { message.textContent = t("admin.clubIncomplet"); return; }
            if (b.site && !/^https?:\/\//.test(b.site)) { message.textContent = t("admin.clubSiteInvalide"); return; }
            if (estNouveau) {
              b.id = b.abrev.toLowerCase().normalize("NFD").replace(/[^a-z0-9]/g, "") || "club";
              while (Donnees.club(b.id)) b.id += "x";
            }
            if (!Donnees.enregistrerClub(b)) { message.textContent = t("erreurs.stockage"); return; }
            enEdition = null;
            rafraichir();
          }
        }, [t("edition.enregistrer")])])
      ]);
    }

    var corps = el("tbody");
    Donnees.clubs().forEach(function (club) {
      if (enEdition === club.id) { corps.append(formulaire(club, false)); return; }
      corps.append(el("tr", {}, [
        el("td", {}, [club.nom]),
        el("td", {}, [club.abrev]),
        el("td", {}, [club.site ? el("a", { href: club.site, target: "_blank", rel: "noopener" }, [club.site.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")]) : "–"]),
        el("td", { class: "nombre" }, [String(Donnees.cartesDuClub(club.id).length)]),
        el("td", {}, [el("button", { type: "button", class: "bouton-lien", onclick: function () { enEdition = club.id; rafraichir(); } }, [t("admin.modifier")])])
      ]));
    });
    if (enEdition === "nouveau") corps.append(formulaire(null, true));

    conteneur.append(
      el("p", { class: "aide" }, [t("admin.clubsAide")]),
      el("div", { class: "panneau tableau-defilant" }, [
        el("table", { class: "tableau" }, [
          el("thead", {}, [el("tr", {}, [
            el("th", {}, [t("admin.clubNom")]), el("th", {}, [t("admin.clubAbrev")]),
            el("th", {}, [t("admin.clubSite")]), el("th", { class: "nombre" }, [t("admin.clubCartes")]), el("th", {}, [""])
          ])]),
          corps
        ]),
        message,
        enEdition === "nouveau" ? null : el("button", {
          type: "button", class: "bouton", onclick: function () { enEdition = "nouveau"; rafraichir(); }
        }, ["+ " + t("admin.ajouterClub")])
      ]),
      el("section", { class: "panneau avis-note" }, [
        el("h2", {}, [t("admin.profilsTitre")]),
        el("p", {}, [t("admin.profilsNote")])
      ])
    );
  }
  var enEdition = null;

  // ---- Onglet : paramètres ----
  function ongletParametres(conteneur, rafraichir) {
    var p = Regles.parametres();
    var message = el("p", { class: "message-fichier", "aria-live": "polite" });

    function caseACocher(cle, texte, aide) {
      return el("label", { class: "case" }, [
        el("input", { type: "checkbox", checked: p[cle], onchange: function (e) { p[cle] = e.target.checked; } }),
        el("span", {}, [el("strong", {}, [texte]), aide ? el("small", {}, [aide]) : null])
      ]);
    }

    function nombre(cle, texte) {
      return el("label", { class: "champ" }, [
        el("span", { class: "libelle" }, [texte]),
        el("input", { type: "number", min: "1", max: "100", value: p[cle],
          oninput: function (e) { p[cle] = Math.max(1, Math.min(100, Number(e.target.value) || 1)); } })
      ]);
    }

    // Tableau champs × statuts
    var statuts = Regles.ORDRE.filter(function (s) { return s !== "refusee"; });
    var corps = el("tbody");
    Regles.CHAMPS.forEach(function (champ) {
      corps.append(el("tr", {}, [el("th", { scope: "row" }, [t("champs." + champ)])].concat(statuts.map(function (s) {
        return el("td", { class: "centre" }, [el("input", {
          type: "checkbox", "aria-label": t("champs." + champ) + " – " + t("statuts." + s),
          checked: p.champsObligatoires[s].indexOf(champ) !== -1,
          onchange: function (e) {
            var liste = p.champsObligatoires[s].filter(function (k) { return k !== champ; });
            if (e.target.checked) liste.push(champ);
            p.champsObligatoires[s] = liste;
            // Une demande refusée suit les mêmes règles qu'une demande.
            if (s === "demande") p.champsObligatoires.refusee = liste.slice();
          }
        })]);
      }))));
    });

    conteneur.append(
      el("p", { class: "aide" }, [t("admin.parametresAide")]),
      el("section", { class: "panneau" }, [
        el("h2", {}, [t("admin.processus")]),
        caseACocher("validationObligatoire", t("admin.validationObligatoire"), t("admin.validationObligatoireAide")),
        caseACocher("demandesVisiblesVisiteurs", t("admin.demandesVisibles"), t("admin.demandesVisiblesAide"))
      ]),
      el("section", { class: "panneau" }, [
        el("h2", {}, [t("admin.champsObligatoires")]),
        el("p", { class: "aide" }, [t("admin.champsObligatoiresAide")]),
        el("div", { class: "tableau-defilant" }, [el("table", { class: "tableau tableau-parametres" }, [
          el("thead", {}, [el("tr", {}, [el("th", {}, [""])].concat(statuts.map(function (s) {
            return el("th", { class: "centre" }, [t("statuts." + s)]);
          })))]),
          corps
        ])])
      ]),
      el("section", { class: "panneau" }, [
        el("h2", {}, [t("admin.fichiers")]),
        el("div", { class: "grille-champs" }, [
          nombre("tailleMaxKmlMo", t("admin.tailleKml")),
          nombre("tailleMaxApercuMo", t("admin.tailleApercu"))
        ])
      ]),
      message,
      el("div", { class: "actions-formulaire" }, [
        el("button", {
          type: "button", class: "bouton bouton-principal",
          onclick: function () {
            message.textContent = Regles.enregistrerParametres(p) ? t("admin.parametresEnregistres") : t("erreurs.stockage");
          }
        }, [t("edition.enregistrer")]),
        el("button", {
          type: "button", class: "bouton",
          onclick: function () {
            if (!window.confirm(t("admin.confirmerDefaut"))) return;
            Regles.enregistrerParametres({});
            rafraichir();
          }
        }, [t("admin.parDefaut")])
      ])
    );
  }

  // ---- Page ----
  function afficher(contenu, onglet) {
    var retour = el("p", {}, [el("a", { href: "#/" }, ["← " + t("navigation.retourRegistre")])]);
    if (!Profils.peut("validerDemandes")) {
      contenu.append(retour, el("section", { class: "panneau" }, [el("h1", {}, [t("admin.nonAutorise")])]));
      return;
    }
    if (ONGLETS.indexOf(onglet) === -1) onglet = "demandes";
    var corps = el("div");

    // Après une action : on redessine toute la page (compteurs compris).
    function rafraichir() {
      quitter();
      contenu.innerHTML = "";
      afficher(contenu, onglet);
      document.dispatchEvent(new CustomEvent("entete-a-jour"));
    }

    var n = nombreDemandes();
    contenu.append(
      retour,
      el("h1", {}, [t("admin.titre")]),
      el("nav", { class: "onglets onglets-visibles onglets-admin" }, ONGLETS.map(function (o) {
        return el("a", { href: "#/admin/" + o, "aria-current": o === onglet ? "page" : null }, [
          t("admin.onglets." + o),
          o === "demandes" && n ? el("span", { class: "pastille" }, [String(n)]) : null,
          o === "imports" && nombreImports() ? el("span", { class: "pastille" }, [String(nombreImports())]) : null
        ]);
      })),
      corps
    );
    ({ demandes: ongletDemandes, imports: ongletImports, chevauchements: ongletChevauchements, clubs: ongletClubs, parametres: ongletParametres })[onglet](corps, rafraichir);
  }

  function quitter() {
    miniCartes.forEach(function (c) { c.remove(); });
    miniCartes = [];
  }

  return { afficher: afficher, quitter: quitter, nombreDemandes: nombreDemandes };
})();
