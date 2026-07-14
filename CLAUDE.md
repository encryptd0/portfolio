# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Two static sites in one repo, plain HTML/CSS/JS — no framework, no build step, no dependencies, no tests:

- **Root** (`index.html`, `css/style.css`, `js/main.js`) — personal portfolio landing page.
- **`dsa/`** — "DSA Roadmap" learning platform, linked from the portfolio nav and linking back via `../index.html`.

Run locally by serving the repo root (paths are relative, so serving from root keeps both sites and the cross-links working):

```
python3 -m http.server 8123
```

To visually verify changes, headless screenshots work with the installed Brave:
`brave-browser --headless --disable-gpu --window-size=390,700 --screenshot=out.png <url>`
(chromium/firefox/ffmpeg/gifsicle are NOT installed). Headless defaults to dark theme via `prefers-color-scheme`.

## Design system — read `docs/theme.md` before styling anything

`docs/theme.md` is the authoritative spec ("Monochrome Minimal") and both sites follow it strictly: black/white/grey only, Inter as the only typeface, hairline `--line` dividers instead of boxes/shadows, pill-shaped controls, exactly one glass (`backdrop-filter`) element per page — the sticky nav, and `.reveal` fade-in-on-scroll as the signature motion. Every colour must reference the tokens (`--bg`, `--fg`, `--muted`, `--line`, `--glass`) defined for both `[data-theme]` values; never hardcode a hex. Every animation needs a `prefers-reduced-motion` fallback (each stylesheet has one consolidated block for this).

## Theming (shared across both sites)

Light/dark is stored under the localStorage key **`rg-theme`**, shared by both sites so the choice follows the user. Three cooperating pieces:

1. An inline `<head>` script in **every** HTML file sets `data-theme` before first paint (saved value, else `prefers-color-scheme`).
2. `js/main.js` (portfolio) and `dsa/js/theme.js` (DSA) wire the toggle button, sync `<meta name="theme-color">`, and persist the choice.
3. Toggle labels show the mode you'd switch TO ("Dark" while light).

## Architecture notes

- **DSA pages are shells rendered client-side.** `dsa/js/data.js` holds all topic/problem data; `home.js` renders the roadmap graph and topic list on `index.html`; `topic.js` renders `topic.html` from the `?id=<slug>` query param (unknown ids render an inline 404 state). Solved-problem state lives in localStorage via `progress.js`. Every DSA page loads `theme.js` + `progress.js` before its page script.
- **The DSA header/nav is duplicated in all five HTML files** (`index`, `topic`, `about`, `404`, `gone`) — a nav change must be applied to each one.
- **Portfolio projects are data, not markup**: edit the `PROJECTS` array at the top of `js/main.js`; cards render into `#projects-grid`.
- **Mobile nav (both sites)**: desktop keeps the nav row via `display: contents` on the menu wrapper; ≤620px shows a hamburger that toggles a dropdown (class `is-open` on the header, wired in `js/main.js` / `dsa/js/theme.js`). The stack marquee in the hero is cloned/measured by `js/main.js` to stay seamless at any viewport width.
- **JS conventions**: vanilla IIFEs with `"use strict"`, feature-detected APIs. Portfolio JS hooks onto element ids; DSA JS hooks onto data-attributes (`data-theme-toggle`, `data-nav-toggle`, `data-reset-progress`, …). DSA pages that render content call `Reveal.scan()` afterward so new nodes get the fade-in.
- `docs/ABOUTME.md` holds the personal bio/copy the portfolio content is written from.
