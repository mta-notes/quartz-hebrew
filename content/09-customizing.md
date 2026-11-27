---
title: צבעים, גופנים ורכיבים
group: התאמה אישית
description: איפה משנים את הצבעים, את הגופן, את הטקסטים ואת הרכיבים בעמוד.
---

## שם האתר וכתובתו

ב-`course.ts` של הקורס:

```ts
const site = await createSite({
  name: "Quartz בעברית",
  repository: "mta-notes/quartz-hebrew",
  baseUrl: "mta-notes.github.io/quartz-hebrew",
  …
})
```

`name` הופך לכותרת האתר, לסיומת של כל `<title>` (` | Quartz בעברית`) ולשם שבפוטר. `quartz.config.yaml` של הבסיס משותף לכל הקורסים ולא כותב שם של אף אחד. בו נמצא `locale: he-IL`, שהוא מה שהופך את כל האתר לעברית: Quartz כותב `<html lang="he" dir="rtl">`, וכל הטקסטים שלו (חיפוש, שמות תיבות ההערה, מצב כהה) בעברית.

## צבעים

באותו קובץ, תחת `theme.colors`, יש שתי ערכות: `lightMode` ו-`darkMode`. הצבע הראשי של האתר הוא `secondary`, והגוון הכהה שלו לריחוף הוא `tertiary`.

> [!warning] ניגודיות
> צבע טקסט צריך ניגודיות של לפחות 4.5:1 מול הרקע שלו (WCAG AA). הצבעים בתבנית עומדים בזה בשני המצבים; כדאי לבדוק כל צבע חדש, למשל ב-[WebAIM](https://webaim.org/resources/contrastchecker/).

## גופן

הגופן הוא Heebo, שמכסה עברית ואנגלית באותו עיצוב, וקוד בגופן JetBrains Mono. הקבצים נמצאים ב-`theme/static/fonts/` ומוגדרים בראש `theme/custom.scss`. כדי להחליף גופן (למשל ל-Assistant, Rubik או Frank Ruhl Libre):

1. מורידים את קובצי ה-woff2 שלו (למשל מ-[Fontsource](https://fontsource.org)) לתיקייה.
2. מחליפים את ה-`@font-face` ב-`custom.scss`.
3. מעדכנים את `--bodyFont` ו-`--headerFont` באותו קובץ.

## שם, טקסטים וקישורים

`course.ts` מחזיק את כל מה שהאתר אומר מעבר לעמודים: שם הקורס (בכותרת, בלשונית הדפדפן ובפוטר), הכותרת והכפתורים בעמוד הבית, הכתובת שבה האתר מתפרסם, והריפו ב-GitHub שאליו מובילים "לערוך את העמוד" ו"לדווח על טעות". בפוטר כתוב "נערך על ידי ניב"; קורס שנערך על ידי מישהו אחר כותב `footer: { editedBy: "…" }`.

## הרכיבים

| רכיב | קובץ | מה הוא עושה |
| --- | --- | --- |
| רשימת הפרקים | `ChapterNav.tsx` | הפרקים בקבוצות, ומגירה בטלפון |
| ראש העמוד | `PageHeader.tsx` | קבוצה, כותרת ומספר הפרק |
| עמוד הבית | `HomeHero.tsx`, `HomeChapters.tsx` | הכותרת הגדולה וכרטיסי הפרקים |
| תוכן העניינים | `TableOfContents.tsx` | מסמן את הסעיף הנוכחי ואת ההתקדמות |
| ניווט בין פרקים | `ChapterPager.tsx` | הקודם והבא, וקיצורי מקלדת |
| קישורי העמוד | `PageActions.tsx` | "לדווח על טעות" ו"לערוך את העמוד" |
| פוטר | `SiteFooter.tsx` | שם הקורס, "נערך על ידי" ומתג מצב כהה |
| עמוד 404 | `NotFound.tsx` | כתובת שלא קיימת |

`theme/site.ts` מציב אותם בפריסה. שימו לב שב-Quartz האזורים נקראים `left` ו-`right`, אבל ב-RTL הם מתהפכים: `left` (רשימת הפרקים) מוצג מימין.

## לכל הקורסים או לקורס אחד

שינוי בריפו הבסיס (`theme/`, `quartz.config.yaml`) מגיע לכל הקורסים בבנייה הבאה שלהם. שינוי שמתאים רק לקורס אחד נכתב בתיקייה `overrides/` של אותו קורס:

| קובץ | מה הוא עושה |
| --- | --- |
| `overrides/custom.scss` | נטען אחרי `theme/custom.scss` של הבסיס, ולכן גובר עליו. |
| `overrides/config.yaml` | מתמזג לתוך `quartz.config.yaml` של הבסיס. `plugins` ממוזג לפי `source`. |
| `overrides/static/` | קבצים שמחליפים את אלה של הבסיס באותו שם, כמו `logo.svg`. |
