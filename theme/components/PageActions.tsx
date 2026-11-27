// הקישורים ששייכים לעמוד ולא לאתר: לדווח על טעות ולערוך את העמוד. theme/site.ts
// מציב את הרכיב פעמיים, וה-CSS מציג את המתאים לרוחב המסך:
//   - "rail": בעמודה הצדדית, מתחת לתוכן העניינים ולגרף, בקבוצה "העמוד הזה".
//   - "end": מתחת למאמר, ברוחבים שבהם העמודה הצדדית מוסתרת: אותם שני קישורים.

import type { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { Icon, type IconName } from "./icons"

interface Link {
  text: string
  href: string
  icon: IconName
}

interface Options {
  repository: string
  branch: string
  contentDir: string
  place: "rail" | "end"
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
  const PageActions: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    const relativePath = fileData.relativePath as string | undefined
    if (!relativePath || fileData.slug === "404") return null
    const repo = `https://github.com/${opts.repository}`
    const title = String(fileData.frontmatter?.title ?? "")
    const file = `${opts.contentDir}/${encodeURI(relativePath)}`

    const links: Link[] = [
      {
        text: "לדווח על טעות",
        href: `${repo}/issues/new?title=${encodeURIComponent(`[טעות] ${title}: `)}`,
        icon: "bug",
      },
      { text: "לערוך את העמוד", href: `${repo}/edit/${opts.branch}/${file}`, icon: "pencil" },
    ]

    if (opts.place === "end") {
      return (
        <aside class="hd-page-actions hd-page-actions-end" aria-label="העמוד הזה">
          <Links links={links} />
        </aside>
      )
    }

    return (
      <aside class="hd-page-actions hd-page-actions-rail" aria-labelledby="hd-rail-title">
        <section class="hd-rail-group">
          <h3 id="hd-rail-title">העמוד הזה</h3>
          <Links links={links} />
        </section>
      </aside>
    )
  }
  return PageActions
}) satisfies QuartzComponentConstructor<Options>
