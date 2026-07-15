# portfolio

Personal portfolio site plus the DSA Roadmap learning platform. Plain HTML, CSS
and JS — no framework, no build step. Open `index.html` in a browser or serve
the root with any static file server.

## Structure

```
├── css/base.css    Shared design system — tokens, chrome, motion (both sites)
├── js/site.js      Shared behaviour — nav, scroll reveal, magnetic CTAs
├── index.html      Portfolio landing page
├── css/style.css   Portfolio-only components
├── js/main.js      Portfolio behaviour (projects list, scroll-spy, copy email)
├── dsa/            DSA Roadmap sub-site
│   ├── index.html      Roadmap home
│   ├── topic.html      One topic (rendered from ?id=<slug> by js/topic.js)
│   ├── about.html      About the roadmap
│   ├── 404.html        Not-found page
│   ├── gone.html       Removed-problem page
│   ├── css/style.css   DSA-only components
│   └── js/             data.js (problem data), home.js, topic.js, progress.js
└── docs/           Notes (about-me copy, theme design)
```

Every page of both sites loads `css/base.css` and `js/site.js` before its own
stylesheet and script.

Both sites use a fixed "Deep Field" theme — black canvas, forest-green accent,
warm-cream type (see `docs/theme.md`). DSA progress is stored in the browser
only.
