// ראש עמוד הבית: שורת פתיחה, כותרת, משפט הסבר, שני כפתורים, ותמונה של חלון
// דפדפן עם האתר עצמו, מימין לשמאל (גם כפתורי החלון בצד ימין, כמו ב-macOS בעברית).
// בשאר העמודים הרכיב לא מצייר כלום.
//
// התמונה היא SVG שנכתב לתוך העמוד: היא הדבר הגדול ביותר במסך הראשון, ובקשה
// נפרדת הייתה מעכבת את הרגע שבו העמוד נראה מוכן. הצבעים באים ממחלקות ב-custom.scss,
// כך שהיא עוברת למצב כהה יחד עם העמוד.

import type { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { resolveRelative, type FullSlug } from "../../quartz/util/path"
import { chapterList } from "./chapters"
import { Icon, type IconName } from "./icons"

const row = (y: number, width: number, current = false, number = "") =>
  `${current ? `<rect class="a-current" x="402" y="${y - 13}" width="130" height="20" rx="6"/>` : ""}` +
  `<text class="${current ? "a-num a-num-on" : "a-num"}" x="528" y="${y}" direction="rtl" text-anchor="start">${number}</text>` +
  `<rect class="${current ? "a-line a-line-on" : "a-line"}" x="${506 - width}" y="${y - 7}" width="${width}" height="6" rx="3"/>`

const ART = `
<svg class="hd-hero-art" viewBox="0 0 560 400" role="img" aria-labelledby="hd-art-title">
  <title id="hd-art-title">חלון דפדפן ובו אתר תיעוד בעברית: רשימת הפרקים מימין, הכותרת "ברוכים הבאים", תיבת טיפ ובלוק קוד.</title>
  <rect class="a-window" x="20" y="20" width="520" height="420" rx="14"/>
  <path class="a-rule" d="M20 54h520"/>
  <circle class="a-dot a-dot-1" cx="516" cy="37" r="5"/>
  <circle class="a-dot a-dot-2" cx="498" cy="37" r="5"/>
  <circle class="a-dot a-dot-3" cx="480" cy="37" r="5"/>
  <rect class="a-address" x="170" y="28" width="220" height="18" rx="9"/>
  <text class="a-url" x="280" y="41" text-anchor="middle" direction="ltr">mta-notes.github.io</text>

  <rect class="a-panel" x="392" y="55" width="147" height="384"/>
  <rect class="a-logo" x="510" y="70" width="18" height="18" rx="5"/>
  <text class="a-logo-letter" x="519" y="84" text-anchor="middle">א</text>
  <text class="a-site" x="502" y="84" direction="rtl" text-anchor="start">Quartz בעברית</text>
  <rect class="a-search" x="404" y="100" width="124" height="22" rx="6"/>
  <text class="a-group" x="528" y="148" direction="rtl" text-anchor="start">צעדים ראשונים</text>
  ${row(168, 80, true, "01")}${row(190, 64, false, "02")}${row(212, 88, false, "03")}
  <text class="a-group" x="528" y="244" direction="rtl" text-anchor="start">כתיבה</text>
  ${row(264, 72, false, "01")}${row(286, 90, false, "02")}${row(308, 60, false, "03")}
  <text class="a-group" x="528" y="340" direction="rtl" text-anchor="start">התאמה אישית</text>
  ${row(360, 76, false, "01")}${row(382, 58, false, "02")}

  <text class="a-eyebrow" x="372" y="90" direction="rtl" text-anchor="start">צעדים ראשונים</text>
  <text class="a-title" x="372" y="120" direction="rtl" text-anchor="start">ברוכים הבאים</text>
  <rect class="a-text" x="60" y="174" width="312" height="7" rx="3.5"/>
  <rect class="a-text" x="96" y="190" width="276" height="7" rx="3.5"/>
  <rect class="a-text" x="168" y="206" width="204" height="7" rx="3.5"/>

  <rect class="a-callout" x="40" y="228" width="332" height="64" rx="8"/>
  <rect class="a-callout-edge" x="368" y="228" width="4" height="64" rx="2"/>
  <circle class="a-callout-icon" cx="350" cy="248" r="7"/>
  <text class="a-callout-title" x="336" y="253" direction="rtl" text-anchor="start">טיפ</text>
  <rect class="a-callout-text" x="84" y="268" width="270" height="7" rx="3.5"/>

  <rect class="a-code" x="40" y="308" width="332" height="84" rx="8"/>
  <text class="a-mono" x="58" y="334" direction="ltr"><tspan class="a-mono-dim">$</tspan> <tspan class="a-mono-key">npx</tspan> quartz build <tspan class="a-mono-dim">--serve</tspan></text>
  <text class="a-mono a-mono-dim" x="58" y="356" direction="ltr">Started a server on localhost:8080</text>
  <text class="a-mono a-mono-ok" x="58" y="378" direction="ltr">✓ Done in 1.2s</text>
</svg>`

interface Options {
  /** השורה הקטנה מעל הכותרת. */
  eyebrow: string
  /** הכותרת, והמילים שבסופה שמצוירות בצבע המבטא. */
  title: string
  titleAccent: string
  lead: string
  /** הכפתור הראשי. בלי href הוא מוביל לפרק הראשון. */
  primary: { text: string; href?: string }
  secondary: { text: string; href: string; icon: IconName }
}

export default ((opts: Options) => {
  const HomeHero: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
    const slug = fileData.slug as FullSlug
    if (slug !== "index") return null
    const first = chapterList(allFiles)[0]
    const primaryHref = opts.primary.href ?? (first ? resolveRelative(slug, first.slug as FullSlug) : "#")
    return (
      <section class="hd-hero" id="hd-content" tabindex={-1} aria-labelledby="hd-hero-title">
        <div class="hd-hero-text">
          <p class="hd-hero-eyebrow">
            <span class="hd-hero-badge" aria-hidden="true">
              א
            </span>
            {opts.eyebrow}
          </p>
          <h1 id="hd-hero-title">
            {opts.title} <span class="hd-hero-accent">{opts.titleAccent}</span>
          </h1>
          <p class="hd-hero-lead">{opts.lead}</p>
          <div class="hd-hero-actions">
            <a class="hd-button hd-button-primary" href={primaryHref}>
              {opts.primary.text}
              <Icon name="arrowForward" class="hd-forward" />
            </a>
            <a class="hd-button" href={opts.secondary.href}>
              <Icon name={opts.secondary.icon} />
              {opts.secondary.text}
            </a>
          </div>
        </div>
        <div class="hd-hero-picture" dangerouslySetInnerHTML={{ __html: ART }} />
      </section>
    )
  }
  return HomeHero
}) satisfies QuartzComponentConstructor<Options>
