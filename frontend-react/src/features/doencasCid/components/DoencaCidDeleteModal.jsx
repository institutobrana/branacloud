import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';

export function DoencaCidDeleteModal({
  open,
  loading,
  item,
  onConfirm,
  onCancel,
}) {
  const codigo = String(item?.codigo || '').trim();
  const descricao = String(item?.descricao || '').trim();
  const messageText = codigo
    ? `Deseja realmente excluir a doença ${codigo}?`
    : descricao
      ? `Deseja realmente excluir a doença ${descricao}?`
      : 'Deseja realmente excluir a doença selecionada?';

  return (
    <Modal
      open={open}
      centered
      width={420}
      destroyOnClose
      onCancel={onCancel}
      footer={null}
      title="Excluir doença (CID)"
      className="doencas-cid-delete-modal"
      maskClosable={!loading}
      closable={!loading}
    >
      <div className="doencas-cid-delete-content">
        <div className="doencas-cid-delete-icon" aria-hidden="true">
          <ExclamationCircleOutlined />
        </div>

        <div className="doencas-cid-delete-message">
          {messageText}
        </div>

        <div className="doencas-cid-delete-actions">
          <Button danger type="primary" onClick={onConfirm} loading={loading}>
            Excluir
          </Button>
          <Button onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
