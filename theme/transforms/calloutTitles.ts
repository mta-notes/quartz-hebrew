// כותרות ברירת מחדל של תיבות הערה בעברית.
//
// תיבה בלי כותרת משלה (`> [!tip]`) מקבלת מהתוסף של Quartz את שם הסוג באנגלית
// ("Tip"), גם כשה-locale הוא עברית. כאן הכותרת מוחלפת בתרגום של Quartz עצמו
// (quartz/i18n/locales/he-IL.ts), כולל הכינויים של Obsidian (hint → טיפ,
// faq → שאלה…). כותרת שכתבתם בעצמכם לא משתנה.

import type { Element, Root } from "hast"
import { toText } from "hast-util-to-text"
import { visit } from "unist-util-visit"
import { i18n } from "../../quartz/i18n"
import type { QuartzTransformerPluginInstance } from "../../quartz/plugins/types"

// הכינויים של Obsidian, לסוג שיש לו תרגום.
const ALIASES: Record<string, string> = {
  summary: "abstract",
  tldr: "abstract",
  hint: "tip",
  important: "tip",
  check: "success",
  done: "success",
  help: "question",
  faq: "question",
  caution: "warning",
  attention: "warning",
  fail: "failure",
  missing: "failure",
  error: "danger",
  cite: "quote",
}

const hasClass = (node: Element, name: string) =>
  Array.isArray(node.properties?.className) && node.properties.className.includes(name)

export const CalloutTitles = (): QuartzTransformerPluginInstance => ({
  name: "HebrewCalloutTitles",
  htmlPlugins(ctx) {
    const names = i18n(ctx.cfg.configuration.locale).components.callout as unknown as Record<string, string>
    return [
      () => (tree: Root) => {
        visit(tree, "element", (node: Element) => {
          if (!hasClass(node, "callout")) return
          const type = String(node.properties?.dataCallout ?? "").toLowerCase()
          const name = names[type] ?? names[ALIASES[type] ?? ""]
          if (!name) return
          visit(node, "element", (inner: Element) => {
            if (!hasClass(inner, "callout-title-inner")) return
            // רק כותרת ברירת מחדל: שם הסוג עצמו, באותיות כלשהן.
            if (toText(inner).trim().toLowerCase() !== type) return "skip"
            inner.children = [{ type: "text", value: name }]
            return "skip"
          })
        })
      },
    ]
  },
})
