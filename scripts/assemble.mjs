// מרכיב את האתר בתוך תיקיית Quartz: התבנית (theme/), הגדרות הקורס (course.ts)
// וההגדרות (quartz.config.yaml) מהריפו הזה. dev.sh, build.sh ותהליך הפרסום
// ב-GitHub Actions מריצים אותו, כך שכולם בונים בדיוק אותו דבר.
//
// שימוש: node scripts/assemble.mjs [תיקיית Quartz, ברירת מחדל: ./quartz]
//
// מה הוא עושה, לפי הסדר:
//   1. מעתיק את course.ts (בשם quartz.ts) ואת quartz.config.yaml לתיקיית Quartz;
//   2. מעתיק את theme/ ל-<Quartz>/theme (הרכיבים מייבאים ממנה);
//   3. מעתיק את custom.scss מעל quartz/styles/custom.scss של Quartz, ואת
//      theme/static/ (גופנים, לוגו, אייקון) לתוך quartz/static/.
// התוכן עצמו (content/) לא מועתק: Quartz קורא אותו ישירות עם -d ../content.

import { cpSync, existsSync, rmSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const quartz = resolve(process.argv[2] ?? join(root, "quartz"))

if (!existsSync(join(quartz, "package.json"))) {
  console.error(`אין Quartz ב-${quartz}. הריצו קודם ./dev.sh, שמתקין אותו.`)
  process.exit(1)
}

// 1. הטקסטים וההגדרות.
cpSync(join(root, "course.ts"), join(quartz, "quartz.ts"))
cpSync(join(root, "quartz.config.yaml"), join(quartz, "quartz.config.yaml"))

// 2. התבנית.
const theme = join(quartz, "theme")
rmSync(theme, { recursive: true, force: true })
cpSync(join(root, "theme"), theme, { recursive: true })

// 3. העיצוב והקבצים הסטטיים, איפה ש-Quartz מחפש אותם.
cpSync(join(theme, "custom.scss"), join(quartz, "quartz", "styles", "custom.scss"))
cpSync(join(theme, "static"), join(quartz, "quartz", "static"), { recursive: true })

console.log(`האתר הורכב בתוך ${quartz}`)
