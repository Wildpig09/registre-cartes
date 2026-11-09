/*
 * Signalements d'erreurs.
 *  - Sur une fiche : formulaire « Signaler une erreur » (membres de club et au-delà).
 *  - Page #/signalements : suivi par le responsable de club (cartes de son
 *    club) ou par l'administrateur (tous les clubs).
 */
window.Signalements = (function () {
  var el = UI.el, t = I18n.t;
  var onglet = "ouvert"; // onglet affiché : "ouvert" ou "clos"

  function aujourdhui() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function formaterDate(iso) {
    var m = iso.split("-").map(Number);
    return new Date(m[0], m[1] - 1, m[2]).toLocaleDateString(I18n.langue() === "nl" ? "nl-BE" : "fr-BE",
      { day: "numeric", month: "long", year: "numeric" });
  }

  // Signalements que le profil actuel doit traiter (ceux de son club, ou tous).
  function aTraiter() {
    return Donnees.signalements().filter(function (s) {
      var c = Donnees.carte(s.carteId);
      return c && Profils.peutSurCarte("traiterSignalements", c);
    });
  }

  function nombreOuverts() {
    return aTraiter().filter(function (s) { return s.statut === "ouvert"; }).length;
  }

  function auteur(s) {
    var club = Donnees.club(s.auteur.clubId);
    return t("profils." + s.auteur.profil) + (club ? " – " + club.nom : "");
  }

  // ---- Bloc pour la fiche d'une carte ----
  function blocFiche(c) {
    if (!Profils.peut("signalerErreur") || !Regles.STATUTS[c.statut].avecCadastre) return null;
    var zone = el("section", { class: "panneau signaler" });

    function replie() {
      zone.innerHTML = "";
      var ouverts = Donnees.signalements().filter(function (s) { return s.carteId === c.id && s.statut === "ouvert"; });
      zone.append(
        el("h2", {}, [t("signalements.titreFiche")]),
        el("p", { class: "aide" }, [t("signalements.explication", { club: Donnees.club(c.clubId).nom })]),
        ouverts.length && Profils.peutSurCarte("traiterSignalements", c)
          ? el("p", {}, [el("a", { href: "#/signalements" }, [t("signalements.enCoursSurCarte", { n: ouverts.length })])])
          : null,
        el("button", { type: "button", class: "bouton", onclick: ouvert }, [t("signalements.bouton")])
      );
    }

    function ouvert() {
      zone.innerHTML = "";
      var message = el("p", { class: "message-fichier", "aria-live": "polite" });
      var texte = el("textarea", { rows: "4", maxlength: "2000", "aria-label": t("signalements.votreMessage") });
      zone.append(
        el("h2", {}, [t("signalements.titreFiche")]),
        el("label", { class: "champ" }, [el("span", { class: "libelle" }, [t("signalements.votreMessage")]), texte,
          el("small", {}, [t("signalements.aideMessage")])]),
        message,
        el("div", { class: "actions-formulaire" }, [
          el("button", {
            type: "button", class: "bouton bouton-principal",
            onclick: function () {
              var contenu = texte.value.trim();
              if (contenu.length < 5) { message.textContent = t("signalements.tropCourt"); return; }
              var ok = Donnees.enregistrerSignalement({
                id: Donnees.nouvelIdSignalement(),
                carteId: c.id,
                auteur: { profil: Profils.actuel(), clubId: Profils.club() },
                date: aujourdhui(),
                texte: contenu,
                statut: "ouvert", reponse: null, dateReponse: null
              });
              if (!ok) { message.textContent = t("erreurs.stockage"); return; }
              zone.innerHTML = "";
              zone.append(
                el("h2", {}, [t("signalements.titreFiche")]),
                el("p", { class: "avis" }, [t("signalements.merci", { club: Donnees.club(c.clubId).nom })])
              );
              document.dispatchEvent(new CustomEvent("entete-a-jour"));
            }
          }, [t("signalements.envoyer")]),
          el("button", { type: "button", class: "bouton", onclick: replie }, [t("edition.annuler")])
        ])
      );
      texte.focus();
    }

    replie();
    return zone;
  }

  // ---- Page de suivi ----
  function carteSignalement(s, rafraichir) {
    var c = Donnees.carte(s.carteId);
    var blocs = [
      el("div", { class: "signalement-entete" }, [
        el("a", { href: "#/carte/" + c.id, class: "nom-carte" }, [c.nom]),
        el("span", { class: "secondaire" }, [" · " + Donnees.club(c.clubId).nom + " · " + formaterDate(s.date)]),
        el("span", { class: "badge badge-sig-" + s.statut }, [t("signalements.statuts." + s.statut)])
      ]),
      el("p", { class: "signalement-texte" }, [s.texte]),
      el("p", { class: "secondaire" }, [t("signalements.par", { auteur: auteur(s) })])
    ];

    if (s.statut === "ouvert") {
      var commentaire = el("textarea", { rows: "2", maxlength: "1000", "aria-label": t("signalements.commentaire"),
        placeholder: t("signalements.commentairePlaceholder") });
      var message = el("p", { class: "message-fichier", "aria-live": "polite" });
      function cloturer(statut) {
        var r = commentaire.value.trim();
        if (statut === "refuse" && !r) { message.textContent = t("signalements.motifObligatoire"); return; }
        var maj = Object.assign({}, s, { statut: statut, reponse: r || null, dateReponse: aujourdhui() });
        if (!Donnees.enregistrerSignalement(maj)) { message.textContent = t("erreurs.stockage"); return; }
        document.dispatchEvent(new CustomEvent("entete-a-jour"));
        rafraichir();
      }
      blocs.push(
        el("label", { class: "champ" }, [el("span", { class: "libelle" }, [t("signalements.commentaire")]), commentaire]),
        message,
        el("div", { class: "actions-signalement" }, [
          el("button", { type: "button", class: "bouton bouton-principal", onclick: function () { cloturer("traite"); } }, [t("signalements.marquerTraite")]),
          el("button", { type: "button", class: "bouton", onclick: function () { cloturer("refuse"); } }, [t("signalements.refuser")]),
          Profils.peutSurCarte("modifierFiche", c)
            ? el("a", { href: "#/modifier/" + c.id, class: "bouton-lien" }, [t("signalements.corrigerFiche")])
            : null
        ])
      );
    } else if (s.reponse) {
      blocs.push(el("p", { class: "signalement-reponse" }, [
        el("strong", {}, [t("signalements.reponseDu", { date: formaterDate(s.dateReponse) }) + " "]), s.reponse
      ]));
    }
    return el("article", { class: "panneau signalement" }, blocs);
  }

  function page(contenu) {
    var retour = el("p", {}, [el("a", { href: "#/" }, ["← " + t("navigation.retourRegistre")])]);
    if (!Profils.peut("traiterSignalements")) {
      contenu.append(retour, el("section", { class: "panneau" }, [el("h1", {}, [t("signalements.nonAutorise")])]));
      return;
    }
    var liste = el("div");
    var boutons = el("div", { class: "onglets onglets-visibles", role: "group" });

    function rafraichir() {
      var tous = aTraiter();
      var ouverts = tous.filter(function (s) { return s.statut === "ouvert"; });
      var clos = tous.filter(function (s) { return s.statut !== "ouvert"; });
      boutons.innerHTML = "";
      [["ouvert", t("signalements.ongletOuverts", { n: ouverts.length })], ["clos", t("signalements.ongletClos", { n: clos.length })]]
        .forEach(function (o) {
          boutons.append(el("button", {
            type: "button", "aria-pressed": onglet === o[0] ? "true" : "false",
            onclick: function () { onglet = o[0]; rafraichir(); }
          }, [o[1]]));
        });
      liste.innerHTML = "";
      var affiches = onglet === "ouvert" ? ouverts : clos;
      if (!affiches.length) liste.append(el("p", { class: "panneau vide" }, [t(onglet === "ouvert" ? "signalements.aucunOuvert" : "signalements.aucunClos")]));
      affiches.forEach(function (s) { liste.append(carteSignalement(s, rafraichir)); });
    }

    var portee = Profils.club() ? t("signalements.porteeClub", { club: Donnees.club(Profils.club()).nom }) : t("signalements.porteeTous");
    contenu.append(
      retour,
      el("h1", {}, [t("signalements.titrePage")]),
      el("p", { class: "aide" }, [portee]),
      boutons,
      liste
    );
    rafraichir();
  }

  return {
    blocFiche: blocFiche,
    nombreOuverts: nombreOuverts,
    page: { afficher: page }
  };
})();
