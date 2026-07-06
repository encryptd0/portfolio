# PROJECTLAYOUT.md — Build instructions for Claude Code

This document tells you (Claude Code) exactly how to build **DSA Roadmap**: a free,
non-commercial website for learning data structures & algorithms. It organizes
~150 well-known LeetCode practice problems into 18 topics arranged as a dependency
roadmap (inspired by neetcode.io), so a learner always knows what to study next.
No ads, no accounts, no monetization, no external API calls at runtime.

Read this entire file before writing any code.

---

## 0. REQUIRED FIRST STEP — the theme file

**Before writing a single line of HTML or CSS, locate a file named `theme.md`
somewhere in the current working directory of the project you are building**
(check the project root first, then subdirectories).

- `theme.md` is the **sole authority on how the site looks**: colors, typography,
  spacing, borders, shadows, layout personality, component styling, hover/focus
  states, and overall visual voice. Everything visual in this project MUST follow
  it.
- This document (PROJECTLAYOUT.md) defines **structure and behavior only**. Where
  it names UI elements (badges, pills, buttons, cards, nodes), `theme.md` decides
  what they look like.
- If PROJECTLAYOUT.md and `theme.md` ever appear to conflict on a visual matter,
  **`theme.md` wins**. The one exception is project structure: if `theme.md`
  suggests its own file layout (e.g. a single `index.html`), ignore that part —
  the file layout and pages in THIS document apply. Everything visual in
  `theme.md` still applies to every page.
- If `theme.md` defines a light/dark mode or a theme toggle, implement it
  exactly as specified and place the toggle in the site header on every page.
  Anything that draws colors from JS (e.g. SVG strokes) must read them from the
  CSS custom properties (`getComputedStyle`) — never hardcode a hex — so both
  modes render correctly.
- If you cannot find `theme.md`, **stop and ask the user for it**. Do not invent
  a theme and do not proceed without one.

Translate `theme.md` into CSS custom properties at the top of
`css/styles.css` (e.g. `--color-bg`, `--color-ink`, `--color-accent`,
`--font-body`, `--border`, `--shadow`, difficulty colors, etc.) and use those
variables everywhere. This keeps the theme swappable by editing one block.

---

## 1. Tech stack (strict)

- **Plain HTML, CSS, and JavaScript only. No Node.js, no server, no EJS, no
  templating engine of any kind.** The site is a set of static files that work
  when opened directly from disk (`file://`) or served by any static file host.
- No frontend frameworks, no CSS frameworks, no build step, no bundler, no
  TypeScript, no preprocessors, no `package.json`, no npm.
- Client JS must be plain browser scripts (IIFE style, `'use strict'`), loaded
  with `<script src>` tags. No modules required, no packages.
- **No database and no backend.** The entire catalog ships as one static JS data
  file (`js/data.js`) loaded with a `<script>` tag — not fetched — so the site
  works over `file://` without a web server. The only mutable state is the
  visitor's progress, stored in `localStorage` in their browser.
- **Zero network access at runtime.** The site never fetches from LeetCode or
  anywhere else. Problems link out; this site hosts no problem content. The only
  permitted external requests are font files if `theme.md` calls for them.

---

## 2. File layout (create exactly this)

```
index.html             Roadmap graph + ordered topic list (home page)
topic.html             One topic, chosen by ?id=<slug>; rendered client-side
about.html             What the site is + credit
gone.html              "Problem may have moved" helper page (?title=…)
404.html               Not-found page (also linked by topic.html on bad ids)
theme.md               THE THEME — read it first; do not overwrite it
css/styles.css         The entire design system — derived from theme.md
js/data.js             The static problem catalog (the only data source)
js/progress.js         localStorage progress store + global reset (every page)
js/home.js             Graph build, connectors + progress reflection (home only)
js/topic.js            Topic render, done toggles, filters, premium toggle,
                       search (topic page only)
.gitignore
README.md
```

Since there is no templating, the shared site chrome (head, header/nav, footer)
is **written out in each HTML file** — keep the markup identical across pages:

- `<head>`: charset, viewport, title, stylesheet link.
- Header/nav: brand link home, About link, global "Reset progress" button
  (`[data-reset-progress]`), and the theme toggle if `theme.md` defines one.
- Footer: non-commercial note, credit to NeetCode & LeetCode.

Every page loads `js/progress.js`. `index.html` additionally loads `js/data.js`
and `js/home.js`; `topic.html` additionally loads `js/data.js` and `js/topic.js`.
`about.html`, `gone.html`, and `404.html` load only `progress.js` (for the
header's reset button).

---

## 3. Data model — `js/data.js`

A single static JS file, the only data source. It assigns one frozen object to
`window.DSA_DATA` (IIFE, `'use strict'`, `Object.freeze`). Shape:

```jsonc
{
  "meta": { "source": "...", "note": "...", "total": 150 },
  "categories": [
    {
      "id": "arrays-hashing",           // slug: topic.html?id=arrays-hashing
      "title": "Arrays & Hashing",
      "order": 1,                        // position in the recommended sequence
      "blurb": "The foundation...",      // 1–2 sentences shown on the topic page
      "unlocks": ["two-pointers", "stack"], // roadmap graph edges (children)
      "count": 9,                        // must equal problems.length
      "problems": [
        {
          "title": "Two Sum",
          "slug": "two-sum",             // matches leetcode.com/problems/<slug>/
          "url": "https://leetcode.com/problems/two-sum/",
          "difficulty": "Easy",          // "Easy" | "Medium" | "Hard"
          "isPremium": false             // true = behind LeetCode Premium
        }
      ]
    }
  ]
}
```

Content requirements:

- **18 topics**, ~150 problems total, following the well-known NeetCode roadmap
  ordering: Arrays & Hashing → Two Pointers / Stack → Binary Search / Sliding
  Window / Linked List → Trees → Tries / Heap & Priority Queue → Backtracking →
  Graphs / 1-D DP → Advanced Graphs / 2-D DP / Bit Manipulation / Greedy /
  Intervals / Math & Geometry. `unlocks` encodes exactly these edges;
  `arrays-hashing` is the single root.
- Use real, well-known LeetCode problems with correct slugs, URLs, and
  difficulties. Mark Premium-only problems `isPremium: true`.
- Progress keys are `"<categoryId>::<slug>"`, so slugs must be stable.

---

## 4. Client-side catalog logic (replaces the old server)

There is no server; the work the server used to do happens in the page scripts,
computed from `window.DSA_DATA` on load:

1. Sort categories by `order`; build a `Map` of id → category.
2. Compute `totalProblems` by summing every category's `problems.length` (used
   for the global `[data-global-count]` pill in the header).
3. **Compute graph levels** for the home layout (`home.js`): a Kahn-style
   topological pass over the `unlocks` edges. Topics with no incoming edge sit
   at level 0; every other topic sits one level below the deepest topic that
   unlocks it. Group categories into ordered "bands" (one array per level, each
   band sorted by `order`), then render the bands into the DOM.
4. `topic.js` reads `?id=` from `location.search`. Unknown or missing id: swap
   the page content for a not-found message with a link home (same content as
   `404.html`) — do not render an empty topic.
5. `gone.html`'s inline page script reads `?title=`, truncates it to 200 chars,
   and builds a LeetCode search URL
   (`https://leetcode.com/problemset/?search=<encoded title>`) for its button.
   Insert the title into the page with `textContent` (never `innerHTML`) — it is
   user-controlled input.

Pages and their URLs:

| Page                  | Behavior                                                          |
| --------------------- | ----------------------------------------------------------------- |
| `index.html`          | Roadmap graph bands + ordered topic list, built by `home.js`       |
| `topic.html?id=<id>`  | Topic title, blurb, problem list + filters, built by `topic.js`; unknown id shows the not-found state |
| `about.html`          | Static content                                                     |
| `gone.html?title=…`   | Dead-link helper with a LeetCode search link                       |
| `404.html`            | Static not-found page with a link home (wire it up as the host's custom 404 if the host supports it) |

---

## 5. Pages & behavior

### 5.1 Home (`index.html`) — the roadmap

- **Roadmap graph**: `home.js` renders the level bands as rows of topic nodes
  inside `[data-graph]`. Each node is a link to `topic.html?id=<id>` and carries
  `data-node="<id>"`, the topic title, and a per-topic progress label
  (`data-node-count="<id>"`, text like `3/9`). An absolutely-positioned
  `<svg data-graph-lines>` overlays the graph container.
- **Connectors** (`home.js`): after layout, draw one SVG cubic curve from the
  bottom-center of each node to the top-center of every node it unlocks
  (`M ax ay C ax midY, bx midY, bx by`). Clear and redraw on window resize
  (debounced ~120ms) and again on `window.load` (fonts settle). Stroke styling
  per `theme.md`, colors read from CSS custom properties.
- **Progress reflection** (`home.js`): on load and on every progress change:
  count done keys per topic via the `"<id>::"` prefix (capped at the catalog
  count to survive stale keys), update each node's and row's `x/y` label, toggle
  `is-complete` / `is-started` classes on nodes, `is-complete` on rows, and
  update the global `[data-global-count]` "X / total" pill.
- **Ordered topic list**: below the graph, all topics in recommended order —
  number, title, count, per-topic progress (`data-row-count="<id>"`,
  `data-topic-row="<id>"`), linking to the topic page.

### 5.2 Topic (`topic.html?id=<id>`)

`topic.js` renders everything inside `[data-topic]`, and sets `document.title`
to the topic title. Shows the topic title, blurb, live done-count
(`data-topic-count`), free (non-premium) count, and the problem list. Each
problem `<li>` carries: `data-problem`, `data-key="<categoryId>::<slug>"`,
`data-difficulty`, `data-premium="true|false"`, `data-title` (lowercased title
for search), and contains:

- a **done checkbox** (`[data-done]`) — initialized from `localStorage`, toggles
  the key via the Progress store, sets `is-done` on the row;
- the problem **title linking out** to its LeetCode URL (new tab,
  `rel="noopener"`);
- a **difficulty badge** (Easy/Medium/Hard — styled per `theme.md`);
- a **Premium badge** when `isPremium`;
- a small **"broken?" link** to `gone.html?title=<encoded title>` for problems
  that may have moved on LeetCode.

Controls (`topic.js`, state object `{ search, difficulty, showPremium }`):

- **Search** (`[data-search]`): case-insensitive substring match on the title.
- **Difficulty filter** (`[data-difficulty]` buttons: All / Easy / Medium /
  Hard): exclusive; toggle `is-active` class and `aria-pressed`.
- **Premium toggle** (`[data-show-premium]` checkbox): premium problems are
  **hidden by default** and clearly badged when shown.
- Filtering sets `hidden` on non-matching rows; show a `[data-empty]` empty-state
  when nothing matches.
- Subscribe to Progress changes so the global Reset button clears checkboxes and
  counts live.

Build problem rows with DOM APIs or by assembling markup from catalog data only —
never interpolate query-string input into `innerHTML`.

### 5.3 About (`about.html`)

Static page: what the site is (free, non-commercial, no accounts, progress stays
in your browser), credit to NeetCode for the roadmap idea and LeetCode for the
problems, note that this site only links out.

### 5.4 Gone (`gone.html?title=…`) and 404

`gone.html`: friendly "this problem may have moved or been removed" page with a
button linking to the LeetCode search URL for the title (see section 4).
`404.html`: simple not-found with a link home. Both use the site chrome.

---

## 6. Progress store — `js/progress.js`

Loaded on **every** page. An IIFE exposing `window.Progress`:

- Single `localStorage` key: `dsa-roadmap:progress:v1`, holding one JSON object
  mapping `"<categoryId>::<slug>" -> true` for each solved problem.
- Reads are defensive: corrupt JSON or disabled storage returns `{}`; writes
  swallow quota errors (progress just doesn't persist).
- API: `isDone(key)`, `set(key, done)` (deletes the key when false),
  `toggle(key)`, `countDone(keys)`, `countByPrefix(prefix)`, `totalDone()`,
  `reset()`, `onChange(fn)`.
- Same-tab listeners are notified after every mutation; a `window` `storage`
  event listener keeps multiple tabs in sync.
- Wires the header's `[data-reset-progress]` button: if nothing is saved, flash
  "Nothing saved" on the button for ~1.2s instead of a pointless dialog;
  otherwise `confirm()` with the count ("This will clear N solved problems…
  cannot be undone") before `reset()`.

---

## 7. CSS — `css/styles.css`

One stylesheet, the entire design system, **derived from `theme.md`** (see
section 0). Structural requirements only:

- CSS custom properties on `:root` for every theme token; components use only
  the tokens.
- Responsive without a framework: the graph, topic list, and problem rows must
  work from ~360px phones to wide desktops. The graph rows may wrap; connectors
  are redrawn on resize so this is safe.
- Visible focus states on all interactive elements; `is-done`, `is-active`,
  `is-complete`, `is-started` states styled per `theme.md`.
- Respect `prefers-reduced-motion` for any animation `theme.md` introduces.

---

## 8. Constraints & conventions (do not violate)

1. **`theme.md` governs all visuals.** Re-read it before styling each component.
2. No client-side frameworks and no CDN scripts. Web fonts are allowed only if
   `theme.md` calls for them, loaded exactly the way `theme.md` specifies —
   fonts are the only permitted external requests.
3. **No Node, no server, no build step.** The finished site must work by opening
   `index.html` directly in a browser (`file://`) — use relative paths for all
   links, stylesheets, and scripts (`css/…`, `js/…`, `topic.html?id=…`), never
   root-absolute `/…` paths, and never `fetch()` local files.
4. All user data stays in the browser (`localStorage`); nothing is ever sent
   anywhere.
5. All JS behavior hooks use `data-*` attributes (as named above), never style
   classes — classes are for `theme.md`'s styling only.
6. Accessibility: semantic landmarks (`header`/`nav`/`main`/`footer`), labeled
   form controls, `aria-pressed` on filter buttons, real `<a>` links for
   navigation, real checkboxes for done-state.
7. External links (LeetCode) open in a new tab with `rel="noopener"`.
8. Keep every category's `count` and `meta.total` consistent with the actual
   problem arrays.
9. Never insert query-string values into the DOM via `innerHTML` — use
   `textContent`.

---

## 9. Build order & verification

Build in this order: `theme.md` review → `js/data.js` → shared chrome in
`index.html` → `home.js` → `topic.html` + `topic.js` → `progress.js` →
`about.html` / `404.html` / `gone.html` → `styles.css` polish.

Then verify by opening `index.html` directly in a browser (no server, no
install) and checking:

1. The home page renders 18 topics in dependency bands with SVG connectors;
   resizing the window redraws them.
2. Ticking problems on a topic page updates the topic count immediately; going
   home shows the updated `x/y` on that node and the global pill; a full topic
   gets the complete styling.
3. Premium problems are hidden until toggled; difficulty filter and search
   combine correctly; an impossible combination shows the empty state.
4. Reset progress asks for confirmation, clears everything on all open pages,
   and says "Nothing saved" when there's nothing to clear.
5. `topic.html?id=nonsense` shows the not-found state; `404.html` renders;
   `gone.html?title=Two%20Sum` shows a working LeetCode search link.
6. The browser devtools network tab shows **zero external requests** (except
   fonts if `theme.md` requires them).
7. The rendered site visibly matches `theme.md`.
