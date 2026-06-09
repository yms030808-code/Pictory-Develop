/**
 * 다크 테마 고정 (라이트 모드 비활성)
 */
(function picoryTheme() {
  const STORAGE_KEY = 'picory-theme';

  function applyDarkTheme() {
    document.documentElement.setAttribute('data-theme', 'dark');
    try {
      localStorage.setItem(STORAGE_KEY, 'dark');
    } catch (_) {
      /* ignore */
    }
  }

  applyDarkTheme();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyDarkTheme);
  }
})();
