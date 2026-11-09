/*
 * Profils et droits (section 3 du cahier des charges).
 *
 * Dans le MVP, on choisit son profil dans un menu (mode démonstration).
 * Plus tard, le profil viendra du compte OPunch de la personne connectée.
 * Les autres fichiers demandent seulement Profils.peut("action") :
 * ils n'ont pas à savoir d'où vient le profil.
 */
window.Profils = (function () {
  var LISTE = ["visiteur", "membre", "responsable", "admin"];

  // Pour chaque action : qui a le droit.
  // "club" = seulement pour les cartes de son propre club.
  var DROITS = {
    voirRegistre:        { visiteur: true,  membre: true,  responsable: true,   admin: true },
    voirDemandes:        { visiteur: false, membre: true,  responsable: true,   admin: true },
    voirPeriodesAcces:   { visiteur: false, membre: true,  responsable: true,   admin: true },
    voirContact:         { visiteur: false, membre: true,  responsable: true,   admin: true },
    signalerErreur:      { visiteur: false, membre: true,  responsable: true,   admin: true },
    demanderReservation: { visiteur: false, membre: false, responsable: "club", admin: true },
    importer:            { visiteur: false, membre: false, responsable: "club", admin: true },
    modifierFiche:       { visiteur: false, membre: false, responsable: "club", admin: true },
    traiterSignalements: { visiteur: false, membre: false, responsable: "club", admin: true },
    passerAncienne:      { visiteur: false, membre: false, responsable: "club", admin: true },
    validerDemandes:     { visiteur: false, membre: false, responsable: false,  admin: true },
    creerDirectement:    { visiteur: false, membre: false, responsable: false,  admin: true },
    supprimerFiche:      { visiteur: false, membre: false, responsable: false,  admin: true },
    modifierParametres:  { visiteur: false, membre: false, responsable: false,  admin: true },
    gererClubsProfils:   { visiteur: false, membre: false, responsable: false,  admin: true },
    examinerChevauchements: { visiteur: false, membre: false, responsable: false, admin: true }
  };

  // Profils rattachés à un club (on choisit le club dans un second menu).
  var AVEC_CLUB = ["membre", "responsable"];

  var actuel = Stockage.lire("profil", "visiteur");
  if (LISTE.indexOf(actuel) === -1) actuel = "visiteur";
  var clubId = Stockage.lire("club", null);
  if (!Donnees.club(clubId)) clubId = Donnees.clubs()[0].id;
  var ecouteurs = [];

  function aUnClub() {
    return AVEC_CLUB.indexOf(actuel) !== -1;
  }

  // Renvoie true, false ou "club" (droit limité aux cartes de son club).
  function droit(action) {
    var regle = DROITS[action];
    return regle ? regle[actuel] : false;
  }

  // Le profil a-t-il ce droit, au moins pour certaines cartes ?
  function peut(action) {
    return droit(action) !== false;
  }

  // Le profil a-t-il ce droit pour cette carte précise ?
  function peutSurCarte(action, carte) {
    var d = droit(action);
    if (d === "club") return aUnClub() && carte.clubId === clubId;
    return d === true;
  }

  function prevenir() {
    ecouteurs.forEach(function (f) { f(actuel); });
  }

  function changer(nouveau) {
    if (LISTE.indexOf(nouveau) === -1 || nouveau === actuel) return;
    actuel = nouveau;
    Stockage.ecrire("profil", actuel);
    prevenir();
  }

  function changerClub(id) {
    if (!Donnees.club(id) || id === clubId) return;
    clubId = id;
    Stockage.ecrire("club", clubId);
    prevenir();
  }

  return {
    LISTE: LISTE,
    ACTIONS: Object.keys(DROITS),
    actuel: function () { return actuel; },
    aUnClub: aUnClub,
    // Club du profil actuel, ou null pour visiteur et administrateur.
    club: function () { return aUnClub() ? clubId : null; },
    droit: droit,
    peut: peut,
    peutSurCarte: peutSurCarte,
    changer: changer,
    changerClub: changerClub,
    surChangement: function (f) { ecouteurs.push(f); }
  };
})();
