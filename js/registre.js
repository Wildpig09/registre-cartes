/*
 * Page principale : carte interactive + liste des cartes + filtres.
 * La carte et la liste montrent toujours les mêmes cartes (celles qui
 * passent les filtres) et se répondent : cliquer d'un côté met en
 * évidence de l'autre.
 */
window.PageRegistre = (function () {
  var el = UI.el, t = I18n.t;

  var TYPES = ["foret", "sprint", "parc", "ecole"];
  var PROVINCES = ["BRU", "BW", "HAI", "NAM", "LIE", "LUX"];
  var DEPUIS = [2025, 2020, 2015, 2010];
  // Sous ce niveau de zoom, les zones sont trop petites : on montre des points.
  var ZOOM_ZONES = 11;

  // Filtres en cours : gardés en mémoire quand on change de langue ou de profil.
  // du / au : plage de dates (AAAA-MM-JJ), réservée aux membres de club et au-delà.
  var filtres = { texte: "", club: "", type: "", statut: "", province: "", echelle: "", depuis: "", du: "", au: "" };
  var inconnues = {};   // id -> true : cartes affichées à part (période inconnue)
  var ongletMobile = "carte";

  var carteLeaflet = null;
  var calques = {};     // id de carte -> { zone, point }
  var lignes = {};      // id de carte -> ligne <tr> de la liste
  var selection = null; // id de la carte mise en évidence

  // ---- Filtrage ----
  function passeLesFiltres(c) {
    if (!Regles.carteVisible(c)) return false;
    if (filtres.club && c.clubId !== filtres.club) return false;
    if (filtres.type && c.type !== filtres.type) return false;
    if (filtres.statut && c.statut !== filtres.statut) return false;
    if (filtres.province && c.province !== filtres.province) return false;
    if (filtres.echelle && String(c.echelle) !== filtres.echelle) return false;
    if (filtres.depuis && !(c.anneeMaj >= Number(filtres.depuis))) return false;
    if (filtres.texte) {
      var cherche = normaliser(filtres.texte);
      var dans = normaliser([c.nom, c.commune, c.cadastre, Donnees.club(c.clubId).nom].join(" "));
      if (dans.indexOf(cherche) === -1) return false;
    }
    return true;
  }

  // Plage de dates choisie, ou null si le filtre n'est pas actif (ou pas permis).
  // Une seule date remplie = un seul jour.
  function plageDates() {
    if (!Profils.peut("voirPeriodesAcces")) return null;
    var du = filtres.du || filtres.au, au = filtres.au || filtres.du;
    if (!du) return null;
    var debut = new Date(du + "T00:00:00"), fin = new Date(au + "T00:00:00");
    if (isNaN(debut) || isNaN(fin)) return null;
    return debut <= fin ? { debut: debut, fin: fin } : { debut: fin, fin: debut };
  }

  // Minuscules et sans accents, pour que « foret » trouve « Forêt ».
  function normaliser(texte) {
    return String(texte).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  var echelleTexte = UI.echelle;
  var badgeStatut = UI.badgeStatut;

  // ---- Filtres (barre du haut) ----
  function barreFiltres(surChangement) {
    function choix(cle, options) {
      return el("label", { class: "filtre" }, [
        el("span", {}, [t("filtres." + cle)]),
        UI.menu({ onchange: function (e) { filtres[cle] = e.target.value; surChangement(); } },
          [["", t("filtres.tous")]].concat(options), filtres[cle])
      ]);
    }
    var echelles = Donnees.cartes()
      .map(function (c) { return c.echelle; })
      .filter(function (e, i, tab) { return e && tab.indexOf(e) === i; })
      .sort(function (a, b) { return a - b; });

    var recherche = el("input", {
      type: "search",
      value: filtres.texte,
      placeholder: t("filtres.recherchePlaceholder"),
      "aria-label": t("filtres.recherche"),
      oninput: function (e) { filtres.texte = e.target.value; surChangement(); }
    });

    function date(cle) {
      return el("label", { class: "filtre" }, [
        el("span", {}, [t("filtres." + cle)]),
        el("input", {
          type: "date", value: filtres[cle],
          onchange: function (e) { filtres[cle] = e.target.value; surChangement(); }
        })
      ]);
    }
    var filtreDates = Profils.peut("voirPeriodesAcces")
      ? el("fieldset", { class: "filtre-dates" }, [
          el("legend", {}, [t("filtres.accessible")]),
          date("du"),
          date("au")
        ])
      : null;

    return el("div", { class: "filtres" }, [
      el("label", { class: "filtre filtre-recherche" }, [el("span", {}, [t("filtres.recherche")]), recherche]),
      filtreDates,
      choix("club", Donnees.clubs().map(function (c) { return [c.id, c.nom]; })),
      choix("type", TYPES.map(function (v) { return [v, t("types." + v)]; })),
      // Seulement les statuts dont le profil peut voir au moins une carte.
      choix("statut", Regles.ORDRE.filter(function (s) {
        return Donnees.cartes().some(function (c) { return c.statut === s && Regles.carteVisible(c); });
      }).map(function (v) { return [v, t("statuts." + v)]; })),
      choix("province", PROVINCES.map(function (v) { return [v, t("provinces." + v)]; })),
      choix("echelle", echelles.map(function (v) { return [String(v), echelleTexte(v)]; })),
      choix("depuis", DEPUIS.map(function (v) { return [String(v), t("filtres.depuisAnnee", { annee: v })]; })),
      el("button", {
        type: "button", class: "bouton-lien",
        onclick: function () {
          Object.keys(filtres).forEach(function (k) { filtres[k] = ""; });
          afficherDans(document.getElementById("contenu"));
        }
      }, [t("filtres.effacer")])
    ]);
  }

  // ---- Carte interactive ----
  function styleZone(c, enEvidence) {
    var style = UI.styleZone(c.statut, enEvidence);
    // Période inconnue pendant un filtre par dates : gris clair, pointillés.
    if (inconnues[c.id]) {
      style.fillColor = "#a9b3b0";
      if (!enEvidence) style.color = "#a9b3b0";
      style.dashArray = "6 4";
    }
    return style;
  }

  function creerCarte(conteneur) {
    if (carteLeaflet) { carteLeaflet.remove(); carteLeaflet = null; }
    carteLeaflet = L.map(conteneur, { zoomSnap: 0.5 }).setView([50.45, 4.9], 8);
    Fonds.ajouter(carteLeaflet);
    carteLeaflet.on("zoomend", majZonesOuPoints);
  }

  function dessinerCartes(cartes) {
    Object.keys(calques).forEach(function (id) {
      if (calques[id].zone) calques[id].zone.remove();
      calques[id].point.remove();
    });
    calques = {};
    cartes.forEach(function (c) {
      // Carte importée sans zone ni coordonnées : seulement dans la liste.
      if (!c.zone && !c.point) return;
      var zone = c.zone ? L.geoJSON(c.zone, { style: styleZone(c, c.id === selection) }) : null;
      var point;
      if (zone) {
        point = L.circleMarker(zone.getBounds().getCenter(), {
          radius: 7, weight: 2, color: "#fff",
          fillColor: styleZone(c).fillColor, fillOpacity: 1
        });
      } else {
        // Point provisoire (zone à compléter) : cercle creux en pointillés.
        point = L.circleMarker([c.point.coordinates[1], c.point.coordinates[0]], {
          radius: 8, weight: 3, color: styleZone(c).fillColor, dashArray: "3 3",
          fillColor: "#fff", fillOpacity: 0.8
        });
      }
      [zone, point].forEach(function (calque) {
        if (!calque) return;
        calque.bindTooltip(c.nom + " – " + Donnees.club(c.clubId).nom + (zone ? "" : " – " + t("liste.zoneACompleter")));
        calque.on("click", function () { selectionner(c.id, "carte"); });
      });
      calques[c.id] = { zone: zone, point: point, carte: c };
    });
    majZonesOuPoints();
  }

  // Emprise d'une carte sur la carte interactive (zone, ou point provisoire).
  function limitesDe(calque) {
    return calque.zone ? calque.zone.getBounds() : L.latLngBounds([calque.point.getLatLng()]);
  }

  function majZonesOuPoints() {
    if (!carteLeaflet) return;
    var zonesVisibles = carteLeaflet.getZoom() >= ZOOM_ZONES;
    Object.keys(calques).forEach(function (id) {
      var c = calques[id];
      if (!c.zone) { c.point.addTo(carteLeaflet); return; }
      if (zonesVisibles) { c.point.remove(); c.zone.addTo(carteLeaflet); }
      else { c.zone.remove(); c.point.addTo(carteLeaflet); }
    });
  }

  function cadrer(cartes) {
    var limites = L.latLngBounds([]);
    cartes.forEach(function (c) { if (calques[c.id]) limites.extend(limitesDe(calques[c.id])); });
    if (limites.isValid()) carteLeaflet.fitBounds(limites, { padding: [20, 20], maxZoom: 14 });
  }

  // ---- Liste ----
  // Périodes d'accès d'une carte, en version courte pour la liste.
  function celluleAcces(c) {
    if (Acces.estInconnue(c)) return el("span", { class: "periode-inconnue" }, [t("acces.inconnueCourt")]);
    return el("span", {}, c.periodesAcces.map(function (p, i) {
      return el("span", { class: "periode-courte" }, [(i ? ", " : "") + Acces.formaterCourt(p)]);
    }));
  }

  function tableau(cartes) {
    var avecAcces = Profils.peut("voirPeriodesAcces");
    var corps = el("tbody");
    cartes.forEach(function (c) {
      var ligne = el("tr", {
        tabindex: "0",
        class: c.id === selection ? "selection" : null,
        onclick: function () { selectionner(c.id, "liste"); },
        onkeydown: function (e) { if (e.key === "Enter") selectionner(c.id, "liste"); }
      }, [
        el("td", {}, [
          el("a", { href: "#/carte/" + c.id, class: "nom-carte", onclick: function (e) { e.stopPropagation(); } }, [c.nom]),
          el("div", { class: "secondaire" }, [c.commune + (c.cadastre ? " · n° " + c.cadastre : "")]),
          !c.zone ? el("span", { class: "badge badge-a-completer" }, [t("liste.zoneACompleter")]) : null
        ]),
        el("td", {}, [Donnees.club(c.clubId).nom]),
        el("td", { class: "col-type" }, [t("types." + c.type)]),
        el("td", { class: "nombre" }, [echelleTexte(c.echelle)]),
        avecAcces ? el("td", { class: "col-acces" }, [celluleAcces(c)]) : null,
        el("td", { class: "nombre col-maj" }, [c.anneeMaj ? String(c.anneeMaj) : "–"]),
        el("td", {}, [badgeStatut(c.statut)])
      ]);
      lignes[c.id] = ligne;
      corps.append(ligne);
    });
    return el("table", { class: "tableau tableau-cartes" + (avecAcces ? " avec-acces" : "") }, [
      el("thead", {}, [el("tr", {}, [
        el("th", {}, [t("liste.nom")]),
        el("th", {}, [t("liste.club")]),
        el("th", { class: "col-type" }, [t("liste.type")]),
        el("th", { class: "nombre" }, [t("liste.echelle")]),
        avecAcces ? el("th", { class: "col-acces" }, [t("liste.acces")]) : null,
        el("th", { class: "nombre col-maj" }, [t("liste.maj")]),
        el("th", {}, [t("liste.statut")])
      ])]),
      corps
    ]);
  }

  // cartesInconnues : cartes à période inconnue, montrées à part pendant
  // un filtre par dates (sinon liste vide).
  function liste(cartes, cartesInconnues) {
    lignes = {};
    var blocs = [];
    blocs.push(cartes.length ? tableau(cartes) : el("p", { class: "vide" }, [t("liste.aucune")]));
    if (cartesInconnues.length) {
      blocs.push(
        el("div", { class: "section-inconnues" }, [
          el("h3", {}, [t("liste.inconnuesTitre", { n: cartesInconnues.length })]),
          el("p", {}, [t("liste.inconnuesExplication")])
        ]),
        tableau(cartesInconnues)
      );
    }
    return el("div", {}, blocs);
  }

  // ---- Lien entre carte et liste ----
  function selectionner(id, depuis) {
    var ancienne = selection;
    selection = id;
    [ancienne, id].forEach(function (cle) {
      if (cle && calques[cle] && calques[cle].zone) calques[cle].zone.setStyle(styleZone(calques[cle].carte, cle === selection));
      if (cle && lignes[cle]) lignes[cle].classList.toggle("selection", cle === selection);
    });
    var calque = calques[id];
    if (!calque) return;
    if (depuis === "liste") {
      if (window.matchMedia("(max-width: 900px)").matches) changerOnglet("carte");
      carteLeaflet.fitBounds(limitesDe(calque), { padding: [40, 40], maxZoom: 15 });
    } else if (lignes[id]) {
      lignes[id].scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
    var c = calque.carte;
    L.popup()
      .setLatLng(limitesDe(calque).getCenter())
      .setContent(contenuBulle(c))
      .openOn(carteLeaflet);
  }

  function contenuBulle(c) {
    return el("div", { class: "bulle" }, [
      el("strong", {}, [c.nom]),
      el("div", {}, [Donnees.club(c.clubId).nom + " · " + t("types." + c.type) + " · " + echelleTexte(c.echelle)]),
      el("div", {}, [badgeStatut(c.statut)]),
      Profils.peut("voirPeriodesAcces") ? el("div", {}, [t("liste.acces") + " : ", celluleAcces(c)]) : null,
      el("a", { href: "#/carte/" + c.id }, [t("liste.voirFiche")])
    ]);
  }

  // ---- Onglets (petit écran) ----
  function changerOnglet(onglet) {
    ongletMobile = onglet;
    var page = document.querySelector(".registre");
    if (!page) return;
    page.setAttribute("data-onglet", onglet);
    page.querySelectorAll("[data-vers]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-vers") === onglet ? "true" : "false");
    });
    if (onglet === "carte" && carteLeaflet) carteLeaflet.invalidateSize();
  }

  // ---- Assemblage de la page ----
  function afficherDans(contenu) {
    contenu.innerHTML = "";
    contenu.className = "contenu contenu-large";

    var zoneCarte = el("div", { class: "registre-carte", id: "carte-interactive" });
    var zoneListe = el("div", { class: "registre-liste" });
    var compteur = el("p", { class: "compteur", "aria-live": "polite" });

    function rafraichir(recadrer) {
      var cartes = Donnees.cartes().filter(passeLesFiltres);
      var aPart = [];
      inconnues = {};
      var plage = plageDates();
      if (plage) {
        // Filtre par dates : on garde les cartes accessibles au moins un jour ;
        // celles à période inconnue sont montrées à part.
        aPart = cartes.filter(Acces.estInconnue);
        aPart.forEach(function (c) { inconnues[c.id] = true; });
        cartes = cartes.filter(function (c) {
          return !Acces.estInconnue(c) && Acces.accessibleDansPlage(c, plage.debut, plage.fin);
        });
      }
      var toutes = cartes.concat(aPart);
      if (selection && !toutes.some(function (c) { return c.id === selection; })) selection = null;
      compteur.textContent = t("liste.compteur", { n: cartes.length }) +
        (aPart.length ? " " + t("liste.compteurInconnues", { n: aPart.length }) : "");
      zoneListe.innerHTML = "";
      zoneListe.append(liste(cartes, aPart));
      dessinerCartes(toutes);
      if (recadrer) cadrer(toutes);
    }

    var page = el("div", { class: "registre", "data-onglet": ongletMobile }, [
      barreFiltres(function () { rafraichir(true); }),
      el("div", { class: "registre-entete" }, [
        compteur,
        Profils.peut("importer")
          ? el("a", { class: "bouton bouton-import", href: "#/import" }, ["⬆ " + t("import.bouton")])
          : null,
        Profils.peut("demanderReservation")
          ? el("a", { class: "bouton bouton-principal", href: "#/nouvelle" }, [
              "+ " + t(Profils.peut("creerDirectement") ? "edition.nouvelleCarte" : "edition.nouvelleDemande")
            ])
          : null,
        el("div", { class: "onglets", role: "group" }, [
          el("button", { type: "button", "data-vers": "carte", onclick: function () { changerOnglet("carte"); } }, [t("liste.ongletCarte")]),
          el("button", { type: "button", "data-vers": "liste", onclick: function () { changerOnglet("liste"); } }, [t("liste.ongletListe")])
        ])
      ]),
      el("div", { class: "registre-corps" }, [zoneCarte, zoneListe])
    ]);
    contenu.append(page);
    changerOnglet(ongletMobile);

    creerCarte(zoneCarte);
    rafraichir(true);
  }

  return {
    TYPES: TYPES,
    PROVINCES: PROVINCES,
    afficher: afficherDans,
    // Appelé quand on quitte la page : libère la carte interactive.
    quitter: function () {
      if (carteLeaflet) { carteLeaflet.remove(); carteLeaflet = null; }
    }
  };
})();
