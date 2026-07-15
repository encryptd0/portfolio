/* DSA Roadmap — topic page: renders one topic (chosen by ?id=<slug>) with
   done toggles, search, difficulty filter and the premium toggle.
   Everything is built with DOM APIs; query-string input never touches
   innerHTML. */
(function () {
  'use strict';

  var data = window.DSA_DATA;
  var Progress = window.Progress;
  var rootEl = document.querySelector('[data-topic]');
  if (!data || !Progress || !rootEl) return;

  var categories = data.categories.slice().sort(function (a, b) {
    return a.order - b.order;
  });

  var totalProblems = categories.reduce(function (sum, c) {
    return sum + c.problems.length;
  }, 0);

  var params = new URLSearchParams(window.location.search);
  var id = params.get('id') || '';

  var category = null;
  var position = 0;
  categories.forEach(function (c, i) {
    if (c.id === id) {
      category = c;
      position = i + 1;
    }
  });

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  /* ---- Unknown or missing id: not-found state, same content as 404.html ---- */
  if (!category) {
    document.title = 'Topic not found — DSA Roadmap';
    var missing = el('div', 'notfound');
    missing.appendChild(el('p', 'notfound__code', '404'));
    missing.appendChild(el('h1', 'notfound__title', 'Topic not found'));
    missing.appendChild(el('p', 'muted',
      'There is no topic at this address. Head back to the roadmap to pick one.'));
    var homeLink = el('a', 'btn', 'Back to the roadmap');
    homeLink.href = 'index.html';
    missing.appendChild(homeLink);
    rootEl.appendChild(missing);
    return;
  }

  document.title = category.title + ' — DSA Roadmap';

  var freeCount = category.problems.filter(function (p) {
    return !p.isPremium;
  }).length;
  var premiumCount = category.problems.length - freeCount;
  var totalInTopic = category.problems.length;

  /* ---- Topic header ---- */
  var back = el('a', 'back-link', '← Roadmap');
  back.href = 'index.html';
  rootEl.appendChild(back);

  var header = el('header', 'topic__header');
  header.appendChild(el('p', 'label',
    'Topic ' + String(position).padStart(2, '0') + ' of ' + categories.length));
  header.appendChild(el('h1', 'topic__title', category.title));
  header.appendChild(el('p', 'topic__blurb muted', category.blurb));

  var meta = el('p', 'topic__meta');
  var solvedPill = el('span', 'is-count');
  var solvedCount = el('span', '', '0');
  solvedCount.setAttribute('data-topic-count', '');
  solvedPill.appendChild(solvedCount);
  solvedPill.appendChild(document.createTextNode('/' + totalInTopic + ' solved'));
  meta.appendChild(solvedPill);
  var mix = freeCount + ' free' +
    (premiumCount > 0 ? ' · ' + premiumCount + ' premium' : '');
  meta.appendChild(el('span', '', mix));
  header.appendChild(meta);
  rootEl.appendChild(header);

  /* ---- Controls ---- */
  var controls = el('div', 'controls');

  var search = document.createElement('input');
  search.type = 'search';
  search.className = 'search-input';
  search.placeholder = 'Search problems…';
  search.setAttribute('data-search', '');
  search.setAttribute('aria-label', 'Search problems by title');
  controls.appendChild(search);

  var filterGroup = el('div', 'filter-group');
  filterGroup.setAttribute('role', 'group');
  filterGroup.setAttribute('aria-label', 'Filter by difficulty');
  ['All', 'Easy', 'Medium', 'Hard'].forEach(function (label, i) {
    var btn = el('button', 'filter-btn' + (i === 0 ? ' is-active' : ''), label);
    btn.type = 'button';
    btn.setAttribute('data-difficulty', label);
    btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    filterGroup.appendChild(btn);
  });
  controls.appendChild(filterGroup);

  var premiumLabel = el('label', 'premium-toggle');
  var premiumBox = document.createElement('input');
  premiumBox.type = 'checkbox';
  premiumBox.className = 'check';
  premiumBox.setAttribute('data-show-premium', '');
  premiumLabel.appendChild(premiumBox);
  premiumLabel.appendChild(document.createTextNode(' Show premium'));
  controls.appendChild(premiumLabel);

  rootEl.appendChild(controls);

  /* ---- Problem list ---- */
  var list = el('ol', 'problem-list');
  list.setAttribute('data-problem-list', '');

  category.problems.forEach(function (problem) {
    var key = category.id + '::' + problem.slug;
    var row = el('li', 'problem');
    row.setAttribute('data-problem', '');
    row.setAttribute('data-key', key);
    row.setAttribute('data-difficulty', problem.difficulty);
    row.setAttribute('data-premium', problem.isPremium ? 'true' : 'false');
    row.setAttribute('data-title', problem.title.toLowerCase());

    var done = document.createElement('input');
    done.type = 'checkbox';
    done.className = 'check';
    done.setAttribute('data-done', '');
    done.setAttribute('aria-label', 'Mark “' + problem.title + '” as done');
    row.appendChild(done);

    var main = el('div', 'problem__main');
    var title = el('a', 'problem__title', problem.title);
    title.href = problem.url;
    title.target = '_blank';
    title.rel = 'noopener';
    main.appendChild(title);
    var broken = el('a', 'broken-link', 'broken?');
    broken.href = 'gone.html?title=' + encodeURIComponent(problem.title);
    main.appendChild(broken);
    row.appendChild(main);

    var badges = el('span', 'badges');
    badges.appendChild(el('span',
      'badge badge--' + problem.difficulty.toLowerCase(), problem.difficulty));
    if (problem.isPremium) {
      badges.appendChild(el('span', 'badge badge--premium', 'Premium'));
    }
    row.appendChild(badges);

    list.appendChild(row);
  });
  rootEl.appendChild(list);

  var empty = el('p', 'empty muted',
    'Nothing matches. Clear the search or filters to see problems again.');
  empty.setAttribute('data-empty', '');
  empty.hidden = true;
  rootEl.appendChild(empty);

  /* ---- Filtering ---- */
  var state = { search: '', difficulty: 'All', showPremium: false };
  var rows = list.querySelectorAll('[data-problem]');

  function applyFilters() {
    var visible = 0;
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var matches =
        (state.search === '' || row.getAttribute('data-title').indexOf(state.search) !== -1) &&
        (state.difficulty === 'All' || row.getAttribute('data-difficulty') === state.difficulty) &&
        (state.showPremium || row.getAttribute('data-premium') !== 'true');
      row.hidden = !matches;
      if (matches) visible++;
    }
    empty.hidden = visible > 0;
  }

  search.addEventListener('input', function () {
    state.search = search.value.trim().toLowerCase();
    applyFilters();
  });

  var filterButtons = filterGroup.querySelectorAll('[data-difficulty]');
  for (var i = 0; i < filterButtons.length; i++) {
    filterButtons[i].addEventListener('click', function () {
      state.difficulty = this.getAttribute('data-difficulty');
      for (var j = 0; j < filterButtons.length; j++) {
        var active = filterButtons[j] === this;
        filterButtons[j].classList.toggle('is-active', active);
        filterButtons[j].setAttribute('aria-pressed', active ? 'true' : 'false');
      }
      applyFilters();
    });
  }

  premiumBox.addEventListener('change', function () {
    state.showPremium = premiumBox.checked;
    applyFilters();
  });

  /* ---- Progress sync (covers the global Reset button and other tabs) ---- */
  var globalPill = document.querySelector('[data-global-count]');

  function syncProgress() {
    var doneInTopic = 0;
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var isDone = Progress.isDone(row.getAttribute('data-key'));
      row.querySelector('[data-done]').checked = isDone;
      row.classList.toggle('is-done', isDone);
      if (isDone) doneInTopic++;
    }
    solvedCount.textContent = String(doneInTopic);

    if (globalPill) {
      var totalDone = 0;
      categories.forEach(function (c) {
        totalDone += Math.min(Progress.countByPrefix(c.id + '::'), c.problems.length);
      });
      globalPill.hidden = false;
      globalPill.textContent = totalDone + ' / ' + totalProblems + ' solved';
    }
  }

  list.addEventListener('change', function (event) {
    var box = event.target;
    if (!box.hasAttribute('data-done')) return;
    var row = box.closest('[data-problem]');
    if (row) Progress.set(row.getAttribute('data-key'), box.checked);
  });

  syncProgress();
  Progress.onChange(syncProgress);

  applyFilters(); /* premium rows are hidden by default */

})();
