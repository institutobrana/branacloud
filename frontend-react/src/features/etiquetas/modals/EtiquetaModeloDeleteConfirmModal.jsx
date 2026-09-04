import { Modal } from 'antd';

export function EtiquetaModeloDeleteConfirmModal({ model, onCancel, onDeleted }) {
  const confirmDelete = async () => {
    if (!model || !onDeleted) return;
    await onDeleted(model);
  };
  return (
    <Modal open={Boolean(model)} title="Eliminar modelo de etiqueta" centered onCancel={onCancel} maskClosable footer={[
      <button key="cancel" type="button" className="etiqueta-modal-cancel" onClick={onCancel}>Cancelar</button>,
      <button key="confirm" type="button" className="etiqueta-modal-ok" onClick={() => void confirmDelete()}>Confirmar</button>,
    ]}>
      {model ? <p>Deseja eliminar o modelo de etiqueta <strong>{model.nome}</strong>?</p> : null}
    </Modal>
  );
}
