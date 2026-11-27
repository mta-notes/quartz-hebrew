#!/usr/bin/env bash
# מכין את תיקיית quartz/ של קורס: מתקין את הגרסה שב-quartz-version.txt של
# הבסיס (בפעם הראשונה), מרכיב לתוכה את האתר (scripts/assemble.mjs), ומתקין את
# התוספים שב-quartz.config.yaml.
#
# שימוש: scripts/setup-quartz.sh [שורש הקורס, ברירת מחדל: ריפו הבסיס]
#
# quartz/ לא נשמרת ב-Git; כדי לשדרג, שנו את quartz-version.txt בבסיס, ובכל
# קורס מחקו את quartz/ (בפעם הבאה היא תותקן מחדש בגרסה החדשה).
set -euo pipefail
base="$(cd "$(dirname "$0")/.." && pwd)"
course="$(cd "${1:-$base}" && pwd)"
quartz="$course/quartz"
version="$(tr -d '[:space:]' < "$base/quartz-version.txt")"

# quartz/ שהותקנה בגרסה אחרת (אחרי שדרוג בבסיס) מותקנת מחדש.
installed="$(cat "$quartz/.hd-version" 2>/dev/null || true)"
if [[ -n "$installed" && "$installed" != "$version" ]]; then
  echo "Quartz בגרסה אחרת ב-quartz/; מתקין מחדש את $version…"
  rm -rf "$quartz"
fi

if [[ ! -d "$quartz" ]]; then
  echo "מתקין את Quartz $version…"
  git clone --quiet --depth 1 --branch "$version" https://github.com/jackyzha0/quartz.git "$quartz"
  (cd "$quartz" && npm ci --no-audit --no-fund)
  echo "$version" > "$quartz/.hd-version"
fi

node "$base/scripts/assemble.mjs" "$course" "$quartz"
(cd "$quartz" && npm run --silent install-plugins)
