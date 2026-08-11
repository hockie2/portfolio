document.addEventListener('DOMContentLoaded', function () {

  /* ---- Navbar: solid background after scroll ---- */
  var nav = document.getElementById('mainNav');
  if (nav) {
    function onScroll () {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Collapse mobile nav after a link is tapped ---- */
  var navMenu = document.getElementById('navMenu');
  if (navMenu) {
    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        if (navMenu.classList.contains('show')) {
          var collapse = bootstrap.Collapse.getOrCreateInstance(navMenu);
          collapse.hide();
        }
      });
    });
  }

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
  var modalZoomFrames = new WeakMap();

  function keepModalRowAnchored(row, updateLayout) {
    var modalBody = row.closest('.modal-body');
    if (!modalBody) {
      updateLayout();
      return;
    }

    var rowTop = row.getBoundingClientRect().top;
    var previousFrame = modalZoomFrames.get(modalBody);
    if (previousFrame) window.cancelAnimationFrame(previousFrame);
    updateLayout();

    // The image/text columns animate for 0.4s. Counter any scroll anchoring
    // during that reflow so the clicked screenshot stays under the pointer.
    var startedAt = performance.now();
    function holdPosition(now) {
      if (!row.isConnected) {
        modalZoomFrames.delete(modalBody);
        return;
      }

      var topShift = row.getBoundingClientRect().top - rowTop;
      if (Math.abs(topShift) > 0.5) {
        modalBody.scrollTop += topShift;
      }

      if (now - startedAt < 450) {
        modalZoomFrames.set(modalBody, window.requestAnimationFrame(holdPosition));
      } else {
        modalZoomFrames.delete(modalBody);
      }
    }
    modalZoomFrames.set(modalBody, window.requestAnimationFrame(holdPosition));
  }

  function updateZoomButton(btn, isZoomed, activeClass, hintSelector) {
    var description = btn.dataset.zoomDescription;
    if (!description) {
      description = (btn.getAttribute('aria-label') || 'Screenshot')
        .replace(/^(Expand|Collapse) screenshot:\s*/i, '');
      btn.dataset.zoomDescription = description;
    }

    btn.classList.toggle(activeClass, isZoomed);
    btn.setAttribute('aria-pressed', isZoomed ? 'true' : 'false');
    btn.setAttribute('aria-label', (isZoomed ? 'Collapse' : 'Expand') + ' screenshot: ' + description);

    var hint = btn.querySelector(hintSelector);
    if (hint) {
      hint.innerHTML = '<i class="bi bi-arrows-angle-' + (isZoomed ? 'contract' : 'expand') +
        '"></i> Click to ' + (isZoomed ? 'collapse' : 'expand');
    }
  }

  (function () {
    var LARGE_SCREEN = window.matchMedia('(min-width: 992px)');

    function toggleZoom(btn) {
      if (!LARGE_SCREEN.matches) return; // zoom-to-fill is a large-screen-only interaction
      var row = btn.closest('.esc-feature-row');
      if (!row) return;

      keepModalRowAnchored(row, function () {
        var isZoomed = row.classList.toggle('esc-zoomed');
        updateZoomButton(btn, isZoomed, 'esc-is-zoomed', '.esc-zoom-hint');

        // Optional: collapse any other zoomed row so only one expands at a time.
        if (isZoomed) {
          document.querySelectorAll('.esc-feature-row.esc-zoomed').forEach(function (other) {
            if (other !== row) {
              other.classList.remove('esc-zoomed');
              var otherBtn = other.querySelector('[data-esc-zoom]');
              if (otherBtn) {
                updateZoomButton(otherBtn, false, 'esc-is-zoomed', '.esc-zoom-hint');
              }
            }
          });
        }
      });
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
            updateZoomButton(btn, false, 'esc-is-zoomed', '.esc-zoom-hint');
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

      keepModalRowAnchored(row, function () {
        var isZoomed = row.classList.toggle('spw-zoomed');
        updateZoomButton(btn, isZoomed, 'spw-is-zoomed', '.spw-zoom-hint');

        // Optional: collapse any other zoomed row so only one expands at a time.
        if (isZoomed) {
          document.querySelectorAll('.spw-feature-row.spw-zoomed').forEach(function (other) {
            if (other !== row) {
              other.classList.remove('spw-zoomed');
              var otherBtn = other.querySelector('[data-spw-zoom]');
              if (otherBtn) {
                updateZoomButton(otherBtn, false, 'spw-is-zoomed', '.spw-zoom-hint');
              }
            }
          });
        }
      });
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
            updateZoomButton(btn, false, 'spw-is-zoomed', '.spw-zoom-hint');
          }
        });
      }
    });
  })();

  (function () {
    var LARGE_SCREEN = window.matchMedia('(min-width: 992px)');

    function toggleZoom(btn) {
      if (!LARGE_SCREEN.matches) return;
      var row = btn.closest('.cd-feature');
      if (!row) return;

      keepModalRowAnchored(row, function () {
        var isZoomed = row.classList.toggle('cd-zoomed');
        updateZoomButton(btn, isZoomed, 'cd-is-zoomed', '.cd-zoom-hint');

        if (isZoomed) {
          document.querySelectorAll('.cd-feature.cd-zoomed').forEach(function (other) {
            if (other !== row) {
              other.classList.remove('cd-zoomed');
              var otherBtn = other.querySelector('[data-cd-zoom]');
              if (otherBtn) {
                updateZoomButton(otherBtn, false, 'cd-is-zoomed', '.cd-zoom-hint');
              }
            }
          });
        }
      });
    }

    document.querySelectorAll('[data-cd-zoom]').forEach(function (btn) {
      btn.addEventListener('click', function () { toggleZoom(btn); });
    });

    LARGE_SCREEN.addEventListener('change', function (e) {
      if (!e.matches) {
        document.querySelectorAll('.cd-feature.cd-zoomed').forEach(function (row) {
          row.classList.remove('cd-zoomed');
          var btn = row.querySelector('[data-cd-zoom]');
          if (btn) {
            updateZoomButton(btn, false, 'cd-is-zoomed', '.cd-zoom-hint');
          }
        });
      }
    });
  })();

  (function () {
    var LARGE_SCREEN = window.matchMedia('(min-width: 992px)');

    function toggleZoom(btn) {
      if (!LARGE_SCREEN.matches) return;
      var figure = btn.closest('.cd-standalone-figure');
      if (!figure) return;

      keepModalRowAnchored(figure, function () {
        var isZoomed = figure.classList.toggle('cd-standalone-expanded');
        updateZoomButton(btn, isZoomed, 'cd-is-zoomed', '.cd-standalone-zoom-hint');

        if (isZoomed) {
          document.querySelectorAll('.cd-standalone-figure.cd-standalone-expanded').forEach(function (other) {
            if (other !== figure) {
              other.classList.remove('cd-standalone-expanded');
              var otherBtn = other.querySelector('[data-cd-standalone-zoom]');
              if (otherBtn) {
                updateZoomButton(otherBtn, false, 'cd-is-zoomed', '.cd-standalone-zoom-hint');
              }
            }
          });
        }
      });
    }

    document.querySelectorAll('[data-cd-standalone-zoom]').forEach(function (btn) {
      btn.addEventListener('click', function () { toggleZoom(btn); });
    });

    LARGE_SCREEN.addEventListener('change', function (e) {
      if (!e.matches) {
        document.querySelectorAll('.cd-standalone-figure.cd-standalone-expanded').forEach(function (figure) {
          figure.classList.remove('cd-standalone-expanded');
          var btn = figure.querySelector('[data-cd-standalone-zoom]');
          if (btn) {
            updateZoomButton(btn, false, 'cd-is-zoomed', '.cd-standalone-zoom-hint');
          }
        });
      }
    });
  })();

/* ============================================
   VIDEO MODALS — load the YouTube embed only while
   the modal is open, so it doesn't keep playing (or
   preloading) once closed.
   ============================================ */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.video-modal').forEach(function (modal) {
    var iframe = modal.querySelector('iframe[data-video-src]');
    if (!iframe) return;

    modal.addEventListener('show.bs.modal', function () {
      iframe.setAttribute('src', iframe.getAttribute('data-video-src'));
    });
    modal.addEventListener('hidden.bs.modal', function () {
      iframe.setAttribute('src', '');
    });
  });

  document.querySelectorAll('.gallery-modal').forEach(function (modal) {
    var autoplayVideos = modal.querySelectorAll('video[autoplay]');
    if (!autoplayVideos.length) return;

    modal.addEventListener('shown.bs.modal', function () {
      autoplayVideos.forEach(function (video) {
        video.muted = true;
        video.play().catch(function () {
          // The controls remain available if a browser still requires interaction.
        });
      });
    });

    modal.addEventListener('hidden.bs.modal', function () {
      autoplayVideos.forEach(function (video) {
        video.pause();
        video.currentTime = 0;
      });
    });
  });
});
