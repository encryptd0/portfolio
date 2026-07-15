# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

One project, two sites, plain HTML/CSS/JS — no framework, no build step, no dependencies, no tests:

- **Shared design system** (`css/base.css`, `js/site.js`) — the tokens, chrome and motion **both** sites are built from. Every page of both sites loads these first.
- **Root** (`index.html`, `css/style.css`, `js/main.js`) — personal portfolio landing page.
- **`dsa/`** — "DSA Roadmap" learning platform, linked from the portfolio nav and linking back via `../index.html`.

Treat the two sites as one product: a component, animation or token is defined **once**, in the shared layer, and used by both. A site's own stylesheet/script may only hold what is genuinely unique to it (the portfolio's project cards and stack marquee; the DSA roadmap graph, problem list and difficulty badges). If a change would make the same component look or behave differently across the sites, it belongs in the shared layer instead — or as a BEM modifier of the shared component (e.g. `.hero__title--xl`, `.footer__inner--stack`).

Run locally by serving the repo root (paths are relative, so serving from root keeps both sites and the cross-links working):

```
python3 -m http.server 8123
```

To visually verify changes, headless screenshots work with the installed Brave:
`brave-browser --headless --disable-gpu --window-size=390,700 --screenshot=out.png <url>`
(chromium/firefox/ffmpeg/gifsicle are NOT installed).

## Design system — read `docs/theme.md` before styling anything

`docs/theme.md` is the authoritative spec ("Catppuccin Mocha", catppuccin.com-style) and **both sites** follow it: a single fixed dark theme (no light mode, no theme toggle), Inter as the only typeface, exactly one glass (`backdrop-filter`) element per page — the sticky nav, and `.reveal` fade-in-on-scroll as the signature motion. Every colour must reference a token on `:root`; never hardcode a hex. `css/base.css` implements the spec once — it defines the full 14-hue palette and every shared component, and uses the palette the way catppuccin.com does: 120° gradient-text headings with per-block `--g1`/`--g2` hue pairs, borderless gradient pill buttons (`--crust` text, hover slides `background-position`), `--mantle` cards/nodes that each own a hue (`--c`), a soft peach→mauve `body::before` tint over the top of every page, and an 8px `--rainbow` accent bar flush above the `--mantle` footer. On the DSA site green/yellow/red additionally carry semantic meaning (difficulty badges). Every animation needs a `prefers-reduced-motion` fallback: `base.css` has one consolidated block for the shared motion, and each site's stylesheet has one for its own.

**Naming is BEM everywhere** — `.block`, `.block__element`, `.block--modifier`, plus `is-*` state classes (`is-open`, `is-visible`, `is-complete`, `is-active`, `is-done`). Both sites use the same name for the same thing.

## Architecture notes

- **DSA pages are shells rendered client-side.** `dsa/js/data.js` holds all topic/problem data; `home.js` renders the roadmap graph and topic list on `index.html`; `topic.js` renders `topic.html` from the `?id=<slug>` query param (unknown ids render an inline 404 state). Solved-problem state lives in localStorage via `progress.js`. Every DSA page loads `../js/site.js` (shared chrome) + `progress.js` before its page script.
- **The DSA header/nav is duplicated in all five HTML files** (`index`, `topic`, `about`, `404`, `gone`) — a nav change must be applied to each one. Its markup matches the portfolio's nav exactly, so a nav change usually touches `index.html` too.
- **Portfolio projects are data, not markup**: edit the `PROJECTS` array at the top of `js/main.js`; cards render into `#projects-grid`.
- **Mobile nav (both sites)**: one component in `base.css`, one implementation in `js/site.js`. Desktop keeps the nav row via `display: contents` on `.nav__menu`; ≤620px shows a hamburger that toggles a dropdown (class `is-open` on `.nav`). The stack marquee in the portfolio hero is cloned/measured by `js/main.js` to stay seamless at any viewport width.
- **JS conventions**: vanilla IIFEs with `"use strict"`, feature-detected APIs. Shared behaviour hooks onto data-attributes (`data-nav-toggle`, `data-reset-progress`, …); page-specific portfolio JS still hooks onto element ids. Any page that renders content with JS calls `Reveal.scan()` afterward so new nodes get the fade-in.
- `docs/ABOUTME.md` holds the personal bio/copy the portfolio content is written from.
