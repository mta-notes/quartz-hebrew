#!/usr/bin/env bash
# בונה את האתר לפרסום, לתיקייה public/ (שורש הריפו).
# זה מה ש-GitHub Actions מריץ (.github/workflows/deploy.yml).
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
"$here/scripts/setup-quartz.sh"

cd "$here/quartz"
npx quartz build -d ../content -o ../public
echo "האתר מוכן ב-public/"
