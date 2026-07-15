/* Shared chrome for both sites — the mobile nav, the scroll reveal and the
   magnetic CTAs. Loaded by every page of the portfolio and the DSA Roadmap,
   ahead of that page's own script.

   The reveal is opt-in per element via [data-reveal]; base.css only hides
   those elements while <html> carries .js, so with JavaScript off (or if this
   file fails to parse) every block is simply visible. Reduced motion opts out
   of the whole system in CSS. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================================================
     Reveal on scroll
     ========================================================= */
  function armReveal() {
    var targets = document.querySelectorAll("[data-reveal], [data-reveal-line]");
    if (!targets.length) return;

    /* No IntersectionObserver, or the user wants no motion: show everything
       immediately rather than leaving content hidden. */
    if (!("IntersectionObserver" in window) || reduced) {
      for (var i = 0; i < targets.length; i++) targets[i].classList.add("is-in");
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target); /* reveal once, never re-hide */
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 }
    );

    for (var j = 0; j < targets.length; j++) io.observe(targets[j]);
  }

  /* Only arm the CSS that hides things once we know this script runs. */
  root.classList.add("js");

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", armReveal);
  } else {
    armReveal();
  }

  /* =========================================================
     Magnetic CTAs — the label leans toward the cursor
     ========================================================= */
  if (!reduced && window.matchMedia("(hover: hover)").matches) {
    var magnets = document.querySelectorAll("[data-magnetic]");
    Array.prototype.forEach.call(magnets, function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
        var dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
        el.style.transform = "translate(" + dx + "px," + dy + "px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "";
      });
    });
  }

  /* =========================================================
     Nav
     ========================================================= */
  var nav = document.querySelector(".nav");
  var burger = document.querySelector("[data-nav-toggle]");
  if (!nav || !burger) return;

  function setNavOpen(open) {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    /* The overlay covers the page; stop the page beneath it scrolling. */
    document.body.style.overflow = open ? "hidden" : "";
  }

  burger.addEventListener("click", function () {
    setNavOpen(!nav.classList.contains("is-open"));
  });

  /* Tapping a link in the menu closes it. */
  var menuLinks = nav.querySelectorAll(".nav__menu a");
  for (var k = 0; k < menuLinks.length; k++) {
    menuLinks[k].addEventListener("click", function () {
      setNavOpen(false);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setNavOpen(false);
  });

  /* Leaving the overlay breakpoint while open would strand the scroll lock. */
  var wide = window.matchMedia("(min-width: 861px)");
  var onWide = function (e) {
    if (e.matches) setNavOpen(false);
  };
  if (wide.addEventListener) wide.addEventListener("change", onWide);
  else if (wide.addListener) wide.addListener(onWide);
})();
