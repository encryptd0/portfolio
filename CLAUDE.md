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
(chromium/firefox/ffmpeg/gifsicle are NOT installed).

## Design system — read `docs/theme.md` before styling anything

`docs/theme.md` is the authoritative spec ("Catppuccin Mocha", catppuccin.com-style) and **both sites** follow it: a single fixed dark theme (no light mode, no theme toggle), Inter as the only typeface, exactly one glass (`backdrop-filter`) element per page — the sticky nav, and `.reveal` fade-in-on-scroll as the signature motion. Every colour must reference a token on `:root`; never hardcode a hex. Both stylesheets define the full 14-hue palette and use it the way catppuccin.com does: 120° gradient-text headings with per-block `--g1`/`--g2` hue pairs, borderless gradient pill buttons (`--crust` text, hover slides `background-position`), `--mantle` cards/nodes that each own a hue (`--c`), a soft peach→mauve `body::before` tint over the top of every page, and an 8px `--rainbow` accent bar flush above the `--mantle` footer. On the DSA site green/yellow/red additionally carry semantic meaning (difficulty badges). Every animation needs a `prefers-reduced-motion` fallback (each stylesheet has one consolidated block for this).

## Architecture notes

- **DSA pages are shells rendered client-side.** `dsa/js/data.js` holds all topic/problem data; `home.js` renders the roadmap graph and topic list on `index.html`; `topic.js` renders `topic.html` from the `?id=<slug>` query param (unknown ids render an inline 404 state). Solved-problem state lives in localStorage via `progress.js`. Every DSA page loads `theme.js` (mobile nav + reveal-on-scroll chrome) + `progress.js` before its page script.
- **The DSA header/nav is duplicated in all five HTML files** (`index`, `topic`, `about`, `404`, `gone`) — a nav change must be applied to each one.
- **Portfolio projects are data, not markup**: edit the `PROJECTS` array at the top of `js/main.js`; cards render into `#projects-grid`.
- **Mobile nav (both sites)**: desktop keeps the nav row via `display: contents` on the menu wrapper; ≤620px shows a hamburger that toggles a dropdown (class `is-open` on the header, wired in `js/main.js` / `dsa/js/theme.js`). The stack marquee in the hero is cloned/measured by `js/main.js` to stay seamless at any viewport width.
- **JS conventions**: vanilla IIFEs with `"use strict"`, feature-detected APIs. Portfolio JS hooks onto element ids; DSA JS hooks onto data-attributes (`data-theme-toggle`, `data-nav-toggle`, `data-reset-progress`, …). DSA pages that render content call `Reveal.scan()` afterward so new nodes get the fade-in.
- `docs/ABOUTME.md` holds the personal bio/copy the portfolio content is written from.
