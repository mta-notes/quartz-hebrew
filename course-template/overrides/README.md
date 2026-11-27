# overrides/

שינויים שחלים רק על הקורס הזה. כל קובץ כאן לא חובה; שינוי שצריך להגיע לכל
הקורסים נעשה בריפו הבסיס, mta-notes/quartz-hebrew.

| קובץ | מה הוא עושה |
| --- | --- |
| `custom.scss` | עיצוב לקורס הזה בלבד. נטען אחרי `theme/custom.scss` של הבסיס, ולכן גובר עליו. |
| `config.yaml` | מתמזג לתוך `quartz.config.yaml` של הבסיס. `plugins` ממוזג לפי `source`. |
| `static/` | קבצים שמחליפים את אלה של הבסיס באותו שם, למשל `logo.svg` או `icon.png`. |

דוגמה ל-`custom.scss`, צבע מבטא אחר:

```scss
:root:root {
  --secondary: #0f766e;
}
```

דוגמה ל-`config.yaml`, הפעלת תוסף שכבוי בבסיס:

```yaml
plugins:
  - source: "@quartz-community/backlinks"
    enabled: true
```
