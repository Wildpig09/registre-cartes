/*
 * Traductions de l'interface.
 *
 * Les textes sont dans js/lang/<langue>.js. Pour ajouter une langue
 * (allemand, anglais…), il suffit de copier fr.js, de le traduire,
 * de l'ajouter dans index.html et dans LANGUES ci-dessous.
 */
window.I18n = (function () {
  var LANGUES = ["fr", "nl"];
  var langue = Stockage.lire("langue", null);
  if (LANGUES.indexOf(langue) === -1) {
    var duNavigateur = (navigator.language || "fr").slice(0, 2);
    langue = LANGUES.indexOf(duNavigateur) !== -1 ? duNavigateur : "fr";
  }
  var ecouteurs = [];

  // Cherche une clé du type "bandeau.prototype" dans le dictionnaire.
  function chercher(dico, cle) {
    return cle.split(".").reduce(function (o, k) {
      return o && o[k] !== undefined ? o[k] : undefined;
    }, dico);
  }

  // t("cle", { nom: "x" }) renvoie le texte traduit, avec {nom} remplacé.
  function t(cle, valeurs) {
    var texte = chercher(window.TEXTES[langue], cle);
    if (texte === undefined) texte = chercher(window.TEXTES.fr, cle);
    if (texte === undefined) return cle;
    return String(texte).replace(/\{(\w+)\}/g, function (_, nom) {
      return valeurs && valeurs[nom] !== undefined ? valeurs[nom] : "{" + nom + "}";
    });
  }

  // Remplit tous les éléments marqués data-i18n="cle" dans la page.
  function appliquer(racine) {
    (racine || document).querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.documentElement.lang = langue;
    document.title = t("app.titre");
  }

  function changer(nouvelle) {
    if (LANGUES.indexOf(nouvelle) === -1 || nouvelle === langue) return;
    langue = nouvelle;
    Stockage.ecrire("langue", langue);
    ecouteurs.forEach(function (f) { f(langue); });
  }

  // Texte libre saisi en plusieurs langues : { fr: "…", nl: "…" }.
  // Renvoie le texte dans la langue choisie ; sinon dans une autre langue,
  // en indiquant laquelle (autreLangue), ou null s'il n'y a rien.
  function local(textes) {
    if (!textes) return null;
    if (textes[langue]) return { texte: textes[langue], autreLangue: null };
    for (var i = 0; i < LANGUES.length; i++) {
      if (textes[LANGUES[i]]) return { texte: textes[LANGUES[i]], autreLangue: LANGUES[i] };
    }
    return null;
  }

  return {
    t: t,
    local: local,
    // Dictionnaire complet de la langue choisie.
    textes: function () { return window.TEXTES[langue]; },
    appliquer: appliquer,
    changer: changer,
    langue: function () { return langue; },
    surChangement: function (f) { ecouteurs.push(f); }
  };
})();
