#!/usr/bin/env bash
# תצוגה מקומית של אתר ההדגמה: http://localhost:8080
#
#   ./dev.sh                 מתקין את Quartz בפעם הראשונה, מרכיב ומגיש
#   PORT=9000 ./dev.sh       בפורט אחר
#
# עמודים (content/) מתעדכנים בדפדפן מיד כששומרים. אחרי שינוי ב-theme/,
# ב-course.ts או ב-quartz.config.yaml, עצרו (Ctrl+C) והריצו שוב.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
exec "$here/scripts/dev.sh" "$here"
