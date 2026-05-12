/**
 * Picory 상품 페이지 엔트리 — 카테고리 / 목록 / 필터 연결
 */
import { PICORY_PRODUCT_CATEGORIES } from './categories.js';
import { PICORY_PRODUCT_MOCK } from './mockData.js';
import { filterProductsByCategoryAndSearch } from './filterProducts.js';
import { mountCategoryNav } from './categoryNav.js';
import { renderProductCardHTML, bindProductCardImageFallbacks } from './productCard.js';
import { sortProducts, isValidProductSort, getSortLabel } from './sortProducts.js';

const SORT_STORAGE_KEY = 'picory-product-sort';
const COLOR_STORAGE_KEY = 'picory-product-color';

const PRODUCT_COLOR_OPTIONS = Object.freeze([
  { value: 'all', label: '전체' },
  { value: 'black', label: '블랙' },
  { value: 'silver', label: '실버' },
  { value: 'white', label: '화이트' },
  { value: 'gray', label: '그레이' },
  { value: 'blue', label: '블루' },
  { value: 'red', label: '레드' },
  { value: 'green', label: '그린' },
]);

const PRODUCT_COLORS_BY_ID = Object.freeze({
  'fujifilm-x100vi': ['silver', 'black'],
  'canon-eos-r10': ['black'],
  'sony-zv-e10-ii': ['black', 'white'],
  'ricoh-gr-iiix': ['black'],
  'sony-a7c-ii': ['black', 'silver'],
  'nikon-z-fc': ['silver', 'gray', 'black'],
  'canon-g7x-mark-iii': ['black', 'silver'],
  'dji-osmo-pocket-3': ['black'],
  'sony-a6700': ['black'],
  'canon-eos-r50': ['black', 'white'],
  'fujifilm-x-s20': ['black'],
  'canon-eos-r50-v': ['black', 'white'],
  'nikon-z50ii': ['black'],
  'canon-eos-r8': ['black'],
  'sony-rx100-vii': ['black'],
  'panasonic-lumix-s9': ['black', 'blue', 'red', 'green'],
  'panasonic-lumix-gh7': ['black'],
  'om-system-om-3': ['silver', 'gray', 'black'],
  'fujifilm-x-m5': ['silver', 'black'],
  'leica-d-lux-8': ['black', 'gray'],
  'sigma-fp-l': ['black', 'gray'],
  'kodak-pixpro-fz55': ['black', 'blue', 'red'],
});

const recommendIndexById = new Map(
  PICORY_PRODUCT_MOCK.map((p, i) => [p.id, i]),
);

function getStoredSort() {
  try {
    const raw = localStorage.getItem(SORT_STORAGE_KEY);
    if (raw && isValidProductSort(raw)) return raw;
  } catch {
    /* ignore */
  }
  return 'recommend';
}

function setStoredSort(value) {
  try {
    if (isValidProductSort(value)) localStorage.setItem(SORT_STORAGE_KEY, value);
  } catch {
    /* ignore */
  }
}

function isValidProductColor(value) {
  return PRODUCT_COLOR_OPTIONS.some((option) => option.value === value);
}

function getColorLabel(key) {
  const found = PRODUCT_COLOR_OPTIONS.find((option) => option.value === key);
  return found ? found.label : PRODUCT_COLOR_OPTIONS[0].label;
}

function getStoredColor() {
  try {
    const raw = localStorage.getItem(COLOR_STORAGE_KEY);
    if (raw && isValidProductColor(raw)) return raw;
  } catch {
    /* ignore */
  }
  return 'all';
}

function setStoredColor(value) {
  try {
    if (isValidProductColor(value)) localStorage.setItem(COLOR_STORAGE_KEY, value);
  } catch {
    /* ignore */
  }
}

function getSearchQueryFromUrl() {
  try {
    return new URLSearchParams(window.location.search).get('q') || '';
  } catch {
    return '';
  }
}

function filterProductsByColor(products, colorKey) {
  if (!colorKey || colorKey === 'all') return products;
  return products.filter((product) => {
    const colors = PRODUCT_COLORS_BY_ID[product.id] || [];
    return colors.includes(colorKey);
  });
}

function refreshProductGrid(gridRoot, emptyEl, categoryKey, sortKey, searchQuery, colorKey = 'all') {
  const categoryFiltered = filterProductsByCategoryAndSearch(PICORY_PRODUCT_MOCK, categoryKey, searchQuery);
  const filtered = filterProductsByColor(categoryFiltered, colorKey);
  const items = sortProducts(filtered, sortKey, recommendIndexById);
  if (!items.length) {
    gridRoot.innerHTML = '';
    if (emptyEl) emptyEl.classList.remove('hidden');
    window.syncPicoryBookmarks?.();
    return;
  }
  if (emptyEl) emptyEl.classList.add('hidden');
  gridRoot.innerHTML = items.map(renderProductCardHTML).join('');
  bindProductCardImageFallbacks(gridRoot);
  window.syncPicoryBookmarks?.();
}

function getCategoryKeyFromHash() {
  const raw = window.location.hash.slice(1);
  if (!raw) return null;
  const key = decodeURIComponent(raw.split('&')[0]);
  return PICORY_PRODUCT_CATEGORIES.some((c) => c.key === key) ? key : null;
}

/**
 * 네이티브 select 대신 커스텀 드롭다운 (파란 시스템 하이라이트 제거)
 * @param {{ trigger: HTMLElement, list: HTMLElement, valueEl: HTMLElement, initialKey: string, onChange: (key: string) => void, isValid: (key: string) => boolean, getLabel: (key: string) => string }} p
 */
function mountProductDropdownUi({ trigger, list, valueEl, initialKey, onChange, isValid, getLabel }) {
  const optionEls = () => Array.from(list.querySelectorAll('.product-catalog__sort-option[data-value]'));

  function syncUi(key) {
    valueEl.textContent = getLabel(key);
    optionEls().forEach((opt) => {
      const v = opt.getAttribute('data-value');
      const sel = v === key;
      opt.setAttribute('aria-selected', sel ? 'true' : 'false');
      opt.classList.toggle('is-selected', sel);
    });
  }

  function setOpen(open) {
    list.hidden = !open;
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    trigger.classList.toggle('is-open', open);
  }

  function close() {
    setOpen(false);
  }

  syncUi(initialKey);

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(list.hidden);
  });

  list.addEventListener('click', (e) => {
    const li = /** @type {HTMLElement | null} */ (e.target.closest('.product-catalog__sort-option[data-value]'));
    if (!li) return;
    const v = li.getAttribute('data-value');
    if (!v || !isValid(v)) return;
    syncUi(v);
    onChange(v);
    close();
  });

  document.addEventListener('mousedown', (e) => {
    if (list.hidden) return;
    const t = /** @type {Node | null} */ (e.target);
    if (trigger.contains(t) || list.contains(t)) return;
    close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !list.hidden) {
      e.preventDefault();
      close();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const qParam = getSearchQueryFromUrl();
  const searchInput =
    document.querySelector('.nav__search input[type="search"]') ||
    document.querySelector('.m-topbar__search-input');
  if (searchInput && qParam) {
    searchInput.value = qParam;
  }
  /* 상단 검색 Enter → 상세(price.html?q=)는 app.js 전역 suggest에서 처리 */

  const navRoot = document.getElementById('productCategoryNav');
  const gridRoot = document.getElementById('productGrid');
  const emptyEl = document.getElementById('productCatalogEmpty');
  const sortTrigger = document.getElementById('productSortTrigger');
  const sortList = document.getElementById('productSortList');
  const sortValue = document.getElementById('productSortValue');
  const colorTrigger = document.getElementById('productColorTrigger');
  const colorList = document.getElementById('productColorList');
  const colorValue = document.getElementById('productColorValue');

  if (!navRoot || !gridRoot) return;

  let sortKey = getStoredSort();
  let colorKey = getStoredColor();
  let activeSearchQuery = qParam;

  const hashKey = getCategoryKeyFromHash();
  const initialKey = hashKey || PICORY_PRODUCT_CATEGORIES[0].key;

  const nav = mountCategoryNav(navRoot, PICORY_PRODUCT_CATEGORIES, {
    initialKey,
    onChange: (key) => {
      activeSearchQuery = '';
      refreshProductGrid(gridRoot, emptyEl, key, sortKey, '', colorKey);
      history.replaceState(null, '', `#${encodeURIComponent(key)}`);
    },
  });

  if (sortTrigger && sortList && sortValue) {
    mountProductDropdownUi({
      trigger: sortTrigger,
      list: sortList,
      valueEl: sortValue,
      initialKey: sortKey,
      isValid: isValidProductSort,
      getLabel: getSortLabel,
      onChange: (v) => {
        sortKey = v;
        setStoredSort(v);
        refreshProductGrid(gridRoot, emptyEl, nav.getActiveKey(), sortKey, activeSearchQuery, colorKey);
      },
    });
  }

  if (colorTrigger && colorList && colorValue) {
    mountProductDropdownUi({
      trigger: colorTrigger,
      list: colorList,
      valueEl: colorValue,
      initialKey: colorKey,
      isValid: isValidProductColor,
      getLabel: getColorLabel,
      onChange: (v) => {
        colorKey = v;
        setStoredColor(v);
        refreshProductGrid(gridRoot, emptyEl, nav.getActiveKey(), sortKey, activeSearchQuery, colorKey);
      },
    });
  }

  refreshProductGrid(gridRoot, emptyEl, initialKey, sortKey, activeSearchQuery, colorKey);

  if (hashKey) {
    requestAnimationFrame(() => {
      document.getElementById('product-catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
});
