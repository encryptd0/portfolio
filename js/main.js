/* =========================================================
   Riekus Grobler — Portfolio
   Vanilla JS: reveal-on-scroll, theme toggle, year stamp
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Current year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =========================================================
     PROJECTS  —  ★ EDIT THIS LIST TO ADD / REMOVE PROJECTS ★
     Copy a { } block, change the fields, done.
       title       : project name (required)
       url         : link to open (website, repo, or mailto:)
       description : one or two sentences
       tags        : array of short labels
       wip         : true  -> shows a "WIP" badge (optional)
     ========================================================= */
  let PROJECTS = [
    {
      title: "CT4 Construction",
      url: "https://ct4construction.co.za",
      description: "Freelance web development and SEO for a construction " +
        "company — a real client project, live in production.",
      tags: ["Freelance", "Web Dev", "SEO"]
    },
    {
      title: "Personal Blog App",
      url: "mailto:riekusgroblerps4@gmail.com",
      description: "A Node.js / Express / EJS / MongoDB blog used to explore " +
        "backend architecture and deployment properly, end-to-end.",
      tags: ["Node.js", "Express", "MongoDB"]
    },
    {
      title: "Forgeline",
      url: "mailto:riekusgroblerps4@gmail.com",
      description: "A personal product I'm actively building — part of " +
        "shipping my own things, not just learning in isolation.",
      tags: ["SaaS", "In progress"],
      wip: true
    }
  ];

  function renderProjects() {
    const grid = document.getElementById("projects-grid");
    if (!grid) return;

    PROJECTS.forEach(function (p, i) {
      var card = document.createElement("a");
      card.className = "project reveal";
      card.href = p.url || "#";
      card.style.setProperty("--d", i % 3); // stagger the fade-in per row
      if (/^https?:/i.test(p.url || "")) {
        card.target = "_blank";
        card.rel = "noopener noreferrer";
      }

      // Title row
      var top = document.createElement("div");
      top.className = "project__top";

      var h3 = document.createElement("h3");
      h3.textContent = p.title;
      if (p.wip) {
        var wip = document.createElement("span");
        wip.className = "project__wip";
        wip.textContent = "WIP";
        h3.appendChild(document.createTextNode(" "));
        h3.appendChild(wip);
      }

      var arrow = document.createElement("span");
      arrow.className = "project__arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "↗";

      top.appendChild(h3);
      top.appendChild(arrow);

      // Description
      var desc = document.createElement("p");
      desc.textContent = p.description || "";

      // Tags
      var tags = document.createElement("div");
      tags.className = "project__tags";
      (p.tags || []).forEach(function (t) {
        var span = document.createElement("span");
        span.textContent = t;
        tags.appendChild(span);
      });

      card.appendChild(top);
      card.appendChild(desc);
      card.appendChild(tags);
      grid.appendChild(card);
    });
  }
  renderProjects();

  /* ---------- Theme toggle (persisted) ---------- */
  var STORAGE_KEY = "rg-theme";
  var root = document.documentElement;
  var toggle = document.getElementById("themeToggle");
  var label = document.getElementById("themeLabel");
  var meta = document.querySelector('meta[name="theme-color"]');

  var THEMES = {
    light: { next: "dark", color: "#ffffff", label: "Dark" },
    dark: { next: "light", color: "#0a0a0a", label: "Light" }
  };

  function applyTheme(theme) {
    if (!THEMES[theme]) theme = "light";
    root.setAttribute("data-theme", theme);
    // Label shows the theme you'll switch TO.
    if (label) label.textContent = THEMES[theme].label;
    if (meta) meta.setAttribute("content", THEMES[theme].color);
  }

  // Respect saved choice, else follow the OS colour scheme.
  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { }
  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    applyTheme("dark");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") || "light";
      var next = THEMES[current] ? THEMES[current].next : "dark";
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: no observer support, just show everything.
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Active nav link on scroll ---------- */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".nav__links a")
  );
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = "#" + entry.target.id;
        navLinks.forEach(function (a) {
          a.style.color = a.getAttribute("href") === id ? "var(--ink)" : "";
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Copy email to clipboard ---------- */
  var copyBtn = document.getElementById("copyBtn");
  var copyLabel = document.getElementById("copyLabel");
  var copyResetTimer;

  function copyText(text) {
    // Modern async clipboard API, with a legacy fallback.
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand("copy");
        document.body.removeChild(ta);
        ok ? resolve() : reject();
      } catch (e) { reject(e); }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.getAttribute("data-email") || "";
      copyText(email).then(function () {
        copyBtn.classList.add("is-copied");
        if (copyLabel) copyLabel.textContent = "Copied";
        clearTimeout(copyResetTimer);
        copyResetTimer = setTimeout(function () {
          copyBtn.classList.remove("is-copied");
          if (copyLabel) copyLabel.textContent = "Copy";
        }, 2000);
      }).catch(function () {
        if (copyLabel) copyLabel.textContent = "Press ⌘/Ctrl+C";
      });
    });
  }
})();
