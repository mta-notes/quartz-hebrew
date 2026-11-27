// Quartz שם בכל כותרת קישור "#" עם role="anchor" (שאינו תפקיד ARIA) ועם
// aria-hidden ריק, שטכנולוגיה מסייעת קוראת כ-"false". הקישור הוא נוחות לעכבר
// בלבד (הוא לא בסדר ה-Tab), אז הוא מוסתר כמו שצריך.
//
// בנוסף, Quartz מציג תצוגה מקדימה כשהעכבר עומד על קישור פנימי; לקישור הזה
// התצוגה הייתה העמוד שכבר פתוח, אז המחלקה internal מוסרת.

import type { Element, Root } from "hast"
import { visit } from "unist-util-visit"
import type { QuartzTransformerPluginInstance } from "../../quartz/plugins/types"

export const HeadingAnchors = (): QuartzTransformerPluginInstance => ({
  name: "HebrewHeadingAnchors",
  htmlPlugins() {
    return [
      () => (tree: Root) => {
        visit(tree, "element", (node: Element) => {
          if (node.tagName !== "a" || node.properties?.role !== "anchor") return
          delete node.properties.role
          node.properties.ariaHidden = "true"
          const classes = node.properties.className
          if (Array.isArray(classes)) node.properties.className = classes.filter((c) => c !== "internal")
        })
      },
    ]
  },
})
