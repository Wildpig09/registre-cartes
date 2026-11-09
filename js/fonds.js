/*
 * Fonds de carte disponibles sur toutes les cartes interactives.
 *
 * Les serveurs d'OpenStreetMap (et de CARTO) refusent souvent les pages
 * ouvertes directement depuis un fichier (erreur 403 ou « API key required »).
 * Le fond par défaut est donc celui de l'IGN belge, qui les accepte :
 *  - « Topographique (IGN) » : CartoWeb.be de l'Institut géographique national
 *    (données ouvertes), Belgique uniquement, zooms 7 à 17.
 *  - « Photo aérienne » : Esri World Imagery (mention obligatoire).
 *  - « OpenStreetMap » : fonctionne une fois le site publié en ligne
 *    (GitHub Pages…), pas toujours quand on ouvre le fichier sur son ordinateur.
 */
window.Fonds = (function () {
  var FONDS = {
    ign: function () {
      return L.tileLayer("https://cartoweb.wmts.ngi.be/1.0.0/topo/default/3857/{z}/{y}/{x}.png", {
        minZoom: 7,
        maxNativeZoom: 17,
        maxZoom: 19,
        bounds: [[49.45, 2.5], [51.55, 6.45]],
        attribution: '&copy; <a href="https://www.ngi.be">IGN / NGI</a> – CartoWeb.be'
      });
    },
    photo: function () {
      return L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        maxNativeZoom: 18,
        maxZoom: 19,
        attribution: 'Imagerie &copy; Esri, Maxar, Earthstar Geographics'
      });
    },
    osm: function () {
      return L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });
    }
  };
  var ORDRE = ["ign", "photo", "osm"];
  var PAR_DEFAUT = "ign";

  // Ajoute les fonds à une carte Leaflet, avec un sélecteur en haut à droite.
  // Le dernier fond choisi est retenu pour toutes les cartes.
  function ajouter(carte) {
    var choisi = Stockage.lire("fond", PAR_DEFAUT);
    if (!FONDS[choisi]) choisi = PAR_DEFAUT;
    var calques = {};
    ORDRE.forEach(function (cle) {
      var calque = FONDS[cle]();
      calque.cle = cle;
      calques[I18n.t("fonds." + cle)] = calque;
      if (cle === choisi) calque.addTo(carte);
    });
    // Le fond IGN ne descend pas sous le zoom 7 (la Belgique entière).
    carte.setMinZoom(7);
    L.control.layers(calques, null, { position: "topright" }).addTo(carte);
    carte.on("baselayerchange", function (e) {
      if (e.layer.cle) Stockage.ecrire("fond", e.layer.cle);
    });
  }

  return { ajouter: ajouter };
})();
