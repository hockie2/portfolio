document.addEventListener('DOMContentLoaded', function () {

  /* ---- Navbar: solid background after scroll ---- */
  var nav = document.getElementById('mainNav');
  function onScroll () {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Collapse mobile nav after a link is tapped ---- */
  var navMenu = document.getElementById('navMenu');
  navMenu.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (navMenu.classList.contains('show')) {
        var collapse = bootstrap.Collapse.getOrCreateInstance(navMenu);
        collapse.hide();
      }
    });
  });

  /* ---- Scroll reveal ---- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---- Craft gallery filter ---- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var craftItems = document.querySelectorAll('.craft-item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-filter');
      craftItems.forEach(function (item) {
        var match = filter === 'all' || item.getAttribute('data-cat') === filter;
        item.classList.toggle('hide', !match);
      });
    });
  });

});

/* ============================================
   CASE STUDY MODALS — zoom-to-fill screenshot toggles
   (adapted from the standalone case-study documents;
   namespaced per case study so they don't collide)
   ============================================ */
  (function () {
    var LARGE_SCREEN = window.matchMedia('(min-width: 992px)');

    function toggleZoom(btn) {
      if (!LARGE_SCREEN.matches) return; // zoom-to-fill is a large-screen-only interaction
      var row = btn.closest('.esc-feature-row');
      if (!row) return;

      var isZoomed = row.classList.toggle('esc-zoomed');
      btn.classList.toggle('esc-is-zoomed', isZoomed);
      btn.setAttribute('aria-pressed', isZoomed ? 'true' : 'false');

      // Optional: collapse any other zoomed row so only one expands at a time.
      if (isZoomed) {
        document.querySelectorAll('.esc-feature-row.esc-zoomed').forEach(function (other) {
          if (other !== row) {
            other.classList.remove('esc-zoomed');
            var otherBtn = other.querySelector('[data-esc-zoom]');
            if (otherBtn) {
              otherBtn.classList.remove('esc-is-zoomed');
              otherBtn.setAttribute('aria-pressed', 'false');
            }
          }
        });
      }
    }

    document.querySelectorAll('[data-esc-zoom]').forEach(function (btn) {
      btn.addEventListener('click', function () { toggleZoom(btn); });
    });

    // If the viewport crosses the breakpoint while a row is zoomed, reset it cleanly.
    LARGE_SCREEN.addEventListener('change', function (e) {
      if (!e.matches) {
        document.querySelectorAll('.esc-feature-row.esc-zoomed').forEach(function (row) {
          row.classList.remove('esc-zoomed');
          var btn = row.querySelector('[data-esc-zoom]');
          if (btn) {
            btn.classList.remove('esc-is-zoomed');
            btn.setAttribute('aria-pressed', 'false');
          }
        });
      }
    });
  })();

  (function () {
    var LARGE_SCREEN = window.matchMedia('(min-width: 992px)');

    function toggleZoom(btn) {
      if (!LARGE_SCREEN.matches) return; // zoom-to-fill is a large-screen-only interaction
      var row = btn.closest('.spw-feature-row');
      if (!row) return;

      var isZoomed = row.classList.toggle('spw-zoomed');
      btn.classList.toggle('spw-is-zoomed', isZoomed);
      btn.setAttribute('aria-pressed', isZoomed ? 'true' : 'false');

      // Optional: collapse any other zoomed row so only one expands at a time.
      if (isZoomed) {
        document.querySelectorAll('.spw-feature-row.spw-zoomed').forEach(function (other) {
          if (other !== row) {
            other.classList.remove('spw-zoomed');
            var otherBtn = other.querySelector('[data-spw-zoom]');
            if (otherBtn) {
              otherBtn.classList.remove('spw-is-zoomed');
              otherBtn.setAttribute('aria-pressed', 'false');
            }
          }
        });
      }
    }

    document.querySelectorAll('[data-spw-zoom]').forEach(function (btn) {
      btn.addEventListener('click', function () { toggleZoom(btn); });
    });

    // If the viewport crosses the breakpoint while a row is zoomed, reset it cleanly.
    LARGE_SCREEN.addEventListener('change', function (e) {
      if (!e.matches) {
        document.querySelectorAll('.spw-feature-row.spw-zoomed').forEach(function (row) {
          row.classList.remove('spw-zoomed');
          var btn = row.querySelector('[data-spw-zoom]');
          if (btn) {
            btn.classList.remove('spw-is-zoomed');
            btn.setAttribute('aria-pressed', 'false');
          }
        });
      }
    });
  })();
