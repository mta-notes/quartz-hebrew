// העמוד לכתובת שלא קיימת (404.html): המספר הגדול, משפט שמסביר מה קרה, והדרך
// חזרה. הוא מחליף את זה של Quartz ושומר על החלק השימושי שבו: כתובת שרק
// האותיות הגדולות/קטנות בה שגויות מפנה לעמוד שקיים.
//
// GitHub Pages מגיש 404.html לכתובת בכל עומק, ולכן שום דבר כאן לא יחסי: קישור
// הבית מתחיל מנתיב הבסיס של האתר.

import type { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { Icon } from "./icons"

// ההפניה של Quartz: /Docs/Page → /docs/page כשרק האותיות שונות והעמוד קיים.
const CASE_REDIRECT = `
  if (typeof fetchData !== "undefined") {
    fetchData.then(function(index) {
      var basePath = document.body.dataset.basepath || "";
      if (basePath.length > 1 && basePath.endsWith("/")) basePath = basePath.slice(0, -1);
      var pathname = decodeURIComponent(window.location.pathname);
      var hasBasePrefix = basePath.length > 1 && pathname.startsWith(basePath);
      if (hasBasePrefix) pathname = pathname.slice(basePath.length);
      pathname = pathname.replace(/^\\//, "").replace(/\\/$/, "").replace(/\\.html$/, "").replace(/\\/index$/, "");
      var lowered = pathname.toLowerCase();
      if (lowered !== pathname && index[lowered] != null) {
        var prefix = hasBasePrefix ? basePath : "";
        window.location.replace(prefix + (prefix.endsWith("/") ? "" : "/") + lowered);
      }
    });
  }
  var report = document.getElementById("hd-404-report");
  if (report) report.href += "?title=" + encodeURIComponent("קישור שבור: " + decodeURIComponent(window.location.pathname));
`

interface Options {
  /** איך נקראת הדרך חזרה: "לעמוד הבית של המדריך". */
  homeText: string
  repository: string
}

export default ((opts: Options) => {
  const NotFound: QuartzComponent = ({ cfg, ctx }: QuartzComponentProps) => {
    // בתצוגה המקומית האתר מוגש מ-"/", ובאתר המפורסם מנתיב הבסיס (למשל /quartz-hebrew/).
    const base = ctx.argv.serve ? "/" : new URL(`https://${cfg.baseUrl ?? "example.com"}`).pathname
    const home = base.endsWith("/") ? base : `${base}/`
    return (
      <article class="hd-404">
        <h1 class="hd-404-number" aria-label="404">
          <span aria-hidden="true">404</span>
        </h1>
        <p class="hd-404-title">העמוד הזה לא כאן</p>
        <p class="hd-404-lead">ייתכן שהכתובת הוקלדה עם טעות, או שהעמוד הועבר או שינה את שמו.</p>
        <div class="hd-404-actions">
          <a class="hd-button hd-button-primary" href={home}>
            <Icon name="home" />
            {opts.homeText}
          </a>
          <a class="hd-button" id="hd-404-report" href={`https://github.com/${opts.repository}/issues/new`}>
            <Icon name="github" />
            לדווח על קישור שבור
          </a>
        </div>
        <script dangerouslySetInnerHTML={{ __html: CASE_REDIRECT }} />
      </article>
    )
  }
  return NotFound
}) satisfies QuartzComponentConstructor<Options>
