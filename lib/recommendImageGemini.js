/**
 * 업로드 이미지 추천 — Google Gemini (이미지 멀티모달)
 */
const { GoogleGenerativeAI } = require('@google/generative-ai');
const {
  SYSTEM_PROMPT,
  catalogLitePayload,
  parseDataUrl,
  finalizeRecommendations,
  formatClientAnalysisBlock,
} = require('./recommendImageCore');
const { withLock, beforeGenerateContent } = require('./geminiRateLimiter');

/**
 * gemini-2.x 는 무료 티어에서 자주 막혀 .env에 있어도 무시합니다.
 */
/** 기본은 1.5 flash 계열만 */
const DEFAULT_MODEL_FALLBACKS = [
  'gemini-1.5-flash-8b',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash-002',
];

function fullErrorText(err) {
  const parts = [];
  let e = err;
  for (let i = 0; i < 10 && e; i++) {
    parts.push(String(e.message || ''));
    if (typeof e.status === 'number') parts.push(`status:${e.status}`);
    if (typeof e.statusCode === 'number') parts.push(`statusCode:${e.statusCode}`);
    e = e.cause;
  }
  try {
    parts.push(JSON.stringify(err).slice(0, 6000));
  } catch (_) {}
  return parts.join('\n');
}

function isQuotaOrRateLimitError(err) {
  const msg = fullErrorText(err);
  return (
    err?.status === 429 ||
    err?.statusCode === 429 ||
    msg.includes('429') ||
    msg.includes('Too Many Requests') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    /quota|Quota exceeded|exceeded your current quota|GenerateRequestsPerDay|free_tier/i.test(msg)
  );
}

/** 모델 이름 오류(404)일 때만 다음 모델 시도 */
function shouldTryNextModelFor404(err) {
  const msg = fullErrorText(err);
  return (
    err?.status === 404 ||
    msg.includes('404') ||
    msg.includes('not found') ||
    msg.includes('NOT_FOUND')
  );
}

/**
 * @param {string} imageDataUrl data:image/...;base64,...
 */
async function recommendFromImageGemini(imageDataUrl, clientAnalysis) {
  const apiKey = process.env.GEMINI_API_KEY && String(process.env.GEMINI_API_KEY).trim();
  if (!apiKey) {
    const err = new Error('GEMINI_API_KEY_MISSING');
    err.code = 'GEMINI_API_KEY_MISSING';
    throw err;
  }

  const parsedUrl = parseDataUrl(imageDataUrl);
  if (!parsedUrl) {
    const err = new Error('INVALID_IMAGE');
    err.code = 'INVALID_IMAGE';
    throw err;
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  return withLock(async () => {
    const { catalog, catalogLite } = catalogLitePayload();
    const analysisBlock = formatClientAnalysisBlock(clientAnalysis);
    const userCatalog = `Catalog (use only these ids):\n${JSON.stringify(catalogLite)}${analysisBlock}`;

    const envModel = process.env.GEMINI_VISION_MODEL || process.env.GEMINI_MODEL;
    const modelCandidates = [...DEFAULT_MODEL_FALLBACKS];
    if (envModel) {
      const em = envModel.trim();
      if (em && !/^gemini-2/i.test(em) && !modelCandidates.includes(em)) {
        modelCandidates.push(em);
      }
    }
    const seen = new Set();
    const uniqueModels = modelCandidates.filter((m) => {
      if (!m || seen.has(m)) return false;
      seen.add(m);
      return true;
    });

    let lastErr = null;

    for (const modelName of uniqueModels) {
      try {
        await beforeGenerateContent();

        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json',
          },
          systemInstruction: SYSTEM_PROMPT,
        });

        const result = await model.generateContent([
          { text: userCatalog },
          {
            inlineData: {
              mimeType: parsedUrl.mimeType,
              data: parsedUrl.base64,
            },
          },
        ]);

        const text = result.response.text();
        let parsed;
        try {
          parsed = JSON.parse(text || '{}');
        } catch (e) {
          const err = new Error('GEMINI_JSON_PARSE');
          err.code = 'GEMINI_JSON_PARSE';
          throw err;
        }

        return finalizeRecommendations(parsed, catalog, 'gemini', modelName);
      } catch (e) {
        lastErr = e;
        if (e && e.code === 'GEMINI_DAILY_LIMIT') throw e;
        if (isQuotaOrRateLimitError(e)) {
          const q = new Error('GEMINI_QUOTA_EXCEEDED');
          q.code = 'GEMINI_QUOTA_EXCEEDED';
          throw q;
        }
        if (e && e.code === 'GEMINI_JSON_PARSE') continue;
        if (shouldTryNextModelFor404(e)) continue;
        throw e;
      }
    }

    throw lastErr || new Error('GEMINI_MODEL_UNAVAILABLE');
  });
}

module.exports = { recommendFromImageGemini };
