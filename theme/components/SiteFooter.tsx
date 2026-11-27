// תחתית כל עמוד, שורה אחת לרוחב כל העמוד, בכל רוחב: מימין שם הקורס, משמאל
// "נערך על ידי <editedBy>" ומתג מצב בהיר/כהה (אייקון בלבד). שם ארוך נחתך ב-…
// ולא דוחף את הצד השמאלי לשורה שנייה.
//
// המתג מצויר כאן, אבל מה שהוא עושה שייך ל-Quartz: הסקריפט של רכיב darkmode
// (theme/site.ts מעביר אותו לכאן) מוצא כל אלמנט עם המחלקה darkmode, הופך את
// saved-theme של העמוד וזוכר את הבחירה. האייקון מראה מה לחיצה תעשה: ירח בעמוד
// בהיר ("מצב כהה"), שמש בעמוד כהה ("מצב בהיר").

import type { QuartzComponent, QuartzComponentConstructor } from "../../quartz/components/types"

interface Options {
  /** מימין: שם הקורס, מ-name שב-course.ts. */
  name: string
  /** משמאל: "נערך על ידי <editedBy>". */
  editedBy: string
  toggle?: QuartzComponent
}

export default ((opts: Options) => {
  const Toggle = opts.toggle
  const SiteFooter: QuartzComponent = () => (
    <footer class="hd-footer">
      <p class="hd-footer-name" title={opts.name}>
        {opts.name}
      </p>
      <div class="hd-footer-end">
        <span>נערך על ידי {opts.editedBy}</span>
        {Toggle && (
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
        )}
      </div>
    </footer>
  )
  SiteFooter.css = Toggle?.css
  SiteFooter.beforeDOMLoaded = Toggle?.beforeDOMLoaded
  SiteFooter.afterDOMLoaded = Toggle?.afterDOMLoaded
  return SiteFooter
}) satisfies QuartzComponentConstructor<Options>
