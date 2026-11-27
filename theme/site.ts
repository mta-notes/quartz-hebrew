// מה שהאתר בונה תמיד באותה דרך. quartz.ts (בשורש הריפו) נותן רק את הטקסטים
// והקישורים של האתר:
//
//   import { createSite } from "./theme/site"
//   const site = await createSite({ … })
//   export default site.config
//   export const layout = site.layout
//
// scripts/assemble.mjs מעתיק את theme/ לתוך תיקיית Quartz, ולכן הנתיבים כאן
// הם הנתיבים שבתוכה.

import { loadQuartzConfig, loadQuartzLayout } from "../quartz/plugins/loader/config-loader"
import ChapterNav from "./components/ChapterNav"
import ChapterPager from "./components/ChapterPager"
import HomeChapters from "./components/HomeChapters"
import HomeHero from "./components/HomeHero"
import NotFound from "./components/NotFound"
import PageActions from "./components/PageActions"
import PageHeader from "./components/PageHeader"
import SiteFooter from "./components/SiteFooter"
import SkipLink from "./components/SkipLink"
import TableOfContents from "./components/TableOfContents"
import { BidiDirection } from "./transforms/bidiDirection"
import { CalloutTitles } from "./transforms/calloutTitles"
import { FontPreload } from "./transforms/fontPreload"
import { HeadingAnchors } from "./transforms/headingAnchors"

type Options<T extends (...args: never[]) => unknown> = NonNullable<Parameters<T>[0]>

export interface SiteOptions {
  /** owner/name של הריפו ב-GitHub, לקישורי "עריכה" ו"היסטוריה". */
  repository: string
  /** הענף הראשי שלו. */
  branch: string
  /** התיקייה שבה העמודים כתובים בריפו. */
  contentDir: string
  hero: Options<typeof HomeHero>
  notFound: Omit<Options<typeof NotFound>, "repository">
  /** קבוצת הקישורים של האתר בעמודה הצדדית. */
  rail?: NonNullable<Options<typeof PageActions>["extra"]>
  footer: Omit<Options<typeof SiteFooter>, "toggle">
}

export async function createSite(site: SiteOptions) {
  const { repository, branch, contentDir } = site

  const config = await loadQuartzConfig()
  config.plugins.transformers.push(CalloutTitles(), BidiDirection(), HeadingAnchors(), FontPreload())

  // עמוד 404 משלנו, במקום הכותרת הריקה של Quartz.
  const notFound = config.plugins.pageTypes?.find((pageType) => pageType.name === "404")
  if (notFound) {
    notFound.body = () => NotFound({ ...site.notFound, repository })
  }

  // הפריסה ש-quartz.config.yaml בונה, עם הרכיבים של האתר.
  // שימו לב: "left" ו-"right" הם שמות האזורים של Quartz. ב-dir="rtl" הרשת
  // מתהפכת, ולכן "left" (רשימת הפרקים) מוצג בצד ימין ו-"right" (תוכן העניינים) בצד שמאל.
  const base = await loadQuartzLayout()
  const [toggle] = base.defaults.footer ?? []
  const layout = await loadQuartzLayout({
    defaults: {
      left: [SkipLink(), ...(base.defaults.left ?? []), ChapterNav()],
      right: [
        TableOfContents(),
        ...(base.defaults.right ?? []).filter((component) => component.name !== "TableOfContents"),
        PageActions({ repository, branch, contentDir, place: "rail", extra: site.rail }),
      ],
      beforeBody: [HomeHero(site.hero), PageHeader({ repository, branch, contentDir }), ...(base.defaults.beforeBody ?? [])],
      afterBody: [
        HomeChapters(),
        ...(base.defaults.afterBody ?? []),
        ChapterPager(),
        // אותם קישורים מתחת למאמר, ברוחבים שאין בהם עמודה צדדית.
        PageActions({ repository, branch, contentDir, place: "end" }),
      ],
      footer: [SiteFooter({ ...site.footer, toggle })],
    },
  })

  return { config, layout }
}
