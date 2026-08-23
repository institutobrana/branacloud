import { Alert, Space, Typography } from 'antd';

import { BranaModal } from '../../../components/BranaModal.jsx';

export function PrestadorDeleteDialog({
  open,
  loading = false,
  error = '',
  target = null,
  onCancel,
  onConfirm,
}) {
  const codigo = String(target?.codigo ?? '').trim();
  const nome = String(target?.nome ?? '').trim();
  const label = nome || codigo || 'selecionado';

  return (
    <BranaModal
      open={open}
      title="Elimina prestador"
      centered
      width={460}
      destroyOnClose
      maskClosable={!loading}
      keyboard={!loading}
      onCancel={loading ? undefined : onCancel}
      footer={null}
      className="prestadores-delete-modal"
    >
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Typography.Text>
          Deseja realmente eliminar o prestador <strong>{label}</strong>?
        </Typography.Text>
        <Typography.Text type="secondary">
          Esta ação remove o cadastro e pode ser bloqueada se houver vínculos ou proteção sistêmica.
        </Typography.Text>
        {error ? <Alert type="error" showIcon message={error} /> : null}
        <div className="prestadores-delete-modal-actions">
          <button type="button" className="auxiliary-shell-button danger" onClick={onConfirm} disabled={loading}>
            Elimina
          </button>
          <button type="button" className="auxiliary-shell-button" onClick={onCancel} disabled={loading}>
            Cancela
          </button>
        </div>
      </Space>
    </BranaModal>
  );
}
