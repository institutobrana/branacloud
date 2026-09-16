import { Alert, Space, Typography } from 'antd';

import { BranaModal } from '../../../components/BranaModal.jsx';

export function UnidadeAtendimentoDeleteDialog({
  open,
  loading = false,
  error = '',
  target = null,
  onCancel,
  onConfirm,
}) {
  const codigo = String(target?.codigo ?? '').trim();
  const nome = String(target?.nome ?? '').trim();

  return (
    <BranaModal
      open={open}
      title="Excluir unidade de atendimento"
      centered
      width={420}
      destroyOnClose
      maskClosable={!loading}
      keyboard={!loading}
      onCancel={loading ? undefined : onCancel}
      footer={null}
    >
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Typography.Text>
          Confirma a exclusão da unidade
          {codigo ? <strong>{` ${codigo}`}</strong> : null}
          {nome ? <strong>{codigo ? ` - ${nome}` : ` ${nome}`}</strong> : null}?
        </Typography.Text>
        <Typography.Text type="secondary">
          Esta ação remove definitivamente o cadastro e pode ser bloqueada pelas regras de proteção.
        </Typography.Text>
        {error ? <Alert type="error" showIcon message={error} /> : null}
        <div className="unidades-atendimento-modal-actions">
          <button type="button" className="auxiliary-shell-button" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          <button type="button" className="auxiliary-shell-button danger" onClick={onConfirm} disabled={loading}>
            Excluir
          </button>
        </div>
      </Space>
    </BranaModal>
  );
}
