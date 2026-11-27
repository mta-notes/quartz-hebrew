// הגדרות הקורס: הקובץ היחיד שחובה לערוך בקורס חדש. כל השאר (עיצוב, רכיבים,
// פריסה) מגיע מריפו הבסיס, mta-notes/quartz-hebrew, שנמשך ל-.theme/ בכל בנייה.

import { createSite } from "./theme/site"

const repository = "__REPOSITORY__"

const site = await createSite({
  name: "__NAME__",
  repository,
  baseUrl: "__BASEURL__",

  hero: {
    eyebrow: "סיכומי הקורס",
    title: "__NAME__,",
    titleAccent: "בעברית.",
    lead: "כל החומר של הקורס, מסודר לפי נושאים, עם חיפוש ומצב כהה.",
    primary: { text: "להתחיל לקרוא" },
    secondary: { text: "הקוד ב-GitHub", href: `https://github.com/${repository}`, icon: "github" },
  },
})

export default site.config
export const layout = site.layout
