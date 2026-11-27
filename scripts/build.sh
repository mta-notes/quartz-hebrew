#!/usr/bin/env bash
# בונה אתר של קורס לפרסום, לתיקייה public/ שבשורש הקורס.
#
# שימוש: scripts/build.sh [שורש הקורס, ברירת מחדל: ריפו הבסיס]
# build.sh של כל קורס (ושל ריפו הבסיס) קורא לסקריפט הזה.
set -euo pipefail
base="$(cd "$(dirname "$0")/.." && pwd)"
course="$(cd "${1:-$base}" && pwd)"
"$base/scripts/setup-quartz.sh" "$course"

cd "$course/quartz"
npx quartz build -d ../content -o ../public
echo "האתר מוכן ב-public/"
