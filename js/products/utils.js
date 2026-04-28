export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text == null ? '' : String(text);
  return div.innerHTML;
}

export function escapeAttr(text) {
  return String(text == null ? '' : text)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;');
}

/**
 * 정적 배포 시 저장소 하위 경로(username.github.io/저장소이름/)에서도 동작하도록
 * /images/... 절대경로 대신 페이지 기준 상대경로로 만듦. /m/ 페이지는 ../ 접두.
 * @param {string} path images/cameras/foo.png 또는 /images/...
 */
export function assetUrl(path) {
  if (!path) return '';
  const clean = String(path).replace(/^\//, '');
  if (typeof window !== 'undefined' && window.location.pathname.includes('/m/')) {
    return `../${clean}`;
  }
  return clean;
}

/** 상품 카드에서 시세 페이지 등으로 갈 때 /m/ 여부에 따라 링크 접두 */
export function pageRelative(filename) {
  if (typeof window !== 'undefined' && window.location.pathname.includes('/m/')) {
    return `../${filename}`;
  }
  return filename;
}
