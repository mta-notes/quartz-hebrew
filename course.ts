// הגדרות הקורס: השם, הריפו, הכתובת והטקסטים של עמוד הבית. כל השאר (עיצוב,
// רכיבים, פריסה) נמצא ב-theme/ של ריפו הבסיס. scripts/assemble.mjs מעתיק את
// הקובץ הזה ל-quartz/quartz.ts לפני כל בנייה.
//
// בריפו הבסיס זה אתר ההדגמה; בכל ריפו קורס יש course.ts משלו.

import { createSite } from "./theme/site"

// owner/name של הריפו ב-GitHub. משמש לקישורי "עריכה", "היסטוריה" ו"שאלה".
const repository = "mta-notes/quartz-hebrew"

const site = await createSite({
  name: "Quartz בעברית",
  repository,
  baseUrl: "mta-notes.github.io/quartz-hebrew",
  branch: "main",
  contentDir: "content",

  hero: {
    eyebrow: "תבנית Quartz 5 מימין לשמאל",
    title: "אתר תיעוד,",
    titleAccent: "בעברית.",
    lead: "כותבים Markdown בעברית, ומקבלים אתר מהיר עם חיפוש, גרף קישורים, מצב כהה ותצוגה נוחה בטלפון. הכול מימין לשמאל, מהתפריט ועד הנוסחאות.",
    primary: { text: "להתחיל לקרוא" },
    secondary: { text: "הקוד ב-GitHub", href: `https://github.com/${repository}`, icon: "github" },
  },

  notFound: { homeText: "לעמוד הבית" },

  footer: {
    name: "Quartz בעברית",
    year: new Date().getFullYear(),
    license: { text: "רישיון MIT", href: `https://github.com/${repository}/blob/main/LICENSE` },
    links: [
      { text: "GitHub", href: `https://github.com/${repository}` },
      { text: "RSS", href: "/index.xml", hideOnPhone: true },
      { text: "נבנה עם Quartz", href: "https://quartz.jzhao.xyz", hideOnPhone: true },
    ],
  },
})

export default site.config
export const layout = site.layout
