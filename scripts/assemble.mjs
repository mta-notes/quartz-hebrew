// מרכיב אתר של קורס בתוך תיקיית Quartz, משני שורשים:
//   - הבסיס (הריפו הזה): theme/, quartz.config.yaml, quartz-version.txt;
//   - הקורס: course.ts, content/ ו-overrides/ (אופציונלי).
// בריפו הבסיס שני השורשים הם אותה תיקייה (אתר ההדגמה). dev.sh, build.sh ותהליך
// הפרסום ב-GitHub Actions מריצים אותו, כך שכולם בונים בדיוק אותו דבר.
//
// שימוש: node scripts/assemble.mjs [שורש הקורס] [תיקיית Quartz]
//   ברירות מחדל: שורש הקורס הוא ריפו הבסיס, ותיקיית Quartz היא <קורס>/quartz.
//
// מה הוא עושה, לפי הסדר:
//   1. מעתיק את theme/ של הבסיס ל-<Quartz>/theme (הרכיבים מייבאים ממנה), ואת
//      course.ts של הקורס ל-<Quartz>/quartz.ts;
//   2. כותב <Quartz>/quartz.config.yaml: זה של הבסיס, ואם לקורס יש
//      overrides/config.yaml, מיזוג עמוק שלו מעליו (plugins ממוזג לפי source);
//   3. כותב quartz/styles/custom.scss: theme/custom.scss של הבסיס, ואחריו
//      overrides/custom.scss של הקורס;
//   4. מעתיק את theme/static/ של הבסיס ואחריו את overrides/static/ של הקורס
//      (הקורס דורס) לתוך quartz/static/.
// התוכן עצמו (content/) לא מועתק: Quartz קורא אותו ישירות עם -d ../content.

import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const base = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const course = resolve(process.argv[2] ?? base)
const quartz = resolve(process.argv[3] ?? join(course, "quartz"))
const overrides = join(course, "overrides")

if (!existsSync(join(quartz, "package.json"))) {
  console.error(`אין Quartz ב-${quartz}. הריצו קודם ./dev.sh, שמתקין אותו.`)
  process.exit(1)
}
if (!existsSync(join(course, "course.ts"))) {
  console.error(`אין course.ts ב-${course}.`)
  process.exit(1)
}

// 1. התבנית והגדרות הקורס.
const theme = join(quartz, "theme")
rmSync(theme, { recursive: true, force: true })
cpSync(join(base, "theme"), theme, { recursive: true })
cpSync(join(course, "course.ts"), join(quartz, "quartz.ts"))

// 2. ההגדרות של Quartz.
const baseConfig = join(base, "quartz.config.yaml")
const courseConfig = join(overrides, "config.yaml")
if (existsSync(courseConfig)) {
  // אותה ספריית YAML ש-Quartz עצמו קורא בה, מתוך ה-node_modules שלו.
  const YAML = createRequire(join(quartz, "package.json"))("yaml")
  const merged = merge(YAML.parse(readFileSync(baseConfig, "utf8")), YAML.parse(readFileSync(courseConfig, "utf8")) ?? {})
  const schema = "# yaml-language-server: $schema=./quartz/plugins/quartz-plugins.schema.json\n"
  const note = "# נכתב על ידי scripts/assemble.mjs: quartz.config.yaml של הבסיס + overrides/config.yaml של הקורס.\n"
  writeFileSync(join(quartz, "quartz.config.yaml"), schema + note + YAML.stringify(merged, { lineWidth: 0 }))
} else {
  cpSync(baseConfig, join(quartz, "quartz.config.yaml"))
}

// 3. העיצוב: של הבסיס, ואחריו של הקורס, כך שכללי הקורס גוברים.
const courseStyles = join(overrides, "custom.scss")
let styles = readFileSync(join(theme, "custom.scss"), "utf8")
if (existsSync(courseStyles)) {
  styles += `\n\n// ---------------------------------------------------------------- overrides/custom.scss של הקורס\n\n`
  styles += readFileSync(courseStyles, "utf8")
}
writeFileSync(join(quartz, "quartz", "styles", "custom.scss"), styles)

// 4. הקבצים הסטטיים (גופנים, לוגו, אייקון).
cpSync(join(theme, "static"), join(quartz, "quartz", "static"), { recursive: true })
if (existsSync(join(overrides, "static"))) {
  cpSync(join(overrides, "static"), join(quartz, "quartz", "static"), { recursive: true })
}

console.log(`האתר הורכב בתוך ${quartz}`)

// מיזוג עמוק: אובייקטים ממוזגים מפתח אחר מפתח, ערך אחר דורס. מערך plugins
// ממוזג לפי source: תוסף שכבר קיים מקבל את השדות החדשים, ותוסף חדש נוסף בסוף.
// כל מערך אחר מוחלף כולו.
function merge(target, source, key) {
  if (Array.isArray(target) && Array.isArray(source) && key === "plugins") {
    const result = target.map((item) => ({ ...item }))
    for (const item of source) {
      const index = result.findIndex((existing) => existing?.source === item?.source)
      if (index === -1) result.push(item)
      else result[index] = merge(result[index], item)
    }
    return result
  }
  if (isObject(target) && isObject(source)) {
    const result = { ...target }
    for (const [name, value] of Object.entries(source)) {
      result[name] = name in target ? merge(target[name], value, name) : value
    }
    return result
  }
  return source
}

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
