/* DSA Roadmap — theme chrome behaviors from theme.md, loaded on every page:
   the light/dark toggle and the fade-in-on-scroll reveal.
   (An inline <head> script sets data-theme before first paint; this file
   syncs the toggle label / meta theme-color and handles clicks.) */
(function () {
  'use strict';

  /* Shared with the portfolio (js/main.js) so the choice follows the user
     across both projects. */
  var KEY = 'rg-theme';
  var root = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  var toggle = document.querySelector('[data-theme-toggle]');

  function current() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#ffffff');
    if (toggle) {
      /* Label shows the mode it will switch TO (theme.md). */
      toggle.textContent = theme === 'dark' ? 'Light' : 'Dark';
      toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme');
    }
  }

  apply(current());

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      apply(next);
      try {
        localStorage.setItem(KEY, next);
      } catch (err) {
        /* choice just won't persist */
      }
    });
  }

  /* Fade-in on scroll (theme.md's signature interaction). */
  var observer = null;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('is-visible');
          observer.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.12 });
  }

  function scan(scope) {
    var nodes = (scope || document).querySelectorAll('.reveal:not(.is-visible)');
    for (var i = 0; i < nodes.length; i++) {
      if (observer) {
        observer.observe(nodes[i]);
      } else {
        nodes[i].classList.add('is-visible'); /* no-observer fallback */
      }
    }
  }

  /* Pages that render content with JS call Reveal.scan() after rendering. */
  window.Reveal = { scan: scan };
  scan(document);
})();
