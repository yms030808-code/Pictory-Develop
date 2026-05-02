(function () {
  'use strict';
  const KEY = 'picory-compare-v1';
  const MAX = 3;
  let items = [];

  function load() { try { items = JSON.parse(localStorage.getItem(KEY)) || []; } catch { items = []; } items = items.slice(0, MAX); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {} }

  function has(id) { return items.some(c => c.id === id); }
  function getItems() { return [...items]; }

  function add(cam) {
    if (items.length >= MAX || has(cam.id)) return false;
    items.push(cam);
    save(); render(); return true;
  }

  function remove(id) {
    items = items.filter(c => c.id !== id);
    save(); render();
  }

  function openDrawer() {
    document.getElementById('pcmpDrawer').classList.add('is-open');
    document.getElementById('pcmpOverlay').classList.add('is-open');
  }

  function closeDrawer() {
    document.getElementById('pcmpDrawer').classList.remove('is-open');
    document.getElementById('pcmpOverlay').classList.remove('is-open');
  }

  function render() {
    const badge = document.getElementById('pcmpBadge');
    const list = document.getElementById('pcmpList');
    const goBtn = document.getElementById('pcmpGo');
    const countEl = document.getElementById('pcmpCount');

    if (!badge) return;

    const count = items.length;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
    if (countEl) countEl.textContent = count;

    list.innerHTML = items.map(cam => `
      <div class="pcmp-item">
        <div class="pcmp-item__thumb">
          <img src="${cam.thumbnail || ''}" alt="${cam.model || ''}" onerror="this.style.display='none'">
        </div>
        <div class="pcmp-item__info">
          <span class="pcmp-item__model">${cam.brand || ''} ${cam.model || ''}</span>
          <span class="pcmp-item__price">${cam.priceSummary || ''}</span>
        </div>
        <button class="pcmp-item__remove" data-cid="${cam.id}" aria-label="제거" type="button">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    `).join('') || '<p class="pcmp-empty">아직 담은 카메라가 없어요.<br><small>카메라 카드의 [+ 비교함 담기]를 눌러보세요.</small></p>';

    list.querySelectorAll('.pcmp-item__remove').forEach(btn => {
      btn.addEventListener('click', () => remove(btn.dataset.cid));
    });

    if (goBtn) {
      goBtn.disabled = count < 2;
      goBtn.onclick = () => {
        const ids = items.map(c => c.id).join(',');
        window.location.href = 'products.html?compare=' + ids;
      };
    }
  }

  function inject() {
    const html = `
      <button id="pcmpFloatBtn" class="pcmp-float" aria-label="비교함 열기" type="button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        <span id="pcmpBadge" class="pcmp-float__badge" style="display:none">0</span>
      </button>
      <div id="pcmpOverlay" class="pcmp-overlay"></div>
      <aside id="pcmpDrawer" class="pcmp-drawer" aria-label="비교함">
        <div class="pcmp-drawer__hd">
          <div>
            <span class="pcmp-drawer__title">비교함</span>
            <span class="pcmp-drawer__sub"><span id="pcmpCount">0</span>/3개</span>
          </div>
          <button id="pcmpClose" class="pcmp-drawer__close" aria-label="닫기" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div id="pcmpList" class="pcmp-drawer__list"></div>
        <div class="pcmp-drawer__ft">
          <button id="pcmpGo" class="btn btn--primary" style="width:100%" disabled type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            비교하기 (2개 이상 선택)
          </button>
        </div>
      </aside>
    `;
    document.body.insertAdjacentHTML('beforeend', html);

    document.getElementById('pcmpFloatBtn').addEventListener('click', openDrawer);
    document.getElementById('pcmpClose').addEventListener('click', closeDrawer);
    document.getElementById('pcmpOverlay').addEventListener('click', closeDrawer);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    inject();
    load();
    render();
  });

  window.PicoryCompare = { add, remove, has, getItems };
})();
