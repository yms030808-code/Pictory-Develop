/**
 * 전역 뷰파인더 스포트라이트 (app.js가 로드되는 모든 화면)
 * 클릭 찰칵 효과는 홈(page-landing)에서만
 */
(function () {
  if (window.__picorySpotlightReady) return;
  window.__picorySpotlightReady = true;

  const isHomePage = () => document.body.classList.contains('page-landing');

  const EXCLUDE =
    '.nav, .mobile-menu, .m-topbar, .footer, .bookmark-sidebar, .pcmp-float, .pcmp-overlay, .pcmp-confirm, .glossary-modal, .upload-modal, [role="dialog"], .home-spotlight';

  const GLOW_SIZE_LIGHT = 158;
  const GLOW_SIZE_DARK = 145;

  function createSpotlight() {
    let spotlight = document.getElementById('homeSpotlight');
    if (spotlight) return spotlight;

    spotlight = document.createElement('div');
    spotlight.className = 'home-spotlight';
    spotlight.id = 'homeSpotlight';
    spotlight.setAttribute('aria-hidden', 'true');
    spotlight.innerHTML = `
      <div class="home-spotlight__glow" id="homeSpotlightGlow"></div>
      <div class="home-spotlight__vignette"></div>
      <div class="home-spotlight__shutter-curtain" aria-hidden="true"></div>
      <div class="home-spotlight__finder" id="homeSpotlightFinder">
        <span class="home-spotlight__corner home-spotlight__corner--tl"></span>
        <span class="home-spotlight__corner home-spotlight__corner--tr"></span>
        <span class="home-spotlight__corner home-spotlight__corner--bl"></span>
        <span class="home-spotlight__corner home-spotlight__corner--br"></span>
      </div>
    `;
    document.body.appendChild(spotlight);
    return spotlight;
  }

  function isInZone(x, y) {
    const hit = document.elementFromPoint(x, y);
    if (!hit) return false;
    return !hit.closest(EXCLUDE);
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function init() {
    const spotlight = createSpotlight();
    const glow = document.getElementById('homeSpotlightGlow');
    const finder = document.getElementById('homeSpotlightFinder');
    if (!glow) return;

    let active = false;
    let shutterLock = false;

    const paintGlow = (x, y) => {
      const xPx = `${x}px`;
      const yPx = `${y}px`;
      spotlight.style.setProperty('--spotlight-x', xPx);
      spotlight.style.setProperty('--spotlight-y', yPx);
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (dark) {
        glow.style.background = `radial-gradient(circle ${GLOW_SIZE_DARK}px at ${xPx} ${yPx}, rgba(255,248,235,0.12) 0%, rgba(255,200,120,0.05) 38%, transparent 62%)`;
      } else {
        glow.style.background = `radial-gradient(circle ${GLOW_SIZE_LIGHT}px at ${xPx} ${yPx}, rgba(255,240,210,0.16) 0%, rgba(255,200,130,0.08) 32%, rgba(255,160,80,0.02) 48%, transparent 62%)`;
      }
    };

    const show = () => spotlight.classList.add('is-active');
    const hide = () => {
      active = false;
      spotlight.classList.remove('is-active');
    };

    document.addEventListener(
      'mousemove',
      (e) => {
        if (!isInZone(e.clientX, e.clientY)) {
          if (active) hide();
          return;
        }
        if (!active) {
          active = true;
          show();
        }
        paintGlow(e.clientX, e.clientY);
      },
      { passive: true },
    );

    document.addEventListener(
      'mouseleave',
      () => {
        if (active) hide();
      },
      { passive: true },
    );

    window.addEventListener('blur', hide);

    const triggerShutter = (x, y) => {
      if (shutterLock || prefersReducedMotion()) return;
      shutterLock = true;

      paintGlow(x, y);

      const flash = document.createElement('div');
      flash.className = 'home-spotlight__flash';
      flash.style.left = `${x}px`;
      flash.style.top = `${y}px`;
      spotlight.appendChild(flash);

      spotlight.classList.remove('is-shutter-pulse');
      finder?.classList.remove('is-snapping');
      void spotlight.offsetWidth;
      spotlight.classList.add('is-shutter-pulse');
      finder?.classList.add('is-snapping');

      requestAnimationFrame(() => flash.classList.add('is-play'));

      window.setTimeout(() => {
        flash.remove();
        finder?.classList.remove('is-snapping');
        spotlight.classList.remove('is-shutter-pulse');
        shutterLock = false;
      }, 260);
    };

    document.addEventListener(
      'click',
      (e) => {
        if (e.button !== 0) return;
        if (!isHomePage()) return;
        if (!isInZone(e.clientX, e.clientY)) return;
        if (!active) {
          active = true;
          show();
        }
        triggerShutter(e.clientX, e.clientY);
      },
      { passive: true },
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
