import { useEffect, useRef, useState } from 'react';
import { Modal, message } from 'antd';
import { AgendaContatosTable } from './components/AgendaContatosTable.jsx';
import { AgendaContatosModal } from './components/AgendaContatosModal.jsx';
import { useAgendaContatos } from './hooks/useAgendaContatos.js';
import { deleteAgendaContato } from './api/agendaContatosApi.js';
import './agendaContatos.css';

export function AgendaContatosPage() {
  const state = useAgendaContatos();
  const [modalState, setModalState] = useState({ open: false, mode: 'new', contact: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const deleteInFlightRef = useRef(false);
  const openEditContato = (contact) => {
    if (!contact) return;
    state.setSelectedId(Number(contact.id) || null);
    setModalState({ open: true, mode: 'edit', contact });
  };
  useEffect(() => {
    const onPending = (event) => {
      if (event.detail?.action === 'novo') setModalState({ open: true, mode: 'new', contact: null });
      if (event.detail?.action === 'altera' && state.selectedId) {
        const contact = state.items.find((item) => Number(item.id) === Number(state.selectedId));
        if (contact) openEditContato(contact);
      }
      if (event.detail?.action === 'elimina' && state.selectedId) {
        const contact = state.items.find((item) => Number(item.id) === Number(state.selectedId));
        if (contact) requestDeleteContato(contact);
      }
    };
    window.addEventListener('brana-agenda-contatos-pending', onPending);
    return () => window.removeEventListener('brana-agenda-contatos-pending', onPending);
  }, [state.items, state.selectedId]);
  const requestDeleteContato = (contact) => {
    if (!contact || deleteInFlightRef.current) return;
    setDeleteConfirm(contact);
  };
  const cancelDeleteContato = () => {
    if (!isDeleting) setDeleteConfirm(null);
  };
  const confirmDeleteContato = async () => {
    const contact = deleteConfirm;
    if (!contact || deleteInFlightRef.current) return;
    deleteInFlightRef.current = true;
    setIsDeleting(true);
    try {
      await deleteAgendaContato(contact.id);
      setDeleteConfirm(null);
      if (modalState.mode === 'edit' && Number(modalState.contact?.id) === Number(contact.id)) closeModal();
      await state.reload();
      message.success('Contato eliminado.');
    } catch (error) {
      message.error(error?.message || 'Falha ao eliminar contato.');
    } finally {
      deleteInFlightRef.current = false;
      setIsDeleting(false);
    }
  };
  const closeModal = () => setModalState({ open: false, mode: 'new', contact: null });
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('brana-agenda-contatos-state', { detail: { types: state.types, tipo: state.tipo, busca: state.busca, selectedId: state.selectedId } }));
  }, [state.types, state.tipo, state.busca, state.selectedId]);
  return (
    <section className="agenda-contatos-page" aria-label="Agenda de contatos">
      <AgendaContatosTable items={state.visibleItems} selectedId={state.selectedId} loading={state.loading} error={state.error} onRetry={state.reload} onSelect={state.setSelectedId} onDoubleClick={openEditContato} />
      <AgendaContatosModal open={modalState.open} mode={modalState.mode} contact={modalState.contact} isDeleting={isDeleting} onDelete={requestDeleteContato} onClose={closeModal} onCreated={(created) => state.reload(created?.id)} onUpdated={(updated) => { state.setSelectedId(updated?.id || modalState.contact?.id); return state.reload(updated?.id || modalState.contact?.id); }} />
      <Modal
        open={Boolean(deleteConfirm)}
        title="Eliminar contato"
        onCancel={cancelDeleteContato}
        onOk={() => void confirmDeleteContato()}
        okText="Eliminar"
        okType="danger"
        cancelText="Cancelar"
        confirmLoading={isDeleting}
        cancelButtonProps={{ disabled: isDeleting }}
        maskClosable={false}
        centered
      >
        Deseja eliminar o contato '{String(deleteConfirm?.nome || '').trim()}'?
      </Modal>
    </section>
  );
}
