const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const catalog = JSON.stringify(
  JSON.parse(fs.readFileSync(path.join(root, 'server/catalog.json'), 'utf8'))
);
const bundlePath = path.join(root, 'js/recommend.bundle.js');
const bundle = fs.readFileSync(bundlePath, 'utf8');

const old = `  async function loadCatalog() {
    const res = await fetch("/server/catalog.json", { cache: "no-store" });
    if (!res.ok) throw new Error("CATALOG_FETCH");
    return res.json();
  }`;

const neu = `  const catalogEmbedded = ${catalog};
  function catalogFetchUrls() {
    if (typeof window === "undefined" || !window.location?.href) {
      return ["/server/catalog.json"];
    }
    const href = window.location.href;
    const origin = window.location.origin;
    const candidates = [
      new URL("server/catalog.json", href).href,
      new URL("../server/catalog.json", href).href,
      new URL("../../server/catalog.json", href).href
    ];
    if (origin && origin !== "null") {
      candidates.push(origin + "/server/catalog.json");
    }
    candidates.push("/server/catalog.json");
    return [...new Set(candidates)];
  }
  async function loadCatalog() {
    for (const url of catalogFetchUrls()) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) continue;
        const data = await res.json();
        if (Array.isArray(data) && data.length) return data;
      } catch (_) {}
    }
    if (Array.isArray(catalogEmbedded) && catalogEmbedded.length) {
      return catalogEmbedded;
    }
    throw new Error("CATALOG_FETCH");
  }`;

if (!bundle.includes(old)) {
  console.error('loadCatalog block not found — bundle may already be patched or rebuild needed');
  process.exit(1);
}

fs.writeFileSync(bundlePath, bundle.replace(old, neu));
console.log('OK: patched js/recommend.bundle.js');
