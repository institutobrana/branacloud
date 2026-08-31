import { useEffect, useRef, useState } from 'react';

export const LEGACY_FONT_COLORS = [
  ['#000000', 'Preto'], ['#800000', 'Bordo'], ['#008000', 'Verde'], ['#808000', 'Verde-oliva'],
  ['#000080', 'Azul-marinho'], ['#800080', 'Roxo'], ['#008080', 'Azul-petroleo'], ['#808080', 'Cinza'],
  ['#c0c0c0', 'Prateado'], ['#ff0000', 'Vermelho'], ['#00ff00', 'Verde-limao'], ['#ffff00', 'Amarelo'],
  ['#0000ff', 'Azul'], ['#ff00ff', 'Fucsia'], ['#00ffff', 'Azul-piscina'], ['#ffffff', 'Branco'],
].map(([value, label]) => ({ value, label }));

export function AmbienteColorSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = LEGACY_FONT_COLORS.find((item) => item.value === String(value || '').toLowerCase()) || LEGACY_FONT_COLORS[0];
  useEffect(() => { if (!open) return undefined; const close = (event) => { if (!rootRef.current?.contains(event.target)) setOpen(false); }; document.addEventListener('mousedown', close); return () => document.removeEventListener('mousedown', close); }, [open]);
  return <div ref={rootRef} className="config-preferencias-font-color-select"><button type="button" className="config-preferencias-font-color-trigger" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((state) => !state)}><span className="config-preferencias-font-color-swatch" style={{ backgroundColor: current.value }} /><span>{current.label}</span><span aria-hidden="true">▼</span></button>{open && <div className="config-preferencias-font-color-options" role="listbox" aria-label="Cores">{LEGACY_FONT_COLORS.map((item) => <button type="button" role="option" aria-selected={item.value === current.value} className={`config-preferencias-font-color-option${item.value === current.value ? ' is-selected' : ''}`} key={item.value} onClick={() => { onChange(item.value); setOpen(false); }}><span className="config-preferencias-font-color-swatch" style={{ backgroundColor: item.value }} /><span>{item.label}</span></button>)}</div>}</div>;
}
