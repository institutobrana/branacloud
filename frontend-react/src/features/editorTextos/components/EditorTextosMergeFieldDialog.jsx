import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'antd';
import { BranaModal } from '../../../components/BranaModal.jsx';
import { editorTextosApi } from '../api/editorTextosApi.js';

let mergeCatalogCache = null;

function categoryName(category) {
  return typeof category === 'string' ? category : String(category?.nome || category?.name || category?.categoria || '');
}

function categoryFields(category) {
  if (Array.isArray(category?.campos)) return category.campos;
  if (Array.isArray(category?.fields)) return category.fields;
  return [];
}

function normalizeCatalog(payload) {
  const categories = Array.isArray(payload?.categorias) ? payload.categorias : [];
  const fields = Array.isArray(payload?.campos) ? payload.campos : [];
  const normalizedCategories = categories.map((category) => ({
    name: categoryName(category),
    fields: categoryFields(category),
  }));
  if (!normalizedCategories.length && fields.length) {
    const grouped = new Map();
    fields.forEach((field) => {
      const name = String(field?.categoria || field?.category || field?.grupo || '');
      if (!grouped.has(name)) grouped.set(name, []);
      grouped.get(name).push(field);
    });
    grouped.forEach((items, name) => normalizedCategories.push({ name, fields: items }));
  }
  return { categories: normalizedCategories, defaultCategory: String(payload?.categoria_padrao || ''), source: payload?.fonte || '' };
}

export function EditorTextosMergeFieldDialog({ open, onCancel, onConfirm }) {
  const [catalog, setCatalog] = useState(mergeCatalogCache);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!open || catalog) return undefined;
    let cancelled = false;
    setLoading(true);
    setError('');
    editorTextosApi.listMergeFields().then((payload) => {
      if (cancelled) return;
      const next = normalizeCatalog(payload);
      mergeCatalogCache = next;
      setCatalog(next);
    }).catch(() => {
      if (!cancelled) setError('Não foi possível carregar os campos de mesclagem.');
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [open, catalog]);

  const selectedCategory = useMemo(() => {
    if (!catalog?.categories.length) return null;
    return catalog.categories.find((item) => item.name === category)
      || catalog.categories.find((item) => item.name === catalog.defaultCategory)
      || catalog.categories[0];
  }, [catalog, category]);
  const rows = selectedCategory?.fields || [];
  const categoryRef = useRef(null);

  useEffect(() => {
    if (open) {
      setSelectedIndex(0);
      requestAnimationFrame(() => categoryRef.current?.focus());
    }
  }, [open, selectedCategory?.name]);

  const moveSelection = (delta) => setSelectedIndex((current) => Math.max(0, Math.min(rows.length - 1, current + delta)));
  const handleOk = () => {
    const field = rows[selectedIndex];
    if (field && selectedCategory) onConfirm?.({ category: selectedCategory.name, field });
  };

  return <BranaModal open={open} title="Insere campo de mesclagem" onCancel={onCancel} footer={[
    <Button key="ok" type="primary" disabled={!rows.length} onClick={handleOk}>Ok</Button>,
    <Button key="cancel" onClick={onCancel}>Cancela</Button>,
  ]} width={560} centered maskClosable={false} className="editor-textos-merge-dialog">
    <div className="editor-textos-merge-category-field">
      <label htmlFor="editor-textos-merge-category">Categoria dos campos:</label>
      <select ref={categoryRef} id="editor-textos-merge-category" aria-label="Categoria dos campos:" value={selectedCategory?.name || ''} onChange={(event) => { setCategory(event.target.value); setSelectedIndex(0); }} disabled={loading || !catalog?.categories.length}>
        {(catalog?.categories || []).map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
      </select>
    </div>
    {loading ? <div className="editor-textos-merge-status" role="status">Carregando campos...</div> : null}
    {error ? <div className="editor-textos-merge-status editor-textos-merge-error" role="alert">{error}</div> : null}
    {!loading && !error ? <div className="editor-textos-merge-table-wrap">
      <table className="editor-textos-merge-table"><thead><tr><th>Campo</th><th>Descrição</th></tr></thead><tbody>
        {rows.map((row, index) => <tr key={String(row?.token || row?.campo || row?.field || index)} tabIndex={index === selectedIndex ? 0 : -1} aria-selected={index === selectedIndex} className={index === selectedIndex ? 'is-selected' : ''} onClick={() => setSelectedIndex(index)} onKeyDown={(event) => { if (event.key === 'ArrowDown') { event.preventDefault(); moveSelection(1); } if (event.key === 'ArrowUp') { event.preventDefault(); moveSelection(-1); } if (event.key === 'Enter') event.preventDefault(); }}>
          <td>{String(row?.campo || row?.field || row?.nome || '')}</td><td>{String(row?.descricao || row?.description || '')}</td>
        </tr>)}
      </tbody></table>
    </div> : null}
  </BranaModal>;
}
