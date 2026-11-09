/*
 * RÈGLES DU PROCESSUS — fichier unique, à adapter quand la fédération
 * aura précisé le processus de réservation et de validation.
 *
 * Deux niveaux :
 *  1. PARAMETRES_PAR_DEFAUT : réglages que l'administrateur peut changer
 *     lui-même dans la page « Paramètres » du site (sans toucher au code).
 *  2. Le reste de ce fichier (statuts, passages d'un statut à l'autre) :
 *     changements plus profonds, à faire ici dans le code.
 */
window.Regles = (function () {
  // ---- Statuts d'une carte, dans l'ordre de leur cycle de vie ----
  // avecCadastre : le statut suppose une carte validée (numéro attribué).
  var STATUTS = {
    demande:  { avecCadastre: false },  // demande de réservation, en attente
    refusee:  { avecCadastre: false },  // demande refusée par l'administrateur
    projet:   { avecCadastre: true },   // réservée / en projet (validée)
    usage:    { avecCadastre: true },   // carte dessinée et utilisée
    ancienne: { avecCadastre: true }    // remplacée ou plus utilisée
  };
  var ORDRE = ["demande", "refusee", "projet", "usage", "ancienne"];

  // Statuts qu'on peut choisir en modifiant une carte déjà validée.
  var STATUTS_VALIDES = ["projet", "usage", "ancienne"];

  // Tous les champs d'une fiche qui peuvent être rendus obligatoires.
  var CHAMPS = ["cadastre", "nom", "commune", "province", "type", "zone",
    "echelle", "equidistance", "anneeCreation", "anneeMaj", "cartographe",
    "apercu", "description", "periodesAcces", "contact"];

  // ---- Réglages modifiables dans la page Paramètres ----
  var PARAMETRES_PAR_DEFAUT = {
    // Une nouvelle carte doit-elle être validée par l'administrateur ?
    validationObligatoire: true,
    // Les visiteurs voient-ils les demandes en attente ?
    demandesVisiblesVisiteurs: false,
    // Champs obligatoires selon le statut.
    // Le numéro de cadastre est obligatoire dès que la carte est validée.
    champsObligatoires: {
      demande:  ["nom", "commune", "province", "type", "zone"],
      refusee:  ["nom", "commune", "province", "type", "zone"],
      projet:   ["cadastre", "nom", "commune", "province", "type", "zone"],
      usage:    ["cadastre", "nom", "commune", "province", "type", "zone",
                 "echelle", "equidistance", "anneeCreation", "cartographe"],
      ancienne: ["cadastre", "nom", "commune", "province", "type", "zone"]
    },
    // Tailles maximales des fichiers importés, en mégaoctets.
    tailleMaxKmlMo: 5,
    tailleMaxApercuMo: 20
  };

  // Réglages enregistrés par l'administrateur, complétés par les valeurs par défaut.
  function parametres() {
    var enregistres = Stockage.lire("parametres", {}) || {};
    var p = JSON.parse(JSON.stringify(PARAMETRES_PAR_DEFAUT));
    Object.keys(enregistres).forEach(function (k) {
      if (k in p) p[k] = enregistres[k];
    });
    return p;
  }

  function enregistrerParametres(p) {
    return Stockage.ecrire("parametres", p);
  }

  function champsObligatoires(statut) {
    return parametres().champsObligatoires[statut] || [];
  }

  // Une carte est-elle visible pour le profil actuel ?
  function carteVisible(c) {
    if (c.statut === "demande") {
      return Profils.peut("voirDemandes") ||
        parametres().demandesVisiblesVisiteurs ||
        Profils.peutSurCarte("demanderReservation", c);
    }
    if (c.statut === "refusee") {
      // Seulement le club concerné et l'administrateur.
      return Profils.peutSurCarte("demanderReservation", c);
    }
    return true;
  }

  // Statut d'une nouvelle carte créée par un responsable de club.
  function statutNouvelleDemande() {
    return parametres().validationObligatoire ? "demande" : "projet";
  }

  // Le champ est-il vide ? (règles communes à tout le site)
  function estVide(c, champ) {
    var v = c[champ];
    if (v === null || v === undefined || v === "") return true;
    if (champ === "zone") return !v.coordinates || v.coordinates.length === 0;
    if (champ === "periodesAcces") return !v.length;
    if (champ === "description") return !v.fr && !v.nl;
    if (champ === "contact") return !v.nom;
    return false;
  }

  // Liste des champs obligatoires manquants pour ce statut.
  function champsManquants(c) {
    return champsObligatoires(c.statut).filter(function (champ) {
      return estVide(c, champ);
    });
  }

  return {
    STATUTS: STATUTS,
    ORDRE: ORDRE,
    STATUTS_VALIDES: STATUTS_VALIDES,
    CHAMPS: CHAMPS,
    PARAMETRES_PAR_DEFAUT: PARAMETRES_PAR_DEFAUT,
    parametres: parametres,
    enregistrerParametres: enregistrerParametres,
    champsObligatoires: champsObligatoires,
    carteVisible: carteVisible,
    statutNouvelleDemande: statutNouvelleDemande,
    champsManquants: champsManquants
  };
})();
