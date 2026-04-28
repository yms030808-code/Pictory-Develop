/**
 * 시세 비교 페이지 — 카탈로그 연동 검색, 자동완성, URL ?q=, 차트
 */
import { escapeAttr, escapeHtml } from '../products/utils.js';
import {
  buildExternalListingUrl,
  buildPriceListingsFromProducts,
  filterListingsByQuery,
  getCatalogProductsForListings,
  searchCatalogProducts,
} from './buildListings.js';
import { chartInsightText, renderPriceChart } from './chart.js';

const DEFAULT_QUERY = '';

function parsePriceNumber(wonStr) {
  const n = parseInt(String(wonStr).replace(/[^0-9]/g, ''), 10);
  return Number.isFinite(n) ? n : null;
}

function renderListings(container, items, linkQuery, emptyMessage) {
  if (!container) return;
  if (!items.length) {
    container.innerHTML = `<p class="price-list__empty">${escapeHtml(emptyMessage || '검색 결과가 없습니다. 다른 모델명으로 검색해 보세요.')}</p>`;
    return;
  }

  const q = (linkQuery && linkQuery.trim()) || '';

  container.innerHTML = items
    .map((row) => {
      const href = buildExternalListingUrl(row.platformKey, q || row.searchQuery);
      return `
    <div class="price-list__item card">
      <span class="price-list__col price-list__col--platform"><span class="platform-badge ${row.platformBadgeClass}">${escapeHtml(row.platformLabel)}</span></span>
      <span class="price-list__col price-list__col--title">${escapeHtml(row.title)}</span>
      <span class="price-list__col price-list__col--condition"><span class="condition ${row.conditionClass}">${escapeHtml(row.conditionLabel)}</span></span>
      <span class="price-list__col price-list__col--price"><strong>${escapeHtml(row.price)}</strong></span>
      <span class="price-list__col price-list__col--date">${escapeHtml(row.date)}</span>
      <span class="price-list__col price-list__col--action"><a class="btn btn--outline btn--xs" href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer">보러가기</a></span>
    </div>
  `;
    })
    .join('');
}

function updateSummary(summaryRoot, items) {
  if (!summaryRoot) return;

  const elNew = summaryRoot.querySelector('[data-price-summary="new"]');
  const elUsed = summaryRoot.querySelector('[data-price-summary="used"]');
  const elSave = summaryRoot.querySelector('[data-price-summary="save"]');
  const srcNew = summaryRoot.querySelector('[data-price-summary-src="new"]');
  const srcUsed = summaryRoot.querySelector('[data-price-summary-src="used"]');
  const srcSave = summaryRoot.querySelector('[data-price-summary-src="save"]');

  const nums = items.map((r) => parsePriceNumber(r.price)).filter((n) => n != null);
  if (!nums.length) {
    if (elNew) elNew.textContent = '—';
    if (elUsed) elUsed.textContent = '—';
    if (elSave) elSave.textContent = '—';
    if (srcNew) srcNew.textContent = '검색 결과가 없어요';
    if (srcUsed) srcUsed.textContent = '매물이 없습니다';
    if (srcSave) srcSave.textContent = '—';
    return;
  }

  const newPrices = items.filter((r) => r.conditionKey === 'new').map((r) => parsePriceNumber(r.price)).filter(Boolean);
  const usedPrices = items.filter((r) => r.conditionKey !== 'new').map((r) => parsePriceNumber(r.price)).filter(Boolean);

  const minNew = newPrices.length ? Math.min(...newPrices) : Math.min(...nums);
  const avgUsed = usedPrices.length
    ? Math.round(usedPrices.reduce((a, b) => a + b, 0) / usedPrices.length)
    : Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
  const save = Math.max(0, minNew - avgUsed);

  const fmt = (n) => `${n.toLocaleString('ko-KR')}<small>원</small>`;

  if (elNew) elNew.innerHTML = fmt(minNew);
  if (elUsed) elUsed.innerHTML = fmt(avgUsed);
  if (elSave) elSave.innerHTML = fmt(save);

  if (srcNew) srcNew.textContent = '검색된 목록 중 신품 최저';
  if (srcUsed) srcUsed.textContent = '검색된 중고 매물 평균';
  if (srcSave) srcSave.textContent = '위 두 값 기준 예상 차이';
}

function updateChartTitle(chartTitleEl, queryLabel, hasQuery) {
  if (!chartTitleEl) return;
  chartTitleEl.textContent = hasQuery ? `${queryLabel} · 최근 7개월 중고 시세 추이` : '최근 7개월 중고 시세 추이';
}

function renderChartEmpty(chartContainer, insightTextEl) {
  if (chartContainer) {
    chartContainer.innerHTML =
      '<p class="price-chart__empty">카탈로그에 있는 모델명을 검색하면, 해당 매물 기준 시세 추이가 표시됩니다.</p>';
  }
  if (insightTextEl) insightTextEl.textContent = '';
}

function applyFromUrl(allListings, input, listContainer, summaryRoot, chartTitleEl, chartContainer, insightTextEl) {
  const params = new URLSearchParams(window.location.search);
  const rawQ = params.get('q');
  const query = (rawQ != null && rawQ.trim() !== '' ? rawQ : DEFAULT_QUERY).trim();

  if (input) input.value = query;

  if (!query) {
    renderListings(
      listContainer,
      [],
      '',
      '상단 검색창에 브랜드·모델명을 입력해 보세요. (예: Sony) 목록에서 상품을 고르면 해당 모델 시세가 표시됩니다.',
    );
    updateSummary(summaryRoot, []);
    updateChartTitle(chartTitleEl, '', false);
    renderChartEmpty(chartContainer, insightTextEl);
    return;
  }

  const filtered = filterListingsByQuery(allListings, query);
  const catalogProducts = getCatalogProductsForListings(filtered);

  renderListings(listContainer, filtered, query);
  updateSummary(summaryRoot, filtered);
  updateChartTitle(chartTitleEl, query, true);

  if (chartContainer) {
    const chartResult = renderPriceChart(chartContainer, filtered, query, { catalogProducts });
    if (insightTextEl) insightTextEl.textContent = chartInsightText(chartResult.values);
  }
}

function mountSearchSuggest(input, suggestEl, onPick) {
  if (!input || !suggestEl) return;

  function renderSuggest() {
    const q = input.value;
    const items = searchCatalogProducts(q, 12);
    if (!items.length || !q.trim()) {
      suggestEl.hidden = true;
      suggestEl.innerHTML = '';
      input.setAttribute('aria-expanded', 'false');
      return;
    }
    suggestEl.innerHTML = items
      .map((p) => {
        const label = `${p.brand} ${p.model}`;
        return `<li class="price-search__suggest-item" role="option">
          <button type="button" class="price-search__suggest-btn" data-q="${escapeAttr(label)}">
            <span class="price-search__suggest-name">${escapeHtml(label)}</span>
            <span class="price-search__suggest-meta">${escapeHtml(p.priceSummary || '')}</span>
          </button>
        </li>`;
      })
      .join('');
    suggestEl.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  input.addEventListener('input', () => {
    renderSuggest();
  });

  input.addEventListener('focus', () => {
    renderSuggest();
  });

  suggestEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-q]');
    if (!btn) return;
    const v = btn.getAttribute('data-q') || '';
    onPick(v);
  });

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!(t instanceof Node)) return;
    if (input.contains(t) || suggestEl.contains(t)) return;
    suggestEl.hidden = true;
    input.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      suggestEl.hidden = true;
      input.setAttribute('aria-expanded', 'false');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('priceSearchInput');
  const btn = document.getElementById('priceSearchBtn');
  const listContainer = document.getElementById('priceListResults');
  const summaryRoot = document.getElementById('priceSummary');
  const chartTitleEl = document.querySelector('.price-chart__title');
  const chartContainer = document.getElementById('chartContainer');
  const insightTextEl = document.getElementById('priceChartInsightText');
  const suggestEl = document.getElementById('priceSearchSuggest');

  if (!listContainer) return;

  const allListings = buildPriceListingsFromProducts();

  const run = () =>
    applyFromUrl(allListings, input, listContainer, summaryRoot, chartTitleEl, chartContainer, insightTextEl);

  function submitSearch() {
    const v = input?.value.trim() || '';
    const url = new URL(window.location.href);
    if (v) url.searchParams.set('q', v);
    else url.searchParams.delete('q');
    window.history.pushState({}, '', `${url.pathname}${url.search}`);
    run();
    if (suggestEl) suggestEl.hidden = true;
    input?.setAttribute('aria-expanded', 'false');
  }

  mountSearchSuggest(input, suggestEl, (picked) => {
    if (input) input.value = picked;
    submitSearch();
  });

  run();

  btn?.addEventListener('click', submitSearch);
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitSearch();
    }
  });

  window.addEventListener('popstate', run);
});
