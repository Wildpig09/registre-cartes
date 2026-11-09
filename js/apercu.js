/*
 * Aperçu d'une carte : à partir d'un PDF (première page), d'un JPG ou d'un PNG,
 * on fabrique une image d'environ 1 000 pixels de large, avec un filigrane.
 * Le fichier d'origine n'est jamais conservé : seule l'image réduite est gardée.
 */
window.Apercu = (function () {
  var LARGEUR = 1000;
  var QUALITE_JPEG = 0.72;
  var PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  // Chargé aussi comme script : PDF.js travaille alors sans « worker » séparé,
  // ce qui marche même quand le site est ouvert directement depuis un fichier.
  var PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  function estPdf(fichier) {
    return fichier.type === "application/pdf" || /\.pdf$/i.test(fichier.name);
  }

  function estImage(fichier) {
    return /^image\/(jpeg|png)$/.test(fichier.type) || /\.(jpe?g|png)$/i.test(fichier.name);
  }

  // Première page du PDF -> canvas d'environ LARGEUR pixels.
  function pageDuPdf(fichier) {
    return UI.chargerScript(PDFJS)
      .then(function () { return UI.chargerScript(PDFJS_WORKER); })
      .then(function () {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
        return fichier.arrayBuffer();
      })
      .then(function (octets) { return window.pdfjsLib.getDocument({ data: octets }).promise; })
      .then(function (pdf) { return pdf.getPage(1); })
      .then(function (page) {
        var base = page.getViewport({ scale: 1 });
        var vue = page.getViewport({ scale: LARGEUR / base.width });
        var canvas = document.createElement("canvas");
        canvas.width = Math.round(vue.width);
        canvas.height = Math.round(vue.height);
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return page.render({ canvasContext: ctx, viewport: vue }).promise.then(function () { return canvas; });
      });
  }

  // Image -> canvas d'au plus LARGEUR pixels de large.
  function depuisImage(fichier) {
    return new Promise(function (resoudre, rejeter) {
      var url = URL.createObjectURL(fichier);
      var img = new Image();
      img.onload = function () {
        var echelle = Math.min(1, LARGEUR / img.naturalWidth);
        var canvas = document.createElement("canvas");
        canvas.width = Math.round(img.naturalWidth * echelle);
        canvas.height = Math.round(img.naturalHeight * echelle);
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resoudre(canvas);
      };
      img.onerror = function () { URL.revokeObjectURL(url); rejeter(new Error("apercuIllisible")); };
      img.src = url;
    });
  }

  // Filigrane discret répété en diagonale.
  function filigrane(canvas, texte) {
    var ctx = canvas.getContext("2d");
    var taille = Math.max(16, Math.round(canvas.width / 28));
    ctx.save();
    ctx.font = "600 " + taille + "px Barlow, sans-serif";
    ctx.fillStyle = "rgba(30, 74, 64, 0.22)";
    ctx.textAlign = "center";
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 6);
    var pasX = ctx.measureText(texte).width + taille * 3;
    var pasY = taille * 5;
    var portee = Math.hypot(canvas.width, canvas.height);
    for (var y = -portee; y < portee; y += pasY) {
      for (var x = -portee + ((y / pasY) % 2 ? pasX / 2 : 0); x < portee; x += pasX) {
        ctx.fillText(texte, x, y);
      }
    }
    ctx.restore();
  }

  // Fichier choisi -> Promise d'image (texte « data:image/jpeg;base64,… »).
  function depuisFichier(fichier, nomClub) {
    var tailleMax = Regles.parametres().tailleMaxApercuMo;
    if (fichier.size > tailleMax * 1024 * 1024) return Promise.reject(new Error("apercuTropLourd"));
    var etape = estPdf(fichier) ? pageDuPdf(fichier)
      : estImage(fichier) ? depuisImage(fichier)
      : Promise.reject(new Error("formatApercu"));
    return etape.then(function (canvas) {
      filigrane(canvas, I18n.t("edition.filigrane", { club: nomClub }));
      return canvas.toDataURL("image/jpeg", QUALITE_JPEG);
    });
  }

  return { depuisFichier: depuisFichier, LARGEUR: LARGEUR };
})();
