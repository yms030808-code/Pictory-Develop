(() => {
  // js/products/utils.js
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text == null ? "" : String(text);
    return div.innerHTML;
  }
  function escapeAttr(text) {
    return String(text == null ? "" : text).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;");
  }

  // js/products/mockData.js
  var PICORY_PRODUCT_MOCK = [
    {
      id: "fujifilm-x100vi",
      brand: "Fujifilm",
      model: "X100VI",
      /** 정렬용: 대략 최저가(원), 인기순 가중치 */
      priceKrw: 219e4,
      popularity: 98,
      description: "\uACE0\uC815 \uB80C\uC988\uC640 \uD544\uB984 \uC2DC\uBBAC\uB808\uC774\uC158\uC73C\uB85C \uC2A4\uB0C5\xB7\uC77C\uC0C1 \uAE30\uB85D\uC5D0 \uAC15\uD55C \uD480\uD504\uB808\uC784\uAE09 \uC778\uAE30 \uBAA8\uB378\uC785\uB2C8\uB2E4.",
      priceSummary: "\uC57D 2,190,000\uC6D0\uB300 \xB7 \uC815\uAC00 \uAE30\uC900",
      platform: "\uB124\uC774\uBC84 \uC1FC\uD551 \xB7 \uCFE0\uD321 \xB7 \uACF5\uC2DD\uBAB0",
      thumbnail: "/images/cameras/fujifilm-x100vi.png",
      categories: ["trending", "emotional", "community-picks"]
    },
    {
      id: "canon-eos-r10",
      brand: "Canon",
      model: "EOS R10",
      priceKrw: 92e4,
      popularity: 82,
      description: "\uAC00\uBCBC\uC6B4 APS-C \uBBF8\uB7EC\uB9AC\uC2A4\uB85C \uC870\uC791\uC774 \uB2E8\uC21C\uD574 \uC785\uBB38\uC6A9 \uBC14\uB514\uB85C \uB9CE\uC774 \uC120\uD0DD\uB429\uB2C8\uB2E4.",
      priceSummary: "\uC57D 920,000\uC6D0\uB300 ~",
      platform: "\uCFE0\uD321 \xB7 \uB2E4\uB098\uC640 \xB7 \uC911\uACE0\uB098\uB77C",
      thumbnail: "/images/cameras/canon-eos-r10.png",
      categories: ["beginner", "value", "travel"]
    },
    {
      id: "sony-zv-e10-ii",
      brand: "Sony",
      model: "ZV-E10 II",
      priceKrw: 128e4,
      popularity: 92,
      description: "\uBE0C\uC774\uB85C\uADF8\uC5D0 \uB9DE\uCD98 \uC790\uB3D9 \uBAA8\uB4DC\uC640 \uB9C8\uC774\uD06C \uB2E8\uC790 \uAD6C\uC131\uC774 \uAC15\uC810\uC778 APS-C \uAE30\uC885\uC785\uB2C8\uB2E4.",
      priceSummary: "\uC57D 1,280,000\uC6D0\uB300 ~",
      platform: "\uB124\uC774\uBC84 \xB7 \uACF5\uC2DD \uC2A4\uD1A0\uC5B4 \xB7 \uC628\uB77C\uC778 \uBA74\uC138",
      thumbnail: "/images/cameras/sony-zv-e10-ii.png",
      categories: ["vlog", "beginner", "trending"]
    },
    {
      id: "ricoh-gr-iiix",
      brand: "Ricoh",
      model: "GR IIIx",
      priceKrw: 159e4,
      popularity: 88,
      description: "40mm \uD654\uAC01\uC758 \uC2A4\uB0C5 \uD2B9\uD654 \uCEF4\uD329\uD2B8\uB85C \uC8FC\uBA38\uB2C8\uC5D0 \uB123\uACE0 \uB2E4\uB2C8\uAE30 \uC88B\uC2B5\uB2C8\uB2E4.",
      priceSummary: "\uC57D 1,590,000\uC6D0\uB300 ~",
      platform: "\uACF5\uC2DD\uBAB0 \xB7 \uC628\uB77C\uC778 \xB7 \uC911\uACE0",
      thumbnail: "/images/cameras/ricoh-gr-iiix.png",
      categories: ["travel", "emotional", "trending"]
    },
    {
      id: "sony-a7c-ii",
      brand: "Sony",
      model: "A7C II",
      priceKrw: 239e4,
      popularity: 96,
      description: "\uD480\uD504\uB808\uC784 \uC13C\uC11C\uB97C \uC791\uC740 \uBC14\uB514\uC5D0 \uB2F4\uC544 \uC778\uBB3C\xB7\uC5EC\uD589\xB7\uBE0C\uC774\uB85C\uADF8\uAE4C\uC9C0 \uADE0\uD615\uC774 \uC88B\uC2B5\uB2C8\uB2E4.",
      priceSummary: "\uC57D 2,390,000\uC6D0\uB300 ~",
      platform: "\uB2E4\uB098\uC640 \xB7 \uCFE0\uD321 \xB7 \uC624\uD504\uB77C\uC778 \uB300\uB9AC\uC810",
      thumbnail: "/images/cameras/sony-a7c-ii.png",
      categories: ["trending", "emotional", "vlog"]
    },
    {
      id: "nikon-z-fc",
      brand: "Nikon",
      model: "Z fc",
      priceKrw: 119e4,
      popularity: 80,
      description: "\uD544\uB984 SLR \uAC10\uC131\uC758 \uB2E4\uC774\uC5BC \uC870\uC791\uACFC vari-angle LCD\uAC00 \uB9E4\uB825\uC778 APS-C \uBC14\uB514\uC785\uB2C8\uB2E4.",
      priceSummary: "\uC57D 1,190,000\uC6D0\uB300 ~",
      platform: "\uB124\uC774\uBC84 \xB7 \uACF5\uC2DD\uBAB0 \xB7 \uC911\uACE0\uB098\uB77C",
      thumbnail: "/images/cameras/nikon-z-fc.png",
      categories: ["vintage", "emotional", "travel"]
    },
    {
      id: "canon-g7x-mark-iii",
      brand: "Canon",
      model: "PowerShot G7 X Mark III",
      priceKrw: 95e4,
      popularity: 90,
      description: "1\uC778\uCE58 \uC13C\uC11C \uCEF4\uD329\uD2B8\uB85C 4K \uC601\uC0C1\uACFC \uC218\uC9C1 \uCD2C\uC601\uC5D0 \uC801\uD569\uD55C \uD734\uB300\uD615 \uAE30\uC885\uC785\uB2C8\uB2E4.",
      priceSummary: "\uC57D 950,000\uC6D0\uB300 ~",
      platform: "\uCFE0\uD321 \xB7 \uC628\uB77C\uC778 \uBA74\uC138 \xB7 \uC911\uACE0",
      thumbnail: "/images/cameras/canon-g7x-mark-iii.png",
      categories: ["vlog", "travel", "value"]
    },
    {
      id: "dji-osmo-pocket-3",
      brand: "DJI",
      model: "Osmo Pocket 3",
      priceKrw: 649e3,
      popularity: 91,
      description: "3\uCD95 \uC9D0\uBC8C \uC77C\uCCB4\uD615 \uD3EC\uCF13 \uCEA0\uC73C\uB85C \uC190\uB5A8\uB9BC \uBCF4\uC815\uC774 \uAC15\uD55C \uC601\uC0C1 \uAE30\uAE30\uC785\uB2C8\uB2E4.",
      priceSummary: "\uC57D 649,000\uC6D0\uB300 ~",
      platform: "\uACF5\uC2DD \uC2A4\uD1A0\uC5B4 \xB7 \uCFE0\uD321 \xB7 \uBA74\uC138",
      thumbnail: "/images/cameras/dji-osmo-pocket-3.png",
      categories: ["vlog", "travel", "trending"]
    },
    {
      id: "sony-a6700",
      brand: "Sony",
      model: "A6700",
      priceKrw: 152e4,
      popularity: 94,
      description: "\uCD5C\uC2E0 APS-C AF \uC131\uB2A5\uACFC 4K 120p(\uD06C\uB86D) \uB4F1 \uC601\uC0C1 \uC635\uC158\uC774 \uD48D\uBD80\uD55C \uC62C\uB77C\uC6B4\uB354\uC785\uB2C8\uB2E4.",
      priceSummary: "\uC57D 1,520,000\uC6D0\uB300 ~",
      platform: "\uB2E4\uB098\uC640 \xB7 \uB124\uC774\uBC84 \xB7 \uC911\uACE0",
      thumbnail: "/images/cameras/sony-a6700.png",
      categories: ["trending", "vlog", "travel", "beginner"]
    },
    {
      id: "canon-eos-r50",
      brand: "Canon",
      model: "EOS R50",
      priceKrw: 98e4,
      popularity: 93,
      description: "\uAC00\uBCCD\uACE0 \uAC00\uACA9 \uBD80\uB2F4\uC774 \uC801\uC5B4 \uCCAB \uBBF8\uB7EC\uB9AC\uC2A4\uB85C \uBB34\uB09C\uD55C \uC785\uBB38 \uBAA8\uB378\uC785\uB2C8\uB2E4.",
      priceSummary: "\uC57D 980,000\uC6D0\uB300 ~",
      platform: "\uCFE0\uD321 \xB7 \uC628\uB77C\uC778 \xB7 \uC911\uACE0\uB098\uB77C",
      thumbnail: "/images/cameras/canon-eos-r50.png",
      categories: ["beginner", "value", "trending"]
    },
    {
      id: "fujifilm-x-s20",
      brand: "Fujifilm",
      model: "X-S20",
      priceKrw: 178e4,
      popularity: 87,
      description: "\uC190\uB5A8\uB9BC \uBCF4\uC815\uACFC \uBC30\uD130\uB9AC \uC6A9\uB7C9\uC774 \uC88B\uC544 \uC0AC\uC9C4\xB7\uC601\uC0C1 \uACB8\uC6A9\uC73C\uB85C \uC778\uAE30\uC785\uB2C8\uB2E4.",
      priceSummary: "\uC57D 1,780,000\uC6D0\uB300 ~",
      platform: "\uACF5\uC2DD\uBAB0 \xB7 \uB2E4\uB098\uC640 \xB7 \uC911\uACE0",
      thumbnail: "/images/cameras/fujifilm-x-s20.png",
      categories: ["emotional", "vlog", "beginner"]
    },
    {
      id: "canon-eos-r50-v",
      brand: "Canon",
      model: "EOS R50 V",
      priceKrw: 118e4,
      popularity: 79,
      description: "\uC138\uB85C \uC601\uC0C1\xB7\uB77C\uC774\uBE0C\uC5D0 \uB9DE\uCD98 UI\uC640 \uC785\uBB38\uD615 \uC870\uC791\uC774 \uAC15\uC810\uC778 V \uC2DC\uB9AC\uC988\uC785\uB2C8\uB2E4.",
      priceSummary: "\uC57D 1,180,000\uC6D0\uB300 ~",
      platform: "\uB124\uC774\uBC84 \xB7 \uCFE0\uD321 \xB7 \uACF5\uC2DD",
      thumbnail: "/images/cameras/canon-eos-r50-v.png",
      categories: ["vlog", "beginner", "trending"]
    }
  ];

  // js/products/searchNormalize.js
  var KOREAN_BRANDS = {
    \uC18C\uB2C8: "sony",
    \uCE90\uB17C: "canon",
    \uD6C4\uC9C0\uD544\uB984: "fujifilm",
    \uD6C4\uC9C0: "fujifilm",
    \uB2C8\uCF58: "nikon",
    \uB9AC\uCF54: "ricoh",
    \uCF54\uB2E5: "kodak",
    \uC62C\uB9BC\uD478\uC2A4: "olympus",
    "om \uC2DC\uC2A4\uD15C": "om system",
    "om\uC2DC\uC2A4\uD15C": "om system",
    \uB514\uC81C\uC774\uC544\uC774: "dji",
    \uD30C\uB098\uC18C\uB2C9: "panasonic",
    \uC2DC\uADF8\uB9C8: "sigma",
    \uD0D0\uB860: "tamron",
    \uC0BC\uC591: "samyang"
  };
  function normalizeSearchQuery(s) {
    let t = String(s || "").trim().toLowerCase();
    if (!t) return "";
    for (const [ko, en] of Object.entries(KOREAN_BRANDS)) {
      if (t.includes(ko)) t = t.split(ko).join(en);
    }
    if (/\bx100v\b/i.test(t) && !/x100vi/.test(t)) {
      t = t.replace(/\bx100v\b/g, "x100vi");
    }
    return t.replace(/\s+/g, " ").trim();
  }
  function compactAlnum(s) {
    return String(s || "").toLowerCase().replace(/[^a-z0-9가-힣]/g, "");
  }
  function productMatchesQuery(product, rawQuery) {
    const q = normalizeSearchQuery(rawQuery);
    if (!q) return true;
    const full = normalizeSearchQuery(`${product.brand || ""} ${product.model || ""} ${product.id || ""}`);
    const parts = q.split(/\s+/).filter(Boolean);
    const fullCompact = compactAlnum(full);
    return parts.every((w) => {
      if (full.includes(w)) return true;
      const wc = compactAlnum(w);
      return wc.length >= 2 && fullCompact.includes(wc);
    });
  }

  // js/price/buildListings.js
  function hashString(s) {
    let h = 0;
    for (let i = 0; i < s.length; i += 1) {
      h = (h << 5) - h + s.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }
  var LISTING_REF_DATE = new Date(2026, 3, 17);
  function formatWon(n) {
    return `${Math.round(n).toLocaleString("ko-KR")}\uC6D0`;
  }
  function parseMidFromSummary(priceSummary) {
    const m = String(priceSummary || "").match(/([\d,]+)\s*원/);
    if (m) return parseInt(m[1].replace(/,/g, ""), 10);
    return 12e5;
  }
  function addDays(base, deltaDays) {
    const d = new Date(base.getTime());
    d.setDate(d.getDate() + deltaDays);
    return d;
  }
  function formatKoreanCalendarDate(d) {
    return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
  }
  function platformMeta(key) {
    const map = {
      danggeun: { badgeClass: "platform-badge--danggeun", label: "\uB2F9\uADFC" },
      junggo: { badgeClass: "platform-badge--junggo", label: "\uC911\uACE0\uB098\uB77C" },
      bunjang: { badgeClass: "platform-badge--bunjang", label: "\uBC88\uAC1C\uC7A5\uD130" },
      coupang: { badgeClass: "platform-badge--coupang", label: "\uCFE0\uD321" },
      new: { badgeClass: "platform-badge--new", label: "\uB124\uC774\uBC84\uC1FC\uD551" }
    };
    return map[key] || map.danggeun;
  }
  function buildExternalListingUrl(platformKey, searchQuery) {
    const q = (searchQuery || "").trim() || "Sony A7C II";
    const enc = encodeURIComponent(q);
    switch (platformKey) {
      case "danggeun":
        return `https://www.daangn.com/search/${enc}`;
      case "junggo":
        return `https://web.joongna.com/search/${enc}?excludeSold=true&excludeReservation=true`;
      case "bunjang":
        return `https://m.bunjang.co.kr/search/products?q=${enc}&order=date`;
      case "new":
        return `https://search.shopping.naver.com/search/all?query=${enc}`;
      case "coupang":
        return `https://www.coupang.com/np/search?q=${enc}`;
      default:
        return `https://www.daangn.com/search/${enc}`;
    }
  }
  function conditionMeta(key) {
    const map = {
      mint: { rowClass: "condition--mint", label: "\uCD5C\uC0C1" },
      good: { rowClass: "condition--good", label: "\uC0C1\uAE09" },
      fair: { rowClass: "condition--fair", label: "\uC911\uAE09" },
      new: { rowClass: "condition--new", label: "\uC0C8\uC81C\uD488" }
    };
    return map[key] || map.good;
  }
  function buildPriceListingsFromProducts() {
    const rows = [];
    PICORY_PRODUCT_MOCK.forEach((p) => {
      const fullName = `${p.brand} ${p.model}`.trim();
      const mid = parseMidFromSummary(p.priceSummary);
      const h = hashString(p.id);
      const baseUsed = Math.round(mid * 0.93);
      const baseNew = Math.round(mid * 1.14);
      const specs = [
        { platform: "danggeun", condition: "good", title: `${fullName} \uAE09\uCC98 (\uBC15\uC2A4 \uD3EC\uD568)`, offset: -88e3, daysAgo: 1 },
        { platform: "junggo", condition: "mint", title: `${fullName} \uC2E0\uD488\uAE09`, offset: 52e3, daysAgo: 2 },
        { platform: "bunjang", condition: "mint", title: `${fullName} \uBC14\uB514 + \uBCF4\uC99D\uC11C`, offset: 165e3, daysAgo: 3 },
        { platform: "coupang", condition: "new", title: `${fullName} \uB85C\uCF13\uBC30\uC1A1`, offset: -42e3, daysAgo: 1, isNew: true },
        { platform: "new", condition: "new", title: `${fullName} \uC815\uC2DD \uC218\uC785 \uC815\uD488`, offset: 0, daysAgo: 0, isNew: true },
        { platform: "danggeun", condition: "fair", title: `${fullName} \uC911\uACE0 \uC77C\uAD04`, offset: -198e3, daysAgo: 9 }
      ];
      specs.forEach((spec, i) => {
        const jitter = (h + i * 17) % 5 * 7e3;
        const priceVal = spec.isNew ? Math.round(baseNew + jitter) : Math.round(baseUsed + spec.offset + jitter);
        const dateLabel = formatKoreanCalendarDate(addDays(LISTING_REF_DATE, -spec.daysAgo));
        const pf = platformMeta(spec.platform);
        const cd = conditionMeta(spec.condition);
        rows.push({
          productId: p.id,
          searchQuery: fullName,
          platformKey: spec.platform,
          platformLabel: pf.label,
          platformBadgeClass: pf.badgeClass,
          title: spec.title,
          conditionKey: spec.condition,
          conditionLabel: cd.label,
          conditionClass: cd.rowClass,
          price: formatWon(priceVal),
          priceValue: priceVal,
          date: dateLabel
        });
      });
    });
    return rows;
  }
  function filterListingsByQuery(listings, query) {
    const q = normalizeSearchQuery(query);
    if (!q) return [];
    const parts = q.split(/\s+/).filter(Boolean);
    return listings.filter((row) => {
      const hay = normalizeSearchQuery(`${row.searchQuery} ${row.title}`);
      const hayCompact = compactAlnum(hay);
      return parts.every((w) => {
        if (hay.includes(w)) return true;
        const wc = compactAlnum(w);
        return wc.length >= 2 && hayCompact.includes(wc);
      });
    });
  }
  function searchCatalogProducts(query, limit = 12) {
    const qRaw = String(query || "").trim();
    if (!qRaw) return [];
    const q = normalizeSearchQuery(qRaw);
    if (!q) return [];
    const scored = PICORY_PRODUCT_MOCK.map((p) => {
      const full = `${p.brand} ${p.model}`.trim().toLowerCase();
      const fullNorm = normalizeSearchQuery(full);
      const id = String(p.id).toLowerCase();
      let score = 0;
      if (productMatchesQuery(p, qRaw)) {
        if (fullNorm === q) score += 100;
        else if (fullNorm.startsWith(q)) score += 80;
        else if (fullNorm.includes(q)) score += 50;
        else if (normalizeSearchQuery(p.brand).startsWith(q)) score += 40;
        else if (id.includes(q.replace(/\s/g, ""))) score += 25;
        else score += 30;
      } else {
        score = -1;
      }
      return { p, score };
    }).filter((x) => x.score >= 0).sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((x) => x.p);
  }
  function getCatalogProductsForListings(filteredRows) {
    const ids = new Set((filteredRows || []).map((r) => r.productId).filter(Boolean));
    return PICORY_PRODUCT_MOCK.filter((p) => ids.has(p.id));
  }

  // js/price/chart.js
  function hashString2(s) {
    let h = 0;
    for (let i = 0; i < s.length; i += 1) {
      h = (h << 5) - h + s.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }
  var W = 600;
  var H = 200;
  var PAD_T = 24;
  var PAD_B = 28;
  var X0 = 36;
  var X1 = 564;
  var N = 7;
  var CHART_REF_DATE = new Date(2026, 3, 28);
  function monthLabelsRolling7(reference = CHART_REF_DATE) {
    const labels = [];
    for (let i = N - 1; i >= 0; i -= 1) {
      const d = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate() - i * 10);
      labels.push(`${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`);
    }
    return labels;
  }
  function fullMonthLabels(reference = CHART_REF_DATE) {
    const labels = [];
    for (let i = N - 1; i >= 0; i -= 1) {
      const d = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate() - i * 10);
      labels.push(`${d.getFullYear()}\uB144 ${d.getMonth() + 1}\uC6D4 ${d.getDate()}\uC77C`);
    }
    return labels;
  }
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
  function buildMonthlyAverages(anchorAvg, query) {
    const seed = hashString2(query || "default");
    const wobble = (i) => 1 + ((seed >> i * 3) % 17 - 8) / 400;
    const trend = [1.052, 1.038, 1.022, 1.008, 0.995, 0.988, 1];
    const last = trend[N - 1];
    return trend.map((t, i) => Math.round(anchorAvg * t * wobble(i) / last));
  }
  function buildMonthlySeriesFromCatalog(anchorAvg, catalogProducts, query) {
    if (!catalogProducts || catalogProducts.length === 0) {
      return buildMonthlyAverages(anchorAvg, query);
    }
    const seed = hashString2(query + catalogProducts.map((p) => p.id).sort().join("|"));
    const avgCatalog = catalogProducts.reduce((s, p) => s + p.priceKrw, 0) / catalogProducts.length;
    const start = Math.round(avgCatalog * (0.88 + seed % 19 / 250));
    const values = [];
    for (let i = 0; i < N; i += 1) {
      const t = i / (N - 1);
      const mix = start + (anchorAvg - start) * easeInOutQuad(t);
      const wobble = 1 + ((seed >> i * 3 & 31) - 15) / 300;
      values.push(Math.round(mix * wobble));
    }
    values[N - 1] = anchorAvg;
    return values;
  }
  function fallbackAnchorAvg(query) {
    const h = hashString2(query || "Sony A7C II");
    return 21e5 + h % 65e4;
  }
  function formatWonFull(n) {
    return `${Math.round(n).toLocaleString("ko-KR")}\uC6D0`;
  }
  function formatWonMan(n) {
    const man = n / 1e4;
    if (man >= 100) return `${Math.round(man)}\uB9CC`;
    if (man >= 10) return `${(Math.round(man * 10) / 10).toFixed(1)}\uB9CC`;
    return `${Math.round(man * 10) / 10}\uB9CC`;
  }
  function yTicks(minV, maxV, count) {
    const pad = Math.max((maxV - minV) * 0.06, 5e4);
    let lo = minV - pad;
    let hi = maxV + pad;
    if (hi <= lo) hi = lo + 1e5;
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
    return X0 + i / (N - 1) * (X1 - X0);
  }
  function buildHighLowSeries(avgValues, currentLow, currentHigh, query) {
    const seed = hashString2(`${query}|${currentLow}|${currentHigh}|range`);
    const lowStart = Math.round(currentLow * (1.035 + seed % 8 / 500));
    const highStart = Math.round(currentHigh * (1.02 + seed % 7 / 500));
    const lowValues = [];
    const highValues = [];
    for (let i = 0; i < N; i += 1) {
      const t = i / (N - 1);
      const flatStep = i < 2 ? 0 : i < 3 ? 0.55 : 1;
      const lowBase = lowStart + (currentLow - lowStart) * flatStep;
      const highBase = highStart + (currentHigh - highStart) * flatStep;
      const lowWobble = 1 + ((seed >> i * 2 & 7) - 3) / 900;
      const highWobble = 1 + ((seed >> i * 3 & 7) - 3) / 900;
      lowValues.push(Math.round(lowBase * lowWobble));
      highValues.push(Math.round(highBase * highWobble));
      if (t > 0.55) {
        lowValues[i] = Math.round(currentLow * (1 + ((seed >> i & 3) - 1) / 1200));
        highValues[i] = Math.round(currentHigh * (1 + ((seed >> i + 1 & 3) - 1) / 1200));
      }
    }
    lowValues[N - 1] = currentLow;
    highValues[N - 1] = currentHigh;
    return {
      lowValues,
      highValues: highValues.map((v, i) => Math.max(v, lowValues[i] + Math.max(5e4, avgValues[i] * 0.035)))
    };
  }
  function renderPriceChart(mount, filteredListings, query, options = {}) {
    if (!mount) return { values: [], anchorAvg: 0 };
    const { catalogProducts = [] } = options;
    const used = (filteredListings || []).filter((r) => r.conditionKey !== "new");
    const anchorAvg = used.length ? Math.round(used.reduce((s, r) => s + r.priceValue, 0) / used.length) : fallbackAnchorAvg(query);
    const avgValues = catalogProducts.length > 0 ? buildMonthlySeriesFromCatalog(anchorAvg, catalogProducts, query) : buildMonthlyAverages(anchorAvg, query);
    const usedPrices = used.map((r) => Number(r.priceValue)).filter(Number.isFinite);
    const currentLow = usedPrices.length ? Math.min(...usedPrices) : Math.round(anchorAvg * 0.92);
    const currentHigh = usedPrices.length ? Math.max(...usedPrices) : Math.round(anchorAvg * 1.08);
    const currentAvg = usedPrices.length ? Math.round(usedPrices.reduce((s, n) => s + n, 0) / usedPrices.length) : anchorAvg;
    const { lowValues, highValues } = buildHighLowSeries(avgValues, currentLow, currentHigh, query);
    const minV = Math.min(...lowValues);
    const maxV = Math.max(...highValues);
    const { ticks, lo, hi } = yTicks(minV, maxV, 4);
    const lowPoints = lowValues.map((v, i) => ({ x: xAt(i), y: valueToY(v, lo, hi), v, i }));
    const highPoints = highValues.map((v, i) => ({ x: xAt(i), y: valueToY(v, lo, hi), v, i }));
    const lowPolyline = lowPoints.map((p) => `${p.x},${p.y}`).join(" ");
    const highPolyline = highPoints.map((p) => `${p.x},${p.y}`).join(" ");
    const monthShort = monthLabelsRolling7();
    const monthFull = fullMonthLabels();
    const yAxisHtml = ticks.slice().reverse().map((t) => `<span>${formatWonMan(t)}</span>`).join("");
    const xAxisHtml = monthShort.map((lab) => `<span>${escapeHtml(lab)}</span>`).join("");
    const pointGroups = lowPoints.map((lowPoint, i) => {
      const highPoint = highPoints[i];
      return `
    <g class="chart__point" data-month="${escapeAttr(monthFull[i])}" data-low="${escapeAttr(formatWonFull(lowPoint.v))}" data-high="${escapeAttr(formatWonFull(highPoint.v))}">
      <circle class="chart__hit" cx="${lowPoint.x}" cy="${(lowPoint.y + highPoint.y) / 2}" r="16" fill="transparent" style="cursor:pointer"/>
      <circle cx="${highPoint.x}" cy="${highPoint.y}" r="3.5" fill="#20B15A" stroke="#fff" stroke-width="1.2"/>
      <circle cx="${lowPoint.x}" cy="${lowPoint.y}" r="3.5" fill="#EF5B66" stroke="#fff" stroke-width="1.2"/>
    </g>`;
    }).join("");
    const currentStats = `<div class="chart__current-card" role="status">
    <div class="chart__current-row chart__current-row--high"><span><i></i>\uD604 \uCD5C\uACE0\uAC00</span><strong>${escapeHtml(formatWonFull(currentHigh))}</strong></div>
    <div class="chart__current-row chart__current-row--avg"><span><i></i>\uD604\uC7AC \uD3C9\uADE0\uAC00</span><strong>${escapeHtml(formatWonFull(currentAvg))}</strong></div>
    <div class="chart__current-row chart__current-row--low"><span><i></i>\uD604 \uCD5C\uC800\uAC00</span><strong>${escapeHtml(formatWonFull(currentLow))}</strong></div>
  </div>`;
    const lastHigh = highPoints[N - 1];
    const lastLow = lowPoints[N - 1];
    const highGuideY = lastHigh.y;
    const lowGuideY = lastLow.y;
    mount.innerHTML = `
    <div class="chart chart--range">
      ${currentStats}
      <div class="chart__y-axis" aria-hidden="true">${yAxisHtml}</div>
      <div class="chart__area chart__area--interactive">
        <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" class="chart__svg" overflow="visible" focusable="false" aria-hidden="true" id="priceChartSvg">
          <g class="chart__grid">
            ${lowPoints.map((p) => `<line x1="${p.x}" y1="${PAD_T}" x2="${p.x}" y2="${H - PAD_B}" />`).join("")}
          </g>
          <line class="chart__guide chart__guide--high" x1="${X0}" y1="${highGuideY}" x2="${X1}" y2="${highGuideY}" />
          <line class="chart__guide chart__guide--low" x1="${X0}" y1="${lowGuideY}" x2="${X1}" y2="${lowGuideY}" />
          <polyline points="${highPolyline}" fill="none" stroke="#20B15A" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>
          <polyline points="${lowPolyline}" fill="none" stroke="#EF5B66" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>
          <text class="chart__inline-label chart__inline-label--high" x="${X1 - 146}" y="${Math.max(PAD_T + 12, highGuideY - 12)}">\uCD5C\uACE0\uAC00 ${escapeHtml(formatWonFull(currentHigh))}</text>
          <text class="chart__inline-label chart__inline-label--low" x="${X1 - 146}" y="${Math.min(H - PAD_B - 6, lowGuideY + 22)}">\uCD5C\uC800\uAC00 ${escapeHtml(formatWonFull(currentLow))}</text>
          ${pointGroups}
        </svg>
        <div class="chart__x-axis" aria-hidden="true">${xAxisHtml}</div>
        <div class="chart-tooltip" id="chartTooltip" role="tooltip" aria-hidden="true"></div>
      </div>
    </div>
  `;
    const svg = mount.querySelector("#priceChartSvg");
    const tooltip = mount.querySelector("#chartTooltip");
    const area = mount.querySelector(".chart__area--interactive");
    let lastTipKey = "";
    function showTip(textMonth, textLow, textHigh, clientX, clientY) {
      if (!tooltip || !area) return;
      const key = `${textMonth}|${textLow}|${textHigh}`;
      const contentChanged = key !== lastTipKey;
      lastTipKey = key;
      const html = `<span class="chart-tooltip__month">${escapeHtml(textMonth)}</span><span class="chart-tooltip__avg chart-tooltip__avg--high">\uCD5C\uACE0\uAC00 ${escapeHtml(textHigh)}</span><span class="chart-tooltip__avg chart-tooltip__avg--low">\uCD5C\uC800\uAC00 ${escapeHtml(textLow)}</span>`;
      if (contentChanged) {
        tooltip.innerHTML = html;
        tooltip.classList.remove("chart-tooltip--visible");
      }
      tooltip.setAttribute("aria-hidden", "false");
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
            tooltip.classList.add("chart-tooltip--visible");
          });
        } else {
          tooltip.classList.add("chart-tooltip--visible");
        }
      });
    }
    function hideTip() {
      if (!tooltip) return;
      lastTipKey = "";
      tooltip.classList.remove("chart-tooltip--visible");
      tooltip.setAttribute("aria-hidden", "true");
    }
    mount.querySelectorAll(".chart__point").forEach((g) => {
      g.addEventListener("mouseenter", (e) => {
        showTip(g.dataset.month, g.dataset.low, g.dataset.high, e.clientX, e.clientY);
      });
      g.addEventListener("mousemove", (e) => {
        showTip(g.dataset.month, g.dataset.low, g.dataset.high, e.clientX, e.clientY);
      });
      g.addEventListener("mouseleave", hideTip);
    });
    svg?.addEventListener("mouseleave", hideTip);
    return { values: avgValues, anchorAvg, highValues, lowValues };
  }
  function chartInsightText(values) {
    if (!values || values.length < 2) return "\uAC80\uC0C9\uB41C \uC911\uACE0 \uC2DC\uC138 \uCD94\uC774\uB97C \uD655\uC778\uD574 \uBCF4\uC138\uC694.";
    const first = values[0];
    const last = values[values.length - 1];
    const delta = last - first;
    const pct = first ? Math.round(delta / first * 100) : 0;
    if (delta < -first * 0.02) return `\uCD5C\uADFC 7\uAC1C\uC6D4\uAC04 \uD3C9\uADE0 \uC911\uACE0\uAC00 \uC57D ${Math.abs(pct)}% \uD558\uB77D\uD55C \uAD6C\uAC04\uC774\uC5D0\uC694. \uB9E4\uC218 \uD0C0\uC774\uBC0D\uC744 \uAC80\uD1A0\uD574 \uBCF4\uAE30 \uC88B\uC2B5\uB2C8\uB2E4.`;
    if (delta > first * 0.02) return `\uCD5C\uADFC 7\uAC1C\uC6D4\uAC04 \uD3C9\uADE0 \uC911\uACE0\uAC00 \uC57D ${pct}% \uC0C1\uC2B9\uD588\uC5B4\uC694. \uAC00\uACA9 \uBCC0\uB3D9\uC744 \uAC10\uC548\uD574 \uBCF4\uC138\uC694.`;
    return "\uCD5C\uADFC 7\uAC1C\uC6D4\uAC04 \uD3C9\uADE0 \uC911\uACE0\uAC00\uAC00 \uBE44\uAD50\uC801 \uC548\uC815\uC801\uC778 \uAD6C\uAC04\uC774\uC5D0\uC694.";
  }

  // js/price/index.js
  var DEFAULT_QUERY = "";
  function parsePriceNumber(wonStr) {
    const n = parseInt(String(wonStr).replace(/[^0-9]/g, ""), 10);
    return Number.isFinite(n) ? n : null;
  }
  function renderListings(container, items, linkQuery, emptyMessage) {
    if (!container) return;
    if (!items.length) {
      container.innerHTML = `<p class="price-list__empty">${escapeHtml(emptyMessage || "\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uB2E4\uB978 \uBAA8\uB378\uBA85\uC73C\uB85C \uAC80\uC0C9\uD574 \uBCF4\uC138\uC694.")}</p>`;
      return;
    }
    const q = linkQuery && linkQuery.trim() || "";
    container.innerHTML = items.map((row) => {
      const href = buildExternalListingUrl(row.platformKey, q || row.searchQuery);
      return `
    <div class="price-list__item card">
      <span class="price-list__col price-list__col--platform"><span class="platform-badge ${row.platformBadgeClass}">${escapeHtml(row.platformLabel)}</span></span>
      <span class="price-list__col price-list__col--title">${escapeHtml(row.title)}</span>
      <span class="price-list__col price-list__col--condition"><span class="condition ${row.conditionClass}">${escapeHtml(row.conditionLabel)}</span></span>
      <span class="price-list__col price-list__col--price"><strong>${escapeHtml(row.price)}</strong></span>
      <span class="price-list__col price-list__col--date">${escapeHtml(row.date)}</span>
      <span class="price-list__col price-list__col--action"><a class="btn btn--outline btn--xs" href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer">\uBCF4\uB7EC\uAC00\uAE30</a></span>
    </div>
  `;
    }).join("");
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
      if (elNew) elNew.textContent = "\u2014";
      if (elUsed) elUsed.textContent = "\u2014";
      if (elSave) elSave.textContent = "\u2014";
      if (srcNew) srcNew.textContent = "\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC5B4\uC694";
      if (srcUsed) srcUsed.textContent = "\uB9E4\uBB3C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4";
      if (srcSave) srcSave.textContent = "\u2014";
      return;
    }
    const newPrices = items.filter((r) => r.conditionKey === "new").map((r) => parsePriceNumber(r.price)).filter(Boolean);
    const usedPrices = items.filter((r) => r.conditionKey !== "new").map((r) => parsePriceNumber(r.price)).filter(Boolean);
    const minNew = newPrices.length ? Math.min(...newPrices) : Math.min(...nums);
    const avgUsed = usedPrices.length ? Math.round(usedPrices.reduce((a, b) => a + b, 0) / usedPrices.length) : Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
    const save = Math.max(0, minNew - avgUsed);
    const fmt = (n) => `${n.toLocaleString("ko-KR")}<small>\uC6D0</small>`;
    if (elNew) elNew.innerHTML = fmt(minNew);
    if (elUsed) elUsed.innerHTML = fmt(avgUsed);
    if (elSave) elSave.innerHTML = fmt(save);
    if (srcNew) srcNew.textContent = "\uAC80\uC0C9\uB41C \uBAA9\uB85D \uC911 \uC2E0\uD488 \uCD5C\uC800";
    if (srcUsed) srcUsed.textContent = "\uAC80\uC0C9\uB41C \uC911\uACE0 \uB9E4\uBB3C \uD3C9\uADE0";
    if (srcSave) srcSave.textContent = "\uC704 \uB450 \uAC12 \uAE30\uC900 \uC608\uC0C1 \uCC28\uC774";
  }
  function updateChartTitle(chartTitleEl, queryLabel, hasQuery) {
    if (!chartTitleEl) return;
    chartTitleEl.textContent = hasQuery ? `${queryLabel} \xB7 \uCD5C\uADFC 7\uAC1C\uC6D4 \uC911\uACE0 \uC2DC\uC138 \uCD94\uC774` : "\uCD5C\uADFC 7\uAC1C\uC6D4 \uC911\uACE0 \uC2DC\uC138 \uCD94\uC774";
  }
  function renderChartEmpty(chartContainer, insightTextEl) {
    if (chartContainer) {
      chartContainer.innerHTML = '<p class="price-chart__empty">\uCE74\uD0C8\uB85C\uADF8\uC5D0 \uC788\uB294 \uBAA8\uB378\uBA85\uC744 \uAC80\uC0C9\uD558\uBA74, \uD574\uB2F9 \uB9E4\uBB3C \uAE30\uC900 \uC2DC\uC138 \uCD94\uC774\uAC00 \uD45C\uC2DC\uB429\uB2C8\uB2E4.</p>';
    }
    if (insightTextEl) insightTextEl.textContent = "";
  }
  function applyFromUrl(allListings, input, listContainer, summaryRoot, chartTitleEl, chartContainer, insightTextEl) {
    const params = new URLSearchParams(window.location.search);
    const rawQ = params.get("q");
    const query = (rawQ != null && rawQ.trim() !== "" ? rawQ : DEFAULT_QUERY).trim();
    if (input) input.value = query;
    if (!query) {
      renderListings(
        listContainer,
        [],
        "",
        "\uC0C1\uB2E8 \uAC80\uC0C9\uCC3D\uC5D0 \uBE0C\uB79C\uB4DC\xB7\uBAA8\uB378\uBA85\uC744 \uC785\uB825\uD574 \uBCF4\uC138\uC694. (\uC608: Sony) \uBAA9\uB85D\uC5D0\uC11C \uC0C1\uD488\uC744 \uACE0\uB974\uBA74 \uD574\uB2F9 \uBAA8\uB378 \uC2DC\uC138\uAC00 \uD45C\uC2DC\uB429\uB2C8\uB2E4."
      );
      updateSummary(summaryRoot, []);
      updateChartTitle(chartTitleEl, "", false);
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
        suggestEl.innerHTML = "";
        input.setAttribute("aria-expanded", "false");
        return;
      }
      suggestEl.innerHTML = items.map((p) => {
        const label = `${p.brand} ${p.model}`;
        return `<li class="price-search__suggest-item" role="option">
          <button type="button" class="price-search__suggest-btn" data-q="${escapeAttr(label)}">
            <span class="price-search__suggest-name">${escapeHtml(label)}</span>
            <span class="price-search__suggest-meta">${escapeHtml(p.priceSummary || "")}</span>
          </button>
        </li>`;
      }).join("");
      suggestEl.hidden = false;
      input.setAttribute("aria-expanded", "true");
    }
    input.addEventListener("input", () => {
      renderSuggest();
    });
    input.addEventListener("focus", () => {
      renderSuggest();
    });
    suggestEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-q]");
      if (!btn) return;
      const v = btn.getAttribute("data-q") || "";
      onPick(v);
    });
    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof Node)) return;
      if (input.contains(t) || suggestEl.contains(t)) return;
      suggestEl.hidden = true;
      input.setAttribute("aria-expanded", "false");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        suggestEl.hidden = true;
        input.setAttribute("aria-expanded", "false");
      }
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("priceSearchInput");
    const btn = document.getElementById("priceSearchBtn");
    const listContainer = document.getElementById("priceListResults");
    const summaryRoot = document.getElementById("priceSummary");
    const chartTitleEl = document.querySelector(".price-chart__title");
    const chartContainer = document.getElementById("chartContainer");
    const insightTextEl = document.getElementById("priceChartInsightText");
    const suggestEl = document.getElementById("priceSearchSuggest");
    if (!listContainer) return;
    const allListings = buildPriceListingsFromProducts();
    const run = () => applyFromUrl(allListings, input, listContainer, summaryRoot, chartTitleEl, chartContainer, insightTextEl);
    function submitSearch() {
      const v = input?.value.trim() || "";
      const url = new URL(window.location.href);
      if (v) url.searchParams.set("q", v);
      else url.searchParams.delete("q");
      window.history.pushState({}, "", `${url.pathname}${url.search}`);
      run();
      if (suggestEl) suggestEl.hidden = true;
      input?.setAttribute("aria-expanded", "false");
    }
    mountSearchSuggest(input, suggestEl, (picked) => {
      if (input) input.value = picked;
      submitSearch();
    });
    run();
    btn?.addEventListener("click", submitSearch);
    input?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submitSearch();
      }
    });
    window.addEventListener("popstate", run);
  });
})();
