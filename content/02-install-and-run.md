---
title: התקנה והרצה
group: צעדים ראשונים
description: מה צריך על המחשב, ואיך מריצים את האתר מקומית בפקודה אחת.
---

## מה צריך

- **Node.js** בגרסה 22 ומעלה (בודקים עם `node --version`).
- **Git**.
- עורך טקסט. אפשר גם לכתוב את העמודים ב-Obsidian: התיקייה `content/` היא בעצם כספת (vault).

## הרצה מקומית

```bash
git clone https://github.com/mta-notes/quartz-hebrew.git
cd quartz-hebrew
./dev.sh
```

בפעם הראשונה הסקריפט מוריד את Quartz (הגרסה שכתובה ב-`quartz-version.txt`) לתיקייה `quartz/` ומתקין אותו. זה לוקח דקה או שתיים. אחר כך האתר עולה בכתובת `http://localhost:8080`.

> [!note] מה מתעדכן לבד
> שינוי בעמוד בתוך `content/` מופיע בדפדפן מיד כששומרים. שינוי בעיצוב (`theme/`), בטקסטים (`quartz.ts`) או בהגדרות (`quartz.config.yaml`) דורש לעצור עם <kbd>Ctrl</kbd>+<kbd>C</kbd> ולהריץ שוב.

## בנייה לפרסום

```bash
./build.sh
```

האתר המוכן נכתב לתיקייה `public/`: קובצי HTML רגילים שאפשר להעלות לכל שרת. פרק [[10-publishing|הפרסום]] מסביר איך GitHub עושה את זה לבד.

> [!warning] אל תערכו בתוך quartz/
> התיקייה `quartz/` נוצרת מחדש ולא נשמרת ב-Git. כל שינוי צריך להיות ב-`theme/`, ב-`quartz.ts` או ב-`quartz.config.yaml`, ו-`scripts/assemble.mjs` מעתיק אותם פנימה בכל הרצה.
