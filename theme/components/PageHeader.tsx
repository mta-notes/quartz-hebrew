// ראש כל עמוד חוץ מעמוד הבית: פס צבעוני עם שם קבוצת הפרקים והכותרת. מספר
// הפרק (המקום שלו בתוך הקבוצה) מופיע בגדול בקצה הפס, כקישוט. ברוחבים שאין בהם
// עמודת תוכן עניינים, רשימה מקופלת "בעמוד הזה" מתחת לכותרת מראה את סעיפי העמוד.
//
// הוא מחליף שלושה רכיבים של Quartz (פירורי לחם, כותרת המאמר ושורת התאריך;
// quartz.config.yaml מכבה אותם).

import type { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import type { FullSlug } from "../../quartz/util/path"
import { findChapter } from "./chapters"

interface TocEntry {
  depth: number
  text: string
  slug: string
}

export default (() => {
  const PageHeader: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
    const slug = fileData.slug as FullSlug
    // לעמוד הבית יש ראש משלו (HomeHero.tsx); לעמוד 404 אין.
    if (slug === "index" || slug === "404") return null

    const title = String(fileData.frontmatter?.title ?? "")
    const chapter = findChapter(allFiles, slug)

    const toc = ((fileData as { toc?: TocEntry[] }).toc ?? []).filter((entry) => entry.text)

    return (
      <div class="hd-page-head" id="hd-content" tabindex={-1}>
        <div class={chapter ? "hd-band" : "hd-band hd-band-plain"}>
          <div class="hd-band-text">
            {chapter?.group && <p class="hd-band-eyebrow">{chapter.group}</p>}
            <h1 class="article-title">{title}</h1>
          </div>
          {chapter?.number && (
            <span class="hd-band-number" aria-hidden="true">
              {chapter.number}
            </span>
          )}
        </div>
        {toc.length > 1 && (
          <details class="hd-onpage">
            <summary>בעמוד הזה</summary>
            <ul>
              {toc.map((entry) => (
                <li class={`depth-${entry.depth}`}>
                  <a href={`#${entry.slug}`}>{entry.text}</a>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    )
  }

  // בחירת סעיף סוגרת את הרשימה, כדי שלא תישאר פתוחה מעל העמוד.
  PageHeader.afterDOMLoaded = `
(() => {
  document.addEventListener("nav", () => {
    const list = document.querySelector(".hd-page-head .hd-onpage")
    if (!list) return
    const onClick = (event) => {
      if (event.target instanceof Element && event.target.closest("a")) list.open = false
    }
    list.addEventListener("click", onClick)
    if (window.addCleanup) window.addCleanup(() => list.removeEventListener("click", onClick))
  })
})()
`

  return PageHeader
}) satisfies QuartzComponentConstructor
