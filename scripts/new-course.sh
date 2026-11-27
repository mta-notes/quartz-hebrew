#!/usr/bin/env bash
# פותח ריפו קורס חדש מהתבנית שב-course-template/.
#
# שימוש: scripts/new-course.sh <owner/name> "<שם הקורס>" <תיקיית יעד>
#   scripts/new-course.sh mta-notes/algorithms "אלגוריתמים" ../algorithms
#
# מעתיק את התבנית לתיקיית היעד (שלא קיימת או ריקה) וממלא את course.ts ואת
# עמודי הדוגמה בשם, בריפו ובכתובת <owner>.github.io/<name>.
set -euo pipefail
if [[ $# -ne 3 ]]; then
  echo "שימוש: $0 <owner/name> \"<שם הקורס>\" <תיקיית יעד>" >&2
  exit 1
fi
repository="$1"
name="$2"
target="$3"
if [[ ! "$repository" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]]; then
  echo "הריפו צריך להיות בצורה owner/name, למשל mta-notes/algorithms." >&2
  exit 1
fi
if [[ -e "$target" && -n "$(ls -A "$target")" ]]; then
  echo "$target כבר קיימת ואינה ריקה." >&2
  exit 1
fi

base="$(cd "$(dirname "$0")/.." && pwd)"
owner="${repository%%/*}"
repo="${repository#*/}"
base_url="$(printf '%s' "$owner" | tr '[:upper:]' '[:lower:]').github.io/$repo"

mkdir -p "$target"
cp -R "$base/course-template/." "$target/"

# ממלאים את המקומות שמסומנים ב-__…__. node ולא sed, כדי ששם בעברית (או עם / ו-&)
# לא ישבור את ההחלפה.
NAME="$name" REPOSITORY="$repository" BASEURL="$base_url" node -e '
  const fs = require("node:fs"), path = require("node:path")
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(file) : [file]
  })
  for (const file of walk(process.argv[1])) {
    const text = fs.readFileSync(file, "utf8")
    const filled = text.replaceAll("__NAME__", process.env.NAME)
      .replaceAll("__REPOSITORY__", process.env.REPOSITORY)
      .replaceAll("__BASEURL__", process.env.BASEURL)
    if (filled !== text) fs.writeFileSync(file, filled)
  }
' "$target"

echo "הקורס \"$name\" מוכן ב-$target."
echo "הצעדים הבאים:"
echo "  cd $target && git init -b main && git add -A && git commit -m \"Start the $repo course site\""
echo "  gh repo create $repository --public --source . --push"
echo "  ב-GitHub: Settings → Pages → Source: GitHub Actions"
