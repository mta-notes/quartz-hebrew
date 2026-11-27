// פרקי המדריך, לפי סדר הקריאה, והקבוצות שהם מחולקים אליהן.
//
// הסדר הוא סדר שמות הקבצים (01, 02, … 10, 11): שם הקובץ קובע את הסדר בלבד.
// המספר שמוצג ליד פרק הוא המקום שלו בתוך הקבוצה, כך שכל קבוצה מתחילה מ-01.
// הקבוצה של פרק נכתבת בראש הקובץ שלו, בשדה group:
//
//   ---
//   title: התקנה והרצה
//   group: צעדים ראשונים
//   description: משפט אחד על מה שיש בפרק.
//   ---
//
// הקבוצות מופיעות לפי הפרק הראשון בכל אחת. פרק בלי group נכנס לקבוצה "עוד".
// אתר שאף פרק בו לא כתב group מקבל רשימה אחת, בלי כותרות, וממוספרת ברצף מ-01.
//
// כל מה שמציג מספר פרק לוקח אותו מ-chapterGroups או מ-findChapter, לא מ-chapterList.

import type { QuartzPluginData } from "../../quartz/plugins/vfile"

export interface Chapter {
  slug: string
  title: string
  description?: string
  /** המקום בתוך הקבוצה: "01", "02", … נקבע רק ב-chapterGroups. */
  number?: string
  group?: string
}

export interface ChapterGroup {
  id: string
  /** undefined לרשימה היחידה של אתר בלי קבוצות. */
  title?: string
  chapters: Chapter[]
}

const OTHER = "עוד"

const isChapter = (file: QuartzPluginData) => {
  const slug = file.slug ?? ""
  // לא עמוד הבית, עמודי תיקיות, עמודי תגיות או עמוד 404.
  return slug !== "" && slug !== "index" && slug !== "404" && !slug.endsWith("/index") && !slug.startsWith("tags/")
}

export function chapterList(allFiles: QuartzPluginData[]): Chapter[] {
  return allFiles
    .filter(isChapter)
    .filter((file) => file.frontmatter?.unlisted !== true)
    .map((file) => {
      const slug = file.slug as string
      const name = slug.split("/").pop() ?? slug
      const group = file.frontmatter?.group
      return {
        slug,
        title: String(file.frontmatter?.title ?? name),
        description: (file.frontmatter?.description as string | undefined) ?? file.description,
        group: typeof group === "string" && group.trim() ? group.trim() : undefined,
      }
    })
    .sort((a, b) => a.slug.localeCompare(b.slug, "en", { numeric: true, sensitivity: "base" }))
}

const numbered = (group: ChapterGroup): ChapterGroup => ({
  ...group,
  chapters: group.chapters.map((chapter, i) => ({ ...chapter, number: String(i + 1).padStart(2, "0") })),
})

export function chapterGroups(allFiles: QuartzPluginData[]): ChapterGroup[] {
  const chapters = chapterList(allFiles)
  if (!chapters.some((chapter) => chapter.group)) return [numbered({ id: "all", chapters })]

  const groups = new Map<string, ChapterGroup>()
  for (const chapter of chapters) {
    const title = chapter.group ?? OTHER
    if (!groups.has(title)) groups.set(title, { id: `g${groups.size + 1}`, title, chapters: [] })
    groups.get(title)!.chapters.push(chapter)
  }
  // "עוד" תמיד בסוף.
  return [...groups.values()].sort((a, b) => Number(a.title === OTHER) - Number(b.title === OTHER)).map(numbered)
}

/** הפרק של העמוד, עם המספר שלו בתוך הקבוצה; undefined לעמוד שאינו פרק. */
export function findChapter(allFiles: QuartzPluginData[], slug: string): Chapter | undefined {
  return chapterGroups(allFiles)
    .flatMap((group) => group.chapters)
    .find((chapter) => chapter.slug === slug)
}

/** הפרק הקודם והבא לפי סדר הקריאה. */
export function neighbours(allFiles: QuartzPluginData[], slug: string) {
  const chapters = chapterGroups(allFiles).flatMap((group) => group.chapters)
  const index = chapters.findIndex((chapter) => chapter.slug === slug)
  if (index === -1) return { previous: undefined, next: undefined }
  return { previous: chapters[index - 1], next: chapters[index + 1] }
}

/** זמן קריאה בדקות. קוראים עברית בכ-180 מילים לדקה (מעט פחות מאנגלית, כי
 *  מילה עברית "מכילה" לרוב גם מילית יחס או ה' הידיעה). לפחות דקה אחת. */
export function minutesToRead(text: string): number {
  const words = text.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word)).length
  return Math.max(1, Math.ceil(words / 180))
}

/** "דקת קריאה", "שתי דקות קריאה", "5 דקות קריאה" */
export function readingTimeLabel(minutes: number): string {
  if (minutes === 1) return "דקת קריאה"
  if (minutes === 2) return "שתי דקות קריאה"
  return `${minutes} דקות קריאה`
}
