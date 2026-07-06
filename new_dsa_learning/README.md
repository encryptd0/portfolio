# DSA Roadmap

A free, non-commercial website for learning data structures & algorithms.
It organizes 150 classic LeetCode practice problems into 18 topics arranged
as a dependency roadmap (inspired by [neetcode.io](https://neetcode.io)), so
a learner always knows what to study next.

No ads, no accounts, no tracking, no backend. Progress is stored in your
browser's `localStorage` and never leaves your machine.

## Running it

There is nothing to install or build — it's plain HTML, CSS and JavaScript.

- Open `index.html` directly in a browser, **or**
- serve the folder with any static file server, e.g.
  `python3 -m http.server` and visit `http://localhost:8000`.

## Structure

```
index.html        Roadmap graph + ordered topic list
topic.html        One topic (?id=<slug>), rendered client-side
about.html        What the site is + credits
gone.html         "Problem may have moved" helper (?title=…)
404.html          Not-found page
theme.md          The design spec the CSS is derived from
css/styles.css    The entire design system
js/data.js        The static problem catalog (the only data source)
js/progress.js    localStorage progress store + global reset
js/theme.js       Light/dark toggle + fade-in-on-scroll (from theme.md)
js/home.js        Graph bands, SVG connectors, progress reflection
js/topic.js       Topic rendering, done toggles, filters, search
```

The only external requests are the Inter font files from Google Fonts.

## Credits

- Roadmap idea and problem selection: [NeetCode](https://neetcode.io)
- All problems live on [LeetCode](https://leetcode.com) — this site hosts no
  problem content and only links out. Problems that require LeetCode Premium
  are hidden by default and badged when shown.
