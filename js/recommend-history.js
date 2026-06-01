/**
 * AI photo recommendation history — localStorage for mypage "내 추천".
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'picoryRecommendHistory';
  const MAX_ENTRIES = 24;
  const THUMB_MAX_W = 160;

  function readList() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (_) {
      return [];
    }
  }

  function writeList(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(-MAX_ENTRIES)));
  }

  function tryWriteList(list) {
    try {
      writeList(list);
      return true;
    } catch (err) {
      console.warn('[PicoryRecommendHistory] save failed', err);
      return false;
    }
  }

  function compressThumb(dataUrl) {
    return new Promise((resolve) => {
      if (!dataUrl || typeof dataUrl !== 'string') {
        resolve('');
        return;
      }
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, THUMB_MAX_W / (img.naturalWidth || THUMB_MAX_W));
        const w = Math.max(1, Math.round((img.naturalWidth || THUMB_MAX_W) * scale));
        const h = Math.max(1, Math.round((img.naturalHeight || THUMB_MAX_W) * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve('');
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        try {
          resolve(canvas.toDataURL('image/jpeg', 0.55));
        } catch (_) {
          resolve('');
        }
      };
      img.onerror = () => resolve('');
      img.src = dataUrl;
    });
  }

  function normalizeItem(raw) {
    if (!raw) return null;

    if (raw.product) {
      const p = raw.product;
      const name = `${p.brand || ''} ${p.model || ''}`.trim();
      if (!name) return null;
      const getThumb = window.picoryGetRecommendThumbnail;
      let thumbnail = p.thumbnail || '';
      if (typeof getThumb === 'function') {
        try {
          thumbnail = getThumb(name) || thumbnail;
        } catch (_) {
          /* noop */
        }
      }
      return {
        name,
        lens: String(raw.lens_suggestion || raw.lens || '').replace(/^\+\s*/, ''),
        price: String(p.priceSummary || raw.price || '').trim(),
        score: raw.score,
        why: String(raw.why || '').trim(),
        specs: raw.specs || {},
        href: raw.href || `price.html?q=${encodeURIComponent(name)}`,
        thumbnail: thumbnail || '/images/cameras/default-camera.png',
      };
    }

    const name = String(raw.name || '').trim();
    if (!name) return null;
    return {
      name,
      lens: String(raw.lens || '').replace(/^\+\s*/, ''),
      price: String(raw.price || '').trim(),
      score: raw.score,
      why: String(raw.why || '').trim(),
      specs: raw.specs || {},
      href: raw.href || `price.html?q=${encodeURIComponent(name)}`,
      thumbnail: raw.thumbnail || '/images/cameras/default-camera.png',
    };
  }

  function collectFromDom(root) {
    const scope = root || document;
    const cards = scope.querySelectorAll('.recommend-card');
    const items = [];
    cards.forEach((card) => {
      const name = card.querySelector('.recommend-card__name')?.textContent?.trim();
      if (!name) return;
      const matchText = card.querySelector('.recommend-card__match')?.textContent?.trim() || '';
      let score = null;
      const scoreMatch = matchText.match(/약\s*([\d.]+)\s*점/);
      if (scoreMatch) score = Number(scoreMatch[1]);
      items.push({
        name,
        lens: card.querySelector('.recommend-card__lens')?.textContent?.replace(/^\+\s*/, '').trim() || '',
        price: card.querySelector('.price-value')?.textContent?.trim() || '',
        why: matchText,
        score,
        href: card.querySelector('.recommend-card__actions a.btn--primary')?.getAttribute('href') || `price.html?q=${encodeURIComponent(name)}`,
        thumbnail: card.querySelector('.recommend-card__img img')?.getAttribute('src') || '/images/cameras/default-camera.png',
      });
    });

    const summary = scope.querySelector('#analysisSummary')?.textContent?.trim()
      || scope.querySelector('#sectionRecommendDesc')?.textContent?.trim()
      || '';
    const moodTags = [...scope.querySelectorAll('#analysisTags .tag')]
      .map((el) => el.textContent.trim())
      .filter(Boolean);

    return { items, summary, moodTags };
  }

  async function buildEntry(payload) {
    const apiItems = (payload?.items || []).map(normalizeItem).filter(Boolean);
    const domData = payload?.root ? collectFromDom(payload.root) : { items: [], summary: '', moodTags: [] };
    const domItems = domData.items.map(normalizeItem).filter(Boolean);
    const items = (apiItems.length ? apiItems : domItems).slice(0, 3);
    if (!items.length) return null;

    const imageDataUrl = payload?.imageDataUrl || '';
    let imageThumb = imageDataUrl ? await compressThumb(imageDataUrl) : '';
    const previewBg = payload?.root?.querySelector('#previewImg')?.style?.backgroundImage || '';
    if (!imageThumb && previewBg.startsWith('url(')) {
      const embedded = previewBg.slice(4, -1).replace(/^["']|["']$/g, '');
      if (embedded.startsWith('data:image/')) {
        imageThumb = await compressThumb(embedded);
      }
    }

    return {
      id: `ai-${Date.now()}`,
      type: 'ai-photo',
      createdAt: new Date().toISOString(),
      imageThumb,
      summary: String(payload?.summary || domData.summary || '').trim(),
      moodTags: Array.isArray(payload?.moodTags) && payload.moodTags.length
        ? payload.moodTags.slice(0, 6)
        : domData.moodTags.slice(0, 6),
      items,
    };
  }

  async function persistResult(payload) {
    const entry = await buildEntry(payload || {});
    if (!entry) return null;

    const list = readList();
    list.push(entry);

    if (tryWriteList(list)) {
      window.dispatchEvent(new CustomEvent('picory-recommend-history-updated'));
      return entry;
    }

    const withoutImage = { ...entry, imageThumb: '' };
    const retryList = readList();
    retryList.push(withoutImage);
    if (tryWriteList(retryList)) {
      window.dispatchEvent(new CustomEvent('picory-recommend-history-updated'));
      return withoutImage;
    }

    return null;
  }

  async function saveAiPhotoResult(payload) {
    return persistResult(payload);
  }

  window.PicoryRecommendHistory = {
    STORAGE_KEY,
    read: readList,
    saveAiPhotoResult,
    persistResult,
    collectFromDom,
  };
})();
