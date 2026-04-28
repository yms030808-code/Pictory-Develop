/**
 * 체크리스트 답변 → 상품 카탈로그(mockData) 기반 점수 추천
 */
import { PICORY_PRODUCT_MOCK } from '../products/mockData.js';
import { escapeHtml, escapeAttr } from '../products/utils.js';

/** @typedef {{ budget: string, intents: string[], weight: string, usedPref: string }} ChecklistAnswers */

const BUDGET_RANGE = {
  under100: { min: 0, max: 1_050_000, label: '100만원 이하' },
  '100to200': { min: 750_000, max: 2_100_000, label: '100~200만원' },
  '200to300': { min: 1_650_000, max: 3_300_000, label: '200~300만원' },
  over300: { min: 1_850_000, max: 9_999_999_999, label: '300만원 이상' },
};

const INTENT_TAGS = {
  portrait: ['emotional', 'trending'],
  cafe: ['emotional', 'beginner'],
  landscape: ['travel', 'emotional'],
  vlog: ['vlog', 'trending'],
  travel: ['travel', 'value'],
  product: ['emotional', 'beginner'],
};

const COMPACT_IDS = new Set([
  'dji-osmo-pocket-3',
  'canon-g7x-mark-iii',
  'ricoh-gr-iiix',
  'canon-eos-r50',
  'canon-eos-r50-v',
  'sony-zv-e10-ii',
  'canon-eos-r10',
]);

const PERFORMANCE_IDS = new Set(['sony-a7c-ii', 'sony-a6700', 'fujifilm-x100vi']);

const INTENT_LABEL = {
  portrait: '인물',
  cafe: '카페·일상',
  landscape: '풍경',
  vlog: '영상·브이로그',
  travel: '여행',
  product: '제품·음식',
};

const CAMERA_COMPARE_META = {
  'fujifilm-x100vi': {
    sensor: 'APS-C',
    colorTone: '필름 시뮬레이션 기반 따뜻한 감성 톤',
    keyFeature: '스냅 최적화 고정렌즈, 클래식 조작감',
    samplePhoto: { src: '/images/community-fujifilm-xt5-gallery.jpg', alt: '후지필름 감성 거리 사진 샘플' },
  },
  'sony-a7c-ii': {
    sensor: '풀프레임',
    colorTone: '자연스러운 컬러와 높은 계조 표현',
    keyFeature: '작은 바디 + 풀프레임, 인물/여행 밸런스',
    samplePhoto: { src: '/images/community-sony-a7c2-gallery.png', alt: '소니 A7C II 풍경 샘플' },
  },
  'sony-a6700': {
    sensor: 'APS-C',
    colorTone: '선명하고 대비감 있는 현대적 톤',
    keyFeature: '빠른 AF, 영상/사진 올라운드 성능',
    samplePhoto: { src: '/images/community-portrait-gallery.jpg', alt: '소니 A6700 인물 샘플' },
  },
  'canon-eos-r50': {
    sensor: 'APS-C',
    colorTone: '피부 톤이 부드러운 밝은 색감',
    keyFeature: '입문자 친화 UI, 가벼운 무게',
    samplePhoto: { src: '/images/community-portrait-gallery.jpg', alt: '캐논 EOS R50 인물 샘플' },
  },
  'canon-eos-r10': {
    sensor: 'APS-C',
    colorTone: '균형 잡힌 뉴트럴 톤',
    keyFeature: '스틸 촬영 반응성, 가벼운 바디',
    samplePhoto: { src: '/images/community-canon-r6ii-gallery.jpg', alt: '캐논 계열 야간 샘플' },
  },
  'canon-eos-r50-v': {
    sensor: 'APS-C',
    colorTone: '밝고 또렷한 브이로그 톤',
    keyFeature: '세로 영상/라이브 중심 인터페이스',
    samplePhoto: { src: '/images/community-canon-r6ii-gallery.jpg', alt: '캐논 브이로그 샘플' },
  },
  'fujifilm-x-s20': {
    sensor: 'APS-C',
    colorTone: '부드럽고 감성적인 색 재현',
    keyFeature: '손떨림 보정과 배터리 효율',
    samplePhoto: { src: '/images/community-fujifilm-xt5-gallery.jpg', alt: '후지필름 X-S20 감성 샘플' },
  },
  'ricoh-gr-iiix': {
    sensor: 'APS-C',
    colorTone: '콘트라스트 있는 스트리트 스냅 톤',
    keyFeature: '포켓형 고화질 스냅 카메라',
    samplePhoto: { src: '/images/community-nikon-zf-gallery.jpg', alt: '거리 스냅 샘플' },
  },
  'canon-g7x-mark-iii': {
    sensor: '1인치',
    colorTone: '밝고 선명한 일상/브이로그 톤',
    keyFeature: '휴대형 컴팩트, 영상 입문 친화',
    samplePhoto: { src: '/images/community-fujifilm-xt5-gallery.jpg', alt: '일상 음식 샘플' },
  },
  'dji-osmo-pocket-3': {
    sensor: '1인치',
    colorTone: '영상 중심의 선명하고 깨끗한 톤',
    keyFeature: '짐벌 일체형으로 강력한 손떨림 보정',
    samplePhoto: { src: '/images/community-canon-r6ii-gallery.jpg', alt: '브이로그 영상 톤 샘플' },
  },
  'nikon-z-fc': {
    sensor: 'APS-C',
    colorTone: '클래식하고 차분한 색감',
    keyFeature: '레트로 다이얼 조작과 감성 디자인',
    samplePhoto: { src: '/images/community-nikon-zf-gallery.jpg', alt: '니콘 빈티지 스타일 샘플' },
  },
};

const OFFLINE_STORE_GUIDE = {
  'fujifilm-x100vi': ['후지필름 하우스 서울', '남대문 카메라 상가 체험존'],
  'sony-a7c-ii': ['소니 스토어 강남', '일렉트로마트 왕십리 디지털관'],
  'sony-a6700': ['소니 스토어 강남', '하이마트 메가스토어 잠실'],
  'canon-eos-r50': ['캐논 플래그십 스토어', '신촌 카메라 전문 매장'],
  'canon-eos-r10': ['캐논 플래그십 스토어', '용산 카메라 체험 매장'],
  'canon-eos-r50-v': ['캐논 플래그십 스토어', '잠실 디지털 체험 매장'],
  'fujifilm-x-s20': ['후지필름 하우스 서울', '홍대 카메라 셀렉트샵'],
  'ricoh-gr-iiix': ['리코 공식 파트너 매장', '강남 스냅 카메라 전문점'],
  'canon-g7x-mark-iii': ['캐논 플래그십 스토어', '명동 디지털 카메라 샵'],
  'dji-osmo-pocket-3': ['DJI 스토어 홍대', '일렉트로마트 체험존'],
  'nikon-z-fc': ['니콘 플라자 서울', '충무로 카메라 전문 거리'],
};

function budgetFitScore(priceKrw, budgetKey) {
  const r = BUDGET_RANGE[budgetKey] || BUDGET_RANGE['100to200'];
  if (priceKrw >= r.min && priceKrw <= r.max) return 42;
  if (priceKrw < r.min) return 28;
  const over = priceKrw - r.max;
  if (over <= 0) return 35;
  return Math.max(0, 22 - Math.min(20, Math.floor(over / 120_000)));
}

function intentScore(categories, intents) {
  const catSet = new Set(categories);
  let s = 0;
  for (const key of intents) {
    const tags = INTENT_TAGS[key];
    if (!tags) continue;
    for (const t of tags) {
      if (catSet.has(t)) s += 16;
    }
  }
  return s;
}

function weightScore(productId, weight) {
  if (weight === 'light' && COMPACT_IDS.has(productId)) return 26;
  if (weight === 'heavy' && PERFORMANCE_IDS.has(productId)) return 26;
  if (weight === 'mid') return 10;
  return 0;
}

function usedPrefScore(p, usedPref) {
  const cats = new Set(p.categories);
  if (usedPref === 'value_first') {
    let s = 0;
    if (cats.has('value')) s += 18;
    if (cats.has('beginner')) s += 10;
    return s;
  }
  if (usedPref === 'new_only') {
    return p.priceKrw <= 1_450_000 ? 14 : 4;
  }
  if (usedPref === 'used_ok') return 8;
  return 0;
}

function scoreProduct(p, answers) {
  let s =
    budgetFitScore(p.priceKrw, answers.budget) +
    intentScore(p.categories, answers.intents) +
    weightScore(p.id, answers.weight) +
    usedPrefScore(p, answers.usedPref) +
    (p.popularity || 0) * 0.12;
  return s;
}

function buildWhySentence(p, answers, intentMatchCount) {
  const parts = [];
  const range = BUDGET_RANGE[answers.budget];
  if (range && p.priceKrw >= range.min && p.priceKrw <= range.max) {
    parts.push(`선택하신 ${range.label} 예산대에 잘 맞는 가격대예요.`);
  } else if (p.priceKrw < (range?.min || 0)) {
    parts.push('예산보다 여유 있게 잡힌 가성비 후보예요.');
  }
  if (intentMatchCount >= 2) {
    parts.push('촬영 목적과 카탈로그 태그가 여러 방면에서 맞물려요.');
  } else if (answers.intents.length) {
    const first = answers.intents[0];
    parts.push(`${INTENT_LABEL[first] || '촬영'} 용도에 어울리는 스펙·색감을 갖춘 편이에요.`);
  }
  if (answers.weight === 'light' && COMPACT_IDS.has(p.id)) {
    parts.push('휴대성·무게를 중시한 선택과도 잘 맞아요.');
  }
  if (answers.weight === 'heavy' && PERFORMANCE_IDS.has(p.id)) {
    parts.push('성능·센서 여유를 우선할 때 무난한 상위권이에요.');
  }
  if (!parts.length) {
    const d = p.description || '';
    parts.push(d.slice(0, 90) + (d.length > 90 ? '…' : ''));
  }
  return parts.slice(0, 2).join(' ').trim();
}

export function formatChecklistSummary(answers) {
  const br = BUDGET_RANGE[answers.budget]?.label || '선택 예산';
  const labels = (answers.intents || []).map((k) => INTENT_LABEL[k]).filter(Boolean);
  const intentPart = labels.length ? labels.join('·') : '일상';
  const w =
    answers.weight === 'light'
      ? '휴대성 우선'
      : answers.weight === 'heavy'
        ? '성능 우선'
        : '균형';
  const u =
    answers.usedPref === 'new_only'
      ? '신품 위주'
      : answers.usedPref === 'value_first'
        ? '가성비'
        : '중고 가능';
  return `${br}, ${intentPart} 촬영, ${w}, ${u} 조건을 반영해 카탈로그에서 점수 상위 3종을 골랐어요.`;
}

function pickTags(p, answers) {
  const out = [];
  const catSet = new Set(p.categories);
  for (const key of answers.intents) {
    const tags = INTENT_TAGS[key];
    if (!tags) continue;
    for (const t of tags) {
      if (catSet.has(t)) {
        const label =
          t === 'vlog'
            ? '브이로그'
            : t === 'emotional'
              ? '색감·무드'
              : t === 'travel'
                ? '여행·휴대'
                : t === 'beginner'
                  ? '입문 친화'
                  : t === 'value'
                    ? '가성비'
                    : t === 'trending'
                      ? '인기 모델'
                      : t;
        if (!out.includes(label)) out.push(label);
      }
    }
  }
  if (out.length < 2) {
    if (catSet.has('vlog') && !out.includes('브이로그')) out.push('브이로그');
    if (catSet.has('beginner') && !out.includes('입문 친화')) out.push('입문 친화');
  }
  return out.slice(0, 2);
}

/**
 * @param {ChecklistAnswers} answers
 * @returns {{ product: object, score: number, why: string, tags: string[] }[]}
 */
export function rankChecklistProducts(answers) {
  const intents = answers.intents?.length ? answers.intents : ['cafe'];

  const withScores = PICORY_PRODUCT_MOCK.map((p) => {
    const ia = { ...answers, intents };
    const score = scoreProduct(p, ia);
    let intentOverlap = 0;
    const catSet = new Set(p.categories);
    for (const key of intents) {
      for (const t of INTENT_TAGS[key] || []) {
        if (catSet.has(t)) intentOverlap += 1;
      }
    }
    return {
      product: p,
      score,
      why: buildWhySentence(p, { ...answers, intents }, intentOverlap),
      tags: pickTags(p, { ...answers, intents }),
    };
  });

  withScores.sort((a, b) => b.score - a.score);
  return withScores.slice(0, 3);
}

/**
 * @param {HTMLElement} gridEl
 * @param {Array<{ product: object, why: string, tags: string[] }>} rows
 */
export function renderChecklistRows(gridEl, rows) {
  if (!gridEl) return;
  if (!rows.length) {
    gridEl.innerHTML = '<p class="checklist-result__empty">추천을 만들 수 없습니다. 다시 시도해 주세요.</p>';
    return;
  }

  const tagClasses = ['tag--warm', 'tag--bokeh', 'tag--natural'];
  gridEl.innerHTML = rows
    .map((row, i) => {
      const p = row.product;
      const name = `${p.brand} ${p.model}`;
      const img = p.thumbnail || '/images/cameras/default-camera.png';
      const q = encodeURIComponent(name);
      const tags =
        (row.tags || [])
          .map((t, j) => `<span class="tag ${tagClasses[j % tagClasses.length]}">${escapeHtml(t)}</span>`)
          .join('') || `<span class="tag tag--natural">Pictory 추천</span>`;
      const stores = OFFLINE_STORE_GUIDE[p.id] || ['오프라인 매장 정보 준비 중'];
      const storeText = stores.join(' · ');

      return `
      <div class="checklist-result__card card">
        <div class="checklist-result__rank">${i + 1}</div>
        <div class="checklist-result__body">
          <div class="checklist-result__media">
            <div class="checklist-result__camera">
              <img class="checklist-result__camera-img" src="${escapeAttr(img)}" alt="${escapeAttr(name)}">
            </div>
          </div>
          <h4>${escapeHtml(name)}</h4>
          <p class="checklist-result__why">${escapeHtml(row.why)}</p>
          <div class="checklist-result__tags">${tags}</div>
          <div class="checklist-result__offline">
            <strong>오프라인 매장 / 체험 가능 정보 (보류)</strong>
            <p>${escapeHtml(storeText)}</p>
          </div>
          <div class="checklist-result__price-row">
            <span>${escapeHtml(p.priceSummary)}</span>
            <a href="price.html?q=${escapeAttr(q)}" class="btn btn--outline btn--xs">시세 확인</a>
          </div>
        </div>
      </div>`;
    })
    .join('');

  renderChecklistComparison(rows);
}

function renderChecklistComparison(rows) {
  const panel = document.getElementById('checklistComparePanel');
  const table = document.getElementById('checklistCompareTable');
  const photos = document.getElementById('checklistComparePhotos');
  if (!panel || !table || !photos) return;
  if (!rows.length) {
    panel.classList.add('hidden');
    table.innerHTML = '';
    photos.innerHTML = '';
    return;
  }

  const compareItems = rows.slice(0, 3).map((row) => {
    const p = row.product;
    const meta = CAMERA_COMPARE_META[p.id] || {};
    const name = `${p.brand} ${p.model}`;
    return {
      name,
      sensor: meta.sensor || 'APS-C',
      colorTone: meta.colorTone || '자연스러운 기본 톤',
      keyFeature: meta.keyFeature || (p.description || '').slice(0, 42),
      samplePhoto: meta.samplePhoto || { src: p.thumbnail || '/images/cameras/default-camera.png', alt: `${name} 샘플` },
    };
  });

  table.innerHTML = compareItems
    .map((item) => `
      <article class="checklist-compare-card card">
        <h5 class="checklist-compare-card__name">${escapeHtml(item.name)}</h5>
        <dl class="checklist-compare-card__meta">
          <div><dt>사양</dt><dd>${escapeHtml(item.sensor)}</dd></div>
          <div><dt>색감</dt><dd>${escapeHtml(item.colorTone)}</dd></div>
          <div><dt>주요 특징</dt><dd>${escapeHtml(item.keyFeature)}</dd></div>
        </dl>
      </article>
    `)
    .join('');

  photos.innerHTML = compareItems
    .map((item) => `
      <article class="checklist-compare-photo card">
        <img src="${escapeAttr(item.samplePhoto.src)}" alt="${escapeAttr(item.samplePhoto.alt)}" loading="lazy">
        <p>${escapeHtml(item.name)} 실제 사진 톤</p>
      </article>
    `)
    .join('');

  panel.classList.remove('hidden');
}

/**
 * @param {HTMLElement} gridEl
 * @param {ChecklistAnswers} answers
 */
export function renderChecklistResultGrid(gridEl, answers) {
  const top = rankChecklistProducts(answers);
  const rows = top.map((row) => ({ product: row.product, why: row.why, tags: row.tags }));
  renderChecklistRows(gridEl, rows);
}

export function parseChecklistAnswersFromDom(root = document) {
  const s1 = root.querySelector('.checklist-step[data-step="1"] .checklist-option.selected');
  const s2 = root.querySelectorAll('.checklist-step[data-step="2"] .checklist-option.selected');
  const s3 = root.querySelector('.checklist-step[data-step="3"] .checklist-option.selected');
  const s4 = root.querySelector('.checklist-step[data-step="4"] .checklist-option.selected');

  const intents = [...s2].map((el) => el.dataset.value).filter(Boolean);
  return {
    budget: s1?.dataset.value || '100to200',
    intents: intents.length ? intents : ['cafe'],
    weight: s3?.dataset.value || 'mid',
    usedPref: s4?.dataset.value || 'used_ok',
  };
}
