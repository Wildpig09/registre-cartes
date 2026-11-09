/*
 * Zones des cartes : lecture des fichiers KML / KMZ et détection des
 * chevauchements entre zones.
 *
 * Une zone est un objet GeoJSON de type "Polygon" ou "MultiPolygon"
 * (plusieurs contours : une carte peut couvrir plusieurs bois séparés).
 */
window.Zones = (function () {
  var JSZIP = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";

  // "4.35,50.8,0 4.36,50.81,0 …" -> [[4.35, 50.8], [4.36, 50.81], …]
  function lireCoordonnees(texte) {
    var points = texte.trim().split(/\s+/).map(function (triplet) {
      var v = triplet.split(",");
      return [Number(v[0]), Number(v[1])];
    }).filter(function (p) { return isFinite(p[0]) && isFinite(p[1]); });
    if (points.length && (points[0][0] !== points[points.length - 1][0] || points[0][1] !== points[points.length - 1][1])) {
      points.push(points[0].slice());
    }
    return points;
  }

  // Cherche les éléments d'un nom donné, avec ou sans préfixe (gx:LatLonQuad…).
  function elements(racine, nom) {
    return Array.prototype.filter.call(racine.getElementsByTagName("*"), function (e) {
      return e.localName === nom;
    });
  }

  function texteDe(racine, nom) {
    var e = elements(racine, nom)[0];
    return e ? e.textContent : null;
  }

  // Rectangle d'une image posée sur la carte (export « KMZ » d'OCAD, par ex.).
  function rectangle(boite) {
    var n = Number(texteDe(boite, "north")), s = Number(texteDe(boite, "south"));
    var e = Number(texteDe(boite, "east")), o = Number(texteDe(boite, "west"));
    var rotation = Number(texteDe(boite, "rotation") || 0) * Math.PI / 180;
    var cx = (e + o) / 2, cy = (n + s) / 2;
    var k = Math.cos(cy * Math.PI / 180); // les degrés de longitude sont plus courts
    var coins = [[o, s], [e, s], [e, n], [o, n]].map(function (p) {
      var dx = (p[0] - cx) * k, dy = p[1] - cy;
      return [cx + (dx * Math.cos(rotation) - dy * Math.sin(rotation)) / k,
              cy + dx * Math.sin(rotation) + dy * Math.cos(rotation)];
    });
    coins.push(coins[0].slice());
    return [coins];
  }

  // Texte d'un fichier KML -> zone GeoJSON. Lève une erreur si rien d'utilisable.
  function depuisKml(texte) {
    var doc = new DOMParser().parseFromString(texte, "application/xml");
    if (doc.getElementsByTagName("parsererror").length) throw new Error("kmlIllisible");
    var polygones = [];

    elements(doc, "Polygon").forEach(function (poly) {
      var exterieur = elements(poly, "outerBoundaryIs")[0];
      if (!exterieur) return;
      var anneaux = [lireCoordonnees(texteDe(exterieur, "coordinates") || "")];
      elements(poly, "innerBoundaryIs").forEach(function (trou) {
        anneaux.push(lireCoordonnees(texteDe(trou, "coordinates") || ""));
      });
      if (anneaux[0].length >= 4) polygones.push(anneaux);
    });
    // Image posée sur la carte : on prend son emprise.
    if (!polygones.length) {
      elements(doc, "LatLonQuad").forEach(function (quad) {
        var anneau = lireCoordonnees(texteDe(quad, "coordinates") || "");
        if (anneau.length >= 4) polygones.push([anneau]);
      });
    }
    if (!polygones.length) {
      elements(doc, "LatLonBox").forEach(function (boite) { polygones.push(rectangle(boite)); });
    }
    if (!polygones.length) throw new Error("kmlSansZone");
    return polygones.length === 1
      ? { type: "Polygon", coordinates: polygones[0] }
      : { type: "MultiPolygon", coordinates: polygones };
  }

  // Fichier choisi par l'utilisateur (.kml ou .kmz) -> Promise de zone GeoJSON.
  function depuisFichier(fichier) {
    var nom = fichier.name.toLowerCase();
    if (/\.kml$/.test(nom)) return fichier.text().then(depuisKml);
    if (/\.kmz$/.test(nom)) {
      // Un KMZ est un dossier compressé qui contient un fichier .kml.
      return UI.chargerScript(JSZIP)
        .then(function () { return window.JSZip.loadAsync(fichier); })
        .then(function (zip) {
          var kml = Object.keys(zip.files).filter(function (n) { return /\.kml$/i.test(n); })[0];
          if (!kml) throw new Error("kmlSansZone");
          return zip.file(kml).async("text");
        })
        .then(depuisKml);
    }
    return Promise.reject(new Error("formatZone"));
  }

  // Liste des polygones d'une zone : [[anneaux…], …]
  function polygonesDe(zone) {
    if (!zone) return [];
    return zone.type === "MultiPolygon" ? zone.coordinates : [zone.coordinates];
  }

  function depuisPolygones(polygones) {
    if (!polygones.length) return null;
    return polygones.length === 1
      ? { type: "Polygon", coordinates: polygones[0] }
      : { type: "MultiPolygon", coordinates: polygones };
  }

  // Surface commune (en m²) entre deux zones, 0 si elles ne se touchent pas.
  function surfaceCommune(a, b) {
    var total = 0;
    polygonesDe(a).forEach(function (pa) {
      polygonesDe(b).forEach(function (pb) {
        try {
          var commun = turf.intersect(turf.polygon(pa), turf.polygon(pb));
          if (commun) total += turf.area(commun);
        } catch (e) {
          // Contour mal formé (ex. dessin qui se croise lui-même) : ignoré.
        }
      });
    });
    return total;
  }

  // Cartes dont la zone chevauche celle-ci (moins de 100 m² : ignoré).
  // saufId : la carte elle-même. Les demandes refusées ne comptent pas.
  function chevauchements(zone, saufId, clubId) {
    if (!zone) return [];
    var resultat = [];
    Donnees.cartes().forEach(function (c) {
      if (c.id === saufId || c.statut === "refusee" || !c.zone) return;
      var surface = surfaceCommune(zone, c.zone);
      if (surface >= 100) {
        resultat.push({ carte: c, surface: surface, autreClub: c.clubId !== clubId });
      }
    });
    // Les conflits avec un autre club d'abord.
    return resultat.sort(function (x, y) { return (y.autreClub - x.autreClub) || (y.surface - x.surface); });
  }

  // Emprise [ouest, sud, est, nord] d'une zone, pour écarter vite les paires éloignées.
  function emprise(zone) {
    var b = [Infinity, Infinity, -Infinity, -Infinity];
    polygonesDe(zone).forEach(function (poly) {
      poly[0].forEach(function (p) {
        b[0] = Math.min(b[0], p[0]); b[1] = Math.min(b[1], p[1]);
        b[2] = Math.max(b[2], p[0]); b[3] = Math.max(b[3], p[1]);
      });
    });
    return b;
  }

  function empriseSeTouchent(a, b) {
    return a[0] <= b[2] && b[0] <= a[2] && a[1] <= b[3] && b[1] <= a[3];
  }

  // Tous les chevauchements entre cartes du registre (demandes refusées exclues).
  // Renvoie [{ a, b, surface, autreClub }] ; a et b sont des cartes.
  function tousLesChevauchements() {
    var cartes = Donnees.cartes().filter(function (c) { return c.statut !== "refusee" && c.zone; });
    var emprises = cartes.map(function (c) { return emprise(c.zone); });
    var resultat = [];
    for (var i = 0; i < cartes.length; i++) {
      for (var j = i + 1; j < cartes.length; j++) {
        if (!empriseSeTouchent(emprises[i], emprises[j])) continue;
        var surface = surfaceCommune(cartes[i].zone, cartes[j].zone);
        if (surface >= 100) {
          resultat.push({ a: cartes[i], b: cartes[j], surface: surface, autreClub: cartes[i].clubId !== cartes[j].clubId });
        }
      }
    }
    return resultat;
  }

  return {
    tousLesChevauchements: tousLesChevauchements,
    depuisFichier: depuisFichier,
    depuisKml: depuisKml,
    polygonesDe: polygonesDe,
    depuisPolygones: depuisPolygones,
    surfaceCommune: surfaceCommune,
    chevauchements: chevauchements
  };
})();
