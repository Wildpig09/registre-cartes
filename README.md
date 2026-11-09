# Registre des cartes d'orientation – prototype

**Prototype non officiel, données fictives.** Démonstration d'un portail-registre des cartes de course d'orientation en Belgique : carte interactive, liste filtrable, fiche détaillée par carte, réservations de zones, signalements d'erreurs, import de listes (CSV / Excel) et de zones (KML / KMZ). Interface en français et en néerlandais.

Les noms de clubs sont ceux de la FRSO ; toutes les autres données (cartes, numéros de cadastre, contours, contacts) sont inventées. Le site n'est ni édité ni validé par la FRSO.

## Utiliser la démonstration

- Le menu « Profil de démonstration » permet de passer d'un profil à l'autre (visiteur, membre de club, responsable de club, administrateur), sans mot de passe.
- Les modifications restent dans le navigateur de chaque visiteur : rien n'est envoyé à un serveur. Le lien « Revenir aux données de démonstration », en bas de page, remet tout à zéro.

## Technique

- HTML, CSS et JavaScript simples, sans étape de compilation : ouvrir `index.html` suffit.
- Bibliothèques chargées depuis des CDN : Leaflet, Leaflet-Geoman, Turf, et à la demande PDF.js, JSZip, SheetJS.
- Fonds de carte : CartoWeb.be (IGN / NGI), Esri World Imagery, OpenStreetMap.
- Tests : `node tests/acces.test.js`, `node tests/lecture-liste.test.js`, `node tests/traductions.test.js`.
- `js/stockage.js` est le seul fichier qui lit et écrit les données (aujourd'hui dans le navigateur) ; les règles du processus sont regroupées dans `js/regles.js`.
