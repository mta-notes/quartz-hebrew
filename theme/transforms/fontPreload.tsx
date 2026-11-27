// הדפדפן מגלה את הגופנים רק אחרי שקרא את ה-CSS שמגדיר אותם. preload ב-<head>
// מתחיל להוריד את הגופן העברי מיד, כך שהטקסט הראשון מופיע בגופן שלו מוקדם יותר.
// (12KB בלבד: Heebo מחולק לפי אלפבית, והעברית לבדה קטנה.)

import type { QuartzTransformerPluginInstance } from "../../quartz/plugins/types"
import type { QuartzPluginData } from "../../quartz/plugins/vfile"
import { pathToRoot, type FullSlug } from "../../quartz/util/path"

const FILES = ["static/fonts/heebo-hebrew-wght-normal.woff2", "static/fonts/heebo-latin-wght-normal.woff2"]

export const FontPreload = (): QuartzTransformerPluginInstance => ({
  name: "HebrewFontPreload",
  externalResources() {
    return {
      // לא בעמוד 404: הוא מוגש בכל כתובת חסרה, וקישור יחסי ממנו לא יוביל לשום מקום.
      additionalHead: FILES.map(
        (file) => (page: QuartzPluginData) =>
          page.slug === "404" ? (
            <></>
          ) : (
            <link
              rel="preload"
              href={`${pathToRoot((page.slug ?? "index") as FullSlug)}/${file}`}
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
            />
          ),
      ),
    }
  },
})
