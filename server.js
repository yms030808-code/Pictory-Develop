const http = require('http');
const fs = require('fs');
const path = require('path');

try {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
} catch (_) {
  /* optional */
}

const { recommendWithOpenAI } = require('./lib/checklistOpenAI');
const { recommendFromImage } = require('./lib/recommendImage');

const PREFERRED_PORT = Number(process.env.PORT) || 3000;
let listenPort = PREFERRED_PORT;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

/** JSON POST 본문 (이미지 base64 등) — 최대 바이트 제한 */
function readJsonBodyWithLimit(req, maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    let rejected = false;
    req.on('data', (c) => {
      if (rejected) return;
      total += c.length;
      if (total > maxBytes) {
        rejected = true;
        req.destroy();
        const err = new Error('PAYLOAD_TOO_LARGE');
        err.code = 'PAYLOAD_TOO_LARGE';
        reject(err);
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      if (rejected) return;
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, obj) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(obj));
}

const server = http.createServer((req, res) => {
  const host = req.headers.host || `localhost:${listenPort}`;
  let url;
  try {
    url = new URL(req.url || '/', `http://${host}`);
  } catch (_) {
    url = new URL('/', `http://${host}`);
  }

  if (
    req.method === 'OPTIONS' &&
    (url.pathname === '/api/checklist-recommend' || url.pathname === '/api/recommend-image')
  ) {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/checklist-recommend') {
    readJsonBody(req)
      .then(async (body) => {
        const answers = body.answers || body;
        if (!answers || typeof answers !== 'object') {
          sendJson(res, 400, { error: 'BAD_REQUEST', message: 'answers object required' });
          return;
        }
        const result = await recommendWithOpenAI(answers);
        sendJson(res, 200, result);
      })
      .catch((err) => {
        const code = err.code || err.message;
        if (code === 'OPENAI_API_KEY_MISSING') {
          sendJson(res, 503, {
            error: 'OPENAI_API_KEY_MISSING',
            message: '환경 변수 OPENAI_API_KEY를 설정한 뒤 서버를 다시 실행해 주세요.',
          });
          return;
        }
        sendJson(res, 500, {
          error: 'OPENAI_ERROR',
          message: String(err.message || err),
        });
      });
    return;
  }

  const MAX_IMAGE_JSON_BYTES = 15 * 1024 * 1024;

  if (req.method === 'POST' && url.pathname === '/api/recommend-image') {
    readJsonBodyWithLimit(req, MAX_IMAGE_JSON_BYTES)
      .then(async (body) => {
        const imageBase64 = body.imageBase64;
        if (!imageBase64 || typeof imageBase64 !== 'string') {
          sendJson(res, 400, { error: 'BAD_REQUEST', message: 'imageBase64 필드가 필요합니다.' });
          return;
        }
        if (imageBase64.length > 12 * 1024 * 1024) {
          sendJson(res, 413, { error: 'PAYLOAD_TOO_LARGE', message: '이미지가 너무 큽니다. 10MB 이하로 올려 주세요.' });
          return;
        }
        let clientAnalysis = body.clientAnalysis;
        if (clientAnalysis != null && typeof clientAnalysis !== 'object') {
          sendJson(res, 400, { error: 'BAD_REQUEST', message: 'clientAnalysis는 객체여야 합니다.' });
          return;
        }
        try {
          const caStr = clientAnalysis ? JSON.stringify(clientAnalysis) : '';
          if (caStr.length > 65536) {
            sendJson(res, 413, { error: 'PAYLOAD_TOO_LARGE', message: 'clientAnalysis가 너무 큽니다.' });
            return;
          }
        } catch (_) {
          sendJson(res, 400, { error: 'BAD_REQUEST', message: 'clientAnalysis를 직렬화할 수 없습니다.' });
          return;
        }
        const result = await recommendFromImage(imageBase64.trim(), clientAnalysis);
        sendJson(res, 200, result);
      })
      .catch((err) => {
        const code = err.code || err.message;
        if (code === 'RECOMMEND_IMAGE_KEYS_MISSING') {
          sendJson(res, 503, {
            error: code,
            message:
              '이미지 분석에 GEMINI_API_KEY 또는 OPENAI_API_KEY가 필요합니다. Google AI Studio(https://aistudio.google.com/apikey)에서 Gemini 키를 발급해 .env에 넣어 주세요.',
          });
          return;
        }
        if (code === 'OPENAI_API_KEY_MISSING' || code === 'GEMINI_API_KEY_MISSING') {
          sendJson(res, 503, {
            error: code,
            message:
              code === 'GEMINI_API_KEY_MISSING'
                ? '이미지 분석은 GEMINI_API_KEY가 필요합니다. Google AI Studio(https://aistudio.google.com/apikey)에서 키를 발급해 .env에 넣거나, OpenAI만 쓰려면 GEMINI_API_KEY를 비우고 OPENAI_API_KEY를 설정하세요.'
                : '환경 변수 OPENAI_API_KEY를 설정한 뒤 서버를 다시 실행해 주세요. (Gemini를 쓰려면 GEMINI_API_KEY만 넣어도 됩니다.)',
          });
          return;
        }
        if (code === 'PAYLOAD_TOO_LARGE') {
          sendJson(res, 413, {
            error: 'PAYLOAD_TOO_LARGE',
            message: '요청 본문이 너무 큽니다.',
          });
          return;
        }
        if (code === 'INVALID_IMAGE') {
          sendJson(res, 400, {
            error: 'INVALID_IMAGE',
            message: '올바른 이미지 데이터(data:image/...;base64,...)가 아닙니다.',
          });
          return;
        }
        if (code === 'GEMINI_DAILY_LIMIT') {
          sendJson(res, 503, {
            error: 'GEMINI_DAILY_LIMIT',
            message:
              '오늘 이 서버에서 허용한 Gemini 호출 횟수(기본 하루 18회)에 도달했습니다. 내일 다시 시도하거나 .env에서 GEMINI_MAX_DAILY_CALLS를 조정하세요.',
          });
          return;
        }
        if (code === 'GEMINI_QUOTA_EXCEEDED') {
          sendJson(res, 503, {
            error: 'GEMINI_QUOTA_EXCEEDED',
            message:
              'Gemini 무료 티어 한도에 걸렸습니다. 대시보드 기준으로는 분당 약 5회·하루 약 20회(모델마다 다름) 제한이 있는 경우가 많아요. 내일 다시 시도하거나 Google Cloud에서 결제를 연결해 상향하세요. 사진 한 장 분석은 API 1회로 잡힙니다.',
          });
          return;
        }
        const rawMsg = String(err.message || err);
        if (/429|Too Many Requests|RESOURCE_EXHAUSTED|quota|Quota exceeded|exceeded your current quota|GenerateRequestsPerDay|free_tier/i.test(rawMsg)) {
          sendJson(res, 503, {
            error: 'GEMINI_QUOTA_EXCEEDED',
            message:
              'Gemini API 한도(429)입니다. 무료 티어는 하루 요청 수·분당 요청 수가 작습니다. 시간을 두고 다시 시도하거나 결제/플랜을 확인해 주세요.',
          });
          return;
        }
        sendJson(res, 500, {
          error: 'RECOMMEND_IMAGE_ERROR',
          message: rawMsg.length > 500 ? `${rawMsg.slice(0, 500)}…` : rawMsg,
        });
      });
    return;
  }

  const rawPath = (req.url || '/').split('?')[0].split('#')[0];
  let rel = rawPath === '/' || rawPath === '' ? 'index.html' : rawPath.replace(/^\//, '');
  try {
    rel = decodeURIComponent(rel);
  } catch (_) {
    /* ignore */
  }

  /* /m 또는 /m/ → 모바일 홈 (디렉터리만 열면 404 나던 문제 방지) */
  if (rel === 'm' || rel === 'm/') {
    rel = 'm/index.html';
  }

  const rootResolved = path.resolve(__dirname);
  const filePath = path.resolve(path.join(__dirname, rel));
  const relToRoot = path.relative(rootResolved, filePath);
  if (relToRoot.startsWith('..') || path.isAbsolute(relToRoot)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    const type = MIME[ext] || 'text/plain';
    /** HTML/JS/CSS/JSON은 캐시하지 않음 — 코드 수정 후 F5만으로도 최신이 보이게 (import .mjs 포함) */
    const nocache = ['.html', '.htm', '.js', '.mjs', '.css', '.json'].includes(ext);
    const headers = nocache
      ? { 'Content-Type': type, 'Cache-Control': 'no-store, max-age=0, must-revalidate' }
      : { 'Content-Type': type };
    res.writeHead(200, headers);
    res.end(data);
  });
});

const PORT_TRY_MAX = 40;

function logStartup() {
  const openaiKey = process.env.OPENAI_API_KEY && String(process.env.OPENAI_API_KEY).trim();
  const geminiKey = process.env.GEMINI_API_KEY && String(process.env.GEMINI_API_KEY).trim();

  if (geminiKey) {
    console.log(
      '[recommend-image] Gemini API 키가 있습니다. (실패 시 카탈로그 인기 추천으로 대체)',
    );
  } else if (openaiKey) {
    console.log('[recommend-image] OpenAI API 키가 있습니다. 이미지 분석은 OpenAI Vision을 사용합니다.');
  } else {
    console.warn(
      '[recommend-image] GEMINI_API_KEY 또는 OPENAI_API_KEY가 없습니다. 이미지 분석 API는 동작하지 않습니다. (.env.example 참고)',
    );
  }

  if (!openaiKey) {
    console.warn('[checklist] OPENAI_API_KEY가 없습니다. 체크리스트는 로컬 규칙 추천으로 동작합니다.');
  } else {
    console.log('[OpenAI] API 키가 로드되었습니다. (체크리스트 OpenAI 연동 사용 가능)');
  }
}

function tryListen() {
  server.listen(listenPort, () => {
    console.log(`Server running at http://localhost:${listenPort}`);
    console.log(`모바일: http://localhost:${listenPort}/m/index.html`);
    console.log(`라이브 브라우저: http://localhost:${listenPort}/browser.html`);
    if (listenPort !== PREFERRED_PORT) {
      console.warn(
        `[포트] ${PREFERRED_PORT}번은 이미 사용 중이라 ${listenPort}번으로 띄웠습니다. 브라우저에는 http://localhost:${listenPort}/recommend.html 로 접속하세요.`,
      );
    }
    logStartup();
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    listenPort += 1;
    if (listenPort > PREFERRED_PORT + PORT_TRY_MAX) {
      console.error('사용할 수 있는 포트를 찾지 못했습니다. 다른 프로그램을 종료하거나 PORT 환경 변수로 포트를 지정하세요.');
      process.exit(1);
    }
    tryListen();
    return;
  }
  console.error(err);
  process.exit(1);
});

tryListen();
