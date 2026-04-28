/**
 * recommend.html에서 먼저 로드 — app.js보다 앞서 분석 모듈을 준비해 동적 import 오류 방지
 */
import * as picory from './picoryAnalysis.mjs';

window.picoryRecommend = picory;
