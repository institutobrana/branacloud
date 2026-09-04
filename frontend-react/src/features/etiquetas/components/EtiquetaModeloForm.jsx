import { Input, InputNumber, Select } from 'antd';
import { normalizeGeometry } from '../utils/etiquetaLayout.js';

const geometryFields = [['margem_esq', 'Margem esquerda'], ['margem_sup', 'Margem superior'], ['esp_horizontal', 'Espaço horizontal'], ['esp_vertical', 'Espaço vertical']];
export function EtiquetaModeloForm({ values, files, patterns, onChange }) {
  const pattern = values.padrao_id == null ? 'user-defined' : String(values.padrao_id);
  const selectPattern = (value) => {
    const id = value === 'user-defined' ? null : Number(value);
    const geometry = id == null ? {} : normalizeGeometry(patterns.find((item) => Number(item.id) === id));
    onChange({ padrao_id: id, ...geometry });
  };
  return <div className="etiqueta-modelo-form"><div className="etiqueta-modelo-top-row"><label>Nome<Input value={values.nome} onChange={(e) => onChange('nome', e.target.value)} /></label><label>Arquivo de modelo<Select value={values.modelo_documento_id} options={files.map((f) => ({ value: f.id, label: f.nome_arquivo || f.nome }))} onChange={(v) => onChange('modelo_documento_id', v)} /></label></div><label>Padrão de etiqueta<Select value={pattern} options={[{ value: 'user-defined', label: 'Definido pelo usuário' }, ...patterns.map((p) => ({ value: String(p.id), label: p.nome }))]} onChange={selectPattern} /></label><div className="etiqueta-modelo-geometry">{geometryFields.map(([key, label]) => <label key={key}>{label}<span className="etiqueta-dotted-leader" /><InputNumber value={values[key]} min={0} step={0.1} precision={2} onChange={(v) => onChange(key, v ?? 0)} /><small>mm</small></label>)}</div><div className="etiqueta-modelo-grid-row"><label>Etiquetas por linha<InputNumber value={values.nro_colunas} min={1} precision={0} onChange={(v) => onChange('nro_colunas', v ?? 1)} /></label><label>Linhas por página<InputNumber value={values.nro_linhas} min={1} precision={0} onChange={(v) => onChange('nro_linhas', v ?? 1)} /></label></div></div>;
}
