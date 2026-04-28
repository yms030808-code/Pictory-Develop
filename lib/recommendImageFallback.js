/**
 * Gemini/OpenAI 모두 한도·오류일 때 — 이미지 없이 카탈로그 인기 기준 추천
 */
const { loadCatalog } = require('./checklistOpenAI');

function recommendFromImageFallback(clientAnalysis) {
  const catalog = loadCatalog();
  const sorted = [...catalog].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  const p1 = sorted[0];
  const p2 = sorted[1] || sorted[0];

  const hasClient =
    clientAnalysis &&
    typeof clientAnalysis === 'object' &&
    (clientAnalysis.color || clientAnalysis.exif);
  const extra =
    hasClient && clientAnalysis.color?.moodLabel
      ? ` 브라우저에서 계산한 컬러 특성(${clientAnalysis.color.moodLabel})은 참고용으로 반영해 보았어요.`
      : '';

  return {
    source: 'fallback',
    model: 'catalog-popularity',
    summary:
      'Google Gemini 무료 API 한도에 걸려 서버의 비전 분석은 건너뛰었어요. 대신 카탈로그 인기 순으로 추천했습니다.' +
      extra +
      ' 나중에 한도가 풀리면 다시 시도해 보세요.',
    mood_tags: hasClient
      ? ['API 한도', '로컬 컬러 참고', '인기 모델']
      : ['API 한도', '인기 모델', '임시 추천'],
    items: [
      {
        rank: 1,
        product: p1,
        why:
          '무료 티어 한도로 AI 비전 분석을 쓰지 못할 때의 보완 추천입니다. ' +
          (p1.description || '').slice(0, 100),
        lens_suggestion: '렌즈는 촬영 목적에 맞춰 선택해 주세요',
        specs: { sensor: '—', megapixel: '—', aperture: '—' },
      },
      {
        rank: 2,
        product: p2,
        why: '보완 추천입니다. ' + (p2.description || '').slice(0, 100),
        lens_suggestion: '렌즈는 촬영 목적에 맞춰 선택해 주세요',
        specs: { sensor: '—', megapixel: '—', aperture: '—' },
      },
    ],
  };
}

module.exports = { recommendFromImageFallback };
