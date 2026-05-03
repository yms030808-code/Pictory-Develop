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

    if (!badge) return;

    const count = items.length;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
    if (countEl) countEl.textContent = count;

    if (slots) {
      slots.innerHTML = [0, 1, 2].map(i => renderSlot(items[i], i)).join('');
      slots.querySelectorAll('.pcmp-slot__remove').forEach(btn => {
        btn.addEventListener('click', () => remove(btn.dataset.cid));
      });
    }

    if (goBtn) {
      goBtn.disabled = count < 2;
      goBtn.onclick = () => {
        const ids = items.map(c => c.id).join(',');
        window.location.href = 'compare.html?ids=' + ids;
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
