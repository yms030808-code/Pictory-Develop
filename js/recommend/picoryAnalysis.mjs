/**
 * 업로드 이미지: EXIF(가능 시) + 캔버스 기반 RGB·컬러 지표
 */
/** 프로젝트 안 `js/vendor` — node_modules 상대경로는 브라우저에서 자주 깨짐 */
import exifr from '../vendor/exifr-lite.mjs';

function meanStd(arr) {
  if (!arr.length) return { mean: 0, std: 0 };
  const mean = arr.reduce((s, v) => s + v, 0) / arr.length;
  const v =
    arr.reduce((s, x) => s + (x - mean) * (x - mean), 0) / Math.max(1, arr.length - 1);
  return { mean, std: Math.sqrt(Math.max(0, v)) };
}

/**
 * @param {ImageData} imageData
 */
function computeColorScience(imageData) {
  const { data, width, height } = imageData;
  const rs = [];
  const gs = [];
  const bs = [];
  const sats = [];
  let n = 0;

  const step = width * height > 800000 ? 3 : 2;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const i = (Math.floor(y) * width + Math.floor(x)) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 12) continue;
      rs.push(r);
      gs.push(g);
      bs.push(b);
      n += 1;
      const r1 = r / 255;
      const g1 = g / 255;
      const b1 = b / 255;
      const mx = Math.max(r1, g1, b1);
      const mn = Math.min(r1, g1, b1);
      const sat = mx <= 0.001 ? 0 : ((mx - mn) / mx) * 100;
      sats.push(sat);
    }
  }

  if (n === 0) {
    return {
      mean: { r: 0, g: 0, b: 0 },
      sigma: { r: 0, g: 0, b: 0 },
      warmth: 0,
      saturationRange: 0,
      greenShift: 0,
      moodLabel: '측정 불가',
      scienceNote: '알파가 낮거나 이미지를 불러오지 못했습니다.',
    };
  }

  const mR = meanStd(rs);
  const mG = meanStd(gs);
  const mB = meanStd(bs);
  const meanR = mR.mean;
  const meanG = mG.mean;
  const meanB = mB.mean;
  const sigmaR = mR.std;
  const sigmaG = mG.std;
  const sigmaB = mB.std;

  const warmth = ((meanR - meanB) / 255) * 100;
  const greenShift = ((meanG - (meanR + meanB) / 2) / 255) * 100;

  const satSorted = [...sats].sort((a, b) => a - b);
  const satRange =
    satSorted.length > 1 ? satSorted[satSorted.length - 1] - satSorted[0] : 0;
  const satStdev = meanStd(sats).std;

  let moodLabel = '중성 톤';
  let scienceNote =
    '전반적으로 균형 잡힌 RGB 분포입니다. 다양한 바디에서 무난히 재현 가능한 스냅 톤에 가깝습니다.';

  if (warmth < -18 && meanB > meanR + 15) {
    moodLabel = '쿨톤 — 블루·시안 우세';
    scienceNote =
      '차가운 하이라이트와 청색 계열이 두드러집니다. 소니 사이버샷 CCD·얼리 컴팩트의 JPEG/RAW 뉘앙스와 유사한 “디지털 쿨” 쪽에 가깝습니다.';
  } else if (warmth > 18 && meanR > meanB + 15) {
    moodLabel = '웜톤 — 골든·오렌지 우세';
    scienceNote =
      '적색·황색 채널이 강합니다. 골든아워·실내 텅스텐 느낌에 가깝고, 필름 시뮬레이션이 강한 기종과 잘 맞습니다.';
  } else if (satStdev > 22 && satRange > 55) {
    moodLabel = '채도 변화 큼';
    scienceNote =
      '픽셀마다 채도 편차가 커서 피사체·배경의 분리감이 큽니다. 대비 강한 렌즈·최신 센서 조합과 궁합이 좋은 편입니다.';
  } else if (satStdev < 10 && satRange < 35) {
    moodLabel = '저채도·파스텔';
    scienceNote =
      '전체적으로 채도가 눌린 편입니다. 플랫한 로그 룩이나 흑백에 가까운 컬러에 가깝습니다.';
  }

  if (greenShift > 8) {
    scienceNote += ' 녹색 채널이 다소 높아 풀·잔디·형광 보정 노이즈가 섞인 야외 스냅 톤일 수 있습니다.';
  } else if (greenShift < -8) {
    scienceNote += ' 마젠타/적색 쪽으로 약한 시프트가 보일 수 있습니다.';
  }

  return {
    mean: { r: meanR, g: meanG, b: meanB },
    sigma: { r: sigmaR, g: sigmaG, b: sigmaB },
    warmth: Number(warmth.toFixed(1)),
    saturationRange: Number(satRange.toFixed(1)),
    saturationStdev: Number(satStdev.toFixed(1)),
    greenShift: Number(greenShift.toFixed(1)),
    moodLabel,
    scienceNote,
  };
}

/** @param {string} dataUrl */
export async function analyzePixelsFromDataUrl(dataUrl) {
  const img = new Image();
  img.decoding = 'async';
  await new Promise((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('IMAGE_DECODE'));
    img.src = dataUrl;
  });

  const maxSide = 640;
  let w = img.naturalWidth || img.width;
  let h = img.naturalHeight || img.height;
  const scale = Math.min(1, maxSide / Math.max(w, h));
  const cw = Math.max(1, Math.round(w * scale));
  const ch = Math.max(1, Math.round(h * scale));

  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('NO_2D');
  ctx.drawImage(img, 0, 0, cw, ch);
  const imageData = ctx.getImageData(0, 0, cw, ch);
  return computeColorScience(imageData);
}

async function parseExifPart(file) {
  try {
    const tags = await exifr.parse(file, {
      pick: [
        'Make',
        'Model',
        'LensModel',
        'FocalLength',
        'FNumber',
        'ISO',
        'ExposureTime',
        'DateTimeOriginal',
        'Orientation',
      ],
    });
    if (!tags || typeof tags !== 'object') {
      return { present: false, message: 'EXIF 블록을 찾지 못했습니다.' };
    }
    const model = tags.Model || tags.model;
    const make = tags.Make || tags.make;
    if (!make && !model && !tags.LensModel) {
      return {
        present: false,
        message:
          '촬영 기종 정보가 없습니다. 컬러 과학 분석으로 컴팩트·미러리스 추천으로 이어집니다.',
      };
    }
    return {
      present: true,
      make: make ? String(make).trim() : '',
      model: model ? String(model).trim() : '',
      lensModel: tags.LensModel ? String(tags.LensModel).trim() : '',
      focalLength: tags.FocalLength != null ? Number(tags.FocalLength) : null,
      fNumber: tags.FNumber != null ? Number(tags.FNumber) : null,
      iso: tags.ISO != null ? Number(tags.ISO) : null,
      exposureTime: tags.ExposureTime != null ? Number(tags.ExposureTime) : null,
      dateTimeOriginal: tags.DateTimeOriginal
        ? String(tags.DateTimeOriginal)
        : '',
      message: '',
    };
  } catch (_) {
    return {
      present: false,
      message: 'EXIF를 읽을 수 없습니다. 컬러 분석 기반으로 진행합니다.',
    };
  }
}

/**
 * @param {File} file
 * @param {string} dataUrl
 */
export async function analyzeUpload(file, dataUrl) {
  const [exif, color] = await Promise.all([parseExifPart(file), analyzePixelsFromDataUrl(dataUrl)]);

  const exifWithMessage =
    exif.present === false
      ? {
          ...exif,
          badgeLabel: '없음 → AI·컬러 분석',
          detailHtml:
            '<p class="meta-panel__muted">이 이미지에는 촬영 기종 EXIF가 없습니다. 컬러 과학 분석으로 유사 색감의 카메라를 추천합니다.</p>',
        }
      : {
          ...exif,
          badgeLabel: 'EXIF 확보',
          detailHtml: buildExifDetailHtml(exif),
        };

  return {
    exif: exifWithMessage,
    color,
    version: 1,
  };
}

function buildExifDetailHtml(ex) {
  const rows = [];
  if (ex.make) rows.push(['제조사', ex.make]);
  if (ex.model) rows.push(['모델', ex.model]);
  if (ex.lensModel) rows.push(['렌즈', ex.lensModel]);
  if (ex.focalLength != null && !Number.isNaN(ex.focalLength)) rows.push(['초점거리', `${ex.focalLength}mm`]);
  if (ex.fNumber != null && !Number.isNaN(ex.fNumber)) rows.push(['조리개', `F${ex.fNumber}`]);
  if (ex.iso != null && !Number.isNaN(ex.iso)) rows.push(['ISO', String(Math.round(ex.iso))]);
  if (ex.exposureTime != null && !Number.isNaN(ex.exposureTime)) {
    const t = ex.exposureTime >= 1 ? `${ex.exposureTime.toFixed(1)}s` : `1/${Math.round(1 / ex.exposureTime)}s`;
    rows.push(['셔터', t]);
  }
  if (!rows.length) {
    return '<p class="meta-panel__muted">EXIF는 있으나 주요 태그가 비어 있습니다.</p>';
  }
  return `<dl class="meta-panel__dl">${rows
    .map(
      ([k, v]) =>
        `<div class="meta-panel__row"><dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd></div>`,
    )
    .join('')}</dl>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---------- 로컬 카탈로그 매칭 (별도 .mjs 동적 import 없이 한 파일에서 로드 — fetch 모듈 오류 방지) ----------

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function buildMatchWhy(dW, dS, dG, warmth, cp) {
  const reasons = [];
  if (dW < 12) reasons.push('색온도 느낌 유사');
  if (dS < 15) reasons.push('채도 분포 근접');
  if (dG < 8) reasons.push('그린 시프트 유사');
  if (warmth > 12 && cp.warmth > 10) reasons.push('웜톤 계열');
  if (warmth < -8 && cp.warmth < 0) reasons.push('쿨톤 계열');
  if (reasons.length === 0) reasons.push('전반적 색감 프로필 유사');
  return `${reasons.slice(0, 2).join(' · ')} (로컬 거리 점수 기반)`;
}

export function rankByColorProfile(measured, catalog) {
  const w = measured.warmth;
  const s = measured.saturationRange;
  const g = measured.greenShift;

  const rows = [];
  for (const p of catalog) {
    const cp = p.colorProfile;
    if (!cp || typeof cp.warmth !== 'number') continue;

    const dW = Math.abs(w - cp.warmth);
    const dS = Math.abs(s - (cp.saturationRange ?? cp.saturation ?? 0));
    const dG = Math.abs(g - cp.greenShift);
    const dist = dW * 1.5 + dS * 0.4 + dG * 1.0;
    const score = Math.max(5, Math.min(98, 95 - dist * 0.8));

    const why = buildMatchWhy(dW, dS, dG, w, cp);
    const lr = p.localRecommend || {};
    const lens = typeof lr.lens === 'string' ? lr.lens : '렌즈는 촬영 스타일에 맞춰 선택';
    const specs = lr.specs && typeof lr.specs === 'object' ? lr.specs : {};

    rows.push({
      rank: 0,
      score,
      product: p,
      why,
      lens_suggestion: lens,
      specs: {
        sensor: String(specs.sensor || '—'),
        megapixel: String(specs.megapixel || '—'),
        aperture: String(specs.aperture || '—'),
      },
    });
  }

  rows.sort((a, b) => b.score - a.score);
  rows.forEach((r, i) => {
    r.rank = i + 1;
  });
  return rows;
}

export function toApiShape(color, ranked) {
  let top2 = ranked.slice(0, 2);
  if (top2.length === 1) {
    top2 = [
      top2[0],
      {
        ...top2[0],
        rank: 2,
        why: `${top2[0].why} (대안으로 동일 순위를 표시했어요.)`,
      },
    ];
  }
  const best = top2[0];
  const moodTags = [];
  if (color.moodLabel) {
    const short = String(color.moodLabel).split('—')[0].trim().slice(0, 24);
    if (short) moodTags.push(short);
  }
  moodTags.push('색감 매칭', '로컬 추천');

  const summary = best
    ? `이 사진의 컬러 지표(웜/쿨·채도·그린 시프트)와 카탈로그에 적어 둔 색 특성을 비교했어요. 가장 가까운 조합은 ${best.product.brand} ${best.product.model}(${best.score.toFixed(1)}점 근사)입니다. 브라우저에서만 계산했고 외부 AI 서버는 쓰지 않았어요.`
    : '카탈로그에서 색 프로필이 있는 기종을 찾지 못했어요.';

  const items = top2.map((r, idx) => ({
    rank: idx + 1,
    product: r.product,
    why: r.why,
    lens_suggestion: r.lens_suggestion,
    specs: r.specs,
  }));

  return {
    source: 'local-color-match',
    model: 'catalog-distance',
    summary,
    mood_tags: moodTags.slice(0, 6),
    items,
  };
}

export async function loadCatalog() {
  const res = await fetch('/server/catalog.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('CATALOG_FETCH');
  return res.json();
}
