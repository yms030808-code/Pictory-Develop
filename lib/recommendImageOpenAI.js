/**

 * 업로드 이미지 추천 — OpenAI Vision (GEMINI_API_KEY 없을 때 사용)

 */

const { createOpenAIClient } = require('./openaiClient');

const {

  SYSTEM_PROMPT,

  catalogLitePayload,

  finalizeRecommendations,

  formatClientAnalysisBlock,

} = require('./recommendImageCore');



/**

 * @param {string} imageDataUrl data:image/...;base64,...

 */

async function recommendFromImage(imageDataUrl, clientAnalysis) {

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || !String(apiKey).trim()) {

    const err = new Error('OPENAI_API_KEY_MISSING');

    err.code = 'OPENAI_API_KEY_MISSING';

    throw err;

  }



  if (!imageDataUrl || typeof imageDataUrl !== 'string' || !imageDataUrl.startsWith('data:image/')) {

    const err = new Error('INVALID_IMAGE');

    err.code = 'INVALID_IMAGE';

    throw err;

  }



  const openai = createOpenAIClient(apiKey);

  const { catalog, catalogLite } = catalogLitePayload();

  const userText = `Catalog (use only these ids):\n${JSON.stringify(catalogLite)}${formatClientAnalysisBlock(clientAnalysis)}`;



  const model = process.env.OPENAI_VISION_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini';



  const completion = await openai.chat.completions.create({

    model,

    messages: [

      { role: 'system', content: SYSTEM_PROMPT },

      {

        role: 'user',

        content: [

          { type: 'text', text: userText },

          { type: 'image_url', image_url: { url: imageDataUrl.trim() } },

        ],

      },

    ],

    response_format: { type: 'json_object' },

    temperature: 0.4,

    max_tokens: 2500,

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



  return finalizeRecommendations(parsed, catalog, 'openai', model);

}



module.exports = { recommendFromImage };


