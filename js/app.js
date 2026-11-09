/*
 * Démarrage du site : en-tête (langue, profil, club) et choix de la page
 * à afficher d'après l'adresse (la partie après « # ») :
 *   #/            page principale (carte + liste)
 *   #/carte/c001  fiche d'une carte
 *   #/droits      ce que le profil actuel peut faire
 */
(function () {
  var el = UI.el, t = I18n.t;
  var pageActuelle = null;

  // ---- En-tête : menu des profils ----
  function remplirMenuProfils() {
    var menu = document.getElementById("choix-profil");
    menu.innerHTML = "";
    Profils.LISTE.forEach(function (p) {
      var option = el("option", { value: p }, [t("profils." + p)]);
      if (p === Profils.actuel()) option.selected = true;
      menu.append(option);
    });
  }

  // ---- En-tête : menu des clubs (seulement pour membre et responsable) ----
  function remplirMenuClubs() {
    var outil = document.getElementById("outil-club");
    var menu = document.getElementById("choix-club");
    outil.hidden = !Profils.aUnClub();
    menu.innerHTML = "";
    Donnees.clubs().forEach(function (club) {
      var option = el("option", { value: club.id }, [club.nom]);
      if (club.id === Profils.club()) option.selected = true;
      menu.append(option);
    });
  }

  // ---- En-tête : lien vers les signalements, avec le nombre à traiter ----
  function majLienSignalements() {
    var lien = document.getElementById("lien-signalements");
    lien.hidden = !Profils.peut("traiterSignalements");
    if (!lien.hidden) {
      var n = Signalements.nombreOuverts();
      lien.innerHTML = "";
      lien.append(t("entete.signalements"));
      if (n) lien.append(" ", el("span", { class: "pastille", "aria-label": t("entete.aTraiter", { n: n }) }, [String(n)]));
    }
    // Lien « Administration », avec le nombre de demandes à valider.
    var admin = document.getElementById("lien-admin");
    admin.hidden = !Profils.peut("validerDemandes");
    if (!admin.hidden) {
      var d = PageAdmin.nombreDemandes();
      admin.innerHTML = "";
      admin.append(t("entete.admin"));
      if (d) admin.append(" ", el("span", { class: "pastille", "aria-label": t("entete.aValider", { n: d }) }, [String(d)]));
    }
  }

  // ---- En-tête : boutons de langue ----
  function majBoutonsLangue() {
    document.querySelectorAll("[data-langue]").forEach(function (bouton) {
      var actif = bouton.getAttribute("data-langue") === I18n.langue();
      bouton.setAttribute("aria-pressed", actif ? "true" : "false");
    });
  }

  // ---- Page « droits du profil » ----
  var PageDroits = {
    afficher: function (contenu) {
      var listeDroits = el("ul", { class: "liste-droits" });
      Profils.ACTIONS.forEach(function (action) {
        var droit = Profils.droit(action);
        var texte = t("droits." + action) + (droit === "club" ? " " + t("droits.club") : "");
        listeDroits.append(el("li", { class: droit ? "" : "refuse" }, [
          el("span", { class: droit ? "oui" : "non" }, [droit ? "✓" : "✗"]),
          el("span", {}, [texte])
        ]));
      });
      var profil = [
        t("accueil.profilActuel") + " ",
        el("span", { class: "etiquette-profil" }, [t("profils." + Profils.actuel())])
      ];
      if (Profils.club()) profil.push(" " + t("accueil.duClub", { club: Donnees.club(Profils.club()).nom }));

      contenu.append(
        el("p", {}, [el("a", { href: "#/" }, ["← " + t("navigation.retourRegistre")])]),
        el("section", { class: "panneau" }, [
          el("h1", {}, [t("accueil.droitsTitre")]),
          el("p", {}, profil),
          listeDroits
        ])
      );
    }
  };

  // ---- Affichage de la page demandée ----
  function afficher() {
    var contenu = document.getElementById("contenu");
    if (pageActuelle && pageActuelle.quitter) pageActuelle.quitter();
    majLienSignalements();
    contenu.innerHTML = "";
    contenu.className = "contenu";

    var morceaux = (location.hash.replace(/^#\/?/, "") || "").split("/");
    if (morceaux[0] === "carte" && morceaux[1]) {
      pageActuelle = PageFiche;
      PageFiche.afficher(contenu, morceaux[1]);
    } else if (morceaux[0] === "nouvelle") {
      pageActuelle = PageEdition;
      PageEdition.afficher(contenu, null);
    } else if (morceaux[0] === "modifier" && morceaux[1]) {
      pageActuelle = PageEdition;
      PageEdition.afficher(contenu, morceaux[1]);
    } else if (morceaux[0] === "signalements") {
      pageActuelle = Signalements.page;
      Signalements.page.afficher(contenu);
    } else if (morceaux[0] === "import") {
      pageActuelle = PageImport;
      PageImport.afficher(contenu);
    } else if (morceaux[0] === "admin") {
      pageActuelle = PageAdmin;
      PageAdmin.afficher(contenu, morceaux[1]);
    } else if (morceaux[0] === "droits") {
      pageActuelle = PageDroits;
      PageDroits.afficher(contenu);
    } else {
      pageActuelle = PageRegistre;
      PageRegistre.afficher(contenu);
    }
    window.scrollTo(0, 0);
  }

  function toutRafraichir() {
    I18n.appliquer();
    remplirMenuProfils();
    remplirMenuClubs();
    majLienSignalements();
    majBoutonsLangue();
    afficher();
  }

  // ---- Branchements ----
  document.getElementById("choix-profil").addEventListener("change", function (e) {
    Profils.changer(e.target.value);
  });
  document.getElementById("choix-club").addEventListener("change", function (e) {
    Profils.changerClub(e.target.value);
  });
  document.querySelectorAll("[data-langue]").forEach(function (bouton) {
    bouton.addEventListener("click", function () {
      I18n.changer(bouton.getAttribute("data-langue"));
    });
  });
  I18n.surChangement(toutRafraichir);
  Profils.surChangement(function () {
    remplirMenuClubs();
    majLienSignalements();
    afficher();
  });
  document.addEventListener("entete-a-jour", majLienSignalements);
  window.addEventListener("hashchange", afficher);
  document.getElementById("reinitialiser").addEventListener("click", function () {
    if (!window.confirm(t("pied.confirmerReinitialiser"))) return;
    Donnees.reinitialiser();
    location.hash = "#/";
    majLienSignalements();
    afficher();
  });

  toutRafraichir();
})();
