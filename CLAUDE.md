# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Règles de travail

- Réponds-moi toujours en français.
- Je ne suis pas développeur : explique simplement ce que tu fais et pourquoi, sans jargon inutile.
- Avant toute modification importante, propose-moi un plan et attends mon accord.
- Après chaque étape qui fonctionne, propose-moi de faire un commit avec un message clair.
- Ne mets jamais de mot de passe, de clé API ou de donnée sensible dans le code.

## Repository state

MVP of a Belgian orienteering map registry. Spec: `.scratch/registre-cartes/cahier-des-charges.md` (in French).

- Plain HTML/CSS/JS, no build step, no server: open `index.html` directly (works over `file://`). Scripts are classic `<script>` tags loaded in dependency order in `index.html` (no ES modules, so `file://` keeps working); each file exposes one global (`Stockage`, `Donnees`, `I18n`, `Profils`, `Regles`, `UI`, `Acces`, `Zones`, `Apercu`, `Fonds`, `PageRegistre`, `PageFiche`, `PageEdition`, `Signalements`, `PageAdmin`, `LectureListe`, `PageImport`).
- Bulk import (`#/import`, admin or club manager): `js/lecture-liste.js` parses CSV/XLSX and validates rows without saving; `js/import.js` saves and matches KML/KMZ files to maps by cadastre number or the `fichier_zone` column. Imported maps may have no `zone` yet (optional provisional `point`), so any code drawing `c.zone` must handle `null`. Club-imported maps carry `aVerifier: true` until the admin confirms them.
- Process rules (statuses, required fields per status, validation on/off, file size limits) live only in `js/regles.js`; `PARAMETRES_PAR_DEFAUT` there is what the admin "Paramètres" page overrides (stored via `Stockage`). The process is expected to change after federation feedback, so keep new process rules there rather than scattered in pages.
- External libs: Leaflet 1.9.4 (cdnjs), Leaflet-Geoman 2.17.0 and Turf 6.5.0 (jsdelivr) loaded in `index.html`; JSZip and PDF.js are loaded on demand via `UI.chargerScript` (PDF.js runs without a separate worker so it works over `file://`).
- Basemaps are defined only in `js/fonds.js`. Default is the Belgian NGI CartoWeb topo (works over `file://`, zooms 7–17); OSM and CARTO tile servers reject `file://` pages in real browsers (403 / "API key required") even though headless Chrome tests may still show OSM tiles, so don't trust a headless test for that.
- Map previews are stored as ~1000px JPEG data URLs inside localStorage, which is the main storage-size constraint of the MVP.
- `js/stockage.js` is the only file touching persistence (browser localStorage); it is the seam to swap for the OPunch database later. Profile/role rules live only in `js/profils.js` (`Profils.peut` / `Profils.peutSurCarte`); in the MVP the profile comes from a demo menu, later from OPunch login.
- UI strings live in `js/lang/fr.js` and `js/lang/nl.js`; every user-visible text must exist in both.
- Demo data `js/donnees-demo.js` is generated: edit `outils/generer-donnees-demo.js` then run `node outils/generer-donnees-demo.js js/donnees-demo.js`, and bump `VERSION` in `js/donnees.js` so browsers reload it.
- Tests (plain Node, no framework), run each file: `node tests/acces.test.js` (access periods), `node tests/lecture-liste.test.js` (CSV/scale/period parsing), `node tests/traductions.test.js` (every UI string exists in FR and NL — run after touching `js/lang/`). UI changes are checked in headless Chrome via a throwaway puppeteer-core script, not committed.

- Agent skills (from `mattpocock/skills`) live in `.agents/skills/`; `skills-lock.json` pins their source and hash.
- `.claude/skills/` holds symlinks to those folders (absolute paths), so edit skills in `.agents/skills/`. On this Windows checkout Git stores the symlinks as plain file copies, so after changing a skill check that both trees still match before committing.

## Agent skills

### Issue tracker

Issues and specs live as local markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
