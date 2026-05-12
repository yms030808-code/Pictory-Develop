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
    {
      id: 'nikon-z50ii',
      brand: 'Nikon',
      model: 'Z50II',
      priceSummary: '약 1,290,000원대 ~',
      categoryLabel: '입문/여행',
    },
    {
      id: 'canon-eos-r8',
      brand: 'Canon',
      model: 'EOS R8',
      priceSummary: '약 1,890,000원대 ~',
      categoryLabel: '풀프레임',
    },
    {
      id: 'sony-rx100-vii',
      brand: 'Sony',
      model: 'RX100 VII',
      priceSummary: '약 1,490,000원대 ~',
      categoryLabel: '컴팩트',
    },
    {
      id: 'panasonic-lumix-s9',
      brand: 'Panasonic',
      model: 'Lumix S9',
      priceSummary: '약 1,990,000원대 ~',
      categoryLabel: '브이로그',
    },
    {
      id: 'panasonic-lumix-gh7',
      brand: 'Panasonic',
      model: 'Lumix GH7',
      priceSummary: '약 2,790,000원대 ~',
      categoryLabel: '영상',
    },
    {
      id: 'om-system-om-3',
      brand: 'OM System',
      model: 'OM-3',
      priceSummary: '약 2,390,000원대 ~',
      categoryLabel: '여행/아웃도어',
    },
    {
      id: 'fujifilm-x-m5',
      brand: 'Fujifilm',
      model: 'X-M5',
      priceSummary: '약 1,190,000원대 ~',
      categoryLabel: '입문/브이로그',
    },
    {
      id: 'leica-d-lux-8',
      brand: 'Leica',
      model: 'D-Lux 8',
      priceSummary: '약 2,390,000원대 ~',
      categoryLabel: '프리미엄 컴팩트',
    },
    {
      id: 'sigma-fp-l',
      brand: 'Sigma',
      model: 'fp L',
      priceSummary: '약 2,990,000원대 ~',
      categoryLabel: '풀프레임',
    },
    {
      id: 'kodak-pixpro-fz55',
      brand: 'Kodak',
      model: 'Pixpro FZ55',
      priceSummary: '약 230,000원대 ~',
      categoryLabel: '가성비/CCD',
    },
  ];

  try {
    window.PICORY_CATALOG = Array.isArray(window.PICORY_CATALOG) ? window.PICORY_CATALOG : catalog;
  } catch (_) {
    /* noop */
  }
})();

