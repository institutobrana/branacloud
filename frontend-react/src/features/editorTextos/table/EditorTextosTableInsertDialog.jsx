import { useEffect, useState } from 'react';

const DEFAULTS = { rows: 1, cols: 1, borderVisible: true };
const MAX = 999;

function valid(value) { return Number.isInteger(value) && value >= 1 && value <= MAX; }

export function EditorTextosTableInsertDialog({ open, onCancel, onInsert }) {
  const [values, setValues] = useState(DEFAULTS);
  useEffect(() => { if (open) setValues(DEFAULTS); }, [open]);
  if (!open) return null;
  const updateNumber = (key, raw) => setValues(current => ({ ...current, [key]: raw === '' ? '' : Number(raw) }));
  const submit = (event) => {
    event.preventDefault();
    if (!valid(values.rows) || !valid(values.cols)) return;
    if (values.rows * values.cols > 400 && !window.confirm('Esta tabela é grande e pode consumir muitos recursos. Deseja continuar?')) return;
    onInsert({ rows: values.rows, cols: values.cols, borderVisible: values.borderVisible });
  };
  return <div className="editor-textos-dialog-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onCancel(); }}>
    <form className="editor-textos-dialog editor-textos-table-dialog" role="dialog" aria-modal="true" aria-labelledby="editor-table-dialog-title" onSubmit={submit} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); onCancel(); } }}>
      <h2 id="editor-table-dialog-title">Insere tabela</h2>
      <label>Nº de colunas<input aria-label="Nº de colunas" type="number" min="1" max="999" step="1" value={values.cols} onChange={event => updateNumber('cols', event.target.value)} /></label>
      <label>Nº de linhas<input aria-label="Nº de linhas" type="number" min="1" max="999" step="1" value={values.rows} onChange={event => updateNumber('rows', event.target.value)} /></label>
      <label className="editor-textos-new-option"><input type="checkbox" checked={values.borderVisible} onChange={event => setValues(current => ({ ...current, borderVisible: event.target.checked }))} />Borda visível</label>
      <div className="editor-textos-dialog-actions"><button type="button" onClick={onCancel}>Cancela</button><button type="submit" disabled={!valid(values.rows) || !valid(values.cols)}>Ok</button></div>
    </form>
  </div>;
}
