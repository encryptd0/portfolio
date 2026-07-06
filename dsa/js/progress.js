/* DSA Roadmap — localStorage progress store. Loaded on every page.
   Exposes window.Progress and wires the header's [data-reset-progress] button. */
(function () {
  'use strict';

  var KEY = 'dsa-roadmap:progress:v1';
  var listeners = [];

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return {};
      var obj = JSON.parse(raw);
      if (obj && typeof obj === 'object' && !Array.isArray(obj)) return obj;
      return {};
    } catch (err) {
      return {};
    }
  }

  function write(map) {
    try {
      localStorage.setItem(KEY, JSON.stringify(map));
    } catch (err) {
      /* storage disabled or quota exceeded — progress just doesn't persist */
    }
  }

  function notify() {
    for (var i = 0; i < listeners.length; i++) {
      try {
        listeners[i]();
      } catch (err) {
        /* one bad listener must not break the rest */
      }
    }
  }

  var Progress = {
    isDone: function (key) {
      return read()[key] === true;
    },
    set: function (key, done) {
      var map = read();
      if (done) {
        map[key] = true;
      } else {
        delete map[key];
      }
      write(map);
      notify();
    },
    toggle: function (key) {
      Progress.set(key, !Progress.isDone(key));
    },
    countDone: function (keys) {
      var map = read();
      var n = 0;
      for (var i = 0; i < keys.length; i++) {
        if (map[keys[i]] === true) n++;
      }
      return n;
    },
    countByPrefix: function (prefix) {
      var map = read();
      var n = 0;
      for (var key in map) {
        if (map[key] === true && key.indexOf(prefix) === 0) n++;
      }
      return n;
    },
    totalDone: function () {
      var map = read();
      var n = 0;
      for (var key in map) {
        if (map[key] === true) n++;
      }
      return n;
    },
    reset: function () {
      try {
        localStorage.removeItem(KEY);
      } catch (err) {
        /* nothing to do */
      }
      notify();
    },
    onChange: function (fn) {
      if (typeof fn === 'function') listeners.push(fn);
    }
  };

  window.Progress = Progress;

  /* Keep multiple open tabs in sync. */
  window.addEventListener('storage', function (event) {
    if (event.key === KEY || event.key === null) notify();
  });

  /* Global reset button in the site header. */
  var resetBtn = document.querySelector('[data-reset-progress]');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      var n = Progress.totalDone();
      if (n === 0) {
        if (resetBtn.dataset.flashing) return;
        var label = resetBtn.textContent;
        resetBtn.dataset.flashing = 'true';
        resetBtn.textContent = 'Nothing saved';
        setTimeout(function () {
          resetBtn.textContent = label;
          delete resetBtn.dataset.flashing;
        }, 1200);
        return;
      }
      var noun = n === 1 ? 'problem' : 'problems';
      var msg = 'This will clear ' + n + ' solved ' + noun +
        ' from this browser. It cannot be undone. Continue?';
      if (window.confirm(msg)) Progress.reset();
    });
  }
})();
