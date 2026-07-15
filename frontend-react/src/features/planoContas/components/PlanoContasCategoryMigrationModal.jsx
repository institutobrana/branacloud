import { Button, Select, Typography } from 'antd';

import { BranaModal } from '../../../components/BranaModal.jsx';

export function PlanoContasCategoryMigrationModal({
  open,
  loading = false,
  originCategory = null,
  destinations = [],
  destinationId = null,
  canConfirm = false,
  error = '',
  onConfirm,
  onCancel,
  onChangeDestination,
}) {
  const originName = String(originCategory?.nome || '').trim() || 'selecionada';
  const options = Array.isArray(destinations)
    ? destinations.map((item) => ({
        label: String(item?.nome || '').trim() || `Categoria ${item?.id}`,
        value: item?.id,
      }))
    : [];

  return (
    <BranaModal
      open={open}
      title="Migrar e eliminar categoria"
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      width={520}
      maskClosable={!loading}
      keyboard={!loading}
    >
      <div className="plano-contas-migration-modal">
        <Typography.Paragraph>
          Categoria em uso: <strong>{originName}</strong>
        </Typography.Paragraph>
        <Typography.Paragraph type="secondary">
          Os lançamentos serão transferidos para outra categoria antes da eliminação.
        </Typography.Paragraph>
        <div className="plano-contas-migration-field">
          <Typography.Text strong>Migrar lançamentos para:</Typography.Text>
          <Select
            value={destinationId ?? undefined}
            options={options}
            onChange={onChangeDestination}
            placeholder="Selecione uma categoria destino"
            disabled={loading || options.length === 0}
            style={{ width: '100%' }}
          />
        </div>
        {!options.length ? (
          <Typography.Text type="danger">
            Não existe outra categoria disponível para receber os lançamentos.
          </Typography.Text>
        ) : null}
        {error ? <Typography.Text type="danger">{error}</Typography.Text> : null}
        <div className="plano-contas-modal-actions">
          <Button danger type="primary" onClick={onConfirm} loading={loading} disabled={!canConfirm}>
            Migrar e eliminar
          </Button>
          <Button onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </div>
    </BranaModal>
  );
}
