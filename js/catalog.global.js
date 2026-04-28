(function () {
  const catalog = [
    {
      id: 'fujifilm-x100vi',
      brand: 'Fujifilm',
      model: 'X100VI',
      priceSummary: '약 2,190,000원대 · 정가 기준',
      categoryLabel: '트렌딩',
    },
    {
      id: 'canon-eos-r10',
      brand: 'Canon',
      model: 'EOS R10',
      priceSummary: '약 920,000원대 ~',
      categoryLabel: '입문',
    },
    {
      id: 'sony-zv-e10-ii',
      brand: 'Sony',
      model: 'ZV-E10 II',
      priceSummary: '약 1,280,000원대 ~',
      categoryLabel: '브이로그',
    },
    {
      id: 'ricoh-gr-iiix',
      brand: 'Ricoh',
      model: 'GR IIIx',
      priceSummary: '약 1,590,000원대 ~',
      categoryLabel: '여행/스냅',
    },
    {
      id: 'sony-a7c-ii',
      brand: 'Sony',
      model: 'A7C II',
      priceSummary: '약 2,390,000원대 ~',
      categoryLabel: '트렌딩',
    },
    {
      id: 'nikon-z-fc',
      brand: 'Nikon',
      model: 'Z fc',
      priceSummary: '약 1,190,000원대 ~',
      categoryLabel: '감성',
    },
    {
      id: 'canon-g7x-mark-iii',
      brand: 'Canon',
      model: 'PowerShot G7 X Mark III',
      priceSummary: '약 950,000원대 ~',
      categoryLabel: '컴팩트/브이로그',
    },
    {
      id: 'dji-osmo-pocket-3',
      brand: 'DJI',
      model: 'Osmo Pocket 3',
      priceSummary: '약 649,000원대 ~',
      categoryLabel: '브이로그',
    },
    {
      id: 'sony-a6700',
      brand: 'Sony',
      model: 'A6700',
      priceSummary: '약 1,520,000원대 ~',
      categoryLabel: '올라운더',
    },
    {
      id: 'canon-eos-r50',
      brand: 'Canon',
      model: 'EOS R50',
      priceSummary: '약 980,000원대 ~',
      categoryLabel: '입문',
    },
    {
      id: 'fujifilm-x-s20',
      brand: 'Fujifilm',
      model: 'X-S20',
      priceSummary: '약 1,780,000원대 ~',
      categoryLabel: '감성',
    },
    {
      id: 'canon-eos-r50-v',
      brand: 'Canon',
      model: 'EOS R50 V',
      priceSummary: '약 1,180,000원대 ~',
      categoryLabel: '브이로그',
    },
  ];

  try {
    window.PICORY_CATALOG = Array.isArray(window.PICORY_CATALOG) ? window.PICORY_CATALOG : catalog;
  } catch (_) {
    /* noop */
  }
})();

