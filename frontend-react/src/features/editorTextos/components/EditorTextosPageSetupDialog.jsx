import { useEffect, useState } from 'react';
import { applyPagePreset, DEFAULT_PAGE_CONFIG, formatPageMm, normalizePageConfig, PAGE_PAPER_PRESETS, parsePageMm, togglePageOrientation, validatePageConfig } from '../models/pageConfig.js';

const fields = [['altura_mm', 'Altura'], ['largura_mm', 'Largura'], ['margem_superior_mm', 'Margem superior'], ['margem_esquerda_mm', 'Margem esquerda'], ['margem_direita_mm', 'Margem direita']];

export function EditorTextosPageSetupDialog({ pageConfig, onClose, onApply }) {
  const [draft, setDraft] = useState(() => normalizePageConfig(pageConfig || DEFAULT_PAGE_CONFIG));
  const [error, setError] = useState('');
  useEffect(() => setDraft(normalizePageConfig(pageConfig || DEFAULT_PAGE_CONFIG)), [pageConfig]);
  const commit = () => {
    const base = pageConfig || DEFAULT_PAGE_CONFIG;
    const normalized = normalizePageConfig({ ...draft, altura_mm: parsePageMm(draft.altura_mm, base.altura_mm), largura_mm: parsePageMm(draft.largura_mm, base.largura_mm), margem_superior_mm: parsePageMm(draft.margem_superior_mm, base.margem_superior_mm), margem_esquerda_mm: parsePageMm(draft.margem_esquerda_mm, base.margem_esquerda_mm), margem_direita_mm: parsePageMm(draft.margem_direita_mm, base.margem_direita_mm) });
    const validation = validatePageConfig(normalized);
    if (validation) { setError(validation); return; }
    onApply(normalized);
  };
  return <div className="editor-textos-dialog-backdrop" role="presentation" onClick={(event) => event.target === event.currentTarget && onClose()}><section className="editor-textos-dialog editor-textos-page-setup-dialog" role="dialog" aria-modal="true" aria-labelledby="editor-page-setup-title"><h2 id="editor-page-setup-title">Configura página</h2><div className="editor-textos-page-setup-form"><label>Tipo do papel<select aria-label="Tipo do papel" value={draft.tipo_papel} onChange={(event) => setDraft((current) => applyPagePreset(current, event.target.value))}>{Object.keys(PAGE_PAPER_PRESETS).map((type) => <option key={type} value={type}>{type}</option>)}</select></label><label>Orientação<select aria-label="Orientação" value={draft.orientacao} onChange={(event) => setDraft((current) => togglePageOrientation(current, event.target.value))}><option>Retrato</option><option>Paisagem</option></select></label>{fields.map(([key, label]) => <label key={key}>{label}<span className="editor-textos-page-setup-input"><input aria-label={label} value={typeof draft[key] === 'number' ? formatPageMm(draft[key]) : draft[key]} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))} /><small>mm</small></span></label>)}</div>{error && <div role="alert" className="editor-textos-dialog-error">{error}</div>}<div className="editor-textos-dialog-actions"><button type="button" onClick={onClose}>Cancela</button><button type="button" onClick={commit}>Ok</button></div></section></div>;
}
