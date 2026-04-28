/**
 * 첫 페인트 전: 클릭으로 숨긴 배지 상태(sessionStorage) 반영, 깜빡임 방지
 * 새로고침(F5) 시에만 초기화 — 탭을 닫기 전까지는 유지
 */
(function () {
  var STORAGE_KEY = 'picoryNavBadgesDismissed';
  var nav = typeof performance !== 'undefined' && performance.getEntriesByType
    ? performance.getEntriesByType('navigation')[0]
    : null;
  var isReload = nav && nav.type === 'reload';
  if (!isReload && typeof performance !== 'undefined' && performance.navigation) {
    isReload = performance.navigation.type === 1;
  }
  if (isReload) {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  var dismissed = {};
  try {
    dismissed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
  } catch (e) {}

  var css = [];
  ['recommend', 'price', 'checklist', 'community'].forEach(function (k) {
    if (dismissed[k]) {
      css.push('[data-nav-badge="' + k + '"] .nav__link-badge{display:none!important}');
    }
  });
  if (!css.length) return;

  var style = document.createElement('style');
  style.id = 'picory-nav-badge-prehide';
  style.textContent = css.join('');
  document.head.appendChild(style);
})();
