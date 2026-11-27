<div dir="rtl">

# Quartz בעברית

תבנית [Quartz](https://quartz.jzhao.xyz) 5 לאתרי סיכומים בעברית, מימין לשמאל מההתחלה ועד הסוף. הריפו הזה הוא **הבסיס המשותף** של כל אתרי הקורסים: העיצוב, הרכיבים, ההגדרות ותהליך הפרסום. לכל קורס יש ריפו משלו, ובו רק מה שייחודי לו.

התוכן שב-`content/` הוא אתר הדגמה, כדי לראות שינויי עיצוב לפני שהם מגיעים לקורסים.

## המבנה

```
mta-notes/quartz-hebrew          הבסיס (הריפו הזה)
  theme/                         העיצוב והרכיבים של כל הקורסים
  quartz.config.yaml             הגדרות Quartz המשותפות
  quartz-version.txt             גרסת Quartz של כל הקורסים
  scripts/                       הרכבה, בנייה, תצוגה מקומית, קורס חדש
  .github/workflows/
    build-course.yml             תהליך הבנייה והפרסום שכל קורס קורא לו
    rebuild-courses.yml          בונה מחדש את כל הקורסים אחרי שינוי בבסיס
  course-template/               התבנית לריפו קורס חדש
  courses.txt                    רשימת ריפואי הקורסים
  content/, course.ts            אתר ההדגמה

mta-notes/<קורס>                 ריפו של קורס
  content/                       העמודים של הקורס
  course.ts                      שם, ריפו, כתובת, עמוד הבית
  overrides/                     אופציונלי: עיצוב והגדרות לקורס הזה בלבד
  theme-version.txt              ענף או תג של הבסיס (ברירת מחדל: main)
  dev.sh, build.sh               מושכים את הבסיס ל-.theme/ וקוראים לסקריפטים שלו
  .github/workflows/deploy.yml   קורא ל-build-course.yml של הבסיס
```

## איפה עושים שינוי

- **לכל הקורסים:** כאן, בבסיס. `theme/custom.scss` לעיצוב, `theme/components/` לרכיבים, `quartz.config.yaml` להגדרות. כל קורס מקבל את השינוי בבנייה הבאה שלו (ומיד, אם `rebuild-courses.yml` מוגדר).
- **לקורס אחד:** ב-`overrides/` של הקורס. `custom.scss` נטען אחרי העיצוב של הבסיס; `config.yaml` מתמזג לתוך `quartz.config.yaml` (מערך `plugins` ממוזג לפי `source`); `static/` מחליף קבצים כמו `logo.svg` ו-`icon.png`.
- **שם, ריפו וכתובת של קורס:** רק ב-`course.ts` שלו. שום מקום אחר לא כותב אותם.

## הרצה מקומית

צריך Node.js 22 ומעלה ו-Git.

```bash
./dev.sh
```

בפעם הראשונה הסקריפט מתקין את Quartz (בגרסה שב-`quartz-version.txt`) לתיקייה `quartz/`. האתר עולה ב-http://localhost:8080, ועמודים מתעדכנים בדפדפן מיד כששומרים. אחרי שינוי ב-`theme/`, ב-`course.ts` או ב-`quartz.config.yaml`: עוצרים (Ctrl+C) ומריצים שוב.

באותה דרך בריפו של קורס: `./dev.sh` מושך את הבסיס ל-`.theme/` (ומעדכן אותו בכל הרצה) ומגיש את הקורס.

### לפתח את הבסיס על קורס אמיתי

`THEME_DIR` אומר לקורס להשתמש בעותק מקומי של הבסיס במקום `.theme/`, בלי לגעת בו:

```bash
cd ../algorithms
THEME_DIR=../quartz-hebrew ./dev.sh
```

עורכים את `theme/` בבסיס, עוצרים ומריצים שוב, ורואים את התוצאה על התוכן של הקורס.

## קורס חדש

```bash
scripts/new-course.sh mta-notes/algorithms "אלגוריתמים" ../algorithms
cd ../algorithms
git init -b main && git add -A && git commit -m "Start the algorithms course site"
gh repo create mta-notes/algorithms --public --source . --push
```

הסקריפט מעתיק את `course-template/` וממלא את `course.ts` בשם, בריפו ובכתובת (`mta-notes.github.io/algorithms`). אחר כך:

1. ב-GitHub של הקורס: **Settings ← Pages ← Source: GitHub Actions**.
2. מוסיפים את הריפו לשורה חדשה ב-`courses.txt` של הבסיס.
3. כותבים את העמודים ב-`content/`: שם הקובץ קובע את הסדר, ו-`group` בראש הקובץ קובע את הנושא. המספור מתחיל מ-01 בכל נושא.

## פרסום

`./build.sh` בונה את האתר לתיקייה `public/`. ב-GitHub, `deploy.yml` של כל ריפו (גם של הבסיס, לאתר ההדגמה) קורא ל-`build-course.yml` בכל push ל-`main`: מושך את הבסיס, מתקין את Quartz (עם מטמון לפי הגרסה), בונה ומפרסם ב-GitHub Pages.

### לבנות מחדש את כל הקורסים אחרי שינוי בבסיס

בלי הגדרה נוספת, קורס מקבל שינוי בבסיס בפעם הבאה שהוא נבנה. כדי שכל push ל-`main` של הבסיס יבנה מחדש מיד את כל הקורסים שב-`courses.txt`, `rebuild-courses.yml` צריך טוקן:

1. ב-GitHub: **Settings ← Developer settings ← Personal access tokens ← Fine-grained tokens ← Generate new token**.
2. **Resource owner:** `mta-notes`. **Repository access:** רק ריפואי הקורסים.
3. **Permissions ← Repository permissions ← Actions:** Read and write.
4. בריפו הבסיס: **Settings ← Secrets and variables ← Actions ← New repository secret**, בשם `COURSES_TOKEN`, עם הטוקן.

בלי ה-secret הזה, התהליך מדלג בשקט.

## מה יש כאן

| קובץ | מה הוא עושה |
| --- | --- |
| `content/` | העמודים של אתר ההדגמה. שם הקובץ קובע את הסדר; `title`, `group` ו-`description` בראש הקובץ. |
| `course.ts` | ההגדרות של אתר ההדגמה: `name`, `repository`, `baseUrl` ועמוד הבית. |
| `quartz.config.yaml` | ההגדרות המשותפות של Quartz: `locale: he-IL`, צבעים, גופנים, תוספים. |
| `theme/site.ts` | `createSite`: מציב את `name` ואת `baseUrl` בהגדרות, ובונה את הפריסה. |
| `theme/custom.scss` | כל העיצוב, במאפיינים לוגיים (`inline-start` במקום `left`). |
| `theme/components/` | הרכיבים: רשימת פרקים ומגירה, ראש עמוד, תוכן עניינים, פרק קודם/הבא, קישורי העמוד, פוטר, 404. |
| `theme/transforms/` | עיבוד העמודים: כיוון לפסקאות באנגלית, כותרות הערה בעברית, עוגנים נגישים. |
| `theme/static/` | גופנים (Heebo, JetBrains Mono), לוגו ואייקון. |
| `scripts/assemble.mjs` | מרכיב קורס בתוך Quartz: הבסיס, ואחריו `course.ts`, `content/` ו-`overrides/` של הקורס. |
| `scripts/setup-quartz.sh`, `build.sh`, `dev.sh` | מקבלים את שורש הקורס; ה-`dev.sh`/`build.sh` שבשורש קוראים להם עם הבסיס עצמו. |
| `scripts/new-course.sh` | פותח ריפו קורס חדש מ-`course-template/`. |

`quartz/`, `public/` ו-`.theme/` לא נשמרים ב-Git. לשדרוג Quartz: משנים את `quartz-version.txt` בבסיס; כל קורס מתקין מחדש את `quartz/` בבנייה הבאה.

## מה מותאם לעברית

- **פריסה מימין לשמאל.** `locale: he-IL` גורם ל-Quartz לכתוב `dir="rtl"`, והרשת מתהפכת: רשימת הפרקים מימין, תוכן העניינים משמאל. כל מקום שבו Quartz או התוספים שלו כתבו `left`/`right` (ציטוטים, שורות קוד, תוצאות חיפוש, כפתור הגרף, פס הטעינה) מתוקן.
- **קוד ונוסחאות.** בלוקי קוד, קוד בתוך משפט ונוסחאות KaTeX תמיד משמאל לימין ומבודדים מהטקסט, כך שסוגריים לא מתהפכים. תוויות בתרשימי Mermaid בעברית.
- **פסקאות באנגלית.** פסקה שאין בה אף אות עברית מקבלת `dir="ltr"` (בשביל סימני הפיסוק) אבל נשארת מיושרת לימין. משפט עברי שמתחיל במילה באנגלית נשאר עברי, בניגוד ל-`dir="auto"`.
- **תיבות הערה.** הפס הצבעוני בצד ימין, כותרות ברירת המחדל בעברית ("טיפ", "אזהרה"), והחץ של תיבה מקופלת מצביע שמאלה.
- **טיפוגרפיה.** Heebo מוגש מהאתר (12KB לעברית), מרווח שורות רחב יותר, בלי UPPERCASE וריווח אותיות שלא מתאימים לעברית.
- **ניווט.** הפרקים ממוספרים מ-01 בכל נושא. חצי "הבא" ו"הקודם" מצביעים לכיוון הקריאה, המגירה בטלפון נכנסת מימין, ו-Alt+← עובר לפרק הבא.
- **עמודה צדדית ופוטר.** בעמודה: תוכן העניינים, הגרף, ו"העמוד הזה" (לדווח על טעות, לערוך את העמוד). בפוטר: שם הקורס, "נערך על ידי ניב" ומתג מצב כהה, בשורה אחת גם בטלפון.

## רישיונות

הקוד ברישיון MIT. Heebo ו-JetBrains Mono ברישיון SIL Open Font License (הקבצים ב-`theme/static/fonts/`). האייקונים מ-[Lucide](https://lucide.dev) (ISC).

</div>
