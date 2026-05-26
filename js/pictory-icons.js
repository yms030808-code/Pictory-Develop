/**
 * Pictory icons — loads SVG assets from /icons/
 * Usage: PictoryIcons.render('travel') or <span data-pictory-icon="search"></span>
 */
(function (global) {
  const ICON_DIR = 'icons/';

  /** @type {Record<string, string>} */
  const ICON_FILES = {
    'arrow-left': 'basic icon=arrow_back.svg',
    'arrow-right': 'basic icon=arrow_forward.svg',
    'chevron-left': 'basic icon=arrow_back_ios.svg',
    'chevron-right': 'basic icon=arrow_forward_ios.svg',
    x: 'basic icon=close.svg',
    search: 'basic icon=search.svg',
    send: 'basic icon=send.svg',
    heart: 'basic icon=favorite.svg',
    favorite: 'basic icon=favorite.svg',
    comment: 'basic icon=chat_bubble.svg',
    eye: 'remove_red_eye.svg',

    airplane: 'Camera Test=flight.svg',
    travel: 'Camera Test=flight.svg',
    'user-focus': 'Camera Test=person.svg',
    portrait: 'Camera Test=person.svg',
    clapperboard: 'Camera Test=movie.svg',
    video: 'Camera Test=movie.svg',
    'film-strip': 'Camera Test=movie.svg',
    moon: 'Camera Test=night.svg',
    night: 'Camera Test=night.svg',
    run: 'Camera Test=sports.svg',
    sports: 'Camera Test=sports.svg',
    smile: 'Camera Test=baby.svg',
    baby: 'Camera Test=baby.svg',
    parenting: 'Camera Test=baby.svg',
    utensils: 'Camera Test=food.svg',
    food: 'Camera Test=food.svg',
    'video-frame': 'Camera Test=vlog.svg',
    vlog: 'Camera Test=vlog.svg',

    plant: 'camer 1m searching=sprout.svg',
    sprout: 'camer 1m searching=sprout.svg',
    camera: 'camer 1m searching=camera.svg',
    crosshair: 'camer 1m searching=filter.svg',
    target: 'camer 1m searching=filter.svg',
    image: 'camer 1m searching=image.svg',
    photo: 'camer 1m searching=photo.svg',
    sparkle: 'camer 1m searching=add_a_photo.svg',
    'camera-plus': 'camer 1m searching=add_a_photo.svg',
    backpack: 'camer 1m searching=personal_bag.svg',
    trophy: 'camer 1m searching=4k.svg',
    scales: 'camer 1m searching=balance.svg',
    balance: 'camer 1m searching=balance.svg',
    'check-circle': 'camer 1m searching=video.svg',
    'camera-slash': 'camer 1m searching=video_off.svg',
    coins: 'camer 1m searching=coin.svg',
    money: 'camer 1m searching=coin.svg',
    'credit-card': 'camer 1m searching=credit_card.svg',
    wallet: 'camer 1m searching=atm.svg',
    bank: 'camer 1m searching=account_balance.svg',
    building: 'camer 1m searching=account_balance.svg',
    'warning-circle': 'camer 1m searching=error.svg',
    info: 'camer 1m searching=error.svg',
    error: 'camer 1m searching=error.svg',
    'person-simple': 'camer 1m searching=earthquake.svg',
    pulse: 'camer 1m searching=earthquake.svg',
    shake: 'camer 1m searching=earthquake.svg',
    earthquake: 'camer 1m searching=earthquake.svg',
    battery: 'camer 1m searching=battery.svg',
    'battery-high': 'camer 1m searching=battery.svg',
    aperture: 'camer 1m searching=filter.svg',
    tag: 'camer 1m searching=sell.svg',
    price: 'camer 1m searching=sell.svg',
    sell: 'camer 1m searching=sell.svg',
    gallery: 'camer 1m searching=image.svg',
    'video-plus': 'camer 1m searching=video.svg',
    'badge-4k': 'camer 1m searching=4k.svg',
    filter: 'camer 1m searching=filter.svg',
  };

  function iconSrc(name) {
    const file = ICON_FILES[name];
    if (!file) return '';
    return `${ICON_DIR}${encodeURIComponent(file)}`;
  }

  /**
   * @param {string} name
   * @param {{ className?: string, size?: string, alt?: string }} [options]
   */
  function render(name, options = {}) {
    const src = iconSrc(name);
    if (!src) return '';

    const sizeClass = options.size ? ` pictory-icon--${options.size}` : '';
    const extra = options.className ? ` ${options.className}` : '';
    const alt = options.alt ?? '';

    return (
      `<span class="pictory-icon${sizeClass}${extra}" data-icon="${name}">` +
      `<img src="${src}" alt="${alt}" width="24" height="24" decoding="async" draggable="false" />` +
      `</span>`
    );
  }

  function mount(root = document) {
    root.querySelectorAll('[data-pictory-icon]').forEach((el) => {
      const name = el.getAttribute('data-pictory-icon');
      if (!name) return;
      const size = el.getAttribute('data-pictory-icon-size');
      el.innerHTML = '';
      el.classList.add('pictory-icon');
      if (size) el.classList.add(`pictory-icon--${size}`);
      const src = iconSrc(name);
      if (!src) return;
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.width = 24;
      img.height = 24;
      img.decoding = 'async';
      img.draggable = false;
      el.appendChild(img);
    });
  }

  global.PictoryIcons = {
    render,
    mount,
    iconSrc,
    icons: Object.keys(ICON_FILES),
  };
})(typeof window !== 'undefined' ? window : globalThis);
