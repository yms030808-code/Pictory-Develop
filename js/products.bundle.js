(() => {
  // js/products/categories.js
  var PICORY_PRODUCT_CATEGORIES = [
    { key: "trending", label: "\uC9C0\uAE08 \uC778\uAE30" },
    { key: "beginner", label: "\uC785\uBB38 \uCD94\uCC9C" },
    { key: "emotional", label: "\uAC10\uC131 \uC0AC\uC9C4" },
    { key: "travel", label: "\uC5EC\uD589\uC6A9" },
    { key: "vlog", label: "\uBE0C\uC774\uB85C\uADF8" },
    { key: "value", label: "\uAC00\uC131\uBE44" },
    { key: "vintage", label: "\uBE48\uD2F0\uC9C0/CCD" },
    { key: "community-picks", label: "\uB9CE\uC774 \uACE0\uB978 \uCE74\uBA54\uB77C" }
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

  // js/products/filterProducts.js
  function filterProductsByCategory(products, categoryKey) {
    if (!categoryKey) return products;
    return products.filter((product) => Array.isArray(product.categories) && product.categories.includes(categoryKey));
  }
  function filterProductsByCategoryAndSearch(products, categoryKey, searchQuery) {
    let list = filterProductsByCategory(products, categoryKey);
    const sq = String(searchQuery || "").trim();
    if (!sq) return list;
    return list.filter((p) => productMatchesQuery(p, sq));
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
  function renderProductCardHTML(product) {
    const thumb = assetUrl(product.thumbnail || CAMERA_THUMB_FALLBACK);
    const alt = `${product.brand || ""} ${product.model || ""}`.trim();
    const searchQ = `${product.brand || ""} ${product.model || ""}`.trim();
    const priceHref = `${pageRelative("price.html")}?q=${encodeURIComponent(searchQ)}`;
    const ariaLabel = `${alt} \u2014 \uD1B5\uD569 \uC2DC\uC138 \uBE44\uAD50 \uD398\uC774\uC9C0\uB85C \uC774\uB3D9`;
    return `
    <div class="product-card product-item" data-product-id="${escapeAttr(product.id)}">
      <button type="button" class="bookmark-add product-card__bookmark" aria-label="\uBD81\uB9C8\uD06C \uCD94\uAC00">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
      </button>
      <a class="product-card__link" href="${escapeAttr(priceHref)}" aria-label="${escapeAttr(ariaLabel)}">
        <div class="product-card__thumb">
          <img
            class="product-card__img"
            src="${escapeAttr(thumb)}"
            alt=""
            loading="lazy"
            decoding="async"
            data-fallback="${escapeAttr(assetUrl(CAMERA_THUMB_FALLBACK))}"
          >
        </div>
        <span class="product-card__brand">${escapeHtml(product.brand)}</span>
        <h3 class="product-card__model">${escapeHtml(product.model)}</h3>
        <p class="product-card__desc">${escapeHtml(product.description)}</p>
        <strong class="product-card__price">${escapeHtml(product.priceSummary)}</strong>
        <p class="product-card__platform">${escapeHtml(product.platform)}</p>
        <span class="product-card__cta">
          <span class="product-card__cta-text">\uC2DC\uC138 \uBE44\uAD50</span>
          <svg class="product-card__cta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </span>
      </a>
    </div>
  `.trim();
  }
  function bindProductCardImageFallbacks(root) {
    if (!root) return;
    root.querySelectorAll(".product-card__img").forEach((img) => {
      const fallback = img.getAttribute("data-fallback") || assetUrl(CAMERA_THUMB_FALLBACK);
      const fallbackName = fallback.split("/").pop() || "";
      img.addEventListener("error", function onThumbError() {
        img.removeEventListener("error", onThumbError);
        if (fallbackName && img.src.includes(fallbackName)) return;
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
  function getSearchQueryFromUrl() {
    try {
      return new URLSearchParams(window.location.search).get("q") || "";
    } catch {
      return "";
    }
  }
  function refreshProductGrid(gridRoot, emptyEl, categoryKey, sortKey, searchQuery) {
    const filtered = filterProductsByCategoryAndSearch(PICORY_PRODUCT_MOCK, categoryKey, searchQuery);
    const items = sortProducts(filtered, sortKey, recommendIndexById);
    if (!items.length) {
      gridRoot.innerHTML = "";
      if (emptyEl) emptyEl.classList.remove("hidden");
      window.syncPicoryBookmarks?.();
      return;
    }
    if (emptyEl) emptyEl.classList.add("hidden");
    gridRoot.innerHTML = items.map(renderProductCardHTML).join("");
    bindProductCardImageFallbacks(gridRoot);
    window.syncPicoryBookmarks?.();
  }
  function getCategoryKeyFromHash() {
    const raw = window.location.hash.slice(1);
    if (!raw) return null;
    const key = decodeURIComponent(raw.split("&")[0]);
    return PICORY_PRODUCT_CATEGORIES.some((c) => c.key === key) ? key : null;
  }
  function mountProductSortUi({ trigger, list, valueEl, initialKey, onChange }) {
    const optionEls = () => Array.from(list.querySelectorAll(".product-catalog__sort-option[data-value]"));
    function syncUi(key) {
      valueEl.textContent = getSortLabel(key);
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
      if (!v || !isValidProductSort(v)) return;
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
      ul.className = "price-search__suggest";
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
        const url = new URL(window.location.href);
        url.searchParams.set("q", picked);
        window.location.href = `${url.pathname}${url.search}${url.hash || ""}`;
      });
      document.addEventListener("mousedown", (e) => {
        const t = e.target;
        if (wrap.contains(t) || ul.contains(t)) return;
        close();
      });
    }
    // Global suggest is mounted by app.js (all pages). Keep products bundle lean.
    const RECENT_CAMERA_STORAGE_KEY = "picoryRecentCameras";
    function pushRecentCamera(name, source, query) {
      const cameraName = String(name || "").trim();
      if (!cameraName) return;
      const q = String(query || cameraName).trim();
      try {
        const raw = localStorage.getItem(RECENT_CAMERA_STORAGE_KEY);
        const list = raw ? JSON.parse(raw) : [];
        const prev = Array.isArray(list) ? list : [];
        const deduped = prev.filter((item) => String(item?.name || "").trim() !== cameraName);
        deduped.push({
          name: cameraName,
          source: String(source || "검색"),
          query: q,
          at: (/* @__PURE__ */ new Date()).toISOString()
        });
        localStorage.setItem(RECENT_CAMERA_STORAGE_KEY, JSON.stringify(deduped.slice(-20)));
      } catch {
      }
    }
    if (searchInput) {
      searchInput.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        const v = searchInput.value.trim();
        if (v) pushRecentCamera(v, "검색", v);
        const url = new URL(window.location.href);
        if (v) url.searchParams.set("q", v);
        else url.searchParams.delete("q");
        const next = `${url.pathname}${url.search}${url.hash || ""}`;
        window.location.href = next;
      });
    }
    const navRoot = document.getElementById("productCategoryNav");
    const gridRoot = document.getElementById("productGrid");
    const emptyEl = document.getElementById("productCatalogEmpty");
    const sortTrigger = document.getElementById("productSortTrigger");
    const sortList = document.getElementById("productSortList");
    const sortValue = document.getElementById("productSortValue");
    if (!navRoot || !gridRoot) return;
    let sortKey = getStoredSort();
    const hashKey = getCategoryKeyFromHash();
    const initialKey = hashKey || PICORY_PRODUCT_CATEGORIES[0].key;
    const nav = mountCategoryNav(navRoot, PICORY_PRODUCT_CATEGORIES, {
      initialKey,
      onChange: (key) => {
        refreshProductGrid(gridRoot, emptyEl, key, sortKey, getSearchQueryFromUrl());
        history.replaceState(null, "", `#${encodeURIComponent(key)}`);
      }
    });
    if (sortTrigger && sortList && sortValue) {
      mountProductSortUi({
        trigger: sortTrigger,
        list: sortList,
        valueEl: sortValue,
        initialKey: sortKey,
        onChange: (v) => {
          sortKey = v;
          setStoredSort(v);
          refreshProductGrid(gridRoot, emptyEl, nav.getActiveKey(), sortKey, getSearchQueryFromUrl());
        }
      });
    }
    refreshProductGrid(gridRoot, emptyEl, initialKey, sortKey, qParam);
    if (hashKey) {
      requestAnimationFrame(() => {
        document.getElementById("product-catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  });
})();
