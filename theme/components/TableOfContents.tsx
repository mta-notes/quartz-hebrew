// תוכן העניינים, בראש העמודה הצדדית (שב-RTL מוצגת משמאל). הוא מחליף את זה של
// Quartz (התוסף table-of-contents עדיין קורא את הכותרות), משתי סיבות:
//   - של Quartz הוא כפתור שמקפל את הרשימה, וכאן היא תמיד פתוחה;
//   - הוא מסמן את הסעיף שקוראים עכשיו, וכשהרשימה ארוכה מהתיבה שלה הוא גולל
//     אותה כדי שהסעיף המסומן יישאר גלוי.
// בנוסף, פס דק לאורך הרשימה מראה כמה מהעמוד כבר נקרא.

import type { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"

interface TocEntry {
  depth: number
  text: string
  slug: string
}

const TableOfContents: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const toc = (fileData as { toc?: TocEntry[] }).toc
  if (!toc || toc.length === 0) return null
  return (
    <nav class="toc" aria-labelledby="hd-toc-title">
      <h3 class="toc-header" id="hd-toc-title">
        תוכן העניינים
      </h3>
      <div class="hd-toc-body">
        <span class="hd-toc-progress" aria-hidden="true" />
        <ul class="toc-content">
          {toc.map((entry) => (
            <li class={`depth-${entry.depth}`}>
              <a href={`#${entry.slug}`} data-for={entry.slug}>
                {entry.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

TableOfContents.afterDOMLoaded = `
(() => {
  function setup() {
    const list = document.querySelector(".toc .toc-content")
    if (!list) return
    const progress = document.querySelector(".toc .hd-toc-progress")
    const entries = [...list.querySelectorAll("a[data-for]")]
      .map((link) => ({ link, heading: document.getElementById(link.dataset.for) }))
      .filter((entry) => entry.heading)
    if (entries.length === 0) return

    let marked = -2
    let frame

    // גולל את הרשימה, אף פעם לא את העמוד, כך שהסעיף יהיה באמצע.
    function reveal(link) {
      const box = list.getBoundingClientRect()
      const item = link.getBoundingClientRect()
      if (item.top >= box.top + 8 && item.bottom <= box.bottom - 8) return
      const top = list.scrollTop + item.top - box.top - (box.height - item.height) / 2
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      list.scrollTo({ top, behavior: calm ? "auto" : "smooth" })
    }

    function update() {
      frame = undefined
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      if (progress) progress.style.setProperty("--hd-read", String(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 1))

      // הסעיף שקוראים מתחיל בכותרת האחרונה שהגיעה לקו הזה, קצת מתחת לראש המסך.
      const line = Math.min(window.innerHeight * 0.3, 240)
      let index = -1
      for (let i = 0; i < entries.length; i++) {
        if (entries[i].heading.getBoundingClientRect().top <= line) index = i
        else break
      }
      if (index === -1 && entries[0].heading.getBoundingClientRect().top < window.innerHeight) index = 0
      // בסוף העמוד, הסעיף האחרון יכול להיות קצר מכדי שכותרתו תגיע לקו.
      const atEnd = window.scrollY > 0 && window.innerHeight + window.scrollY >= doc.scrollHeight - 2
      if (atEnd) index = entries.length - 1

      if (index === marked) return
      marked = index
      entries.forEach((entry, i) => {
        entry.link.classList.toggle("current", i === index)
        if (i === index) entry.link.setAttribute("aria-current", "location")
        else entry.link.removeAttribute("aria-current")
      })
      if (index >= 0) reveal(entries[index].link)
    }

    const request = () => {
      if (frame === undefined) frame = requestAnimationFrame(update)
    }
    window.addEventListener("scroll", request, { passive: true })
    window.addEventListener("resize", request, { passive: true })
    if (window.addCleanup) {
      window.addCleanup(() => {
        window.removeEventListener("scroll", request)
        window.removeEventListener("resize", request)
        if (frame !== undefined) cancelAnimationFrame(frame)
      })
    }
    update()
  }

  document.addEventListener("nav", setup)
})()
`

export default (() => TableOfContents) satisfies QuartzComponentConstructor
