---
name: deep-field-theme
description: >-
  User's preferred website theme — an editorial, architectural design system on
  a black canvas, with a deep forest-green accent, warm-cream typography, and a
  serif display face against spaced uppercase sans. Use this whenever building
  or restyling any web page, portfolio, landing page, or UI for the User, or
  whenever he says "use my theme", "apply my theme", or "make it match my
  style". Produces a cinematic, high-craft page where scale, negative space and
  slow deliberate motion carry the hierarchy.
---

# Deep Field — Theme Spec

A design system for building cinematic, editorial, high-craft pages. A black
canvas, one deep green, warm cream type, and a lot of air. Follow these rules
exactly unless the user overrides a specific point.

The goal is **composition that reads as intent**. Hierarchy comes from scale,
position and negative space — never from boxes, fills or effects. Sections are
*composed*, not stacked. If the page looks like a column of centred cards, it
is wrong; if it needs an effect to feel premium, it is also wrong.

## Core principles (do not violate)

1. **One dark theme.** Black is the canvas. There is no light mode and no theme
   toggle. Cream is the ink, green is the one accent.
2. **Three colours, and nothing else.** `#000000`, `#003728`, `#F6F4EE`. Tonal
   variations of *these three* are allowed for borders, muted copy, hover
   states and depth. Never introduce a fourth hue as decoration.
3. **The accent means something.** Green marks what is actionable, current or
   complete — links, the active nav item, an index number, a finished state.
   Never a decorative fill behind text.
4. **Two typefaces, two jobs.** Instrument Serif carries every heading and any
   short display value. Inter carries body copy, and every label, index, count,
   status and tag — always uppercase with `letter-spacing: .2em+` at small
   sizes. Never mix the roles.
5. **Sharp corners.** `border-radius: 0` is the default. The only exceptions are
   true circles — an avatar disc, a ring of geometry — which must be deliberate.
6. **Hairlines, not boxes.** Structure is drawn with 1px lines: section
   dividers, column rules, row separators. Cards are defined by the lines
   *between* them, never by a border around them or a fill under them.
7. **No gradients as decoration. No shadows. No glows.** A gradient is allowed
   only to fade a hairline out to nothing. Never on text, buttons or surfaces.
8. **Asymmetry.** Offset the content. Alternate the surface between black and
   cream. Let large elements bleed off the edge. Never centre everything.
9. **Generous whitespace.** When unsure, add space. Section rhythm is `--sp-6`.
10. **Motion is deliberate, never flashy.** See Motion below. Everything eases
    on `cubic-bezier(.76,0,.24,1)`. No bouncing, no spinning, no pulsing.
11. **Vanilla only.** Plain HTML, CSS, JS. No framework, no build step, no CSS
    library, no animation library. Two external requests max (the two fonts).
12. **One system, defined once.** When a project has more than one site, they
    are one project: tokens, chrome (nav, buttons, sections, hero, footer) and
    motion live in a single shared stylesheet and script that every page loads.
    Prefer a BEM modifier over a second component.
13. **BEM naming.** `.block`, `.block__element`, `.block--modifier`, with `is-*`
    for state (`is-open`, `is-in`, `is-active`, `is-complete`).

## Design tokens

Components reference **only the semantic tokens** — never the raw colours. That
indirection is what lets a section flip to cream by re-declaring six names.

```css
:root {
  /* The three fixed colours */
  --black: #000000;
  --green: #003728;
  --cream: #f6f4ee;

  /* Tonal variations — derived only from the three above */
  --green-mid: #0b5c42;   /* graphics + borders on the dark canvas */
  --green-lit: #4fa98a;   /* accent TEXT on dark: 7.4:1 on black */
  --green-deep: #002419;  /* large abstract shapes, depth */

  /* Semantic surface tokens — components use these */
  --bg: var(--black);
  --fg: var(--cream);
  --fg-dim: rgba(246, 244, 238, .62);   /* secondary copy */
  --fg-mute: rgba(246, 244, 238, .4);   /* labels, meta */
  --line: rgba(246, 244, 238, .14);     /* the structural hairline */
  --line-strong: rgba(246, 244, 238, .3);
  --accent: var(--green-lit);
  --accent-line: var(--green-mid);
}

.surface--cream {
  --bg: var(--cream);
  --fg: var(--black);
  --fg-dim: rgba(0, 0, 0, .6);
  --fg-mute: rgba(0, 0, 0, .42);
  --line: rgba(0, 55, 40, .16);
  --line-strong: rgba(0, 55, 40, .38);
  --accent: var(--green);  /* 12.4:1 on cream — the deep green reads here */
  --accent-line: var(--green);
  background: var(--bg);
  color: var(--fg);
}
```

**The contrast rule that matters:** `#003728` on black is effectively invisible
(≈1.5:1). The deep green is only legible **on cream**. On the black canvas any
green that carries text or an indicator must be `--green-lit`. Never put
`--green` text on `--black`.

Scales — type `--step-0`→`--step-4` (`--step-4` is the hero, up to `8.5rem`),
spacing `--sp-1`→`--sp-6`, motion `--dur-1: .35s`, `--dur-2: .6s`, `--dur-3: .9s`,
`--ease: cubic-bezier(.76,0,.24,1)`, `--container: 1240px`.

## Typography

Instrument Serif and Inter, from Google Fonts with `display=swap` + `preconnect`:

```
https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap
```

- **Base:** Inter, `--step-0`, `line-height: 1.65`, antialiased. Running text
  caps at ~54ch.
- **Headings:** Instrument Serif, weight `400` (never bolded — the face carries
  itself), tight tracking, `text-wrap: balance`.
  - Hero `h1`: `--step-4`, `line-height: .88`, `letter-spacing: -.035em`. Set it
    enormous; it is the whole design.
  - Section `h2`: `--step-3`, `line-height: .92`.
- **Labels (Inter):** `.6–.68rem`, `500`, uppercase, `letter-spacing: .2em`,
  colour `--fg-mute`. Every eyebrow, index, count, tag, status and button label.
- The accent may italicise **one existing word** inside a heading to land the
  point (`who builds it <em>right</em>`) — at most once per page. Highlighting
  must never change or duplicate the wording.
- Numbers in a column: `font-variant-numeric: tabular-nums`.
- **Masked word reveals:** if a headline animates in per word, the mask box is
  the line box — at a tight `line-height` it *will* crop ascenders and
  descenders. Open the box with `padding` and cancel it with an equal negative
  `margin`.

## Layout

- **Container:** `width: min(1240px, 100% - clamp(2rem, 8vw, 7rem))`.
- **Section rhythm:** `padding: var(--sp-6) 0`, opened by a hairline that draws
  itself as the section arrives.
- **Section header:** a green index (`01`, `02`) beside a huge serif title — but
  only where the order is real. If the sections could be shuffled, drop them.
- **Surfaces:** alternate black and cream. A cream band is full-bleed, so it
  sits **outside** the centered container as a wrapper around it.
- **Full-bleed bands:** never use `100vw` — it counts the scrollbar, so the band
  lands off-centre and the page overflows sideways. Put the band outside the
  container and let `width: 100%` do it.
- **Columns divided by a rule** need padding on *both* sides; only the outer
  edges sit flush with the container. Reset which items are "outer" at every
  breakpoint.
- **Mobile is recomposed, not shrunk** — reorder the composition (`order`,
  `display: contents`), don't just collapse to one column.

## Components

**Nav** — sticky, black, one hairline beneath. Serif wordmark left, spaced
uppercase links right. The indicator is a 1px green rule that scales from the
left on hover and stays under the current page. On mobile: a full-screen black
overlay with **oversized serif** links, staggered in, and a scroll lock on the
body while open.

**CTAs** — never a filled pill. An uppercase label over a full-width hairline,
with an arrow that extends `6px` on hover; the label and rule take the accent.
A bordered `--sm` variant exists for real UI affordances (Reset, filters).

**Work / project index** — not cards. Full-width rows on a hairline grid: index,
oversized serif name, description, meta, arrow. Hover: a `--green-deep` wash
sweeps in from the left, the name takes the accent and shifts `10px`, the arrow
extends.

**Rail (the green band)** — one full-bleed `--green` block per page as
punctuation. Cream text, serif values, hairlines at 20% cream.

**The facts rail** — a column of `<dl>` pairs, uppercase label over a short
serif value, split by hairlines. Where hard specifics live.

**Labels, tags, counts** — uppercase Inter, `--fg-mute`, no fill, no border. If
a tag genuinely needs a box, give it a 1px outline, never a fill.

**Semantic states** — status/difficulty may use muted `--ok`/`--warn`/`--bad` as
*text and 1px outline only*, never a fill. Tune them for the dark canvas.

## Motion

Motion is deliberate and slow. Everything uses `--ease`. Budget: an entrance per
section, plus hover feedback.

- **Reveal on scroll**: `[data-reveal]` fades up `1.6rem` over `--dur-3` as it
  enters, staggered by `--reveal-delay`. Reveal **once** — `unobserve` on entry;
  never re-hide on scroll back.
- **Line draw**: `[data-reveal-line]` scales a hairline from `scaleX(0)`.
- **Hero**: words rise out of their masks, staggered ~60ms; the rule draws after.
- **Hover**: colour, plus a few px of movement — a link shifts, an arrow
  extends, an image scales `~1.05`. Nothing bounces.
- **Magnetic CTAs**: `[data-magnetic]` leans a few px toward the cursor. Gate it
  behind `(hover: hover)` and reduced motion.
- **No** parallax that fights the scrollbar, no scroll-jacking, no marquees, no
  pulsing dots, no ambient loops.
- **The reveal must fail open.** CSS hides `[data-reveal]` only under `html.js`,
  a class the script adds itself — so with JS off or broken, content is simply
  visible. If `IntersectionObserver` is missing, reveal everything immediately.
- **Always** honour reduced motion, and make sure it leaves nothing hidden:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .js [data-reveal], .js [data-reveal-line] {
    opacity: 1; transform: none; transition: none;
  }
  *, *::before, *::after {
    transition-duration: .01ms !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

## Images

Treat images as composition, not content blocks: crop hard, mask, offset, let
them bleed. Prefer a circular disc or a ring of green geometry over a rectangle
in a row.

- **Line art on a near-white ground** (avatars, logos) is *already* the palette:
  put it on a `--cream` disc and `mix-blend-mode: multiply` the image. That maps
  the white ground to exactly cream and leaves the linework black. Add
  `isolation: isolate` so the blend stops at the disc.
- **Photographs** may take grayscale + a green `mix-blend-mode: color` wash.
  Never apply that treatment to line art — it tints the whole plate.

## JS conventions

- Vanilla, wrapped in an IIFE, `"use strict"`, feature-detected.
- Shared behaviour hooks onto data-attributes (`data-nav-toggle`, `data-reveal`,
  `data-magnetic`); page scripts may use ids.
- No theme toggle, no `data-theme`, no `prefers-color-scheme` — the theme is
  fixed. `prefers-reduced-motion` is the only media query the JS reads.
- If a script renders DOM, the stylesheet must match the class names it emits.
  Restyle to the existing class contract rather than rewriting the renderer.

## File structure

```
css/base.css      the whole system: tokens, chrome, motion, reveal
js/site.js        the shared behaviours: nav, reveal, magnetic
index.html        css/style.css   js/main.js      (site 1: its own components)
sub/index.html    sub/css/style.css  sub/js/*.js  (site 2: its own components)
```

Every page loads `base.css` before its own stylesheet, and `site.js` before its
own script. Fonts via `<link>` in `<head>`. Inline an SVG `data:` URI favicon.

## Checklist before finishing

- [ ] Every colour is a semantic token; no raw hex in a component.
- [ ] No `--green` text on `--black` anywhere (it is invisible — use
      `--green-lit`).
- [ ] `border-radius: 0` everywhere, bar deliberate true circles.
- [ ] The accent marks only actionable / current / complete things.
- [ ] No shadows, no glows, no decorative gradients.
- [ ] Serif for headings; uppercase spaced Inter for every label. No role bleed.
- [ ] Structure is hairlines, not boxes or fills.
- [ ] Surfaces alternate; the composition is offset, not centred.
- [ ] Reveals fire once, fail open without JS, and are disabled under reduced
      motion with nothing left hidden.
- [ ] Mobile is recomposed; the nav is a full-screen overlay with a scroll lock.
- [ ] No horizontal overflow at 390 / 768 / 1440 / 2560.
- [ ] Vanilla HTML/CSS/JS, no framework, no build step.
