/*
 * Petits outils d'affichage partagés par toutes les pages.
 */
window.UI = (function () {
  // Crée un élément HTML. Les textes sont toujours insérés comme du texte
  // (jamais comme du HTML), ce qui évite tout risque d'injection.
  function el(balise, attributs, enfants) {
    var noeud = document.createElement(balise);
    Object.keys(attributs || {}).forEach(function (cle) {
      var valeur = attributs[cle];
      if (valeur === null || valeur === undefined || valeur === false) return;
      if (cle.indexOf("on") === 0 && typeof valeur === "function") {
        noeud.addEventListener(cle.slice(2), valeur);
      } else {
        noeud.setAttribute(cle, valeur === true ? "" : valeur);
      }
    });
    (enfants || []).forEach(function (enfant) {
      if (enfant !== null && enfant !== undefined && enfant !== false) noeud.append(enfant);
    });
    return noeud;
  }

  // Menu déroulant : options = [[valeur, libellé], …]
  function menu(attributs, options, valeurChoisie) {
    var select = el("select", attributs);
    options.forEach(function (o) {
      var option = el("option", { value: o[0] }, [o[1]]);
      if (String(o[0]) === String(valeurChoisie)) option.selected = true;
      select.append(option);
    });
    return select;
  }

  // 10000 -> « 1:10 000 »
  function echelle(e) {
    if (!e) return "–";
    return "1:" + e.toLocaleString(I18n.langue() === "nl" ? "nl-BE" : "fr-BE");
  }

  // Charge un outil externe seulement quand on en a besoin (une seule fois).
  var scriptsCharges = {};
  function chargerScript(url) {
    if (!scriptsCharges[url]) {
      scriptsCharges[url] = new Promise(function (resoudre, rejeter) {
        var s = document.createElement("script");
        s.src = url;
        s.onload = resoudre;
        s.onerror = function () { delete scriptsCharges[url]; rejeter(new Error("reseau")); };
        document.head.append(s);
      });
    }
    return scriptsCharges[url];
  }

  function badgeStatut(statut) {
    return el("span", { class: "badge badge-" + statut }, [I18n.t("statuts." + statut)]);
  }

  // Couleur d'une carte sur la carte interactive, selon son statut.
  function couleurStatut(statut) {
    return {
      demande: "#b0751f",
      refusee: "#681a19",
      projet: "#2f6b5d",
      usage: "#e27639",
      ancienne: "#6e8a82"
    }[statut] || "#e27639";
  }

  // Style d'une zone sur une carte interactive.
  function styleZone(statut, enEvidence) {
    var couleur = couleurStatut(statut);
    return {
      color: enEvidence ? "#10261f" : couleur,
      weight: enEvidence ? 4 : 2,
      fillColor: couleur,
      fillOpacity: enEvidence ? 0.45 : 0.25,
      dashArray: statut === "usage" || statut === "ancienne" ? null : "6 4"
    };
  }

  return {
    el: el, menu: menu, echelle: echelle, badgeStatut: badgeStatut,
    couleurStatut: couleurStatut, styleZone: styleZone, chargerScript: chargerScript
  };
})();
