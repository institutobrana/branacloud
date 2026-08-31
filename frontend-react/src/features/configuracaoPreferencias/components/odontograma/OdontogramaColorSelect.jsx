import { useEffect, useRef, useState } from 'react';
import { ODONTOGRAM_COLORS } from '../../constants/odontogramaConstants.js';

export function OdontogramaColorSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const currentValue = String(value || '').toLowerCase();
  const current = ODONTOGRAM_COLORS.find((item) => item.value === currentValue) || { value: currentValue || '#000000', label: currentValue || 'Cor personalizada' };
  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => { if (!rootRef.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  return <div ref={rootRef} className="config-preferencias-odontograma-color-select">
    <button type="button" className="config-preferencias-odontograma-color-trigger" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((state) => !state)}>
      <span className="config-preferencias-odontograma-color-swatch" style={{ backgroundColor: current.value }} />
      <span>{current.label}</span><span aria-hidden="true">▼</span>
    </button>
    {open ? <div className="config-preferencias-odontograma-color-options" role="listbox" aria-label="Cores para símbolos">
      {ODONTOGRAM_COLORS.map((item) => <button type="button" role="option" aria-selected={item.value === currentValue} className={`config-preferencias-odontograma-color-option${item.value === currentValue ? ' is-selected' : ''}`} key={item.value} onClick={() => { onChange(item.value); setOpen(false); }}>
        <span className="config-preferencias-odontograma-color-swatch" style={{ backgroundColor: item.value }} /><span>{item.label}</span>
      </button>)}
    </div> : null}
  </div>;
}
