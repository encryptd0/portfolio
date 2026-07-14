# portfolio

Personal portfolio site plus the DSA Roadmap learning platform. Plain HTML, CSS
and JS — no framework, no build step. Open `index.html` in a browser or serve
the root with any static file server.

## Structure

```
├── index.html      Portfolio landing page
├── css/style.css   Portfolio styles
├── js/main.js      Portfolio behaviour (projects list, reveal, copy email)
├── dsa/            DSA Roadmap sub-site
│   ├── index.html      Roadmap home
│   ├── topic.html      One topic (rendered from ?id=<slug> by js/topic.js)
│   ├── about.html      About the roadmap
│   ├── 404.html        Not-found page
│   ├── gone.html       Removed-problem page
│   ├── css/style.css   DSA styles
│   └── js/             data.js (problem data), home.js, topic.js, progress.js, theme.js
└── docs/           Notes (about-me copy, theme design)
```

Both sites use a fixed Catppuccin Mocha theme (see `docs/theme.md`); DSA
progress is stored in the browser only.
