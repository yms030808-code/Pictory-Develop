import { escapeHtml, escapeAttr, assetUrl, pageRelative } from './utils.js';

/** 썸네일 로드 실패 시 (mockData·렌더 시 assetUrl로 해석) */
export const CAMERA_THUMB_FALLBACK = '/images/cameras/default-camera.png';

function splitPriceSummary(priceSummary) {
  const raw = (priceSummary || '').trim();
  const sep = raw.indexOf(' · ');
  if (sep === -1) return { price: raw, note: '' };
  return {
    price: raw.slice(0, sep).trim(),
    note: raw.slice(sep + 3).trim(),
  };
}

/**
 * 단일 상품 카드 마크업
 */
export function renderProductCardHTML(product) {
  const thumb = assetUrl(product.thumbnail || CAMERA_THUMB_FALLBACK);
  const alt = `${product.brand || ''} ${product.model || ''}`.trim();
  const searchQ = `${product.brand || ''} ${product.model || ''}`.trim();
  const priceHref = `${pageRelative('price.html')}?q=${encodeURIComponent(searchQ)}`;
  const ariaLabel = `${alt} — 상세 페이지로 이동`;
  const { price, note } = splitPriceSummary(product.priceSummary);

  return `
    <div class="product-card product-item" data-product-id="${escapeAttr(product.id)}">
      <button type="button" class="bookmark-add product-card__bookmark" aria-label="북마크 추가">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
      </button>
      <div class="product-card__body">
        <div class="product-card__header">
          <span class="product-card__brand">${escapeHtml(product.brand)}</span>
          <h3 class="product-card__model">${escapeHtml(product.model)}</h3>
        </div>
        <div class="product-card__stack">
        <a class="product-card__thumb-link" href="${escapeAttr(priceHref)}" aria-label="${escapeAttr(ariaLabel)}">
          <div class="product-card__thumb product-card__thumb--slot">
            <img
              class="product-card__img"
              src="${escapeAttr(thumb)}"
              alt=""
              loading="lazy"
              decoding="async"
              data-fallback="${escapeAttr(assetUrl(CAMERA_THUMB_FALLBACK))}"
            >
          </div>
        </a>
        <div class="product-card__desc-box">
          <p class="product-card__desc">${escapeHtml(product.description)}</p>
        </div>
        <div class="product-card__meta-row">
          <div class="product-card__price-group">
            <strong class="product-card__price">${escapeHtml(price)}</strong>
            ${note ? `<span class="product-card__price-note">${escapeHtml(note)}</span>` : ''}
          </div>
          <p class="product-card__platform">${escapeHtml(product.platform)}</p>
        </div>
        <div class="product-card__footer-row">
          <div class="product-card__cta">
            <button type="button" class="product-card__compare-btn"
              data-id="${escapeAttr(product.id)}"
              data-brand="${escapeAttr(product.brand)}"
              data-model="${escapeAttr(product.model)}"
              data-thumb="${escapeAttr(thumb)}">
              <span class="product-card__cta-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 7.25V16.75M7.25 12H16.75" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
                </svg>
              </span>
              <span class="product-card__cta-text">비교함 담기</span>
            </button>
          </div>
          <a class="product-card__action-btn" href="${escapeAttr(priceHref)}">상세보기</a>
        </div>
        </div>
      </div>
    </div>
  `.trim();
}

/**
 * 그리드에 삽입된 카드 이미지에 onerror fallback 바인딩
 */
export function bindProductCardImageFallbacks(root) {
  if (!root) return;
  root.querySelectorAll('.product-card__img').forEach((img) => {
    const thumb = img.closest('.product-card__thumb');
    const fallback =
      img.getAttribute('data-fallback') || assetUrl(CAMERA_THUMB_FALLBACK);
    const fallbackName = fallback.split('/').pop() || '';

    img.addEventListener('error', function onThumbError() {
      img.removeEventListener('error', onThumbError);
      if (fallbackName && img.src.includes(fallbackName)) {
        thumb?.classList.add('product-card__thumb--empty');
        return;
      }
      img.removeAttribute('srcset');
      img.src = fallback;
    });
  });
}
