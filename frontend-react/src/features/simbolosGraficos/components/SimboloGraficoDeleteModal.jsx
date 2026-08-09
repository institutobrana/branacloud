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
      <style>{`
        .simbolos-graficos-delete-modal .ant-modal-body {
          display: grid;
          gap: 12px;
        }
        .simbolos-graficos-delete-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 4px;
        }
        .simbolos-graficos-delete-actions .simbolos-graficos-delete-confirm,
        .simbolos-graficos-delete-actions .simbolos-graficos-delete-cancel {
          min-width: 96px;
          min-height: 32px;
          padding: 6px 14px;
          border: 1px solid var(--brana-border-subtle);
          background: var(--brana-control-background);
          color: var(--brana-text-primary);
          box-shadow: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }
        .simbolos-graficos-delete-actions .simbolos-graficos-delete-confirm {
          background: rgba(196, 58, 58, 0.12);
          border-color: rgba(196, 58, 58, 0.36);
          color: #b83333;
        }
        .simbolos-graficos-delete-actions .simbolos-graficos-delete-confirm:hover:not(:disabled),
        .simbolos-graficos-delete-actions .simbolos-graficos-delete-confirm:focus-visible:not(:disabled) {
          background: rgba(196, 58, 58, 0.18);
          border-color: rgba(196, 58, 58, 0.5);
          color: #a93030;
          outline: 2px solid transparent;
          outline-offset: 1px;
        }
        .simbolos-graficos-delete-actions .simbolos-graficos-delete-cancel:hover:not(:disabled),
        .simbolos-graficos-delete-actions .simbolos-graficos-delete-cancel:focus-visible:not(:disabled) {
          background: var(--brana-surface-table-row-hover);
          border-color: var(--brana-control-hover);
          color: var(--brana-text-primary);
          outline: 2px solid transparent;
          outline-offset: 1px;
        }
        .simbolos-graficos-delete-actions .simbolos-graficos-delete-confirm:disabled,
        .simbolos-graficos-delete-actions .simbolos-graficos-delete-cancel:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        [data-brana-theme='dark'] .simbolos-graficos-delete-actions .simbolos-graficos-delete-confirm,
        [data-brana-theme='dark'] .simbolos-graficos-delete-actions .simbolos-graficos-delete-cancel {
          background: var(--brana-surface-panel);
          border-color: var(--brana-border-subtle);
          color: var(--brana-text-primary);
        }
        [data-brana-theme='dark'] .simbolos-graficos-delete-actions .simbolos-graficos-delete-confirm {
          background: rgba(255, 113, 113, 0.12);
          border-color: rgba(255, 113, 113, 0.36);
          color: #ff9d9d;
        }
        [data-brana-theme='dark'] .simbolos-graficos-delete-actions .simbolos-graficos-delete-confirm:hover:not(:disabled),
        [data-brana-theme='dark'] .simbolos-graficos-delete-actions .simbolos-graficos-delete-confirm:focus-visible:not(:disabled) {
          background: rgba(255, 113, 113, 0.18);
          border-color: rgba(255, 113, 113, 0.5);
          color: #ffd0d0;
        }
        [data-brana-theme='dark'] .simbolos-graficos-delete-actions .simbolos-graficos-delete-cancel:hover:not(:disabled),
        [data-brana-theme='dark'] .simbolos-graficos-delete-actions .simbolos-graficos-delete-cancel:focus-visible:not(:disabled) {
          background: var(--brana-surface-table-row-hover);
          border-color: var(--brana-control-hover);
          color: var(--brana-text-primary);
        }
      `}</style>
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
          <button type="button" className="simbolos-graficos-delete-confirm" onClick={onConfirm} disabled={loading}>
            Elimina
          </button>
          <button type="button" className="simbolos-graficos-delete-cancel" onClick={onCancel} disabled={loading}>
            Cancela
          </button>
        </div>
      </Space>
    </BranaModal>
  );
}
