/* ========================================
   SHUTTER - Camera Integration Platform
   Interactive Behaviors
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof PictoryIcons !== 'undefined') PictoryIcons.mount();

  const sessionStorageKey = 'picoryAuthSession';
  const activityLogStorageKey = 'picoryActivityLogs';
  const archiveStorageKey = 'picoryArchivePosts';
  const communityStorageKey = 'picoryCommunityPosts';
  const bookmarkStorageKey = 'picoryBookmarks';
  const recentCameraStorageKey = 'picoryRecentCameras';
  const authReturnStorageKey = 'picoryAuthReturn';
  const communityLikesStorageKey = 'picoryCommunityLikes';
  const communityCommentsStorageKey = 'picoryCommunityComments';

  function isPicorySessionActive() {
    return Boolean(localStorage.getItem(sessionStorageKey));
  }

  function currentReturnPath() {
    return `${window.location.pathname.split('/').pop() || 'index.html'}${window.location.search}${window.location.hash}`;
  }

  function buildAuthUrl(reason) {
    const url = new URL('auth.html', window.location.href);
    if (reason) url.searchParams.set('needLogin', reason);
    if (!window.location.pathname.endsWith('auth.html')) {
      const returnTo = currentReturnPath();
      const scrollY = Math.max(0, Math.round(window.scrollY || window.pageYOffset || 0));
      url.searchParams.set('returnTo', returnTo);
      url.searchParams.set('scrollY', String(scrollY));
      try {
        localStorage.setItem(authReturnStorageKey, JSON.stringify({ returnTo, scrollY }));
      } catch (_) {
        /* noop */
      }
    }
    return `${url.pathname.split('/').pop()}${url.search}${url.hash}`;
  }

  window.PicoryAuthReturn = { buildAuthUrl };

  function restoreAuthReturnScroll() {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(authReturnStorageKey) || 'null');
    } catch (_) {
      saved = null;
    }
    if (!saved || typeof saved !== 'object') return;
    const here = currentReturnPath();
    if (String(saved.returnTo || '') !== here) return;
    const y = Number(saved.scrollY);
    if (!Number.isFinite(y) || y <= 0) {
      localStorage.removeItem(authReturnStorageKey);
      return;
    }
    const startedAt = Date.now();
    const maxWaitMs = 2500;
    const scrollBack = () => {
      window.scrollTo({ top: y, behavior: 'auto' });
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const reached = Math.abs((window.scrollY || window.pageYOffset || 0) - Math.min(y, maxScroll)) < 4;
      const timedOut = Date.now() - startedAt > maxWaitMs;
      if (!reached && !timedOut) {
        setTimeout(scrollBack, 100);
        return;
      }
      try {
        localStorage.removeItem(authReturnStorageKey);
      } catch (_) {
        /* noop */
      }
    };
    requestAnimationFrame(scrollBack);
    window.addEventListener('load', () => {
      setTimeout(scrollBack, 0);
      setTimeout(scrollBack, 300);
    }, { once: true });
  }

  function captureAuthLinkReturn() {
    document.addEventListener('click', (event) => {
      const link = event.target?.closest?.('a[href]');
      if (!link || isPicorySessionActive()) return;
      const href = link.getAttribute('href') || '';
      if (!/(^|\/)auth\.html(?:[?#]|$)/.test(href)) return;
      if (window.location.pathname.endsWith('auth.html')) return;
      link.setAttribute('href', buildAuthUrl());
    }, true);
  }

  /** 북마크 기능: 미로그인 시 로그인 페이지로 이동 후(또는 로그인 페이지에서) 토스트 안내 */
  function requireLoginForBookmarkOrRedirect() {
    if (isPicorySessionActive()) return true;
    if (window.location.pathname.endsWith('auth.html')) {
      document.dispatchEvent(new CustomEvent('picory-bookmark-auth-needed'));
      return false;
    }
    window.location.href = buildAuthUrl('bookmark');
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

  function pushRecentCamera(name, source, query) {
    const cameraName = String(name || '').trim();
    if (!cameraName) return;
    const q = String(query || cameraName).trim();
    try {
      const raw = localStorage.getItem(recentCameraStorageKey);
      const list = raw ? JSON.parse(raw) : [];
      const prev = Array.isArray(list) ? list : [];
      const deduped = prev.filter((item) => String(item?.name || '').trim() !== cameraName);
      deduped.push({
        name: cameraName,
        source: String(source || '클릭'),
        query: q,
        at: new Date().toISOString(),
      });
      localStorage.setItem(recentCameraStorageKey, JSON.stringify(deduped.slice(-20)));
    } catch (_) {
      /* noop */
    }
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
      loginLink.setAttribute('href', buildAuthUrl());
      loginLink.addEventListener('click', () => {
        loginLink.setAttribute('href', buildAuthUrl());
      }, { once: true });
      existingLogout?.remove();
    }
  }

  updateAuthNavButton();
  captureAuthLinkReturn();
  restoreAuthReturnScroll();

  // ===== Global Search Suggest (상품/브랜드 연관검색어) =====
  (function initGlobalSearchSuggest() {
    if (window.__PICORY_GLOBAL_SEARCH_SUGGEST__) return;
    window.__PICORY_GLOBAL_SEARCH_SUGGEST__ = true;

    function catalogSrc() {
      const appScript =
        document.querySelector('script[src$="/app.js"]') ||
        document.querySelector('script[src$="app.js"]');
      const base = appScript?.src || window.location.href;
      return new URL('js/catalog.global.js', base).href;
    }

    function ensureCatalogLoaded() {
      if (Array.isArray(window.PICORY_CATALOG) && window.PICORY_CATALOG.length) return Promise.resolve();
      return new Promise((resolve) => {
        const src = catalogSrc();
        const existing = Array.from(document.scripts).find((script) => script.src === src);
        if (existing) {
          if (existing.dataset.picoryCatalogLoaded === 'true') {
            resolve();
            return;
          }
          existing.addEventListener('load', () => resolve());
          existing.addEventListener('error', () => resolve());
          return;
        }
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = () => {
          s.dataset.picoryCatalogLoaded = 'true';
          resolve();
        };
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

    function normalizeSearchQuery(value) {
      let normalized = String(value || '').toLowerCase().trim();
      if (!normalized) return '';
      const brandAliases = {
        소니: 'sony',
        캐논: 'canon',
        후지필름: 'fujifilm',
        후지: 'fujifilm',
        니콘: 'nikon',
        리코: 'ricoh',
        코닥: 'kodak',
        올림푸스: 'olympus',
        'om 시스템': 'om system',
        'om시스템': 'om system',
        디제이아이: 'dji',
        파나소닉: 'panasonic',
        시그마: 'sigma',
        탐론: 'tamron',
        삼양: 'samyang',
      };
      Object.entries(brandAliases).forEach(([ko, en]) => {
        if (normalized.includes(ko)) normalized = normalized.split(ko).join(en);
      });
      if (/\bx100v\b/i.test(normalized) && !/x100vi/.test(normalized)) {
        normalized = normalized.replace(/\bx100v\b/g, 'x100vi');
      }
      return normalized.replace(/\s+/g, ' ').trim();
    }

    function compactAlnum(value) {
      return String(value || '').toLowerCase().replace(/[^a-z0-9가-힣]/g, '');
    }

    function getLabel(p) {
      const brand = String(p?.brand || '').trim();
      const model = String(p?.model || '').trim();
      const name = String(p?.name || '').trim();
      return [brand, name || model].filter(Boolean).join(' ').trim();
    }

    function productMatchesQuery(product, rawQuery) {
      const q = normalizeSearchQuery(rawQuery);
      if (!q) return true;
      const full = normalizeSearchQuery(`${product?.brand || ''} ${product?.model || ''} ${product?.id || ''}`);
      const fullCompact = compactAlnum(full);
      return q.split(/\s+/).filter(Boolean).every((word) => {
        if (full.includes(word)) return true;
        const compactWord = compactAlnum(word);
        return compactWord.length >= 2 && fullCompact.includes(compactWord);
      });
    }

    function searchCatalogProducts(query, limit = 12) {
      const qRaw = String(query || '').trim();
      if (!qRaw) return [];
      const q = normalizeSearchQuery(qRaw);
      if (!q) return [];
      const list = Array.isArray(window.PICORY_CATALOG) ? window.PICORY_CATALOG : [];
      return list
        .map((p) => {
          const label = getLabel(p);
          const labelNorm = normalizeSearchQuery(label);
          const id = String(p?.id || '').toLowerCase();
          let score = -1;
          if (productMatchesQuery(p, qRaw)) {
            if (labelNorm === q) score = 100;
            else if (labelNorm.startsWith(q)) score = 80;
            else if (labelNorm.includes(q)) score = 50;
            else if (normalizeSearchQuery(p?.brand).startsWith(q)) score = 40;
            else if (id.includes(q.replace(/\s/g, ''))) score = 25;
            else score = 30;
          }
          return { p, score };
        })
        .filter((item) => item.score >= 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((item) => item.p);
    }

    function goSearch(picked) {
      const qStr = String(picked || '').trim();
      if (!qStr) return;
      pushRecentCamera(qStr, '검색', qStr);
      const resultsUrl = new URL('price.html', window.location.href);
      resultsUrl.searchParams.set('q', qStr);
      window.location.href = resultsUrl.href;
    }

    function navSearchInputs() {
      return [
        document.querySelector('.nav__search input[type="search"]'),
        document.querySelector('.m-topbar__search-input'),
      ].filter(Boolean);
    }

    function registerNavSearchEnter(input) {
      if (!input || input.dataset.picoryNavSearchEnter === 'true') return;
      input.dataset.picoryNavSearchEnter = 'true';
      input.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        const v = input.value.trim();
        if (!v) return;
        e.preventDefault();
        goSearch(v);
      });
    }

    navSearchInputs().forEach(registerNavSearchEnter);

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
      ul.className = 'price-search__suggest picory-dropdown__menu';
      ul.setAttribute('role', 'listbox');
      ul.setAttribute('aria-label', '카탈로그 상품');
      ul.hidden = true;
      host.appendChild(ul);
      input.setAttribute('autocomplete', 'off');
      input.setAttribute('aria-autocomplete', 'list');
      input.setAttribute('aria-expanded', 'false');

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
        const q = input.value;
        if (!q.trim()) {
          close();
          return;
        }
        const items = searchCatalogProducts(q, 12);
        if (!items.length) {
          close();
          return;
        }
        open(items);
      }

      input.addEventListener('input', compute);
      input.addEventListener('focus', compute);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
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
      navSearchInputs().forEach(mountSuggest);
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
          <button type="button" class="btn btn--primary btn--sm" data-bookmark-go>북마크로 이동</button>
        </div>
      `;
      document.body.appendChild(el);
      el.querySelector('[data-bookmark-go]')?.addEventListener('click', () => {
        el.hidden = true;
        window.location.href = 'mypage.html?tab=bookmark#bookmarks';
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
      const card = btn.closest('.recommend-card') || btn.closest('.product-card') || btn.closest('.checklist-result__card');
      if (!card) return;
      let name = '';
      if (card.classList.contains('recommend-card')) {
        name = card.querySelector('.recommend-card__name')?.textContent?.trim() || '';
      } else if (card.classList.contains('checklist-result__card')) {
        name = card.dataset.cameraName || card.querySelector('h4')?.textContent?.trim() || '';
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
    const matchEl = card.querySelector('.recommend-card__match');
    if (matchEl) {
      const why = String(item?.why || '').trim();
      const sc = item?.score;
      const parts = [];
      if (sc != null && Number.isFinite(Number(sc))) parts.push(`색감 유사도 약 ${Number(sc).toFixed(1)}점`);
      if (why) parts.push(why);
      const line = parts.join(' · ');
      matchEl.textContent = line;
      matchEl.hidden = !line;
    }
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
    document.querySelectorAll('#resultSection .recommend-card__match').forEach((el) => {
      el.textContent = '';
      el.hidden = true;
    });
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
      uploadZone.classList.add('upload-zone--analyzing');
      const recommendHero = document.getElementById('recommend');
      if (recommendHero) {
        recommendHero.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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
      if (pipelineEl) pipelineEl.classList.add('hidden');
      resultSection.classList.add('hidden');

      let recommendPayload = null;

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
        recommendPayload = {
          imageDataUrl: dataUrl,
          summary: data.summary,
          moodTags: data.mood_tags,
          items: data.items,
        };
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
        uploadZone.classList.remove('upload-zone--analyzing');
        uploadLoading.classList.add('hidden');
        uploadIdle.classList.remove('hidden');
        if (pipelineEl) pipelineEl.classList.remove('hidden');
        resultSection.classList.remove('hidden');
        applyRecommendCameraThumbnails();
        window.syncPicoryBookmarks?.();

        try {
          const analysisFailed = Boolean(
            errEl && !errEl.classList.contains('hidden') && errEl.textContent.trim(),
          );
          if (!analysisFailed) {
            const saved = await window.PicoryRecommendHistory?.persistResult?.({
              ...(recommendPayload || { imageDataUrl: dataUrl }),
              root: resultSection,
            });
            if (saved) addActivityLog('AI 사진 추천 결과를 저장했어요.');
          }
        } catch (saveErr) {
          console.warn('[recommend] history save failed', saveErr);
        }

        requestAnimationFrame(() => {
          resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    };
    reader.onerror = () => {
      uploadZone.classList.remove('upload-zone--analyzing');
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

  // ===== Bookmark Add (이벤트 위임: 추천 카드 + 상품 카드 + 체크리스트 결과 대응) =====
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.bookmark-add');
    if (!btn) return;
    const card = btn.closest('.recommend-card') || btn.closest('.product-card') || btn.closest('.checklist-result__card');
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
    } else if (card.classList.contains('checklist-result__card')) {
      name = card.dataset.cameraName || card.querySelector('h4')?.textContent?.trim() || '';
      lens = '체크리스트 추천';
      price = card.dataset.cameraPrice || card.querySelector('.checklist-result__price-row span')?.textContent?.trim() || '';
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
      const linkEl =
        card.querySelector('.product-card__action-btn') ||
        card.querySelector('.product-card__thumb-link');
      const h = linkEl && linkEl.getAttribute('href');
      if (h) detailHref = h;
    } else if (card.classList.contains('checklist-result__card')) {
      const linkEl = card.querySelector('.checklist-result__price-row a');
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
      step.querySelector('.checklist-options')?.after(nextBtn);
    }
  });

  // Checklist result — OpenAI API(서버) 우선, 실패 시 로컬 규칙 추천
  checklistResultBtn?.addEventListener('click', async () => {
    const grid = document.getElementById('checklistResultGrid');
    const summaryEl = document.getElementById('checklistResultSummary');
    const renderLocalChecklist = (engine) => {
      const answers = engine.parseChecklistAnswersFromDom(document);
      engine.renderChecklistResultGrid(grid, answers);
      if (summaryEl && typeof engine.formatChecklistSummary === 'function') {
        summaryEl.textContent = engine.formatChecklistSummary(answers);
      }
    };
    try {
      if (window.PicoryChecklistLocal) {
        renderLocalChecklist(window.PicoryChecklistLocal);
      } else {
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
      }
    } catch (err) {
      if (window.PicoryChecklistLocal) {
        renderLocalChecklist(window.PicoryChecklistLocal);
      } else if (grid) {
        grid.innerHTML =
          '<p class="checklist-result__empty">추천을 불러오지 못했습니다. 페이지를 새로고침 후 다시 시도해 주세요.</p>';
      }
    }
    checklistSubmit.classList.add('hidden');
    checklistResult.classList.remove('hidden');
    window.syncPicoryBookmarks?.();
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
      const termEl = item.querySelector('.glossary-item__term');
      const descEl = item.querySelector('.glossary-item__desc');
      const exampleEl = item.querySelector('.glossary-item__example');
      const term = termEl ? termEl.textContent.toLowerCase() : '';
      const desc = descEl ? descEl.textContent.toLowerCase() : '';
      const example = exampleEl ? exampleEl.textContent.toLowerCase() : '';
      const matches = !query || term.includes(query) || desc.includes(query) || example.includes(query);
      item.style.display = matches ? '' : 'none';
    });
  });

  // ===== Upload Post Modal =====
  const uploadModal = document.getElementById('uploadModal');
  const uploadPostBtn = document.getElementById('uploadPostBtn');
  const closeUploadModal = document.getElementById('closeUploadModal');
  const communityFilters = document.querySelector('#community .community-filters');
  const communityGalleryGrid = document.querySelector('#communityGalleryGrid');
  const uploadDropZone = document.getElementById('uploadDropZone');
  const uploadModalZone = document.getElementById('uploadModalZone');
  const uploadFileInputEl = document.getElementById('uploadFileInput');
  const uploadPreviews = document.getElementById('uploadPreviews');
  const uploadPreviewGrid = document.getElementById('uploadPreviewGrid');
  const uploadPreviewCount = document.getElementById('uploadPreviewCount');
  const uploadSubmitBtn =
    document.getElementById('uploadSubmitBtn') ||
    uploadModal?.querySelector('.upload-modal-form .btn--primary');
  const cameraModelInput = document.getElementById('uploadCamera');
  const apertureInput = document.getElementById('uploadAperture');
  const shutterSpeedInput = document.getElementById('uploadShutter');
  const isoInput = document.getElementById('uploadIso');
  const focalLengthInput = document.getElementById('uploadFocal');
  const uploadCaptionInput = document.getElementById('uploadCaption');
  const legacyUploadInputs = uploadModal && !cameraModelInput
    ? uploadModal.querySelectorAll('.upload-modal-form .form-input')
    : [];
  const legacyCameraInput = legacyUploadInputs[0] || null;
  const legacyApertureInput = legacyUploadInputs[1] || null;
  const legacyShutterInput = legacyUploadInputs[2] || null;
  const legacyIsoInput = legacyUploadInputs[3] || null;
  const legacyFocalInput = legacyUploadInputs[4] || null;
  const uploadCategoryChips = uploadModal?.querySelectorAll(
    '#uploadCategoryChips .filter-chip, .upload-modal-form .form-chips .filter-chip',
  );
  const categoryLabelToKey = {
    인물: 'portrait',
    풍경: 'landscape',
    일상: 'daily',
    야경: 'night',
    음식: 'food',
  };
  const uploadDefaultZoneHtml = uploadModalZone?.innerHTML || '';
  const legacyUploadFileInput = document.createElement('input');
  legacyUploadFileInput.type = 'file';
  legacyUploadFileInput.accept = 'image/*';
  legacyUploadFileInput.hidden = true;
  uploadModal?.appendChild(legacyUploadFileInput);
  let uploadImageDataUrl = '';
  /** @type {{ name: string, size: number, dataUrl: string }[]} */
  let selectedUploadItems = [];
  let uploadCategoryKey = 'daily';
  let uploadCategoryLabel = '일상';
  const usesMultiUploadUi = Boolean(uploadDropZone && uploadSubmitBtn && uploadFileInputEl);
  const COMMUNITY_UPLOAD_MAX_PHOTOS = 12;
  const COMMUNITY_UPLOAD_MAX_PX = 1024;
  const COMMUNITY_UPLOAD_JPEG_QUALITY = 0.72;
  let uploadItemSeq = 0;
  let uploadBusy = false;
  const uploadSubmitDefaultHtml = uploadSubmitBtn?.innerHTML || '사진 올리기';

  function nextUploadItemId() {
    uploadItemSeq += 1;
    return `pick-${Date.now()}-${uploadItemSeq}`;
  }

  function scaleImageDimensions(width, height, maxPx) {
    const w0 = Math.max(1, width || maxPx);
    const h0 = Math.max(1, height || maxPx);
    const scale = Math.min(1, maxPx / Math.max(w0, h0));
    return {
      w: Math.max(1, Math.round(w0 * scale)),
      h: Math.max(1, Math.round(h0 * scale)),
    };
  }

  function loadImageElement(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('IMAGE_DECODE'));
      img.src = src;
    });
  }

  async function compressCommunityImageFromFile(file, options = {}) {
    const maxPx = options.maxPx ?? COMMUNITY_UPLOAD_MAX_PX;
    const quality = options.quality ?? COMMUNITY_UPLOAD_JPEG_QUALITY;
    const blobUrl = URL.createObjectURL(file);
    try {
      const img = await loadImageElement(blobUrl);
      const { w, h } = scaleImageDimensions(img.naturalWidth, img.naturalHeight, maxPx);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('CANVAS');
      ctx.drawImage(img, 0, 0, w, h);
      return canvas.toDataURL('image/jpeg', quality);
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  }

  async function compressCommunityDataUrl(dataUrl, options = {}) {
    const maxPx = options.maxPx ?? COMMUNITY_UPLOAD_MAX_PX;
    const quality = options.quality ?? COMMUNITY_UPLOAD_JPEG_QUALITY;
    const img = await loadImageElement(dataUrl);
    const { w, h } = scaleImageDimensions(img.naturalWidth, img.naturalHeight, maxPx);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('CANVAS');
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL('image/jpeg', quality);
  }

  async function prepareCommunityImageFromFile(file) {
    const attempts = [
      { maxPx: COMMUNITY_UPLOAD_MAX_PX, quality: COMMUNITY_UPLOAD_JPEG_QUALITY },
      { maxPx: 768, quality: 0.64 },
      { maxPx: 640, quality: 0.54 },
      { maxPx: 480, quality: 0.48 },
    ];
    let lastErr = null;
    for (const opts of attempts) {
      try {
        const dataUrl = await compressCommunityImageFromFile(file, opts);
        if (dataUrl) return dataUrl;
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr || new Error('COMPRESS_FAILED');
  }

  function setUploadBusy(busy, label) {
    uploadBusy = busy;
    if (!uploadSubmitBtn) return;
    uploadSubmitBtn.disabled = busy;
    if (busy && label) {
      uploadSubmitBtn.textContent = label;
    } else if (!busy) {
      uploadSubmitBtn.innerHTML = uploadSubmitDefaultHtml;
    }
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

  function resetUploadModalForm() {
    uploadImageDataUrl = '';
    selectedUploadItems = [];
    uploadCategoryKey = 'daily';
    uploadCategoryLabel = '일상';
    if (uploadModalZone) uploadModalZone.innerHTML = uploadDefaultZoneHtml;
    if (uploadPreviewGrid) uploadPreviewGrid.innerHTML = '';
    if (uploadPreviews) uploadPreviews.hidden = true;
    if (uploadPreviewCount) uploadPreviewCount.textContent = '0장 선택됨';
    if (uploadDropZone) uploadDropZone.classList.remove('is-over');
    const resetInput = (el) => {
      if (el) el.value = '';
    };
    resetInput(cameraModelInput || legacyCameraInput);
    resetInput(apertureInput || legacyApertureInput);
    resetInput(shutterSpeedInput || legacyShutterInput);
    resetInput(isoInput || legacyIsoInput);
    resetInput(focalLengthInput || legacyFocalInput);
    resetInput(uploadCaptionInput);
    if (uploadFileInputEl) uploadFileInputEl.value = '';
    legacyUploadFileInput.value = '';
    uploadCategoryChips?.forEach((chip) => {
      const key = chip.dataset.cat || categoryLabelToKey[chip.textContent?.trim() || ''] || '';
      const isDaily = key === 'daily' || chip.textContent?.trim() === '일상';
      chip.classList.toggle('filter-chip--active', isDaily);
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

  function updateUploadPreviewState() {
    const n = selectedUploadItems.length;
    if (uploadPreviews) uploadPreviews.hidden = n === 0;
    if (uploadPreviewCount) {
      uploadPreviewCount.textContent =
        n > 0 ? `${n}장 선택됨 (최대 ${COMMUNITY_UPLOAD_MAX_PHOTOS}장)` : '0장 선택됨';
    }
  }

  function appendUploadPreviewItem(item) {
    if (!uploadPreviewGrid) return;
    const div = document.createElement('div');
    div.className = 'upload-preview-item';
    div.dataset.uploadItemId = item.id;
    div.innerHTML = `<img src="${item.dataUrl}" alt="${escapeHtml(item.name)}">
      <button type="button" class="upload-preview-item__remove" aria-label="제거">×</button>`;
    div.querySelector('button')?.addEventListener('click', () => {
      selectedUploadItems = selectedUploadItems.filter((x) => x.id !== item.id);
      div.remove();
      updateUploadPreviewState();
    });
    uploadPreviewGrid.appendChild(div);
    updateUploadPreviewState();
  }

  async function addUploadFiles(fileList) {
    const incoming = [...fileList].filter((file) => file && file.size > 0);
    if (!incoming.length) return;

    const slotsLeft = COMMUNITY_UPLOAD_MAX_PHOTOS - selectedUploadItems.length;
    if (slotsLeft <= 0) {
      alert(`한 번에 최대 ${COMMUNITY_UPLOAD_MAX_PHOTOS}장까지 올릴 수 있어요.`);
      return;
    }

    const batch = incoming.slice(0, slotsLeft);
    if (incoming.length > batch.length) {
      alert(`최대 ${COMMUNITY_UPLOAD_MAX_PHOTOS}장까지만 선택됩니다. 나머지는 제외했어요.`);
    }

    setUploadBusy(true, '사진 처리 중…');
    try {
      for (const file of batch) {
        try {
          const dataUrl = await prepareCommunityImageFromFile(file);
          const entry = {
            id: nextUploadItemId(),
            name: file.name,
            size: file.size,
            dataUrl,
          };
          selectedUploadItems.push(entry);
          appendUploadPreviewItem(entry);
        } catch (_) {
          alert(`"${file.name}" 파일을 처리하지 못했습니다. 다른 형식(JPG/PNG)으로 시도해 주세요.`);
        }
      }
    } finally {
      setUploadBusy(false);
    }
  }

  function handleUploadImageFile(file) {
    if (!file) return;
    if (file.type && !file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있어요.');
      return;
    }
    prepareCommunityImageFromFile(file)
      .then((dataUrl) => {
        uploadImageDataUrl = dataUrl;
        setUploadPreview(file.name, uploadImageDataUrl);
      })
      .catch(() => {
        alert('이미지를 처리하지 못했습니다. 파일 크기를 줄이거나 JPG/PNG로 시도해 주세요.');
      });
  }

  function getAuthorHandle() {
    let authorNickname = '게스트';
    try {
      const sessionRaw = localStorage.getItem(sessionStorageKey);
      const session = sessionRaw ? JSON.parse(sessionRaw) : null;
      if (session?.nickname) authorNickname = String(session.nickname).trim();
    } catch (_) {
      /* noop */
    }
    return `@${authorNickname || '게스트'}`;
  }

  function buildCommunityCardElement(post) {
    const model = escapeHtml(post.cameraModel || '업로드 이미지');
    const category = escapeHtml(post.categoryLabel || '일상');
    const author = escapeHtml(post.authorHandle || '@게스트');
    const aperture = escapeHtml(post.aperture || '-');
    const shutterSpeed = escapeHtml(post.shutterSpeed || '-');
    const iso = escapeHtml(post.iso || '-');
    const focalLength = escapeHtml(post.focalLength || '-');
    const likes = Number(post.likes) > 0 ? Number(post.likes) : Math.floor(Math.random() * 60) + 1;
    const caption = post.caption ? `<p class="gallery-card__caption">${escapeHtml(post.caption)}</p>` : '';
    const card = document.createElement('article');
    card.className = 'gallery-card card';
    card.dataset.communityTags = String(post.communityTags || 'daily');
    card.dataset.communityPostId = String(post.id || `community-${Date.now()}`);
    card.innerHTML = `
      <div class="gallery-card__img">
        <img class="gallery-card__photo" src="${post.imageDataUrl}" alt="${model} 업로드 이미지" width="1200" height="800" loading="lazy">
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
        ${caption}
        <p class="text-muted" style="margin-top: 8px; font-size: 12px;">카테고리: ${category}</p>
      </div>
    `;
    return card;
  }

  function stripInlineImagesFromPosts(posts) {
    return posts.map((post) => {
      if (!post?.imageKey || !post.imageDataUrl) return post;
      const { imageDataUrl, ...rest } = post;
      return rest;
    });
  }

  async function batchPersistCommunityUploads(posts) {
    if (!posts.length) return;

    const store = window.PicoryCommunityImageStore;
    if (!store) throw new Error('NO_STORE');

    for (const post of posts) {
      const key = String(post.imageKey || post.id || '');
      const src = post.imageDataUrl;
      if (!key || !src) continue;
      await store.put(key, src);
    }

    const metaPosts = posts.map((post) => {
      const key = String(post.imageKey || post.id || '');
      const { imageDataUrl, ...rest } = post;
      return { ...rest, imageKey: key };
    });

    try {
      const archiveRaw = localStorage.getItem(archiveStorageKey);
      const archiveList = archiveRaw ? JSON.parse(archiveRaw) : [];
      metaPosts.forEach((post) => {
        archiveList.push({
          id: `archive-${post.id}`,
          imageKey: post.imageKey || post.id,
          cameraModel: post.cameraModel,
          categoryLabel: post.categoryLabel,
          aperture: post.aperture,
          shutterSpeed: post.shutterSpeed,
          iso: post.iso,
          focalLength: post.focalLength,
          authorHandle: post.authorHandle,
          caption: post.caption || '',
          createdAt: post.createdAt,
        });
      });
      localStorage.setItem(
        archiveStorageKey,
        JSON.stringify(stripInlineImagesFromPosts(archiveList).slice(-60)),
      );
    } catch (_) {
      /* archive is secondary */
    }

    const raw = localStorage.getItem(communityStorageKey);
    let list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) list = [];
    list = await store.migratePosts(list);
    list = stripInlineImagesFromPosts(list);
    const merged = [...list, ...metaPosts];
    const limits = [80, 40, 20];
    let saved = false;
    for (const max of limits) {
      try {
        localStorage.setItem(communityStorageKey, JSON.stringify(merged.slice(-max)));
        saved = true;
        break;
      } catch (_) {
        /* retry with fewer posts */
      }
    }
    if (!saved) throw new Error('QUOTA');
  }

  async function publishCommunityUploads(posts) {
    const activeFilterChip = communityFilters?.querySelector('.filter-chip--active[data-community-filter]');
    const activeFilter = activeFilterChip?.getAttribute('data-community-filter') || 'all';

    const saveAttempts = [
      posts,
      await Promise.all(
        posts.map(async (post) => ({
          ...post,
          imageDataUrl: await compressCommunityDataUrl(post.imageDataUrl, { maxPx: 768, quality: 0.62 }),
        })),
      ),
      await Promise.all(
        posts.map(async (post) => ({
          ...post,
          imageDataUrl: await compressCommunityDataUrl(post.imageDataUrl, { maxPx: 640, quality: 0.52 }),
        })),
      ),
      await Promise.all(
        posts.map(async (post) => ({
          ...post,
          imageDataUrl: await compressCommunityDataUrl(post.imageDataUrl, { maxPx: 480, quality: 0.45 }),
          imageKey: post.imageKey || post.id,
        })),
      ),
    ];

    let savedPosts = null;
    for (const attempt of saveAttempts) {
      try {
        await batchPersistCommunityUploads(attempt);
        savedPosts = attempt.map((post) => {
          const key = String(post.imageKey || post.id || '');
          const { imageDataUrl, ...rest } = post;
          return { ...rest, imageKey: key };
        });
        break;
      } catch (err) {
        console.warn('[community] batch save failed', err);
      }
    }

    if (!savedPosts) {
      throw new Error('QUOTA');
    }

    savedPosts = await Promise.all(
      savedPosts.map(async (post) => ({
        ...post,
        imageDataUrl: window.PicoryCommunityImageStore
          ? await window.PicoryCommunityImageStore.resolvePostImageSrc(post)
          : '',
      })),
    );

    savedPosts
      .slice()
      .reverse()
      .forEach((post) => {
        const card = buildCommunityCardElement(post);
        communityGalleryGrid?.prepend(card);
      });
    enhanceCommunityCards();
    applyCommunityGalleryFilter(activeFilter);
    return savedPosts.length;
  }

  async function freeCommunityStorageForUpload() {
    const store = window.PicoryCommunityImageStore;
    if (!store) return;
    try {
      const raw = localStorage.getItem(communityStorageKey);
      let posts = raw ? JSON.parse(raw) : [];
      if (Array.isArray(posts) && posts.length) {
        posts = stripInlineImagesFromPosts(await store.migratePosts(posts));
        localStorage.setItem(communityStorageKey, JSON.stringify(posts));
      }
    } catch (_) {
      /* noop */
    }
    try {
      const archiveRaw = localStorage.getItem(archiveStorageKey);
      let archive = archiveRaw ? JSON.parse(archiveRaw) : [];
      if (Array.isArray(archive) && archive.length) {
        archive = (await store.migratePosts(archive)).map((item) => {
          if (!item?.imageKey || !item.imageDataUrl) return item;
          const { imageDataUrl, ...rest } = item;
          return rest;
        });
        localStorage.setItem(archiveStorageKey, JSON.stringify(archive));
      }
    } catch (_) {
      /* noop */
    }
  }

  uploadPostBtn?.addEventListener('click', () => {
    resetUploadModalForm();
    freeCommunityStorageForUpload().finally(() => {
      uploadModal?.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });

  closeUploadModal?.addEventListener('click', () => {
    uploadModal?.classList.add('hidden');
    document.body.style.overflow = '';
  });

  uploadModal?.addEventListener('click', (e) => {
    if (e.target === uploadModal) {
      uploadModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });

  uploadCategoryChips?.forEach((chip) => {
    chip.addEventListener('click', () => {
      uploadCategoryChips.forEach((c) => c.classList.remove('filter-chip--active'));
      chip.classList.add('filter-chip--active');
      uploadCategoryLabel = chip.textContent?.trim() || '일상';
      uploadCategoryKey = chip.dataset.cat || categoryLabelToKey[uploadCategoryLabel] || 'daily';
    });
  });

  if (usesMultiUploadUi) {
    uploadDropZone?.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadDropZone.classList.add('is-over');
    });
    uploadDropZone?.addEventListener('dragleave', () => uploadDropZone.classList.remove('is-over'));
    uploadDropZone?.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadDropZone.classList.remove('is-over');
      addUploadFiles(e.dataTransfer?.files || []);
    });
    uploadFileInputEl?.addEventListener('change', () => {
      addUploadFiles(uploadFileInputEl.files || []);
      uploadFileInputEl.value = '';
    });
  } else {
    uploadModalZone?.addEventListener('click', () => legacyUploadFileInput.click());
    uploadModalZone?.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadModalZone.classList.add('dragover');
    });
    uploadModalZone?.addEventListener('dragleave', () => uploadModalZone.classList.remove('dragover'));
    uploadModalZone?.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadModalZone.classList.remove('dragover');
      handleUploadImageFile(e.dataTransfer?.files?.[0]);
    });
    legacyUploadFileInput.addEventListener('change', () => {
      handleUploadImageFile(legacyUploadFileInput.files?.[0]);
    });
  }

  uploadSubmitBtn?.addEventListener('click', async () => {
    if (uploadBusy) return;

    const cameraModel = (cameraModelInput || legacyCameraInput)?.value?.trim();
    if (!cameraModel) {
      alert('카메라 기종을 입력해 주세요.');
      (cameraModelInput || legacyCameraInput)?.focus();
      return;
    }

    const images = usesMultiUploadUi
      ? selectedUploadItems.map((item) => item.dataUrl)
      : uploadImageDataUrl
        ? [uploadImageDataUrl]
        : [];

    if (!images.length) {
      alert('사진을 먼저 업로드해 주세요.');
      return;
    }

    const aperture = (apertureInput || legacyApertureInput)?.value?.trim() || '-';
    const shutterSpeed = (shutterSpeedInput || legacyShutterInput)?.value?.trim() || '-';
    const iso = (isoInput || legacyIsoInput)?.value?.trim() || '-';
    const focalLength = (focalLengthInput || legacyFocalInput)?.value?.trim() || '-';
    const caption = uploadCaptionInput?.value?.trim() || '';
    const authorHandle = getAuthorHandle();
    const createdAt = new Date().toISOString();
    const batchId = Date.now();

    const posts = images.map((imageDataUrl, index) => ({
      id: `community-${batchId}-${index}`,
      imageKey: `community-${batchId}-${index}`,
      imageDataUrl,
      cameraModel,
      categoryLabel: uploadCategoryLabel,
      aperture,
      shutterSpeed,
      iso,
      focalLength,
      authorHandle,
      likes: Math.floor(Math.random() * 60) + 1,
      communityTags: `${uploadCategoryKey} daily`,
      caption,
      createdAt,
    }));

    setUploadBusy(true, `업로드 중… (${posts.length}장)`);
    try {
      const savedCount = await publishCommunityUploads(posts);
      uploadModal?.classList.add('hidden');
      document.body.style.overflow = '';
      resetUploadModalForm();
      addActivityLog(`${cameraModel} 커뮤니티 사진 ${savedCount}장을 업로드했어요.`);
      alert(`커뮤니티에 사진 ${savedCount}장이 업로드됐어요.`);
    } catch (_) {
      alert(
        '사진 저장에 실패했습니다. 브라우저 저장 공간이 부족할 수 있어요. 장 수를 줄이거나 이전 업로드를 삭제한 뒤 다시 시도해 주세요.',
      );
    } finally {
      setUploadBusy(false);
    }
  });

  // ===== Community gallery filters (data-community-filter + data-community-tags) =====

  async function renderPersistedCommunityPosts() {
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

    const store = window.PicoryCommunityImageStore;
    if (store) {
      posts = await store.migratePosts(posts);
      posts = stripInlineImagesFromPosts(posts);
      try {
        localStorage.setItem(communityStorageKey, JSON.stringify(posts));
      } catch (_) {
        /* noop */
      }
    }

    for (const post of posts.slice().reverse()) {
      const imageDataUrl = store
        ? await store.resolvePostImageSrc(post)
        : String(post.imageDataUrl || post.imageThumb || '');
      const card = buildCommunityCardElement({
        ...post,
        imageDataUrl,
      });
      communityGalleryGrid.prepend(card);
    }
  }

  function readJsonList(key) {
    try {
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (_) {
      return [];
    }
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/"/g, '&quot;');
  }

  function writeJsonList(key, list, maxItems = 160) {
    try {
      localStorage.setItem(key, JSON.stringify(list.slice(-maxItems)));
    } catch (_) {
      /* noop */
    }
  }

  function getCommunityUser() {
    try {
      const raw = localStorage.getItem(sessionStorageKey);
      const session = raw ? JSON.parse(raw) : null;
      if (session?.id || session?.nickname) {
        return {
          id: String(session.id || session.nickname || 'member'),
          nickname: String(session.nickname || session.id || '회원'),
        };
      }
    } catch (_) {
      /* noop */
    }
    return { id: 'guest', nickname: '게스트' };
  }

  function communityPostFromCard(card) {
    const img = card.querySelector('.gallery-card__photo');
    const cameraModel = card.querySelector('.gallery-card__camera-tag')?.textContent?.trim() || '커뮤니티 사진';
    const authorHandle = card.querySelector('.gallery-card__author')?.textContent?.trim() || '@guest';
    return {
      postId: card.dataset.communityPostId || '',
      imageSrc: img?.getAttribute('src') || '',
      imageAlt: img?.getAttribute('alt') || cameraModel,
      cameraModel,
      authorHandle,
    };
  }

  function formatCommunityTime(isoString) {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
  }

  function ensureCommunityPostIds() {
    if (!communityGalleryGrid) return;
    communityGalleryGrid.querySelectorAll('.gallery-card').forEach((card, index) => {
      if (card.dataset.communityPostId) return;
      const imgSrc = card.querySelector('.gallery-card__photo')?.getAttribute('src') || '';
      const camera = card.querySelector('.gallery-card__camera-tag')?.textContent?.trim() || `post-${index}`;
      const stable = `${camera}-${imgSrc || index}`.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/^-|-$/g, '');
      card.dataset.communityPostId = `static-${stable || index}`;
    });
  }

  function renderCommunityCommentsForCard(card) {
    const postId = card.dataset.communityPostId;
    const listEl = card.querySelector('.gallery-card__comment-list');
    if (!postId || !listEl) return;
    renderCommunityComments(postId, listEl);
  }

  function renderCommunityComments(postId, listEl) {
    if (!postId || !listEl) return;
    const comments = readJsonList(communityCommentsStorageKey)
      .filter((item) => item?.postId === postId)
      .slice(-20);
    if (!comments.length) {
      listEl.innerHTML = '<p class="gallery-card__comment-empty">아직 댓글이 없어요.</p>';
      return;
    }
    listEl.innerHTML = comments
      .map((item) => `
        <article class="gallery-card__comment">
          <strong>@${escapeHtml(item.nickname || '게스트')}</strong>
          <span>${escapeHtml(item.text || '')}</span>
        </article>
      `)
      .join('');
  }

  function communityCommentCount(postId) {
    if (!postId) return 0;
    return readJsonList(communityCommentsStorageKey).filter((item) => item?.postId === postId).length;
  }

  function renderCommunityCommentCount(card) {
    const countEl = card.querySelector('[data-comment-count]');
    if (!countEl) return;
    countEl.textContent = String(communityCommentCount(card.dataset.communityPostId));
  }

  function renderCommunityLikeState(card) {
    const likeBtn = card.querySelector('.gallery-card__like-btn');
    if (!likeBtn) return;
    const user = getCommunityUser();
    const postId = card.dataset.communityPostId;
    const baseLikes = Number(likeBtn.dataset.baseLikes || '0') || 0;
    const liked = readJsonList(communityLikesStorageKey).some((item) => item?.postId === postId && item?.userId === user.id);
    likeBtn.classList.toggle('is-liked', liked);
    likeBtn.setAttribute('aria-pressed', liked ? 'true' : 'false');
    const countEl = likeBtn.querySelector('[data-like-count]');
    if (countEl) countEl.textContent = String(baseLikes + (liked ? 1 : 0));
  }

  function enhanceCommunityCards() {
    if (!communityGalleryGrid) return;
    ensureCommunityPostIds();
    communityGalleryGrid.querySelectorAll('.gallery-card').forEach((card) => {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', '커뮤니티 게시물 자세히 보기');
      const likesEl = card.querySelector('.gallery-card__likes');
      if (likesEl && !likesEl.classList.contains('gallery-card__like-btn')) {
        const count = parseInt(likesEl.textContent.replace(/[^0-9]/g, ''), 10) || 0;
        likesEl.outerHTML = `
          <span class="gallery-card__actions">
            <button type="button" class="gallery-card__likes gallery-card__like-btn" data-base-likes="${count}" aria-pressed="false" aria-label="좋아요">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <span data-like-count>${count}</span>
            </button>
            <span class="gallery-card__comments-count" aria-label="댓글 수">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>
              <span data-comment-count>0</span>
            </span>
          </span>
        `;
      }

      card.querySelector('.gallery-card__comments')?.remove();
      renderCommunityLikeState(card);
      renderCommunityCommentCount(card);
    });
  }

  function syncCommunityPostState(postId) {
    if (!postId) return;
    const sourceCard = communityGalleryGrid?.querySelector(`.gallery-card[data-community-post-id="${CSS.escape(postId)}"]`);
    if (sourceCard) {
      renderCommunityLikeState(sourceCard);
      renderCommunityCommentCount(sourceCard);
    }
    const modalCard = document.querySelector(`.community-post-modal .gallery-card[data-community-post-id="${CSS.escape(postId)}"]`);
    if (modalCard) {
      renderCommunityLikeState(modalCard);
      renderCommunityComments(postId, modalCard.querySelector('.gallery-card__comment-list'));
    }
  }

  function toggleCommunityLike(card) {
    if (!card) return;
    const user = getCommunityUser();
    const post = communityPostFromCard(card);
    let likes = readJsonList(communityLikesStorageKey);
    const existingIndex = likes.findIndex((item) => item?.postId === post.postId && item?.userId === user.id);
    if (existingIndex >= 0) {
      likes.splice(existingIndex, 1);
      addActivityLog(`${post.cameraModel} 커뮤니티 사진 좋아요를 취소했어요.`);
    } else {
      likes.push({
        ...post,
        userId: user.id,
        nickname: user.nickname,
        likedAt: new Date().toISOString(),
      });
      addActivityLog(`${post.cameraModel} 커뮤니티 사진을 좋아요 했어요.`);
    }
    writeJsonList(communityLikesStorageKey, likes);
    syncCommunityPostState(post.postId);
  }

  function ensureCommunityPostModal() {
    let modal = document.getElementById('communityPostModal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'communityPostModal';
    modal.className = 'community-post-modal';
    modal.hidden = true;
    modal.innerHTML = `
      <div class="community-post-modal__backdrop" data-community-modal-close></div>
      <article class="community-post-modal__card" role="dialog" aria-modal="true" aria-label="커뮤니티 게시물">
        <button type="button" class="community-post-modal__close" data-community-modal-close aria-label="닫기">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div class="community-post-modal__body"></div>
      </article>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (event) => {
      if (event.target.closest('[data-community-modal-close]')) {
        modal.hidden = true;
      }
      const likeBtn = event.target.closest('.gallery-card__like-btn');
      if (likeBtn) {
        const card = likeBtn.closest('.gallery-card');
        toggleCommunityLike(card);
      }
    });
    modal.addEventListener('submit', (event) => {
      const form = event.target.closest('.gallery-card__comment-form');
      if (!form) return;
      event.preventDefault();
      const card = form.closest('.gallery-card');
      const input = form.querySelector('.gallery-card__comment-input');
      const text = String(input?.value || '').trim();
      if (!card || !text) return;
      const user = getCommunityUser();
      const post = communityPostFromCard(card);
      const comments = readJsonList(communityCommentsStorageKey);
      comments.push({
        id: `comment-${Date.now()}`,
        ...post,
        text,
        userId: user.id,
        nickname: user.nickname,
        createdAt: new Date().toISOString(),
      });
      writeJsonList(communityCommentsStorageKey, comments, 240);
      input.value = '';
      syncCommunityPostState(post.postId);
      addActivityLog(`${post.cameraModel} 커뮤니티 사진에 댓글을 남겼어요.`);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') modal.hidden = true;
    });
    return modal;
  }

  function openCommunityPostModal(sourceCard) {
    if (!sourceCard) return;
    const modal = ensureCommunityPostModal();
    const body = modal.querySelector('.community-post-modal__body');
    const post = communityPostFromCard(sourceCard);
    const settingsHtml = sourceCard.querySelector('.gallery-card__settings')?.innerHTML || '';
    const baseLikes = sourceCard.querySelector('.gallery-card__like-btn')?.dataset.baseLikes || '0';
    body.innerHTML = `
      <div class="gallery-card card" data-community-post-id="${escapeAttr(post.postId)}">
        <div class="gallery-card__img">
          <img class="gallery-card__photo" src="${escapeAttr(post.imageSrc)}" alt="${escapeAttr(post.imageAlt)}">
          <div class="gallery-card__overlay">
            <span class="gallery-card__camera-tag">${escapeHtml(post.cameraModel)}</span>
          </div>
        </div>
        <div class="gallery-card__info">
          <div class="gallery-card__settings" aria-label="촬영 설정">${settingsHtml}</div>
          <div class="gallery-card__meta">
            <span class="gallery-card__author">${escapeHtml(post.authorHandle)}</span>
            <button type="button" class="gallery-card__likes gallery-card__like-btn" data-base-likes="${escapeAttr(baseLikes)}" aria-pressed="false">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <span data-like-count>${escapeHtml(baseLikes)}</span>
            </button>
          </div>
          <div class="gallery-card__comments">
            <h4>댓글</h4>
            <div class="gallery-card__comment-list" aria-live="polite"></div>
            <form class="gallery-card__comment-form">
              <input type="text" class="gallery-card__comment-input" placeholder="댓글을 남겨보세요" aria-label="댓글 입력">
              <button type="submit">등록</button>
            </form>
          </div>
        </div>
      </div>
    `;
    modal.hidden = false;
    syncCommunityPostState(post.postId);
    setTimeout(() => body.querySelector('.gallery-card__comment-input')?.focus(), 0);
  }

  communityGalleryGrid?.addEventListener('click', (event) => {
    const likeBtn = event.target.closest('.gallery-card__like-btn');
    if (likeBtn) {
      event.preventDefault();
      event.stopPropagation();
      toggleCommunityLike(likeBtn.closest('.gallery-card'));
      return;
    }
    if (event.target.closest('.gallery-card__camera-tag')) return;
    const card = event.target.closest('.gallery-card');
    if (card) openCommunityPostModal(card);
  });

  communityGalleryGrid?.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const card = event.target.closest('.gallery-card');
    if (!card || event.target.closest('.gallery-card__like-btn, .gallery-card__camera-tag')) return;
    event.preventDefault();
    openCommunityPostModal(card);
  });

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

  renderPersistedCommunityPosts().then(() => {
    enhanceCommunityCards();
    applyCommunityGalleryFilter('all');
  });

  // ===== Mobile Hamburger Menu =====
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburgerBtn?.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
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

  document.addEventListener('click', (e) => {
    const productLink = e.target.closest(
      '.product-card__thumb-link, .product-card__action-btn'
    );
    if (productLink) {
      const card = productLink.closest('.product-card');
      const brand = card?.querySelector('.product-card__brand')?.textContent?.trim() || '';
      const model = card?.querySelector('.product-card__model')?.textContent?.trim() || '';
      const cameraName = `${brand} ${model}`.trim();
      if (cameraName) pushRecentCamera(cameraName, '클릭', cameraName);
      return;
    }

    const recommendLink = e.target.closest('.recommend-card__actions a.btn--primary');
    if (recommendLink) {
      const card = recommendLink.closest('.recommend-card');
      const cameraName = card?.querySelector('.recommend-card__name')?.textContent?.trim() || '';
      if (cameraName) pushRecentCamera(cameraName, '클릭', cameraName);
    }
  });

});

/* ===== Viewfinder spotlight (follow: all pages · shutter click: home only) ===== */
(function initPicorySpotlight() {
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

  function boot() {
    const spotlight = createSpotlight();
    document.getElementById('homeSpotlightIris')?.remove();
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
        if (!active) show();
        active = true;
        paintGlow(e.clientX, e.clientY);
      },
      { passive: true },
    );

    document.documentElement.addEventListener('mouseleave', hide, { passive: true });
    window.addEventListener('blur', hide);

    let audioCtx = null;

    const playShutterClick = () => {
      if (prefersReducedMotion()) return;
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.exponentialRampToValueAtTime(180, t + 0.07);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.06, t + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.1);
      } catch (_) {
        /* optional sound */
      }
    };

    const triggerShutter = (x, y) => {
      if (shutterLock) return;
      shutterLock = true;
      paintGlow(x, y);
      if (!active) show();
      active = true;

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
      playShutterClick();

      window.setTimeout(() => {
        flash.remove();
        finder?.classList.remove('is-snapping');
        spotlight.classList.remove('is-shutter-pulse');
        shutterLock = false;
      }, 320);
    };

    const onShutterPointer = (e) => {
      if (e.button !== 0) return;
      if (!isHomePage()) return;
      if (!isInZone(e.clientX, e.clientY)) return;
      triggerShutter(e.clientX, e.clientY);
    };

    document.addEventListener('pointerdown', onShutterPointer, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
