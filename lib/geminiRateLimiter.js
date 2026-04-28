/**
 * Gemini API 무료 티어 보호 — 분당 요청 간격 + 일일 상한
 * (한도 수치는 Google 정책에 따라 달라질 수 있음, .env로 조정 가능)
 */
const MIN_INTERVAL_MS = Math.max(
  1000,
  Number(process.env.GEMINI_MIN_INTERVAL_MS) || 13 * 1000,
);
const MAX_DAILY_CALLS = Math.max(
  1,
  Number(process.env.GEMINI_MAX_DAILY_CALLS) || 18,
);

let mutex = Promise.resolve();

let lastRequestStart = 0;
let dailyDate = '';
let dailyCallCount = 0;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function resetDailyIfNeeded() {
  const t = todayKey();
  if (dailyDate !== t) {
    dailyDate = t;
    dailyCallCount = 0;
  }
}

/**
 * 동시에 여러 업로드가 와도 순차 처리
 */
function withLock(fn) {
  const run = mutex.then(() => fn());
  mutex = run.catch(() => {});
  return run;
}

/**
 * generateContent 직전: 일일 한도 + 분당 간격(이전 요청 시작 시각 기준)
 */
async function beforeGenerateContent() {
  resetDailyIfNeeded();
  if (dailyCallCount >= MAX_DAILY_CALLS) {
    const err = new Error('GEMINI_DAILY_LIMIT');
    err.code = 'GEMINI_DAILY_LIMIT';
    throw err;
  }
  const now = Date.now();
  const wait = lastRequestStart + MIN_INTERVAL_MS - now;
  if (wait > 0) {
    await new Promise((r) => setTimeout(r, wait));
  }
  lastRequestStart = Date.now();
  dailyCallCount += 1;
}

module.exports = {
  withLock,
  beforeGenerateContent,
  MIN_INTERVAL_MS,
  MAX_DAILY_CALLS,
};
