import { Alert, Button, Space, Typography } from 'antd';

import { BranaModal } from '../../../components/BranaModal.jsx';

export function PerguntaDeleteDialog({
  open,
  loading = false,
  error = '',
  target = null,
  onCancel,
  onConfirm,
}) {
  const numero = target?.numero != null ? Number(target.numero) : null;
  const texto = String(target?.texto || '').trim();
  const preview = texto.length > 96 ? `${texto.slice(0, 96).trimEnd()}...` : texto;

  return (
    <BranaModal
      open={open}
      title="Configura questionarios de anamnese"
      centered
      width={520}
      destroyOnClose
      maskClosable={!loading}
      keyboard={!loading}
      onCancel={loading ? undefined : onCancel}
      footer={null}
    >
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Typography.Text>
          Deseja eliminar a pergunta nº {numero ?? '-'}{preview ? <strong>{` — "${preview}"`}</strong> : null}?
        </Typography.Text>
        <Typography.Text type="secondary">
          A exclusão remove somente esta pergunta e não renumera automaticamente as demais.
        </Typography.Text>
        {error ? <Alert type="error" showIcon message={error} /> : null}
        <div className="questionarios-anamnese-modal-actions">
          <Button danger type="primary" onClick={onConfirm} loading={loading}>
            Elimina
          </Button>
          <Button onClick={onCancel} disabled={loading}>
            Cancela
          </Button>
        </div>
      </Space>
    </BranaModal>
  );
}
