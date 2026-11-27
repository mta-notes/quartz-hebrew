// תחתית כל עמוד, שורה אחת לרוחב כל העמוד: מימין שם האתר והשנה, משמאל
// הקישורים של האתר ומתג מצב בהיר/כהה (אייקון בלבד).
//
// המתג מצויר כאן, אבל מה שהוא עושה שייך ל-Quartz: הסקריפט של רכיב darkmode
// (theme/site.ts מעביר אותו לכאן) מוצא כל אלמנט עם המחלקה darkmode, הופך את
// saved-theme של העמוד וזוכר את הבחירה. האייקון מראה מה לחיצה תעשה: ירח בעמוד
// בהיר ("מצב כהה"), שמש בעמוד כהה ("מצב בהיר").

import type { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { pathToRoot, type FullSlug } from "../../quartz/util/path"

interface Options {
  /** מימין: "© 2026 <name>". */
  name: string
  year: number
  license?: { text: string; href: string }
  /** hideOnPhone: לא מוצג בטלפון (מתחת ל-640px), כדי שהפוטר יישאר שורה אחת. */
  links: { text: string; href: string; hideOnPhone?: boolean }[]
  toggle?: QuartzComponent
}

export default ((opts: Options) => {
  const Toggle = opts.toggle
  // קישור שמתחיל ב-"/" הוא בתוך האתר: הוא נכתב יחסית לעמוד, כדי שיעבוד גם
  // כשהאתר מפורסם תחת נתיב (mta-notes.github.io/quartz-hebrew/).
  const SiteFooter: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    const root = pathToRoot((fileData.slug ?? "index") as FullSlug)
    const href = (link: string) => (link.startsWith("/") && !link.startsWith("//") ? `${root}${link}` : link)
    return (
    <footer class="hd-footer">
      <p class="hd-footer-name">
        © {opts.year} {opts.name}
        {opts.license && (
          <>
            <span class="hd-footer-extra" aria-hidden="true">
              {" · "}
            </span>
            <a class="hd-footer-extra" href={opts.license.href}>
              {opts.license.text}
            </a>
          </>
        )}
      </p>
      <ul>
        {opts.links.map((link) => (
          <li class={link.hideOnPhone ? "hd-footer-extra" : undefined}>
            <a href={href(link.href)}>{link.text}</a>
          </li>
        ))}
        {Toggle && (
          <li>
            <button type="button" class="darkmode hd-theme">
              <span class="hd-to-dark" title="מצב כהה">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
                <span class="hd-sr">מצב כהה</span>
              </span>
              <span class="hd-to-light" title="מצב בהיר">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
                <span class="hd-sr">מצב בהיר</span>
              </span>
            </button>
          </li>
        )}
      </ul>
    </footer>
    )
  }
  SiteFooter.css = Toggle?.css
  SiteFooter.beforeDOMLoaded = Toggle?.beforeDOMLoaded
  SiteFooter.afterDOMLoaded = Toggle?.afterDOMLoaded
  return SiteFooter
}) satisfies QuartzComponentConstructor<Options>
