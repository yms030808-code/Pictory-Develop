/**
 * Picory custom dropdown — trigger, menu, item states (static / hover / open).
 * @param {{
 *   root?: HTMLElement | null,
 *   trigger: HTMLElement,
 *   list: HTMLElement,
 *   valueEl?: HTMLElement | null,
 *   hiddenInput?: HTMLInputElement | null,
 *   initialValue: string,
 *   onChange?: (value: string) => void,
 *   isValid?: (value: string) => boolean,
 * }} opts
 */
function mountPicoryDropdown({
  root,
  trigger,
  list,
  valueEl,
  hiddenInput,
  initialValue,
  onChange,
  isValid = () => true,
}) {
  const rootEl = root || trigger.closest('.picory-dropdown');
  const optionSelector = '.picory-dropdown__item[data-value], .product-catalog__sort-option[data-value]';
  const optionEls = () => Array.from(list.querySelectorAll(optionSelector));

  function syncValue(value) {
    const label = String(value || '').trim();
    if (valueEl) valueEl.textContent = label;
    if (hiddenInput) hiddenInput.value = label;
    optionEls().forEach((opt) => {
      const v = opt.getAttribute('data-value');
      const sel = v === label;
      opt.setAttribute('aria-selected', sel ? 'true' : 'false');
      opt.classList.toggle('is-selected', sel);
    });
  }

  function setOpen(open) {
    list.hidden = !open;
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    trigger.classList.toggle('is-open', open);
    rootEl?.classList.toggle('is-open', open);
  }

  function close() {
    setOpen(false);
  }

  syncValue(initialValue);

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(list.hidden);
  });

  list.addEventListener('click', (e) => {
    const li = /** @type {HTMLElement | null} */ (
      e.target.closest(optionSelector)
    );
    if (!li) return;
    const v = li.getAttribute('data-value');
    if (!v || !isValid(v)) return;
    syncValue(v);
    onChange?.(v);
    close();
  });

  document.addEventListener('mousedown', (e) => {
    if (list.hidden) return;
    const t = /** @type {Node | null} */ (e.target);
    if (trigger.contains(t) || list.contains(t)) return;
    close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !list.hidden) {
      e.preventDefault();
      close();
    }
  });

  return { setValue: syncValue, getValue: () => hiddenInput?.value || valueEl?.textContent || '', close };
}

window.mountPicoryDropdown = mountPicoryDropdown;
