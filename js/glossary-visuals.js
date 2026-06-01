/**
 * Glossary interactive visual demos — slider-driven previews per term.
 * Uses CSS layers + canvas (no external images; works on file:// and http).
 */
(function () {
  'use strict';

  const NOISE_BG =
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";

  function clamp(v, lo, hi) {
    return Math.min(hi, Math.max(lo, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function mount(root, build) {
    root.classList.add('glossary-visual--ready');
    build(root);
  }

  function shell(root, opts) {
    const {
      label,
      min,
      max,
      step = 1,
      value,
      format = (v) => String(v),
      hint,
      stageHtml = '',
    } = opts;

    root.innerHTML =
      `<div class="glossary-visual__stage">${stageHtml}</div>` +
      `<div class="glossary-visual__controls">` +
      `<div class="glossary-visual__control-row">` +
      `<span class="glossary-visual__label">${label}</span>` +
      `<output class="glossary-visual__value">${format(value)}</output>` +
      `</div>` +
      `<input type="range" class="glossary-visual__slider" min="${min}" max="${max}" step="${step}" value="${value}" aria-label="${label}">` +
      (hint ? `<p class="glossary-visual__hint">${hint}</p>` : '') +
      `</div>`;

    const slider = root.querySelector('.glossary-visual__slider');
    const output = root.querySelector('.glossary-visual__value');
    const stage = root.querySelector('.glossary-visual__stage');

    function onInput(fn) {
      slider.addEventListener('input', () => {
        const v = Number(slider.value);
        output.textContent = format(v);
        fn(v, stage, slider);
      });
      fn(Number(slider.value), stage, slider);
    }

    return { slider, output, stage, onInput };
  }

  const CAT_IMAGE_URL = 'icons/glossary%20cat.png';

  function subjectCat(extraStyle = '') {
    const styleAttr = extraStyle ? ` style="${extraStyle}"` : '';
    return (
      `<div class="glossary-visual__subject" data-subject${styleAttr}>` +
      `<img class="glossary-visual__cat" src="${CAT_IMAGE_URL}" alt="" decoding="async" draggable="false" />` +
      `</div>`
    );
  }

  function photoScene(overlays = '') {
    return (
      `<div class="glossary-visual__viewport">` +
      `<div class="glossary-visual__scene" data-scene>` +
      `<div class="glossary-visual__sky"></div>` +
      `<div class="glossary-visual__hills" data-hills></div>` +
      `<div class="glossary-visual__bokeh" data-bokeh>` +
      `<span></span><span></span><span></span><span></span><span></span>` +
      `</div>` +
      subjectCat() +
      `<div class="glossary-visual__noise" data-noise></div>` +
      `</div>` +
      overlays +
      `</div>`
    );
  }

  function applyKelvinTint(el, k) {
    const neutral = 5500;
    if (k <= neutral) {
      const amt = (neutral - k) / (neutral - 2500);
      el.style.background = `rgba(90, 155, 255, ${clamp(amt * 0.62, 0, 0.62)})`;
    } else {
      const amt = (k - neutral) / (9000 - neutral);
      el.style.background = `rgba(255, 175, 75, ${clamp(amt * 0.58, 0, 0.58)})`;
    }
  }

  function burstMiniScene(index, total) {
    const offset = total <= 1 ? 0 : lerp(-14, 14, index / (total - 1));
    return (
      `<div class="glossary-visual__burst-frame" style="--i:${index}">` +
      `<div class="glossary-visual__burst-inner">` +
      `<div class="glossary-visual__scene glossary-visual__scene--mini">` +
      `<div class="glossary-visual__sky"></div>` +
      `<div class="glossary-visual__hills"></div>` +
      `<div class="glossary-visual__bokeh">` +
      `<span></span><span></span><span></span>` +
      `</div>` +
      subjectCat(`transform:translateX(calc(-50% + ${offset.toFixed(1)}px))`) +
      `</div></div></div>`
    );
  }

  /* ── Aperture ── */
  function mountAperture(root) {
    const ui = shell(root, {
      label: '조리개 (F값)',
      min: 14,
      max: 160,
      step: 2,
      value: 28,
      format: (v) => `F${(v / 10).toFixed(1)}`,
      hint: 'F값이 낮을수록 배경이 더 흐려져요.',
      stageHtml: photoScene(),
    });
    ui.onInput((v, stage) => {
      const f = v / 10;
      const blur = clamp((f - 1.4) * 2.2, 0, 18);
      const scene = stage.querySelector('[data-scene]');
      if (scene) {
        scene.style.setProperty('--blur', `${blur}px`);
        scene.dataset.aperture = String(f);
      }
    });
  }

  /* ── Shutter speed ── */
  function mountShutter(root) {
    const ui = shell(root, {
      label: '셔터스피드',
      min: 0,
      max: 100,
      value: 70,
      format: (v) => {
        if (v >= 85) return '1/4000초';
        if (v >= 65) return '1/500초';
        if (v >= 45) return '1/125초';
        if (v >= 25) return '1/30초';
        return '1/2초';
      },
      hint: '느릴수록 움직임이 흐려지고, 빠를수록 순간을 멈춰요.',
      stageHtml:
        photoScene(
          `<div class="glossary-visual__motion-trail" data-trail aria-hidden="true"></div>`,
        ),
    });
    ui.onInput((v, stage) => {
      const subject = stage.querySelector('[data-subject]');
      const trail = stage.querySelector('[data-trail]');
      const blur = clamp((100 - v) * 0.35, 0, 28);
      const offset = clamp((100 - v) * 0.55, 0, 48);
      if (subject) {
        subject.style.transform = `translateX(calc(-50% + ${offset}px))`;
        subject.style.filter = blur > 2 ? `blur(${blur * 0.35}px)` : 'none';
      }
      if (trail) {
        trail.style.opacity = blur > 4 ? clamp(blur / 20, 0.15, 0.75) : 0;
        trail.style.width = `${20 + offset * 0.6}%`;
      }
    });
  }

  /* ── ISO ── */
  function mountIso(root) {
    const ui = shell(root, {
      label: 'ISO',
      min: 100,
      max: 6400,
      step: 100,
      value: 400,
      format: (v) => `ISO ${v}`,
      hint: 'ISO가 높을수록 밝아지지만 노이즈(그레인)가 늘어요.',
      stageHtml: photoScene(),
    });
    ui.onInput((v, stage) => {
      const scene = stage.querySelector('[data-scene]');
      const noise = stage.querySelector('[data-noise]');
      const t = clamp((Math.log2(v) - Math.log2(100)) / (Math.log2(6400) - Math.log2(100)), 0, 1);
      const bright = 1 + t * 0.35;
      const noiseOp = t * 0.72;
      if (scene) scene.style.filter = `brightness(${bright})`;
      if (noise) {
        noise.style.opacity = String(noiseOp);
        noise.style.backgroundImage = NOISE_BG;
      }
    });
  }

  /* ── Sensor size ── */
  function mountSensor(root) {
    const labels = ['M4/3', 'APS-C', '풀프레임'];
    const ui = shell(root, {
      label: '센서 크기',
      min: 0,
      max: 2,
      step: 1,
      value: 1,
      format: (v) => labels[v] || labels[1],
      hint: '센서가 클수록 같은 렌즈에서 더 넓은 화각·얕은 심도를 기대할 수 있어요.',
      stageHtml: photoScene(`<div class="glossary-visual__crop-frame" data-crop aria-hidden="true"></div>`),
    });
    ui.onInput((v, stage) => {
      const scales = [1.28, 1.1, 1];
      const blurs = [4, 7, 11];
      const scene = stage.querySelector('[data-scene]');
      const crop = stage.querySelector('[data-crop]');
      const scale = scales[v] || 1;
      const blur = blurs[v] || 7;
      if (scene) {
        scene.style.transform = `scale(${scale})`;
        scene.style.setProperty('--blur', `${blur}px`);
      }
      if (crop) crop.style.opacity = v === 0 ? '0.55' : v === 1 ? '0.3' : '0';
    });
  }

  /* ── Focal length ── */
  function mountFocal(root) {
    const ui = shell(root, {
      label: '초점거리',
      min: 24,
      max: 85,
      step: 1,
      value: 50,
      format: (v) => `${v}mm`,
      hint: '숫자가 작을수록 넓게(광각), 클수록 좁게(망원) 담아요.',
      stageHtml: photoScene(),
    });
    ui.onInput((v, stage) => {
      const scene = stage.querySelector('[data-scene]');
      if (!scene) return;
      const t = (v - 24) / (85 - 24);
      const scale = lerp(0.9, 1.22, t);
      scene.style.transform = `scale(${scale})`;
    });
  }

  /* ── Depth of field / bokeh ── */
  function mountDof(root) {
    const ui = shell(root, {
      label: '심도 (조리개 연동)',
      min: 14,
      max: 160,
      step: 2,
      value: 20,
      format: (v) => `F${(v / 10).toFixed(1)} · 보케`,
      hint: 'F값이 낮을수록 배경 보케(빛 번짐)가 커져요.',
      stageHtml: photoScene(),
    });
    ui.onInput((v, stage) => {
      const f = v / 10;
      const blur = clamp((f - 1.4) * 2.5, 0, 20);
      const bokehScale = clamp(2.4 - f * 0.12, 0.6, 2.2);
      const scene = stage.querySelector('[data-scene]');
      const bokeh = stage.querySelector('[data-bokeh]');
      if (scene) scene.style.setProperty('--blur', `${blur}px`);
      if (bokeh) bokeh.style.transform = `scale(${bokehScale})`;
    });
  }

  /* ── AF ── */
  function mountAf(root) {
    const ui = shell(root, {
      label: 'AF 추적 강도',
      min: 0,
      max: 100,
      value: 75,
      format: (v) => (v >= 60 ? '연속 AF · 추적 중' : '단일 AF · 초점 재조정'),
      hint: '연속 AF는 움직이는 피사체에 초점을 계속 맞춰요.',
      stageHtml: photoScene(`<div class="glossary-visual__af-box" data-afbox aria-hidden="true"></div>`),
    });

    let tracking = true;
    ui.onInput((v, stage) => {
      tracking = v >= 55;
      const subject = stage.querySelector('[data-subject]');
      const box = stage.querySelector('[data-afbox]');
      const offset = tracking ? Math.sin(performance.now() / 420) * 18 : 0;
      if (subject) {
        subject.style.transform = `translateX(calc(-50% + ${offset}px))`;
        subject.style.filter = tracking ? 'none' : 'blur(2.5px)';
      }
      if (box) {
        box.classList.toggle('is-locked', tracking);
        box.style.transform = `translate(calc(-50% + ${offset}px), -50%)`;
      }
    });

    function tick() {
      if (!root.isConnected) return;
      if (tracking) ui.slider.dispatchEvent(new Event('input'));
      root._afRaf = requestAnimationFrame(tick);
    }
    root._afRaf = requestAnimationFrame(tick);
  }

  /* ── Stabilization ── */
  function mountStabilization(root) {
    const ui = shell(root, {
      label: '손떨림 보정',
      min: 0,
      max: 100,
      value: 70,
      format: (v) => (v >= 50 ? `IBIS ${Math.round(v)}%` : '보정 OFF'),
      hint: '보정이 켜지면 같은 셔터에서도 흔들림이 줄어요.',
      stageHtml: photoScene(),
    });

    let strength = 0.7;
    const start = performance.now();
    ui.onInput((v, stage) => {
      strength = v / 100;
      applyShake(stage, strength, start);
    });

    function applyShake(stage, s, t0) {
      const scene = stage.querySelector('[data-scene]');
      if (!scene) return;
      const t = (performance.now() - t0) / 1000;
      const shakeX = Math.sin(t * 9) * 6 * (1 - s);
      const shakeY = Math.cos(t * 11) * 4 * (1 - s);
      const rot = Math.sin(t * 7) * 1.2 * (1 - s);
      scene.style.transform = `translate(${shakeX}px, ${shakeY}px) rotate(${rot}deg)`;
    }

    function tick() {
      if (!root.isConnected) return;
      applyShake(ui.stage, strength, start);
      root._stabRaf = requestAnimationFrame(tick);
    }
    root._stabRaf = requestAnimationFrame(tick);
  }

  /* ── RAW vs JPG ── */
  function mountRaw(root) {
    const ui = shell(root, {
      label: 'RAW 하이라이트 복구',
      min: 0,
      max: 100,
      value: 0,
      format: (v) => `${v}% 복구`,
      hint: 'RAW는 과·저노출 영역을 편집에서 더 많이 살릴 수 있어요.',
      stageHtml: photoScene(
        `<div class="glossary-visual__raw-clipped" data-clipped aria-hidden="true"></div>`,
      ),
    });
    ui.onInput((v, stage) => {
      const scene = stage.querySelector('[data-scene]');
      const clipped = stage.querySelector('[data-clipped]');
      const t = v / 100;
      if (scene) {
        scene.style.filter = `brightness(${lerp(0.68, 1.02, t)}) contrast(${lerp(1.22, 1.02, t)}) saturate(${lerp(0.78, 1.05, t)})`;
      }
      if (clipped) clipped.style.opacity = String(lerp(0.92, 0, t));
    });
  }

  /* ── White balance ── */
  function mountWhiteBalance(root) {
    const ui = shell(root, {
      label: '색온도 (K)',
      min: 2500,
      max: 9000,
      step: 100,
      value: 5500,
      format: (v) => `${v}K`,
      hint: 'K가 낮을수록 차갑게(푸르게), 높을수록 따뜻하게(노랗게) 보여요.',
      stageHtml: photoScene(
        `<div class="glossary-visual__wb-card" aria-hidden="true"></div>` +
          `<div class="glossary-visual__wb-tint" data-wb-tint aria-hidden="true"></div>`,
      ),
    });
    ui.onInput((v, stage) => {
      const tint = stage.querySelector('[data-wb-tint]');
      if (tint) applyKelvinTint(tint, v);
    });
  }

  /* ── Film simulation ── */
  function mountFilm(root) {
    const presets = [
      { name: 'Standard', filter: 'none' },
      { name: 'Velvia', filter: 'saturate(1.45) contrast(1.12) hue-rotate(-6deg)' },
      { name: 'Classic Chrome', filter: 'saturate(0.75) contrast(1.08) sepia(0.12)' },
      { name: 'Nostalgic Neg.', filter: 'saturate(1.1) sepia(0.22) brightness(1.05) hue-rotate(8deg)' },
    ];
    const ui = shell(root, {
      label: '필름 시뮬레이션',
      min: 0,
      max: presets.length - 1,
      step: 1,
      value: 0,
      format: (v) => presets[v]?.name || presets[0].name,
      hint: '프리셋마다 채도·대비·색조가 달라져요.',
      stageHtml: photoScene(),
    });
    ui.onInput((v, stage) => {
      const scene = stage.querySelector('[data-scene]');
      if (scene) scene.style.filter = presets[v]?.filter || 'none';
    });
  }

  /* ── Noise / grain ── */
  function mountNoise(root) {
    const ui = shell(root, {
      label: '노이즈 (ISO 연동)',
      min: 100,
      max: 6400,
      step: 100,
      value: 1600,
      format: (v) => `ISO ${v}`,
      hint: '어두운 환경·고 ISO에서 입자감(그레인)이 두드러져요.',
      stageHtml: photoScene(),
    });
    ui.onInput((v, stage) => {
      const noise = stage.querySelector('[data-noise]');
      const t = clamp((Math.log2(v) - Math.log2(100)) / (Math.log2(6400) - Math.log2(100)), 0, 1);
      if (noise) {
        noise.style.opacity = String(lerp(0.05, 0.85, t));
        noise.style.backgroundImage = NOISE_BG;
      }
    });
  }

  /* ── Exposure compensation ── */
  function mountExposureComp(root) {
    const ui = shell(root, {
      label: '노출 보정 (EV)',
      min: -20,
      max: 20,
      step: 1,
      value: 0,
      format: (v) => `${v > 0 ? '+' : ''}${(v / 10).toFixed(1)} EV`,
      hint: '+EV는 더 밝게, −EV는 더 어둡게 노출돼요.',
      stageHtml: photoScene(),
    });
    ui.onInput((v, stage) => {
      const scene = stage.querySelector('[data-scene]');
      if (scene) scene.style.filter = `brightness(${1 + v / 25})`;
    });
  }

  /* ── Focus peaking ── */
  function mountFocusPeaking(root) {
    const ui = shell(root, {
      label: '수동 초점 (MF)',
      min: 0,
      max: 100,
      value: 35,
      format: (v) => (Math.abs(v - 72) < 8 ? '초점 OK · 피킹 ON' : '초점 미세 조정 중'),
      hint: '초점이 맞으면 피사체 윤곽에 색상(피킹)이 표시돼요.',
      stageHtml: photoScene(`<div class="glossary-visual__peak" data-peak aria-hidden="true"></div>`),
    });
    ui.onInput((v, stage) => {
      const subject = stage.querySelector('[data-subject]');
      const peak = stage.querySelector('[data-peak]');
      const inFocus = Math.abs(v - 72) < 10;
      const blur = inFocus ? 0 : clamp(Math.abs(v - 72) * 0.08, 0, 6);
      if (subject) subject.style.filter = blur ? `blur(${blur}px)` : 'none';
      if (peak) peak.style.opacity = inFocus ? '1' : '0';
    });
  }

  /* ── Histogram ── */
  function mountHistogram(root) {
    const ui = shell(root, {
      label: '노출 (히스토그램)',
      min: -30,
      max: 30,
      step: 1,
      value: 0,
      format: (v) => `${v > 0 ? '+' : ''}${(v / 10).toFixed(1)} EV`,
      hint: '그래프가 왼쪽이면 어둡고, 오른쪽이면 밝은 분포예요.',
      stageHtml:
        photoScene() +
        `<canvas class="glossary-visual__histogram" data-hist width="320" height="56" aria-hidden="true"></canvas>`,
    });

    function drawHist(canvas, ev) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(0, 0, w, h);

      const center = 0.5 + ev / 60;
      const bars = 48;
      for (let i = 0; i < bars; i++) {
        const x = (i / bars) * w;
        const dist = Math.abs(i / bars - center);
        const seed = (Math.sin(i * 12.9898) * 43758.5453) % 1;
        const barH = Math.max(4, (1 - dist * 1.8) * h * (0.35 + Math.abs(seed) * 0.45));
        const clipped = i / bars < 0.05 + Math.max(0, -ev / 40) || i / bars > 0.95 - Math.max(0, ev / 40);
        ctx.fillStyle = clipped ? 'rgba(255,80,60,0.85)' : 'rgba(255,101,0,0.75)';
        ctx.fillRect(x + 1, h - barH, w / bars - 2, barH);
      }
    }

    ui.onInput((v, stage) => {
      const scene = stage.querySelector('[data-scene]');
      const canvas = stage.querySelector('[data-hist]');
      if (scene) scene.style.filter = `brightness(${1 + v / 28})`;
      if (canvas) drawHist(canvas, v);
    });
  }

  /* ── Chromatic aberration ── */
  function mountChromatic(root) {
    const ui = shell(root, {
      label: '색수차 (CA)',
      min: 0,
      max: 100,
      value: 55,
      format: (v) => (v < 15 ? '거의 없음' : v < 50 ? '약함' : '강함'),
      hint: '가장자리에 보라·초록 번짐이 생기는 정도예요.',
      stageHtml: photoScene(`<div class="glossary-visual__ca" data-ca aria-hidden="true"></div>`),
    });
    ui.onInput((v, stage) => {
      const ca = stage.querySelector('[data-ca]');
      const px = (v / 100) * 5;
      if (ca) {
        ca.style.opacity = String(clamp(v / 85, 0, 1));
        ca.style.boxShadow = `${px}px 0 rgba(180,60,255,0.55), ${-px}px 0 rgba(60,220,120,0.5)`;
      }
    });
  }

  /* ── Viewfinder ── */
  function mountViewfinder(root) {
    const ui = shell(root, {
      label: '파인더 모드',
      min: 0,
      max: 100,
      value: 80,
      format: (v) => (v >= 50 ? 'EVF (전자)' : 'LCD (후면)'),
      hint: 'EVF는 밝은 야외에서도 구도·노출을 선명하게 확인할 수 있어요.',
      stageHtml: photoScene(`<div class="glossary-visual__evf" data-evf aria-hidden="true"></div>`),
    });
    ui.onInput((v, stage) => {
      const evf = stage.querySelector('[data-evf]');
      const scene = stage.querySelector('[data-scene]');
      const isEvf = v >= 50;
      if (evf) {
        evf.style.opacity = isEvf ? '1' : '0';
        evf.style.boxShadow = isEvf ? 'inset 0 0 0 2px rgba(255,101,0,0.5)' : 'none';
      }
      if (scene) {
        scene.style.filter = isEvf ? 'contrast(1.08) saturate(1.05)' : 'brightness(0.82) saturate(0.9)';
      }
    });
  }

  /* ── Burst mode ── */
  function mountBurst(root) {
    const ui = shell(root, {
      label: '연사 속도',
      min: 3,
      max: 30,
      step: 1,
      value: 10,
      format: (v) => `${v} fps`,
      hint: '초당 촬영 매수가 높을수록 더 많은 순간을 연속으로 담아요. 아래 줄이 찍힌 사진들이에요.',
      stageHtml: photoScene(`<div class="glossary-visual__burst-stack" data-burst aria-hidden="true"></div>`),
    });
    ui.onInput((v, stage) => {
      const stack = stage.querySelector('[data-burst]');
      if (!stack) return;
      const frames = clamp(Math.round(v / 4), 2, 8);
      stack.dataset.count = String(frames);
      stack.innerHTML = Array.from({ length: frames }, (_, i) => burstMiniScene(i, frames)).join('');
    });
  }

  const MOUNTERS = {
    aperture: mountAperture,
    shutter: mountShutter,
    iso: mountIso,
    sensor: mountSensor,
    focal: mountFocal,
    dof: mountDof,
    af: mountAf,
    stabilization: mountStabilization,
    raw: mountRaw,
    'white-balance': mountWhiteBalance,
    film: mountFilm,
    noise: mountNoise,
    'exposure-comp': mountExposureComp,
    'focus-peaking': mountFocusPeaking,
    histogram: mountHistogram,
    chromatic: mountChromatic,
    viewfinder: mountViewfinder,
    burst: mountBurst,
  };

  function init() {
    document.querySelectorAll('[data-visual]').forEach((el) => {
      const type = el.getAttribute('data-visual');
      const fn = MOUNTERS[type];
      if (fn) mount(el, fn);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
