/**
 * 이미지 기반 추천 — GEMINI_API_KEY 우선, 없으면 OpenAI
 */
const { recommendFromImageGemini } = require('./recommendImageGemini');
const { recommendFromImage: recommendFromImageOpenAI } = require('./recommendImageOpenAI');
const { recommendFromImageFallback } = require('./recommendImageFallback');

/**
 * Gemini Vision은 한도·모델명·SDK 형태 등으로 자주 실패함 → 빨간 긴 오류 대신 카탈로그 추천
 * (키 없음·이미지 형식 오류만 그대로 전달)
 */
async function recommendFromImage(imageDataUrl, clientAnalysis) {
  const geminiKey = process.env.GEMINI_API_KEY && String(process.env.GEMINI_API_KEY).trim();
  if (geminiKey) {
    try {
      return await recommendFromImageGemini(imageDataUrl, clientAnalysis);
    } catch (e) {
      const code = e && e.code;
      if (code === 'GEMINI_API_KEY_MISSING' || code === 'INVALID_IMAGE') {
        throw e;
      }
      return recommendFromImageFallback(clientAnalysis);
    }
  }
  const openaiKey = process.env.OPENAI_API_KEY && String(process.env.OPENAI_API_KEY).trim();
  if (!openaiKey) {
    const err = new Error('RECOMMEND_IMAGE_KEYS_MISSING');
    err.code = 'RECOMMEND_IMAGE_KEYS_MISSING';
    throw err;
  }
  return recommendFromImageOpenAI(imageDataUrl, clientAnalysis);
}

module.exports = { recommendFromImage };
