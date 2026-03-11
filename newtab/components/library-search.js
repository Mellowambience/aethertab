// library-search.js — Aether Library search component
import { LIBRARY } from '../data/library.js';

const CATEGORY_LABELS = {
  codex: 'Codex',
  archetype: 'Archetype',
  sigil: 'Sigil',
  codexscript: 'CodexScript',
  project: 'Project',
  system: 'System',
};

let activeFilter = 'all';
let currentQuery = '';

export function initLibrarySearch() {
  const input = document.getElementById('library-input');
  const resultsEl = document.getElementById('library-results');
  const filterBtns = document.querySelectorAll('.lib-filter-btn');
  const emptyEl = document.getElementById('library-empty');

  if (!input || !resultsEl) return;

  // Filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      runSearch();
    });
  });

  // Search input
  input.addEventListener('input', () => {
    currentQuery = input.value.trim().toLowerCase();
    runSearch();
  });

  // Keyboard: Escape clears
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.value = '';
      currentQuery = '';
      runSearch();
      input.blur();
    }
  });

  function score(entry, query) {
    if (!query) return 1;
    let s = 0;
    if (entry.title.toLowerCase().includes(query)) s += 10;
    if (entry.summary.toLowerCase().includes(query)) s += 6;
    entry.tags.forEach(tag => { if (tag.toLowerCase().includes(query)) s += 4; });
    if (entry.body.toLowerCase().includes(query)) s += 2;
    if (entry.category.toLowerCase().includes(query)) s += 3;
    return s;
  }

  function runSearch() {
    const query = currentQuery;
    const filter = activeFilter;

    let results = LIBRARY
      .filter(e => filter === 'all' || e.category === filter)
      .map(e => ({ entry: e, score: score(e, query) }))
      .filter(r => !query || r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(r => r.entry);

    if (!query && filter === 'all') results = [];

    renderResults(results, query);

    const showEmpty = (query || filter !== 'all') && results.length === 0;
    emptyEl.style.display = showEmpty ? 'block' : 'none';
    resultsEl.style.display = results.length > 0 ? 'grid' : 'none';
  }

  function highlight(text, query) {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
  }

  function renderResults(results, query) {
    resultsEl.innerHTML = '';
    results.forEach(entry => {
      const card = document.createElement('div');
      card.className = 'lib-result-card';
      card.dataset.category = entry.category;

      const titleHL = highlight(entry.title, query);
      const summaryHL = highlight(entry.summary, query);

      card.innerHTML = `
        <div class="lib-card-icon">${entry.icon}</div>
        <div class="lib-card-body">
          <div class="lib-card-meta">
            <span class="lib-card-category">${CATEGORY_LABELS[entry.category] || entry.category}</span>
          </div>
          <div class="lib-card-title">${titleHL}</div>
          <div class="lib-card-summary">${summaryHL}</div>
        </div>
      `;

      if (entry.url) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => window.open(entry.url, '_blank'));
      }

      resultsEl.appendChild(card);
    });
  }
}
