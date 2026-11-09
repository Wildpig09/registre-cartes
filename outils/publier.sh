#!/bin/sh
# Publie le site sur GitHub (branche « main » du dépôt en ligne, servie par GitHub Pages).
#
# L'historique local garde tout, mais la version publiée EXCLUT les fichiers de
# travail : cahier des charges (.scratch/), skills de Claude (.agents/, .claude/).
# On construit pour cela un commit sur une branche locale séparée, « publication »,
# à partir de l'état actuel de la branche principale, sans ces dossiers.
#
# Usage :  sh outils/publier.sh "message de la mise en ligne"
# Prérequis : un dépôt distant « origin » et une connexion GitHub (gh auth login).
set -e

EXCLUS=".scratch .agents .claude skills-lock.json"
SOURCE=$(git rev-parse --abbrev-ref HEAD)
MESSAGE=${1:-"Mise en ligne"}

# Adresse e-mail anonyme GitHub, pour ne pas publier l'adresse personnelle.
GH="gh"
command -v gh >/dev/null 2>&1 || GH="/c/Program Files/GitHub CLI/gh.exe"
IDENTIFIANT=$("$GH" api user --jq .login)
NUMERO=$("$GH" api user --jq .id)
export GIT_AUTHOR_NAME="$IDENTIFIANT" GIT_COMMITTER_NAME="$IDENTIFIANT"
export GIT_AUTHOR_EMAIL="$NUMERO+$IDENTIFIANT@users.noreply.github.com"
export GIT_COMMITTER_EMAIL="$GIT_AUTHOR_EMAIL"

# Arbre des fichiers à publier, construit dans un index temporaire
# (ne touche ni aux fichiers du dossier ni à la branche en cours).
INDEX=$(mktemp)
trap 'rm -f "$INDEX"' EXIT
GIT_INDEX_FILE="$INDEX" git read-tree "$SOURCE"
for chemin in $EXCLUS; do
  GIT_INDEX_FILE="$INDEX" git rm -r -q --cached --ignore-unmatch "$chemin"
done
ARBRE=$(GIT_INDEX_FILE="$INDEX" git write-tree)

# Nouveau commit sur la branche « publication » (créée au premier passage).
if git rev-parse -q --verify refs/heads/publication >/dev/null; then
  if [ "$(git rev-parse publication^{tree})" = "$ARBRE" ]; then
    echo "Rien de nouveau à publier."
    exit 0
  fi
  COMMIT=$(git commit-tree "$ARBRE" -p publication -m "$MESSAGE")
else
  COMMIT=$(git commit-tree "$ARBRE" -m "$MESSAGE")
fi
git update-ref refs/heads/publication "$COMMIT"

git push origin publication:main
echo "Publié : $(git rev-parse --short "$COMMIT")"
