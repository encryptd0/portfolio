/* DSA Roadmap — home page: builds the roadmap graph (dependency bands +
   SVG connectors), the ordered topic list, and reflects saved progress. */
(function () {
  'use strict';

  var data = window.DSA_DATA;
  var Progress = window.Progress;
  var graphEl = document.querySelector('[data-graph]');
  var listEl = document.querySelector('[data-topic-list]');
  if (!data || !Progress || !graphEl || !listEl) return;

  var svg = graphEl.querySelector('[data-graph-lines]');
  var SVG_NS = 'http://www.w3.org/2000/svg';

  var categories = data.categories.slice().sort(function (a, b) {
    return a.order - b.order;
  });

  var byId = {};
  categories.forEach(function (c) { byId[c.id] = c; });

  var totalProblems = categories.reduce(function (sum, c) {
    return sum + c.problems.length;
  }, 0);

  /* ---- Graph levels: Kahn-style topological pass over `unlocks`.
     A topic sits one level below the deepest topic that unlocks it. ---- */
  var level = {};
  var indegree = {};
  categories.forEach(function (c) { indegree[c.id] = 0; });
  categories.forEach(function (c) {
    c.unlocks.forEach(function (childId) {
      if (indegree[childId] !== undefined) indegree[childId]++;
    });
  });

  var queue = [];
  categories.forEach(function (c) {
    if (indegree[c.id] === 0) {
      level[c.id] = 0;
      queue.push(c.id);
    }
  });
  while (queue.length) {
    var id = queue.shift();
    byId[id].unlocks.forEach(function (childId) {
      var child = byId[childId];
      if (!child) return;
      var candidate = level[id] + 1;
      if (level[childId] === undefined || candidate > level[childId]) {
        level[childId] = candidate;
      }
      indegree[childId]--;
      if (indegree[childId] === 0) queue.push(childId);
    });
  }

  var bands = [];
  categories.forEach(function (c) {
    var l = level[c.id] || 0;
    if (!bands[l]) bands[l] = [];
    bands[l].push(c); /* categories already sorted by order */
  });

  /* ---- Render the graph bands ---- */
  bands.forEach(function (band) {
    var row = document.createElement('div');
    row.className = 'graph-band';
    band.forEach(function (c) {
      var node = document.createElement('a');
      node.className = 'node';
      node.href = 'topic.html?id=' + encodeURIComponent(c.id);
      node.setAttribute('data-node', c.id);

      var title = document.createElement('span');
      title.className = 'node-title';
      title.textContent = c.title;

      var count = document.createElement('span');
      count.className = 'node-count';
      count.setAttribute('data-node-count', c.id);
      count.textContent = '0/' + c.problems.length;

      node.appendChild(title);
      node.appendChild(count);
      row.appendChild(node);
    });
    graphEl.appendChild(row);
  });

  /* ---- Render the ordered topic list ---- */
  categories.forEach(function (c, i) {
    var row = document.createElement('li');
    row.className = 'topic-row';
    row.setAttribute('data-topic-row', c.id);

    var index = document.createElement('span');
    index.className = 'topic-index';
    index.textContent = String(i + 1).padStart(2, '0');

    var link = document.createElement('a');
    link.className = 'topic-row-link';
    link.href = 'topic.html?id=' + encodeURIComponent(c.id);
    link.textContent = c.title;

    var count = document.createElement('span');
    count.className = 'topic-row-count pill';
    count.setAttribute('data-row-count', c.id);
    count.textContent = '0/' + c.problems.length;

    row.appendChild(index);
    row.appendChild(link);
    row.appendChild(count);
    listEl.appendChild(row);
  });

  /* ---- SVG connectors: one cubic curve per `unlocks` edge, from the
     bottom-center of the parent to the top-center of the child. ---- */
  function drawLines() {
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    var box = graphEl.getBoundingClientRect();
    var width = graphEl.clientWidth;
    var height = graphEl.clientHeight;
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);

    categories.forEach(function (c) {
      var from = graphEl.querySelector('[data-node="' + c.id + '"]');
      if (!from) return;
      c.unlocks.forEach(function (childId) {
        var to = graphEl.querySelector('[data-node="' + childId + '"]');
        if (!to) return;
        var a = from.getBoundingClientRect();
        var b = to.getBoundingClientRect();
        var ax = a.left + a.width / 2 - box.left;
        var ay = a.bottom - box.top;
        var bx = b.left + b.width / 2 - box.left;
        var by = b.top - box.top;
        var midY = (ay + by) / 2;
        var path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute('d',
          'M ' + ax + ' ' + ay +
          ' C ' + ax + ' ' + midY + ', ' + bx + ' ' + midY + ', ' + bx + ' ' + by);
        svg.appendChild(path);
      });
    });
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(drawLines, 120);
  });
  window.addEventListener('load', drawLines); /* redraw once fonts settle */
  drawLines();

  /* ---- Progress reflection ---- */
  var globalPill = document.querySelector('[data-global-count]');

  function refreshProgress() {
    var totalDone = 0;
    categories.forEach(function (c) {
      var max = c.problems.length;
      /* Cap at the catalog count to survive stale localStorage keys. */
      var done = Math.min(Progress.countByPrefix(c.id + '::'), max);
      totalDone += done;
      var label = done + '/' + max;

      var nodeCount = graphEl.querySelector('[data-node-count="' + c.id + '"]');
      if (nodeCount) nodeCount.textContent = label;

      var node = graphEl.querySelector('[data-node="' + c.id + '"]');
      if (node) {
        node.classList.toggle('is-complete', max > 0 && done === max);
        node.classList.toggle('is-started', done > 0 && done < max);
      }

      var rowCount = listEl.querySelector('[data-row-count="' + c.id + '"]');
      if (rowCount) rowCount.textContent = label;

      var row = listEl.querySelector('[data-topic-row="' + c.id + '"]');
      if (row) row.classList.toggle('is-complete', max > 0 && done === max);
    });

    if (globalPill) {
      globalPill.hidden = false;
      globalPill.textContent = totalDone + ' / ' + totalProblems + ' solved';
    }
  }

  refreshProgress();
  Progress.onChange(refreshProgress);

  /* Fade in the freshly rendered blocks. */
  if (window.Reveal) window.Reveal.scan(document);
})();
