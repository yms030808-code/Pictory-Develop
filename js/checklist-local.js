(function () {
  const PRODUCTS = [
    { id: 'fujifilm-x100vi', brand: 'Fujifilm', model: 'X100VI', priceKrw: 2190000, popularity: 98, description: '고정 렌즈와 필름 시뮬레이션으로 스냅·일상 기록에 강한 인기 모델입니다.', priceSummary: '약 2,190,000원대 · 정가 기준', thumbnail: '/images/cameras/fujifilm-x100vi.png', categories: ['trending', 'emotional'] },
    { id: 'canon-eos-r10', brand: 'Canon', model: 'EOS R10', priceKrw: 920000, popularity: 82, description: '가벼운 APS-C 미러리스로 조작이 단순해 입문용 바디로 많이 선택됩니다.', priceSummary: '약 920,000원대 ~', thumbnail: '/images/cameras/canon-eos-r10.png', categories: ['beginner', 'value', 'travel'] },
    { id: 'sony-zv-e10-ii', brand: 'Sony', model: 'ZV-E10 II', priceKrw: 1280000, popularity: 92, description: '브이로그에 맞춘 자동 모드와 마이크 단자 구성이 강점인 APS-C 기종입니다.', priceSummary: '약 1,280,000원대 ~', thumbnail: '/images/cameras/sony-zv-e10-ii.png', categories: ['vlog', 'beginner', 'trending'] },
    { id: 'ricoh-gr-iiix', brand: 'Ricoh', model: 'GR IIIx', priceKrw: 1590000, popularity: 88, description: '40mm 화각의 스냅 특화 컴팩트로 주머니에 넣고 다니기 좋습니다.', priceSummary: '약 1,590,000원대 ~', thumbnail: '/images/cameras/ricoh-gr-iiix.png', categories: ['travel', 'emotional', 'trending'] },
    { id: 'sony-a7c-ii', brand: 'Sony', model: 'A7C II', priceKrw: 2390000, popularity: 96, description: '풀프레임 센서를 작은 바디에 담아 인물·여행·브이로그까지 균형이 좋습니다.', priceSummary: '약 2,390,000원대 ~', thumbnail: '/images/cameras/sony-a7c-ii.png', categories: ['trending', 'emotional', 'vlog'] },
    { id: 'nikon-z-fc', brand: 'Nikon', model: 'Z fc', priceKrw: 1190000, popularity: 80, description: '필름 SLR 감성의 다이얼 조작과 vari-angle LCD가 매력인 APS-C 바디입니다.', priceSummary: '약 1,190,000원대 ~', thumbnail: '/images/cameras/nikon-z-fc.png', categories: ['vintage', 'emotional', 'travel'] },
    { id: 'canon-g7x-mark-iii', brand: 'Canon', model: 'PowerShot G7 X Mark III', priceKrw: 950000, popularity: 90, description: '1인치 센서 컴팩트로 4K 영상과 수직 촬영에 적합한 휴대형 기종입니다.', priceSummary: '약 950,000원대 ~', thumbnail: '/images/cameras/canon-g7x-mark-iii.png', categories: ['vlog', 'travel', 'value'] },
    { id: 'dji-osmo-pocket-3', brand: 'DJI', model: 'Osmo Pocket 3', priceKrw: 649000, popularity: 91, description: '3축 짐벌 일체형 포켓 캠으로 손떨림 보정이 강한 영상 기기입니다.', priceSummary: '약 649,000원대 ~', thumbnail: '/images/cameras/dji-osmo-pocket-3.png', categories: ['vlog', 'travel', 'trending'] },
    { id: 'sony-a6700', brand: 'Sony', model: 'A6700', priceKrw: 1520000, popularity: 94, description: '최신 APS-C AF 성능과 영상 옵션이 풍부한 올라운더입니다.', priceSummary: '약 1,520,000원대 ~', thumbnail: '/images/cameras/sony-a6700.png', categories: ['trending', 'vlog', 'travel', 'beginner'] },
    { id: 'canon-eos-r50', brand: 'Canon', model: 'EOS R50', priceKrw: 980000, popularity: 93, description: '가볍고 가격 부담이 적어 첫 미러리스로 무난한 입문 모델입니다.', priceSummary: '약 980,000원대 ~', thumbnail: '/images/cameras/canon-eos-r50.png', categories: ['beginner', 'value', 'trending'] },
    { id: 'fujifilm-x-s20', brand: 'Fujifilm', model: 'X-S20', priceKrw: 1780000, popularity: 87, description: '손떨림 보정과 배터리 용량이 좋아 사진·영상 겸용으로 인기입니다.', priceSummary: '약 1,780,000원대 ~', thumbnail: '/images/cameras/fujifilm-x-s20.png', categories: ['emotional', 'vlog', 'beginner'] },
    { id: 'canon-eos-r50-v', brand: 'Canon', model: 'EOS R50 V', priceKrw: 1180000, popularity: 79, description: '세로 영상·라이브에 맞춘 UI와 입문형 조작이 강점인 V 시리즈입니다.', priceSummary: '약 1,180,000원대 ~', thumbnail: '/images/cameras/canon-eos-r50-v.png', categories: ['vlog', 'beginner', 'trending'] },
  ];

  const BUDGET_RANGE = {
    under100: { min: 0, max: 1050000, label: '100만원 이하' },
    '100to200': { min: 750000, max: 2100000, label: '100~200만원' },
    '200to300': { min: 1650000, max: 3300000, label: '200~300만원' },
    over300: { min: 1850000, max: 9999999999, label: '300만원 이상' },
  };
  const INTENT_TAGS = {
    portrait: ['emotional', 'trending'],
    cafe: ['emotional', 'beginner'],
    landscape: ['travel', 'emotional'],
    vlog: ['vlog', 'trending'],
    travel: ['travel', 'value'],
    product: ['emotional', 'beginner'],
  };
  const INTENT_LABEL = {
    portrait: '인물',
    cafe: '카페·일상',
    landscape: '풍경',
    vlog: '영상·브이로그',
    travel: '여행',
    product: '제품·음식',
  };
  const COMPACT_IDS = new Set(['dji-osmo-pocket-3', 'canon-g7x-mark-iii', 'ricoh-gr-iiix', 'canon-eos-r50', 'canon-eos-r50-v', 'sony-zv-e10-ii', 'canon-eos-r10']);
  const PERFORMANCE_IDS = new Set(['sony-a7c-ii', 'sony-a6700', 'fujifilm-x100vi']);

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch] || ch));
  }

  function budgetFitScore(priceKrw, budgetKey) {
    const range = BUDGET_RANGE[budgetKey] || BUDGET_RANGE['100to200'];
    if (priceKrw >= range.min && priceKrw <= range.max) return 42;
    if (priceKrw < range.min) return 28;
    return Math.max(0, 22 - Math.min(20, Math.floor((priceKrw - range.max) / 120000)));
  }

  function scoreProduct(product, answers) {
    const intents = answers.intents?.length ? answers.intents : ['cafe'];
    const cats = new Set(product.categories);
    let score = budgetFitScore(product.priceKrw, answers.budget) + (product.popularity || 0) * 0.12;
    intents.forEach((key) => (INTENT_TAGS[key] || []).forEach((tag) => { if (cats.has(tag)) score += 16; }));
    if (answers.weight === 'light' && COMPACT_IDS.has(product.id)) score += 26;
    if (answers.weight === 'heavy' && PERFORMANCE_IDS.has(product.id)) score += 26;
    if (answers.weight === 'mid') score += 10;
    if (answers.usedPref === 'value_first' && cats.has('value')) score += 18;
    if (answers.usedPref === 'new_only' && product.priceKrw <= 1450000) score += 14;
    if (answers.usedPref === 'used_ok') score += 8;
    return score;
  }

  function parseChecklistAnswersFromDom(root = document) {
    const intents = Array.from(root.querySelectorAll('.checklist-step[data-step="2"] .checklist-option.selected')).map((el) => el.dataset.value).filter(Boolean);
    return {
      budget: root.querySelector('.checklist-step[data-step="1"] .checklist-option.selected')?.dataset.value || '100to200',
      intents: intents.length ? intents : ['cafe'],
      weight: root.querySelector('.checklist-step[data-step="3"] .checklist-option.selected')?.dataset.value || 'mid',
      usedPref: root.querySelector('.checklist-step[data-step="4"] .checklist-option.selected')?.dataset.value || 'used_ok',
    };
  }

  function formatChecklistSummary(answers) {
    const budget = BUDGET_RANGE[answers.budget]?.label || '선택 예산';
    const intents = (answers.intents || []).map((key) => INTENT_LABEL[key]).filter(Boolean).join('·') || '일상';
    const weight = answers.weight === 'light' ? '휴대성 우선' : answers.weight === 'heavy' ? '성능 우선' : '균형';
    const used = answers.usedPref === 'new_only' ? '신품 위주' : answers.usedPref === 'value_first' ? '가성비' : '중고 가능';
    return `${budget}, ${intents} 촬영, ${weight}, ${used} 조건을 반영해 카탈로그에서 점수 상위 3종을 골랐어요.`;
  }

  function rankChecklistProducts(answers) {
    return PRODUCTS
      .map((product) => ({
        product,
        score: scoreProduct(product, answers),
        why: `${product.description} 선택하신 조건과 가격대, 촬영 목적을 함께 반영한 추천입니다.`,
        tags: (answers.intents || ['cafe']).slice(0, 2).map((key) => INTENT_LABEL[key] || 'Pictory 추천'),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  function renderChecklistRows(gridEl, rows) {
    if (!gridEl) return;
    gridEl.innerHTML = rows.map((row, index) => {
      const product = row.product;
      const name = `${product.brand} ${product.model}`;
      const tags = (row.tags || ['Pictory 추천']).map((tag) => `<span class="tag tag--natural">${escapeHtml(tag)}</span>`).join('');
      return `
        <div class="checklist-result__card card" data-camera-name="${escapeHtml(name)}" data-camera-price="${escapeHtml(product.priceSummary)}">
          <div class="checklist-result__rank">${index + 1}</div>
          <button type="button" class="bookmark-add checklist-result__bookmark" aria-label="${escapeHtml(name)} 북마크 추가">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
          <div class="checklist-result__body">
            <div class="checklist-result__media">
              <div class="checklist-result__camera">
                <img class="checklist-result__camera-img" src="${product.thumbnail}" alt="${escapeHtml(name)}">
              </div>
            </div>
            <h4>${escapeHtml(name)}</h4>
            <p class="checklist-result__why">${escapeHtml(row.why)}</p>
            <div class="checklist-result__tags">${tags}</div>
            <div class="checklist-result__price-row">
              <span>${escapeHtml(product.priceSummary)}</span>
              <a href="price.html?q=${encodeURIComponent(name)}" class="btn btn--outline btn--xs">시세 확인</a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderChecklistResultGrid(gridEl, answers) {
    renderChecklistRows(gridEl, rankChecklistProducts(answers));
  }

  window.PicoryChecklistLocal = {
    parseChecklistAnswersFromDom,
    formatChecklistSummary,
    rankChecklistProducts,
    renderChecklistRows,
    renderChecklistResultGrid,
  };
}());
