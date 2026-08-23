import { Alert, Button, Modal } from 'antd';
import { useState } from 'react';
import { BranaModal } from '../../components/BranaModal.jsx';
import { PrestadorCredenciamentosToolbar } from './components/PrestadorCredenciamentosToolbar.jsx';
import { PrestadorCredenciamentosTable } from './components/PrestadorCredenciamentosTable.jsx';
import { usePrestadorCredenciamentos } from './hooks/usePrestadorCredenciamentos.js';
import { CredenciamentoModal } from './components/CredenciamentoModal.jsx';
import { excluirCredenciamento } from './prestadorCredenciamentosApi.js';
import './prestadorCredenciamentos.css';

export function PrestadorCredenciamentosModal({ open, prestador, onClose }) {
  const state = usePrestadorCredenciamentos({ open, initialPrestador: prestador });
  const [newOpen, setNewOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState('');
  const [deleteConfirmRecord, setDeleteConfirmRecord] = useState(null);
  const handleNewSuccess = async () => {
    setNewOpen(false);
    await state.reload();
  };
  const openEdit = (record = state.selectedItem) => {
    if (record) setEditRecord(record);
  };
  const handleEditSuccess = async () => {
    setEditRecord(null);
    await state.reload();
  };
  const handleDelete = () => {
    const item = state.selectedItem;
    if (!item || deleting) return;
    setActionError('');
    setDeleteConfirmRecord(item);
  };
  const cancelDelete = () => {
    if (!deleting) setDeleteConfirmRecord(null);
  };
  const confirmDelete = async () => {
    if (!deleteConfirmRecord || deleting) return;
    setDeleting(true);
    try {
      await excluirCredenciamento(deleteConfirmRecord.id);
      setDeleteConfirmRecord(null);
      await state.reload();
    } catch (nextError) {
      setActionError(nextError?.message || 'Não foi possível eliminar o credenciamento.');
    } finally {
      setDeleting(false);
    }
  };
  return (
    <BranaModal open={open} title="Cadastro de credenciamentos" onCancel={onClose} footer={null} width={820} rootClassName="prestador-cred-modal">
      <div className="prestador-cred-shell">
        <PrestadorCredenciamentosToolbar filters={state.filters} convenios={state.convenios} prestadores={state.prestadores} selectedId={state.selectedId} deleting={deleting} onFiltersChange={(next) => state.setFilters((current) => ({ ...current, ...next }))} onNew={() => setNewOpen(true)} onEdit={() => openEdit()} onDelete={handleDelete} />
        {actionError ? <Alert type="error" message={actionError} showIcon /> : null}
        <div className="prestador-cred-table-frame"><PrestadorCredenciamentosTable items={state.items} loading={state.loading} error={state.error} selectedId={state.selectedId} onSelect={state.setSelectedId} onDoubleClick={openEdit} /></div>
        <div className="prestador-cred-footer" aria-live="polite">{state.footerLabel} <span>Duplo-clique para alterar o credenciamento desejado</span></div>
      </div>
      <CredenciamentoModal open={newOpen} initialPrestador={prestador} convenios={state.convenios} prestadores={state.prestadores} onCancel={() => setNewOpen(false)} onSuccess={handleNewSuccess} />
      <CredenciamentoModal open={Boolean(editRecord)} mode="edit" record={editRecord} convenios={state.convenios} prestadores={state.prestadores} onCancel={() => setEditRecord(null)} onSuccess={handleEditSuccess} />
      <Modal
        open={Boolean(deleteConfirmRecord)}
        title="Eliminar credenciamento"
        onCancel={cancelDelete}
        closable={!deleting}
        maskClosable={!deleting}
        destroyOnClose
        footer={[
          <Button key="cancel" onClick={cancelDelete} disabled={deleting}>Cancela</Button>,
          <Button key="confirm" type="primary" danger onClick={() => void confirmDelete()} loading={deleting}>Ok</Button>,
        ]}
      >
        {deleteConfirmRecord ? `Deseja eliminar o credenciamento ${deleteConfirmRecord.codigo} ?` : ''}
      </Modal>
    </BranaModal>
  );
}
