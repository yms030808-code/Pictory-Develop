/**
 * 최근 7개월 중고 평균 시세 라인 차트 (목록의 중고 평균에 맞춤)
 */
import { escapeAttr, escapeHtml } from '../products/utils.js';
import { buildExternalListingUrl } from './buildListings.js';

function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const W = 600;
const H = 200;
const PAD_T = 20;
const PAD_B = 36;
const X0 = 8;
const X1 = 592;
const N = 7;

/** 시세 목록·그래프 기준일 (buildListings.js LISTING_REF_DATE와 동일) */
const CHART_REF_DATE = new Date(2026, 3, 28);

function monthLabelsRolling7(reference = CHART_REF_DATE) {
  const labels = [];
  for (let i = N - 1; i >= 0; i -= 1) {
    const d = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate() - (i * 10));
    labels.push(`${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`);
  }
  return labels;
}

function fullMonthLabels(reference = CHART_REF_DATE) {
  const labels = [];
  for (let i = N - 1; i >= 0; i -= 1) {
    const d = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate() - (i * 10));
    labels.push(`${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`);
  }
  return labels;
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/**
 * 마지막 달 평균 = anchor, 이전 달은 약한 계절성·하락 추세(프로토타입)
 */
function buildMonthlyAverages(anchorAvg, query) {
  const seed = hashString(query || 'default');
  const wobble = (i) => 1 + (((seed >> (i * 3)) % 17) - 8) / 400;
  const trend = [1.052, 1.038, 1.022, 1.008, 0.995, 0.988, 1.0];
  const last = trend[N - 1];
  return trend.map((t, i) => Math.round((anchorAvg * t * wobble(i)) / last));
}

/**
 * 카탈로그 정가(priceKrw)와 시세 목록의 현재 중고 평균(anchor)을 잇는 7개월 추이.
 * 동일 검색·상품이면 항상 같은 곡선(결정적)이며, 마지막 달 값은 현재 목록 평균과 일치.
 */
function buildMonthlySeriesFromCatalog(anchorAvg, catalogProducts, query) {
  if (!catalogProducts || catalogProducts.length === 0) {
    return buildMonthlyAverages(anchorAvg, query);
  }
  const seed = hashString(query + catalogProducts.map((p) => p.id).sort().join('|'));
  const avgCatalog =
    catalogProducts.reduce((s, p) => s + p.priceKrw, 0) / catalogProducts.length;
  const start = Math.round(avgCatalog * (0.88 + (seed % 19) / 250));
  const values = [];
  for (let i = 0; i < N; i += 1) {
    const t = i / (N - 1);
    const mix = start + (anchorAvg - start) * easeInOutQuad(t);
    const wobble = 1 + (((seed >> (i * 3)) & 31) - 15) / 300;
    values.push(Math.round(mix * wobble));
  }
  values[N - 1] = anchorAvg;
  return values;
}

function fallbackAnchorAvg(query) {
  const h = hashString(query || 'Sony A7C II');
  return 2100000 + (h % 650000);
}

function formatWonFull(n) {
  return `${Math.round(n).toLocaleString('ko-KR')}원`;
}

function formatWonMan(n) {
  const man = n / 10000;
  if (man >= 100) return `${Math.round(man)}만`;
  if (man >= 10) return `${(Math.round(man * 10) / 10).toFixed(1)}만`;
  return `${Math.round(man * 10) / 10}만`;
}

function yTicks(minV, maxV, count) {
  const pad = Math.max((maxV - minV) * 0.06, 50000);
  let lo = minV - pad;
  let hi = maxV + pad;
  if (hi <= lo) hi = lo + 100000;
  const step = (hi - lo) / (count - 1);
  const ticks = [];
  for (let i = 0; i < count; i += 1) ticks.push(Math.round(lo + step * i));
  return { ticks, lo, hi };
}

function valueToY(v, lo, hi) {
  const t = (v - lo) / (hi - lo);
  return PAD_T + (1 - t) * (H - PAD_T - PAD_B);
}

function xAt(i) {
  return X0 + (i / (N - 1)) * (X1 - X0);
}

function findLowestUsedListing(listings) {
  const used = (listings || []).filter((r) => r && r.conditionKey !== 'new');
  if (!used.length) return null;
  return used.reduce((min, row) => (row.priceValue < min.priceValue ? row : min));
}

function buildHighLowSeries(avgValues, currentLow, currentHigh, query) {
  const seed = hashString(`${query}|${currentLow}|${currentHigh}|range`);
  const lowStart = Math.round(currentLow * (1.035 + (seed % 8) / 500));
  const highStart = Math.round(currentHigh * (1.02 + (seed % 7) / 500));
  const lowValues = [];
  const highValues = [];

  for (let i = 0; i < N; i += 1) {
    const t = i / (N - 1);
    const flatStep = i < 2 ? 0 : i < 3 ? 0.55 : 1;
    const lowBase = lowStart + (currentLow - lowStart) * flatStep;
    const highBase = highStart + (currentHigh - highStart) * flatStep;
    const lowWobble = 1 + (((seed >> (i * 2)) & 7) - 3) / 900;
    const highWobble = 1 + (((seed >> (i * 3)) & 7) - 3) / 900;
    lowValues.push(Math.round(lowBase * lowWobble));
    highValues.push(Math.round(highBase * highWobble));

    if (t > 0.55) {
      lowValues[i] = Math.round(currentLow * (1 + (((seed >> i) & 3) - 1) / 1200));
      highValues[i] = Math.round(currentHigh * (1 + (((seed >> (i + 1)) & 3) - 1) / 1200));
    }
  }

  lowValues[N - 1] = currentLow;
  highValues[N - 1] = currentHigh;

  return {
    lowValues,
    highValues: highValues.map((v, i) => Math.max(v, lowValues[i] + Math.max(50000, avgValues[i] * 0.035))),
  };
}

/**
 * @param {HTMLElement} mount - #chartContainer
 * @param {Array<{ conditionKey: string, priceValue: number }>} filteredListings
 * @param {string} query
 * @param {{ catalogProducts?: Array<{ id: string, priceKrw: number }> }} [options]
 */
export function renderPriceChart(mount, filteredListings, query, options = {}) {
  if (!mount) return { values: [], anchorAvg: 0 };

  const { catalogProducts = [] } = options;

  const used = (filteredListings || []).filter((r) => r.conditionKey !== 'new');
  const anchorAvg = used.length
    ? Math.round(used.reduce((s, r) => s + r.priceValue, 0) / used.length)
    : fallbackAnchorAvg(query);

  const avgValues =
    catalogProducts.length > 0
      ? buildMonthlySeriesFromCatalog(anchorAvg, catalogProducts, query)
      : buildMonthlyAverages(anchorAvg, query);
  const usedPrices = used.map((r) => Number(r.priceValue)).filter(Number.isFinite);
  const currentLow = usedPrices.length ? Math.min(...usedPrices) : Math.round(anchorAvg * 0.92);
  const currentHigh = usedPrices.length ? Math.max(...usedPrices) : Math.round(anchorAvg * 1.08);
  const currentAvg = usedPrices.length
    ? Math.round(usedPrices.reduce((s, n) => s + n, 0) / usedPrices.length)
    : anchorAvg;
  const { lowValues, highValues } = buildHighLowSeries(avgValues, currentLow, currentHigh, query);
  const minV = Math.min(...lowValues);
  const maxV = Math.max(...highValues);

  const { lo, hi } = yTicks(minV, maxV, 4);
  const lowPoints = lowValues.map((v, i) => ({ x: xAt(i), y: valueToY(v, lo, hi), v, i }));
  const highPoints = highValues.map((v, i) => ({ x: xAt(i), y: valueToY(v, lo, hi), v, i }));

  const lowPolyline = lowPoints.map((p) => `${p.x},${p.y}`).join(' ');
  const highPolyline = highPoints.map((p) => `${p.x},${p.y}`).join(' ');

  const monthShort = monthLabelsRolling7();
  const monthFull = fullMonthLabels();

  const xAxisLabelsSvg = monthShort
    .map(
      (lab, i) =>
        `<text class="chart__axis-label" x="${xAt(i)}" y="${H - 8}" text-anchor="middle">${escapeHtml(lab)}</text>`,
    )
    .join('');

  const iconHigh = `<svg class="chart__price-icon chart__price-icon--high" xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none" aria-hidden="true"><path d="M0.816667 7L0 6.18333L4.31667 1.8375L6.65 4.17083L9.68333 1.16667H8.16667V0H11.6667V3.5H10.5V1.98333L6.65 5.83333L4.31667 3.5L0.816667 7Z" fill="currentColor"/></svg>`;
  const iconAvg = `<svg class="chart__price-icon" xmlns="http://www.w3.org/2000/svg" width="9" height="2" viewBox="0 0 9 2" fill="none" aria-hidden="true"><path d="M0 1.16667V0H8.16667V1.16667H0Z" fill="currentColor"/></svg>`;
  const iconLow = `<svg class="chart__price-icon chart__price-icon--low" xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none" aria-hidden="true"><path d="M8.16667 7V5.83333H9.68333L6.65 2.82917L4.31667 5.1625L0 0.816667L0.816667 0L4.31667 3.5L6.65 1.16667L10.5 5.01667V3.5H11.6667V7H8.16667Z" fill="currentColor"/></svg>`;

  const lowestListing = findLowestUsedListing(used);
  const lowestLinkHtml = lowestListing
    ? `<a class="chart__lowest-link" href="${escapeAttr(buildExternalListingUrl(lowestListing.platformKey, query || lowestListing.searchQuery))}" target="_blank" rel="noopener noreferrer">${escapeHtml(lowestListing.platformLabel)}에서 최저가 보기</a>`
    : '';

  const pointGroups = lowPoints
    .map((lowPoint, i) => {
      const highPoint = highPoints[i];
      return `
    <g class="chart__point" data-month="${escapeAttr(monthFull[i])}" data-low="${escapeAttr(formatWonFull(lowPoint.v))}" data-high="${escapeAttr(formatWonFull(highPoint.v))}">
      <circle class="chart__hit" cx="${lowPoint.x}" cy="${(lowPoint.y + highPoint.y) / 2}" r="16" fill="transparent" style="cursor:pointer"/>
      <circle class="chart__dot chart__dot--high" cx="${highPoint.x}" cy="${highPoint.y}" r="4.5"/>
      <circle class="chart__dot chart__dot--low" cx="${lowPoint.x}" cy="${lowPoint.y}" r="5.5"/>
    </g>`;
    })
    .join('');

  const headerHtml = `
    <header class="chart__header" role="group" aria-label="현재 시세 요약">
      <div class="chart__header-fields">
        <div class="chart__col chart__col--high">
          <div class="chart__col-title">현 최고가</div>
          <div class="chart__col-price">
            ${iconHigh}
            <span class="chart__col-value">${escapeHtml(formatWonFull(currentHigh))}</span>
          </div>
        </div>
        <div class="chart__col chart__col--avg">
          <div class="chart__col-title">현재 평균가</div>
          <div class="chart__col-price">
            ${iconAvg}
            <span class="chart__col-value">${escapeHtml(formatWonFull(currentAvg))}</span>
          </div>
        </div>
        <div class="chart__col chart__col--low">
          <div class="chart__col-title">현 최저가</div>
          <div class="chart__col-price">
            ${iconLow}
            <span class="chart__col-value">${escapeHtml(formatWonFull(currentLow))}</span>
          </div>
          ${lowestLinkHtml}
        </div>
      </div>
    </header>`;

  const lastHigh = highPoints[N - 1];
  const lastLow = lowPoints[N - 1];

  mount.innerHTML = `
    <div class="chart chart--comparison">
      ${headerHtml}
      <div class="chart__plot chart__plot--interactive">
        <div class="chart__plot-inner">
          <div class="chart__plot-canvas">
            <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" class="chart__svg" overflow="visible" focusable="false" aria-hidden="true" id="priceChartSvg">
              <polyline class="chart__line chart__line--high" points="${highPolyline}" fill="none"/>
              <polyline class="chart__line chart__line--low" points="${lowPolyline}" fill="none"/>
              ${pointGroups}
              <g class="chart__x-labels" aria-hidden="true">${xAxisLabelsSvg}</g>
            </svg>
            <div class="chart-tooltip" id="chartTooltip" role="tooltip" aria-hidden="true"></div>
          </div>
        </div>
        <div class="chart__badges" aria-hidden="true">
          <div class="chart__inline-label chart__inline-label--high" id="chartLabelHigh">최고가 ${escapeHtml(Math.round(currentHigh).toLocaleString('ko-KR'))}</div>
          <div class="chart__inline-label chart__inline-label--low chart__inline-label--primary" id="chartLabelLow">최저가 ${escapeHtml(Math.round(currentLow).toLocaleString('ko-KR'))}</div>
        </div>
      </div>
    </div>
  `;

  const svg = mount.querySelector('#priceChartSvg');
  const tooltip = mount.querySelector('#chartTooltip');
  const area = mount.querySelector('.chart__plot--interactive');
  const labelHigh = mount.querySelector('#chartLabelHigh');
  const labelLow = mount.querySelector('#chartLabelLow');
  const plotCanvas = mount.querySelector('.chart__plot-canvas');
  const badgesEl = mount.querySelector('.chart__badges');

  function syncChartLayout() {
    if (!svg || !plotCanvas || !badgesEl || !labelHigh || !labelLow) return;
    const canvasRect = plotCanvas.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    const badgesRect = badgesEl.getBoundingClientRect();
    if (!svgRect.height || !badgesRect.height) return;

    const scaleY = svgRect.height / H;
    const offsetTop = svgRect.top - badgesRect.top;
    const highCenter = offsetTop + lastHigh.y * scaleY;
    const lowCenter = offsetTop + lastLow.y * scaleY;
    const labelHalf = labelHigh.offsetHeight / 2;

    labelHigh.style.top = `${Math.max(4, Math.min(badgesRect.height - labelHigh.offsetHeight - 4, highCenter - labelHalf))}px`;
    labelLow.style.top = `${Math.max(4, Math.min(badgesRect.height - labelLow.offsetHeight - 4, lowCenter - labelHalf))}px`;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(syncChartLayout);
  });
  if (typeof ResizeObserver !== 'undefined' && area) {
    const ro = new ResizeObserver(syncChartLayout);
    ro.observe(area);
  } else {
    window.addEventListener('resize', syncChartLayout);
  }

  let lastTipKey = '';

  function showTip(textMonth, textLow, textHigh, clientX, clientY) {
    if (!tooltip || !area) return;
    const key = `${textMonth}|${textLow}|${textHigh}`;
    const contentChanged = key !== lastTipKey;
    lastTipKey = key;

    const html = `<span class="chart-tooltip__month">${escapeHtml(textMonth)}</span><span class="chart-tooltip__avg chart-tooltip__avg--high">최고가 ${escapeHtml(textHigh)}</span><span class="chart-tooltip__avg chart-tooltip__avg--low">최저가 ${escapeHtml(textLow)}</span>`;
    if (contentChanged) {
      tooltip.innerHTML = html;
      tooltip.classList.remove('chart-tooltip--visible');
    }
    tooltip.setAttribute('aria-hidden', 'false');

    requestAnimationFrame(() => {
      const rect = area.getBoundingClientRect();
      const tw = tooltip.offsetWidth;
      const th = tooltip.offsetHeight;
      let left = clientX - rect.left + 12;
      let top = clientY - rect.top - th - 12;
      if (left + tw > rect.width - 8) left = rect.width - tw - 8;
      if (left < 8) left = 8;
      if (top < 8) top = clientY - rect.top + 16;
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;

      if (contentChanged) {
        requestAnimationFrame(() => {
          tooltip.classList.add('chart-tooltip--visible');
        });
      } else {
        tooltip.classList.add('chart-tooltip--visible');
      }
    });
  }

  function hideTip() {
    if (!tooltip) return;
    lastTipKey = '';
    tooltip.classList.remove('chart-tooltip--visible');
    tooltip.setAttribute('aria-hidden', 'true');
  }

  mount.querySelectorAll('.chart__point').forEach((g) => {
    g.addEventListener('mouseenter', (e) => {
      showTip(g.dataset.month, g.dataset.low, g.dataset.high, e.clientX, e.clientY);
    });
    g.addEventListener('mousemove', (e) => {
      showTip(g.dataset.month, g.dataset.low, g.dataset.high, e.clientX, e.clientY);
    });
    g.addEventListener('mouseleave', hideTip);
  });

  svg?.addEventListener('mouseleave', hideTip);

  return { values: avgValues, anchorAvg, highValues, lowValues };
}

export function chartInsightText(values) {
  if (!values || values.length < 2) return '검색된 중고 시세 추이를 확인해 보세요.';
  const first = values[0];
  const last = values[values.length - 1];
  const delta = last - first;
  const pct = first ? Math.round((delta / first) * 100) : 0;
  if (delta < -first * 0.02) return `최근 7개월간 평균 중고가 약 ${Math.abs(pct)}% 하락한 구간이에요. 매수 타이밍을 검토해 보기 좋습니다.`;
  if (delta > first * 0.02) return `최근 7개월간 평균 중고가 약 ${pct}% 상승했어요. 가격 변동을 감안해 보세요.`;
  return '최근 7개월간 평균 중고가가 비교적 안정적인 구간이에요.';
}
