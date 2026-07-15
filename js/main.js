/* =========================================================
   Riekus Grobler — Portfolio
   Page-specific JS: the work grid, the nav scroll-spy, copy-to-
   clipboard, and the year stamp. The mobile nav is shared with the
   DSA site — see js/site.js, loaded first.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Current year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =========================================================
     WORK  —  ★ EDIT THIS LIST TO ADD / REMOVE PROJECTS ★
     Copy a { } block, change the fields, done.
       title       : project name (required)
       url         : link to open (website, repo, or mailto:)
       description : one or two sentences
       meta        : the mono line at the foot of the column
       wip         : true -> shows a "WIP" outline (optional)
     ========================================================= */
  var PROJECTS = [
    {
      title: "CT4 Construction",
      url: "https://ct4construction.co.za",
      description:
        "Web development and SEO for a construction company. A real client " +
        "project, live in production.",
      meta: "Freelance · live"
    },
    {
      title: "Personal Blog App",
      url: "mailto:riekusgroblerps4@gmail.com",
      description:
        "Node.js, Express, EJS and MongoDB — built to get backend " +
        "architecture and deployment right, end to end.",
      meta: "Node · Mongo"
    },
    {
      title: "Forgeline",
      url: "mailto:riekusgroblerps4@gmail.com",
      description:
        "A product of my own, actively in progress. Shipping my own things, " +
        "not just learning in isolation.",
      meta: "SaaS · in progress",
      wip: true
    }
  ];

  const rail = document.querySelector(".rail");
  const track = document.querySelector(".rail__track");
  const originalGroup = document.querySelector(".rail__group");

  function buildMarquee() {
    const clones = track.querySelectorAll(
      ".rail__group:not(:first-child)"
    );

    clones.forEach((clone) => clone.remove());

    const groupWidth = originalGroup.offsetWidth;

    track.style.setProperty(
      "--marquee-distance",
      groupWidth
    );

    while (track.scrollWidth < rail.offsetWidth + groupWidth) {
      const clone = originalGroup.cloneNode(true);

      clone.setAttribute("aria-hidden", "true");

      track.appendChild(clone);
    }
  }

  buildMarquee();

  window.addEventListener("resize", buildMarquee);

  function renderWork() {
    var grid = document.getElementById("work-grid");
    if (!grid) return;

    PROJECTS.forEach(function (p, i) {
      var item = document.createElement("a");
      item.className = "work__item";
      item.href = p.url || "#";
      if (/^https?:/i.test(p.url || "")) {
        item.target = "_blank";
        item.rel = "noopener noreferrer";
      }

      /* Rows reveal in sequence as the section arrives. site.js observes
         [data-reveal] on DOMContentLoaded, which is after this runs. */
      item.setAttribute("data-reveal", "");
      item.style.setProperty("--reveal-delay", i * 0.09 + "s");

      var top = document.createElement("div");
      top.className = "work__top";

      var index = document.createElement("span");
      index.className = "work__index";
      index.textContent = String(i + 1).padStart(2, "0");

      var arrow = document.createElement("span");
      arrow.className = "work__arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "↗";

      top.appendChild(index);
      top.appendChild(arrow);

      var title = document.createElement("span");
      title.className = "work__title";
      title.textContent = p.title;
      if (p.wip) {
        var wip = document.createElement("span");
        wip.className = "work__wip label";
        wip.textContent = "WIP";
        title.appendChild(wip);
      }

      var desc = document.createElement("p");
      desc.className = "work__desc";
      desc.textContent = p.description || "";

      var meta = document.createElement("span");
      meta.className = "work__meta";
      meta.textContent = p.meta || "";

      item.appendChild(top);
      item.appendChild(title);
      item.appendChild(desc);
      item.appendChild(meta);
      grid.appendChild(item);
    });
  }
  renderWork();

  /* ---------- Active nav link on scroll ---------- */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".nav__links a")
  );
  var sections = navLinks
    .map(function (a) {
      return document.querySelector(a.getAttribute("href"));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = "#" + entry.target.id;
          navLinks.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach(function (s) {
      spy.observe(s);
    });
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
      } catch (e) {
        reject(e);
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.getAttribute("data-email") || "";
      copyText(email)
        .then(function () {
          copyBtn.classList.add("is-copied");
          if (copyLabel) copyLabel.textContent = "Copied";
          clearTimeout(copyResetTimer);
          copyResetTimer = setTimeout(function () {
            copyBtn.classList.remove("is-copied");
            if (copyLabel) copyLabel.textContent = "Copy";
          }, 2000);
        })
        .catch(function () {
          if (copyLabel) copyLabel.textContent = "Press ⌘/Ctrl+C";
        });
    });
  }
})();
