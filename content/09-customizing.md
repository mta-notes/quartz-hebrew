---
title: צבעים, גופנים ורכיבים
group: התאמה אישית
description: איפה משנים את הצבעים, את הגופן, את הטקסטים ואת הרכיבים בעמוד.
---

## שם האתר וכתובתו

ב-`quartz.config.yaml`, תחת `configuration`:

```yaml
pageTitle: Quartz בעברית
pageTitleSuffix: " | Quartz בעברית"
locale: he-IL
baseUrl: mta-notes.github.io/quartz-hebrew
```

`locale: he-IL` הוא מה שהופך את כל האתר לעברית: Quartz כותב `<html lang="he" dir="rtl">`, וכל הטקסטים שלו (חיפוש, שמות תיבות ההערה, מצב כהה) בעברית.

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
