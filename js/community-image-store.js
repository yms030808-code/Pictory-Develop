/**
 * Community / archive image blobs in IndexedDB.
 * localStorage keeps post metadata only (imageKey), not full base64.
 */
(function initCommunityImageStore(global) {
  const DB_NAME = 'picoryCommunityImages';
  const DB_VERSION = 1;
  const STORE = 'images';

  /** @type {Map<string, string>} */
  const urlCache = new Map();
  let dbPromise = null;

  function openDb() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      if (!global.indexedDB) {
        reject(new Error('NO_INDEXEDDB'));
        return;
      }
      const req = global.indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'key' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('IDB_OPEN'));
    });
    return dbPromise;
  }

  async function dataUrlToBlob(dataUrl) {
    const res = await fetch(dataUrl);
    return res.blob();
  }

  async function isAvailable() {
    try {
      await openDb();
      return true;
    } catch (_) {
      return false;
    }
  }

  async function put(key, dataUrl) {
    if (!key || !dataUrl) return false;
    const blob = await dataUrlToBlob(dataUrl);
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put({ key, blob, updatedAt: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error('IDB_PUT'));
    });
    const cached = urlCache.get(key);
    if (cached) {
      URL.revokeObjectURL(cached);
      urlCache.delete(key);
    }
    return true;
  }

  async function getBlob(key) {
    if (!key) return null;
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(key);
      req.onsuccess = () => resolve(req.result?.blob || null);
      req.onerror = () => reject(req.error || new Error('IDB_GET'));
    });
  }

  async function getUrl(key) {
    if (!key) return '';
    if (urlCache.has(key)) return urlCache.get(key);
    const blob = await getBlob(key);
    if (!blob) return '';
    const url = URL.createObjectURL(blob);
    urlCache.set(key, url);
    return url;
  }

  async function remove(key) {
    if (!key) return;
    const cached = urlCache.get(key);
    if (cached) {
      URL.revokeObjectURL(cached);
      urlCache.delete(key);
    }
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error('IDB_DELETE'));
    });
  }

  async function resolvePostImageSrc(post) {
    if (!post || typeof post !== 'object') return '';
    const key = post.imageKey || post.id;
    if (key) {
      try {
        const url = await getUrl(String(key));
        if (url) return url;
      } catch (_) {
        /* fall through to legacy */
      }
    }
    return String(post.imageDataUrl || post.imageThumb || '');
  }

  async function migratePost(post) {
    if (!post || typeof post !== 'object') return post;
    const key = String(post.imageKey || post.id || '');
    const legacy = post.imageDataUrl;
    if (!key || !legacy || typeof legacy !== 'string') {
      if (key && !post.imageKey) return { ...post, imageKey: key };
      return post;
    }
    try {
      await put(key, legacy);
      const { imageDataUrl, ...rest } = post;
      return { ...rest, imageKey: key };
    } catch (_) {
      return post;
    }
  }

  async function migratePosts(posts) {
    if (!Array.isArray(posts) || !posts.length) return posts;
    const out = [];
    for (const post of posts) {
      out.push(await migratePost(post));
    }
    return out;
  }

  const DEFAULT_MAX_PX = 1024;
  const DEFAULT_QUALITY = 0.72;

  function scaleImageDimensions(width, height, maxPx) {
    const w0 = Math.max(1, width || maxPx);
    const h0 = Math.max(1, height || maxPx);
    const scale = Math.min(1, maxPx / Math.max(w0, h0));
    return {
      w: Math.max(1, Math.round(w0 * scale)),
      h: Math.max(1, Math.round(h0 * scale)),
    };
  }

  function loadImageElement(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('IMAGE_DECODE'));
      img.src = src;
    });
  }

  async function compressImageFromFile(file, options = {}) {
    const maxPx = options.maxPx ?? DEFAULT_MAX_PX;
    const quality = options.quality ?? DEFAULT_QUALITY;
    const blobUrl = URL.createObjectURL(file);
    try {
      const img = await loadImageElement(blobUrl);
      const { w, h } = scaleImageDimensions(img.naturalWidth, img.naturalHeight, maxPx);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('CANVAS');
      ctx.drawImage(img, 0, 0, w, h);
      return canvas.toDataURL('image/jpeg', quality);
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  }

  async function compressDataUrl(dataUrl, options = {}) {
    const maxPx = options.maxPx ?? DEFAULT_MAX_PX;
    const quality = options.quality ?? DEFAULT_QUALITY;
    const img = await loadImageElement(dataUrl);
    const { w, h } = scaleImageDimensions(img.naturalWidth, img.naturalHeight, maxPx);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('CANVAS');
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL('image/jpeg', quality);
  }

  async function prepareFromFile(file, options = {}) {
    const attempts = options.attempts || [
      { maxPx: DEFAULT_MAX_PX, quality: DEFAULT_QUALITY },
      { maxPx: 768, quality: 0.64 },
      { maxPx: 640, quality: 0.54 },
      { maxPx: 480, quality: 0.48 },
    ];
    let lastErr = null;
    for (const opts of attempts) {
      try {
        const dataUrl = await compressImageFromFile(file, opts);
        if (dataUrl) return dataUrl;
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr || new Error('COMPRESS_FAILED');
  }

  global.PicoryCommunityImageStore = {
    isAvailable,
    put,
    getUrl,
    getBlob,
    remove,
    resolvePostImageSrc,
    migratePost,
    migratePosts,
    compressImageFromFile,
    compressDataUrl,
    prepareFromFile,
  };
})(typeof window !== 'undefined' ? window : globalThis);
