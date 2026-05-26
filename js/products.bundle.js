(() => {
  // js/products/categories.js
  var PICORY_PRODUCT_CATEGORIES = [
    { key: "trending", label: "\uC9C0\uAE08 \uC778\uAE30" },
    { key: "beginner", label: "\uC785\uBB38 \uCD94\uCC9C" },
    { key: "emotional", label: "\uAC10\uC131 \uC0AC\uC9C4" },
    { key: "travel", label: "\uC5EC\uD589\uC6A9" },
    { key: "vlog", label: "\uBE0C\uC774\uB85C\uADF8" },
    { key: "value", label: "\uAC00\uC131\uBE44" },
    { key: "vintage", label: "\uBE48\uD2F0\uC9C0/CCD" }
  ];

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
      categories: ["trending", "emotional", "travel"]
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
    },
    {
      id: "nikon-z50ii",
      brand: "Nikon",
      model: "Z50II",
      priceKrw: 129e4,
      popularity: 89,
      description: "EXPEED 7과 피사체 인식 AF를 갖춘 APS-C 미러리스로 가족·여행·영상까지 균형이 좋습니다.",
      priceSummary: "약 1,290,000원대 ~",
      platform: "네이버 · 중고나라 · 공식몰",
      thumbnail: "https://2.img-dpreview.com/files/p/TS60x60PFFFFFF00~products/nikon_z50ii/c12f842d4d1a40beb20e7264c1ceccda.png",
      categories: ["beginner", "travel", "trending"]
    },
    {
      id: "canon-eos-r8",
      brand: "Canon",
      model: "EOS R8",
      priceKrw: 189e4,
      popularity: 86,
      description: "가벼운 풀프레임 바디에 빠른 AF와 4K 60p를 담아 인물·여행용으로 접근성이 좋습니다.",
      priceSummary: "약 1,890,000원대 ~",
      platform: "쿠팡 · 네이버 · 다나와",
      thumbnail: "https://img.photographyblog.com/reviews/canon_eos_r8/sample_images/canon_eos_r8_01.jpg",
      categories: ["travel", "emotional", "value"]
    },
    {
      id: "sony-rx100-vii",
      brand: "Sony",
      model: "RX100 VII",
      priceKrw: 149e4,
      popularity: 84,
      description: "작은 바디에 빠른 AF와 고배율 줌을 담은 프리미엄 컴팩트로 여행 기록에 강합니다.",
      priceSummary: "약 1,490,000원대 ~",
      platform: "네이버 · 쿠팡 · 중고",
      thumbnail: "https://img.photographyblog.com/reviews/sony_cyber_shot_rx100_vii/sample_images/sony_cyber_shot_rx100_vii_01.jpg",
      categories: ["travel", "value", "vlog"]
    },
    {
      id: "panasonic-lumix-s9",
      brand: "Panasonic",
      model: "Lumix S9",
      priceKrw: 199e4,
      popularity: 83,
      description: "LUT 기반 컬러 워크플로와 작은 풀프레임 바디로 영상·일상 스냅에 어울립니다.",
      priceSummary: "약 1,990,000원대 ~",
      platform: "공식몰 · 네이버 · 중고",
      thumbnail: "https://img.photographyblog.com/reviews/panasonic_lumix_s9/sample_images/panasonic_lumix_s9_01.jpg",
      categories: ["vlog", "emotional", "travel"]
    },
    {
      id: "panasonic-lumix-gh7",
      brand: "Panasonic",
      model: "Lumix GH7",
      priceKrw: 279e4,
      popularity: 85,
      description: "마이크로포서즈 영상 플래그십으로 고급 코덱과 손떨림 보정, 긴 촬영 안정성이 강점입니다.",
      priceSummary: "약 2,790,000원대 ~",
      platform: "공식몰 · 다나와 · 네이버",
      thumbnail: "https://1.img-dpreview.com/files/p/TC190x190S190x190~sample_galleries/5275401087/7345797023.jpg",
      categories: ["vlog", "trending"]
    },
    {
      id: "om-system-om-3",
      brand: "OM System",
      model: "OM-3",
      priceKrw: 239e4,
      popularity: 81,
      description: "클래식한 디자인에 방진방적과 강력한 손떨림 보정을 더한 여행·아웃도어형 미러리스입니다.",
      priceSummary: "약 2,390,000원대 ~",
      platform: "공식몰 · 네이버 · 중고",
      thumbnail: "https://4.img-dpreview.com/files/p/TC190x190S190x190~sample_galleries/1564684221/4315193761.jpg",
      categories: ["travel", "vintage", "emotional"]
    },
    {
      id: "fujifilm-x-m5",
      brand: "Fujifilm",
      model: "X-M5",
      priceKrw: 119e4,
      popularity: 88,
      description: "작은 바디와 필름 시뮬레이션, 영상 친화 UI를 갖춘 입문·브이로그용 X 시리즈입니다.",
      priceSummary: "약 1,190,000원대 ~",
      platform: "공식몰 · 쿠팡 · 네이버",
      thumbnail: "https://1.img-dpreview.com/files/p/TC190x190S190x190~sample_galleries/6845601350/1452105376.jpg",
      categories: ["beginner", "vlog", "emotional"]
    },
    {
      id: "leica-d-lux-8",
      brand: "Leica",
      model: "D-Lux 8",
      priceKrw: 239e4,
      popularity: 77,
      description: "밝은 줌렌즈와 클래식한 조작계를 갖춘 프리미엄 컴팩트로 일상 스냅에 잘 맞습니다.",
      priceSummary: "약 2,390,000원대 ~",
      platform: "공식몰 · 네이버 · 중고",
      thumbnail: "https://4.img-dpreview.com/files/p/TS60x60PFFFFFF00~products/leica_dlux8/cd1fcfa8664d44b38cb04577f0b2ada4.png",
      categories: ["vintage", "emotional", "travel"]
    },
    {
      id: "sigma-fp-l",
      brand: "Sigma",
      model: "fp L",
      priceKrw: 299e4,
      popularity: 72,
      description: "초소형 풀프레임 바디와 61MP 센서가 특징인 모듈형 카메라로 사진·시네마 작업에 독특합니다.",
      priceSummary: "약 2,990,000원대 ~",
      platform: "공식몰 · 다나와 · 중고",
      thumbnail: "https://img.photographyblog.com/reviews/sigma_fp_l/sample_images/sigma_fp_l_01.jpg",
      categories: ["emotional", "vintage"]
    },
    {
      id: "kodak-pixpro-fz55",
      brand: "Kodak",
      model: "Pixpro FZ55",
      priceKrw: 23e4,
      popularity: 74,
      description: "가볍고 저렴한 CCD 감성 컴팩트로 휴대폰과 다른 색감의 일상 기록용으로 찾는 모델입니다.",
      priceSummary: "약 230,000원대 ~",
      platform: "쿠팡 · 네이버 · 중고",
      thumbnail: "https://m.media-amazon.com/images/I/71lI8A2AvzL._AC_SL1500_.jpg",
      categories: ["value", "vintage", "travel"]
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

  // js/products/filterProducts.js
  function filterProductsByCategory(products, categoryKey) {
    if (!categoryKey) return products;
    return products.filter((product) => Array.isArray(product.categories) && product.categories.includes(categoryKey));
  }
  function filterProductsByCategoryAndSearch(products, categoryKey, searchQuery) {
    const sq = String(searchQuery || "").trim();
    if (!sq) return filterProductsByCategory(products, categoryKey);
    return products.filter((p) => productMatchesQuery(p, sq));
  }

  // js/products/utils.js
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text == null ? "" : String(text);
    return div.innerHTML;
  }
  function escapeAttr(text) {
    return String(text == null ? "" : text).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;");
  }
  function assetUrl(path) {
    if (!path) return "";
    const clean = String(path).replace(/^\//, "");
    if (typeof window !== "undefined" && window.location.pathname.includes("/m/")) {
      return `../${clean}`;
    }
    return clean;
  }
  function pageRelative(filename) {
    if (typeof window !== "undefined" && window.location.pathname.includes("/m/")) {
      return `../${filename}`;
    }
    return filename;
  }

  // js/products/categoryNav.js
  function mountCategoryNav(root, categories, options) {
    const { onChange, initialKey } = options;
    let activeKey = initialKey && categories.some((c) => c.key === initialKey) ? initialKey : categories[0].key;
    root.innerHTML = categories.map((cat) => {
      const active = cat.key === activeKey ? " filter-chip--active" : "";
      const pressed = cat.key === activeKey ? "true" : "false";
      return `<button type="button" class="filter-chip product-catalog-nav__chip${active}" data-key="${escapeAttr(cat.key)}" aria-pressed="${pressed}">${escapeHtml(cat.label)}</button>`;
    }).join("");
    root.querySelectorAll("button[data-key]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-key");
        if (!key || key === activeKey) return;
        activeKey = key;
        root.querySelectorAll("button[data-key]").forEach((b) => {
          const on = b.getAttribute("data-key") === activeKey;
          b.classList.toggle("filter-chip--active", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
        onChange(activeKey);
      });
    });
    return {
      getActiveKey: () => activeKey
    };
  }

  // js/products/productCard.js
  var CAMERA_THUMB_FALLBACK = "/images/cameras/default-camera.png";
  function splitPriceSummary(priceSummary) {
    const raw = (priceSummary || "").trim();
    const sep = raw.indexOf(" \u00B7 ");
    if (sep === -1) return { price: raw, note: "" };
    return {
      price: raw.slice(0, sep).trim(),
      note: raw.slice(sep + 3).trim()
    };
  }
  function renderProductCardHTML(product) {
    const thumb = assetUrl(product.thumbnail || CAMERA_THUMB_FALLBACK);
    const alt = `${product.brand || ""} ${product.model || ""}`.trim();
    const searchQ = `${product.brand || ""} ${product.model || ""}`.trim();
    const priceHref = `${pageRelative("price.html")}?q=${encodeURIComponent(searchQ)}`;
    const ariaLabel = `${alt} \u2014 \uC0C1\uC138 \uD398\uC774\uC9C0\uB85C \uC774\uB3D9`;
    const { price, note } = splitPriceSummary(product.priceSummary);
    return `
    <div class="product-card product-item" data-product-id="${escapeAttr(product.id)}">
      <button type="button" class="bookmark-add product-card__bookmark" aria-label="\uBD81\uB9C8\uD06C \uCD94\uAC00">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
      </button>
      <div class="product-card__body">
        <div class="product-card__header">
          <span class="product-card__brand">${escapeHtml(product.brand)}</span>
          <h3 class="product-card__model">${escapeHtml(product.model)}</h3>
        </div>
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
            ${note ? `<span class="product-card__price-note">${escapeHtml(note)}</span>` : ""}
          </div>
          <p class="product-card__platform">${escapeHtml(product.platform)}</p>
        </div>
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
            <span class="product-card__cta-text">\uBE44\uAD50\uD568 \uB2F4\uAE30</span>
          </button>
        </div>
        <a class="product-card__action-btn" href="${escapeAttr(priceHref)}">\uC0C1\uC138\uBCF4\uAE30</a>
      </div>
    </div>
  `.trim();
  }
  function bindProductCardImageFallbacks(root) {
    if (!root) return;
    root.querySelectorAll(".product-card__img").forEach((img) => {
      const thumb = img.closest(".product-card__thumb");
      const fallback = img.getAttribute("data-fallback") || assetUrl(CAMERA_THUMB_FALLBACK);
      const fallbackName = fallback.split("/").pop() || "";
      img.addEventListener("error", function onThumbError() {
        img.removeEventListener("error", onThumbError);
        if (fallbackName && img.src.includes(fallbackName)) {
          thumb?.classList.add("product-card__thumb--empty");
          return;
        }
        img.removeAttribute("srcset");
        img.src = fallback;
      });
    });
  }

  // js/products/sortProducts.js
  var PRODUCT_SORT_KEYS = Object.freeze([
    "recommend",
    "popular",
    "price-desc",
    "price-asc"
  ]);
  var PRODUCT_SORT_OPTIONS = Object.freeze([
    { value: "recommend", label: "\uCD94\uCC9C\uC21C" },
    { value: "popular", label: "\uC778\uAE30\uC21C" },
    { value: "price-desc", label: "\uAC00\uACA9\uB192\uC740\uC21C" },
    { value: "price-asc", label: "\uAC00\uACA9\uB0AE\uC740\uC21C" }
  ]);
  function isValidProductSort(value) {
    return PRODUCT_SORT_KEYS.includes(
      /** @type {(typeof PRODUCT_SORT_KEYS)[number]} */
      value
    );
  }
  function getSortLabel(key) {
    const found = PRODUCT_SORT_OPTIONS.find((o) => o.value === key);
    return found ? found.label : PRODUCT_SORT_OPTIONS[0].label;
  }
  function sortProducts(items, sortKey, recommendIndexById2) {
    const list = [...items];
    switch (sortKey) {
      case "popular":
        return list.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
      case "price-desc":
        return list.sort((a, b) => (b.priceKrw ?? 0) - (a.priceKrw ?? 0));
      case "price-asc":
        return list.sort((a, b) => (a.priceKrw ?? 0) - (b.priceKrw ?? 0));
      case "recommend":
      default:
        return list.sort(
          (a, b) => (recommendIndexById2.get(a.id) ?? 999) - (recommendIndexById2.get(b.id) ?? 999)
        );
    }
  }

  // js/products/index.js
  var SORT_STORAGE_KEY = "picory-product-sort";
  var COLOR_STORAGE_KEY = "picory-product-color";
  var PRODUCT_COLOR_OPTIONS = Object.freeze([
    { value: "all", label: "\uC804\uCCB4" },
    { value: "black", label: "\uBE14\uB799" },
    { value: "silver", label: "\uC2E4\uBC84" },
    { value: "white", label: "\uD654\uC774\uD2B8" },
    { value: "gray", label: "\uADF8\uB808\uC774" },
    { value: "blue", label: "\uBE14\uB8E8" },
    { value: "red", label: "\uB808\uB4DC" },
    { value: "green", label: "\uADF8\uB9B0" }
  ]);
  var PRODUCT_COLORS_BY_ID = Object.freeze({
    "fujifilm-x100vi": ["silver", "black"],
    "canon-eos-r10": ["black"],
    "sony-zv-e10-ii": ["black", "white"],
    "ricoh-gr-iiix": ["black"],
    "sony-a7c-ii": ["black", "silver"],
    "nikon-z-fc": ["silver", "gray", "black"],
    "canon-g7x-mark-iii": ["black", "silver"],
    "dji-osmo-pocket-3": ["black"],
    "sony-a6700": ["black"],
    "canon-eos-r50": ["black", "white"],
    "fujifilm-x-s20": ["black"],
    "canon-eos-r50-v": ["black", "white"],
    "nikon-z50ii": ["black"],
    "canon-eos-r8": ["black"],
    "sony-rx100-vii": ["black"],
    "panasonic-lumix-s9": ["black", "blue", "red", "green"],
    "panasonic-lumix-gh7": ["black"],
    "om-system-om-3": ["silver", "gray", "black"],
    "fujifilm-x-m5": ["silver", "black"],
    "leica-d-lux-8": ["black", "gray"],
    "sigma-fp-l": ["black", "gray"],
    "kodak-pixpro-fz55": ["black", "blue", "red"]
  });
  var recommendIndexById = new Map(
    PICORY_PRODUCT_MOCK.map((p, i) => [p.id, i])
  );
  function getStoredSort() {
    try {
      const raw = localStorage.getItem(SORT_STORAGE_KEY);
      if (raw && isValidProductSort(raw)) return raw;
    } catch {
    }
    return "recommend";
  }
  function setStoredSort(value) {
    try {
      if (isValidProductSort(value)) localStorage.setItem(SORT_STORAGE_KEY, value);
    } catch {
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
    }
    return "all";
  }
  function setStoredColor(value) {
    try {
      if (isValidProductColor(value)) localStorage.setItem(COLOR_STORAGE_KEY, value);
    } catch {
    }
  }
  function getSearchQueryFromUrl() {
    try {
      return new URLSearchParams(window.location.search).get("q") || "";
    } catch {
      return "";
    }
  }
  function filterProductsByColor(products, colorKey) {
    if (!colorKey || colorKey === "all") return products;
    return products.filter((product) => {
      const colors = PRODUCT_COLORS_BY_ID[product.id] || [];
      return colors.includes(colorKey);
    });
  }
  function refreshProductGrid(gridRoot, emptyEl, categoryKey, sortKey, searchQuery, colorKey = "all") {
    const categoryFiltered = filterProductsByCategoryAndSearch(PICORY_PRODUCT_MOCK, categoryKey, searchQuery);
    const filtered = filterProductsByColor(categoryFiltered, colorKey);
    const items = sortProducts(filtered, sortKey, recommendIndexById);
    if (!items.length) {
      gridRoot.innerHTML = "";
      if (emptyEl) emptyEl.classList.remove("hidden");
      window.syncPicoryBookmarks?.();
      syncProductCompareButtons();
      return;
    }
    if (emptyEl) emptyEl.classList.add("hidden");
    gridRoot.innerHTML = items.map(renderProductCardHTML).join("");
    bindProductCardImageFallbacks(gridRoot);
    window.syncPicoryBookmarks?.();
    syncProductCompareButtons();
  }

  function syncProductCompareButtons() {
    if (!window.PicoryCompare) return;
    document.querySelectorAll(".product-card__compare-btn").forEach((btn) => {
      const id = btn.getAttribute("data-id");
      if (!id) return;
      if (window.PicoryCompare.has(id)) {
        btn.textContent = "✓ 담김";
        btn.classList.add("is-added");
      } else {
        btn.textContent = "+ 비교함 담기";
        btn.classList.remove("is-added");
      }
    });
  }

  /* compare-drawer render보다 먼저 등록해야 드로어에서 제거 시 카드 상태가 갱신됨 */
  document.addEventListener("picory-compare-updated", syncProductCompareButtons);

  function getCategoryKeyFromHash() {
    const raw = window.location.hash.slice(1);
    if (!raw) return null;
    const key = decodeURIComponent(raw.split("&")[0]);
    return PICORY_PRODUCT_CATEGORIES.some((c) => c.key === key) ? key : null;
  }
  function mountProductDropdownUi({ trigger, list, valueEl, initialKey, onChange, isValid, getLabel: getLabel2 }) {
    const rootEl = trigger.closest(".picory-dropdown, .product-catalog__sort-ui");
    const optionEls = () => Array.from(list.querySelectorAll(".product-catalog__sort-option[data-value]"));
    function syncUi(key) {
      valueEl.textContent = getLabel2(key);
      optionEls().forEach((opt) => {
        const v = opt.getAttribute("data-value");
        const sel = v === key;
        opt.setAttribute("aria-selected", sel ? "true" : "false");
        opt.classList.toggle("is-selected", sel);
      });
    }
    function setOpen(open) {
      list.hidden = !open;
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
      trigger.classList.toggle("is-open", open);
      rootEl?.classList.toggle("is-open", open);
    }
    function close() {
      setOpen(false);
    }
    syncUi(initialKey);
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      setOpen(list.hidden);
    });
    list.addEventListener("click", (e) => {
      const li = (
        /** @type {HTMLElement | null} */
        e.target.closest(".product-catalog__sort-option[data-value]")
      );
      if (!li) return;
      const v = li.getAttribute("data-value");
      if (!v || !isValid(v)) return;
      syncUi(v);
      onChange(v);
      close();
    });
    document.addEventListener("mousedown", (e) => {
      if (list.hidden) return;
      const t = (
        /** @type {Node | null} */
        e.target
      );
      if (trigger.contains(t) || list.contains(t)) return;
      close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !list.hidden) {
        e.preventDefault();
        close();
      }
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    const qParam = getSearchQueryFromUrl();
    const searchInput = document.querySelector('.nav__search input[type="search"]') || document.querySelector(".m-topbar__search-input");
    if (searchInput && qParam) {
      searchInput.value = qParam;
    }
    function escapeHtml(value) {
      return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[ch] || ch);
    }
    function escapeAttr(value) {
      return escapeHtml(value).replace(/"/g, "&quot;");
    }
    function normalize(value) {
      return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
    }
    function getLabel(p) {
      const brand = (p.brand || "").trim();
      const name = (p.name || "").trim();
      const model = (p.model || "").trim();
      const base = [brand, name || model].filter(Boolean).join(" ");
      return base || model || name || "";
    }
    function mountNavSuggest(input) {
      if (!input) return;
      const wrap = input.closest(".nav__search") || input.closest(".m-topbar__search-wrap") || input.parentElement;
      if (!wrap) return;
      const host = wrap.parentElement || document.body;
      // NOTE: the search UI uses <label>. dropdown must NOT be a child of <label>.
      if (host !== document.body) {
        const cs = window.getComputedStyle(host);
        if (cs.position === "static") host.style.position = "relative";
      }
      const ul = document.createElement("ul");
      ul.className = "price-search__suggest picory-dropdown__menu";
      ul.setAttribute("role", "listbox");
      ul.hidden = true;
      host.appendChild(ul);
      function syncPos() {
        const wrapRect = wrap.getBoundingClientRect();
        const hostRect = host.getBoundingClientRect();
        ul.style.left = `${Math.max(0, wrapRect.left - hostRect.left)}px`;
        ul.style.top = `${wrapRect.bottom - hostRect.top + 6}px`;
        ul.style.right = "auto";
        ul.style.width = `${wrapRect.width}px`;
      }
      function close() {
        ul.hidden = true;
        ul.innerHTML = "";
        input.setAttribute("aria-expanded", "false");
      }
      function open(items) {
        syncPos();
        ul.innerHTML = items.map((p) => {
          const label = getLabel(p);
          const meta = (p.categoryLabel || p.category || "").toString();
          return `<li class="price-search__suggest-item" role="option">
            <button type="button" class="price-search__suggest-btn" data-q="${escapeAttr(label)}">
              <span class="price-search__suggest-name">${escapeHtml(label)}</span>
              <span class="price-search__suggest-meta">${escapeHtml(meta)}</span>
            </button>
          </li>`;
        }).join("");
        ul.hidden = !items.length;
        input.setAttribute("aria-expanded", items.length ? "true" : "false");
      }
      function compute() {
        const q = normalize(input.value);
        if (!q || q.length < 1) {
          close();
          return;
        }
        const items = PICORY_PRODUCT_MOCK.filter((p) => {
          const label = normalize(getLabel(p));
          return label.includes(q) || normalize(p.brand).includes(q) || normalize(p.model).includes(q);
        }).slice(0, 7);
        if (!items.length) {
          close();
          return;
        }
        open(items);
      }
      input.addEventListener("input", compute);
      input.addEventListener("focus", compute);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
      });
      window.addEventListener("resize", () => {
        if (!ul.hidden) syncPos();
      });
      window.addEventListener("scroll", () => {
        if (!ul.hidden) syncPos();
      }, { passive: true });
      ul.addEventListener("click", (e) => {
        const btn = e.target.closest(".price-search__suggest-btn");
        if (!btn) return;
        const picked = btn.getAttribute("data-q") || "";
        if (!picked) return;
        input.value = picked;
        close();
        const detailUrl = new URL("price.html", window.location.href);
        detailUrl.searchParams.set("q", picked);
        window.location.href = detailUrl.href;
      });
      document.addEventListener("mousedown", (e) => {
        const t = e.target;
        if (wrap.contains(t) || ul.contains(t)) return;
        close();
      });
    }
    // Global suggest is mounted by app.js (all pages). Keep products bundle lean.
    /* 상단 검색 Enter → 상세(price.html?q=)는 app.js 전역 suggest에서 처리 */
    const navRoot = document.getElementById("productCategoryNav");
    const gridRoot = document.getElementById("productGrid");
    const emptyEl = document.getElementById("productCatalogEmpty");
    const sortTrigger = document.getElementById("productSortTrigger");
    const sortList = document.getElementById("productSortList");
    const sortValue = document.getElementById("productSortValue");
    const colorTrigger = document.getElementById("productColorTrigger");
    const colorList = document.getElementById("productColorList");
    const colorValue = document.getElementById("productColorValue");
    if (!navRoot || !gridRoot) return;
    let sortKey = getStoredSort();
    let colorKey = getStoredColor();
    let activeSearchQuery = qParam;
    const hashKey = getCategoryKeyFromHash();
    const initialKey = hashKey || PICORY_PRODUCT_CATEGORIES[0].key;
    const nav = mountCategoryNav(navRoot, PICORY_PRODUCT_CATEGORIES, {
      initialKey,
      onChange: (key) => {
        activeSearchQuery = "";
        refreshProductGrid(gridRoot, emptyEl, key, sortKey, "", colorKey);
        history.replaceState(null, "", `#${encodeURIComponent(key)}`);
      }
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
        }
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
        }
      });
    }
    refreshProductGrid(gridRoot, emptyEl, initialKey, sortKey, activeSearchQuery, colorKey);
    if (hashKey) {
      requestAnimationFrame(() => {
        document.getElementById("product-catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    // 비교함 담기 버튼 이벤트 위임
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".product-card__compare-btn");
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute("data-id");
      const brand = btn.getAttribute("data-brand") || "";
      const model = btn.getAttribute("data-model") || "";
      const thumb = btn.getAttribute("data-thumb") || "";
      if (!id || !window.PicoryCompare) return;
      if (window.PicoryCompare.has(id)) {
        window.PicoryCompare.remove(id);
        btn.textContent = "+ 비교함 담기";
        btn.classList.remove("is-added");
        return;
      }
      const added = window.PicoryCompare.add({ id, brand, model, thumbnail: thumb });
      if (added) {
        btn.textContent = "✓ 담김";
        btn.classList.add("is-added");
      } else {
        const orig = btn.textContent;
        btn.textContent = "이미 담김";
        setTimeout(() => { btn.textContent = orig; }, 1600);
      }
    });

    syncProductCompareButtons();
  });
})();
