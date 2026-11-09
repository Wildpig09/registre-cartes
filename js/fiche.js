/*
 * Fiche détaillée d'une carte (adresse #/carte/<id>).
 * Ce que l'on voit dépend du profil : la personne de contact et les
 * périodes d'accès sont réservées aux membres de club et au-delà.
 */
window.PageFiche = (function () {
  var el = UI.el, t = I18n.t;
  var miniCarte = null;

  // Ligne « libellé : valeur » du tableau d'informations.
  function info(libelle, valeur) {
    if (valeur === null || valeur === undefined || valeur === "") valeur = "–";
    return el("div", { class: "info" }, [
      el("dt", {}, [libelle]),
      el("dd", {}, [valeur])
    ]);
  }

  // Texte libre FR/NL, avec mention de la langue s'il n'existe que dans l'autre.
  function texteLibre(textes) {
    var r = I18n.local(textes);
    if (!r) return null;
    return el("p", {}, [
      r.texte,
      r.autreLangue ? el("span", { class: "autre-langue" }, [" (" + t("fiche.texteEn." + r.autreLangue) + ")"]) : null
    ]);
  }

  // Encadré affiché à la place d'une information réservée aux membres.
  function reserve() {
    return el("p", { class: "reserve" }, ["🔒 " + t("fiche.reserveMembres")]);
  }

  function lienCarte(c) {
    return el("a", { href: "#/carte/" + c.id }, [c.nom + " (n° " + c.cadastre + ")"]);
  }

  function blocRemplacement(c) {
    var blocs = [];
    if (c.remplaceePar && Donnees.carte(c.remplaceePar)) {
      blocs.push(el("p", { class: "avis avis-ancienne" }, [
        t("fiche.remplaceePar") + " ", lienCarte(Donnees.carte(c.remplaceePar))
      ]));
    }
    Donnees.cartes().forEach(function (autre) {
      if (autre.remplaceePar === c.id) {
        blocs.push(el("p", { class: "avis" }, [t("fiche.remplace") + " ", lienCarte(autre)]));
      }
    });
    return blocs;
  }

  function blocAcces(c) {
    var contenu;
    if (!Profils.peut("voirPeriodesAcces")) {
      contenu = [reserve()];
    } else if (Acces.estInconnue(c)) {
      contenu = [el("p", { class: "periode-inconnue" }, [t("acces.inconnue")])];
    } else {
      contenu = [el("ul", { class: "periodes" }, c.periodesAcces.map(function (p) {
        return el("li", {}, [Acces.formaterPeriode(p)]);
      }))];
    }
    if (Profils.peut("voirPeriodesAcces") && c.remarqueAcces) {
      var remarque = texteLibre(c.remarqueAcces);
      if (remarque) {
        remarque.classList.add("remarque");
        contenu.push(remarque);
      }
    }
    return el("section", { class: "panneau" }, [el("h2", {}, [t("fiche.acces")])].concat(contenu));
  }

  function blocContact(c) {
    var contenu;
    if (!Profils.peut("voirContact")) {
      contenu = [reserve()];
    } else if (!c.contact || !c.contact.nom) {
      contenu = [el("p", {}, ["–"])];
    } else {
      contenu = [el("dl", { class: "infos" }, [
        info(t("fiche.contactNom"), c.contact.nom),
        info(t("fiche.contactEmail"), c.contact.email ? el("a", { href: "mailto:" + c.contact.email }, [c.contact.email]) : null),
        info(t("fiche.contactTelephone"), c.contact.telephone ? el("a", { href: "tel:" + c.contact.telephone.replace(/\s/g, "") }, [c.contact.telephone]) : null)
      ])];
    }
    return el("section", { class: "panneau" }, [el("h2", {}, [t("fiche.contact")])].concat(contenu));
  }

  function blocApercu(c) {
    // Clic sur l'aperçu : légèrement agrandi (taille réelle, ~1 000 px), sans plus.
    var contenu = c.apercu
      ? el("img", {
          class: "apercu", src: c.apercu, alt: t("fiche.apercuDe", { nom: c.nom }),
          title: t("fiche.apercuAgrandir"),
          onclick: function (e) { e.currentTarget.classList.toggle("agrandi"); }
        })
      : el("div", { class: "apercu-absent" }, [t("fiche.apercuAbsent")]);
    return el("section", { class: "panneau" }, [el("h2", {}, [t("fiche.apercu")]), contenu]);
  }

  function dessinerMiniCarte(conteneur, c) {
    miniCarte = L.map(conteneur, { scrollWheelZoom: false });
    Fonds.ajouter(miniCarte);
    var style = UI.styleZone(c.statut);
    style.weight = 3;
    if (c.zone) {
      var zone = L.geoJSON(c.zone, { style: style }).addTo(miniCarte);
      miniCarte.fitBounds(zone.getBounds(), { padding: [20, 20] });
    } else {
      // Zone à compléter : point provisoire s'il existe, sinon vue de la Belgique.
      if (c.point) {
        var ll = [c.point.coordinates[1], c.point.coordinates[0]];
        L.circleMarker(ll, { radius: 9, weight: 3, color: style.fillColor, dashArray: "3 3", fillColor: "#fff", fillOpacity: 0.8 }).addTo(miniCarte);
        miniCarte.setView(ll, 14);
      } else {
        miniCarte.setView([50.5, 4.7], 7);
      }
    }
  }

  // Avis « zone à compléter » et « importée – à vérifier ».
  function blocImport(c) {
    var blocs = [];
    if (!c.zone) blocs.push(el("p", { class: "avis avis-demande" }, [t(c.point ? "fiche.zoneACompleterPoint" : "fiche.zoneACompleter")]));
    if (c.aVerifier && (Profils.peut("validerDemandes") || Profils.peutSurCarte("modifierFiche", c))) {
      blocs.push(el("p", { class: "avis" }, [t("fiche.importeeAVerifier")]));
    }
    return blocs;
  }

  // Avis en tête de fiche pour une demande en attente ou refusée.
  function blocDemande(c) {
    if (c.statut === "demande") {
      return [el("p", { class: "avis avis-demande" }, [t("fiche.demandeEnAttente")])];
    }
    if (c.statut === "refusee") {
      var motif = I18n.local(c.motifRefus);
      return [el("div", { class: "avis avis-refus" }, [
        el("strong", {}, [t("fiche.demandeRefusee")]),
        motif ? el("p", {}, [motif.texte]) : null
      ])];
    }
    return [];
  }

  // Boutons d'action selon les droits du profil sur cette carte.
  function blocActions(c) {
    if (!Profils.peutSurCarte("modifierFiche", c)) return null;
    var libelle = c.statut === "refusee" ? "fiche.corrigerRenvoyer" : "fiche.modifier";
    return el("div", { class: "actions-fiche" }, [
      el("a", { class: "bouton bouton-principal", href: "#/modifier/" + c.id }, [t(libelle)])
    ]);
  }

  function afficher(contenu, id) {
    var c = Donnees.carte(id);
    var retour = el("p", {}, [el("a", { href: "#/" }, ["← " + t("navigation.retourRegistre")])]);
    if (!c || !Regles.carteVisible(c)) {
      contenu.append(retour, el("section", { class: "panneau" }, [el("h1", {}, [t("navigation.introuvable")])]));
      return;
    }
    var club = Donnees.club(c.clubId);
    var conteneurCarte = el("div", { class: "mini-carte" });

    var entete = el("section", { class: "panneau fiche-entete" }, [
      blocActions(c),
      c.cadastre
        ? el("div", { class: "fiche-cadastre" }, [t("fiche.cadastre") + " " + c.cadastre])
        : el("div", { class: "fiche-cadastre sans-numero" }, [t("fiche.sansCadastre")]),
      el("h1", {}, [c.nom]),
      el("p", { class: "fiche-sous-titre" }, [
        club.nom + " · " + c.commune + " · " + t("provinces." + c.province) + " ",
        UI.badgeStatut(c.statut)
      ]),
      el("p", { class: "donnee-fictive" }, [t("fiche.donneeFictive")])
    ].concat(blocDemande(c), blocImport(c), blocRemplacement(c)));

    var infos = el("section", { class: "panneau" }, [
      el("h2", {}, [t("fiche.informations")]),
      el("dl", { class: "infos" }, [
        info(t("fiche.type"), t("types." + c.type)),
        info(t("fiche.echelle"), UI.echelle(c.echelle)),
        info(t("fiche.equidistance"), c.equidistance ? c.equidistance.toLocaleString(I18n.langue() === "nl" ? "nl-BE" : "fr-BE") + " m" : null),
        info(t("fiche.anneeCreation"), c.anneeCreation ? String(c.anneeCreation) : null),
        info(t("fiche.anneeMaj"), c.anneeMaj ? String(c.anneeMaj) : null),
        info(t("fiche.cartographe"), c.cartographe),
        info(t("fiche.club"), club.site ? el("a", { href: club.site, target: "_blank", rel: "noopener" }, [club.nom]) : club.nom)
      ]),
      texteLibre(c.description) ? el("h3", {}, [t("fiche.description")]) : null,
      texteLibre(c.description)
    ]);

    contenu.append(
      retour,
      entete,
      el("div", { class: "fiche-colonnes" }, [
        el("div", {}, [infos, blocAcces(c), blocContact(c), Signalements.blocFiche(c)]),
        el("div", {}, [
          el("section", { class: "panneau" }, [el("h2", {}, [t("fiche.zone")]), conteneurCarte]),
          blocApercu(c)
        ])
      ])
    );
    dessinerMiniCarte(conteneurCarte, c);
  }

  return {
    afficher: afficher,
    quitter: function () {
      if (miniCarte) { miniCarte.remove(); miniCarte = null; }
    }
  };
})();
