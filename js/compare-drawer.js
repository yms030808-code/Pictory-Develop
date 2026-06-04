(function () {
  'use strict';
  const KEY = 'picory-compare-v1';
  const SESSION_KEY = 'picoryAuthSession';
  let items = [];

  function load() { try { items = JSON.parse(localStorage.getItem(KEY)) || []; } catch { items = []; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {} }

  function nid(id) {
    return String(id == null ? '' : id);
  }

  function has(id) {
    const x = nid(id);
    return items.some((c) => nid(c.id) === x);
  }
  function getItems() { return [...items]; }

  function add(cam) {
    if (has(cam.id)) return false;
    items.push(cam);
    save();
    render();
    showCompareAddedPrompt();
    return true;
  }

  function emitCompareUpdated() {
    try {
      /* document에 건 리스너(상품 탭 등)가 받으려면 document로 디스패치해야 함(window만 쏘면 document 리스너에 안 들어감) */
      document.dispatchEvent(new CustomEvent('picory-compare-updated', { bubbles: true }));
    } catch (_) {}
  }

  function remove(id) {
    const x = nid(id);
    items = items.filter((c) => nid(c.id) !== x);
    save(); render();
  }

  function openDrawer() {
    document.getElementById('pcmpDrawer').classList.add('is-open');
    document.getElementById('pcmpOverlay').classList.add('is-open');
  }

  function isDrawerOpen() {
    return Boolean(document.getElementById('pcmpDrawer')?.classList.contains('is-open'));
  }

  function isConfirmOpen() {
    return Boolean(document.getElementById('pcmpConfirm')?.classList.contains('is-open'));
  }

  function closeDrawer() {
    document.getElementById('pcmpDrawer')?.classList.remove('is-open');
    document.getElementById('pcmpOverlay')?.classList.remove('is-open');
  }

  /** ESC 등 — 확인창·드로어가 열려 있으면 닫고 true */
  function closeDrawerIfOpen() {
    if (isConfirmOpen()) {
      closeAddedPrompt();
      return true;
    }
    if (isDrawerOpen()) {
      closeDrawer();
      return true;
    }
    return false;
  }

  function startFloatGlow() {
    const btn = document.getElementById('pcmpFloatBtn');
    if (!btn) return;
    btn.classList.remove('pcmp-float--glow');
    void btn.offsetWidth;
    btn.classList.add('pcmp-float--glow');
  }

  function closeAddedPrompt() {
    document.getElementById('pcmpConfirm')?.classList.remove('is-open');
  }

  function isLoggedIn() {
    return Boolean(localStorage.getItem(SESSION_KEY));
  }

  function requireLoginForLargeCompare() {
    if (items.length < 3 || isLoggedIn()) return true;
    alert('카메라 3대 이상 비교는 로그인 후 이용할 수 있어요. 로그인 페이지로 이동합니다.');
    window.location.href = window.PicoryAuthReturn?.buildAuthUrl?.('compare') || 'auth.html?needLogin=compare';
    return false;
  }

  function showCompareAddedPrompt() {
    const confirmEl = document.getElementById('pcmpConfirm');
    if (!confirmEl) {
      if (window.confirm('비교함에 추가되었습니다. 비교 시작하시겠습니까?')) startFloatGlow();
      return;
    }
    confirmEl.classList.add('is-open');
  }

  function renderSlot(cam, index) {
    if (cam) {
      return `
        <div class="pcmp-slot pcmp-slot--filled">
          <div class="pcmp-slot__thumb">
            <img src="${cam.thumbnail || ''}" alt="${cam.model || ''}" onerror="this.style.display='none'">
          </div>
          <div class="pcmp-slot__info">
            <span class="pcmp-slot__brand">${cam.brand || ''}</span>
            <span class="pcmp-slot__model">${cam.model || ''}</span>
          </div>
          <button class="pcmp-slot__remove" data-cid="${cam.id}" aria-label="${cam.model} 제거" type="button">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>`;
    }
    return `
      <div class="pcmp-slot pcmp-slot--empty">
        <div class="pcmp-slot__placeholder">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          <span>카메라 추가</span>
        </div>
      </div>`;
  }

  function render() {
    const badge = document.getElementById('pcmpBadge');
    const slots = document.getElementById('pcmpSlots');
    const goBtn = document.getElementById('pcmpGo');
    const countEl = document.getElementById('pcmpCount');

    try {
      if (!badge) return;

      const count = items.length;
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
      if (countEl) countEl.textContent = count;

      if (slots) {
        const slotsToRender = items.length ? items : [null, null, null];
        slots.innerHTML = slotsToRender.map((item, i) => renderSlot(item, i)).join('');
        slots.querySelectorAll('.pcmp-slot__remove').forEach(btn => {
          btn.addEventListener('click', () => remove(nid(btn.getAttribute('data-cid'))));
        });
      }

      if (goBtn) {
        goBtn.disabled = count < 2;
        goBtn.onclick = () => {
          if (!requireLoginForLargeCompare()) return;
          const ids = items.map(c => c.id).join(',');
          window.location.href = 'compare.html?ids=' + ids;
        };
      }
    } finally {
      emitCompareUpdated();
    }
  }

  function inject() {
    const html = `
      <button id="pcmpFloatBtn" class="pcmp-float" aria-label="비교함 열기" type="button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        <span class="pcmp-float__label">비교함</span>
        <span id="pcmpBadge" class="pcmp-float__badge" style="display:none">0</span>
      </button>
      <div id="pcmpConfirm" class="pcmp-confirm" role="dialog" aria-modal="false" aria-label="비교함 추가 확인">
        <p class="pcmp-confirm__text">비교함에 추가되었습니다. 비교 시작하시겠습니까?</p>
        <div class="pcmp-confirm__actions">
          <button id="pcmpConfirmYes" class="pcmp-confirm__btn pcmp-confirm__btn--yes" type="button">예</button>
          <button id="pcmpConfirmNo" class="pcmp-confirm__btn" type="button">나중에 할게요</button>
        </div>
      </div>
      <div id="pcmpOverlay" class="pcmp-overlay"></div>
      <aside id="pcmpDrawer" class="pcmp-drawer" aria-label="비교함">
        <div class="pcmp-drawer__hd">
          <div>
            <span class="pcmp-drawer__title">비교함</span>
            <span class="pcmp-drawer__sub"><span id="pcmpCount">0</span>개 선택됨</span>
          </div>
          <button id="pcmpClose" class="pcmp-drawer__close" aria-label="닫기" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div id="pcmpSlots" class="pcmp-slots"></div>
        <div class="pcmp-drawer__ft">
          <button id="pcmpGo" class="btn btn--primary" style="width:100%" disabled type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            비교하기
          </button>
        </div>
      </aside>
    `;
    document.body.insertAdjacentHTML('beforeend', html);

    document.getElementById('pcmpFloatBtn').addEventListener('click', () => {
      document.getElementById('pcmpFloatBtn')?.classList.remove('pcmp-float--glow');
      openDrawer();
    });
    document.getElementById('pcmpClose').addEventListener('click', closeDrawer);
    document.getElementById('pcmpOverlay').addEventListener('click', closeDrawer);
    document.getElementById('pcmpConfirmYes').addEventListener('click', () => {
      closeAddedPrompt();
      startFloatGlow();
    });
    document.getElementById('pcmpConfirmNo').addEventListener('click', closeAddedPrompt);
    document.addEventListener(
      'keydown',
      (e) => {
        if (e.key !== 'Escape') return;
        if (closeDrawerIfOpen()) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true,
    );
  }

  document.addEventListener('DOMContentLoaded', function () {
    inject();
    load();
    render();
  });

  window.PicoryCompare = {
    add,
    remove,
    has,
    getItems,
    openDrawer,
    closeDrawer,
    closeDrawerIfOpen,
  };
})();
