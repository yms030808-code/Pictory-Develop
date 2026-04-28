/**
 * 서버 전용 OpenAI 클라이언트 — API 키·조직 ID는 환경 변수(.env)
 */
const OpenAI = require('openai');

/**
 * @param {string} apiKey
 * @returns {OpenAI}
 */
function createOpenAIClient(apiKey) {
  const org = process.env.OPENAI_ORG_ID && String(process.env.OPENAI_ORG_ID).trim();
  return new OpenAI({
    apiKey,
    ...(org ? { organization: org } : {}),
  });
}

module.exports = { createOpenAIClient };
