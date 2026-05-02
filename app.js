/* ========================================
   SHUTTER - Camera Integration Platform
   Interactive Behaviors
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  const sessionStorageKey = 'picoryAuthSession';
  const activityLogStorageKey = 'picoryActivityLogs';
  const archiveStorageKey = 'picoryArchivePosts';
  const communityStorageKey = 'picoryCommunityPosts';
  const bookmarkStorageKey = 'picoryBookmarks';

  function isPicorySessionActive() {
    return Boolean(localStorage.getItem(sessionStorageKey));
  }

  /** 북마크 기능: 미로그인 시 로그인 페이지로 이동 후(또는 로그인 페이지에서) 토스트 안내 */
  function requireLoginForBookmarkOrRedirect() {
    if (isPicorySessionActive()) return true;
    if (window.location.pathname.endsWith('auth.html')) {
      document.dispatchEvent(new CustomEvent('picory-bookmark-auth-needed'));
      return false;
    }
    window.location.href = 'auth.html?needLogin=bookmark';
    return false;
  }

  function addActivityLog(message) {
    const raw = localStorage.getItem(activityLogStorageKey);
    const logs = raw ? JSON.parse(raw) : [];
    logs.push({
      at: new Date().toISOString(),
      message,
    });
    localStorage.setItem(activityLogStorageKey, JSON.stringify(logs.slice(-80)));
  }

  function updateAuthNavButton() {
    const loginLink = document.querySelector('.nav__actions .btn--primary');
    const navActions = document.querySelector('.nav__actions');
    if (!loginLink) return;
    const sessionRaw = localStorage.getItem(sessionStorageKey);
    const existingLogout = navActions?.querySelector('.nav__logout');
    if (sessionRaw) {
      loginLink.textContent = '마이페이지';
      loginLink.setAttribute('href', 'mypage.html');
      existingLogout?.remove();
    } else {
      loginLink.textContent = '로그인';
      loginLink.setAttribute('href', 'auth.html');
      existingLogout?.remove();
    }
  }

  updateAuthNavButton();

  // ===== Global Search Suggest (상품/브랜드 연관검색어) =====
  (function initGlobalSearchSuggest() {
    if (window.__PICORY_GLOBAL_SEARCH_SUGGEST__) return;
    window.__PICORY_GLOBAL_SEARCH_SUGGEST__ = true;

    const CATALOG_SRC = '/js/catalog.global.js';

    function ensureCatalogLoaded() {
      if (Array.isArray(window.PICORY_CATALOG) && window.PICORY_CATALOG.length) return Promise.resolve();
      return new Promise((resolve) => {
        const existing = document.querySelector(`script[src="${CATALOG_SRC}"]`);
        if (existing) {
          existing.addEventListener('load', () => resolve());
          existing.addEventListener('error', () => resolve());
          return;
        }
        const s = document.createElement('script');
        s.src = CATALOG_SRC;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => resolve();
        document.head.appendChild(s);
      });
    }

    function escapeHtml(value) {
      return String(value ?? '').replace(/[&<>"']/g, (ch) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[ch] || ch));
    }

    function escapeAttr(value) {
      return escapeHtml(value).replace(/"/g, '&quot;');
    }

    function normalize(value) {
      return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
    }

    function getLabel(p) {
      const brand = String(p?.brand || '').trim();
      const model = String(p?.model || '').trim();
      const name = String(p?.name || '').trim();
      return [brand, name || model].filter(Boolean).join(' ').trim();
    }

    function mountSuggest(input) {
      if (!input || input.dataset.picorySuggestMounted === 'true') return;
      input.dataset.picorySuggestMounted = 'true';

      const wrap =
        input.closest('.nav__search') ||
        input.closest('.m-topbar__search-wrap') ||
        input.parentElement;
      if (!wrap) return;

      const host = wrap.parentElement || document.body;
      if (host !== document.body) {
        const cs = window.getComputedStyle(host);
        if (cs.position === 'static') host.style.position = 'relative';
      }

      const ul = document.createElement('ul');
      ul.className = 'price-search__suggest';
      ul.setAttribute('role', 'listbox');
      ul.hidden = true;
      host.appendChild(ul);

      function syncPos() {
        const wrapRect = wrap.getBoundingClientRect();
        const hostRect = host.getBoundingClientRect();
        ul.style.left = `${Math.max(0, wrapRect.left - hostRect.left)}px`;
        ul.style.top = `${wrapRect.bottom - hostRect.top + 6}px`;
        ul.style.right = 'auto';
        ul.style.width = `${wrapRect.width}px`;
      }

      function close() {
        ul.hidden = true;
        ul.innerHTML = '';
        input.setAttribute('aria-expanded', 'false');
      }

      function open(items) {
        syncPos();
        ul.innerHTML = items
          .map((p) => {
            const label = getLabel(p);
            const meta = String(p?.priceSummary || p?.categoryLabel || '').trim();
            return `<li class="price-search__suggest-item" role="option">
              <button type="button" class="price-search__suggest-btn" data-q="${escapeAttr(label)}">
                <span class="price-search__suggest-name">${escapeHtml(label)}</span>
                <span class="price-search__suggest-meta">${escapeHtml(meta)}</span>
              </button>
            </li>`;
          })
          .join('');
        ul.hidden = !items.length;
        input.setAttribute('aria-expanded', items.length ? 'true' : 'false');
      }

      function compute() {
        const q = normalize(input.value);
        if (!q) {
          close();
          return;
        }
        const list = Array.isArray(window.PICORY_CATALOG) ? window.PICORY_CATALOG : [];
        const items = list
          .filter((p) => {
            const label = normalize(getLabel(p));
            return (
              label.includes(q) ||
              normalize(p?.brand).includes(q) ||
              normalize(p?.model).includes(q)
            );
          })
          .slice(0, 7);
        if (!items.length) {
          close();
          return;
        }
        open(items);
      }

      function goSearch(picked) {
        const url = new URL(window.location.href);
        if (picked) url.searchParams.set('q', picked);
        else url.searchParams.delete('q');
        window.location.href = `${url.pathname}${url.search}${url.hash || ''}`;
      }

      input.addEventListener('input', compute);
      input.addEventListener('focus', compute);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
        if (e.key === 'Enter') {
          const v = input.value.trim();
          if (!v) return;
          e.preventDefault();
          close();
          goSearch(v);
        }
      });

      window.addEventListener('resize', () => {
        if (!ul.hidden) syncPos();
      });
      window.addEventListener(
        'scroll',
        () => {
          if (!ul.hidden) syncPos();
        },
        { passive: true },
      );

      ul.addEventListener('click', (e) => {
        const btn = e.target.closest('.price-search__suggest-btn');
        if (!btn) return;
        const picked = btn.getAttribute('data-q') || '';
        if (!picked) return;
        input.value = picked;
        close();
        goSearch(picked);
      });

      document.addEventListener('mousedown', (e) => {
        const t = e.target;
        if (wrap.contains(t) || ul.contains(t)) return;
        close();
      });
    }

    ensureCatalogLoaded().then(() => {
      const inputs = [
        document.querySelector('.nav__search input[type="search"]'),
        document.querySelector('.m-topbar__search-input'),
      ].filter(Boolean);
      inputs.forEach(mountSuggest);
    });
  })();

  // ===== Nav 주황 배지: 클릭 시 숨김(sessionStorage). 새로고침(reload) 시에만 다시 표시 =====
  const NAV_BADGE_SESSION_KEY = 'picoryNavBadgesDismissed';
  function navBadgeGetDismissed() {
    try {
      return JSON.parse(sessionStorage.getItem(NAV_BADGE_SESSION_KEY) || '{}');
    } catch {
      return {};
    }
  }
  function navBadgeSetDismissed(key) {
    const d = navBadgeGetDismissed();
    d[key] = true;
    sessionStorage.setItem(NAV_BADGE_SESSION_KEY, JSON.stringify(d));
  }
  (function initNavBadges() {
    const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    const isReload = (nav && nav.type === 'reload') || (performance.navigation && performance.navigation.type === 1);
    if (isReload) {
      try {
        sessionStorage.removeItem(NAV_BADGE_SESSION_KEY);
      } catch (e) {}
    }
    const dismissed = navBadgeGetDismissed();
    document.querySelectorAll('[data-nav-badge]').forEach((link) => {
      const key = link.getAttribute('data-nav-badge');
      if (!key) return;
      if (dismissed[key] || link.classList.contains('nav__link--active')) {
        link.classList.add('nav__link--badge-off');
      }
      link.addEventListener('click', () => {
        navBadgeSetDismissed(key);
        document.querySelectorAll(`[data-nav-badge="${key}"]`).forEach((el) => {
          el.classList.add('nav__link--badge-off');
        });
      });
    });
  })();

  // ===== Bookmark Data Store =====
  const bookmarks = [];

  function loadBookmarksFromStorage() {
    try {
      const raw = localStorage.getItem(bookmarkStorageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return;
      parsed.forEach((bm) => {
        if (!bm || typeof bm !== 'object') return;
        const name = String(bm.name || '').trim();
        if (!name) return;
        const lens = String(bm.lens || '').trim();
        const price = String(bm.price || '').trim();
        const href = String(bm.href || '').trim();
        bookmarks.push({ name, lens, price, href });
      });
    } catch (_) {
      /* noop */
    }
  }

  function persistBookmarks() {
    try {
      localStorage.setItem(bookmarkStorageKey, JSON.stringify(bookmarks));
    } catch (_) {
      /* noop */
    }
  }

  function showBookmarkChoiceBanner() {
    let el = document.getElementById('bookmarkChoiceBanner');
    if (!el) {
      el = document.createElement('div');
      el.id = 'bookmarkChoiceBanner';
      el.className = 'bookmark-choice-banner';
      el.setAttribute('role', 'status');
      el.innerHTML = `
        <span class="bookmark-choice-banner__text">북마크에 저장했어요. 북마크 목록으로 갈까요, 아니면 계속 둘러볼까요?</span>
        <div class="bookmark-choice-banner__actions">
          <button type="button" class="btn btn--ghost btn--sm" data-bookmark-stay>계속 보기</button>
          <button type="button" class="btn btn--primary btn--sm" data-bookmark-go>북마크로</button>
        </div>
      `;
      document.body.appendChild(el);
      el.querySelector('[data-bookmark-go]')?.addEventListener('click', () => {
        el.hidden = true;
        document.getElementById('bookmarkSidebar')?.classList.add('open');
      });
      el.querySelector('[data-bookmark-stay]')?.addEventListener('click', () => {
        el.hidden = true;
      });
    }
    el.hidden = false;
    clearTimeout(el._picoryHideT);
    el._picoryHideT = setTimeout(() => {
      el.hidden = true;
    }, 14000);
  }

  function updateBookmarkUI() {
    const list = document.getElementById('bookmarkList');
    const empty = document.getElementById('bookmarkEmpty');
    const footer = document.getElementById('bookmarkFooter');
    if (!list || !empty || !footer) return;

    if (bookmarks.length === 0) {
      empty.classList.remove('hidden');
      list.classList.add('hidden');
      footer.classList.add('hidden');
      return;
    }

    empty.classList.add('hidden');
    list.classList.remove('hidden');
    footer.classList.remove('hidden');

    list.innerHTML = bookmarks
      .map((bm, i) => {
        const href = bm.href || `price.html?q=${encodeURIComponent(bm.name)}`;
        return `
      <div class="bookmark-card">
        <a class="bookmark-card__main" href="${href.replace(/"/g, '&quot;')}">
          <div class="bookmark-card__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="1.5">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
          <div class="bookmark-card__info">
            <div class="bookmark-card__name">${bm.name}</div>
            <div class="bookmark-card__sub">${bm.lens} &middot; ${bm.price}</div>
          </div>
        </a>
        <button class="bookmark-card__remove" type="button" data-index="${i}" aria-label="삭제">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    `;
      })
      .join('');

    // Bind remove buttons
    list.querySelectorAll('.bookmark-card__remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index);
        bookmarks.splice(idx, 1);
        persistBookmarks();
        // Update toggle state of bookmark-add buttons
        syncBookmarkButtons();
        updateBookmarkUI();
      });
    });
  }

  function syncBookmarkButtons() {
    document.querySelectorAll('.bookmark-add').forEach((btn) => {
      const card = btn.closest('.recommend-card') || btn.closest('.product-card');
      if (!card) return;
      let name = '';
      if (card.classList.contains('recommend-card')) {
        name = card.querySelector('.recommend-card__name')?.textContent?.trim() || '';
      } else {
        const brand = card.querySelector('.product-card__brand')?.textContent?.trim() || '';
        const model = card.querySelector('.product-card__model')?.textContent?.trim() || '';
        name = `${brand} ${model}`.trim();
      }
      const exists = bookmarks.some((bm) => bm.name === name);
      btn.classList.toggle('active', exists);
    });
  }

  window.syncPicoryBookmarks = syncBookmarkButtons;
  loadBookmarksFromStorage();
  updateBookmarkUI();

  // ===== Upload Zone =====
  const uploadZone = document.getElementById('uploadZone');
  const uploadIdle = document.getElementById('uploadIdle');
  const uploadLoading = document.getElementById('uploadLoading');
  const fileInput = document.getElementById('fileInput');
  const resultSection = document.getElementById('resultSection');
  const previewImg = document.getElementById('previewImg');

  if (uploadZone && fileInput && uploadIdle && uploadLoading && resultSection && previewImg) {
    uploadZone.addEventListener('click', () => fileInput.click());

    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
      uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        handleUpload(file);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files[0]) {
        handleUpload(fileInput.files[0]);
      }
    });

    /** 클립보드 이미지 붙여넣기 (검색창·입력란 포커스일 때는 무시) */
    document.addEventListener('paste', (e) => {
      const target = e.target;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          (typeof target.isContentEditable === 'boolean' && target.isContentEditable))
      ) {
        return;
      }
      const cd = e.clipboardData;
      if (!cd) return;

      const files = cd.files;
      if (files?.length) {
        for (let i = 0; i < files.length; i++) {
          const f = files[i];
          if (f.type.startsWith('image/')) {
            e.preventDefault();
            handleUpload(f);
            return;
          }
        }
      }

      const items = cd.items;
      if (!items?.length) return;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            handleUpload(file);
          }
          break;
        }
      }
    });
  }

  const MAX_RECOMMEND_IMAGE_BYTES = 10 * 1024 * 1024;
  const recommendCompareSection = document.getElementById('recommendCompareSection');
  const recommendCompareTabs = document.getElementById('recommendCompareTabs');
  const recommendCompareBody = document.getElementById('recommendCompareBody');
  let recommendCompareItems = [];
  let recommendCompareActiveIndex = 0;

  /** recommend.html에서 picoryRecommendInit.mjs가 먼저 window.picoryRecommend를 채움 */
  async function getPicoryRecommendModule() {
    if (typeof window !== 'undefined' && window.picoryRecommend) {
      return window.picoryRecommend;
    }
    const deadline = Date.now() + 15000;
    while (Date.now() < deadline) {
      if (typeof window !== 'undefined' && window.picoryRecommend) {
        return window.picoryRecommend;
      }
      await new Promise((r) => setTimeout(r, 30));
    }
    try {
      const mod = await import('./js/recommend/picoryAnalysis.mjs');
      if (typeof window !== 'undefined') window.picoryRecommend = mod;
      return mod;
    } catch (_) {
      throw new Error(
        '분석 모듈을 불러오지 못했습니다. 프로젝트 폴더에서 npm start 후 http://localhost:…/recommend.html 로 열었는지 확인해 주세요.',
      );
    }
  }

  function resetPipelineSteps() {
    const steps = document.querySelectorAll('#pipelineStepper .pipeline-step');
    steps.forEach((el, i) => {
      el.classList.remove('pipeline-step--done', 'pipeline-step--wait');
      el.classList.toggle('pipeline-step--active', i === 0);
    });
  }

  async function animateRecommendPipelineSteps(loadMainEl, sleepFn) {
    const steps = document.querySelectorAll('#pipelineStepper .pipeline-step');
    const labels = ['컬러 분석 중…', '추천 매칭 중…'];
    const stepOrder = [2, 3];
    for (let i = 0; i < stepOrder.length; i++) {
      const s = stepOrder[i];
      steps.forEach((el) => {
        const n = Number(el.getAttribute('data-step'));
        el.classList.remove('pipeline-step--active', 'pipeline-step--done');
        if (n < s) el.classList.add('pipeline-step--done');
        if (n === s) el.classList.add('pipeline-step--active');
      });
      if (loadMainEl) loadMainEl.textContent = labels[i];
      await sleepFn(380 + Math.random() * 480);
    }
  }

  function markPipelineAllDone() {
    document.querySelectorAll('#pipelineStepper .pipeline-step').forEach((el) => {
      el.classList.remove('pipeline-step--active', 'pipeline-step--wait');
      el.classList.add('pipeline-step--done');
    });
  }

  function renderPicoryClientAnalysis(data) {
    const ex = data.exif;
    const metaBadge = document.getElementById('metaBadge');
    const metaBody = document.getElementById('metaPanelBody');
    if (metaBadge) metaBadge.textContent = ex.badgeLabel || '—';
    if (metaBody) {
      metaBody.innerHTML =
        ex.detailHtml ||
        `<p class="meta-panel__muted">${String(ex.message || '메타데이터를 확인했습니다.')}</p>`;
    }

    const c = data.color;
    const colorBars = document.getElementById('colorBars');
    if (colorBars && c) {
      const channels = [
        { name: 'R', m: c.mean.r, s: c.sigma.r, color: '#e53935' },
        { name: 'G', m: c.mean.g, s: c.sigma.g, color: '#43a047' },
        { name: 'B', m: c.mean.b, s: c.sigma.b, color: '#1e88e5' },
      ];
      colorBars.innerHTML = channels
        .map((ch) => {
          const h = Math.max(6, Math.round((ch.m / 255) * 100));
          return `<div class="color-bar-col"><div class="color-bar-stack" aria-hidden="true"><div class="color-bar-fill" style="height:${h}%;background:${ch.color}"></div></div><span class="color-bar-channel">${ch.name}</span><span class="color-bar-stats">μ=${ch.m.toFixed(0)} σ=${ch.s.toFixed(1)}</span></div>`;
        })
        .join('');
    }

    const noteEl = document.getElementById('colorScienceNote');
    if (noteEl && c) {
      noteEl.textContent = `※ ${c.moodLabel} — ${c.scienceNote}`;
    }

    const metricsEl = document.getElementById('colorMetrics');
    if (metricsEl && c) {
      const gs = c.greenShift >= 0 ? `+${c.greenShift}` : String(c.greenShift);
      metricsEl.innerHTML = `<div class="color-metric"><span class="color-metric__k">색온도 느낌</span><span class="color-metric__v">${c.warmth}</span></div><div class="color-metric"><span class="color-metric__k">채도 범위</span><span class="color-metric__v">${c.saturationRange}</span></div><div class="color-metric"><span class="color-metric__k">그린 시프트</span><span class="color-metric__v">${gs}</span></div>`;
    }
  }

  function formatPriceKrw(n) {
    if (n == null || Number.isNaN(Number(n))) return '—';
    return `${Number(n).toLocaleString('ko-KR')}원`;
  }

  function escapeHtmlLite(value) {
    return String(value ?? '').replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[ch] || ch));
  }

  function renderRecommendCompareBody() {
    if (!recommendCompareBody || !recommendCompareItems.length) return;
    const current = recommendCompareItems[recommendCompareActiveIndex];
    if (!current) return;
    const currentName = `${current.product?.brand || ''} ${current.product?.model || ''}`.trim() || '후보';
    const currentPrice = (current.product?.priceSummary || '').trim() || formatPriceKrw(current.product?.priceKrw);
    const currentSensor = current.specs?.sensor || '—';
    const currentMp = current.specs?.megapixel || '—';
    const currentAperture = current.specs?.aperture || '—';
    const lensSuggestion = (current.lens_suggestion || '').trim() || '—';

    const otherItems = recommendCompareItems.filter((_, i) => i !== recommendCompareActiveIndex);
    const otherCards = otherItems.map((item) => {
      const name = `${item.product?.brand || ''} ${item.product?.model || ''}`.trim() || '후보';
      const price = (item.product?.priceSummary || '').trim() || formatPriceKrw(item.product?.priceKrw);
      return `
        <article class="recommend-compare__item">
          <h4 class="recommend-compare__item-title">${escapeHtmlLite(name)}</h4>
          <p class="recommend-compare__item-kv">센서: ${escapeHtmlLite(item.specs?.sensor || '—')}</p>
          <p class="recommend-compare__item-kv">화소: ${escapeHtmlLite(item.specs?.megapixel || '—')}</p>
          <p class="recommend-compare__item-kv">조리개: ${escapeHtmlLite(item.specs?.aperture || '—')}</p>
          <p class="recommend-compare__item-kv">신품 최저: ${escapeHtmlLite(price)}</p>
        </article>
      `;
    }).join('');

    recommendCompareBody.innerHTML = `
      <p class="recommend-compare__current"><strong>${escapeHtmlLite(currentName)}</strong>을(를) 기준으로 다른 후보와 비교 중입니다.</p>
      <div class="recommend-compare__chips">
        <span class="recommend-compare__chip">센서: ${escapeHtmlLite(currentSensor)}</span>
        <span class="recommend-compare__chip">화소: ${escapeHtmlLite(currentMp)}</span>
        <span class="recommend-compare__chip">조리개: ${escapeHtmlLite(currentAperture)}</span>
        <span class="recommend-compare__chip">렌즈 제안: ${escapeHtmlLite(lensSuggestion)}</span>
        <span class="recommend-compare__chip">신품 최저: ${escapeHtmlLite(currentPrice)}</span>
      </div>
      <div class="recommend-compare__list">${otherCards}</div>
    `;
  }

  function renderRecommendCompareTabs(items) {
    if (!recommendCompareSection || !recommendCompareTabs || !recommendCompareBody) return;
    recommendCompareItems = Array.isArray(items) ? items.filter((it) => it && it.product).slice(0, 3) : [];
    if (recommendCompareItems.length < 2) {
      recommendCompareSection.classList.add('hidden');
      recommendCompareTabs.innerHTML = '';
      recommendCompareBody.innerHTML = '';
      return;
    }
    recommendCompareSection.classList.remove('hidden');
    if (recommendCompareActiveIndex >= recommendCompareItems.length) {
      recommendCompareActiveIndex = 0;
    }
    recommendCompareTabs.innerHTML = recommendCompareItems.map((item, idx) => {
      const name = `${item.product?.brand || ''} ${item.product?.model || ''}`.trim() || `후보 ${idx + 1}`;
      const active = idx === recommendCompareActiveIndex;
      return `<button type="button" class="recommend-compare__tab${active ? ' is-active' : ''}" data-recommend-compare-index="${idx}" role="tab" aria-selected="${active ? 'true' : 'false'}">${escapeHtmlLite(name)}</button>`;
    }).join('');
    renderRecommendCompareBody();
  }

  recommendCompareTabs?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-recommend-compare-index]');
    if (!btn) return;
    const next = Number(btn.getAttribute('data-recommend-compare-index'));
    if (!Number.isFinite(next) || next < 0 || next >= recommendCompareItems.length) return;
    recommendCompareActiveIndex = next;
    renderRecommendCompareTabs(recommendCompareItems);
  });

  function fillRecommendCard(card, item) {
    if (!card || !item?.product) return;
    const p = item.product;
    const name = `${p.brand} ${p.model}`.trim();
    const nameEl = card.querySelector('.recommend-card__name');
    if (nameEl) {
      nameEl.textContent = name;
      nameEl.title = item.why || '';
    }
    const lensEl = card.querySelector('.recommend-card__lens');
    if (lensEl) lensEl.textContent = '+ ' + (item.lens_suggestion || '').replace(/^\+\s*/, '');
    const specs = item.specs || {};
    const values = card.querySelectorAll('.spec-item__value');
    if (values[0]) values[0].textContent = specs.sensor || '—';
    if (values[1]) values[1].textContent = specs.megapixel || '—';
    if (values[2]) values[2].textContent = specs.aperture || '—';
    const priceEl = card.querySelector('.price-value');
    if (priceEl) {
      const ps = (p.priceSummary || '').trim();
      priceEl.textContent = ps ? ps.replace(/^약\s*/, '') : formatPriceKrw(p.priceKrw);
    }
    const link = card.querySelector('.recommend-card__actions a.btn--primary');
    if (link) link.href = 'price.html?q=' + encodeURIComponent(name);
  }

  function applyRecommendImageResult(data) {
    const errEl = document.getElementById('recommendApiError');
    if (errEl) {
      errEl.classList.add('hidden');
      errEl.textContent = '';
    }

    const summaryEl = document.getElementById('analysisSummary');
    if (summaryEl) {
      const s = typeof data.summary === 'string' ? data.summary.trim() : '';
      summaryEl.textContent = s;
      summaryEl.hidden = !s;
    }

    const tagsEl = document.getElementById('analysisTags');
    const tagClasses = ['tag--warm', 'tag--bokeh', 'tag--natural', 'tag--cool', 'tag--film'];
    if (tagsEl && Array.isArray(data.mood_tags) && data.mood_tags.length) {
      tagsEl.innerHTML = '';
      data.mood_tags.forEach((t, i) => {
        const span = document.createElement('span');
        span.className = 'tag ' + (tagClasses[i % tagClasses.length] || 'tag--natural');
        span.textContent = t;
        tagsEl.appendChild(span);
      });
    }

    const cards = document.querySelectorAll('#resultSection .recommend-card');
    const items = data.items || [];
    if (cards[0]) fillRecommendCard(cards[0], items[0]);
    if (cards[1]) fillRecommendCard(cards[1], items[1]);
    renderRecommendCompareTabs(items);

    const bundleTitle = document.querySelector('#resultSection .bundle-section__title-model');
    if (bundleTitle && items[0]?.product) {
      const p = items[0].product;
      bundleTitle.textContent = `${p.brand} ${p.model}`.trim();
    }
  }

  function showRecommendUploadError(message) {
    const errEl = document.getElementById('recommendApiError');
    if (errEl) {
      errEl.textContent = message;
      errEl.classList.remove('hidden');
    }
    const tagsEl = document.getElementById('analysisTags');
    if (tagsEl) {
      tagsEl.innerHTML = '<span class="tag tag--natural">분석을 완료하지 못했어요</span>';
    }
    const summaryEl = document.getElementById('analysisSummary');
    if (summaryEl) {
      summaryEl.textContent = '';
      summaryEl.hidden = true;
    }
    recommendCompareSection?.classList.add('hidden');
  }

  function handleUpload(file) {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있어요.');
      return;
    }
    if (file.size > MAX_RECOMMEND_IMAGE_BYTES) {
      alert('10MB 이하 이미지를 올려 주세요.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target.result;
      previewImg.style.backgroundImage = `url(${dataUrl})`;
      uploadIdle.classList.add('hidden');
      uploadLoading.classList.remove('hidden');
      const loadMain = document.getElementById('uploadLoadingMain');
      const loadSub = document.getElementById('uploadLoadingSub');
      if (loadMain) loadMain.textContent = '분석 단계 진행 중…';
      if (loadSub) {
        loadSub.hidden = true;
        loadSub.textContent = '';
      }

      const errEl = document.getElementById('recommendApiError');
      if (errEl) {
        errEl.classList.add('hidden');
        errEl.textContent = '';
      }

      const pipelineEl = document.getElementById('analysisPipeline');
      resetPipelineSteps();
      if (pipelineEl) pipelineEl.classList.remove('hidden');
      resultSection.classList.remove('hidden');
      resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

      try {
        const picory = await getPicoryRecommendModule();

        await animateRecommendPipelineSteps(loadMain, picory.sleep);

        if (loadMain) loadMain.textContent = '이미지 분석·카탈로그 매칭 중…';

        const clientAnalysis = await picory.analyzeUpload(file, dataUrl);
        renderPicoryClientAnalysis(clientAnalysis);

        const catalog = await picory.loadCatalog();
        const ranked = picory.rankByColorProfile(clientAnalysis.color, catalog);
        const data = picory.toApiShape(clientAnalysis.color, ranked);
        applyRecommendImageResult(data);
        markPipelineAllDone();

        const desc = document.getElementById('sectionRecommendDesc');
        if (desc) {
          desc.textContent =
            '업로드한 사진의 컬러 지표와 Pictory 카탈로그의 색 특성을 비교해 가까운 순으로 골랐어요. (브라우저 전용, 외부 AI 없음)';
        }
      } catch (err) {
        console.error(err);
        const raw = String(err.message || err);
        const msg =
          raw === 'CATALOG_FETCH'
            ? '카탈로그(server/catalog.json)를 불러오지 못했습니다. Node 서버로 recommend.html을 열었는지 확인해 주세요.'
            : raw === 'Failed to fetch' || raw === 'NetworkError when attempting to fetch resource.'
              ? '리소스를 불러오지 못했습니다. http 로 로컬 서버를 통해 페이지를 열었는지 확인해 주세요.'
              : raw;
        showRecommendUploadError(msg);
        markPipelineAllDone();
      } finally {
        uploadLoading.classList.add('hidden');
        uploadIdle.classList.remove('hidden');
        resultSection.classList.remove('hidden');
        applyRecommendCameraThumbnails();
        window.syncPicoryBookmarks?.();
      }
    };
    reader.onerror = () => {
      uploadLoading.classList.add('hidden');
      uploadIdle.classList.remove('hidden');
      alert('파일을 읽을 수 없습니다.');
    };
    reader.readAsDataURL(file);
  }

  /** AI 추천 카드에 카탈로그 카메라 이미지 주입 (recommend.html의 bridge.js가 있으면 mockData 기반 매핑) */
  function applyRecommendCameraThumbnails() {
    const getThumb = window.picoryGetRecommendThumbnail;
    const fallbackThumb = {
      'Sony A7C II': '/images/cameras/sony-a7c-ii.png',
      'Fujifilm X-T5': '/images/cameras/fujifilm-x-s20.png',
    };
    document.querySelectorAll('.recommend-card').forEach((card) => {
      const nameEl = card.querySelector('.recommend-card__name');
      const imgWrap = card.querySelector('.recommend-card__img');
      if (!nameEl || !imgWrap) return;
      const name = nameEl.textContent.trim();
      const src =
        typeof getThumb === 'function'
          ? getThumb(name)
          : fallbackThumb[name] || '/images/cameras/default-camera.png';
      imgWrap.replaceChildren();
      const img = document.createElement('img');
      img.className = 'recommend-card__photo';
      img.alt = `${name} 제품 이미지`;
      img.src = src;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.onerror = () => {
        img.onerror = null;
        img.src = '/images/cameras/default-camera.png';
      };
      imgWrap.appendChild(img);
    });
  }

  // ===== Bookmark Add (이벤트 위임: 추천 카드 + 상품 카드 동적 생성 대응) =====
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.bookmark-add');
    if (!btn) return;
    const card = btn.closest('.recommend-card') || btn.closest('.product-card');
    if (!card) return;
    e.preventDefault();
    e.stopPropagation();
    if (!requireLoginForBookmarkOrRedirect()) return;

    let name = '';
    let lens = '';
    let price = '';

    if (card.classList.contains('recommend-card')) {
      name = card.querySelector('.recommend-card__name')?.textContent?.trim() || '';
      lens = (card.querySelector('.recommend-card__lens')?.textContent || '').replace('+ ', '').trim();
      price = card.querySelector('.price-value')?.textContent?.trim() || '';
    } else {
      const brand = card.querySelector('.product-card__brand')?.textContent?.trim() || '';
      const model = card.querySelector('.product-card__model')?.textContent?.trim() || '';
      name = `${brand} ${model}`.trim();
      lens = card.querySelector('.product-card__platform')?.textContent?.trim() || '상품 카탈로그';
      price = card.querySelector('.product-card__price')?.textContent?.trim() || '';
    }

    if (!name) return;

    let detailHref = `price.html?q=${encodeURIComponent(name)}`;
    if (card.classList.contains('product-card')) {
      const linkEl = card.querySelector('.product-card__link');
      const h = linkEl && linkEl.getAttribute('href');
      if (h) detailHref = h;
    }

    const existIdx = bookmarks.findIndex((bm) => bm.name === name);
    if (existIdx >= 0) {
      bookmarks.splice(existIdx, 1);
      btn.classList.remove('active');
      addActivityLog(`${name}을(를) 북마크에서 제거했어요.`);
    } else {
      bookmarks.push({ name, lens, price, href: detailHref });
      btn.classList.add('active');
      addActivityLog(`${name}을(를) 북마크에 추가했어요.`);
      showBookmarkChoiceBanner();
    }
    persistBookmarks();
    updateBookmarkUI();
  });

  // ===== Checklist Flow =====
  const steps = document.querySelectorAll('.checklist-step');
  const checklistSubmit = document.getElementById('checklistSubmit');
  const checklistResult = document.getElementById('checklistResult');
  const checklistResultBtn = document.getElementById('checklistResultBtn');

  steps.forEach((step) => {
    const options = step.querySelectorAll('.checklist-option');
    const isMulti = step.querySelector('.checklist-options--multi') !== null;

    options.forEach((option) => {
      option.addEventListener('click', () => {
        if (isMulti) {
          option.classList.toggle('selected');
        } else {
          options.forEach(o => o.classList.remove('selected'));
          option.classList.add('selected');

          const currentStep = parseInt(step.dataset.step);
          step.classList.remove('active');
          step.classList.add('completed');

          const nextStep = document.querySelector(`[data-step="${currentStep + 1}"]`);
          if (nextStep) {
            nextStep.classList.add('active');
            setTimeout(() => {
              nextStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 200);
          } else {
            checklistSubmit.classList.remove('hidden');
          }
        }
      });
    });

    if (isMulti) {
      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'btn btn--outline btn--sm';
      nextBtn.textContent = '다음';
      nextBtn.style.marginTop = '12px';
      nextBtn.addEventListener('click', () => {
        const currentStep = parseInt(step.dataset.step);
        step.classList.remove('active');
        step.classList.add('completed');

        const nextStepEl = document.querySelector(`[data-step="${currentStep + 1}"]`);
        if (nextStepEl) {
          nextStepEl.classList.add('active');
          setTimeout(() => {
            nextStepEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 200);
        } else {
          checklistSubmit.classList.remove('hidden');
        }
      });
      step.querySelector('.checklist-options').after(nextBtn);
    }
  });

  // Checklist result — OpenAI API(서버) 우선, 실패 시 로컬 규칙 추천
  checklistResultBtn?.addEventListener('click', async () => {
    const grid = document.getElementById('checklistResultGrid');
    const summaryEl = document.getElementById('checklistResultSummary');
    try {
      const mod = await import('./js/checklist/recommendEngine.js');
      const answers = mod.parseChecklistAnswersFromDom(document);

      let usedOpenAI = false;
      try {
        const res = await fetch('/api/checklist-recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && Array.isArray(data.items) && data.items.length > 0) {
          mod.renderChecklistRows(grid, data.items);
          if (summaryEl) {
            summaryEl.textContent =
              data.summary ||
              `${mod.formatChecklistSummary(answers)} (OpenAI 분석)`;
          }
          usedOpenAI = true;
        }
      } catch (_) {
        /* 네트워크 실패 시 로컬로 */
      }

      if (!usedOpenAI) {
        mod.renderChecklistResultGrid(grid, answers);
        if (summaryEl && typeof mod.formatChecklistSummary === 'function') {
          summaryEl.textContent = mod.formatChecklistSummary(answers);
        }
      }
    } catch (err) {
      if (grid) {
        grid.innerHTML =
          '<p class="checklist-result__empty">추천을 불러오지 못했습니다. 페이지를 새로고침 후 다시 시도해 주세요.</p>';
      }
    }
    checklistSubmit.classList.add('hidden');
    checklistResult.classList.remove('hidden');
    const checklistResultHeader = checklistResult.querySelector('.checklist-result__header');
    (checklistResultHeader || checklistResult).scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    addActivityLog('체크리스트 맞춤 추천을 확인했어요.');
  });

  // ===== Tooltip System =====
  const tooltip = document.getElementById('globalTooltip');

  function initTooltips() {
    document.querySelectorAll('.tooltip-trigger').forEach(trigger => {
      trigger.addEventListener('mouseenter', () => {
        const text = trigger.dataset.tooltip;
        if (!text) return;
        tooltip.textContent = text;
        tooltip.classList.add('visible');

        const rect = trigger.getBoundingClientRect();
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.bottom + 8}px`;

        const tooltipRect = tooltip.getBoundingClientRect();
        if (tooltipRect.right > window.innerWidth - 16) {
          tooltip.style.left = `${window.innerWidth - tooltipRect.width - 16}px`;
        }
      });

      trigger.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
      });

      trigger.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const text = trigger.dataset.tooltip;
        if (!text) return;
        tooltip.textContent = text;
        tooltip.classList.add('visible');

        const rect = trigger.getBoundingClientRect();
        tooltip.style.left = `${Math.max(16, rect.left)}px`;
        tooltip.style.top = `${rect.bottom + 8}px`;

        setTimeout(() => tooltip.classList.remove('visible'), 3000);
      });
    });
  }
  initTooltips();

  // ===== Community: camera tag → popover (상품 페이지) =====
  const cameraTagPopover = document.getElementById('cameraTagPopover');
  const cameraTagPopoverLink = document.getElementById('cameraTagPopoverLink');
  const cameraTagButtons = document.querySelectorAll('.gallery-card__camera-tag');
  let cameraHideTimer = null;
  let cameraActiveBtn = null;

  function positionCameraPopover(anchor) {
    if (!cameraTagPopover || !anchor) return;
    const r = anchor.getBoundingClientRect();
    const gap = 8;
    cameraTagPopover.style.left = '0px';
    cameraTagPopover.style.top = '0px';
    requestAnimationFrame(() => {
      const pw = cameraTagPopover.offsetWidth;
      const ph = cameraTagPopover.offsetHeight;
      let left = r.left + r.width / 2 - pw / 2;
      left = Math.max(12, Math.min(left, window.innerWidth - pw - 12));
      let top = r.bottom + gap;
      if (top + ph > window.innerHeight - 12) {
        top = Math.max(12, r.top - ph - gap);
      }
      cameraTagPopover.style.left = `${left}px`;
      cameraTagPopover.style.top = `${top}px`;
    });
  }

  function showCameraPopover(anchor) {
    if (!cameraTagPopover || !cameraTagPopoverLink || !anchor) return;
    const href = anchor.getAttribute('data-products-href') || 'products.html';
    cameraTagPopoverLink.setAttribute('href', href);
    cameraTagPopover.hidden = false;
    cameraActiveBtn = anchor;
    cameraTagButtons.forEach((b) => b.setAttribute('aria-expanded', b === anchor ? 'true' : 'false'));
    positionCameraPopover(anchor);
  }

  function hideCameraPopover() {
    if (!cameraTagPopover) return;
    cameraTagPopover.hidden = true;
    cameraActiveBtn = null;
    cameraTagButtons.forEach((b) => b.setAttribute('aria-expanded', 'false'));
  }

  if (cameraTagPopover && cameraTagPopoverLink && cameraTagButtons.length) {
    cameraTagButtons.forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        clearTimeout(cameraHideTimer);
        showCameraPopover(btn);
      });
      btn.addEventListener('mouseleave', () => {
        cameraHideTimer = setTimeout(hideCameraPopover, 200);
      });
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (cameraActiveBtn === btn && !cameraTagPopover.hidden) {
          hideCameraPopover();
        } else {
          showCameraPopover(btn);
        }
      });
    });

    cameraTagPopover.addEventListener('mouseenter', () => clearTimeout(cameraHideTimer));
    cameraTagPopover.addEventListener('mouseleave', () => {
      cameraHideTimer = setTimeout(hideCameraPopover, 200);
    });

    document.addEventListener('click', (e) => {
      if (e.target.closest('.gallery-card__camera-tag') || e.target.closest('#cameraTagPopover')) return;
      hideCameraPopover();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hideCameraPopover();
    });

    window.addEventListener('scroll', () => {
      if (cameraActiveBtn && !cameraTagPopover.hidden) positionCameraPopover(cameraActiveBtn);
    }, true);
  }

  // ===== Bookmark Sidebar =====
  const bookmarkBtn = document.getElementById('bookmarkBtn');
  const sidebar = document.getElementById('bookmarkSidebar');
  const closeSidebar = document.getElementById('closeSidebar');

  if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', () => {
      if (!requireLoginForBookmarkOrRedirect()) return;
      sidebar?.classList.toggle('open');
    });
  }

  closeSidebar?.addEventListener('click', () => {
    sidebar?.classList.remove('open');
  });

  document.addEventListener('click', (e) => {
    if (!sidebar?.classList.contains('open')) return;
    const el = e.target instanceof Element ? e.target : e.target?.parentElement;
    if (!el) return;
    if (
      sidebar.contains(el) ||
      (bookmarkBtn && bookmarkBtn.contains(el)) ||
      el.closest('[data-bookmark-nav]')
    ) {
      return;
    }
    sidebar.classList.remove('open');
  });

  // Compare button
  document.getElementById('compareBtn')?.addEventListener('click', () => {
    if (bookmarks.length < 2) {
      alert('비교하려면 카메라를 2개 이상 북마크해 주세요.');
      return;
    }
    addActivityLog(`${bookmarks.map(b => b.name).join(', ')} 카메라 비교를 시도했어요.`);
    alert(`${bookmarks.map(b => b.name).join(' vs ')} 비교 화면으로 이동합니다.\n(프로토타입 데모)`);
  });

  // ===== Glossary Modal =====
  const glossaryModal = document.getElementById('glossaryModal');
  const openGlossaryBtn = document.getElementById('openGlossaryBtn');
  const closeGlossary = document.getElementById('closeGlossary');
  const glossarySearchInput = document.getElementById('glossarySearchInput');

  openGlossaryBtn?.addEventListener('click', () => {
    glossaryModal.classList.remove('hidden');
  });

  closeGlossary?.addEventListener('click', () => {
    glossaryModal.classList.add('hidden');
  });

  glossaryModal?.addEventListener('click', (e) => {
    if (e.target === glossaryModal) {
      glossaryModal.classList.add('hidden');
    }
  });

  // Glossary search
  glossarySearchInput?.addEventListener('input', () => {
    const query = glossarySearchInput.value.toLowerCase().trim();
    const items = document.querySelectorAll('.glossary-item');
    items.forEach(item => {
      const term = item.querySelector('.glossary-item__term')?.textContent.toLowerCase() ?? '';
      const desc = item.querySelector('.glossary-item__desc')?.textContent.toLowerCase() ?? '';
      const example = item.querySelector('.glossary-item__example')?.textContent.toLowerCase() ?? '';
      const matches = !query || term.includes(query) || desc.includes(query) || example.includes(query);
      item.style.display = matches ? '' : 'none';
    });
  });

  // ===== Upload Post Modal =====
  const uploadModal = document.getElementById('uploadModal');
  const uploadPostBtn = document.getElementById('uploadPostBtn');
  const closeUploadModal = document.getElementById('closeUploadModal');
  const uploadModalZone = document.getElementById('uploadModalZone');
  const uploadSubmitBtn = uploadModal?.querySelector('.upload-modal-form .btn--primary');
  const uploadInputs = uploadModal ? uploadModal.querySelectorAll('.form-input') : [];
  const [cameraModelInput, apertureInput, shutterSpeedInput, isoInput, focalLengthInput] = uploadInputs;
  const uploadFileInput = document.createElement('input');
  uploadFileInput.type = 'file';
  uploadFileInput.accept = 'image/*';
  uploadFileInput.hidden = true;
  uploadModal?.appendChild(uploadFileInput);
  const categoryLabelToKey = {
    인물: 'portrait',
    풍경: 'landscape',
    일상: 'daily',
    야경: 'night',
    음식: 'food',
  };
  const uploadDefaultZoneHtml = uploadModalZone?.innerHTML || '';
  let uploadImageDataUrl = '';
  let uploadCategoryKey = 'daily';
  let uploadCategoryLabel = '일상';

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[ch] || ch));
  }

  function resetUploadModalForm() {
    if (uploadModalZone) uploadModalZone.innerHTML = uploadDefaultZoneHtml;
    uploadImageDataUrl = '';
    uploadCategoryKey = 'daily';
    uploadCategoryLabel = '일상';
    if (cameraModelInput) cameraModelInput.value = '';
    if (apertureInput) apertureInput.value = '';
    if (shutterSpeedInput) shutterSpeedInput.value = '';
    if (isoInput) isoInput.value = '';
    if (focalLengthInput) focalLengthInput.value = '';
    uploadFileInput.value = '';
    const chips = uploadModal?.querySelectorAll('.filter-chip');
    chips?.forEach((chip) => {
      chip.classList.toggle('filter-chip--active', chip.textContent?.trim() === uploadCategoryLabel);
    });
  }

  function setUploadPreview(fileName, imageDataUrl) {
    if (!uploadModalZone) return;
    uploadModalZone.innerHTML = `
      <img src="${imageDataUrl}" alt="업로드 미리보기" style="width: 100%; max-height: 220px; object-fit: cover; border-radius: 12px;">
      <p><strong>${escapeHtml(fileName || '이미지')}</strong></p>
      <p class="text-muted">다른 사진으로 바꾸려면 클릭하거나 다시 드래그하세요.</p>
    `;
  }

  function handleUploadImageFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있어요.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      uploadImageDataUrl = String(reader.result || '');
      setUploadPreview(file.name, uploadImageDataUrl);
    };
    reader.readAsDataURL(file);
  }

  uploadPostBtn?.addEventListener('click', () => {
    resetUploadModalForm();
    uploadModal.classList.remove('hidden');
  });

  closeUploadModal?.addEventListener('click', () => {
    uploadModal.classList.add('hidden');
  });

  uploadModal?.addEventListener('click', (e) => {
    if (e.target === uploadModal) {
      uploadModal.classList.add('hidden');
    }
  });

  // Upload modal category chips (single-select)
  const uploadChips = uploadModal?.querySelectorAll('.filter-chip');
  uploadChips?.forEach(chip => {
    if (chip.textContent?.trim() === '일상') {
      chip.classList.add('filter-chip--active');
    }
    chip.addEventListener('click', () => {
      uploadChips.forEach(c => c.classList.remove('filter-chip--active'));
      chip.classList.add('filter-chip--active');
      uploadCategoryLabel = chip.textContent?.trim() || '일상';
      uploadCategoryKey = categoryLabelToKey[uploadCategoryLabel] || 'daily';
    });
  });

  uploadModalZone?.addEventListener('click', () => uploadFileInput.click());

  uploadModalZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadModalZone.classList.add('dragover');
  });

  uploadModalZone?.addEventListener('dragleave', () => {
    uploadModalZone.classList.remove('dragover');
  });

  uploadModalZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadModalZone.classList.remove('dragover');
    handleUploadImageFile(e.dataTransfer?.files?.[0]);
  });

  uploadFileInput.addEventListener('change', () => {
    handleUploadImageFile(uploadFileInput.files?.[0]);
  });

  uploadSubmitBtn?.addEventListener('click', () => {
    if (!uploadImageDataUrl) {
      alert('사진을 먼저 업로드해 주세요.');
      return;
    }
    const cameraModel = cameraModelInput?.value?.trim();
    if (!cameraModel) {
      alert('카메라 기종을 입력해 주세요.');
      cameraModelInput?.focus();
      return;
    }

    const aperture = apertureInput?.value?.trim() || '-';
    const shutterSpeed = shutterSpeedInput?.value?.trim() || '-';
    const iso = isoInput?.value?.trim() || '-';
    const focalLength = focalLengthInput?.value?.trim() || '-';
    let authorNickname = '게스트';
    try {
      const sessionRaw = localStorage.getItem(sessionStorageKey);
      const session = sessionRaw ? JSON.parse(sessionRaw) : null;
      if (session?.nickname) authorNickname = String(session.nickname).trim();
    } catch (_) {
      /* noop */
    }
    const authorHandle = `@${authorNickname || '게스트'}`;
    const likes = Math.floor(Math.random() * 60) + 1;
    const safeModel = escapeHtml(cameraModel);
    const safeCategoryLabel = escapeHtml(uploadCategoryLabel);

    const newCard = document.createElement('article');
    newCard.className = 'gallery-card card';
    newCard.dataset.communityTags = `${uploadCategoryKey} daily`;
    newCard.innerHTML = `
      <div class="gallery-card__img">
        <img class="gallery-card__photo" src="${uploadImageDataUrl}" alt="${safeModel} 업로드 이미지" width="1200" height="800" loading="lazy">
        <div class="gallery-card__overlay">
          <span class="gallery-card__camera-tag">${safeModel}</span>
        </div>
      </div>
      <div class="gallery-card__info">
        <div class="gallery-card__settings" aria-label="촬영 설정">
          <span class="setting-chip">${escapeHtml(aperture)}</span>
          <span class="setting-chip">${escapeHtml(shutterSpeed)}</span>
          <span class="setting-chip">ISO ${escapeHtml(iso)}</span>
          <span class="setting-chip">${escapeHtml(focalLength)}</span>
        </div>
        <div class="gallery-card__meta">
          <span class="gallery-card__author">${escapeHtml(authorHandle)}</span>
          <span class="gallery-card__likes"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>${likes}</span>
        </div>
        <p class="text-muted" style="margin-top: 8px; font-size: 12px;">카테고리: ${safeCategoryLabel}</p>
      </div>
    `;

    const activeFilterChip = communityFilters?.querySelector('.filter-chip--active[data-community-filter]');
    const activeFilter = activeFilterChip?.getAttribute('data-community-filter') || 'all';
    communityGalleryGrid?.prepend(newCard);
    applyCommunityGalleryFilter(activeFilter);

    // 커뮤니티 업로드 항목은 마이페이지 아카이브에도 함께 저장
    try {
      const raw = localStorage.getItem(archiveStorageKey);
      const list = raw ? JSON.parse(raw) : [];
      list.push({
        id: `archive-${Date.now()}`,
        imageDataUrl: uploadImageDataUrl,
        cameraModel,
        categoryLabel: uploadCategoryLabel,
        aperture,
        shutterSpeed,
        iso,
        focalLength,
        authorHandle,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(archiveStorageKey, JSON.stringify(list.slice(-60)));
    } catch (_) {
      /* noop */
    }

    try {
      const raw = localStorage.getItem(communityStorageKey);
      const list = raw ? JSON.parse(raw) : [];
      list.push({
        id: `community-${Date.now()}`,
        imageDataUrl: uploadImageDataUrl,
        cameraModel,
        categoryLabel: uploadCategoryLabel,
        aperture,
        shutterSpeed,
        iso,
        focalLength,
        authorHandle,
        likes,
        communityTags: `${uploadCategoryKey} daily`,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(communityStorageKey, JSON.stringify(list.slice(-80)));
    } catch (_) {
      /* noop */
    }

    uploadModal?.classList.add('hidden');
    addActivityLog(`${cameraModel} 커뮤니티 사진을 업로드했어요.`);
    alert('커뮤니티에 사진이 업로드됐어요.');
  });

  // ===== Community gallery filters (data-community-filter + data-community-tags) =====
  const communityFilters = document.querySelector('#community .community-filters');
  const communityGalleryGrid = document.querySelector('#communityGalleryGrid');

  function renderPersistedCommunityPosts() {
    if (!communityGalleryGrid) return;
    let posts = [];
    try {
      const raw = localStorage.getItem(communityStorageKey);
      posts = raw ? JSON.parse(raw) : [];
    } catch (_) {
      posts = [];
    }
    // 사용자 요청: sony 기종으로 업로드된 커뮤니티 사진은 목록에서 제거
    if (Array.isArray(posts) && posts.length) {
      const kept = posts.filter((post) => !/sony/i.test(String(post?.cameraModel || '')));
      if (kept.length !== posts.length) {
        posts = kept;
        try {
          localStorage.setItem(communityStorageKey, JSON.stringify(kept));
        } catch (_) {
          /* noop */
        }
      }
    }
    if (!posts.length) return;

    posts
      .slice()
      .reverse()
      .forEach((post) => {
        const model = escapeHtml(post.cameraModel || '업로드 이미지');
        const category = escapeHtml(post.categoryLabel || '일상');
        const author = escapeHtml(post.authorHandle || '@게스트');
        const aperture = escapeHtml(post.aperture || '-');
        const shutterSpeed = escapeHtml(post.shutterSpeed || '-');
        const iso = escapeHtml(post.iso || '-');
        const focalLength = escapeHtml(post.focalLength || '-');
        const likes = Number(post.likes) > 0 ? Number(post.likes) : Math.floor(Math.random() * 60) + 1;
        const communityTags = String(post.communityTags || 'daily');
        const imageSrc = String(post.imageDataUrl || '');
        const card = document.createElement('article');
        card.className = 'gallery-card card';
        card.dataset.communityTags = communityTags;
        card.innerHTML = `
          <div class="gallery-card__img">
            <img class="gallery-card__photo" src="${imageSrc}" alt="${model} 업로드 이미지" width="1200" height="800" loading="lazy">
            <div class="gallery-card__overlay">
              <span class="gallery-card__camera-tag">${model}</span>
            </div>
          </div>
          <div class="gallery-card__info">
            <div class="gallery-card__settings" aria-label="촬영 설정">
              <span class="setting-chip">${aperture}</span>
              <span class="setting-chip">${shutterSpeed}</span>
              <span class="setting-chip">ISO ${iso}</span>
              <span class="setting-chip">${focalLength}</span>
            </div>
            <div class="gallery-card__meta">
              <span class="gallery-card__author">${author}</span>
              <span class="gallery-card__likes"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>${likes}</span>
            </div>
            <p class="text-muted" style="margin-top: 8px; font-size: 12px;">카테고리: ${category}</p>
          </div>
        `;
        communityGalleryGrid.prepend(card);
      });
  }

  function applyCommunityGalleryFilter(filterKey) {
    if (!communityGalleryGrid) return;
    const cards = communityGalleryGrid.querySelectorAll('.gallery-card[data-community-tags]');
    cards.forEach((card) => {
      const tags = (card.dataset.communityTags || '').trim().split(/\s+/).filter(Boolean);
      let show = true;
      if (filterKey && filterKey !== 'all') {
        show = tags.includes(filterKey);
      }
      card.hidden = !show;
      card.style.display = show ? '' : 'none';
    });
  }

  communityFilters?.querySelectorAll('[data-community-filter]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const filterKey = chip.getAttribute('data-community-filter') || 'all';
      communityFilters.querySelectorAll('[data-community-filter]').forEach((c) => {
        c.classList.toggle('filter-chip--active', c === chip);
        c.setAttribute('aria-selected', c === chip ? 'true' : 'false');
      });
      applyCommunityGalleryFilter(filterKey);
    });
  });

  renderPersistedCommunityPosts();
  applyCommunityGalleryFilter('all');

  // ===== Mobile Hamburger Menu =====
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburgerBtn?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-menu__link').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (link.hasAttribute('data-bookmark-nav')) {
        e.preventDefault();
        mobileMenu?.classList.remove('open');
        if (!requireLoginForBookmarkOrRedirect()) return;
        document.getElementById('bookmarkSidebar')?.classList.toggle('open');
        return;
      }
      mobileMenu?.classList.remove('open');
    });
  });

  // ===== Landing Banner Slider =====
  const bannerSlider = document.querySelector('[data-banner-slider]');
  if (bannerSlider) {
    const slides = Array.from(bannerSlider.querySelectorAll('.landing-banner__slide'));
    const track = bannerSlider.querySelector('.landing-banner__track');
    const dots = Array.from(bannerSlider.querySelectorAll('[data-banner-dot]'));
    const prevBtn = bannerSlider.querySelector('[data-banner-prev]');
    const nextBtn = bannerSlider.querySelector('[data-banner-next]');
    let currentIndex = 0;
    let autoPlayId;

    const n = slides.length;
    if (track && n > 0) {
      track.style.width = `${n * 100}%`;
      slides.forEach((s) => {
        const w = `${100 / n}%`;
        s.style.flex = `0 0 ${w}`;
        s.style.width = w;
      });
    }

    const renderSlide = (index) => {
      if (track && n > 0) {
        const pct = (100 / n) * index;
        track.style.transform = `translate3d(-${pct}%, 0, 0)`;
      }

      slides.forEach((slide, slideIndex) => {
        slide.setAttribute('aria-hidden', slideIndex === index ? 'false' : 'true');
      });

      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === index);
      });

      currentIndex = index;
    };

    const moveSlide = (direction) => {
      const nextIndex = (currentIndex + direction + slides.length) % slides.length;
      renderSlide(nextIndex);
    };

    const startAutoPlay = () => {
      clearInterval(autoPlayId);
      autoPlayId = setInterval(() => moveSlide(1), 6500);
    };

    prevBtn?.addEventListener('click', () => {
      moveSlide(-1);
      startAutoPlay();
    });

    nextBtn?.addEventListener('click', () => {
      moveSlide(1);
      startAutoPlay();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        renderSlide(index);
        startAutoPlay();
      });
    });

    bannerSlider.addEventListener('mouseenter', () => clearInterval(autoPlayId));
    bannerSlider.addEventListener('mouseleave', startAutoPlay);

    renderSlide(0);
    startAutoPlay();
  }

  // ===== Smooth Scroll for Nav Links =====
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== Nav Active State on Scroll =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = Array.from(document.querySelectorAll('.nav__link'))
    .filter(link => link.getAttribute('href')?.startsWith('#'));

  if (navLinks.length > 0) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY + 100;

      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach((link) => {
            link.classList.remove('nav__link--active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('nav__link--active');
            }
          });
        }
      });
    });
  }

  // ===== Close modals on Escape key =====
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      glossaryModal?.classList.add('hidden');
      uploadModal?.classList.add('hidden');
      sidebar?.classList.remove('open');
      const bb = document.getElementById('bookmarkChoiceBanner');
      if (bb) bb.hidden = true;
    }
  });

  // ===== 상단 검색: 상품 페이지로 이동(한글 검색 지원은 products 번들에서 필터) =====
  if (!document.getElementById('productGrid')) {
    document.querySelectorAll('.nav__search input[type="search"]').forEach((input) => {
      input.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        const v = input.value.trim();
        if (v) {
          window.location.href = `products.html?q=${encodeURIComponent(v)}`;
        } else {
          window.location.href = 'products.html';
        }
      });
    });
  }

});
