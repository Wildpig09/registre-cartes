/*
 * Périodes d'accès aux bois.
 *
 * Une période est { du: "JJ-MM", au: "JJ-MM" } et se répète chaque année.
 * Elle peut chevaucher le Nouvel An (ex. du 01-11 au 31-03).
 * Une carte sans période a une « période inconnue » (pas « toujours accessible »).
 */
window.Acces = (function () {
  function versDate(jjmm) {
    var morceaux = jjmm.split("-");
    // Année 2001 : non bissextile, sert seulement à afficher le jour et le mois.
    return new Date(2001, Number(morceaux[1]) - 1, Number(morceaux[0]));
  }

  // "01-04" -> « 1 avril » / « 1 april »
  function formaterJour(jjmm) {
    var locale = I18n.langue() === "nl" ? "nl-BE" : "fr-BE";
    return versDate(jjmm).toLocaleDateString(locale, { day: "numeric", month: "long" });
  }

  function formaterPeriode(p) {
    if (p.du === "01-01" && p.au === "31-12") return I18n.t("acces.touteAnnee");
    return I18n.t("acces.periode", { du: formaterJour(p.du), au: formaterJour(p.au) });
  }

  // Version courte pour la liste : « 1 avr. – 30 sept. »
  function formaterCourt(p) {
    if (p.du === "01-01" && p.au === "31-12") return I18n.t("acces.touteAnnee");
    var locale = I18n.langue() === "nl" ? "nl-BE" : "fr-BE";
    var options = { day: "numeric", month: "short" };
    return versDate(p.du).toLocaleDateString(locale, options) + " – " +
      versDate(p.au).toLocaleDateString(locale, options);
  }

  function estInconnue(carte) {
    return !carte.periodesAcces || carte.periodesAcces.length === 0;
  }

  // "JJ-MM" -> nombre MMJJ (ex. "01-04" -> 401), pour comparer facilement.
  function cle(jjmm) {
    var m = jjmm.split("-");
    return Number(m[1]) * 100 + Number(m[0]);
  }

  // Le jour (objet Date) tombe-t-il dans la période ? Gère le passage du Nouvel An.
  function jourDansPeriode(jour, p) {
    var x = (jour.getMonth() + 1) * 100 + jour.getDate();
    var debut = cle(p.du), fin = cle(p.au);
    return debut <= fin ? (x >= debut && x <= fin) : (x >= debut || x <= fin);
  }

  // La carte est-elle accessible au moins un jour entre debut et fin (inclus) ?
  // À n'utiliser que pour une carte dont la période est connue.
  function accessibleDansPlage(carte, debut, fin) {
    var jour = new Date(debut.getFullYear(), debut.getMonth(), debut.getDate());
    // Au-delà d'un an, tous les jours de l'année sont couverts.
    for (var n = 0; jour <= fin && n < 366; n++) {
      for (var i = 0; i < carte.periodesAcces.length; i++) {
        if (jourDansPeriode(jour, carte.periodesAcces[i])) return true;
      }
      jour.setDate(jour.getDate() + 1);
    }
    return false;
  }

  return {
    formaterPeriode: formaterPeriode,
    formaterCourt: formaterCourt,
    estInconnue: estInconnue,
    accessibleDansPlage: accessibleDansPlage
  };
})();
