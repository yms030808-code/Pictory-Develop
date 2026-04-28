(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

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

  // js/recommend/cameraThumbnails.js
  var EXTRA_THUMBNAILS = {
    "Fujifilm X-T5": "/images/cameras/fujifilm-x-s20.png"
  };
  function getThumbnailForRecommendModel(displayName) {
    const n2 = (displayName || "").trim();
    if (EXTRA_THUMBNAILS[n2]) return EXTRA_THUMBNAILS[n2];
    const hit = PICORY_PRODUCT_MOCK.find(
      (p2) => `${p2.brand} ${p2.model}` === n2 || p2.model === n2
    );
    if (hit?.thumbnail) return hit.thumbnail;
    return "/images/cameras/default-camera.png";
  }

  // js/recommend/picoryAnalysis.mjs
  var picoryAnalysis_exports = {};
  __export(picoryAnalysis_exports, {
    analyzePixelsFromDataUrl: () => analyzePixelsFromDataUrl,
    analyzeUpload: () => analyzeUpload,
    loadCatalog: () => loadCatalog,
    rankByColorProfile: () => rankByColorProfile,
    sleep: () => sleep,
    toApiShape: () => toApiShape
  });

  // js/vendor/exifr-lite.mjs
  function e(e2, t2, i2) {
    return t2 in e2 ? Object.defineProperty(e2, t2, { value: i2, enumerable: true, configurable: true, writable: true }) : e2[t2] = i2, e2;
  }
  var t = "undefined" != typeof self ? self : global;
  var i = "undefined" != typeof navigator;
  var s = i && "undefined" == typeof HTMLImageElement;
  var n = !("undefined" == typeof global || "undefined" == typeof process || !process.versions || !process.versions.node);
  var r = t.Buffer;
  var a = t.BigInt;
  var o = !!r;
  var h = (e2) => f(e2) ? void 0 : e2;
  var l = (e2) => void 0 !== e2;
  function f(e2) {
    return void 0 === e2 || (e2 instanceof Map ? 0 === e2.size : 0 === Object.values(e2).filter(l).length);
  }
  function u(e2) {
    let t2 = new Error(e2);
    throw delete t2.stack, t2;
  }
  function d(e2) {
    return "" === (e2 = function(e3) {
      for (; e3.endsWith("\0"); ) e3 = e3.slice(0, -1);
      return e3;
    }(e2).trim()) ? void 0 : e2;
  }
  function c(e2) {
    let t2 = function(e3) {
      let t3 = 0;
      return e3.ifd0.enabled && (t3 += 1024), e3.exif.enabled && (t3 += 2048), e3.makerNote && (t3 += 2048), e3.userComment && (t3 += 1024), e3.gps.enabled && (t3 += 512), e3.interop.enabled && (t3 += 100), e3.ifd1.enabled && (t3 += 1024), t3 + 2048;
    }(e2);
    return e2.jfif.enabled && (t2 += 50), e2.xmp.enabled && (t2 += 2e4), e2.iptc.enabled && (t2 += 14e3), e2.icc.enabled && (t2 += 6e3), t2;
  }
  var g = (e2) => String.fromCharCode.apply(null, e2);
  var p = "undefined" != typeof TextDecoder ? new TextDecoder("utf-8") : void 0;
  function m(e2) {
    return p ? p.decode(e2) : o ? Buffer.from(e2).toString("utf8") : decodeURIComponent(escape(g(e2)));
  }
  var y = class _y {
    static from(e2, t2) {
      return e2 instanceof this && e2.le === t2 ? e2 : new _y(e2, void 0, void 0, t2);
    }
    constructor(e2, t2 = 0, i2, s2) {
      if ("boolean" == typeof s2 && (this.le = s2), Array.isArray(e2) && (e2 = new Uint8Array(e2)), 0 === e2) this.byteOffset = 0, this.byteLength = 0;
      else if (e2 instanceof ArrayBuffer) {
        void 0 === i2 && (i2 = e2.byteLength - t2);
        let s3 = new DataView(e2, t2, i2);
        this._swapDataView(s3);
      } else if (e2 instanceof Uint8Array || e2 instanceof DataView || e2 instanceof _y) {
        void 0 === i2 && (i2 = e2.byteLength - t2), (t2 += e2.byteOffset) + i2 > e2.byteOffset + e2.byteLength && u("Creating view outside of available memory in ArrayBuffer");
        let s3 = new DataView(e2.buffer, t2, i2);
        this._swapDataView(s3);
      } else if ("number" == typeof e2) {
        let t3 = new DataView(new ArrayBuffer(e2));
        this._swapDataView(t3);
      } else u("Invalid input argument for BufferView: " + e2);
    }
    _swapArrayBuffer(e2) {
      this._swapDataView(new DataView(e2));
    }
    _swapBuffer(e2) {
      this._swapDataView(new DataView(e2.buffer, e2.byteOffset, e2.byteLength));
    }
    _swapDataView(e2) {
      this.dataView = e2, this.buffer = e2.buffer, this.byteOffset = e2.byteOffset, this.byteLength = e2.byteLength;
    }
    _lengthToEnd(e2) {
      return this.byteLength - e2;
    }
    set(e2, t2, i2 = _y) {
      return e2 instanceof DataView || e2 instanceof _y ? e2 = new Uint8Array(e2.buffer, e2.byteOffset, e2.byteLength) : e2 instanceof ArrayBuffer && (e2 = new Uint8Array(e2)), e2 instanceof Uint8Array || u("BufferView.set(): Invalid data argument."), this.toUint8().set(e2, t2), new i2(this, t2, e2.byteLength);
    }
    subarray(e2, t2) {
      return t2 = t2 || this._lengthToEnd(e2), new _y(this, e2, t2);
    }
    toUint8() {
      return new Uint8Array(this.buffer, this.byteOffset, this.byteLength);
    }
    getUint8Array(e2, t2) {
      return new Uint8Array(this.buffer, this.byteOffset + e2, t2);
    }
    getString(e2 = 0, t2 = this.byteLength) {
      return m(this.getUint8Array(e2, t2));
    }
    getLatin1String(e2 = 0, t2 = this.byteLength) {
      let i2 = this.getUint8Array(e2, t2);
      return g(i2);
    }
    getUnicodeString(e2 = 0, t2 = this.byteLength) {
      const i2 = [];
      for (let s2 = 0; s2 < t2 && e2 + s2 < this.byteLength; s2 += 2) i2.push(this.getUint16(e2 + s2));
      return g(i2);
    }
    getInt8(e2) {
      return this.dataView.getInt8(e2);
    }
    getUint8(e2) {
      return this.dataView.getUint8(e2);
    }
    getInt16(e2, t2 = this.le) {
      return this.dataView.getInt16(e2, t2);
    }
    getInt32(e2, t2 = this.le) {
      return this.dataView.getInt32(e2, t2);
    }
    getUint16(e2, t2 = this.le) {
      return this.dataView.getUint16(e2, t2);
    }
    getUint32(e2, t2 = this.le) {
      return this.dataView.getUint32(e2, t2);
    }
    getFloat32(e2, t2 = this.le) {
      return this.dataView.getFloat32(e2, t2);
    }
    getFloat64(e2, t2 = this.le) {
      return this.dataView.getFloat64(e2, t2);
    }
    getFloat(e2, t2 = this.le) {
      return this.dataView.getFloat32(e2, t2);
    }
    getDouble(e2, t2 = this.le) {
      return this.dataView.getFloat64(e2, t2);
    }
    getUintBytes(e2, t2, i2) {
      switch (t2) {
        case 1:
          return this.getUint8(e2, i2);
        case 2:
          return this.getUint16(e2, i2);
        case 4:
          return this.getUint32(e2, i2);
        case 8:
          return this.getUint64 && this.getUint64(e2, i2);
      }
    }
    getUint(e2, t2, i2) {
      switch (t2) {
        case 8:
          return this.getUint8(e2, i2);
        case 16:
          return this.getUint16(e2, i2);
        case 32:
          return this.getUint32(e2, i2);
        case 64:
          return this.getUint64 && this.getUint64(e2, i2);
      }
    }
    toString(e2) {
      return this.dataView.toString(e2, this.constructor.name);
    }
    ensureChunk() {
    }
  };
  function b(e2, t2) {
    u(`${e2} '${t2}' was not loaded, try using full build of exifr.`);
  }
  var w = class extends Map {
    constructor(e2) {
      super(), this.kind = e2;
    }
    get(e2, t2) {
      return this.has(e2) || b(this.kind, e2), t2 && (e2 in t2 || function(e3, t3) {
        u(`Unknown ${e3} '${t3}'.`);
      }(this.kind, e2), t2[e2].enabled || b(this.kind, e2)), super.get(e2);
    }
    keyList() {
      return Array.from(this.keys());
    }
  };
  var S = new w("file parser");
  var k = new w("segment parser");
  var v = new w("file reader");
  var O = t.fetch;
  function x(e2, t2) {
    return (s2 = e2).startsWith("data:") || s2.length > 1e4 ? P(e2, t2, "base64") : n && e2.includes("://") ? C(e2, t2, "url", A) : n ? P(e2, t2, "fs") : i ? C(e2, t2, "url", A) : void u("Invalid input argument");
    var s2;
  }
  async function C(e2, t2, i2, s2) {
    return v.has(i2) ? P(e2, t2, i2) : s2 ? async function(e3, t3) {
      let i3 = await t3(e3);
      return new y(i3);
    }(e2, s2) : void u(`Parser ${i2} is not loaded`);
  }
  async function P(e2, t2, i2) {
    let s2 = new (v.get(i2))(e2, t2);
    return await s2.read(), s2;
  }
  var A = (e2) => O(e2).then((e3) => e3.arrayBuffer());
  var U = (e2) => new Promise((t2, i2) => {
    let s2 = new FileReader();
    s2.onloadend = () => t2(s2.result || new ArrayBuffer()), s2.onerror = i2, s2.readAsArrayBuffer(e2);
  });
  var I = class extends Map {
    get tagKeys() {
      return this.allKeys || (this.allKeys = Array.from(this.keys())), this.allKeys;
    }
    get tagValues() {
      return this.allValues || (this.allValues = Array.from(this.values())), this.allValues;
    }
  };
  function B(e2, t2, i2) {
    let s2 = new I();
    for (let [e3, t3] of i2) s2.set(e3, t3);
    if (Array.isArray(t2)) for (let i3 of t2) e2.set(i3, s2);
    else e2.set(t2, s2);
    return s2;
  }
  function F(e2, t2, i2) {
    let s2, n2 = e2.get(t2);
    for (s2 of i2) n2.set(s2[0], s2[1]);
  }
  var L = /* @__PURE__ */ new Map();
  var D = /* @__PURE__ */ new Map();
  var T = /* @__PURE__ */ new Map();
  var z = ["chunked", "firstChunkSize", "firstChunkSizeNode", "firstChunkSizeBrowser", "chunkSize", "chunkLimit"];
  var N = ["jfif", "xmp", "icc", "iptc", "ihdr"];
  var V = ["tiff", ...N];
  var M = ["ifd0", "ifd1", "exif", "gps", "interop"];
  var E = [...V, ...M];
  var R = ["makerNote", "userComment"];
  var j = ["translateKeys", "translateValues", "reviveValues", "multiSegment"];
  var G = [...j, "sanitize", "mergeOutput", "silentErrors"];
  var H = class {
    get translate() {
      return this.translateKeys || this.translateValues || this.reviveValues;
    }
  };
  var _ = class extends H {
    get needed() {
      return this.enabled || this.deps.size > 0;
    }
    constructor(t2, i2, s2, n2) {
      if (super(), e(this, "enabled", false), e(this, "skip", /* @__PURE__ */ new Set()), e(this, "pick", /* @__PURE__ */ new Set()), e(this, "deps", /* @__PURE__ */ new Set()), e(this, "translateKeys", false), e(this, "translateValues", false), e(this, "reviveValues", false), this.key = t2, this.enabled = i2, this.parse = this.enabled, this.applyInheritables(n2), this.canBeFiltered = M.includes(t2), this.canBeFiltered && (this.dict = L.get(t2)), void 0 !== s2) if (Array.isArray(s2)) this.parse = this.enabled = true, this.canBeFiltered && s2.length > 0 && this.translateTagSet(s2, this.pick);
      else if ("object" == typeof s2) {
        if (this.enabled = true, this.parse = false !== s2.parse, this.canBeFiltered) {
          let { pick: e2, skip: t3 } = s2;
          e2 && e2.length > 0 && this.translateTagSet(e2, this.pick), t3 && t3.length > 0 && this.translateTagSet(t3, this.skip);
        }
        this.applyInheritables(s2);
      } else true === s2 || false === s2 ? this.parse = this.enabled = s2 : u(`Invalid options argument: ${s2}`);
    }
    applyInheritables(e2) {
      let t2, i2;
      for (t2 of j) i2 = e2[t2], void 0 !== i2 && (this[t2] = i2);
    }
    translateTagSet(e2, t2) {
      if (this.dict) {
        let i2, s2, { tagKeys: n2, tagValues: r2 } = this.dict;
        for (i2 of e2) "string" == typeof i2 ? (s2 = r2.indexOf(i2), -1 === s2 && (s2 = n2.indexOf(Number(i2))), -1 !== s2 && t2.add(Number(n2[s2]))) : t2.add(i2);
      } else for (let i2 of e2) t2.add(i2);
    }
    finalizeFilters() {
      !this.enabled && this.deps.size > 0 ? (this.enabled = true, q(this.pick, this.deps)) : this.enabled && this.pick.size > 0 && q(this.pick, this.deps);
    }
  };
  var W = { jfif: false, tiff: true, xmp: false, icc: false, iptc: false, ifd0: true, ifd1: false, exif: true, gps: true, interop: false, ihdr: void 0, makerNote: false, userComment: false, multiSegment: false, skip: [], pick: [], translateKeys: true, translateValues: true, reviveValues: true, sanitize: true, mergeOutput: true, silentErrors: true, chunked: true, firstChunkSize: void 0, firstChunkSizeNode: 512, firstChunkSizeBrowser: 65536, chunkSize: 65536, chunkLimit: 5 };
  var $ = /* @__PURE__ */ new Map();
  var K = class extends H {
    static useCached(e2) {
      let t2 = $.get(e2);
      return void 0 !== t2 || (t2 = new this(e2), $.set(e2, t2)), t2;
    }
    constructor(e2) {
      super(), true === e2 ? this.setupFromTrue() : void 0 === e2 ? this.setupFromUndefined() : Array.isArray(e2) ? this.setupFromArray(e2) : "object" == typeof e2 ? this.setupFromObject(e2) : u(`Invalid options argument ${e2}`), void 0 === this.firstChunkSize && (this.firstChunkSize = i ? this.firstChunkSizeBrowser : this.firstChunkSizeNode), this.mergeOutput && (this.ifd1.enabled = false), this.filterNestedSegmentTags(), this.traverseTiffDependencyTree(), this.checkLoadedPlugins();
    }
    setupFromUndefined() {
      let e2;
      for (e2 of z) this[e2] = W[e2];
      for (e2 of G) this[e2] = W[e2];
      for (e2 of R) this[e2] = W[e2];
      for (e2 of E) this[e2] = new _(e2, W[e2], void 0, this);
    }
    setupFromTrue() {
      let e2;
      for (e2 of z) this[e2] = W[e2];
      for (e2 of G) this[e2] = W[e2];
      for (e2 of R) this[e2] = true;
      for (e2 of E) this[e2] = new _(e2, true, void 0, this);
    }
    setupFromArray(e2) {
      let t2;
      for (t2 of z) this[t2] = W[t2];
      for (t2 of G) this[t2] = W[t2];
      for (t2 of R) this[t2] = W[t2];
      for (t2 of E) this[t2] = new _(t2, false, void 0, this);
      this.setupGlobalFilters(e2, void 0, M);
    }
    setupFromObject(e2) {
      let t2;
      for (t2 of (M.ifd0 = M.ifd0 || M.image, M.ifd1 = M.ifd1 || M.thumbnail, Object.assign(this, e2), z)) this[t2] = Y(e2[t2], W[t2]);
      for (t2 of G) this[t2] = Y(e2[t2], W[t2]);
      for (t2 of R) this[t2] = Y(e2[t2], W[t2]);
      for (t2 of V) this[t2] = new _(t2, W[t2], e2[t2], this);
      for (t2 of M) this[t2] = new _(t2, W[t2], e2[t2], this.tiff);
      this.setupGlobalFilters(e2.pick, e2.skip, M, E), true === e2.tiff ? this.batchEnableWithBool(M, true) : false === e2.tiff ? this.batchEnableWithUserValue(M, e2) : Array.isArray(e2.tiff) ? this.setupGlobalFilters(e2.tiff, void 0, M) : "object" == typeof e2.tiff && this.setupGlobalFilters(e2.tiff.pick, e2.tiff.skip, M);
    }
    batchEnableWithBool(e2, t2) {
      for (let i2 of e2) this[i2].enabled = t2;
    }
    batchEnableWithUserValue(e2, t2) {
      for (let i2 of e2) {
        let e3 = t2[i2];
        this[i2].enabled = false !== e3 && void 0 !== e3;
      }
    }
    setupGlobalFilters(e2, t2, i2, s2 = i2) {
      if (e2 && e2.length) {
        for (let e3 of s2) this[e3].enabled = false;
        let t3 = X(e2, i2);
        for (let [e3, i3] of t3) q(this[e3].pick, i3), this[e3].enabled = true;
      } else if (t2 && t2.length) {
        let e3 = X(t2, i2);
        for (let [t3, i3] of e3) q(this[t3].skip, i3);
      }
    }
    filterNestedSegmentTags() {
      let { ifd0: e2, exif: t2, xmp: i2, iptc: s2, icc: n2 } = this;
      this.makerNote ? t2.deps.add(37500) : t2.skip.add(37500), this.userComment ? t2.deps.add(37510) : t2.skip.add(37510), i2.enabled || e2.skip.add(700), s2.enabled || e2.skip.add(33723), n2.enabled || e2.skip.add(34675);
    }
    traverseTiffDependencyTree() {
      let { ifd0: e2, exif: t2, gps: i2, interop: s2 } = this;
      s2.needed && (t2.deps.add(40965), e2.deps.add(40965)), t2.needed && e2.deps.add(34665), i2.needed && e2.deps.add(34853), this.tiff.enabled = M.some((e3) => true === this[e3].enabled) || this.makerNote || this.userComment;
      for (let e3 of M) this[e3].finalizeFilters();
    }
    get onlyTiff() {
      return !N.map((e2) => this[e2].enabled).some((e2) => true === e2) && this.tiff.enabled;
    }
    checkLoadedPlugins() {
      for (let e2 of V) this[e2].enabled && !k.has(e2) && b("segment parser", e2);
    }
  };
  function X(e2, t2) {
    let i2, s2, n2, r2, a2 = [];
    for (n2 of t2) {
      for (r2 of (i2 = L.get(n2), s2 = [], i2)) (e2.includes(r2[0]) || e2.includes(r2[1])) && s2.push(r2[0]);
      s2.length && a2.push([n2, s2]);
    }
    return a2;
  }
  function Y(e2, t2) {
    return void 0 !== e2 ? e2 : void 0 !== t2 ? t2 : void 0;
  }
  function q(e2, t2) {
    for (let i2 of t2) e2.add(i2);
  }
  e(K, "default", W);
  var J = class {
    constructor(t2) {
      e(this, "parsers", {}), e(this, "output", {}), e(this, "errors", []), e(this, "pushToErrors", (e2) => this.errors.push(e2)), this.options = K.useCached(t2);
    }
    async read(e2) {
      this.file = await function(e3, t2) {
        return "string" == typeof e3 ? x(e3, t2) : i && !s && e3 instanceof HTMLImageElement ? x(e3.src, t2) : e3 instanceof Uint8Array || e3 instanceof ArrayBuffer || e3 instanceof DataView ? new y(e3) : i && e3 instanceof Blob ? C(e3, t2, "blob", U) : void u("Invalid input argument");
      }(e2, this.options);
    }
    setup() {
      if (this.fileParser) return;
      let { file: e2 } = this, t2 = e2.getUint16(0);
      for (let [i2, s2] of S) if (s2.canHandle(e2, t2)) return this.fileParser = new s2(this.options, this.file, this.parsers), e2[i2] = true;
      this.file.close && this.file.close(), u("Unknown file format");
    }
    async parse() {
      let { output: e2, errors: t2 } = this;
      return this.setup(), this.options.silentErrors ? (await this.executeParsers().catch(this.pushToErrors), t2.push(...this.fileParser.errors)) : await this.executeParsers(), this.file.close && this.file.close(), this.options.silentErrors && t2.length > 0 && (e2.errors = t2), h(e2);
    }
    async executeParsers() {
      let { output: e2 } = this;
      await this.fileParser.parse();
      let t2 = Object.values(this.parsers).map(async (t3) => {
        let i2 = await t3.parse();
        t3.assignToOutput(e2, i2);
      });
      this.options.silentErrors && (t2 = t2.map((e3) => e3.catch(this.pushToErrors))), await Promise.all(t2);
    }
    async extractThumbnail() {
      this.setup();
      let { options: e2, file: t2 } = this, i2 = k.get("tiff", e2);
      var s2;
      if (t2.tiff ? s2 = { start: 0, type: "tiff" } : t2.jpeg && (s2 = await this.fileParser.getOrFindSegment("tiff")), void 0 === s2) return;
      let n2 = await this.fileParser.ensureSegmentChunk(s2), r2 = this.parsers.tiff = new i2(n2, e2, t2), a2 = await r2.extractThumbnail();
      return t2.close && t2.close(), a2;
    }
  };
  async function Z(e2, t2) {
    let i2 = new J(t2);
    return await i2.read(e2), i2.parse();
  }
  var Q = Object.freeze({ __proto__: null, parse: Z, Exifr: J, fileParsers: S, segmentParsers: k, fileReaders: v, tagKeys: L, tagValues: D, tagRevivers: T, createDictionary: B, extendDictionary: F, fetchUrlAsArrayBuffer: A, readBlobAsArrayBuffer: U, chunkedProps: z, otherSegments: N, segments: V, tiffBlocks: M, segmentsAndBlocks: E, tiffExtractables: R, inheritables: j, allFormatters: G, Options: K });
  var ee = class {
    constructor(t2, i2, s2) {
      e(this, "errors", []), e(this, "ensureSegmentChunk", async (e2) => {
        let t3 = e2.start, i3 = e2.size || 65536;
        if (this.file.chunked) if (this.file.available(t3, i3)) e2.chunk = this.file.subarray(t3, i3);
        else try {
          e2.chunk = await this.file.readChunk(t3, i3);
        } catch (t4) {
          u(`Couldn't read segment: ${JSON.stringify(e2)}. ${t4.message}`);
        }
        else this.file.byteLength > t3 + i3 ? e2.chunk = this.file.subarray(t3, i3) : void 0 === e2.size ? e2.chunk = this.file.subarray(t3) : u("Segment unreachable: " + JSON.stringify(e2));
        return e2.chunk;
      }), this.extendOptions && this.extendOptions(t2), this.options = t2, this.file = i2, this.parsers = s2;
    }
    injectSegment(e2, t2) {
      this.options[e2].enabled && this.createParser(e2, t2);
    }
    createParser(e2, t2) {
      let i2 = new (k.get(e2))(t2, this.options, this.file);
      return this.parsers[e2] = i2;
    }
    createParsers(e2) {
      for (let t2 of e2) {
        let { type: e3, chunk: i2 } = t2, s2 = this.options[e3];
        if (s2 && s2.enabled) {
          let t3 = this.parsers[e3];
          t3 && t3.append || t3 || this.createParser(e3, i2);
        }
      }
    }
    async readSegments(e2) {
      let t2 = e2.map(this.ensureSegmentChunk);
      await Promise.all(t2);
    }
  };
  var te = class {
    static findPosition(e2, t2) {
      let i2 = e2.getUint16(t2 + 2) + 2, s2 = "function" == typeof this.headerLength ? this.headerLength(e2, t2, i2) : this.headerLength, n2 = t2 + s2, r2 = i2 - s2;
      return { offset: t2, length: i2, headerLength: s2, start: n2, size: r2, end: n2 + r2 };
    }
    static parse(e2, t2 = {}) {
      return new this(e2, new K({ [this.type]: t2 }), e2).parse();
    }
    normalizeInput(e2) {
      return e2 instanceof y ? e2 : new y(e2);
    }
    constructor(t2, i2 = {}, s2) {
      e(this, "errors", []), e(this, "raw", /* @__PURE__ */ new Map()), e(this, "handleError", (e2) => {
        if (!this.options.silentErrors) throw e2;
        this.errors.push(e2.message);
      }), this.chunk = this.normalizeInput(t2), this.file = s2, this.type = this.constructor.type, this.globalOptions = this.options = i2, this.localOptions = i2[this.type], this.canTranslate = this.localOptions && this.localOptions.translate;
    }
    translate() {
      this.canTranslate && (this.translated = this.translateBlock(this.raw, this.type));
    }
    get output() {
      return this.translated ? this.translated : this.raw ? Object.fromEntries(this.raw) : void 0;
    }
    translateBlock(e2, t2) {
      let i2 = T.get(t2), s2 = D.get(t2), n2 = L.get(t2), r2 = this.options[t2], a2 = r2.reviveValues && !!i2, o2 = r2.translateValues && !!s2, h2 = r2.translateKeys && !!n2, l2 = {};
      for (let [t3, r3] of e2) a2 && i2.has(t3) ? r3 = i2.get(t3)(r3) : o2 && s2.has(t3) && (r3 = this.translateValue(r3, s2.get(t3))), h2 && n2.has(t3) && (t3 = n2.get(t3) || t3), l2[t3] = r3;
      return l2;
    }
    translateValue(e2, t2) {
      return t2[e2] || t2.DEFAULT || e2;
    }
    assignToOutput(e2, t2) {
      this.assignObjectToOutput(e2, this.constructor.type, t2);
    }
    assignObjectToOutput(e2, t2, i2) {
      if (this.globalOptions.mergeOutput) return Object.assign(e2, i2);
      e2[t2] ? Object.assign(e2[t2], i2) : e2[t2] = i2;
    }
  };
  e(te, "headerLength", 4), e(te, "type", void 0), e(te, "multiSegment", false), e(te, "canHandle", () => false);
  function ie(e2) {
    return 192 === e2 || 194 === e2 || 196 === e2 || 219 === e2 || 221 === e2 || 218 === e2 || 254 === e2;
  }
  function se(e2) {
    return e2 >= 224 && e2 <= 239;
  }
  function ne(e2, t2, i2) {
    for (let [s2, n2] of k) if (n2.canHandle(e2, t2, i2)) return s2;
  }
  var re = class extends ee {
    constructor(...t2) {
      super(...t2), e(this, "appSegments", []), e(this, "jpegSegments", []), e(this, "unknownSegments", []);
    }
    static canHandle(e2, t2) {
      return 65496 === t2;
    }
    async parse() {
      await this.findAppSegments(), await this.readSegments(this.appSegments), this.mergeMultiSegments(), this.createParsers(this.mergedAppSegments || this.appSegments);
    }
    setupSegmentFinderArgs(e2) {
      true === e2 ? (this.findAll = true, this.wanted = new Set(k.keyList())) : (e2 = void 0 === e2 ? k.keyList().filter((e3) => this.options[e3].enabled) : e2.filter((e3) => this.options[e3].enabled && k.has(e3)), this.findAll = false, this.remaining = new Set(e2), this.wanted = new Set(e2)), this.unfinishedMultiSegment = false;
    }
    async findAppSegments(e2 = 0, t2) {
      this.setupSegmentFinderArgs(t2);
      let { file: i2, findAll: s2, wanted: n2, remaining: r2 } = this;
      if (!s2 && this.file.chunked && (s2 = Array.from(n2).some((e3) => {
        let t3 = k.get(e3), i3 = this.options[e3];
        return t3.multiSegment && i3.multiSegment;
      }), s2 && await this.file.readWhole()), e2 = this.findAppSegmentsInRange(e2, i2.byteLength), !this.options.onlyTiff && i2.chunked) {
        let t3 = false;
        for (; r2.size > 0 && !t3 && (i2.canReadNextChunk || this.unfinishedMultiSegment); ) {
          let { nextChunkOffset: s3 } = i2, n3 = this.appSegments.some((e3) => !this.file.available(e3.offset || e3.start, e3.length || e3.size));
          if (t3 = e2 > s3 && !n3 ? !await i2.readNextChunk(e2) : !await i2.readNextChunk(s3), void 0 === (e2 = this.findAppSegmentsInRange(e2, i2.byteLength))) return;
        }
      }
    }
    findAppSegmentsInRange(e2, t2) {
      t2 -= 2;
      let i2, s2, n2, r2, a2, o2, { file: h2, findAll: l2, wanted: f2, remaining: u2, options: d2 } = this;
      for (; e2 < t2; e2++) if (255 === h2.getUint8(e2)) {
        if (i2 = h2.getUint8(e2 + 1), se(i2)) {
          if (s2 = h2.getUint16(e2 + 2), n2 = ne(h2, e2, s2), n2 && f2.has(n2) && (r2 = k.get(n2), a2 = r2.findPosition(h2, e2), o2 = d2[n2], a2.type = n2, this.appSegments.push(a2), !l2 && (r2.multiSegment && o2.multiSegment ? (this.unfinishedMultiSegment = a2.chunkNumber < a2.chunkCount, this.unfinishedMultiSegment || u2.delete(n2)) : u2.delete(n2), 0 === u2.size))) break;
          d2.recordUnknownSegments && (a2 = te.findPosition(h2, e2), a2.marker = i2, this.unknownSegments.push(a2)), e2 += s2 + 1;
        } else if (ie(i2)) {
          if (s2 = h2.getUint16(e2 + 2), 218 === i2 && false !== d2.stopAfterSos) return;
          d2.recordJpegSegments && this.jpegSegments.push({ offset: e2, length: s2, marker: i2 }), e2 += s2 + 1;
        }
      }
      return e2;
    }
    mergeMultiSegments() {
      if (!this.appSegments.some((e3) => e3.multiSegment)) return;
      let e2 = function(e3, t2) {
        let i2, s2, n2, r2 = /* @__PURE__ */ new Map();
        for (let a2 = 0; a2 < e3.length; a2++) i2 = e3[a2], s2 = i2[t2], r2.has(s2) ? n2 = r2.get(s2) : r2.set(s2, n2 = []), n2.push(i2);
        return Array.from(r2);
      }(this.appSegments, "type");
      this.mergedAppSegments = e2.map(([e3, t2]) => {
        let i2 = k.get(e3, this.options);
        if (i2.handleMultiSegments) {
          return { type: e3, chunk: i2.handleMultiSegments(t2) };
        }
        return t2[0];
      });
    }
    getSegment(e2) {
      return this.appSegments.find((t2) => t2.type === e2);
    }
    async getOrFindSegment(e2) {
      let t2 = this.getSegment(e2);
      return void 0 === t2 && (await this.findAppSegments(0, [e2]), t2 = this.getSegment(e2)), t2;
    }
  };
  e(re, "type", "jpeg"), S.set("jpeg", re);
  var ae = [void 0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8, 4];
  var oe = class extends te {
    parseHeader() {
      var e2 = this.chunk.getUint16();
      18761 === e2 ? this.le = true : 19789 === e2 && (this.le = false), this.chunk.le = this.le, this.headerParsed = true;
    }
    parseTags(e2, t2, i2 = /* @__PURE__ */ new Map()) {
      let { pick: s2, skip: n2 } = this.options[t2];
      s2 = new Set(s2);
      let r2 = s2.size > 0, a2 = 0 === n2.size, o2 = this.chunk.getUint16(e2);
      e2 += 2;
      for (let h2 = 0; h2 < o2; h2++) {
        let o3 = this.chunk.getUint16(e2);
        if (r2) {
          if (s2.has(o3) && (i2.set(o3, this.parseTag(e2, o3, t2)), s2.delete(o3), 0 === s2.size)) break;
        } else !a2 && n2.has(o3) || i2.set(o3, this.parseTag(e2, o3, t2));
        e2 += 12;
      }
      return i2;
    }
    parseTag(e2, t2, i2) {
      let { chunk: s2 } = this, n2 = s2.getUint16(e2 + 2), r2 = s2.getUint32(e2 + 4), a2 = ae[n2];
      if (a2 * r2 <= 4 ? e2 += 8 : e2 = s2.getUint32(e2 + 8), (n2 < 1 || n2 > 13) && u(`Invalid TIFF value type. block: ${i2.toUpperCase()}, tag: ${t2.toString(16)}, type: ${n2}, offset ${e2}`), e2 > s2.byteLength && u(`Invalid TIFF value offset. block: ${i2.toUpperCase()}, tag: ${t2.toString(16)}, type: ${n2}, offset ${e2} is outside of chunk size ${s2.byteLength}`), 1 === n2) return s2.getUint8Array(e2, r2);
      if (2 === n2) return d(s2.getString(e2, r2));
      if (7 === n2) return s2.getUint8Array(e2, r2);
      if (1 === r2) return this.parseTagValue(n2, e2);
      {
        let t3 = new (function(e3) {
          switch (e3) {
            case 1:
              return Uint8Array;
            case 3:
              return Uint16Array;
            case 4:
              return Uint32Array;
            case 5:
              return Array;
            case 6:
              return Int8Array;
            case 8:
              return Int16Array;
            case 9:
              return Int32Array;
            case 10:
              return Array;
            case 11:
              return Float32Array;
            case 12:
              return Float64Array;
            default:
              return Array;
          }
        }(n2))(r2), i3 = a2;
        for (let s3 = 0; s3 < r2; s3++) t3[s3] = this.parseTagValue(n2, e2), e2 += i3;
        return t3;
      }
    }
    parseTagValue(e2, t2) {
      let { chunk: i2 } = this;
      switch (e2) {
        case 1:
          return i2.getUint8(t2);
        case 3:
          return i2.getUint16(t2);
        case 4:
          return i2.getUint32(t2);
        case 5:
          return i2.getUint32(t2) / i2.getUint32(t2 + 4);
        case 6:
          return i2.getInt8(t2);
        case 8:
          return i2.getInt16(t2);
        case 9:
          return i2.getInt32(t2);
        case 10:
          return i2.getInt32(t2) / i2.getInt32(t2 + 4);
        case 11:
          return i2.getFloat(t2);
        case 12:
          return i2.getDouble(t2);
        case 13:
          return i2.getUint32(t2);
        default:
          u(`Invalid tiff type ${e2}`);
      }
    }
  };
  var he = class extends oe {
    static canHandle(e2, t2) {
      return 225 === e2.getUint8(t2 + 1) && 1165519206 === e2.getUint32(t2 + 4) && 0 === e2.getUint16(t2 + 8);
    }
    async parse() {
      this.parseHeader();
      let { options: e2 } = this;
      return e2.ifd0.enabled && await this.parseIfd0Block(), e2.exif.enabled && await this.safeParse("parseExifBlock"), e2.gps.enabled && await this.safeParse("parseGpsBlock"), e2.interop.enabled && await this.safeParse("parseInteropBlock"), e2.ifd1.enabled && await this.safeParse("parseThumbnailBlock"), this.createOutput();
    }
    safeParse(e2) {
      let t2 = this[e2]();
      return void 0 !== t2.catch && (t2 = t2.catch(this.handleError)), t2;
    }
    findIfd0Offset() {
      void 0 === this.ifd0Offset && (this.ifd0Offset = this.chunk.getUint32(4));
    }
    findIfd1Offset() {
      if (void 0 === this.ifd1Offset) {
        this.findIfd0Offset();
        let e2 = this.chunk.getUint16(this.ifd0Offset), t2 = this.ifd0Offset + 2 + 12 * e2;
        this.ifd1Offset = this.chunk.getUint32(t2);
      }
    }
    parseBlock(e2, t2) {
      let i2 = /* @__PURE__ */ new Map();
      return this[t2] = i2, this.parseTags(e2, t2, i2), i2;
    }
    async parseIfd0Block() {
      if (this.ifd0) return;
      let { file: e2 } = this;
      this.findIfd0Offset(), this.ifd0Offset < 8 && u("Malformed EXIF data"), !e2.chunked && this.ifd0Offset > e2.byteLength && u(`IFD0 offset points to outside of file.
this.ifd0Offset: ${this.ifd0Offset}, file.byteLength: ${e2.byteLength}`), e2.tiff && await e2.ensureChunk(this.ifd0Offset, c(this.options));
      let t2 = this.parseBlock(this.ifd0Offset, "ifd0");
      return 0 !== t2.size ? (this.exifOffset = t2.get(34665), this.interopOffset = t2.get(40965), this.gpsOffset = t2.get(34853), this.xmp = t2.get(700), this.iptc = t2.get(33723), this.icc = t2.get(34675), this.options.sanitize && (t2.delete(34665), t2.delete(40965), t2.delete(34853), t2.delete(700), t2.delete(33723), t2.delete(34675)), t2) : void 0;
    }
    async parseExifBlock() {
      if (this.exif) return;
      if (this.ifd0 || await this.parseIfd0Block(), void 0 === this.exifOffset) return;
      this.file.tiff && await this.file.ensureChunk(this.exifOffset, c(this.options));
      let e2 = this.parseBlock(this.exifOffset, "exif");
      return this.interopOffset || (this.interopOffset = e2.get(40965)), this.makerNote = e2.get(37500), this.userComment = e2.get(37510), this.options.sanitize && (e2.delete(40965), e2.delete(37500), e2.delete(37510)), this.unpack(e2, 41728), this.unpack(e2, 41729), e2;
    }
    unpack(e2, t2) {
      let i2 = e2.get(t2);
      i2 && 1 === i2.length && e2.set(t2, i2[0]);
    }
    async parseGpsBlock() {
      if (this.gps) return;
      if (this.ifd0 || await this.parseIfd0Block(), void 0 === this.gpsOffset) return;
      let e2 = this.parseBlock(this.gpsOffset, "gps");
      return e2 && e2.has(2) && e2.has(4) && (e2.set("latitude", le(...e2.get(2), e2.get(1))), e2.set("longitude", le(...e2.get(4), e2.get(3)))), e2;
    }
    async parseInteropBlock() {
      if (!this.interop && (this.ifd0 || await this.parseIfd0Block(), void 0 !== this.interopOffset || this.exif || await this.parseExifBlock(), void 0 !== this.interopOffset)) return this.parseBlock(this.interopOffset, "interop");
    }
    async parseThumbnailBlock(e2 = false) {
      if (!this.ifd1 && !this.ifd1Parsed && (!this.options.mergeOutput || e2)) return this.findIfd1Offset(), this.ifd1Offset > 0 && (this.parseBlock(this.ifd1Offset, "ifd1"), this.ifd1Parsed = true), this.ifd1;
    }
    async extractThumbnail() {
      if (this.headerParsed || this.parseHeader(), this.ifd1Parsed || await this.parseThumbnailBlock(true), void 0 === this.ifd1) return;
      let e2 = this.ifd1.get(513), t2 = this.ifd1.get(514);
      return this.chunk.getUint8Array(e2, t2);
    }
    get image() {
      return this.ifd0;
    }
    get thumbnail() {
      return this.ifd1;
    }
    createOutput() {
      let e2, t2, i2, s2 = {};
      for (t2 of M) if (e2 = this[t2], !f(e2)) if (i2 = this.canTranslate ? this.translateBlock(e2, t2) : Object.fromEntries(e2), this.options.mergeOutput) {
        if ("ifd1" === t2) continue;
        Object.assign(s2, i2);
      } else s2[t2] = i2;
      return this.makerNote && (s2.makerNote = this.makerNote), this.userComment && (s2.userComment = this.userComment), s2;
    }
    assignToOutput(e2, t2) {
      if (this.globalOptions.mergeOutput) Object.assign(e2, t2);
      else for (let [i2, s2] of Object.entries(t2)) this.assignObjectToOutput(e2, i2, s2);
    }
  };
  function le(e2, t2, i2, s2) {
    var n2 = e2 + t2 / 60 + i2 / 3600;
    return "S" !== s2 && "W" !== s2 || (n2 *= -1), n2;
  }
  e(he, "type", "tiff"), e(he, "headerLength", 10), k.set("tiff", he);
  var fe = Object.freeze({ __proto__: null, default: Q, Exifr: J, fileParsers: S, segmentParsers: k, fileReaders: v, tagKeys: L, tagValues: D, tagRevivers: T, createDictionary: B, extendDictionary: F, fetchUrlAsArrayBuffer: A, readBlobAsArrayBuffer: U, chunkedProps: z, otherSegments: N, segments: V, tiffBlocks: M, segmentsAndBlocks: E, tiffExtractables: R, inheritables: j, allFormatters: G, Options: K, parse: Z });
  var ue = { ifd0: false, ifd1: false, exif: false, gps: false, interop: false, sanitize: false, reviveValues: true, translateKeys: false, translateValues: false, mergeOutput: false };
  var de = Object.assign({}, ue, { firstChunkSize: 4e4, gps: [1, 2, 3, 4] });
  async function ce(e2) {
    let t2 = new J(de);
    await t2.read(e2);
    let i2 = await t2.parse();
    if (i2 && i2.gps) {
      let { latitude: e3, longitude: t3 } = i2.gps;
      return { latitude: e3, longitude: t3 };
    }
  }
  var ge = Object.assign({}, ue, { tiff: false, ifd1: true, mergeOutput: false });
  async function pe(e2) {
    let t2 = new J(ge);
    await t2.read(e2);
    let i2 = await t2.extractThumbnail();
    return i2 && o ? r.from(i2) : i2;
  }
  async function me(e2) {
    let t2 = await this.thumbnail(e2);
    if (void 0 !== t2) {
      let e3 = new Blob([t2]);
      return URL.createObjectURL(e3);
    }
  }
  var ye = Object.assign({}, ue, { firstChunkSize: 4e4, ifd0: [274] });
  async function be(e2) {
    let t2 = new J(ye);
    await t2.read(e2);
    let i2 = await t2.parse();
    if (i2 && i2.ifd0) return i2.ifd0[274];
  }
  var we = Object.freeze({ 1: { dimensionSwapped: false, scaleX: 1, scaleY: 1, deg: 0, rad: 0 }, 2: { dimensionSwapped: false, scaleX: -1, scaleY: 1, deg: 0, rad: 0 }, 3: { dimensionSwapped: false, scaleX: 1, scaleY: 1, deg: 180, rad: 180 * Math.PI / 180 }, 4: { dimensionSwapped: false, scaleX: -1, scaleY: 1, deg: 180, rad: 180 * Math.PI / 180 }, 5: { dimensionSwapped: true, scaleX: 1, scaleY: -1, deg: 90, rad: 90 * Math.PI / 180 }, 6: { dimensionSwapped: true, scaleX: 1, scaleY: 1, deg: 90, rad: 90 * Math.PI / 180 }, 7: { dimensionSwapped: true, scaleX: 1, scaleY: -1, deg: 270, rad: 270 * Math.PI / 180 }, 8: { dimensionSwapped: true, scaleX: 1, scaleY: 1, deg: 270, rad: 270 * Math.PI / 180 } });
  var Se = true;
  var ke = true;
  if ("object" == typeof navigator) {
    let e2 = navigator.userAgent;
    if (e2.includes("iPad") || e2.includes("iPhone")) {
      let t2 = e2.match(/OS (\d+)_(\d+)/);
      if (t2) {
        let [, e3, i2] = t2, s2 = Number(e3) + 0.1 * Number(i2);
        Se = s2 < 13.4, ke = false;
      }
    } else if (e2.includes("OS X 10")) {
      let [, t2] = e2.match(/OS X 10[_.](\d+)/);
      Se = ke = Number(t2) < 15;
    }
    if (e2.includes("Chrome/")) {
      let [, t2] = e2.match(/Chrome\/(\d+)/);
      Se = ke = Number(t2) < 81;
    } else if (e2.includes("Firefox/")) {
      let [, t2] = e2.match(/Firefox\/(\d+)/);
      Se = ke = Number(t2) < 77;
    }
  }
  async function ve(e2) {
    let t2 = await be(e2);
    return Object.assign({ canvas: Se, css: ke }, we[t2]);
  }
  var Oe = class extends y {
    constructor(...t2) {
      super(...t2), e(this, "ranges", new xe()), 0 !== this.byteLength && this.ranges.add(0, this.byteLength);
    }
    _tryExtend(e2, t2, i2) {
      if (0 === e2 && 0 === this.byteLength && i2) {
        let e3 = new DataView(i2.buffer || i2, i2.byteOffset, i2.byteLength);
        this._swapDataView(e3);
      } else {
        let i3 = e2 + t2;
        if (i3 > this.byteLength) {
          let { dataView: e3 } = this._extend(i3);
          this._swapDataView(e3);
        }
      }
    }
    _extend(e2) {
      let t2;
      t2 = o ? r.allocUnsafe(e2) : new Uint8Array(e2);
      let i2 = new DataView(t2.buffer, t2.byteOffset, t2.byteLength);
      return t2.set(new Uint8Array(this.buffer, this.byteOffset, this.byteLength), 0), { uintView: t2, dataView: i2 };
    }
    subarray(e2, t2, i2 = false) {
      return t2 = t2 || this._lengthToEnd(e2), i2 && this._tryExtend(e2, t2), this.ranges.add(e2, t2), super.subarray(e2, t2);
    }
    set(e2, t2, i2 = false) {
      i2 && this._tryExtend(t2, e2.byteLength, e2);
      let s2 = super.set(e2, t2);
      return this.ranges.add(t2, s2.byteLength), s2;
    }
    async ensureChunk(e2, t2) {
      this.chunked && (this.ranges.available(e2, t2) || await this.readChunk(e2, t2));
    }
    available(e2, t2) {
      return this.ranges.available(e2, t2);
    }
  };
  var xe = class {
    constructor() {
      e(this, "list", []);
    }
    get length() {
      return this.list.length;
    }
    add(e2, t2, i2 = 0) {
      let s2 = e2 + t2, n2 = this.list.filter((t3) => Ce(e2, t3.offset, s2) || Ce(e2, t3.end, s2));
      if (n2.length > 0) {
        e2 = Math.min(e2, ...n2.map((e3) => e3.offset)), s2 = Math.max(s2, ...n2.map((e3) => e3.end)), t2 = s2 - e2;
        let i3 = n2.shift();
        i3.offset = e2, i3.length = t2, i3.end = s2, this.list = this.list.filter((e3) => !n2.includes(e3));
      } else this.list.push({ offset: e2, length: t2, end: s2 });
    }
    available(e2, t2) {
      let i2 = e2 + t2;
      return this.list.some((t3) => t3.offset <= e2 && i2 <= t3.end);
    }
  };
  function Ce(e2, t2, i2) {
    return e2 <= t2 && t2 <= i2;
  }
  var Pe = class extends Oe {
    constructor(t2, i2) {
      super(0), e(this, "chunksRead", 0), this.input = t2, this.options = i2;
    }
    async readWhole() {
      this.chunked = false, await this.readChunk(this.nextChunkOffset);
    }
    async readChunked() {
      this.chunked = true, await this.readChunk(0, this.options.firstChunkSize);
    }
    async readNextChunk(e2 = this.nextChunkOffset) {
      if (this.fullyRead) return this.chunksRead++, false;
      let t2 = this.options.chunkSize, i2 = await this.readChunk(e2, t2);
      return !!i2 && i2.byteLength === t2;
    }
    async readChunk(e2, t2) {
      if (this.chunksRead++, 0 !== (t2 = this.safeWrapAddress(e2, t2))) return this._readChunk(e2, t2);
    }
    safeWrapAddress(e2, t2) {
      return void 0 !== this.size && e2 + t2 > this.size ? Math.max(0, this.size - e2) : t2;
    }
    get nextChunkOffset() {
      if (0 !== this.ranges.list.length) return this.ranges.list[0].length;
    }
    get canReadNextChunk() {
      return this.chunksRead < this.options.chunkLimit;
    }
    get fullyRead() {
      return void 0 !== this.size && this.nextChunkOffset === this.size;
    }
    read() {
      return this.options.chunked ? this.readChunked() : this.readWhole();
    }
    close() {
    }
  };
  v.set("blob", class extends Pe {
    async readWhole() {
      this.chunked = false;
      let e2 = await U(this.input);
      this._swapArrayBuffer(e2);
    }
    readChunked() {
      return this.chunked = true, this.size = this.input.size, super.readChunked();
    }
    async _readChunk(e2, t2) {
      let i2 = t2 ? e2 + t2 : void 0, s2 = this.input.slice(e2, i2), n2 = await U(s2);
      return this.set(n2, e2, true);
    }
  });
  var Ae = Object.freeze({ __proto__: null, default: fe, Exifr: J, fileParsers: S, segmentParsers: k, fileReaders: v, tagKeys: L, tagValues: D, tagRevivers: T, createDictionary: B, extendDictionary: F, fetchUrlAsArrayBuffer: A, readBlobAsArrayBuffer: U, chunkedProps: z, otherSegments: N, segments: V, tiffBlocks: M, segmentsAndBlocks: E, tiffExtractables: R, inheritables: j, allFormatters: G, Options: K, parse: Z, gpsOnlyOptions: de, gps: ce, thumbnailOnlyOptions: ge, thumbnail: pe, thumbnailUrl: me, orientationOnlyOptions: ye, orientation: be, rotations: we, get rotateCanvas() {
    return Se;
  }, get rotateCss() {
    return ke;
  }, rotation: ve });
  v.set("url", class extends Pe {
    async readWhole() {
      this.chunked = false;
      let e2 = await A(this.input);
      e2 instanceof ArrayBuffer ? this._swapArrayBuffer(e2) : e2 instanceof Uint8Array && this._swapBuffer(e2);
    }
    async _readChunk(e2, t2) {
      let i2 = t2 ? e2 + t2 - 1 : void 0, s2 = this.options.httpHeaders || {};
      (e2 || i2) && (s2.range = `bytes=${[e2, i2].join("-")}`);
      let n2 = await O(this.input, { headers: s2 }), r2 = await n2.arrayBuffer(), a2 = r2.byteLength;
      if (416 !== n2.status) return a2 !== t2 && (this.size = e2 + a2), this.set(r2, e2, true);
    }
  });
  y.prototype.getUint64 = function(e2) {
    let t2 = this.getUint32(e2), i2 = this.getUint32(e2 + 4);
    return t2 < 1048575 ? t2 << 32 | i2 : void 0 !== typeof a ? (console.warn("Using BigInt because of type 64uint but JS can only handle 53b numbers."), a(t2) << a(32) | a(i2)) : void u("Trying to read 64b value but JS can only handle 53b numbers.");
  };
  var Ue = class extends ee {
    parseBoxes(e2 = 0) {
      let t2 = [];
      for (; e2 < this.file.byteLength - 4; ) {
        let i2 = this.parseBoxHead(e2);
        if (t2.push(i2), 0 === i2.length) break;
        e2 += i2.length;
      }
      return t2;
    }
    parseSubBoxes(e2) {
      e2.boxes = this.parseBoxes(e2.start);
    }
    findBox(e2, t2) {
      return void 0 === e2.boxes && this.parseSubBoxes(e2), e2.boxes.find((e3) => e3.kind === t2);
    }
    parseBoxHead(e2) {
      let t2 = this.file.getUint32(e2), i2 = this.file.getString(e2 + 4, 4), s2 = e2 + 8;
      return 1 === t2 && (t2 = this.file.getUint64(e2 + 8), s2 += 8), { offset: e2, length: t2, kind: i2, start: s2 };
    }
    parseBoxFullHead(e2) {
      if (void 0 !== e2.version) return;
      let t2 = this.file.getUint32(e2.start);
      e2.version = t2 >> 24, e2.start += 4;
    }
  };
  var Ie = class extends Ue {
    static canHandle(e2, t2) {
      if (0 !== t2) return false;
      let i2 = e2.getUint16(2);
      if (i2 > 50) return false;
      let s2 = 16, n2 = [];
      for (; s2 < i2; ) n2.push(e2.getString(s2, 4)), s2 += 4;
      return n2.includes(this.type);
    }
    async parse() {
      let e2 = this.file.getUint32(0), t2 = this.parseBoxHead(e2);
      for (; "meta" !== t2.kind; ) e2 += t2.length, await this.file.ensureChunk(e2, 16), t2 = this.parseBoxHead(e2);
      await this.file.ensureChunk(t2.offset, t2.length), this.parseBoxFullHead(t2), this.parseSubBoxes(t2), this.options.icc.enabled && await this.findIcc(t2), this.options.tiff.enabled && await this.findExif(t2);
    }
    async registerSegment(e2, t2, i2) {
      await this.file.ensureChunk(t2, i2);
      let s2 = this.file.subarray(t2, i2);
      this.createParser(e2, s2);
    }
    async findIcc(e2) {
      let t2 = this.findBox(e2, "iprp");
      if (void 0 === t2) return;
      let i2 = this.findBox(t2, "ipco");
      if (void 0 === i2) return;
      let s2 = this.findBox(i2, "colr");
      void 0 !== s2 && await this.registerSegment("icc", s2.offset + 12, s2.length);
    }
    async findExif(e2) {
      let t2 = this.findBox(e2, "iinf");
      if (void 0 === t2) return;
      let i2 = this.findBox(e2, "iloc");
      if (void 0 === i2) return;
      let s2 = this.findExifLocIdInIinf(t2), n2 = this.findExtentInIloc(i2, s2);
      if (void 0 === n2) return;
      let [r2, a2] = n2;
      await this.file.ensureChunk(r2, a2);
      let o2 = 4 + this.file.getUint32(r2);
      r2 += o2, a2 -= o2, await this.registerSegment("tiff", r2, a2);
    }
    findExifLocIdInIinf(e2) {
      this.parseBoxFullHead(e2);
      let t2, i2, s2, n2, r2 = e2.start, a2 = this.file.getUint16(r2);
      for (r2 += 2; a2--; ) {
        if (t2 = this.parseBoxHead(r2), this.parseBoxFullHead(t2), i2 = t2.start, t2.version >= 2 && (s2 = 3 === t2.version ? 4 : 2, n2 = this.file.getString(i2 + s2 + 2, 4), "Exif" === n2)) return this.file.getUintBytes(i2, s2);
        r2 += t2.length;
      }
    }
    get8bits(e2) {
      let t2 = this.file.getUint8(e2);
      return [t2 >> 4, 15 & t2];
    }
    findExtentInIloc(e2, t2) {
      this.parseBoxFullHead(e2);
      let i2 = e2.start, [s2, n2] = this.get8bits(i2++), [r2, a2] = this.get8bits(i2++), o2 = 2 === e2.version ? 4 : 2, h2 = 1 === e2.version || 2 === e2.version ? 2 : 0, l2 = a2 + s2 + n2, f2 = 2 === e2.version ? 4 : 2, u2 = this.file.getUintBytes(i2, f2);
      for (i2 += f2; u2--; ) {
        let e3 = this.file.getUintBytes(i2, o2);
        i2 += o2 + h2 + 2 + r2;
        let f3 = this.file.getUint16(i2);
        if (i2 += 2, e3 === t2) return f3 > 1 && console.warn("ILOC box has more than one extent but we're only processing one\nPlease create an issue at https://github.com/MikeKovarik/exifr with this file"), [this.file.getUintBytes(i2 + a2, s2), this.file.getUintBytes(i2 + a2 + s2, n2)];
        i2 += f3 * l2;
      }
    }
  };
  var Be = class extends Ie {
  };
  e(Be, "type", "heic");
  var Fe = class extends Ie {
  };
  e(Fe, "type", "avif"), S.set("heic", Be), S.set("avif", Fe), B(L, ["ifd0", "ifd1"], [[256, "ImageWidth"], [257, "ImageHeight"], [258, "BitsPerSample"], [259, "Compression"], [262, "PhotometricInterpretation"], [270, "ImageDescription"], [271, "Make"], [272, "Model"], [273, "StripOffsets"], [274, "Orientation"], [277, "SamplesPerPixel"], [278, "RowsPerStrip"], [279, "StripByteCounts"], [282, "XResolution"], [283, "YResolution"], [284, "PlanarConfiguration"], [296, "ResolutionUnit"], [301, "TransferFunction"], [305, "Software"], [306, "ModifyDate"], [315, "Artist"], [316, "HostComputer"], [317, "Predictor"], [318, "WhitePoint"], [319, "PrimaryChromaticities"], [513, "ThumbnailOffset"], [514, "ThumbnailLength"], [529, "YCbCrCoefficients"], [530, "YCbCrSubSampling"], [531, "YCbCrPositioning"], [532, "ReferenceBlackWhite"], [700, "ApplicationNotes"], [33432, "Copyright"], [33723, "IPTC"], [34665, "ExifIFD"], [34675, "ICC"], [34853, "GpsIFD"], [330, "SubIFD"], [40965, "InteropIFD"], [40091, "XPTitle"], [40092, "XPComment"], [40093, "XPAuthor"], [40094, "XPKeywords"], [40095, "XPSubject"]]), B(L, "exif", [[33434, "ExposureTime"], [33437, "FNumber"], [34850, "ExposureProgram"], [34852, "SpectralSensitivity"], [34855, "ISO"], [34858, "TimeZoneOffset"], [34859, "SelfTimerMode"], [34864, "SensitivityType"], [34865, "StandardOutputSensitivity"], [34866, "RecommendedExposureIndex"], [34867, "ISOSpeed"], [34868, "ISOSpeedLatitudeyyy"], [34869, "ISOSpeedLatitudezzz"], [36864, "ExifVersion"], [36867, "DateTimeOriginal"], [36868, "CreateDate"], [36873, "GooglePlusUploadCode"], [36880, "OffsetTime"], [36881, "OffsetTimeOriginal"], [36882, "OffsetTimeDigitized"], [37121, "ComponentsConfiguration"], [37122, "CompressedBitsPerPixel"], [37377, "ShutterSpeedValue"], [37378, "ApertureValue"], [37379, "BrightnessValue"], [37380, "ExposureCompensation"], [37381, "MaxApertureValue"], [37382, "SubjectDistance"], [37383, "MeteringMode"], [37384, "LightSource"], [37385, "Flash"], [37386, "FocalLength"], [37393, "ImageNumber"], [37394, "SecurityClassification"], [37395, "ImageHistory"], [37396, "SubjectArea"], [37500, "MakerNote"], [37510, "UserComment"], [37520, "SubSecTime"], [37521, "SubSecTimeOriginal"], [37522, "SubSecTimeDigitized"], [37888, "AmbientTemperature"], [37889, "Humidity"], [37890, "Pressure"], [37891, "WaterDepth"], [37892, "Acceleration"], [37893, "CameraElevationAngle"], [40960, "FlashpixVersion"], [40961, "ColorSpace"], [40962, "ExifImageWidth"], [40963, "ExifImageHeight"], [40964, "RelatedSoundFile"], [41483, "FlashEnergy"], [41486, "FocalPlaneXResolution"], [41487, "FocalPlaneYResolution"], [41488, "FocalPlaneResolutionUnit"], [41492, "SubjectLocation"], [41493, "ExposureIndex"], [41495, "SensingMethod"], [41728, "FileSource"], [41729, "SceneType"], [41730, "CFAPattern"], [41985, "CustomRendered"], [41986, "ExposureMode"], [41987, "WhiteBalance"], [41988, "DigitalZoomRatio"], [41989, "FocalLengthIn35mmFormat"], [41990, "SceneCaptureType"], [41991, "GainControl"], [41992, "Contrast"], [41993, "Saturation"], [41994, "Sharpness"], [41996, "SubjectDistanceRange"], [42016, "ImageUniqueID"], [42032, "OwnerName"], [42033, "SerialNumber"], [42034, "LensInfo"], [42035, "LensMake"], [42036, "LensModel"], [42037, "LensSerialNumber"], [42080, "CompositeImage"], [42081, "CompositeImageCount"], [42082, "CompositeImageExposureTimes"], [42240, "Gamma"], [59932, "Padding"], [59933, "OffsetSchema"], [65e3, "OwnerName"], [65001, "SerialNumber"], [65002, "Lens"], [65100, "RawFile"], [65101, "Converter"], [65102, "WhiteBalance"], [65105, "Exposure"], [65106, "Shadows"], [65107, "Brightness"], [65108, "Contrast"], [65109, "Saturation"], [65110, "Sharpness"], [65111, "Smoothness"], [65112, "MoireFilter"], [40965, "InteropIFD"]]), B(L, "gps", [[0, "GPSVersionID"], [1, "GPSLatitudeRef"], [2, "GPSLatitude"], [3, "GPSLongitudeRef"], [4, "GPSLongitude"], [5, "GPSAltitudeRef"], [6, "GPSAltitude"], [7, "GPSTimeStamp"], [8, "GPSSatellites"], [9, "GPSStatus"], [10, "GPSMeasureMode"], [11, "GPSDOP"], [12, "GPSSpeedRef"], [13, "GPSSpeed"], [14, "GPSTrackRef"], [15, "GPSTrack"], [16, "GPSImgDirectionRef"], [17, "GPSImgDirection"], [18, "GPSMapDatum"], [19, "GPSDestLatitudeRef"], [20, "GPSDestLatitude"], [21, "GPSDestLongitudeRef"], [22, "GPSDestLongitude"], [23, "GPSDestBearingRef"], [24, "GPSDestBearing"], [25, "GPSDestDistanceRef"], [26, "GPSDestDistance"], [27, "GPSProcessingMethod"], [28, "GPSAreaInformation"], [29, "GPSDateStamp"], [30, "GPSDifferential"], [31, "GPSHPositioningError"]]), B(D, ["ifd0", "ifd1"], [[274, { 1: "Horizontal (normal)", 2: "Mirror horizontal", 3: "Rotate 180", 4: "Mirror vertical", 5: "Mirror horizontal and rotate 270 CW", 6: "Rotate 90 CW", 7: "Mirror horizontal and rotate 90 CW", 8: "Rotate 270 CW" }], [296, { 1: "None", 2: "inches", 3: "cm" }]]);
  var Le = B(D, "exif", [[34850, { 0: "Not defined", 1: "Manual", 2: "Normal program", 3: "Aperture priority", 4: "Shutter priority", 5: "Creative program", 6: "Action program", 7: "Portrait mode", 8: "Landscape mode" }], [37121, { 0: "-", 1: "Y", 2: "Cb", 3: "Cr", 4: "R", 5: "G", 6: "B" }], [37383, { 0: "Unknown", 1: "Average", 2: "CenterWeightedAverage", 3: "Spot", 4: "MultiSpot", 5: "Pattern", 6: "Partial", 255: "Other" }], [37384, { 0: "Unknown", 1: "Daylight", 2: "Fluorescent", 3: "Tungsten (incandescent light)", 4: "Flash", 9: "Fine weather", 10: "Cloudy weather", 11: "Shade", 12: "Daylight fluorescent (D 5700 - 7100K)", 13: "Day white fluorescent (N 4600 - 5400K)", 14: "Cool white fluorescent (W 3900 - 4500K)", 15: "White fluorescent (WW 3200 - 3700K)", 17: "Standard light A", 18: "Standard light B", 19: "Standard light C", 20: "D55", 21: "D65", 22: "D75", 23: "D50", 24: "ISO studio tungsten", 255: "Other" }], [37385, { 0: "Flash did not fire", 1: "Flash fired", 5: "Strobe return light not detected", 7: "Strobe return light detected", 9: "Flash fired, compulsory flash mode", 13: "Flash fired, compulsory flash mode, return light not detected", 15: "Flash fired, compulsory flash mode, return light detected", 16: "Flash did not fire, compulsory flash mode", 24: "Flash did not fire, auto mode", 25: "Flash fired, auto mode", 29: "Flash fired, auto mode, return light not detected", 31: "Flash fired, auto mode, return light detected", 32: "No flash function", 65: "Flash fired, red-eye reduction mode", 69: "Flash fired, red-eye reduction mode, return light not detected", 71: "Flash fired, red-eye reduction mode, return light detected", 73: "Flash fired, compulsory flash mode, red-eye reduction mode", 77: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected", 79: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected", 89: "Flash fired, auto mode, red-eye reduction mode", 93: "Flash fired, auto mode, return light not detected, red-eye reduction mode", 95: "Flash fired, auto mode, return light detected, red-eye reduction mode" }], [41495, { 1: "Not defined", 2: "One-chip color area sensor", 3: "Two-chip color area sensor", 4: "Three-chip color area sensor", 5: "Color sequential area sensor", 7: "Trilinear sensor", 8: "Color sequential linear sensor" }], [41728, { 1: "Film Scanner", 2: "Reflection Print Scanner", 3: "Digital Camera" }], [41729, { 1: "Directly photographed" }], [41985, { 0: "Normal", 1: "Custom", 2: "HDR (no original saved)", 3: "HDR (original saved)", 4: "Original (for HDR)", 6: "Panorama", 7: "Portrait HDR", 8: "Portrait" }], [41986, { 0: "Auto", 1: "Manual", 2: "Auto bracket" }], [41987, { 0: "Auto", 1: "Manual" }], [41990, { 0: "Standard", 1: "Landscape", 2: "Portrait", 3: "Night", 4: "Other" }], [41991, { 0: "None", 1: "Low gain up", 2: "High gain up", 3: "Low gain down", 4: "High gain down" }], [41996, { 0: "Unknown", 1: "Macro", 2: "Close", 3: "Distant" }], [42080, { 0: "Unknown", 1: "Not a Composite Image", 2: "General Composite Image", 3: "Composite Image Captured While Shooting" }]]);
  var De = { 1: "No absolute unit of measurement", 2: "Inch", 3: "Centimeter" };
  Le.set(37392, De), Le.set(41488, De);
  var Te = { 0: "Normal", 1: "Low", 2: "High" };
  function ze(e2) {
    return "object" == typeof e2 && void 0 !== e2.length ? e2[0] : e2;
  }
  function Ne(e2) {
    let t2 = Array.from(e2).slice(1);
    return t2[1] > 15 && (t2 = t2.map((e3) => String.fromCharCode(e3))), "0" !== t2[2] && 0 !== t2[2] || t2.pop(), t2.join(".");
  }
  function Ve(e2) {
    if ("string" == typeof e2) {
      var [t2, i2, s2, n2, r2, a2] = e2.trim().split(/[-: ]/g).map(Number), o2 = new Date(t2, i2 - 1, s2);
      return Number.isNaN(n2) || Number.isNaN(r2) || Number.isNaN(a2) || (o2.setHours(n2), o2.setMinutes(r2), o2.setSeconds(a2)), Number.isNaN(+o2) ? e2 : o2;
    }
  }
  function Me(e2) {
    if ("string" == typeof e2) return e2;
    let t2 = [];
    if (0 === e2[1] && 0 === e2[e2.length - 1]) for (let i2 = 0; i2 < e2.length; i2 += 2) t2.push(Ee(e2[i2 + 1], e2[i2]));
    else for (let i2 = 0; i2 < e2.length; i2 += 2) t2.push(Ee(e2[i2], e2[i2 + 1]));
    return d(String.fromCodePoint(...t2));
  }
  function Ee(e2, t2) {
    return e2 << 8 | t2;
  }
  Le.set(41992, Te), Le.set(41993, Te), Le.set(41994, Te), B(T, ["ifd0", "ifd1"], [[50827, function(e2) {
    return "string" != typeof e2 ? m(e2) : e2;
  }], [306, Ve], [40091, Me], [40092, Me], [40093, Me], [40094, Me], [40095, Me]]), B(T, "exif", [[40960, Ne], [36864, Ne], [36867, Ve], [36868, Ve], [40962, ze], [40963, ze]]), B(T, "gps", [[0, (e2) => Array.from(e2).join(".")], [7, (e2) => Array.from(e2).join(":")]]);
  var Re = class extends te {
    static canHandle(e2, t2) {
      return 225 === e2.getUint8(t2 + 1) && 1752462448 === e2.getUint32(t2 + 4) && "http://ns.adobe.com/" === e2.getString(t2 + 4, "http://ns.adobe.com/".length);
    }
    static headerLength(e2, t2) {
      return "http://ns.adobe.com/xmp/extension/" === e2.getString(t2 + 4, "http://ns.adobe.com/xmp/extension/".length) ? 79 : 4 + "http://ns.adobe.com/xap/1.0/".length + 1;
    }
    static findPosition(e2, t2) {
      let i2 = super.findPosition(e2, t2);
      return i2.multiSegment = i2.extended = 79 === i2.headerLength, i2.multiSegment ? (i2.chunkCount = e2.getUint8(t2 + 72), i2.chunkNumber = e2.getUint8(t2 + 76), 0 !== e2.getUint8(t2 + 77) && i2.chunkNumber++) : (i2.chunkCount = 1 / 0, i2.chunkNumber = -1), i2;
    }
    static handleMultiSegments(e2) {
      return e2.map((e3) => e3.chunk.getString()).join("");
    }
    normalizeInput(e2) {
      return "string" == typeof e2 ? e2 : y.from(e2).getString();
    }
    parse(e2 = this.chunk) {
      if (!this.localOptions.parse) return e2;
      e2 = function(e3) {
        let t3 = {}, i3 = {};
        for (let e4 of Ye) t3[e4] = [], i3[e4] = 0;
        return e3.replace(qe, (e4, s3, n2) => {
          if ("<" === s3) {
            let s4 = ++i3[n2];
            return t3[n2].push(s4), `${e4}#${s4}`;
          }
          return `${e4}#${t3[n2].pop()}`;
        });
      }(e2);
      let t2 = Ge.findAll(e2, "rdf", "Description");
      0 === t2.length && t2.push(new Ge("rdf", "Description", void 0, e2));
      let i2, s2 = {};
      for (let e3 of t2) for (let t3 of e3.properties) i2 = $e(t3.ns, s2), He(t3, i2);
      return function(e3) {
        let t3;
        for (let i3 in e3) t3 = e3[i3] = h(e3[i3]), void 0 === t3 && delete e3[i3];
        return h(e3);
      }(s2);
    }
    assignToOutput(e2, t2) {
      if (this.localOptions.parse) for (let [i2, s2] of Object.entries(t2)) switch (i2) {
        case "tiff":
          this.assignObjectToOutput(e2, "ifd0", s2);
          break;
        case "exif":
          this.assignObjectToOutput(e2, "exif", s2);
          break;
        case "xmlns":
          break;
        default:
          this.assignObjectToOutput(e2, i2, s2);
      }
      else e2.xmp = t2;
    }
  };
  e(Re, "type", "xmp"), e(Re, "multiSegment", true), k.set("xmp", Re);
  var je = class _je {
    static findAll(e2) {
      return Ke(e2, /([a-zA-Z0-9-]+):([a-zA-Z0-9-]+)=("[^"]*"|'[^']*')/gm).map(_je.unpackMatch);
    }
    static unpackMatch(e2) {
      let t2 = e2[1], i2 = e2[2], s2 = e2[3].slice(1, -1);
      return s2 = Xe(s2), new _je(t2, i2, s2);
    }
    constructor(e2, t2, i2) {
      this.ns = e2, this.name = t2, this.value = i2;
    }
    serialize() {
      return this.value;
    }
  };
  var Ge = class _Ge {
    static findAll(e2, t2, i2) {
      if (void 0 !== t2 || void 0 !== i2) {
        t2 = t2 || "[\\w\\d-]+", i2 = i2 || "[\\w\\d-]+";
        var s2 = new RegExp(`<(${t2}):(${i2})(#\\d+)?((\\s+?[\\w\\d-:]+=("[^"]*"|'[^']*'))*\\s*)(\\/>|>([\\s\\S]*?)<\\/\\1:\\2\\3>)`, "gm");
      } else s2 = /<([\w\d-]+):([\w\d-]+)(#\d+)?((\s+?[\w\d-:]+=("[^"]*"|'[^']*'))*\s*)(\/>|>([\s\S]*?)<\/\1:\2\3>)/gm;
      return Ke(e2, s2).map(_Ge.unpackMatch);
    }
    static unpackMatch(e2) {
      let t2 = e2[1], i2 = e2[2], s2 = e2[4], n2 = e2[8];
      return new _Ge(t2, i2, s2, n2);
    }
    constructor(e2, t2, i2, s2) {
      this.ns = e2, this.name = t2, this.attrString = i2, this.innerXml = s2, this.attrs = je.findAll(i2), this.children = _Ge.findAll(s2), this.value = 0 === this.children.length ? Xe(s2) : void 0, this.properties = [...this.attrs, ...this.children];
    }
    get isPrimitive() {
      return void 0 !== this.value && 0 === this.attrs.length && 0 === this.children.length;
    }
    get isListContainer() {
      return 1 === this.children.length && this.children[0].isList;
    }
    get isList() {
      let { ns: e2, name: t2 } = this;
      return "rdf" === e2 && ("Seq" === t2 || "Bag" === t2 || "Alt" === t2);
    }
    get isListItem() {
      return "rdf" === this.ns && "li" === this.name;
    }
    serialize() {
      if (0 === this.properties.length && void 0 === this.value) return;
      if (this.isPrimitive) return this.value;
      if (this.isListContainer) return this.children[0].serialize();
      if (this.isList) return We(this.children.map(_e));
      if (this.isListItem && 1 === this.children.length && 0 === this.attrs.length) return this.children[0].serialize();
      let e2 = {};
      for (let t2 of this.properties) He(t2, e2);
      return void 0 !== this.value && (e2.value = this.value), h(e2);
    }
  };
  function He(e2, t2) {
    let i2 = e2.serialize();
    void 0 !== i2 && (t2[e2.name] = i2);
  }
  var _e = (e2) => e2.serialize();
  var We = (e2) => 1 === e2.length ? e2[0] : e2;
  var $e = (e2, t2) => t2[e2] ? t2[e2] : t2[e2] = {};
  function Ke(e2, t2) {
    let i2, s2 = [];
    if (!e2) return s2;
    for (; null !== (i2 = t2.exec(e2)); ) s2.push(i2);
    return s2;
  }
  function Xe(e2) {
    if (function(e3) {
      return null == e3 || "null" === e3 || "undefined" === e3 || "" === e3 || "" === e3.trim();
    }(e2)) return;
    let t2 = Number(e2);
    if (!Number.isNaN(t2)) return t2;
    let i2 = e2.toLowerCase();
    return "true" === i2 || "false" !== i2 && e2.trim();
  }
  var Ye = ["rdf:li", "rdf:Seq", "rdf:Bag", "rdf:Alt", "rdf:Description"];
  var qe = new RegExp(`(<|\\/)(${Ye.join("|")})`, "g");
  var exifr_lite_default = Ae;

  // js/recommend/picoryAnalysis.mjs
  function meanStd(arr) {
    if (!arr.length) return { mean: 0, std: 0 };
    const mean = arr.reduce((s2, v3) => s2 + v3, 0) / arr.length;
    const v2 = arr.reduce((s2, x2) => s2 + (x2 - mean) * (x2 - mean), 0) / Math.max(1, arr.length - 1);
    return { mean, std: Math.sqrt(Math.max(0, v2)) };
  }
  function computeColorScience(imageData) {
    const { data, width, height } = imageData;
    const rs = [];
    const gs = [];
    const bs = [];
    const sats = [];
    let n2 = 0;
    const step = width * height > 8e5 ? 3 : 2;
    for (let y2 = 0; y2 < height; y2 += step) {
      for (let x2 = 0; x2 < width; x2 += step) {
        const i2 = (Math.floor(y2) * width + Math.floor(x2)) * 4;
        const r2 = data[i2];
        const g2 = data[i2 + 1];
        const b2 = data[i2 + 2];
        const a2 = data[i2 + 3];
        if (a2 < 12) continue;
        rs.push(r2);
        gs.push(g2);
        bs.push(b2);
        n2 += 1;
        const r1 = r2 / 255;
        const g1 = g2 / 255;
        const b1 = b2 / 255;
        const mx = Math.max(r1, g1, b1);
        const mn = Math.min(r1, g1, b1);
        const sat = mx <= 1e-3 ? 0 : (mx - mn) / mx * 100;
        sats.push(sat);
      }
    }
    if (n2 === 0) {
      return {
        mean: { r: 0, g: 0, b: 0 },
        sigma: { r: 0, g: 0, b: 0 },
        warmth: 0,
        saturationRange: 0,
        greenShift: 0,
        moodLabel: "\uCE21\uC815 \uBD88\uAC00",
        scienceNote: "\uC54C\uD30C\uAC00 \uB0AE\uAC70\uB098 \uC774\uBBF8\uC9C0\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4."
      };
    }
    const mR = meanStd(rs);
    const mG = meanStd(gs);
    const mB = meanStd(bs);
    const meanR = mR.mean;
    const meanG = mG.mean;
    const meanB = mB.mean;
    const sigmaR = mR.std;
    const sigmaG = mG.std;
    const sigmaB = mB.std;
    const warmth = (meanR - meanB) / 255 * 100;
    const greenShift = (meanG - (meanR + meanB) / 2) / 255 * 100;
    const satSorted = [...sats].sort((a2, b2) => a2 - b2);
    const satRange = satSorted.length > 1 ? satSorted[satSorted.length - 1] - satSorted[0] : 0;
    const satStdev = meanStd(sats).std;
    let moodLabel = "\uC911\uC131 \uD1A4";
    let scienceNote = "\uC804\uBC18\uC801\uC73C\uB85C \uADE0\uD615 \uC7A1\uD78C RGB \uBD84\uD3EC\uC785\uB2C8\uB2E4. \uB2E4\uC591\uD55C \uBC14\uB514\uC5D0\uC11C \uBB34\uB09C\uD788 \uC7AC\uD604 \uAC00\uB2A5\uD55C \uC2A4\uB0C5 \uD1A4\uC5D0 \uAC00\uAE5D\uC2B5\uB2C8\uB2E4.";
    if (warmth < -18 && meanB > meanR + 15) {
      moodLabel = "\uCFE8\uD1A4 \u2014 \uBE14\uB8E8\xB7\uC2DC\uC548 \uC6B0\uC138";
      scienceNote = "\uCC28\uAC00\uC6B4 \uD558\uC774\uB77C\uC774\uD2B8\uC640 \uCCAD\uC0C9 \uACC4\uC5F4\uC774 \uB450\uB4DC\uB7EC\uC9D1\uB2C8\uB2E4. \uC18C\uB2C8 \uC0AC\uC774\uBC84\uC0F7 CCD\xB7\uC5BC\uB9AC \uCEF4\uD329\uD2B8\uC758 JPEG/RAW \uB258\uC559\uC2A4\uC640 \uC720\uC0AC\uD55C \u201C\uB514\uC9C0\uD138 \uCFE8\u201D \uCABD\uC5D0 \uAC00\uAE5D\uC2B5\uB2C8\uB2E4.";
    } else if (warmth > 18 && meanR > meanB + 15) {
      moodLabel = "\uC6DC\uD1A4 \u2014 \uACE8\uB4E0\xB7\uC624\uB80C\uC9C0 \uC6B0\uC138";
      scienceNote = "\uC801\uC0C9\xB7\uD669\uC0C9 \uCC44\uB110\uC774 \uAC15\uD569\uB2C8\uB2E4. \uACE8\uB4E0\uC544\uC6CC\xB7\uC2E4\uB0B4 \uD145\uC2A4\uD150 \uB290\uB08C\uC5D0 \uAC00\uAE5D\uACE0, \uD544\uB984 \uC2DC\uBBAC\uB808\uC774\uC158\uC774 \uAC15\uD55C \uAE30\uC885\uACFC \uC798 \uB9DE\uC2B5\uB2C8\uB2E4.";
    } else if (satStdev > 22 && satRange > 55) {
      moodLabel = "\uCC44\uB3C4 \uBCC0\uD654 \uD07C";
      scienceNote = "\uD53D\uC140\uB9C8\uB2E4 \uCC44\uB3C4 \uD3B8\uCC28\uAC00 \uCEE4\uC11C \uD53C\uC0AC\uCCB4\xB7\uBC30\uACBD\uC758 \uBD84\uB9AC\uAC10\uC774 \uD07D\uB2C8\uB2E4. \uB300\uBE44 \uAC15\uD55C \uB80C\uC988\xB7\uCD5C\uC2E0 \uC13C\uC11C \uC870\uD569\uACFC \uAD81\uD569\uC774 \uC88B\uC740 \uD3B8\uC785\uB2C8\uB2E4.";
    } else if (satStdev < 10 && satRange < 35) {
      moodLabel = "\uC800\uCC44\uB3C4\xB7\uD30C\uC2A4\uD154";
      scienceNote = "\uC804\uCCB4\uC801\uC73C\uB85C \uCC44\uB3C4\uAC00 \uB20C\uB9B0 \uD3B8\uC785\uB2C8\uB2E4. \uD50C\uB7AB\uD55C \uB85C\uADF8 \uB8E9\uC774\uB098 \uD751\uBC31\uC5D0 \uAC00\uAE4C\uC6B4 \uCEEC\uB7EC\uC5D0 \uAC00\uAE5D\uC2B5\uB2C8\uB2E4.";
    }
    if (greenShift > 8) {
      scienceNote += " \uB179\uC0C9 \uCC44\uB110\uC774 \uB2E4\uC18C \uB192\uC544 \uD480\xB7\uC794\uB514\xB7\uD615\uAD11 \uBCF4\uC815 \uB178\uC774\uC988\uAC00 \uC11E\uC778 \uC57C\uC678 \uC2A4\uB0C5 \uD1A4\uC77C \uC218 \uC788\uC2B5\uB2C8\uB2E4.";
    } else if (greenShift < -8) {
      scienceNote += " \uB9C8\uC820\uD0C0/\uC801\uC0C9 \uCABD\uC73C\uB85C \uC57D\uD55C \uC2DC\uD504\uD2B8\uAC00 \uBCF4\uC77C \uC218 \uC788\uC2B5\uB2C8\uB2E4.";
    }
    return {
      mean: { r: meanR, g: meanG, b: meanB },
      sigma: { r: sigmaR, g: sigmaG, b: sigmaB },
      warmth: Number(warmth.toFixed(1)),
      saturationRange: Number(satRange.toFixed(1)),
      saturationStdev: Number(satStdev.toFixed(1)),
      greenShift: Number(greenShift.toFixed(1)),
      moodLabel,
      scienceNote
    };
  }
  async function analyzePixelsFromDataUrl(dataUrl) {
    const img = new Image();
    img.decoding = "async";
    await new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("IMAGE_DECODE"));
      img.src = dataUrl;
    });
    const maxSide = 640;
    let w2 = img.naturalWidth || img.width;
    let h2 = img.naturalHeight || img.height;
    const scale = Math.min(1, maxSide / Math.max(w2, h2));
    const cw = Math.max(1, Math.round(w2 * scale));
    const ch = Math.max(1, Math.round(h2 * scale));
    const canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("NO_2D");
    ctx.drawImage(img, 0, 0, cw, ch);
    const imageData = ctx.getImageData(0, 0, cw, ch);
    return computeColorScience(imageData);
  }
  async function parseExifPart(file) {
    try {
      const tags = await exifr_lite_default.parse(file, {
        pick: [
          "Make",
          "Model",
          "LensModel",
          "FocalLength",
          "FNumber",
          "ISO",
          "ExposureTime",
          "DateTimeOriginal",
          "Orientation"
        ]
      });
      if (!tags || typeof tags !== "object") {
        return { present: false, message: "EXIF \uBE14\uB85D\uC744 \uCC3E\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4." };
      }
      const model = tags.Model || tags.model;
      const make = tags.Make || tags.make;
      if (!make && !model && !tags.LensModel) {
        return {
          present: false,
          message: "\uCD2C\uC601 \uAE30\uC885 \uC815\uBCF4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uCEEC\uB7EC \uACFC\uD559 \uBD84\uC11D\uC73C\uB85C \uCEF4\uD329\uD2B8\xB7\uBBF8\uB7EC\uB9AC\uC2A4 \uCD94\uCC9C\uC73C\uB85C \uC774\uC5B4\uC9D1\uB2C8\uB2E4."
        };
      }
      return {
        present: true,
        make: make ? String(make).trim() : "",
        model: model ? String(model).trim() : "",
        lensModel: tags.LensModel ? String(tags.LensModel).trim() : "",
        focalLength: tags.FocalLength != null ? Number(tags.FocalLength) : null,
        fNumber: tags.FNumber != null ? Number(tags.FNumber) : null,
        iso: tags.ISO != null ? Number(tags.ISO) : null,
        exposureTime: tags.ExposureTime != null ? Number(tags.ExposureTime) : null,
        dateTimeOriginal: tags.DateTimeOriginal ? String(tags.DateTimeOriginal) : "",
        message: ""
      };
    } catch (_2) {
      return {
        present: false,
        message: "EXIF\uB97C \uC77D\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uCEEC\uB7EC \uBD84\uC11D \uAE30\uBC18\uC73C\uB85C \uC9C4\uD589\uD569\uB2C8\uB2E4."
      };
    }
  }
  async function analyzeUpload(file, dataUrl) {
    const [exif, color] = await Promise.all([parseExifPart(file), analyzePixelsFromDataUrl(dataUrl)]);
    const exifWithMessage = exif.present === false ? {
      ...exif,
      badgeLabel: "\uC5C6\uC74C \u2192 AI\xB7\uCEEC\uB7EC \uBD84\uC11D",
      detailHtml: '<p class="meta-panel__muted">\uC774 \uC774\uBBF8\uC9C0\uC5D0\uB294 \uCD2C\uC601 \uAE30\uC885 EXIF\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uCEEC\uB7EC \uACFC\uD559 \uBD84\uC11D\uC73C\uB85C \uC720\uC0AC \uC0C9\uAC10\uC758 \uCE74\uBA54\uB77C\uB97C \uCD94\uCC9C\uD569\uB2C8\uB2E4.</p>'
    } : {
      ...exif,
      badgeLabel: "EXIF \uD655\uBCF4",
      detailHtml: buildExifDetailHtml(exif)
    };
    return {
      exif: exifWithMessage,
      color,
      version: 1
    };
  }
  function buildExifDetailHtml(ex) {
    const rows = [];
    if (ex.make) rows.push(["\uC81C\uC870\uC0AC", ex.make]);
    if (ex.model) rows.push(["\uBAA8\uB378", ex.model]);
    if (ex.lensModel) rows.push(["\uB80C\uC988", ex.lensModel]);
    if (ex.focalLength != null && !Number.isNaN(ex.focalLength)) rows.push(["\uCD08\uC810\uAC70\uB9AC", `${ex.focalLength}mm`]);
    if (ex.fNumber != null && !Number.isNaN(ex.fNumber)) rows.push(["\uC870\uB9AC\uAC1C", `F${ex.fNumber}`]);
    if (ex.iso != null && !Number.isNaN(ex.iso)) rows.push(["ISO", String(Math.round(ex.iso))]);
    if (ex.exposureTime != null && !Number.isNaN(ex.exposureTime)) {
      const t2 = ex.exposureTime >= 1 ? `${ex.exposureTime.toFixed(1)}s` : `1/${Math.round(1 / ex.exposureTime)}s`;
      rows.push(["\uC154\uD130", t2]);
    }
    if (!rows.length) {
      return '<p class="meta-panel__muted">EXIF\uB294 \uC788\uC73C\uB098 \uC8FC\uC694 \uD0DC\uADF8\uAC00 \uBE44\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.</p>';
    }
    return `<dl class="meta-panel__dl">${rows.map(
      ([k2, v2]) => `<div class="meta-panel__row"><dt>${escapeHtml(k2)}</dt><dd>${escapeHtml(v2)}</dd></div>`
    ).join("")}</dl>`;
  }
  function escapeHtml(s2) {
    return String(s2).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function sleep(ms) {
    return new Promise((r2) => setTimeout(r2, ms));
  }
  function buildMatchWhy(dW, dS, dG, warmth, cp) {
    const reasons = [];
    if (dW < 12) reasons.push("\uC0C9\uC628\uB3C4 \uB290\uB08C \uC720\uC0AC");
    if (dS < 15) reasons.push("\uCC44\uB3C4 \uBD84\uD3EC \uADFC\uC811");
    if (dG < 8) reasons.push("\uADF8\uB9B0 \uC2DC\uD504\uD2B8 \uC720\uC0AC");
    if (warmth > 12 && cp.warmth > 10) reasons.push("\uC6DC\uD1A4 \uACC4\uC5F4");
    if (warmth < -8 && cp.warmth < 0) reasons.push("\uCFE8\uD1A4 \uACC4\uC5F4");
    if (reasons.length === 0) reasons.push("\uC804\uBC18\uC801 \uC0C9\uAC10 \uD504\uB85C\uD544 \uC720\uC0AC");
    return `${reasons.slice(0, 2).join(" \xB7 ")} (\uB85C\uCEEC \uAC70\uB9AC \uC810\uC218 \uAE30\uBC18)`;
  }
  function rankByColorProfile(measured, catalog) {
    const w2 = measured.warmth;
    const s2 = measured.saturationRange;
    const g2 = measured.greenShift;
    const rows = [];
    for (const p2 of catalog) {
      const cp = p2.colorProfile;
      if (!cp || typeof cp.warmth !== "number") continue;
      const dW = Math.abs(w2 - cp.warmth);
      const dS = Math.abs(s2 - (cp.saturationRange ?? cp.saturation ?? 0));
      const dG = Math.abs(g2 - cp.greenShift);
      const dist = dW * 1.5 + dS * 0.4 + dG * 1;
      const score = Math.max(5, Math.min(98, 95 - dist * 0.8));
      const why = buildMatchWhy(dW, dS, dG, w2, cp);
      const lr = p2.localRecommend || {};
      const lens = typeof lr.lens === "string" ? lr.lens : "\uB80C\uC988\uB294 \uCD2C\uC601 \uC2A4\uD0C0\uC77C\uC5D0 \uB9DE\uCDB0 \uC120\uD0DD";
      const specs = lr.specs && typeof lr.specs === "object" ? lr.specs : {};
      rows.push({
        rank: 0,
        score,
        product: p2,
        why,
        lens_suggestion: lens,
        specs: {
          sensor: String(specs.sensor || "\u2014"),
          megapixel: String(specs.megapixel || "\u2014"),
          aperture: String(specs.aperture || "\u2014")
        }
      });
    }
    rows.sort((a2, b2) => b2.score - a2.score);
    rows.forEach((r2, i2) => {
      r2.rank = i2 + 1;
    });
    return rows;
  }
  function toApiShape(color, ranked) {
    let top2 = ranked.slice(0, 2);
    if (top2.length === 1) {
      top2 = [
        top2[0],
        {
          ...top2[0],
          rank: 2,
          why: `${top2[0].why} (\uB300\uC548\uC73C\uB85C \uB3D9\uC77C \uC21C\uC704\uB97C \uD45C\uC2DC\uD588\uC5B4\uC694.)`
        }
      ];
    }
    const best = top2[0];
    const moodTags = [];
    if (color.moodLabel) {
      const short = String(color.moodLabel).split("\u2014")[0].trim().slice(0, 24);
      if (short) moodTags.push(short);
    }
    moodTags.push("\uC0C9\uAC10 \uB9E4\uCE6D", "\uB85C\uCEEC \uCD94\uCC9C");
    const summary = best ? `\uC774 \uC0AC\uC9C4\uC758 \uCEEC\uB7EC \uC9C0\uD45C(\uC6DC/\uCFE8\xB7\uCC44\uB3C4\xB7\uADF8\uB9B0 \uC2DC\uD504\uD2B8)\uC640 \uCE74\uD0C8\uB85C\uADF8\uC5D0 \uC801\uC5B4 \uB454 \uC0C9 \uD2B9\uC131\uC744 \uBE44\uAD50\uD588\uC5B4\uC694. \uAC00\uC7A5 \uAC00\uAE4C\uC6B4 \uC870\uD569\uC740 ${best.product.brand} ${best.product.model}(${best.score.toFixed(1)}\uC810 \uADFC\uC0AC)\uC785\uB2C8\uB2E4. \uBE0C\uB77C\uC6B0\uC800\uC5D0\uC11C\uB9CC \uACC4\uC0B0\uD588\uACE0 \uC678\uBD80 AI \uC11C\uBC84\uB294 \uC4F0\uC9C0 \uC54A\uC558\uC5B4\uC694.` : "\uCE74\uD0C8\uB85C\uADF8\uC5D0\uC11C \uC0C9 \uD504\uB85C\uD544\uC774 \uC788\uB294 \uAE30\uC885\uC744 \uCC3E\uC9C0 \uBABB\uD588\uC5B4\uC694.";
    const items = top2.map((r2, idx) => ({
      rank: idx + 1,
      product: r2.product,
      why: r2.why,
      lens_suggestion: r2.lens_suggestion,
      specs: r2.specs
    }));
    return {
      source: "local-color-match",
      model: "catalog-distance",
      summary,
      mood_tags: moodTags.slice(0, 6),
      items
    };
  }
  async function loadCatalog() {
    const res = await fetch("/server/catalog.json", { cache: "no-store" });
    if (!res.ok) throw new Error("CATALOG_FETCH");
    return res.json();
  }

  // js/recommend/entry-bundle.js
  window.picoryGetRecommendThumbnail = getThumbnailForRecommendModel;
  window.picoryRecommend = picoryAnalysis_exports;
})();
