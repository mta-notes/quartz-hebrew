#!/usr/bin/env bash
# תצוגה מקומית של אתר קורס: http://localhost:8080 (או PORT=…).
#
# שימוש: scripts/dev.sh [שורש הקורס, ברירת מחדל: ריפו הבסיס]
# dev.sh של כל קורס (ושל ריפו הבסיס) קורא לסקריפט הזה.
#
# עמודים (content/) מתעדכנים בדפדפן מיד כששומרים. אחרי שינוי ב-theme/,
# ב-course.ts, ב-quartz.config.yaml או ב-overrides/, עצרו (Ctrl+C) והריצו שוב.
set -euo pipefail
base="$(cd "$(dirname "$0")/.." && pwd)"
course="$(cd "${1:-$base}" && pwd)"
"$base/scripts/setup-quartz.sh" "$course"

cd "$course/quartz"
exec npx quartz build --serve -d ../content --port "${PORT:-8080}" --wsPort "${WS_PORT:-3001}"
