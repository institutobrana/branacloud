import { useMemo, useState } from 'react';
import { OPEN_TYPE_OPTIONS, matchesOpenType, NEW_TEXT_TYPES } from '../models/editorTextosModalModels.js';
import { canReplaceSaveAsCollision } from '../models/saveAsNameCollision.js';
import './EditorTextosDocumentDialogs.css';

function modelLabel(item) { return item?.nome_exibicao || item?.nome || item?.nome_arquivo || 'Sem nome'; }

export function EditorTextosOpenDialog({ items, loading = false, error = '', onClose, onRefresh, onOpen, onRename, onDelete, onProperties }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [renameVisible, setRenameVisible] = useState(false);
  const [renameName, setRenameName] = useState('');
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const filteredItems = useMemo(() => items.filter((item) => {
    const term = query.trim().toLowerCase();
    return (!term || [modelLabel(item), item?.tipo_modelo, item?.nome_arquivo].some((value) => String(value || '').toLowerCase().includes(term))) && matchesOpenType(item, type);
  }), [items, query, type]);
  const selected = filteredItems.find((item) => String(item.id) === String(selectedId));
  const openSelected = () => { if (selectedId) onOpen(selectedId); };
  const canAlter = Boolean(selected && !selected.sistema);
  const startRename = () => {
    if (!canAlter) return;
    setActionError('');
    setActionSuccess('');
    setRenameName(modelLabel(selected));
    setRenameVisible(true);
  };
  const commitRename = async () => {
    const name = renameName.trim();
    if (!selected || !name) { setActionError('Informe um nome válido.'); return; }
    setActionLoading(true);
    setActionError('');
    try {
      await onRename(selected, name);
      setRenameVisible(false);
      setActionSuccess('Modelo renomeado com sucesso.');
    } catch (renameError) {
      setActionError(renameError?.message || 'Não foi possível renomear o modelo.');
    } finally { setActionLoading(false); }
  };
  const confirmDelete = async () => {
    if (!selected || !canAlter) return;
    setActionLoading(true);
    setActionError('');
    try {
      await onDelete(selected);
      setDeleteVisible(false);
      setSelectedId(null);
      setActionSuccess('Modelo eliminado com sucesso.');
    } catch (deleteError) {
      setActionError(deleteError?.message || 'Não foi possível excluir o modelo.');
    } finally { setActionLoading(false); }
  };
  return <div className="editor-textos-dialog-backdrop" role="presentation" onClick={(event) => event.target === event.currentTarget && onClose()}>
    <section className="editor-textos-dialog editor-textos-open-dialog" role="dialog" aria-modal="true" aria-labelledby="editor-open-title">
      <h2 id="editor-open-title">Abrir modelo</h2>
      <div className="editor-textos-open-filters">
        <label>Nome:<input aria-label="Nome" placeholder="Pesquisar por nome" value={query} onChange={(event) => { setQuery(event.target.value); setSelectedId(null); }} /></label>
        <label>Tipo:<select aria-label="Tipo" value={type} onChange={(event) => { setType(event.target.value); setSelectedId(null); }}>{OPEN_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        <button type="button" onClick={onRefresh} disabled={loading}>{loading ? 'Carregando...' : 'Atualiza'}</button>
      </div>
      {error && <div role="alert" className="editor-textos-dialog-error">{error}</div>}
      {actionError && <div role="alert" className="editor-textos-dialog-error">{actionError}</div>}{actionSuccess && <div role="status" className="editor-textos-dialog-success">{actionSuccess}</div>}
      <div className="editor-textos-model-grid" role="region" aria-label="Modelos"><table><thead><tr><th>Nome</th><th>Tipo</th><th>Origem</th></tr></thead><tbody>
        {!filteredItems.length && <tr><td colSpan="3">Nenhum modelo encontrado.</td></tr>}
        {filteredItems.map((item) => <tr key={item.id} className={String(item.id) === String(selectedId) ? 'is-selected' : ''} onClick={() => { setSelectedId(item.id); setActionError(''); setActionSuccess(''); }} onDoubleClick={openSelected}><td>{modelLabel(item)}</td><td>{item.tipo_modelo || '—'}</td><td>{item.sistema ? 'Base' : 'Clínica'}</td></tr>)}
      </tbody></table></div>
      <div className="editor-textos-dialog-actions editor-textos-open-actions">
        <div className="editor-textos-open-actions__right"><button type="button" disabled={!selected || loading || actionLoading} onClick={openSelected}>Abrir</button><button type="button" disabled={!canAlter || loading || actionLoading} onClick={startRename}>Renomear</button><button type="button" className="is-danger" disabled={!canAlter || loading || actionLoading} onClick={() => { setActionError(''); setDeleteVisible(true); }}>Eliminar</button><button type="button" disabled={actionLoading} onClick={onClose}>Cancelar</button></div>
      </div>
    </section>
    {renameVisible && selected && <div className="editor-textos-dialog-backdrop editor-textos-dialog-backdrop--nested" role="presentation"><section className="editor-textos-dialog editor-textos-rename-dialog" role="dialog" aria-modal="true" aria-labelledby="editor-rename-title"><h2 id="editor-rename-title">Renomear modelo</h2><label>Novo nome<input aria-label="Novo nome do modelo" autoFocus value={renameName} onChange={(event) => setRenameName(event.target.value)} maxLength={180} /></label>{actionError && <div role="alert" className="editor-textos-dialog-error">{actionError}</div>}<div className="editor-textos-dialog-actions"><button type="button" disabled={actionLoading} onClick={() => { setRenameVisible(false); setActionError(''); }}>Cancelar</button><button type="button" disabled={!renameName.trim() || actionLoading} onClick={() => void commitRename()}>{actionLoading ? 'Salvando…' : 'Salvar nome'}</button></div></section></div>}
    {deleteVisible && selected && <div className="editor-textos-dialog-backdrop editor-textos-dialog-backdrop--nested" role="presentation"><section className="editor-textos-dialog editor-textos-delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby="editor-delete-title" aria-describedby="editor-delete-description"><h2 id="editor-delete-title">Eliminar modelo</h2><p id="editor-delete-description">Deseja realmente eliminar o modelo <strong>“{modelLabel(selected)}”</strong>? Esta operação é permanente e também remove o arquivo associado.</p>{actionError && <div role="alert" className="editor-textos-dialog-error">{actionError}</div>}<div className="editor-textos-dialog-actions"><button type="button" disabled={actionLoading} onClick={() => { setDeleteVisible(false); setActionError(''); }}>Cancelar</button><button type="button" className="is-danger" disabled={actionLoading} onClick={() => void confirmDelete()}>{actionLoading ? 'Eliminando…' : 'Eliminar'}</button></div></section></div>}
  </div>;
}

export function EditorTextosNewTextDialog({ initialType = 'receita', onClose, onOpenExisting, onCreate }) {
  const [mode, setMode] = useState('type');
  const [type, setType] = useState(initialType);
  return <div className="editor-textos-dialog-backdrop" role="presentation" onClick={(event) => event.target === event.currentTarget && onClose()}><section className="editor-textos-dialog editor-textos-new-dialog" role="dialog" aria-modal="true" aria-labelledby="editor-new-title"><h2 id="editor-new-title">Novo texto</h2><label className="editor-textos-new-option"><input type="radio" name="editor-textos-new-mode" checked={mode === 'open'} onChange={() => setMode('open')} />Abrir um texto já existente...</label><label className="editor-textos-new-option"><input type="radio" name="editor-textos-new-mode" checked={mode === 'type'} onChange={() => setMode('type')} />Criar um novo texto do tipo:</label><select aria-label="Tipo de novo texto" size="5" value={type} disabled={mode === 'open'} onChange={(event) => setType(event.target.value)}>{NEW_TEXT_TYPES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><div className="editor-textos-dialog-actions"><button type="button" onClick={onClose}>Cancela</button><button type="button" onClick={() => mode === 'open' ? onOpenExisting() : onCreate(type)}>Ok</button></div></section></div>;
}

export function EditorTextosSaveAsDialog({ initialName, error = '', loading = false, onClose, onSave }) {
  const [name, setName] = useState(initialName || 'Novo documento');
  return <div className="editor-textos-dialog-backdrop" role="presentation"><section className="editor-textos-dialog" role="dialog" aria-modal="true" aria-labelledby="editor-save-as-title"><h2 id="editor-save-as-title">Salvar como</h2><input aria-label="Nome do documento" value={name} onChange={(event) => setName(event.target.value)} />{error && <div role="alert" className="editor-textos-dialog-error">{error}</div>}<div className="editor-textos-dialog-actions"><button type="button" disabled={loading} onClick={onClose}>Cancelar</button><button type="button" disabled={!name.trim() || loading} onClick={() => onSave(name.trim())}>{loading ? 'Salvando…' : 'Salvar'}</button></div></section></div>;
}

export function EditorTextosNameCollisionDialog({ name, models = [], loading = false, onReplace, onChooseAnother, onCancel }) {
  const replaceable = models.filter(canReplaceSaveAsCollision);
  const [selectedId, setSelectedId] = useState(() => String(replaceable[0]?.id || ''));
  const selected = replaceable.find((item) => String(item.id) === selectedId) || null;
  const label = (item) => `${item?.nome_exibicao || item?.nome || name} — ${item?.tipo_modelo || 'outros'}${item?.sistema ? ' (sistema)' : ''}`;
  return <div className="editor-textos-dialog-backdrop editor-textos-dialog-backdrop--nested" role="presentation"><section className="editor-textos-dialog editor-textos-collision-dialog" role="alertdialog" aria-modal="true" aria-labelledby="editor-collision-title" aria-describedby="editor-collision-description"><h2 id="editor-collision-title">Modelo já existente</h2><p id="editor-collision-description">Já existe um modelo com este nome. Deseja substituir o modelo existente ou escolher outro nome?</p>{models.length > 1 && <label className="editor-textos-collision-target">Modelo a substituir<select aria-label="Modelo a substituir" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>{models.map((item) => <option key={item.id} value={String(item.id)} disabled={item.sistema === true}>{label(item)}</option>)}</select></label>}{replaceable.length === 0 && <div role="note" className="editor-textos-dialog-error">O nome corresponde apenas a modelo do sistema, que não pode ser substituído. Escolha outro nome.</div>}<div className="editor-textos-dialog-actions"><button type="button" disabled={loading} onClick={onCancel}>Cancelar</button><button type="button" disabled={loading} onClick={onChooseAnother}>Escolher outro nome</button><button type="button" disabled={!selected || loading} onClick={() => onReplace(selected)}>{loading ? 'Substituindo…' : 'Substituir'}</button></div></section></div>;
}
