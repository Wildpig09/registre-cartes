/*
 * Données du registre : clubs et cartes.
 *
 * Au premier passage, on part des données de démonstration (js/donnees-demo.js).
 * Ensuite, les modifications du visiteur sont gardées par Stockage, dans son
 * navigateur uniquement.
 */
window.Donnees = (function () {
  // À augmenter quand les données de démonstration changent : les navigateurs
  // qui gardaient une ancienne version repartiront des nouvelles données.
  var VERSION = 3;

  function copieDemo() {
    var d = JSON.parse(JSON.stringify(window.DONNEES_DEMO));
    d.version = VERSION;
    return d;
  }

  var enregistre = Stockage.lire("donnees", null);
  var etat = enregistre && enregistre.version === VERSION ? enregistre : copieDemo();

  // Renvoie false si le navigateur n'a pas pu enregistrer (stockage plein…).
  function sauver() {
    return Stockage.ecrire("donnees", etat);
  }

  function trouver(liste, id) {
    for (var i = 0; i < liste.length; i++) if (liste[i].id === id) return liste[i];
    return null;
  }

  function trierParNom(liste) {
    return liste.slice().sort(function (a, b) { return a.nom.localeCompare(b.nom, "fr"); });
  }

  function copie(objet) {
    return JSON.parse(JSON.stringify(objet));
  }

  // Ajoute la carte si elle est nouvelle, sinon remplace l'ancienne version.
  // En cas d'échec d'enregistrement, rien n'est changé.
  function enregistrerCarte(carte) {
    var avant = copie(etat.cartes);
    var index = etat.cartes.findIndex(function (c) { return c.id === carte.id; });
    if (index === -1) etat.cartes.push(copie(carte));
    else etat.cartes[index] = copie(carte);
    if (!sauver()) { etat.cartes = avant; return false; }
    return true;
  }

  function supprimerCarte(id) {
    var avant = copie(etat.cartes);
    var signalementsAvant = copie(etat.signalements || []);
    etat.cartes = etat.cartes.filter(function (c) { return c.id !== id; });
    // Les signalements de la carte supprimée disparaissent avec elle.
    etat.signalements = (etat.signalements || []).filter(function (s) { return s.carteId !== id; });
    // Les cartes qui renvoyaient vers elle n'ont plus de remplaçante.
    etat.cartes.forEach(function (c) { if (c.remplaceePar === id) c.remplaceePar = null; });
    if (!sauver()) { etat.cartes = avant; etat.signalements = signalementsAvant; return false; }
    return true;
  }

  function nouvelId() {
    var max = 0;
    etat.cartes.forEach(function (c) {
      var n = parseInt(String(c.id).replace(/\D/g, ""), 10);
      if (n > max) max = n;
    });
    return "c" + String(max + 1).padStart(3, "0");
  }

  // ---- Signalements d'erreurs ----
  // { id, carteId, auteur: { profil, clubId }, date "AAAA-MM-JJ", texte,
  //   statut: "ouvert" | "traite" | "refuse", reponse, dateReponse }
  function signalements() {
    return (etat.signalements || []).slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
  }

  // Ajoute ou met à jour un signalement. Renvoie false si l'enregistrement échoue.
  function enregistrerSignalement(s) {
    etat.signalements = etat.signalements || [];
    var avant = copie(etat.signalements);
    var index = etat.signalements.findIndex(function (x) { return x.id === s.id; });
    if (index === -1) etat.signalements.push(copie(s));
    else etat.signalements[index] = copie(s);
    if (!sauver()) { etat.signalements = avant; return false; }
    return true;
  }

  function nouvelIdSignalement() {
    var max = 0;
    (etat.signalements || []).forEach(function (s) {
      var n = parseInt(s.id.replace(/\D/g, ""), 10);
      if (n > max) max = n;
    });
    return "s" + String(max + 1).padStart(3, "0");
  }

  // ---- Clubs ----
  // Ajoute ou modifie un club. Renvoie false si l'enregistrement échoue.
  function enregistrerClub(club) {
    var avant = copie(etat.clubs);
    var index = etat.clubs.findIndex(function (c) { return c.id === club.id; });
    if (index === -1) etat.clubs.push(copie(club));
    else etat.clubs[index] = copie(club);
    if (!sauver()) { etat.clubs = avant; return false; }
    return true;
  }

  // ---- Chevauchements marqués « vérifiés » par l'administrateur ----
  // Clé d'une paire de cartes, indépendante de l'ordre : "c001|c004".
  function clePaire(a, b) {
    return [a, b].sort().join("|");
  }

  function chevauchementVerifie(a, b) {
    return (etat.chevauchementsVerifies || []).indexOf(clePaire(a, b)) !== -1;
  }

  function marquerChevauchement(a, b, verifie) {
    var liste = (etat.chevauchementsVerifies || []).filter(function (k) { return k !== clePaire(a, b); });
    if (verifie) liste.push(clePaire(a, b));
    var avant = etat.chevauchementsVerifies;
    etat.chevauchementsVerifies = liste;
    if (!sauver()) { etat.chevauchementsVerifies = avant; return false; }
    return true;
  }

  // Ce numéro de cadastre est-il déjà pris par une autre carte ?
  function cadastreUtilise(numero, saufId) {
    return etat.cartes.some(function (c) {
      return c.id !== saufId && c.cadastre !== null && String(c.cadastre) === String(numero);
    });
  }

  return {
    clubs: function () { return trierParNom(etat.clubs); },
    club: function (id) { return trouver(etat.clubs, id); },
    cartes: function () { return trierParNom(etat.cartes); },
    carte: function (id) { return trouver(etat.cartes, id); },
    cartesDuClub: function (clubId) {
      return trierParNom(etat.cartes.filter(function (c) { return c.clubId === clubId; }));
    },
    enregistrerCarte: enregistrerCarte,
    supprimerCarte: supprimerCarte,
    enregistrerClub: enregistrerClub,
    chevauchementVerifie: chevauchementVerifie,
    marquerChevauchement: marquerChevauchement,
    signalements: signalements,
    enregistrerSignalement: enregistrerSignalement,
    nouvelIdSignalement: nouvelIdSignalement,
    nouvelId: nouvelId,
    cadastreUtilise: cadastreUtilise,
    sauver: sauver,
    // Remet les données de démonstration de départ (efface les modifications).
    reinitialiser: function () {
      etat = copieDemo();
      sauver();
    }
  };
})();
