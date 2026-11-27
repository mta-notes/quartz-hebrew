// הקישורים ששייכים לעמוד ולא לאתר. theme/site.ts מציב את הרכיב פעמיים,
// וה-CSS מציג את המתאים לרוחב המסך:
//   - "rail": בעמודה הצדדית, מתחת לתוכן העניינים ולגרף: קבוצות קישורים, כל
//     אחת עם כותרת קטנה. עזרה, אחר כך העמוד עצמו (עריכה, היסטוריה), ואז extra.
//   - "end": מתחת למאמר, ברוחבים שבהם העמודה הצדדית מוסתרת: רק שני הקישורים
//     החשובים, איפה לשאול ואיפה לערוך.

import type { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { Icon, type IconName } from "./icons"

interface Link {
  text: string
  href: string
  icon: IconName
}

interface Group {
  title: string
  links: Link[]
}

interface Options {
  repository: string
  branch: string
  contentDir: string
  place: "rail" | "end"
  /** הקבוצה האחרונה בעמודה, שהאתר בוחר. */
  extra?: Group
}

const Links = ({ links }: { links: Link[] }) => (
  <>
    {links.map((link) => (
      <a href={link.href}>
        <Icon name={link.icon} />
        {link.text}
      </a>
    ))}
  </>
)

export default ((opts: Options) => {
  const PageActions: QuartzComponent = ({ fileData, cfg }: QuartzComponentProps) => {
    const relativePath = fileData.relativePath as string | undefined
    if (!relativePath || fileData.slug === "404") return null
    const repo = `https://github.com/${opts.repository}`
    const title = String(fileData.frontmatter?.title ?? "")
    const file = `${opts.contentDir}/${encodeURI(relativePath)}`

    // טופס השאלה נפתח עם כותרת ותחילת טקסט: באיזה עמוד נשאלה השאלה.
    const slug = String(fileData.slug ?? "")
    const address = cfg.baseUrl ? `https://${cfg.baseUrl}/${slug === "index" ? "" : slug}` : undefined
    const body = [address ? `**עמוד:** [${title}](${address})` : `**עמוד:** ${title}`, "", "**השאלה שלי:**", ""].join("\n")
    const ask: Link = {
      text: "לשאול שאלה",
      href: `${repo}/issues/new?title=${encodeURIComponent(`[שאלה] ${title}: `)}&body=${encodeURIComponent(body)}`,
      icon: "question",
    }
    const edit: Link = { text: "לערוך את העמוד", href: `${repo}/edit/${opts.branch}/${file}`, icon: "pencil" }

    if (opts.place === "end") {
      return (
        <aside class="hd-page-actions hd-page-actions-end" aria-label="על העמוד הזה">
          <Links links={[ask, edit]} />
        </aside>
      )
    }

    const groups: Group[] = [
      {
        title: "עזרה",
        links: [
          ask,
          {
            text: "לדווח על טעות",
            href: `${repo}/issues/new?title=${encodeURIComponent(`[טעות] ${title}: `)}`,
            icon: "bug",
          },
        ],
      },
      {
        title: "העמוד הזה",
        links: [edit, { text: "היסטוריית שינויים", href: `${repo}/commits/${opts.branch}/${file}`, icon: "history" }],
      },
    ]
    if (opts.extra) groups.push(opts.extra)

    return (
      <aside class="hd-page-actions hd-page-actions-rail" aria-label="על העמוד הזה">
        {groups.map((group) => (
          <section class="hd-rail-group">
            <h3>{group.title}</h3>
            <Links links={group.links} />
          </section>
        ))}
      </aside>
    )
  }
  return PageActions
}) satisfies QuartzComponentConstructor<Options>
