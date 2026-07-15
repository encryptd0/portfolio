/* =========================================================
   Riekus Grobler — Portfolio
   Page-specific JS: project cards, stack marquee, scroll spy,
   copy-to-clipboard, year stamp. The mobile nav and the reveal
   are shared with the DSA site — see js/site.js, loaded first.
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

    if (window.Reveal) window.Reveal.scan(grid);
  }
  renderProjects();

  /* ---------- Stack marquee ---------- */
  // The CSS loop slides the track by half its width, so the first half must
  // be at least as wide as the viewport. Clone the source row until it is
  // (the static duplicate in the HTML only covers the no-JS case).
  var marqueeTrack = document.querySelector(".stack-marquee__track");

  function buildMarquee() {
    var row = marqueeTrack.firstElementChild;
    while (row.nextElementSibling) marqueeTrack.removeChild(row.nextElementSibling);

    var rowWidth = row.getBoundingClientRect().width;
    if (!rowWidth) return;

    var perHalf = Math.max(2, Math.ceil(window.innerWidth / rowWidth) + 1);
    for (var k = 0; k < perHalf * 2 - 1; k++) {
      var clone = row.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      marqueeTrack.appendChild(clone);
    }
    // Fixed speed regardless of how wide the loop ended up (~55 px/s).
    marqueeTrack.style.animationDuration = Math.round(perHalf * rowWidth / 55) + "s";
  }

  if (marqueeTrack && marqueeTrack.firstElementChild) {
    buildMarquee();
    // Row widths shift when the Inter webfont swaps in; rebuild then.
    if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
      document.fonts.ready.then(buildMarquee);
    }
    var marqueeResizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(marqueeResizeTimer);
      marqueeResizeTimer = setTimeout(buildMarquee, 200);
    });
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
          a.style.color = a.getAttribute("href") === id ? "var(--accent)" : "";
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
