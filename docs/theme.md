---
name: monochrome-minimal-theme
description: >-
  User's preferred website theme — a modern, minimalist, monochrome
  (black & white) design system. Use this whenever building or restyling any
  web page, portfolio, landing page, or UI for the User, or whenever he says
  "use my theme", "apply my theme", or "make it match my style". Produces clean
  Inter typography, pure black/white tokens with a light/dark invert, hairline
  dividers, one subtle glass nav, rounded pill controls, and fade-in-on-scroll.
---

# Monochrome Minimal — Theme Spec

A design system for building clean, modern, black-and-white websites. Follow
these rules exactly unless the user overrides a specific point. The goal is
**restraint**: lots of whitespace, one typeface, no colour, quiet motion.

## Core principles (do not violate)

1. **Monochrome only.** Pure black, white, and greys. No accent/brand colour,
   no gradients-as-decoration, no coloured highlights. Contrast comes from
   type weight, size, and whitespace — not hue.
2. **One typeface.** Inter for everything. No secondary display or mono font.
3. **Minimal glass.** Exactly ONE frosted element per page — the sticky nav.
   Nothing else gets `backdrop-filter`.
4. **Fade-in on scroll.** Content blocks fade up as they enter the viewport,
   via IntersectionObserver. Subtle, never bouncy.
5. **Hairlines, not boxes.** Separate with `1px` `--line` dividers and thin
   borders. Avoid heavy fills, drop shadows, and busy cards.
6. **Vanilla only.** Plain HTML, CSS, JS. No framework, no build step, no CSS
   library. Two external requests max (the Inter font files).
7. **Generous whitespace.** When unsure, add space. Never crowd.

## Design tokens

Define both themes with CSS custom properties on `:root`/`[data-theme]`.
`data-theme="light"` is the default; `dark` is a straight invert.

```css
:root,
[data-theme="light"] {
  --bg:    #ffffff;              /* page background */
  --fg:    #0a0a0a;              /* near-black text */
  --muted: #6b6b6b;             /* secondary/grey text */
  --line:  #e6e6e6;             /* hairline dividers & borders */
  --glass: rgba(255,255,255,0.7); /* nav backdrop only */
}

[data-theme="dark"] {
  --bg:    #0a0a0a;
  --fg:    #f5f5f5;
  --muted: #9a9a9a;
  --line:  #232323;
  --glass: rgba(10,10,10,0.7);
}
```

- Text on background = `--fg` on `--bg`. Secondary copy = `--muted`.
- Borders/dividers = `--line`. Selection = `--fg` bg / `--bg` text.
- Never hardcode a hex in a component — always reference a token.

## Typography

- **Family:** `"Inter", system-ui, -apple-system, sans-serif`
  (load weights `400;500;600;700` from Google Fonts with `display=swap` and
  `preconnect` hints).
- **Base:** `font-size: clamp(1rem, 0.96rem + 0.25vw, 1.1rem)`,
  `line-height: 1.65`, `letter-spacing: -0.011em`, `-webkit-font-smoothing: antialiased`.
- **Headings:** weight `600`, tight tracking. Scale with `clamp()`:
  - Hero `h1`: `clamp(2.6rem, 8vw, 6rem)`, `line-height: 1.02`, `letter-spacing: -0.04em`.
  - Section `h2`: `clamp(1.7rem, 4vw, 2.6rem)`, `letter-spacing: -0.03em`.
  - Card/project `h3`: ~`1.2–1.25rem`, `letter-spacing: -0.02em`.
- Body weights: `400` normal, `500` for emphasis/eyebrows, `600` for `<strong>`.
- Use `font-variant-numeric: tabular-nums` for index numbers.

## Layout

- **Container:** `width: min(1080px, 100% - 3rem); margin-inline: auto;`
- **Section rhythm:** `padding: clamp(3.5rem, 9vh, 6rem) 0;`
- **Section header:** an index number (`01`, `02`, …) in `--muted` beside the
  title, with a `1px solid var(--line)` bottom border and ~`3rem` bottom margin.
- **Grids:** 3-column for cards/projects (`gap: 1.4rem`), collapsing to 2 then 1.
- **Split sections:** two equal columns, `gap: clamp(2rem, 6vw, 5rem)`.

## Components

**Nav (the one glass element)** — sticky top, `--glass` background with
`backdrop-filter: saturate(140%) blur(14px)` (include `-webkit-` prefix),
`1px` bottom hairline. Brand left, links centre/right, pill toggle far right.
Link hover: underline grows from `0` to `100%` width (`1px`, `--fg`).

**Buttons** — pill shaped (`border-radius: 999px`), `1px solid var(--fg)`.
- Solid: `background: var(--fg); color: var(--bg);` hover `opacity: .82`.
- Ghost: transparent; hover inverts to solid.

**Pills/tags** — `border-radius: 999px`, `1px solid var(--line)`, `--muted`
text, small (`.72–.82rem`). Used for tech stack and project tags.

**Cards & project cards** — `1px solid var(--line)`, `border-radius: 14px`,
padding ~`1.8rem`. Hover: `transform: translateY(-4px)` and border becomes
`--fg`. No shadows. Project cards add a `↗` arrow that nudges on hover.

**Lists** — timelines/principles use top `1px` hairlines between rows, a bold
`--fg` label, and `--muted` description. No bullets.

**Theme toggle** — pill button, `1px solid var(--line)`, label shows the mode
it will switch TO ("Dark" while light, "Light" while dark).

## Motion

- **Fade-in on scroll** is the signature interaction:

```css
.reveal {
  opacity: 0; transform: translateY(22px);
  transition: opacity .8s cubic-bezier(.22,.61,.36,1),
              transform .8s cubic-bezier(.22,.61,.36,1);
  transition-delay: calc(var(--d, 0) * 90ms); /* optional stagger */
}
.reveal.is-visible { opacity: 1; transform: none; }
```

- Add `class="reveal"` to blocks; use inline `style="--d:1"` to stagger.
- Trigger with an `IntersectionObserver` (threshold ~`0.12`, unobserve after
  first reveal). Provide a no-JS/observer fallback that shows everything.
- Hover transitions: `.2–.25s ease`. Keep all motion subtle — no bounce,
  no parallax, no long durations.
- **Always** honour reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  * { scroll-behavior: auto; }
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

## Theme toggle behaviour (JS)

- Store choice in `localStorage`; on load, use the saved value, else fall back
  to `prefers-color-scheme`.
- Toggle flips `data-theme` between `light`/`dark` and updates the
  `<meta name="theme-color">` content (`#ffffff` / `#0a0a0a`).
- Keep all JS vanilla, wrapped in an IIFE, `"use strict"`, feature-detected.

## File structure

```
index.html        css/style.css        js/main.js
```

Fonts via `<link>` in `<head>`. Inline an SVG `data:` URI favicon (black
square, white "R" or the site's initial) — no external icon files.

## Checklist before finishing

- [ ] Only black / white / grey — zero colour anywhere.
- [ ] Inter is the only font family.
- [ ] Exactly one glass element (the nav).
- [ ] All blocks fade in on scroll; reduced-motion respected.
- [ ] Every colour references a token, both light and dark defined.
- [ ] Hairline dividers, pill controls, `14px` card radius, no shadows.
- [ ] Responsive: 3→2→1 columns; nav links hide on narrow screens.
- [ ] Vanilla HTML/CSS/JS, no framework.
