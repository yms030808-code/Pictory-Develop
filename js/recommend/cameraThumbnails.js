/**
 * AI 추천 카드 표시명 → 카탈로그 썸네일 경로 (로컬 images/cameras)
 */
import { PICORY_PRODUCT_MOCK } from '../products/mockData.js';

const PRICE_DETAIL_IMAGES = {
  'Fujifilm X100VI': 'images/cameras/fujifilm-x100vi.png',
  'Canon EOS R10': 'images/cameras/canon-eos-r10.png',
  'Sony ZV-E10 II': 'images/cameras/sony-zv-e10-ii.png',
  'Ricoh GR IIIx': 'images/cameras/ricoh-gr-iiix.png',
  'Sony A7C II': 'images/cameras/sony-a7c-ii.png',
  'Nikon Z fc': 'images/cameras/nikon-z-fc.png',
  'Canon PowerShot G7 X Mark III': 'images/cameras/canon-g7x-mark-iii.png',
  'DJI Osmo Pocket 3': 'images/cameras/dji-osmo-pocket-3.png',
  'Sony A6700': 'images/cameras/sony-a6700.png',
  'Canon EOS R50': 'images/cameras/canon-eos-r50.png',
  'Fujifilm X-S20': 'images/cameras/fujifilm-x-s20.png',
  'Canon EOS R50 V': 'images/cameras/canon-eos-r50-v.png',
  'Fujifilm X-T5': 'images/cameras/fujifilm-x-s20.png',
};

/** 카탈로그에 없는 모델은 비슷한 라인업 또는 기본 이미지 */
const EXTRA_THUMBNAILS = {
  'Fujifilm X-T5': 'images/cameras/fujifilm-x-s20.png',
};

function normalizeImagePath(path) {
  return String(path || '').replace(/^\/images\//, 'images/');
}

export function getThumbnailForRecommendModel(displayName) {
  const n = (displayName || '').trim();
  if (PRICE_DETAIL_IMAGES[n]) return PRICE_DETAIL_IMAGES[n];
  if (EXTRA_THUMBNAILS[n]) return EXTRA_THUMBNAILS[n];

  const hit = PICORY_PRODUCT_MOCK.find(
    (p) => `${p.brand} ${p.model}` === n || p.model === n,
  );
  if (hit) {
    const detailKey = `${hit.brand} ${hit.model}`;
    return PRICE_DETAIL_IMAGES[detailKey] || normalizeImagePath(hit.thumbnail);
  }

  return 'images/cameras/default-camera.png';
}
