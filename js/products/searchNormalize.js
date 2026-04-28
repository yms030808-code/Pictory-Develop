/**
 * 한글·영문 혼용 검색 정규화 (브랜드 한글명 → 영문 등)
 */

const KOREAN_BRANDS = {
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

/**
 * @param {string} s
 */
export function normalizeSearchQuery(s) {
  let t = String(s || '')
    .trim()
    .toLowerCase();
  if (!t) return '';
  for (const [ko, en] of Object.entries(KOREAN_BRANDS)) {
    if (t.includes(ko)) t = t.split(ko).join(en);
  }
  /* X100V 검색 시 카탈로그 X100VI와 매칭 */
  if (/\bx100v\b/i.test(t) && !/x100vi/.test(t)) {
    t = t.replace(/\bx100v\b/g, 'x100vi');
  }
  return t.replace(/\s+/g, ' ').trim();
}

/**
 * @param {string} s
 */
export function compactAlnum(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, '');
}

/**
 * @param {{ brand: string, model: string, id?: string }} product
 * @param {string} rawQuery
 */
export function productMatchesQuery(product, rawQuery) {
  const q = normalizeSearchQuery(rawQuery);
  if (!q) return true;
  const full = normalizeSearchQuery(`${product.brand || ''} ${product.model || ''} ${product.id || ''}`);
  const parts = q.split(/\s+/).filter(Boolean);
  const fullCompact = compactAlnum(full);
  return parts.every((w) => {
    if (full.includes(w)) return true;
    const wc = compactAlnum(w);
    return wc.length >= 2 && fullCompact.includes(wc);
  });
}
