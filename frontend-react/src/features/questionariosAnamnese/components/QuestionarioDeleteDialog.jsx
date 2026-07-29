import { Alert, Button, Space, Typography } from 'antd';

import { BranaModal } from '../../../components/BranaModal.jsx';

export function QuestionarioDeleteDialog({
  open,
  loading = false,
  error = '',
  target = null,
  onCancel,
  onConfirm,
}) {
  const nome = String(target?.nome || '').trim();

  return (
    <BranaModal
      open={open}
      title="Elimina questionario de anamnese"
      centered
      width={460}
      destroyOnClose
      maskClosable={!loading}
      keyboard={!loading}
      onCancel={loading ? undefined : onCancel}
      footer={null}
    >
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Typography.Text>
          Confirma a eliminacao do questionario
          {nome ? <strong>{` "${nome}"`}</strong> : null}?
        </Typography.Text>
        <Typography.Text type="secondary">
          A eliminacao nao sera concluida se houver perguntas vinculadas a este questionario.
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
