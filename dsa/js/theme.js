/* DSA Roadmap — chrome behaviors from theme.md, loaded on every page:
   the mobile nav menu and the fade-in-on-scroll reveal. */
(function () {
  'use strict';

  /* Mobile nav: the burger toggles the dropdown menu. */
  var header = document.querySelector('.site-header');
  var burger = document.querySelector('[data-nav-toggle]');

  function setMenuOpen(open) {
    header.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  if (header && burger) {
    burger.addEventListener('click', function () {
      setMenuOpen(!header.classList.contains('is-open'));
    });

    /* Tapping a link in the menu closes it. */
    var menuLinks = header.querySelectorAll('.nav-menu a');
    for (var j = 0; j < menuLinks.length; j++) {
      menuLinks[j].addEventListener('click', function () { setMenuOpen(false); });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenuOpen(false);
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
