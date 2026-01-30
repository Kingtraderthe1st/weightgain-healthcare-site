/**
 * WeightGain - Results Page Module
 * Handles status filtering, category filtering, and view-all toggle.
 */
window.WeightGainResults = (function () {
  var activeStatus = null;
  var expanded = false;

  function filterByStatus(status) {
    var cards = document.querySelectorAll('.results-summary__card');
    var items = document.querySelectorAll('.result-item:not(.result-item--hidden)');

    if (activeStatus === status) {
      resetStatusFilter();
      return;
    }

    activeStatus = status;

    cards.forEach(function (card) {
      var isActive = card.dataset.filter === status;
      card.classList.toggle('results-summary__card--active', isActive);
      card.classList.toggle('results-summary__card--dimmed', !isActive);
      card.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    items.forEach(function (item) {
      var statusEl = item.querySelector('.result-item__status');
      if (!statusEl) return;

      var text = statusEl.textContent.toLowerCase();
      var matches =
        text.includes(status) || (status === 'critical' && text.includes('action'));

      item.style.display = matches ? '' : 'none';
    });

    var list = document.getElementById('results-list');
    if (list) {
      list.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function resetStatusFilter() {
    activeStatus = null;

    document.querySelectorAll('.results-summary__card').forEach(function (card) {
      card.classList.remove('results-summary__card--active', 'results-summary__card--dimmed');
      card.setAttribute('aria-pressed', 'false');
    });

    document.querySelectorAll('.result-item:not(.result-item--hidden)').forEach(function (item) {
      item.style.display = '';
    });
  }

  function filterByCategory(category) {
    var filters = document.querySelectorAll('.test-filter');
    filters.forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.category === category);
      btn.setAttribute('aria-selected', btn.dataset.category === category ? 'true' : 'false');
    });

    var items = document.querySelectorAll('.result-item:not(.result-item--hidden)');
    items.forEach(function (item) {
      if (category === 'all') {
        item.style.display = '';
      } else {
        item.style.display = item.dataset.resultCategory === category ? '' : 'none';
      }
    });

    // Also filter visible expanded items
    if (expanded) {
      document.querySelectorAll('.result-item--hidden').forEach(function (item) {
        // These are toggled visible by toggleViewAll, respect category
        if (category === 'all') {
          item.style.display = '';
        } else {
          item.style.display = item.dataset.resultCategory === category ? '' : 'none';
        }
      });
    }

    // Reset status filter when changing category
    resetStatusFilter();
  }

  function toggleViewAll() {
    expanded = !expanded;
    var hiddenItems = document.querySelectorAll('.result-item--hidden');
    var btnText = document.querySelector('[data-action="toggleViewAll"] .btn-text');
    var btn = document.querySelector('[data-action="toggleViewAll"]');

    hiddenItems.forEach(function (item) {
      item.style.display = expanded ? '' : 'none';
    });

    if (btnText) {
      btnText.textContent = expanded ? 'Show Fewer Results' : 'View All 15 Biomarkers';
    }
    if (btn) {
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }
  }

  function init() {
    // Summary card click handlers
    document.querySelectorAll('.results-summary__card').forEach(function (card) {
      card.addEventListener('click', function () {
        filterByStatus(card.dataset.filter);
      });
    });

    // Category filter click handlers
    document.querySelectorAll('.test-filter').forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterByCategory(btn.dataset.category);
      });
    });
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    filterByStatus: filterByStatus,
    resetStatusFilter: resetStatusFilter,
    filterByCategory: filterByCategory,
    toggleViewAll: toggleViewAll,
    init: init,
  };
})();
