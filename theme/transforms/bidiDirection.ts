// כיוון לכל פסקה לפי התוכן שלה.
//
// העמוד כולו RTL. פסקה, כותרת או תא בטבלה שאין בהם אף אות עברית (משפט
// באנגלית, ציטוט) מקבלים dir="ltr", כדי שהנקודה בסוף המשפט והסוגריים יופיעו
// במקום הנכון ולא יקפצו לצד השני. היישור נשאר לימין, כמו כל העמוד (custom.scss).
//
// למה לא dir="auto"? כי הוא קובע לפי האות החזקה הראשונה: "Quartz הוא מחולל
// אתרים" מתחיל באות לטינית והיה מקבל ltr, ומשפט עברי שלם היה מתהפך. כאן פסקה
// מקבלת ltr רק כשאין בה עברית בכלל. (פריטי רשימה לא: התבליט היה עובר לצד שמאל.)
//
// אפשר לכפות כיוון גם ידנית ב-Markdown, עם HTML: <p dir="ltr">…</p>.

import type { Element, ElementContent, Root } from "hast"
import { toText } from "hast-util-to-text"
import { visit } from "unist-util-visit"
import type { QuartzTransformerPluginInstance } from "../../quartz/plugins/types"

const BLOCKS = new Set(["p", "h1", "h2", "h3", "h4", "h5", "h6", "td", "th", "dt", "dd", "figcaption", "summary"])
// אותיות עבריות (כולל ניקוד וצורות מצגת) וערביות.
const RTL_LETTER = /[֐-׿יִ-ﭏ؀-ۿ]/
const LATIN_LETTER = /[A-Za-zÀ-ɏ]/

// מה שלא נחשב "תוכן" לצורך ההחלטה: קוד וקישורי עוגן של כותרות.
const ignored = (node: ElementContent) =>
  node.type === "element" &&
  (node.tagName === "code" ||
    node.tagName === "pre" ||
    (Array.isArray(node.properties?.className) && node.properties.className.includes("katex")))

function textOf(node: Element): string {
  return node.children
    .filter((child) => !ignored(child))
    .map((child) => (child.type === "element" ? toText(child) : child.type === "text" ? child.value : ""))
    .join("")
}

export const BidiDirection = (): QuartzTransformerPluginInstance => ({
  name: "HebrewBidiDirection",
  htmlPlugins() {
    return [
      () => (tree: Root) => {
        visit(tree, "element", (node: Element) => {
          if (!BLOCKS.has(node.tagName) || node.properties?.dir) return
          const text = textOf(node)
          if (!RTL_LETTER.test(text) && LATIN_LETTER.test(text)) {
            node.properties = { ...node.properties, dir: "ltr" }
          }
        })
      },
    ]
  },
})
