/*
 * Formulaire de création / modification d'une carte.
 *   #/nouvelle        nouvelle demande de réservation (ou nouvelle carte pour l'administrateur)
 *   #/modifier/c001   modification d'une fiche existante
 *
 * Les règles (champs obligatoires, statuts possibles…) viennent de js/regles.js.
 */
window.PageEdition = (function () {
  var el = UI.el, t = I18n.t;

  var ECHELLES_COURANTES = [1000, 2000, 4000, 5000, 7500, 10000, 15000];

  // Brouillon en cours : gardé si on change de langue pendant la saisie.
  var enCours = null;      // { cle, brouillon, original }
  var carteZone = null;    // carte interactive de l'éditeur de zone
  var groupe = null;       // contours en cours d'édition

  // ---- Préparation du brouillon ----
  function nouvelleCarte() {
    return {
      id: Donnees.nouvelId(),
      cadastre: null,
      nom: "", clubId: Profils.club() || Donnees.clubs()[0].id,
      commune: "", province: "", type: "",
      echelle: null, equidistance: null, anneeCreation: null, anneeMaj: null, cartographe: "",
      statut: Profils.peut("creerDirectement") ? "usage" : Regles.statutNouvelleDemande(),
      remplaceePar: null, motifRefus: null,
      description: { fr: "", nl: "" },
      periodesAcces: [],
      remarqueAcces: { fr: "", nl: "" },
      contact: { nom: "", email: "", telephone: "" },
      apercu: null,
      zone: null
    };
  }

  function copie(o) { return JSON.parse(JSON.stringify(o)); }

  // Statuts que le profil peut choisir pour ce brouillon ([] = statut imposé).
  function statutsPossibles(original) {
    if (Profils.peut("validerDemandes")) return Regles.ORDRE;
    if (!original || original.statut === "demande" || original.statut === "refusee") return [];
    return Regles.STATUTS_VALIDES;
  }

  // ---- Petits éléments de formulaire ----
  // Libellé avec une étoile si le champ est obligatoire pour le statut choisi.
  function libelle(champ, texte) {
    return el("span", { class: "libelle", "data-champ": champ }, [texte]);
  }

  function champ(cle, texte, controle, aide) {
    return el("label", { class: "champ" }, [libelle(cle, texte), controle, aide ? el("small", {}, [aide]) : null]);
  }

  function saisie(b, cle, attributs) {
    var a = Object.assign({
      value: b[cle] === null || b[cle] === undefined ? "" : b[cle],
      oninput: function (e) {
        var v = e.target.value;
        b[cle] = attributs && attributs.type === "number" ? (v === "" ? null : Number(v)) : v;
      }
    }, attributs || {});
    return el("input", a);
  }

  // Deux cases (FR et NL) pour un texte libre.
  function texteBilingue(objet, multiligne) {
    return el("div", { class: "bilingue" }, ["fr", "nl"].map(function (langue) {
      var attrs = {
        "aria-label": langue.toUpperCase(),
        oninput: function (e) { objet[langue] = e.target.value; }
      };
      var controle = multiligne
        ? el("textarea", Object.assign({ rows: "3" }, attrs), [objet[langue] || ""])
        : el("input", Object.assign({ value: objet[langue] || "" }, attrs));
      return el("label", { class: "champ-langue" }, [el("span", { class: "code-langue" }, [langue.toUpperCase()]), controle]);
    }));
  }

  function section(titre, enfants) {
    return el("section", { class: "panneau" }, [el("h2", {}, [titre])].concat(enfants));
  }

  // ---- Périodes d'accès ----
  function editeurPeriodes(b) {
    var conteneur = el("div", { class: "periodes-edition" });
    var jours = [];
    for (var j = 1; j <= 31; j++) jours.push([String(j).padStart(2, "0"), String(j)]);
    var mois = [];
    for (var m = 1; m <= 12; m++) {
      mois.push([String(m).padStart(2, "0"),
        new Date(2001, m - 1, 1).toLocaleDateString(I18n.langue() === "nl" ? "nl-BE" : "fr-BE", { month: "long" })]);
    }

    function choixDate(periode, cle) {
      var morceaux = periode[cle].split("-");
      function maj(index, valeur) {
        morceaux[index] = valeur;
        periode[cle] = morceaux.join("-");
      }
      return el("span", { class: "choix-date" }, [
        UI.menu({ "aria-label": t("edition.jour"), onchange: function (e) { maj(0, e.target.value); } }, jours, morceaux[0]),
        UI.menu({ "aria-label": t("edition.mois"), onchange: function (e) { maj(1, e.target.value); } }, mois, morceaux[1])
      ]);
    }

    function dessiner() {
      conteneur.innerHTML = "";
      if (!b.periodesAcces.length) conteneur.append(el("p", { class: "aide" }, [t("edition.aucunePeriode")]));
      b.periodesAcces.forEach(function (p, i) {
        conteneur.append(el("div", { class: "periode-ligne" }, [
          t("edition.du") + " ", choixDate(p, "du"),
          " " + t("edition.au") + " ", choixDate(p, "au"),
          el("button", {
            type: "button", class: "bouton-lien",
            onclick: function () { b.periodesAcces.splice(i, 1); dessiner(); }
          }, [t("edition.retirer")])
        ]));
      });
      conteneur.append(el("button", {
        type: "button", class: "bouton",
        onclick: function () { b.periodesAcces.push({ du: "01-04", au: "30-09" }); dessiner(); }
      }, ["+ " + t("edition.ajouterPeriode")]));
    }
    dessiner();
    return conteneur;
  }

  // ---- Zone : dessin sur la carte et import KML/KMZ ----
  function editeurZone(b, zoneMessages, zoneChevauchements) {
    var conteneur = el("div", { class: "carte-edition" });

    function versLatLng(anneau) {
      return anneau.map(function (p) { return [p[1], p[0]]; });
    }

    function brancher(calque) {
      calque.on("pm:edit pm:dragend", majZone);
    }

    function chargerZone(zone) {
      groupe.clearLayers();
      Zones.polygonesDe(zone).forEach(function (poly) {
        var calque = L.polygon(poly.map(versLatLng), UI.styleZone(b.statut));
        groupe.addLayer(calque);
        brancher(calque);
      });
      if (groupe.getLayers().length) carteZone.fitBounds(groupe.getBounds(), { padding: [30, 30], maxZoom: 16 });
      // Carte importée sans zone mais avec un point provisoire : on s'y place.
      else if (b.point) carteZone.setView([b.point.coordinates[1], b.point.coordinates[0]], 14);
    }

    function majZone() {
      var polygones = [];
      groupe.getLayers().forEach(function (calque) {
        var g = calque.toGeoJSON().geometry;
        if (g.type === "Polygon") polygones.push(g.coordinates);
        else if (g.type === "MultiPolygon") polygones = polygones.concat(g.coordinates);
      });
      b.zone = Zones.depuisPolygones(polygones);
      afficherChevauchements();
    }

    function afficherChevauchements() {
      zoneChevauchements.innerHTML = "";
      var liste = Zones.chevauchements(b.zone, b.id, b.clubId).filter(function (x) {
        return Regles.carteVisible(x.carte);
      });
      if (!liste.length) return;
      zoneChevauchements.append(el("div", { class: "avis avis-chevauchement" }, [
        el("strong", {}, ["⚠ " + t("edition.chevauchementTitre")]),
        el("ul", {}, liste.map(function (x) {
          return el("li", {}, [
            el("a", { href: "#/carte/" + x.carte.id, target: "_blank" }, [x.carte.nom]),
            " – " + Donnees.club(x.carte.clubId).nom + " – " +
              t("edition.surface", { ha: (x.surface / 10000).toLocaleString(I18n.langue() === "nl" ? "nl-BE" : "fr-BE", { maximumFractionDigits: 1 }) }) +
              (x.autreClub ? " – " + t("edition.autreClub") : "")
          ]);
        })),
        el("p", {}, [t("edition.chevauchementExplication")])
      ]));
    }

    var importKml = el("input", {
      type: "file", accept: ".kml,.kmz",
      onchange: function (e) {
        var fichier = e.target.files[0];
        e.target.value = "";
        if (!fichier) return;
        zoneMessages.textContent = "";
        if (fichier.size > Regles.parametres().tailleMaxKmlMo * 1024 * 1024) {
          zoneMessages.textContent = t("erreurs.kmlTropLourd", { mo: Regles.parametres().tailleMaxKmlMo });
          return;
        }
        Zones.depuisFichier(fichier).then(function (zone) {
          chargerZone(zone);
          majZone();
          zoneMessages.textContent = t("edition.zoneImportee", { n: Zones.polygonesDe(zone).length });
        }).catch(function (err) {
          zoneMessages.textContent = t("erreurs." + (err.message in I18n.textes().erreurs ? err.message : "kmlIllisible"));
        });
      }
    });

    var bloc = el("div", {}, [
      el("p", { class: "aide" }, [t("edition.zoneAide")]),
      el("label", { class: "champ fichier" }, [libelle("zone", t("edition.importerKml")), importKml]),
      conteneur
    ]);

    // La carte ne peut être créée qu'une fois l'élément affiché dans la page.
    bloc.demarrer = function () {
      carteZone = L.map(conteneur).setView([50.45, 4.9], 8);
      Fonds.ajouter(carteZone);
      // Les autres cartes, en gris, pour se repérer (non modifiables).
      Donnees.cartes().forEach(function (c) {
        if (c.id === b.id || c.statut === "refusee" || !c.zone || !Regles.carteVisible(c)) return;
        L.geoJSON(c.zone, {
          pmIgnore: true,
          style: { color: "#7d8b87", weight: 1, fillOpacity: 0.08, dashArray: "3 3" }
        }).bindTooltip(c.nom + " – " + Donnees.club(c.clubId).nom).addTo(carteZone);
      });
      groupe = L.featureGroup().addTo(carteZone);
      chargerZone(b.zone);

      carteZone.pm.setLang(I18n.langue());
      carteZone.pm.setGlobalOptions({ templineStyle: { color: "#e27639" }, hintlineStyle: { color: "#e27639", dashArray: "5 5" }, pathOptions: UI.styleZone(b.statut) });
      carteZone.pm.addControls({
        position: "topleft",
        drawMarker: false, drawCircleMarker: false, drawPolyline: false,
        drawCircle: false, drawText: false, cutPolygon: false, rotateMode: false,
        drawRectangle: true, drawPolygon: true, editMode: true, dragMode: true, removalMode: true
      });
      carteZone.on("pm:create", function (e) {
        groupe.addLayer(e.layer);
        brancher(e.layer);
        majZone();
      });
      carteZone.on("pm:remove", function (e) {
        groupe.removeLayer(e.layer);
        majZone();
      });
      afficherChevauchements();
    };
    return bloc;
  }

  // ---- Aperçu ----
  function editeurApercu(b) {
    var message = el("p", { class: "message-fichier", "aria-live": "polite" });
    var vue = el("div", { class: "apercu-edition" });

    function dessiner() {
      vue.innerHTML = "";
      if (b.apercu) {
        vue.append(
          el("img", { class: "apercu", src: b.apercu, alt: t("fiche.apercu") }),
          el("button", {
            type: "button", class: "bouton-lien",
            onclick: function () { b.apercu = null; dessiner(); }
          }, [t("edition.retirerApercu")])
        );
      }
    }

    var entree = el("input", {
      type: "file", accept: ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png",
      onchange: function (e) {
        var fichier = e.target.files[0];
        e.target.value = "";
        if (!fichier) return;
        message.textContent = t("edition.traitement");
        Apercu.depuisFichier(fichier, Donnees.club(b.clubId).nom).then(function (image) {
          b.apercu = image;
          message.textContent = t("edition.apercuPret");
          dessiner();
        }).catch(function (err) {
          message.textContent = t("erreurs." + (err.message in I18n.textes().erreurs ? err.message : "apercuIllisible"),
            { mo: Regles.parametres().tailleMaxApercuMo });
        });
      }
    });
    dessiner();
    return [
      el("p", { class: "aide" }, [t("edition.apercuAide", { mo: Regles.parametres().tailleMaxApercuMo })]),
      el("label", { class: "champ fichier" }, [libelle("apercu", t("edition.choisirApercu")), entree]),
      message,
      vue
    ];
  }

  // ---- Vérification avant enregistrement ----
  function verifier(c) {
    // Le numéro de cadastre est saisi par l'administrateur : on ne l'exige
    // pas d'un responsable de club, qui ne peut pas le remplir.
    var manquants = Regles.champsManquants(c).filter(function (champ) {
      return champ !== "cadastre" || Profils.peut("creerDirectement");
    });
    var erreurs = manquants.map(function (champ) {
      return t("erreurs.champObligatoire", { champ: t("champs." + champ) });
    });
    if (c.cadastre !== null && c.cadastre !== "" && Donnees.cadastreUtilise(c.cadastre, c.id)) {
      erreurs.push(t("erreurs.cadastreUtilise", { n: c.cadastre }));
    }
    c.periodesAcces.forEach(function (p) {
      [p.du, p.au].forEach(function (jjmm) {
        var m = jjmm.split("-").map(Number);
        var d = new Date(2000, m[1] - 1, m[0]); // 2000 : année bissextile, le 29 février existe
        if (d.getMonth() !== m[1] - 1) erreurs.push(t("erreurs.dateImpossible", { date: m[0] + "/" + m[1] }));
      });
    });
    if (c.contact.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.contact.email)) {
      erreurs.push(t("erreurs.email"));
    }
    return erreurs;
  }

  // Nettoyage des valeurs saisies avant enregistrement.
  function nettoyer(c) {
    ["nom", "commune", "cartographe"].forEach(function (k) { c[k] = (c[k] || "").trim(); });
    c.cadastre = c.cadastre === null ? null : String(c.cadastre).trim() || null;
    if (c.cadastre && /^\d+$/.test(c.cadastre)) c.cadastre = Number(c.cadastre);
    ["nom", "email", "telephone"].forEach(function (k) { c.contact[k] = (c.contact[k] || "").trim(); });
    if (c.statut !== "ancienne") c.remplaceePar = null;
    if (c.statut !== "refusee") c.motifRefus = null;
    if (c.zone) c.point = null; // le point provisoire ne sert plus
    return c;
  }

  // ---- Page ----
  function afficher(contenu, id) {
    var cle = id || "nouvelle";
    var original = id ? Donnees.carte(id) : null;
    var autorise = id
      ? original && Regles.carteVisible(original) && Profils.peutSurCarte("modifierFiche", original)
      : Profils.peut("demanderReservation");
    var retour = el("p", {}, [el("a", { href: id ? "#/carte/" + id : "#/" }, ["← " + t(id ? "edition.retourFiche" : "navigation.retourRegistre")])]);
    if (!autorise) {
      contenu.append(retour, el("section", { class: "panneau" }, [el("h1", {}, [t("edition.nonAutorise")])]));
      return;
    }
    if (!enCours || enCours.cle !== cle || enCours.profil !== Profils.actuel()) {
      enCours = { cle: cle, profil: Profils.actuel(), original: original ? copie(original) : null, brouillon: original ? copie(original) : nouvelleCarte() };
    }
    var b = enCours.brouillon;
    var statuts = statutsPossibles(enCours.original);
    var estAdmin = Profils.peut("creerDirectement");

    var titre = !id
      ? t(estAdmin ? "edition.titreNouvelleCarte" : "edition.titreNouvelleDemande")
      : b.statut === "refusee" && !estAdmin ? t("edition.titreRenvoyer") : t("edition.titreModifier", { nom: original.nom });

    var erreursHaut = el("div", { "aria-live": "assertive" });
    var zoneMessages = el("p", { class: "message-fichier", "aria-live": "polite" });
    var zoneChevauchements = el("div");

    // Met à jour les étoiles « obligatoire » selon le statut choisi.
    function majObligatoires() {
      var obligatoires = Regles.champsObligatoires(b.statut);
      contenu.querySelectorAll("[data-champ]").forEach(function (span) {
        span.classList.toggle("obligatoire", obligatoires.indexOf(span.getAttribute("data-champ")) !== -1);
      });
      var remplace = contenu.querySelector(".champ-remplacee");
      if (remplace) remplace.hidden = b.statut !== "ancienne";
    }

    // -- Identité --
    var champStatut = statuts.length
      ? champ("statut", t("champs.statut"), UI.menu({
          onchange: function (e) { b.statut = e.target.value; majObligatoires(); }
        }, statuts.map(function (s) { return [s, t("statuts." + s)]; }), b.statut))
      : el("div", { class: "champ" }, [el("span", { class: "libelle" }, [t("champs.statut")]), el("div", {}, [
          UI.badgeStatut(enCours.original && enCours.original.statut === "refusee" ? "demande" : b.statut),
          b.statut === "demande" || (enCours.original && enCours.original.statut === "refusee")
            ? el("small", {}, [" " + t("edition.statutDemandeAide")]) : null
        ])]);

    var champCadastre = estAdmin
      ? champ("cadastre", t("champs.cadastre"), saisie(b, "cadastre", { inputmode: "numeric" }), t("edition.cadastreAide"))
      : el("div", { class: "champ" }, [libelle("cadastre", t("champs.cadastre")),
          el("div", {}, [b.cadastre ? String(b.cadastre) : t("edition.cadastreAttribue")])]);

    var autresCartes = Donnees.cartes().filter(function (c) {
      return c.id !== b.id && Regles.STATUTS[c.statut].avecCadastre;
    });

    var identite = section(t("edition.identite"), [
      enCours.original && enCours.original.statut === "refusee" && I18n.local(enCours.original.motifRefus)
        ? el("div", { class: "avis avis-refus" }, [el("strong", {}, [t("fiche.demandeRefusee")]),
            el("p", {}, [I18n.local(enCours.original.motifRefus).texte])])
        : null,
      el("div", { class: "grille-champs" }, [
        champ("nom", t("champs.nom"), saisie(b, "nom", { maxlength: "120" })),
        estAdmin
          ? champ("club", t("champs.club"), UI.menu({ onchange: function (e) { b.clubId = e.target.value; } },
              Donnees.clubs().map(function (c) { return [c.id, c.nom]; }), b.clubId))
          : el("div", { class: "champ" }, [el("span", { class: "libelle" }, [t("champs.club")]), el("div", {}, [Donnees.club(b.clubId).nom])]),
        champ("commune", t("champs.commune"), saisie(b, "commune", { maxlength: "80" })),
        champ("province", t("champs.province"), UI.menu({ onchange: function (e) { b.province = e.target.value; } },
          [["", "–"]].concat(PageRegistre.PROVINCES.map(function (p) { return [p, t("provinces." + p)]; })), b.province)),
        champ("type", t("champs.type"), UI.menu({ onchange: function (e) { b.type = e.target.value; } },
          [["", "–"]].concat(PageRegistre.TYPES.map(function (p) { return [p, t("types." + p)]; })), b.type)),
        champStatut,
        champCadastre,
        el("label", { class: "champ champ-remplacee" }, [
          el("span", { class: "libelle" }, [t("champs.remplaceePar")]),
          UI.menu({ onchange: function (e) { b.remplaceePar = e.target.value || null; } },
            [["", "–"]].concat(autresCartes.map(function (c) { return [c.id, c.nom + " (" + Donnees.club(c.clubId).nom + ")"]; })),
            b.remplaceePar || "")
        ])
      ])
    ]);

    // -- Zone --
    var zone = editeurZone(b, zoneMessages, zoneChevauchements);
    var sectionZone = section(t("edition.zone"), [zone, zoneMessages, zoneChevauchements]);

    // -- Informations de la carte --
    var datalist = el("datalist", { id: "echelles-courantes" }, ECHELLES_COURANTES.map(function (e) {
      return el("option", { value: String(e) });
    }));
    var infos = section(t("edition.informations"), [
      el("div", { class: "grille-champs" }, [
        champ("echelle", t("champs.echelle"), saisie(b, "echelle", { type: "number", min: "500", step: "500", list: "echelles-courantes" }), t("edition.echelleAide")),
        champ("equidistance", t("champs.equidistance"), saisie(b, "equidistance", { type: "number", min: "0.5", step: "0.5" })),
        champ("anneeCreation", t("champs.anneeCreation"), saisie(b, "anneeCreation", { type: "number", min: "1950", max: "2100" })),
        champ("anneeMaj", t("champs.anneeMaj"), saisie(b, "anneeMaj", { type: "number", min: "1950", max: "2100" })),
        champ("cartographe", t("champs.cartographe"), saisie(b, "cartographe", { maxlength: "80" }))
      ]),
      datalist,
      el("div", { class: "champ" }, [libelle("description", t("champs.description")), texteBilingue(b.description, true)])
    ]);

    // -- Accès et contact --
    if (!b.remarqueAcces) b.remarqueAcces = { fr: "", nl: "" };
    var acces = section(t("fiche.acces"), [
      el("div", { class: "champ" }, [libelle("periodesAcces", t("champs.periodesAcces")), editeurPeriodes(b)]),
      el("div", { class: "champ" }, [el("span", { class: "libelle" }, [t("champs.remarqueAcces")]), texteBilingue(b.remarqueAcces, false)])
    ]);
    var contact = section(t("fiche.contact"), [
      el("div", { class: "grille-champs" }, [
        champ("contact", t("fiche.contactNom"), saisie(b.contact, "nom", { maxlength: "80" })),
        champ("contactEmail", t("fiche.contactEmail"), saisie(b.contact, "email", { type: "email", maxlength: "120" })),
        champ("contactTelephone", t("fiche.contactTelephone"), saisie(b.contact, "telephone", { type: "tel", maxlength: "30" }))
      ])
    ]);

    // -- Aperçu --
    var apercu = section(t("fiche.apercu"), editeurApercu(b));

    // -- Boutons --
    function afficherErreurs(erreurs) {
      erreursHaut.innerHTML = "";
      if (!erreurs.length) return;
      erreursHaut.append(el("div", { class: "avis avis-erreur" }, [
        el("strong", {}, [t("erreurs.titre")]),
        el("ul", {}, erreurs.map(function (e) { return el("li", {}, [e]); }))
      ]));
      erreursHaut.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function enregistrer() {
      var c = nettoyer(copie(b));
      // Une demande refusée corrigée par le club repart en demande.
      if (!estAdmin && enCours.original && enCours.original.statut === "refusee") c.statut = "demande";
      var erreurs = verifier(c);
      if (erreurs.length) { afficherErreurs(erreurs); return; }
      if (!Donnees.enregistrerCarte(c)) { afficherErreurs([t("erreurs.stockage")]); return; }
      enCours = null;
      location.hash = "#/carte/" + c.id;
    }

    var libelleEnregistrer = !id && !estAdmin && b.statut === "demande" ? "edition.envoyerDemande"
      : enCours.original && enCours.original.statut === "refusee" && !estAdmin ? "edition.renvoyerDemande"
      : "edition.enregistrer";

    var actions = el("div", { class: "actions-formulaire" }, [
      el("button", { type: "button", class: "bouton bouton-principal", onclick: enregistrer }, [t(libelleEnregistrer)]),
      el("button", {
        type: "button", class: "bouton",
        onclick: function () { enCours = null; location.hash = id ? "#/carte/" + id : "#/"; }
      }, [t("edition.annuler")]),
      id && Profils.peut("supprimerFiche")
        ? el("button", {
            type: "button", class: "bouton bouton-danger",
            onclick: function () {
              if (!window.confirm(t("edition.confirmerSuppression", { nom: original.nom }))) return;
              if (!Donnees.supprimerCarte(id)) { afficherErreurs([t("erreurs.stockage")]); return; }
              enCours = null;
              location.hash = "#/";
            }
          }, [t("edition.supprimer")])
        : null
    ]);

    contenu.append(
      retour,
      el("h1", {}, [titre]),
      el("p", { class: "aide" }, [t("edition.legendeObligatoire")]),
      erreursHaut,
      identite,
      sectionZone,
      infos,
      acces,
      contact,
      apercu,
      actions
    );
    majObligatoires();
    zone.demarrer();
  }

  return {
    afficher: afficher,
    quitter: function () {
      if (carteZone) { carteZone.remove(); carteZone = null; groupe = null; }
    }
  };
})();
