#!/usr/bin/env bash
# בונה את אתר ההדגמה לפרסום, לתיקייה public/ (שורש הריפו).
# ריפו הבסיס הוא גם ה"קורס" של עצמו, ולכן הוא קורא ישירות ל-scripts/build.sh.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
exec "$here/scripts/build.sh" "$here"
