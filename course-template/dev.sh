#!/usr/bin/env bash
# תצוגה מקומית של הקורס: http://localhost:8080 (או PORT=…).
#
#   ./dev.sh                              עם הבסיס מ-GitHub (נמשך ל-.theme/)
#   THEME_DIR=../quartz-hebrew ./dev.sh   עם עותק מקומי של הבסיס, כדי לערוך אותו
#
# בלי THEME_DIR, הבסיס נמשך ל-.theme/ בענף או בתג שב-theme-version.txt, ומתעדכן
# בכל הרצה. עם THEME_DIR, משתמשים בתיקייה הזו כמו שהיא ולא נוגעים בה.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
theme="${THEME_DIR:-}"
if [[ -z "$theme" ]]; then
  theme="$here/.theme"
  repo="${THEME_REPO:-https://github.com/mta-notes/quartz-hebrew.git}"
  ref="$(tr -d '[:space:]' < "$here/theme-version.txt" 2>/dev/null || true)"
  ref="${ref:-main}"
  if [[ ! -d "$theme/.git" ]]; then
    git clone --quiet --depth 1 --branch "$ref" "$repo" "$theme"
  else
    git -C "$theme" fetch --quiet --depth 1 origin "$ref" && git -C "$theme" reset --quiet --hard FETCH_HEAD
  fi
fi
exec "$theme/scripts/dev.sh" "$here"
