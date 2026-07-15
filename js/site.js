/* Shared chrome for both sites — the mobile nav and the fade-in-on-scroll
   reveal. Loaded by every page of the portfolio and the DSA Roadmap, ahead
   of that page's own script. Pages that render content with JS call
   Reveal.scan() afterwards so the new nodes fade in too. */
(function () {
  "use strict";

  /* ---- Mobile nav: the burger toggles the dropdown menu ---- */
  var nav = document.querySelector(".nav");
  var burger = document.querySelector("[data-nav-toggle]");

  if (nav && burger) {
    var setNavOpen = function (open) {
      nav.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    burger.addEventListener("click", function () {
      setNavOpen(!nav.classList.contains("is-open"));
    });

    /* Tapping a link in the menu closes it. */
    var menuLinks = nav.querySelectorAll(".nav__menu a");
    for (var i = 0; i < menuLinks.length; i++) {
      menuLinks[i].addEventListener("click", function () {
        setNavOpen(false);
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setNavOpen(false);
    });
  }

  /* ---- Fade-in on scroll (theme.md's signature interaction) ---- */
  var observer = null;
  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            entries[i].target.classList.add("is-visible");
            observer.unobserve(entries[i].target);
          }
        }
      },
      { threshold: 0.12 }
    );
  }

  function scan(scope) {
    var nodes = (scope || document).querySelectorAll(".reveal:not(.is-visible)");
    for (var i = 0; i < nodes.length; i++) {
      if (observer) {
        observer.observe(nodes[i]);
      } else {
        nodes[i].classList.add("is-visible"); /* no-observer fallback */
      }
    }
  }

  window.Reveal = { scan: scan };
  scan(document);
})();
