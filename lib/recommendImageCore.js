/**
 * 이미지 기반 카메라 추천 — OpenAI/Gemini 공통 프롬프트·후처리
 */
const { loadCatalog } = require('./checklistOpenAI');

const SYSTEM_PROMPT = `You are a camera shopping assistant for Pictory (Korea).

Analyze the uploaded photo for:
- color tone (warm/cool, saturation, contrast)
- lighting (natural, studio, golden hour, low light, flash)
- depth of field / bokeh (shallow vs deep)
- subject and framing (portrait, street, travel, landscape, product, vlog-style, etc.)
- grain or "filmic" look if visible

Important: Do NOT claim you identified the exact camera brand/model that took the photo (EXIF may be missing). Instead infer which **camera systems from the provided catalog** could produce similar-looking results and recommend them.

If the message includes a "Client-side measurements" block, treat it as **hints from local EXIF parsing and RGB statistics** (not laboratory colorimetry). Blend these hints with your visual analysis of the image. Do not contradict obvious EXIF facts when present.

Rules:
- Choose EXACTLY 2 distinct product ids from the catalog ONLY. Never invent ids.
- Order by best match (rank 1 = best).
- For each item:
  - lens_suggestion: one realistic lens or kit suggestion in Korean (examples: "FE 35mm F1.8", "XF 35mm F1.4", "키트 15-45mm").
  - why: 2~3 sentences in Korean linking the photo mood to this body.
  - specs: short Korean labels for display — sensor (e.g. 풀프레임, APS-C, 1인치), megapixel (approximate or typical for the line), aperture (typical for the suggested look, e.g. F1.8~F2.8).

mood_tags: 3~6 short Korean tags (about 2~4 words each).

Respond with valid JSON only, this exact shape:
{"summary":"한 줄 요약(한국어)","mood_tags":["태그1","태그2"],"recommendations":[{"id":"catalog-id","rank":1,"lens_suggestion":"...","why":"...","specs":{"sensor":"...","megapixel":"...","aperture":"..."}},{"id":"catalog-id","rank":2,"lens_suggestion":"...","why":"...","specs":{"sensor":"...","megapixel":"...","aperture":"..."}}]}

The recommendations array must have length 2.`;

/**
 * 프롬프트용으로 클라이언트 분석에서 짧은 필드만 추림 (HTML 등 제외)
 * @param {object|null|undefined} raw
 */
function sanitizeClientAnalysisForPrompt(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const out = { version: raw.version };
  if (raw.exif && typeof raw.exif === 'object') {
    const e = raw.exif;
    out.exif = {
      present: e.present === true,
      badgeLabel: typeof e.badgeLabel === 'string' ? e.badgeLabel.slice(0, 120) : '',
      make: typeof e.make === 'string' ? e.make.slice(0, 120) : '',
      model: typeof e.model === 'string' ? e.model.slice(0, 160) : '',
      lensModel: typeof e.lensModel === 'string' ? e.lensModel.slice(0, 160) : '',
      focalLength: typeof e.focalLength === 'number' ? e.focalLength : null,
      fNumber: typeof e.fNumber === 'number' ? e.fNumber : null,
      iso: typeof e.iso === 'number' ? e.iso : null,
      exposureTime: typeof e.exposureTime === 'number' ? e.exposureTime : null,
      message: typeof e.message === 'string' ? e.message.slice(0, 400) : '',
    };
  }
  if (raw.color && typeof raw.color === 'object') {
    const c = raw.color;
    out.color = {
      mean: c.mean,
      sigma: c.sigma,
      warmth: c.warmth,
      saturationRange: c.saturationRange,
      saturationStdev: c.saturationStdev,
      greenShift: c.greenShift,
      moodLabel: typeof c.moodLabel === 'string' ? c.moodLabel.slice(0, 200) : '',
      scienceNote: typeof c.scienceNote === 'string' ? c.scienceNote.slice(0, 600) : '',
    };
  }
  return out;
}

/**
 * 브라우저에서 계산한 메타·컬러 요약을 프롬프트에 안전한 길이로 붙임
 * @param {object|null|undefined} clientAnalysis
 */
function formatClientAnalysisBlock(clientAnalysis) {
  const slim = sanitizeClientAnalysisForPrompt(clientAnalysis);
  if (!slim) return '';
  let s;
  try {
    s = JSON.stringify(slim);
  } catch (_) {
    return '';
  }
  if (s.length > 12000) s = `${s.slice(0, 12000)}…`;
  return `\n\nClient-side measurements (JSON, from browser — use together with the image):\n${s}\n`;
}

function catalogLitePayload() {
  const catalog = loadCatalog();
  return {
    catalog,
    catalogLite: catalog.map((p) => ({
      id: p.id,
      brand: p.brand,
      model: p.model,
      priceKrw: p.priceKrw,
      priceSummary: p.priceSummary,
      categories: p.categories,
      description: p.description,
    })),
  };
}

/**
 * data:image/...;base64,... → { mimeType, base64 }
 */
function parseDataUrl(imageDataUrl) {
  if (!imageDataUrl || typeof imageDataUrl !== 'string' || !imageDataUrl.startsWith('data:image/')) {
    return null;
  }
  const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/s.exec(imageDataUrl.trim());
  if (!m) return null;
  return { mimeType: m[1], base64: m[2] };
}

/**
 * 모델이 반환한 JSON 객체 → 카탈로그 검증·보완 후 API 응답 형태
 */
function finalizeRecommendations(parsed, catalog, source, model) {
  const summary = typeof parsed.summary === 'string' ? parsed.summary.trim() : '';
  const moodTags = Array.isArray(parsed.mood_tags)
    ? parsed.mood_tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 8)
    : [];
  const recs = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];

  const byId = Object.fromEntries(catalog.map((p) => [p.id, p]));
  const usedIds = new Set();
  const items = [];

  for (const r of recs) {
    const id = r && r.id;
    if (!id || !byId[id] || usedIds.has(id)) continue;
    usedIds.add(id);
    const why = String(r.why || '').trim() || byId[id].description.slice(0, 160);
    const lensSuggestion = String(r.lens_suggestion || '').trim() || '렌즈는 촬영 스타일에 맞춰 선택';
    const specs = r.specs && typeof r.specs === 'object' ? r.specs : {};
    items.push({
      rank: Number(r.rank) || items.length + 1,
      product: byId[id],
      why,
      lens_suggestion: lensSuggestion,
      specs: {
        sensor: String(specs.sensor || '').trim() || '—',
        megapixel: String(specs.megapixel || '').trim() || '—',
        aperture: String(specs.aperture || '').trim() || '—',
      },
    });
    if (items.length >= 2) break;
  }

  const popularitySorted = [...catalog].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  for (const p of popularitySorted) {
    if (items.length >= 2) break;
    if (usedIds.has(p.id)) continue;
    usedIds.add(p.id);
    items.push({
      rank: items.length + 1,
      product: p,
      why:
        '이미지 분석 결과를 바탕으로 보완 추천으로 포함했어요. ' +
        (p.description || '').slice(0, 100),
      lens_suggestion: '렌즈는 촬영 스타일에 맞춰 선택',
      specs: {
        sensor: '—',
        megapixel: '—',
        aperture: '—',
      },
    });
  }

  const finalMoodTags =
    moodTags.length > 0 ? moodTags : ['Pictory 추천', '카탈로그 매칭', '스타일 유사'];

  return {
    source,
    model,
    summary:
      summary ||
      '사진의 색감과 분위기를 바탕으로 카탈로그에서 어울리는 카메라를 골랐어요.',
    mood_tags: finalMoodTags,
    items: items.slice(0, 2),
  };
}

module.exports = {
  SYSTEM_PROMPT,
  catalogLitePayload,
  parseDataUrl,
  finalizeRecommendations,
  formatClientAnalysisBlock,
  sanitizeClientAnalysisForPrompt,
};
