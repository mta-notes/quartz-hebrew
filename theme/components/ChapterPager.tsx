// בסוף כל פרק: הפרק הקודם והפרק הבא, לפי סדר הקריאה. ב-RTL "הקודם" בצד ימין
// עם חץ ימינה, ו"הבא" בצד שמאל עם חץ שמאלה, כמו דפים בספר עברי.
// גם קיצורי מקלדת: Alt+← לפרק הבא ו-Alt+→ לפרק הקודם (כשהסמן לא בשדה טקסט).

import type { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { resolveRelative, type FullSlug } from "../../quartz/util/path"
import { neighbours } from "./chapters"
import { Icon } from "./icons"

const ChapterPager: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const slug = fileData.slug as FullSlug
  if (slug === "index" || slug === "404") return null
  const { previous, next } = neighbours(allFiles, slug)
  if (!previous && !next) return null
  return (
    <nav class="hd-pager" aria-label="ניווט בין פרקים">
      {previous ? (
        <a class="hd-pager-link hd-pager-previous" href={resolveRelative(slug, previous.slug as FullSlug)} rel="prev">
          <span class="hd-pager-label">
            <Icon name="arrowBack" class="hd-back" />
            הפרק הקודם
          </span>
          <span class="hd-pager-title">{previous.title}</span>
        </a>
      ) : (
        <span />
      )}
      {next && (
        <a class="hd-pager-link hd-pager-next" href={resolveRelative(slug, next.slug as FullSlug)} rel="next">
          <span class="hd-pager-label">
            הפרק הבא
            <Icon name="arrowForward" class="hd-forward" />
          </span>
          <span class="hd-pager-title">{next.title}</span>
        </a>
      )}
    </nav>
  )
}

ChapterPager.afterDOMLoaded = `
(() => {
  const onKey = (event) => {
    if (!event.altKey || event.ctrlKey || event.metaKey) return
    const target = event.target
    if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return
    const rtl = document.documentElement.dir === "rtl"
    const forward = rtl ? "ArrowLeft" : "ArrowRight"
    const back = rtl ? "ArrowRight" : "ArrowLeft"
    const rel = event.key === forward ? "next" : event.key === back ? "prev" : null
    if (!rel) return
    const link = document.querySelector('.hd-pager a[rel="' + rel + '"]')
    if (link) {
      event.preventDefault()
      link.click()
    }
  }
  document.addEventListener("keydown", onKey)
})()
`

export default (() => ChapterPager) satisfies QuartzComponentConstructor
