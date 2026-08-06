import { Alert, Button, Select, Space, Typography } from 'antd';

import { BranaModal } from '../../../components/BranaModal.jsx';
import '../indicesFinanceiros.css';

function buildDestinoLabel(indice) {
  const nome = String(indice?.nome ?? '').trim();
  const sigla = String(indice?.sigla ?? '').trim();
  if (nome && sigla) return `${nome} - ${sigla}`;
  return nome || sigla || `Índice ${indice?.numero ?? ''}`.trim();
}

export function IndiceFinanceiroMigrationDialog({
  open,
  loading = false,
  error = '',
  target = null,
  destinationOptions = [],
  selectedDestinationNumero = null,
  onDestinationChange,
  onCancel,
  onConfirm,
}) {
  const nomeOrigem = String(target?.nome ?? '').trim();
  const siglaOrigem = String(target?.sigla ?? '').trim();
  const canSubmit = Boolean(!loading && selectedDestinationNumero != null);

  const options = Array.isArray(destinationOptions)
    ? destinationOptions.map((item) => ({
        label: buildDestinoLabel(item),
        value: Number(item?.numero),
        disabled: Number(item?.numero) === Number(target?.numero),
      }))
    : [];

  return (
    <BranaModal
      open={open}
      title="Migra índice financeiro"
      centered
      width={500}
      destroyOnClose
      maskClosable={!loading}
      keyboard={!loading}
      onCancel={loading ? undefined : onCancel}
      footer={null}
    >
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Typography.Text>
          O índice financeiro
          {nomeOrigem ? <strong>{` ${nomeOrigem}`}</strong> : null}
          {siglaOrigem ? <strong>{` (${siglaOrigem})`}</strong> : null}
          {' '}
          está em uso e não pode ser excluído diretamente.
        </Typography.Text>
        <Typography.Text type="secondary">
          Selecione o índice que receberá os vínculos antes da exclusão.
        </Typography.Text>
        <label className="indices-financeiros-migration-field">
          <span>Índice de destino</span>
          <Select
            value={selectedDestinationNumero ?? undefined}
            onChange={onDestinationChange}
            placeholder="Selecione um índice"
            options={options}
            disabled={loading}
            showSearch
            optionFilterProp="label"
          />
        </label>
        <Typography.Text type="secondary">
          Origem: {nomeOrigem || 'índice selecionado'}.
        </Typography.Text>
        {error ? <Alert type="error" showIcon message={error} /> : null}
        <div className="indices-financeiros-modal-actions">
          <Button danger type="primary" onClick={onConfirm} disabled={!canSubmit} className="indices-financeiros-modal-primary indices-financeiros-modal-danger">
            Migrar e excluir
          </Button>
          <Button onClick={onCancel} disabled={loading} className="indices-financeiros-modal-secondary">
            Cancelar
          </Button>
        </div>
      </Space>
    </BranaModal>
  );
}
