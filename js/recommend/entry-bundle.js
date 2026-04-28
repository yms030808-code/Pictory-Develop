/**
 * recommend 페이지용 단일 번들 진입점 — bridge + picoryRecommendInit 통합
 */
import { getThumbnailForRecommendModel } from './cameraThumbnails.js';
import * as picory from './picoryAnalysis.mjs';

window.picoryGetRecommendThumbnail = getThumbnailForRecommendModel;
window.picoryRecommend = picory;
