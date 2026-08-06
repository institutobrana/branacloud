import { Alert, Space, Typography } from 'antd';

import { BranaModal } from '../../../components/BranaModal.jsx';

export function SimboloGraficoDeleteModal({
  open,
  loading = false,
  error = '',
  target = null,
  onCancel,
  onConfirm,
}) {
  const nome = String(target?.nome || '').trim();
  const codigo = String(target?.codigo || '').trim();
  const origem = String(target?.origem || '').trim();
  const label = nome || codigo || 'selecionado';

  return (
    <BranaModal
      open={open}
      title="Exclui símbolo gráfico"
      centered
      width={460}
      destroyOnClose
      maskClosable={!loading}
      keyboard={!loading}
      onCancel={loading ? undefined : onCancel}
      footer={null}
      className="simbolos-graficos-delete-modal"
    >
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Typography.Text>
          Confirma a exclusão do símbolo gráfico <strong>{label}</strong>?
        </Typography.Text>
        <Typography.Text type="secondary">
          Esta ação remove o registro e pode ser bloqueada se houver vínculos ou proteção de catálogo.
        </Typography.Text>
        {origem ? (
          <Typography.Text type="secondary">
            Origem: {origem}
          </Typography.Text>
        ) : null}
        {error ? <Alert type="error" showIcon message={error} /> : null}
        <div className="simbolos-graficos-delete-actions">
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
