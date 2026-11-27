// "דילוג לתוכן": הקישור הראשון בעמוד, גלוי רק כשמגיעים אליו במקלדת (Tab).
// מי שמנווט במקלדת או בקורא מסך לא צריך לעבור על כל רשימת הפרקים בכל עמוד.
// היעד, #hd-content, הוא ראש העמוד (PageHeader.tsx) או ראש עמוד הבית (HomeHero.tsx).

import type { QuartzComponent, QuartzComponentConstructor } from "../../quartz/components/types"

const SkipLink: QuartzComponent = () => (
  <a class="hd-skip" href="#hd-content">
    דילוג לתוכן
  </a>
)

export default (() => SkipLink) satisfies QuartzComponentConstructor
