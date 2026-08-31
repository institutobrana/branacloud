import { Button, Checkbox, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import { AMBIENTE_DEFAULT_STYLE } from '../../constants/ambienteConstants.js';
import { normalizeStyle } from '../../utils/ambienteNormalizers.js';
import { AmbienteColorSelect } from './AmbienteColorSelect.jsx';

const labelFor = (value, items) => items.find((item) => String(item.id) === String(value))?.label || value;

export function AmbienteFontDialog({ open, initialStyle, options = {}, onCancel, onConfirm }) {
  const [draft, setDraft] = useState(AMBIENTE_DEFAULT_STYLE);
  useEffect(() => { if (open) setDraft({ ...normalizeStyle(initialStyle, options) }); }, [open, initialStyle, options]);
  const set = (patch) => setDraft((current) => ({ ...current, ...patch }));
  const style = normalizeStyle(draft, options);
  const fonts = options.fontes || []; const styles = options.estilos || []; const sizes = options.tamanhos || []; const scripts = options.scripts || [];
  const previewStyle = { fontFamily: style.fonte_nome, fontSize: `${style.fonte_tamanho}px`, fontWeight: style.fonte_estilo.includes('negrito') ? 700 : 400, fontStyle: style.fonte_estilo.includes('italico') ? 'italic' : 'normal', color: style.cor_texto, textDecoration: `${style.sublinhado ? 'underline ' : ''}${style.riscado ? 'line-through' : ''}`.trim() || 'none' };
  const list = (items, value, onChange, label) => <label className="config-preferencias-font-list-field">{label}<div className="config-preferencias-font-current">{labelFor(value, items)}</div><select className="config-preferencias-font-list" size={6} value={value} onChange={(event) => onChange(event.target.value)}>{items.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>;
  return <Modal open={open} title="Fonte" onCancel={onCancel} centered className="config-preferencias-ambiente-font-dialog" footer={<><Button onClick={onCancel}>Cancelar</Button><Button type="primary" onClick={() => onConfirm(style)}>Ok</Button></>}>
    <div className="config-preferencias-font-top">{list(fonts, style.fonte_nome, (value) => set({ fonte_nome: value }), 'Fonte:')}{list(styles, style.fonte_estilo, (value) => set({ fonte_estilo: value }), 'Estilo da fonte:')}{list(sizes, style.fonte_tamanho, (value) => set({ fonte_tamanho: Number(value) }), 'Tamanho:')}</div>
    <div className="config-preferencias-font-bottom"><fieldset className="config-preferencias-font-effects"><legend>Efeitos</legend><Checkbox checked={style.riscado} onChange={(event) => set({ riscado: event.target.checked })}>Riscado</Checkbox><Checkbox checked={style.sublinhado} onChange={(event) => set({ sublinhado: event.target.checked })}>Sublinhado</Checkbox><label>Cor: <AmbienteColorSelect value={style.cor_texto} onChange={(value) => set({ cor_texto: value })} /></label></fieldset><div className="config-preferencias-font-example-column"><fieldset className="config-preferencias-font-example"><legend>Exemplo</legend><div className="config-preferencias-font-preview" style={previewStyle}>Enunciado</div></fieldset><label className="config-preferencias-font-script">Script:<Select value={style.script} options={scripts.map((item) => ({ value: item.id, label: item.label }))} onChange={(value) => set({ script: value })} /></label></div></div>
  </Modal>;
}
