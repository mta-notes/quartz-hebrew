// רשימת הפרקים: כל הפרקים, לפי הסדר ובקבוצות, עם סימון של העמוד הנוכחי.
// כל קבוצה מתקפלת ונשארת מקופלת גם בעמוד הבא. הרשימה מצוירת לתוך העמוד עצמו
// (הסייר של Quartz מצויר בסקריפט), כך שהיא שם עוד לפני שסקריפט כלשהו רץ.
//
// בטלפון הרשימה נמצאת במגירה שכפתור התפריט פותח: <dialog> מודאלי שבתוכו גלילה
// צידית עם שתי נקודות עצירה (פתוח / סגור), כך שהמגירה עוקבת אחרי האצבע ונעצרת
// פתוחה או סגורה. ב-RTL המגירה נכנסת מימין: הגלילה מתחילה בצד ימין, ו-scrollLeft
// שלילי כשגוללים שמאלה, ולכן הסקריפט בודק את כיוון הגלילה.

import type { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { resolveRelative, type FullSlug } from "../../quartz/util/path"
import { chapterGroups, type ChapterGroup } from "./chapters"

function ChapterLinks({ groups, slug, prefix }: { groups: ChapterGroup[]; slug: FullSlug; prefix: string }) {
  const links = (group: ChapterGroup) => (
    <ul>
      {group.chapters.map((chapter) => (
        <li>
          <a
            href={resolveRelative(slug, chapter.slug as FullSlug)}
            aria-current={chapter.slug === slug ? "page" : undefined}
            data-no-popover
          >
            {chapter.number && <span class="hd-nav-number">{chapter.number}</span>}
            <span class="hd-nav-title">{chapter.title}</span>
          </a>
        </li>
      ))}
    </ul>
  )
  return (
    <>
      {groups.map((group) =>
        group.title ? (
          <details class="hd-nav-group" data-group={group.id} open>
            <summary id={`${prefix}-${group.id}`}>{group.title}</summary>
            {links(group)}
          </details>
        ) : (
          links(group)
        ),
      )}
    </>
  )
}

const ChapterNav: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const slug = fileData.slug as FullSlug
  const groups = chapterGroups(allFiles)
  return (
    <div class="hd-chapters">
      <button type="button" class="hd-menu-button" aria-label="פרקים" aria-expanded="false" aria-controls="hd-drawer">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <nav class="hd-nav hd-nav-sidebar" aria-label="פרקים">
        <ChapterLinks groups={groups} slug={slug} prefix="hd-nav" />
      </nav>
      <dialog class="hd-drawer" id="hd-drawer" aria-labelledby="hd-drawer-title">
        <div class="hd-drawer-scroller">
          <div class="hd-drawer-sheet">
            <div class="hd-drawer-head">
              <span id="hd-drawer-title">פרקים</span>
              <button type="button" class="hd-drawer-close" aria-label="סגירת רשימת הפרקים" autofocus>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav class="hd-nav" aria-labelledby="hd-drawer-title">
              <ChapterLinks groups={groups} slug={slug} prefix="hd-drawer" />
            </nav>
          </div>
        </div>
      </dialog>
    </div>
  )
}

// רץ בכל צפייה בעמוד: Quartz שולח "nav" אחרי הטעינה הראשונה ואחרי כל מעבר
// עמוד בתוך האתר, ו-window.addCleanup מנקה את המאזינים הקודמים.
ChapterNav.afterDOMLoaded = `
(() => {
  const FOLDED = "hd-nav-folded"
  const readFolded = () => {
    try { return new Set(JSON.parse(localStorage.getItem(FOLDED) || "[]")) } catch { return new Set() }
  }
  const writeFolded = (set) => {
    try { localStorage.setItem(FOLDED, JSON.stringify([...set])) } catch {}
  }
  const cleanup = (fn) => window.addCleanup ? window.addCleanup(fn) : undefined

  function setupGroups() {
    // העמוד מגיע עם כל הקבוצות פתוחות, והקבוצות שקיפלתם נסגרות כאן; בשתי
    // הפריימים הראשונים הרשימות לא מונפשות (custom.scss).
    const navs = document.querySelectorAll(".hd-nav")
    for (const nav of navs) nav.setAttribute("data-settling", "")
    requestAnimationFrame(() => requestAnimationFrame(() => {
      for (const nav of navs) nav.removeAttribute("data-settling")
    }))
    const folded = readFolded()
    for (const group of document.querySelectorAll("details.hd-nav-group")) {
      const id = group.dataset.group
      // הקבוצה של העמוד הנוכחי תמיד פתוחה.
      if (folded.has(id) && !group.querySelector('[aria-current="page"]')) group.open = false
      const onToggle = () => {
        const now = readFolded()
        group.open ? now.delete(id) : now.add(id)
        writeFolded(now)
      }
      group.addEventListener("toggle", onToggle)
      cleanup(() => group.removeEventListener("toggle", onToggle))
    }
    // הפרק הנוכחי גלוי ברשימה, גם כשהיא ארוכה מהמסך.
    const current = document.querySelector(".hd-nav-sidebar [aria-current='page']")
    const sidebar = current && current.closest(".sidebar")
    if (current && sidebar && sidebar.scrollHeight > sidebar.clientHeight) {
      const box = sidebar.getBoundingClientRect()
      const item = current.getBoundingClientRect()
      if (item.bottom > box.bottom - 24) sidebar.scrollTop += item.top - box.top - box.height / 2
    }
  }

  function setupDrawer() {
    const drawer = document.getElementById("hd-drawer")
    const openButton = document.querySelector(".hd-menu-button")
    if (!drawer || !openButton) return
    const scroller = drawer.querySelector(".hd-drawer-scroller")
    const sheet = drawer.querySelector(".hd-drawer-sheet")
    const closeButton = drawer.querySelector(".hd-drawer-close")
    // ב-RTL נקודת "סגור" היא בצד שמאל, ו-scrollLeft שלה שלילי.
    const closedLeft = () => (getComputedStyle(scroller).direction === "rtl" ? -1 : 1) * scroller.scrollWidth

    async function openDrawer() {
      drawer.showModal()
      if (!CSS.supports("scroll-initial-target", "nearest")) {
        // מתחילים מנקודת "סגור", כדי שהמגירה תחליק פנימה.
        scroller.scrollTo({ left: closedLeft(), behavior: "instant" })
        await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)))
      }
      scroller.scrollTo({ left: 0, behavior: "auto" })
    }
    // מחליקים החוצה; ה-observer סוגר את הדיאלוג כשהמגירה יצאה מהמסך.
    const closeDrawer = () => scroller.scrollTo({ left: closedLeft(), behavior: "auto" })

    const visible = 1 / window.innerWidth
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1]
      if (!drawer.open) return
      if (entry.intersectionRatio < visible) {
        drawer.close()
        openButton.setAttribute("aria-expanded", "false")
      } else if (entry.intersectionRatio === 1) {
        openButton.setAttribute("aria-expanded", "true")
      }
    }, { root: drawer, threshold: [visible, 1] })
    observer.observe(sheet)

    const onDrawerClick = (event) => {
      // קישור לפרק: סוגרים מיד, לפני שהעמוד הבא מחליף את הנוכחי.
      if (event.target.closest("a")) {
        drawer.close()
        openButton.setAttribute("aria-expanded", "false")
      } else if (!sheet.contains(event.target)) {
        closeDrawer()
      }
    }
    const onCancel = (event) => {
      if (event.cancelable) {
        event.preventDefault()
        closeDrawer()
      }
    }
    const onScroll = () => {
      const ratio = 1 - Math.abs(scroller.scrollLeft) / sheet.offsetWidth
      drawer.style.setProperty("--hd-drawer-backdrop", String(Math.max(0, Math.min(1, ratio))))
    }
    const scrollTimeline = CSS.supports("animation-timeline: scroll()")

    openButton.addEventListener("click", openDrawer)
    closeButton.addEventListener("click", closeDrawer)
    drawer.addEventListener("click", onDrawerClick)
    drawer.addEventListener("cancel", onCancel)
    if (!scrollTimeline) scroller.addEventListener("scroll", onScroll)
    cleanup(() => {
      observer.disconnect()
      openButton.removeEventListener("click", openDrawer)
      closeButton.removeEventListener("click", closeDrawer)
      drawer.removeEventListener("click", onDrawerClick)
      drawer.removeEventListener("cancel", onCancel)
      scroller.removeEventListener("scroll", onScroll)
      if (drawer.open) drawer.close()
    })
  }

  // טבלה רחבה נגללת בתוך התיבה שלה; המקלדת יכולה להגיע אליה.
  function labelWideTables() {
    for (const box of document.querySelectorAll("article .table-container")) {
      if (box.scrollWidth > box.clientWidth + 1) {
        box.tabIndex = 0
        box.setAttribute("role", "region")
        box.setAttribute("aria-label", "טבלה, נגללת לצדדים")
      }
    }
  }

  // תיבת החיפוש מציגה את קיצור המקשים כפי שהמחשב הזה כותב אותו.
  const apple = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
  document.documentElement.dataset.hdPlatform = apple ? "apple" : "other"

  document.addEventListener("nav", () => {
    setupGroups()
    setupDrawer()
    labelWideTables()
  })
})()
`

export default (() => ChapterNav) satisfies QuartzComponentConstructor
