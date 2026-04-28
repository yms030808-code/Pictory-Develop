/**
 * OpenAI 체크리스트 추천 — 카탈로그 ID만 허용, 가격·이미지는 서버 카탈로그 기준
 */
const fs = require('fs');
const path = require('path');
const { createOpenAIClient } = require('./openaiClient');

let catalogCache = null;

function loadCatalog() {
  if (catalogCache) return catalogCache;
  const p = path.join(__dirname, '..', 'server', 'catalog.json');
  const raw = fs.readFileSync(p, 'utf8');
  catalogCache = JSON.parse(raw);
  return catalogCache;
}

const SYSTEM_PROMPT = `You are a camera shopping assistant for Pictory (Korea). Your task:
1. Read the user's checklist answers: budget band, photo intents (may be multiple), weight preference, used/new preference.
2. Choose EXACTLY 3 distinct product ids from the provided catalog ONLY. Never invent ids.
3. Order by best match (rank 1 = best).
4. For each, write "why" in Korean (2~3 sentences): why it fits their budget and shooting goals.
5. Provide 2 short Korean tags per item (e.g. 브이로그, 입문 친화).

Respond with valid JSON only, this exact shape:
{"summary":"한 줄 요약(한국어)","recommendations":[{"id":"catalog-id","why":"...","tags":["태그1","태그2"]}]}
The recommendations array must have length 3.`;

/**
 * @param {{ budget: string, intents: string[], weight: string, usedPref: string }} answers
 */
async function recommendWithOpenAI(answers) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !String(apiKey).trim()) {
    const err = new Error('OPENAI_API_KEY_MISSING');
    err.code = 'OPENAI_API_KEY_MISSING';
    throw err;
  }

  const openai = createOpenAIClient(apiKey);

  const catalog = loadCatalog();
  const catalogLite = catalog.map((p) => ({
    id: p.id,
    brand: p.brand,
    model: p.model,
    priceKrw: p.priceKrw,
    priceSummary: p.priceSummary,
    categories: p.categories,
    description: p.description,
  }));

  const userContent = JSON.stringify(
    {
      answers,
      catalog: catalogLite,
    },
    null,
    0,
  );

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.35,
    max_tokens: 2000,
  });

  const text = completion.choices[0]?.message?.content || '{}';
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    const err = new Error('OPENAI_JSON_PARSE');
    err.code = 'OPENAI_JSON_PARSE';
    throw err;
  }

  const summary = typeof parsed.summary === 'string' ? parsed.summary.trim() : '';
  const recs = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];

  const byId = Object.fromEntries(catalog.map((p) => [p.id, p]));
  const usedIds = new Set();
  const items = [];

  for (const r of recs) {
    const id = r && r.id;
    if (!id || !byId[id] || usedIds.has(id)) continue;
    usedIds.add(id);
    const why = String(r.why || '').trim() || byId[id].description.slice(0, 120);
    const tags = Array.isArray(r.tags) ? r.tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 2) : [];
    items.push({
      product: byId[id],
      why,
      tags: tags.length ? tags : ['Pictory 추천', '카탈로그'],
    });
    if (items.length >= 3) break;
  }

  const popularitySorted = [...catalog].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  for (const p of popularitySorted) {
    if (items.length >= 3) break;
    if (usedIds.has(p.id)) continue;
    usedIds.add(p.id);
    items.push({
      product: p,
      why: '선택 조건에 맞춰 보완 추천으로 포함했어요. ' + (p.description || '').slice(0, 80),
      tags: ['보완 추천', '카탈로그'],
    });
  }

  return {
    source: 'openai',
    model,
    summary: summary || 'OpenAI가 체크리스트와 카탈로그를 바탕으로 추천을 정리했어요.',
    items: items.slice(0, 3),
  };
}

module.exports = { recommendWithOpenAI, loadCatalog };
