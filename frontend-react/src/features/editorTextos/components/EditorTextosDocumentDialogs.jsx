import { useMemo, useState } from 'react';
import { OPEN_TYPE_OPTIONS, matchesOpenType, NEW_TEXT_TYPES } from '../models/editorTextosModalModels.js';

function modelLabel(item) { return item?.nome_exibicao || item?.nome || item?.nome_arquivo || 'Sem nome'; }

export function EditorTextosOpenDialog({ items, loading = false, error = '', onClose, onRefresh, onOpen, onRename, onDelete, onProperties }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [contextId, setContextId] = useState(null);
  const filteredItems = useMemo(() => items.filter((item) => {
    const term = query.trim().toLowerCase();
    return (!term || [modelLabel(item), item?.tipo_modelo, item?.nome_arquivo].some((value) => String(value || '').toLowerCase().includes(term))) && matchesOpenType(item, type);
  }), [items, query, type]);
  const selected = items.find((item) => String(item.id) === String(selectedId));
  const openSelected = () => { if (selectedId) onOpen(selectedId); };
  const contextItem = items.find((item) => String(item.id) === String(contextId));
  const canAlter = Boolean(contextItem && !contextItem.sistema);
  return <div className="editor-textos-dialog-backdrop" role="presentation" onClick={(event) => event.target === event.currentTarget && onClose()}>
    <section className="editor-textos-dialog editor-textos-open-dialog" role="dialog" aria-modal="true" aria-labelledby="editor-open-title">
      <h2 id="editor-open-title">Abrir modelo</h2>
      <div className="editor-textos-open-filters">
        <label>Nome:<input aria-label="Nome" placeholder="Pesquisar por nome" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <label>Tipo:<select aria-label="Tipo" value={type} onChange={(event) => setType(event.target.value)}>{OPEN_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        <button type="button" onClick={onRefresh} disabled={loading}>{loading ? 'Carregando...' : 'Atualiza'}</button>
      </div>
      {error && <div role="alert" className="editor-textos-dialog-error">{error}</div>}
      <div className="editor-textos-model-grid" role="region" aria-label="Modelos"><table><thead><tr><th>Nome</th><th>Tipo</th><th>Origem</th></tr></thead><tbody>
        {!filteredItems.length && <tr><td colSpan="3">Nenhum modelo encontrado.</td></tr>}
        {filteredItems.map((item) => <tr key={item.id} className={String(item.id) === String(selectedId) ? 'is-selected' : ''} onClick={() => { setSelectedId(item.id); setContextId(null); }} onDoubleClick={openSelected} onContextMenu={(event) => { event.preventDefault(); setSelectedId(item.id); setContextId(item.id); }}><td>{modelLabel(item)}</td><td>{item.tipo_modelo || '—'}</td><td>{item.sistema ? 'Base' : 'Clínica'}</td></tr>)}
      </tbody></table></div>
      {contextItem && <div className="editor-textos-model-context" role="menu" aria-label="Ações do modelo"><button type="button" onClick={openSelected}>Abrir</button><button type="button" disabled={!canAlter} onClick={() => onRename(contextItem)}>Renomear</button><button type="button" disabled={!canAlter} onClick={() => onDelete(contextItem)}>Excluir</button><button type="button" onClick={() => onProperties(contextItem)}>Propriedades</button></div>}
      <div className="editor-textos-dialog-actions"><button type="button" onClick={onClose}>Cancela</button><button type="button" disabled={!selected || loading} onClick={openSelected}>Ok</button></div>
    </section>
  </div>;
}

export function EditorTextosNewTextDialog({ initialType = 'receita', onClose, onOpenExisting, onCreate }) {
  const [mode, setMode] = useState('type');
  const [type, setType] = useState(initialType);
  return <div className="editor-textos-dialog-backdrop" role="presentation" onClick={(event) => event.target === event.currentTarget && onClose()}><section className="editor-textos-dialog editor-textos-new-dialog" role="dialog" aria-modal="true" aria-labelledby="editor-new-title"><h2 id="editor-new-title">Novo texto</h2><label className="editor-textos-new-option"><input type="radio" name="editor-textos-new-mode" checked={mode === 'open'} onChange={() => setMode('open')} />Abrir um texto já existente...</label><label className="editor-textos-new-option"><input type="radio" name="editor-textos-new-mode" checked={mode === 'type'} onChange={() => setMode('type')} />Criar um novo texto do tipo:</label><select aria-label="Tipo de novo texto" size="5" value={type} disabled={mode === 'open'} onChange={(event) => setType(event.target.value)}>{NEW_TEXT_TYPES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><div className="editor-textos-dialog-actions"><button type="button" onClick={onClose}>Cancela</button><button type="button" onClick={() => mode === 'open' ? onOpenExisting() : onCreate(type)}>Ok</button></div></section></div>;
}

export function EditorTextosSaveAsDialog({ initialName, onClose, onSave }) {
  const [name, setName] = useState(initialName || 'Novo documento');
  return <div className="editor-textos-dialog-backdrop" role="presentation"><section className="editor-textos-dialog" role="dialog" aria-modal="true" aria-labelledby="editor-save-as-title"><h2 id="editor-save-as-title">Salvar como</h2><input aria-label="Nome do documento" value={name} onChange={(event) => setName(event.target.value)} /><div className="editor-textos-dialog-actions"><button type="button" onClick={onClose}>Cancelar</button><button type="button" disabled={!name.trim()} onClick={() => onSave(name.trim())}>Salvar</button></div></section></div>;
}
