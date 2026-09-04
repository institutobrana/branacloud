import { Alert, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useEtiquetasModelos } from '../hooks/useEtiquetasModelos.js';
import { EtiquetasTable } from './EtiquetasTable.jsx';
import { EtiquetaModeloModal } from '../modals/EtiquetaModeloModal.jsx';
import { EtiquetasToolbar } from './EtiquetasToolbar.jsx';
import { EtiquetaTestePreviewModal } from '../modals/EtiquetaTestePreviewModal.jsx';
import { EtiquetaModeloDeleteConfirmModal } from '../modals/EtiquetaModeloDeleteConfirmModal.jsx';
import { excluirEtiquetaModelo } from '../api/etiquetasApi.js';
import '../styles/etiquetas.css';

export function EtiquetasPage() {
  const [reloadToken, setReloadToken] = useState(0);
  const { modelos, loading, error } = useEtiquetasModelos(reloadToken);
  const [selectedId, setSelectedId] = useState(null); const [newOpen, setNewOpen] = useState(false); const [editModel, setEditModel] = useState(null); const [testModel, setTestModel] = useState(null); const [deleteModel, setDeleteModel] = useState(null);
  const selectedModel = modelos.find((item) => Number(item.id) === Number(selectedId)) || null;
  const openEdit = (model) => { if (model) { setSelectedId(model.id); setEditModel(model); } };
  const selectModel = (id) => { setSelectedId(id); window.dispatchEvent(new CustomEvent('brana-etiquetas-selection-change', { detail: { hasSelection: id != null } })); };
  useEffect(() => { const onEditRequest = () => openEdit(selectedModel); const onTestRequest = () => setTestModel(selectedModel); const onDeleteRequest = () => setDeleteModel(selectedModel); window.addEventListener('brana-etiquetas-edit-request', onEditRequest); window.addEventListener('brana-etiquetas-test-request', onTestRequest); window.addEventListener('brana-etiquetas-delete-request', onDeleteRequest); return () => { window.removeEventListener('brana-etiquetas-edit-request', onEditRequest); window.removeEventListener('brana-etiquetas-test-request', onTestRequest); window.removeEventListener('brana-etiquetas-delete-request', onDeleteRequest); }; }, [selectedModel]);
  useEffect(() => { const open = () => setNewOpen(true); window.addEventListener('brana-etiquetas-new', open); return () => window.removeEventListener('brana-etiquetas-new', open); }, []);
  return (
    <main className="etiquetas-page" aria-label="Configuração de modelos de etiqueta">
      {error ? <Alert type="error" showIcon message="Não foi possível carregar os modelos de etiqueta." /> : null}
      {loading ? <div className="etiquetas-loading"><Spin tip="Carregando modelos..." /></div> : <EtiquetasTable modelos={modelos} loading={false} selectedId={selectedId} onSelect={selectModel} onDoubleClickEdit={openEdit} />}
      <EtiquetaModeloModal open={newOpen} mode="create" onCancel={() => setNewOpen(false)} onCreated={() => { setNewOpen(false); setReloadToken((value) => value + 1); }} />
      <EtiquetaModeloModal open={Boolean(editModel)} mode="edit" model={editModel} onCancel={() => setEditModel(null)} onUpdated={() => { setEditModel(null); setReloadToken((value) => value + 1); }} />
      <EtiquetaTestePreviewModal model={testModel} onClose={() => setTestModel(null)} />
      <EtiquetaModeloDeleteConfirmModal model={deleteModel} onCancel={() => setDeleteModel(null)} onDeleted={async (model) => { await excluirEtiquetaModelo(model.id); setDeleteModel(null); setSelectedId(null); setReloadToken((value) => value + 1); }} />
    </main>
  );
}
