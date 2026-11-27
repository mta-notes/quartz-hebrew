// בעמוד הבית, אחרי הטקסט: כל הפרקים ככרטיסים, בקבוצות. כל כרטיס מראה את
// מספר הפרק, הכותרת וה-description שלו. אין צורך לתחזק טבלה ידנית ב-index.md:
// פרק חדש מופיע כאן ברגע שהקובץ שלו קיים.

import type { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { resolveRelative, type FullSlug } from "../../quartz/util/path"
import { chapterGroups } from "./chapters"

const HomeChapters: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const slug = fileData.slug as FullSlug
  if (slug !== "index") return null
  const groups = chapterGroups(allFiles)
  return (
    <section class="hd-home-chapters" aria-label="פרקי המדריך">
      {groups.map((group) => (
        <div class="hd-card-group">
          {group.title && <h2 id={`chapters-${group.id}`}>{group.title}</h2>}
          <ul class="hd-cards">
            {group.chapters.map((chapter) => (
              <li>
                <a class="hd-card" href={resolveRelative(slug, chapter.slug as FullSlug)} data-no-popover>
                  {chapter.number && <span class="hd-card-number">{chapter.number}</span>}
                  <span class="hd-card-title">{chapter.title}</span>
                  {chapter.description && <span class="hd-card-text">{chapter.description}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}

export default (() => HomeChapters) satisfies QuartzComponentConstructor
