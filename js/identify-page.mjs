/**
 * 카메라 사진 업로드 → 카탈로그 기준 유사 기종 매칭 (/api/recommend-image 재사용)
 */
import { analyzeUpload } from './recommend/picoryAnalysis.mjs';

function apiBase() {
  const m = document.querySelector('meta[name="picory-api-base"]');
  return (m && m.content) || '';
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ''));
    r.onerror = () => reject(new Error('파일을 읽지 못했습니다.'));
    r.readAsDataURL(file);
  });
}

function setVisible(id, on) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('hidden', !on);
}

document.addEventListener('DOMContentLoaded', () => {
  const zone = document.getElementById('identifyUploadZone');
  const input = document.getElementById('identifyFileInput');
  const idle = document.getElementById('identifyUploadIdle');
  const loading = document.getElementById('identifyUploadLoading');
  const result = document.getElementById('identifyResult');
  const errEl = document.getElementById('identifyError');
  const intro = document.getElementById('identifyIntro');

  if (!zone || !input || !result) return;

  const MAX_BYTES = 10 * 1024 * 1024;

  async function run(file) {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > MAX_BYTES) {
      errEl.textContent = '10MB 이하 이미지를 올려 주세요.';
      setVisible('identifyError', true);
      return;
    }
    errEl.textContent = '';
    setVisible('identifyError', false);
    setVisible('identifyIntro', false);
    idle?.classList.add('hidden');
    loading?.classList.remove('hidden');
    result.innerHTML = '';
    result.classList.add('hidden');

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const clientAnalysis = await analyzeUpload(file, dataUrl);
      const res = await fetch(`${apiBase()}/api/recommend-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: dataUrl, clientAnalysis }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          data.message ||
          (data.error === 'RECOMMEND_IMAGE_KEYS_MISSING'
            ? '서버에 GEMINI_API_KEY 또는 OPENAI_API_KEY가 필요합니다. .env를 확인해 주세요.'
            : '분석에 실패했습니다.');
        throw new Error(msg);
      }
      const items = data.items || [];
      if (!items.length || !items[0].product) {
        throw new Error('카탈로그와 매칭된 기종을 찾지 못했습니다.');
      }
      const top = items[0].product;
      const name = `${top.brand} ${top.model}`.trim();
      const q = encodeURIComponent(name);
      const why = String(items[0].why || '').trim();
      result.innerHTML = `
        <div class="identify-result-card card">
          <p class="identify-result__label">가장 가까운 카탈로그 기종</p>
          <h2 class="identify-result__name">${escapeHtml(name)}</h2>
          <p class="identify-result__why">${escapeHtml(why)}</p>
          <p class="identify-result__note text-sm text-muted">제품 사진 각도·조명에 따라 다른 모델로 오인될 수 있어요. 시세·스펙은 아래에서 확인해 주세요.</p>
          <div class="identify-result__actions">
            <a class="btn btn--primary" href="price.html?q=${q}">시세·상세 보기</a>
            <a class="btn btn--outline" href="products.html?q=${q}">카탈로그에서 보기</a>
          </div>
        </div>
      `;
      result.classList.remove('hidden');
    } catch (e) {
      errEl.textContent = String(e.message || e);
      setVisible('identifyError', true);
      setVisible('identifyIntro', true);
    } finally {
      loading?.classList.add('hidden');
      idle?.classList.remove('hidden');
    }
  }

  zone.addEventListener('click', () => input.click());
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    const f = e.dataTransfer.files[0];
    if (f) run(f);
  });
  input.addEventListener('change', () => {
    const f = input.files && input.files[0];
    if (f) run(f);
  });
});

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
