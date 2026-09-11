(function () {
    "use strict";

    var root = document.documentElement;
    var allowMotion = !window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches;

    if (allowMotion) root.classList.add("motion");

    /* -------------------------------------------------------------------------
       Reveals

       Two rules this obeys, learned the hard way:

       1. CSS never hides content on its own. The hidden state is gated on
          .reveal-ready, added below only after the observer is actually
          wired. If this file fails to load, throws, or the browser has no
          IntersectionObserver, the page renders fully visible.
       2. The observer watches the sections, not the animated elements. Those
          elements are clipped to zero width before they reveal, and an
          element with no visible area is not a dependable observer target.
          Sections are never clipped, so they always report.
       ---------------------------------------------------------------------- */

    var revealables = document.querySelectorAll("[data-reveal]");

    var revealAll = function () {
        revealables.forEach(function (el) {
            el.classList.add("is-in");
        });
    };

    var wantsReveals =
        allowMotion &&
        !root.hasAttribute("data-reveal-off") &&
        "IntersectionObserver" in window;

    if (!wantsReveals) {
        revealAll();
    } else {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    entry.target
                        .querySelectorAll("[data-reveal]")
                        .forEach(function (el) {
                            el.classList.add("is-in");
                        });
                    observer.unobserve(entry.target);
                });
            },
            // threshold 0 fires as soon as one pixel of the section is in
            // view. A higher threshold can go unmet by a short section.
            { rootMargin: "0px 0px -5% 0px", threshold: 0 }
        );

        document.querySelectorAll("main section").forEach(function (section) {
            observer.observe(section);
        });

        // Only now is it safe for CSS to hide anything.
        root.classList.add("reveal-ready");

        // The hero is above the fold; play it rather than waiting for a
        // scroll that may never come.
        requestAnimationFrame(function () {
            document
                .querySelectorAll(".hero [data-reveal]")
                .forEach(function (el) {
                    el.classList.add("is-in");
                });
        });

        // Last line of defence: if anything is still hidden after four
        // seconds, something went wrong and the content wins.
        setTimeout(revealAll, 4000);
    }

    /* -------------------------------------------------------------------------
       Scroll progress
       ---------------------------------------------------------------------- */

    var progressFill = document.getElementById("progressFill");

    if (progressFill) {
        var ticking = false;

        var update = function () {
            var max = root.scrollHeight - window.innerHeight;
            var ratio = max > 0 ? window.scrollY / max : 0;
            progressFill.style.width =
                Math.min(100, Math.max(0, ratio * 100)).toFixed(2) + "%";
            ticking = false;
        };

        window.addEventListener(
            "scroll",
            function () {
                if (ticking) return;
                ticking = true;
                requestAnimationFrame(update);
            },
            { passive: true }
        );
        update();
    }

    /* -------------------------------------------------------------------------
       Email — the address was previously href="#" and did nothing. It is now
       assembled at runtime, so it works but stays out of the markup as plain
       text for scrapers.
       ---------------------------------------------------------------------- */

    var address = "riekusgroblerps4" + " [at] " + "gmail [dot] com";

    var emailAddress = "riekusgroblerps4@gmail.com"
    var mailLink = document.getElementById("mailLink");
    var emailText = document.getElementById("emailText");
    var copyBtn = document.getElementById("copyBtn");
    var copyLabel = document.getElementById("copyLabel");
    var copyStatus = document.getElementById("copyStatus");

    if (mailLink) {
        mailLink.addEventListener("click", async (event) => {
          event.preventDefault();
          
          try {
            await navigator.clipboard.writeText(emailAddress);
          
            emailText.textContent = "Copied!";
          
            setTimeout(() => {
              emailText.textContent = "riekusgroblerps4 [at] gmail [dot] com";
            }, 1500);
          } catch (error) {
            console.error("Failed to copy email:", error);
          }
        })
    }

    if (emailText) emailText.textContent = address;

    if (copyBtn && copyLabel) {
        var resetTimer;

        copyBtn.addEventListener("click", function () {
            var finish = function (ok) {
                copyLabel.textContent = ok ? "Copied" : "";
                if (copyStatus) {
                    copyStatus.textContent = ok
                        ? "Email address copied to clipboard"
                        : "Copy failed — select the address manually";
                }
                clearTimeout(resetTimer);
                resetTimer = setTimeout(function () {
                    copyLabel.textContent = " ";
                    if (copyStatus) copyStatus.textContent = "";
                }, 2400);
            };

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(emailAddress).then(
                    function () {
                        finish(true);
                    },
                    function () {
                        finish(false);
                    }
                );
            } else {
                finish(false);
            }
        });
    }
})();