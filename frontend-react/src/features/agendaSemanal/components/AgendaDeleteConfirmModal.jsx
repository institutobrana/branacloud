import { Modal } from 'antd';

export function AgendaDeleteConfirmModal({ open, event, label, submitting = false, error = '', onConfirm, onCancel }) {
  const name = label || event?.extendedProps?.metadata?.nome || event?.extendedProps?.patientName || event?.title || 'Sem nome';
  return (
    <Modal
      open={open}
      title="Eliminar agendamento"
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Eliminar"
      cancelText="Cancelar"
      okButtonProps={{ danger: true, loading: submitting }}
      cancelButtonProps={{ disabled: submitting }}
      maskClosable={false}
      centered
    >
      <p>Deseja eliminar o agendamento de '{name}'?</p>
      {error ? <div role="alert">{error}</div> : null}
    </Modal>
  );
}
