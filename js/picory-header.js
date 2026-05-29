/**
 * Canonical site header (from index.html) — keeps nav + mobile menu identical on all pages.
 */
(function () {
  const NAV_INNER = `
    <a href="index.html" class="nav__logo">
      <img class="nav__logo-image" src="images/pictory-logo-mark.png" alt="Pictory">
    </a>
    <ul class="nav__menu">
      <li><a href="products.html" class="nav__link" data-nav-href="products.html">상품</a></li>
      <li><a href="glossary.html" class="nav__link" data-nav-href="glossary.html">용어 사전</a></li>
      <li><a href="community.html" class="nav__link" data-nav-badge="community" data-nav-href="community.html">커뮤니티<span class="nav__link-badge" aria-hidden="true"></span></a></li>
    </ul>
    <label class="nav__search" aria-label="검색">
      <span class="pictory-icon" data-pictory-icon="search" aria-hidden="true"></span>
      <input type="search" placeholder="상품, 브랜드 검색">
    </label>
    <div class="nav__actions">
      <button class="btn btn--ghost btn--sm" id="bookmarkBtn" type="button">
        <span class="pictory-icon pictory-icon--sm" data-pictory-icon="favorite" aria-hidden="true"></span>
        북마크
      </button>
      <a href="auth.html" class="btn btn--primary btn--sm">로그인</a>
    </div>
    <button class="nav__hamburger" id="hamburgerBtn" aria-label="메뉴 열기">
      <span></span><span></span><span></span>
    </button>
  `;

  const MOBILE_MENU = `
    <ul class="mobile-menu__list">
      <li><a href="products.html" class="mobile-menu__link">상품</a></li>
      <li><a href="community.html" class="mobile-menu__link" data-nav-badge="community">커뮤니티<span class="nav__link-badge" aria-hidden="true"></span></a></li>
    </ul>
  `;

  const ACTIVE_MAP = {
    'index.html': null,
    'products.html': 'products.html',
    'glossary.html': 'glossary.html',
    'community.html': 'community.html',
    'search.html': null,
    'match.html': null,
    'price.html': null,
    'recommend.html': null,
    'compare.html': null,
    'mypage.html': null,
    'auth.html': null,
    'local-links.html': null,
  };

  function currentPage() {
    const path = window.location.pathname.split('/').pop();
    return path || 'index.html';
  }

  function applyActiveNav(nav) {
    const page = currentPage();
    const activeHref = ACTIVE_MAP[page];
    nav.querySelectorAll('.nav__link').forEach((link) => {
      link.classList.remove('nav__link--active');
      if (activeHref && link.getAttribute('data-nav-href') === activeHref) {
        link.classList.add('nav__link--active');
      }
    });
  }

  function bindMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!hamburgerBtn || !mobileMenu || hamburgerBtn.dataset.picoryHeaderBound === '1') return;
    hamburgerBtn.dataset.picoryHeaderBound = '1';

    hamburgerBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('.mobile-menu__link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }

  function mount() {
    if (document.body?.dataset?.picorySkipHeader === 'true') return;

    const nav = document.querySelector('nav.nav');
    if (!nav) return;

    const inner = nav.querySelector('.nav__inner');
    if (inner) {
      inner.innerHTML = NAV_INNER.trim();
    }

    applyActiveNav(nav);

    let mobileMenu = document.getElementById('mobileMenu');
    if (!mobileMenu) {
      mobileMenu = document.createElement('div');
      mobileMenu.className = 'mobile-menu';
      mobileMenu.id = 'mobileMenu';
      nav.insertAdjacentElement('afterend', mobileMenu);
    }
    mobileMenu.innerHTML = MOBILE_MENU.trim();

    if (typeof PictoryIcons !== 'undefined') {
      PictoryIcons.mount(nav);
      PictoryIcons.mount(mobileMenu);
    }

    bindMobileMenu();
    document.dispatchEvent(new CustomEvent('picory:header-ready'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  window.PicoryHeader = { mount, NAV_INNER, MOBILE_MENU };
})();
