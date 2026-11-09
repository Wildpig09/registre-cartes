/*
 * Stockage : seul endroit du site qui lit et écrit des données.
 *
 * Dans le MVP, tout est gardé dans le navigateur du visiteur (localStorage).
 * Pour passer plus tard à la base de données OPunch, c'est ce fichier
 * qu'on remplacera, sans toucher au reste du site.
 */
window.Stockage = (function () {
  var PREFIXE = "registre-cartes:";

  function lire(cle, valeurParDefaut) {
    try {
      var brut = window.localStorage.getItem(PREFIXE + cle);
      return brut === null ? valeurParDefaut : JSON.parse(brut);
    } catch (e) {
      // Navigation privée ou stockage bloqué : le site marche quand même.
      return valeurParDefaut;
    }
  }

  // Renvoie true si c'est enregistré, false sinon (stockage bloqué ou plein).
  function ecrire(cle, valeur) {
    try {
      window.localStorage.setItem(PREFIXE + cle, JSON.stringify(valeur));
      return true;
    } catch (e) {
      return false;
    }
  }

  return { lire: lire, ecrire: ecrire };
})();
