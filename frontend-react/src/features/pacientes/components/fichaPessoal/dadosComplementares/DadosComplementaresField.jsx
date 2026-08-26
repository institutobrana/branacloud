import { AutoComplete, Input, Select } from 'antd';

export function ComplementaryTextField({ label, value, onChange, className = '', onBlur, onKeyDown }) {
  return <label className={`ficha-dados-field ${className}`}><span>{label}</span><Input value={value} onChange={(event) => onChange(event.target.value)} onBlur={onBlur} onKeyDown={onKeyDown} /></label>;
}

export function ComplementaryNameField({ label, value, onChange, className = '', suggestions = [], loading = false, onSearch, onSelect }) {
  return <label className={`ficha-dados-field ${className}`}><span>{label}</span><AutoComplete value={value} options={suggestions.map((item) => ({ key: item.id, value: item.nome_completo, label: item.nome_completo, item }))} loading={loading} onChange={onChange} onSearch={onSearch} onSelect={(next, option) => onSelect?.(option.item) || onChange(next)} /></label>;
}

export function ComplementarySelectField({ label, value, options = [], onChange, className = '', loading = false, allowClear = false }) {
  const values = Array.isArray(options) ? options : [];
  return <label className={`ficha-dados-field ${className}`}><span>{label}</span><Select value={value || undefined} options={values.map((item) => ({ value: item, label: item }))} loading={loading} placeholder="Selecione..." allowClear={allowClear} onChange={(next) => onChange?.(next ?? '')} /></label>;
}
