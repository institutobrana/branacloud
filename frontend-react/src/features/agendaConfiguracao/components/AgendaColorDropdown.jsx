import { useEffect, useMemo, useRef, useState } from 'react';

import { AGENDA_APRESENTACAO_COLORS, getAgendaApresentacaoColor } from '../agendaConfiguracaoColors.js';

function useOnClickOutside(ref, handler, active) {
  useEffect(() => {
    if (!active) {
      return undefined;
    }
    const onPointerDown = (event) => {
      const node = ref.current;
      if (!node || node.contains(event.target)) {
        return;
      }
      handler();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [active, handler, ref]);
}

export function AgendaColorDropdown({
  value,
  onChange,
  options = AGENDA_APRESENTACAO_COLORS,
  'aria-label': ariaLabel,
  className = '',
}) {
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const selected = useMemo(() => getAgendaApresentacaoColor(value), [value]);

  const close = () => setOpen(false);
  useOnClickOutside(rootRef, close, open);

  const handleSelect = (nextValue) => {
    onChange?.(nextValue);
    close();
  };

  return (
    <div
      ref={rootRef}
      className={`agenda-color-dropdown${open ? ' is-open' : ''} ${className}`.trim()}
    >
      <button
        type="button"
        className="agenda-color-dropdown__button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="agenda-color-dropdown__swatch" style={{ background: selected.value }} />
        <span className="agenda-color-dropdown__label">{selected.label}</span>
        <span className="agenda-color-dropdown__arrow" aria-hidden="true">▼</span>
      </button>
      <div
        className={`agenda-color-dropdown__list${open ? ' is-open' : ''}`}
        role="listbox"
        aria-hidden={!open}
      >
        {options.map((item) => {
          const active = item.value.toLowerCase() === String(selected.value || '').toLowerCase();
          return (
            <button
              key={item.value}
              type="button"
              className={`agenda-color-dropdown__option${active ? ' is-active' : ''}`}
              onClick={() => handleSelect(item.value)}
              role="option"
              aria-selected={active}
            >
              <span className="agenda-color-dropdown__swatch" style={{ background: item.value }} />
              <span className="agenda-color-dropdown__option-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
