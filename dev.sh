#!/usr/bin/env bash
# תצוגה מקומית של האתר: http://localhost:8080
#
#   ./dev.sh                 מתקין את Quartz בפעם הראשונה, מרכיב ומגיש
#   PORT=9000 ./dev.sh       בפורט אחר
#
# עמודים (content/) מתעדכנים בדפדפן מיד כששומרים. אחרי שינוי ב-theme/,
# ב-quartz.ts או ב-quartz.config.yaml, עצרו (Ctrl+C) והריצו שוב.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
"$here/scripts/setup-quartz.sh"

cd "$here/quartz"
exec npx quartz build --serve -d ../content --port "${PORT:-8080}" --wsPort "${WS_PORT:-3001}"
