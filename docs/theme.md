---
name: catppuccin-mocha-theme
description: >-
  User's preferred website theme — a catppuccin.com-style design system built
  on the full Catppuccin Mocha palette. Use this whenever building or
  restyling any web page, portfolio, landing page, or UI for the User, or
  whenever he says "use my theme", "apply my theme", or "make it match my
  style". Produces chunky Inter typography with pastel gradient-text headings,
  gradient pill buttons with dark text, a 14-hue rainbow accent bar, mantle
  cards, one subtle glass nav, and fade-in-on-scroll.
---

# Catppuccin Mocha — Theme Spec

A design system for building playful-but-clean dark websites in the style of
[catppuccin.com](https://catppuccin.com/), on the full
[Catppuccin Mocha](https://catppuccin.com/palette) palette. Follow these rules
exactly unless the user overrides a specific point. The goal is **soothing
pastel colour on a calm dark ground**: every hue gets a home, but always as a
soft pastel over `base`/`mantle`, never loud.

## Core principles (do not violate)

1. **One dark theme.** There is no light mode and no theme toggle. The page is
   always Mocha: `base` background, `text` foreground, `subtext0` muted copy.
2. **The full palette, catppuccin.com-style.** Headings are 120° two-stop
   pastel **gradient text** (`background-clip: text`), each section pairing
   different hues (peach→mauve for the hero, pink→mauve, teal→green, blue→sky,
   peach→red, yellow→peach, …). Buttons are gradient pills. Decorative accents
   (card headings, labels, stack pills) cycle through the palette. Text on any
   pastel fill is `crust`. Mauve remains the default single accent
   (`--accent`) when only one colour is needed.
3. **The rainbow accent bar.** An 8px full-width strip of all 14 hues
   (rosewater→lavender, 90°) sits flush above the footer — the signature
   Catppuccin element.
4. **One typeface.** Inter for everything, but heavy: weight `800` for
   headings (catppuccin.com uses 900-weight system type), `600–700` for
   emphasis.
5. **Minimal glass.** Exactly ONE frosted element per page — the sticky nav.
   Nothing else gets `backdrop-filter`.
6. **Fade-in on scroll.** Content blocks fade up as they enter the viewport,
   via IntersectionObserver. Subtle, never bouncy.
7. **Soft cards over hairlines.** Cards are `mantle`-filled with a `1px`
   `surface0` border and 14–16px radius; rows still separate with hairline
   `--line` dividers. No shadows.
8. **Vanilla only.** Plain HTML, CSS, JS. No framework, no build step, no CSS
   library. Two external requests max (the Inter font files).
9. **Generous whitespace.** When unsure, add space. Never crowd.
10. **One system, defined once.** When a project has more than one site, they
    are one project: the tokens, chrome (nav, buttons, pills, sections, hero,
    footer) and motion live in a single shared stylesheet and script that
    every page of every site loads. A component may only be defined twice if
    it genuinely differs; prefer a BEM modifier over a second component.
11. **BEM naming.** `.block`, `.block__element`, `.block--modifier`, with
    `is-*` for state (`is-open`, `is-visible`, `is-complete`). One name per
    component across the whole project.

## Design tokens

Define the theme with CSS custom properties on `:root`. All values come from
the official Catppuccin Mocha palette — define the **whole** palette plus
semantic aliases, and reference only the tokens in components.

```css
:root {
  /* Catppuccin Mocha — full palette */
  --rosewater: #f5e0dc;  --flamingo: #f2cdcd;  --pink: #f5c2e7;
  --mauve: #cba6f7;      --red: #f38ba8;       --maroon: #eba0ac;
  --peach: #fab387;      --yellow: #f9e2af;    --green: #a6e3a1;
  --teal: #94e2d5;       --sky: #89dceb;       --sapphire: #74c7ec;
  --blue: #89b4fa;       --lavender: #b4befe;
  --text: #cdd6f4;       --subtext1: #bac2de;  --subtext0: #a6adc8;
  --surface2: #585b70;   --surface1: #45475a;  --surface0: #313244;
  --base: #1e1e2e;       --mantle: #181825;    --crust: #11111b;

  /* semantic aliases */
  --bg: var(--base);
  --fg: var(--text);
  --muted: var(--subtext0);
  --line: var(--surface0);
  --glass: rgba(30, 30, 46, 0.7); /* nav backdrop only (base at 70%) */
  --accent: var(--mauve);

  --rainbow: linear-gradient(90deg, var(--rosewater), var(--flamingo),
    var(--pink), var(--mauve), var(--red), var(--maroon), var(--peach),
    var(--yellow), var(--green), var(--teal), var(--sky), var(--sapphire),
    var(--blue), var(--lavender));
}
```

- Text on background = `--fg` on `--bg`. Secondary copy = `--muted` (or
  `--subtext1` for lead paragraphs).
- Borders/dividers = `--line`. Selection = `--mauve` bg / `--crust` text.
- Any pastel fill (buttons, avatars, completed states) takes `--crust` text.
- The hero area gets a soft tint over `base`:
  `linear-gradient(120deg, color-mix(in srgb, var(--base), var(--peach) 6%),
  color-mix(in srgb, var(--base), var(--mauve) 10%))`, masked to fade into
  `base` (catppuccin.com does the same).
- `<meta name="theme-color">` and favicon backgrounds = `#1e1e2e` (base);
  favicon glyph = a peach→mauve gradient.
- Never hardcode a hex in a component — always reference a token.

## Typography

- **Family:** `"Inter", system-ui, -apple-system, sans-serif`
  (load weights `400;500;600;700;800` from Google Fonts with `display=swap`
  and `preconnect` hints).
- **Base:** `font-size: clamp(1rem, 0.96rem + 0.25vw, 1.1rem)`,
  `line-height: 1.65`, `letter-spacing: -0.011em`, `-webkit-font-smoothing: antialiased`.
- **Headings:** weight `800`, tight tracking, **gradient text**
  (see below). Scale with `clamp()`:
  - Hero `h1`: `clamp(2.6rem, 8vw, 6rem)`, `line-height: 1.06`, `letter-spacing: -0.04em`.
  - Section `h2`: `clamp(1.7rem, 4vw, 2.6rem)`, `letter-spacing: -0.03em`.
  - Card/project `h3`: ~`1.2–1.25rem`, weight `700`, `letter-spacing: -0.02em`,
    coloured in the card's own hue.
- Body weights: `400` normal, `500` for emphasis/eyebrows, `600` for `<strong>`.
- Use `font-variant-numeric: tabular-nums` for index numbers.

### Gradient text

```css
.heading {
  background-image: linear-gradient(120deg, var(--g1, var(--peach)), var(--g2, var(--mauve)));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

Each section sets its own `--g1`/`--g2` hue pair so headings walk through the
palette down the page. Add a little `padding-bottom` (~`0.08em`) on huge
headings so descenders aren't clipped.

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
`1px` bottom hairline. Gradient-text brand left, links centre/right, gradient
pill link far right. Link hover: a `2px` pink→mauve underline grows from `0`
to `100%` width.

**Buttons (catppuccin.com-style gradient pills)** — pill shaped
(`border-radius: 999px`), **no border**, `--crust` text, weight `600`, and a
120° two-stop gradient fill at `background-size: 150% 100%` /
`background-position: top left`; on hover the position slides to `top right`
(`transition: background-position .35s ease-in-out`). Hue pairs:
peach→red, teal→green, blue→sky, pink→mauve. Pick per-button so a button
group shows several hues.

**Pills/tags** — `border-radius: 999px`, small (`.72–.82rem`). Decorative
runs (e.g. a tech-stack row) cycle each pill through a palette hue: hue text
with a border of the same hue at ~35% opacity
(`color-mix(in srgb, var(--hue) 35%, transparent)`). Plain tags: `surface0`
fill with `subtext1` text.

**Rainbow accent bar** — `height: 8px; background-image: var(--rainbow);`
full width, flush above the footer. The footer itself is a full-bleed
`mantle` block.

**Cards & project cards** — `background: var(--mantle)`,
`1px solid var(--line)`, `border-radius: 14–16px`, padding ~`1.8rem`. Each
card owns a palette hue (`--c`) used for its `h3` and hover border. Hover:
`transform: translateY(-4px)` and border becomes `var(--c)`. No shadows.
Project cards add a `↗` arrow that nudges and takes `--c` on hover.

**Lists** — timelines/principles use top `1px` hairlines between rows, a bold
label cycling through palette hues, and `--muted` description. No bullets.

**Avatars / filled chips** — 120° gradient fills cycling hue pairs
(pink→mauve, teal→green, peach→red) with `--crust` text.

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

## JS conventions

- Keep all JS vanilla, wrapped in an IIFE, `"use strict"`, feature-detected.
- No theme toggle, no `data-theme` attribute, no `prefers-color-scheme`
  handling — the theme is fixed.

## File structure

A single site:

```
index.html        css/style.css        js/main.js
```

Several sites in one project — the system is defined once and shared, and each
site keeps only its own components:

```
css/base.css      the whole system: tokens, chrome, motion
js/site.js        the shared behaviours: mobile nav, reveal
index.html        css/style.css   js/main.js      (site 1: its own components)
sub/index.html    sub/css/style.css  sub/js/*.js  (site 2: its own components)
```

Every page loads `base.css` before its own stylesheet, and `site.js` before its
own script. Fonts via `<link>` in `<head>`. Inline an SVG `data:` URI favicon (`#1e1e2e`
square, `#cba6f7` "R" or the site's initial) — no external icon files.

## Checklist before finishing

- [ ] Every colour is a Catppuccin Mocha value, referenced through a token.
- [ ] Headings are 120° gradient text; each section has its own hue pair.
- [ ] Buttons are gradient pills with `--crust` text and the hover
      background-position slide.
- [ ] The 8px rainbow accent bar sits above the `mantle` footer.
- [ ] Decorative accents cycle the palette; text on pastel fills is `--crust`.
- [ ] Inter is the only font family (weight 800 headings).
- [ ] Exactly one glass element (the nav).
- [ ] All blocks fade in on scroll; reduced-motion respected (including
      button gradient slides).
- [ ] `mantle` cards with hairline borders, pill controls, no shadows.
- [ ] Responsive: 3→2→1 columns; nav collapses to the burger dropdown.
- [ ] Vanilla HTML/CSS/JS, no framework.
- [ ] No light mode, no theme toggle.
