#!/usr/bin/env bash
# מכין את תיקיית quartz/: מתקין את הגרסה שב-quartz-version.txt (בפעם הראשונה),
# מרכיב לתוכה את האתר (scripts/assemble.mjs), ומתקין את התוספים שב-quartz.config.yaml.
# quartz/ לא נשמרת ב-Git; כדי לשדרג, שנו את quartz-version.txt ומחקו את quartz/.
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
quartz="$root/quartz"
version="$(tr -d '[:space:]' < "$root/quartz-version.txt")"

if [[ ! -d "$quartz" ]]; then
  echo "מתקין את Quartz $version…"
  git clone --quiet --depth 1 --branch "$version" https://github.com/jackyzha0/quartz.git "$quartz"
  (cd "$quartz" && npm ci --no-audit --no-fund)
fi

node "$root/scripts/assemble.mjs" "$quartz"
(cd "$quartz" && npm run --silent install-plugins)
