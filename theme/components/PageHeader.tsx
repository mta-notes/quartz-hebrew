// ראש כל עמוד חוץ מעמוד הבית: פס צבעוני עם שם קבוצת הפרקים, הכותרת, זמן
// הקריאה ומתי העמוד השתנה לאחרונה (קישור להיסטוריה שלו ב-GitHub). מספר הפרק
// מופיע בגדול בקצה הפס, כקישוט. ברוחבים שאין בהם עמודת תוכן עניינים, רשימה
// מקופלת "בעמוד הזה" מתחת לכותרת מראה את סעיפי העמוד.
//
// הוא מחליף שלושה רכיבים של Quartz (פירורי לחם, כותרת המאמר ושורת התאריך;
// quartz.config.yaml מכבה אותם).

import type { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import type { FullSlug } from "../../quartz/util/path"
import { chapterList, minutesToRead, readingTimeLabel } from "./chapters"

// Lucide icons (ISC License).
const ICON = {
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  history: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
}

const Icon = ({ name }: { name: keyof typeof ICON }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICON[name] }} />
)

interface TocEntry {
  depth: number
  text: string
  slug: string
}

interface Options {
  repository: string
  branch: string
  contentDir: string
}

export default ((opts: Options) => {
  const PageHeader: QuartzComponent = ({ fileData, cfg, allFiles }: QuartzComponentProps) => {
    const slug = fileData.slug as FullSlug
    // לעמוד הבית יש ראש משלו (HomeHero.tsx); לעמוד 404 אין.
    if (slug === "index" || slug === "404") return null

    const title = String(fileData.frontmatter?.title ?? "")
    const chapter = chapterList(allFiles).find((c) => c.slug === slug)

    const text = fileData.text
    const date = fileData.dates?.modified
    const relativePath = fileData.relativePath as string | undefined
    const history = relativePath
      ? `https://github.com/${opts.repository}/commits/${opts.branch}/${opts.contentDir}/${encodeURI(relativePath)}`
      : undefined
    const when = date?.toLocaleDateString(cfg.locale || "he-IL", { year: "numeric", month: "long", day: "numeric" })
    const stamp = date && when && (
      <time datetime={date.toISOString()}>
        <Icon name="history" />
        עודכן ב־{when}
      </time>
    )

    const toc = ((fileData as { toc?: TocEntry[] }).toc ?? []).filter((entry) => entry.text)

    return (
      <div class="hd-page-head" id="hd-content" tabindex={-1}>
        <div class={chapter ? "hd-band" : "hd-band hd-band-plain"}>
          <div class="hd-band-text">
            {chapter?.group && <p class="hd-band-eyebrow">{chapter.group}</p>}
            <h1 class="article-title">{title}</h1>
            {(text || stamp) && (
              <p class="hd-page-meta">
                {text && (
                  <span class="hd-chip">
                    <Icon name="clock" />
                    {readingTimeLabel(minutesToRead(text))}
                  </span>
                )}
                {stamp &&
                  (history ? (
                    <a class="hd-chip" href={history} title="מה השתנה בעמוד הזה">
                      {stamp}
                    </a>
                  ) : (
                    <span class="hd-chip">{stamp}</span>
                  ))}
              </p>
            )}
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
}) satisfies QuartzComponentConstructor<Options>
