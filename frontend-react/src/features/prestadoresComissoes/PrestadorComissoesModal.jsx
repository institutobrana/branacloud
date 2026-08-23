import { Alert, Button, Modal } from 'antd';
import { BranaModal } from '../../components/BranaModal.jsx';
import { useState } from 'react';
import { usePrestadorComissoes } from './hooks/usePrestadorComissoes.js';
import { PrestadorComissoesToolbar } from './components/PrestadorComissoesToolbar.jsx';
import { PrestadorComissoesTable } from './components/PrestadorComissoesTable.jsx';
import { PrestadorComissaoFormModal } from './components/PrestadorComissaoFormModal.jsx';
import { excluirComissao } from './prestadorComissoesApi.js';
import './prestadorComissoes.css';

export function PrestadorComissoesModal({ open, prestador, onClose }) {
  const state = usePrestadorComissoes({ open, initialPrestador: prestador });
  const [newOpen, setNewOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState('');
  const handleNewSuccess = async () => { setNewOpen(false); await state.reload(); };
  const openEdit = (id = state.selectedId) => { if (id != null) { state.setSelectedId(id); setEditId(id); } };
  const handleEditSuccess = async () => { setEditId(null); await state.reload(); };
  const handleDelete = () => { if (!state.selectedId || deleting) return; setActionError(''); setDeleteRecord(state.items.find((entry) => entry.id === state.selectedId) || null); };
  const cancelDelete = () => { if (!deleting) setDeleteRecord(null); };
  const confirmDelete = async () => {
    if (!deleteRecord || deleting) return;
    setDeleting(true);
    try {
      await excluirComissao(deleteRecord.id);
      setDeleteRecord(null);
      await state.reload();
    } catch (nextError) {
      setActionError(nextError?.message || 'Não foi possível eliminar o fator de comissão.');
    } finally { setDeleting(false); }
  };
  return (
    <BranaModal open={open} title="Configura fatores de comissão" onCancel={onClose} footer={null} width={820} rootClassName="prestador-com-modal">
      <div className="prestador-com-shell">
        <PrestadorComissoesToolbar filters={state.filters} convenios={state.convenios} prestadores={state.prestadores} selectedId={state.selectedId} deleting={deleting} onNew={() => setNewOpen(true)} onEdit={() => openEdit()} onDelete={handleDelete} onFiltersChange={(next) => state.setFilters((current) => ({ ...current, ...next }))} />
        {actionError ? <Alert type="error" message={actionError} showIcon /> : null}
        <div className="prestador-com-table-frame"><PrestadorComissoesTable items={state.items} loading={state.loading} error={state.error} selectedId={state.selectedId} onSelect={state.setSelectedId} onEdit={openEdit} /></div>
        <div className="prestador-com-footer" aria-live="polite">{state.footerLabel} <span>Duplo-clique para alterar o item desejado</span></div>
      </div>
      <PrestadorComissaoFormModal open={newOpen} filters={state.filters} convenios={state.convenios} prestadores={state.prestadores} onCancel={() => setNewOpen(false)} onSuccess={handleNewSuccess} />
      <PrestadorComissaoFormModal open={editId != null} mode="edit" item={state.items.find((entry) => entry.id === editId) || null} filters={state.filters} convenios={state.convenios} prestadores={state.prestadores} onCancel={() => setEditId(null)} onSuccess={handleEditSuccess} />
      <Modal open={Boolean(deleteRecord)} title="Eliminar fator de comissão" onCancel={cancelDelete} closable={!deleting} maskClosable={!deleting} destroyOnClose footer={[
        <Button key="cancel" onClick={cancelDelete} disabled={deleting}>Cancelar</Button>,
        <Button key="confirm" type="primary" danger onClick={() => void confirmDelete()} loading={deleting}>Confirmar</Button>,
      ]}>
        {deleteRecord ? `Deseja eliminar o fator de comissão de ${deleteRecord.prestador_nome} ?` : ''}
      </Modal>
    </BranaModal>
  );
}
