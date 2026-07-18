import { Button, Select, Input, Typography, InputNumber } from 'antd';
import { BranaModal } from '../../../components/BranaModal.jsx';

import { formatMaterialMoney } from '../procedimentosMateriaisMappers.js';

export function ProcedimentoMaterialModal({
  open,
  loading = false,
  saving = false,
  error = '',
  mode = 'new',
  listas = [],
  materiais = [],
  form = {},
  onClose,
  onSave,
  onChangeField,
  onMaterialChange,
}) {
  const titulo = mode === 'edit' ? 'Altera material' : 'Vincular material';

  return (
    <BranaModal
      open={open}
      title={titulo}
      centered
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={loading || saving}>
          Cancela
        </Button>,
        <Button key="ok" type="primary" loading={saving} disabled={loading || saving} onClick={onSave}>
          Ok
        </Button>,
      ]}
      width={388}
      className="procedimento-material-modal"
      destroyOnClose={false}
      maskClosable={false}
    >
      <div className="procedimento-material-modal-shell brana-modal-section">
        {error ? <Typography.Text type="danger">{error}</Typography.Text> : null}
        <div className="procedimento-material-modal-grid">
          <label className="procedimento-material-field procedimento-material-field-wide">
            <span>Classificação</span>
            <Select
              value={form.listaId ?? undefined}
              options={Array.isArray(listas) ? listas.map((item) => ({ value: item.id, label: item.nome })) : []}
              onChange={(value) => onChangeField?.('listaId', value || null)}
              disabled={loading || saving}
              loading={loading || saving}
              placeholder="Selecione..."
            />
          </label>

          <label className="procedimento-material-field procedimento-material-field-wide">
            <span>Material</span>
            <Input
              value={form.busca || ''}
              onChange={(event) => onChangeField?.('busca', event.target.value)}
              disabled={loading || saving}
              placeholder="Filtrar por código ou nome"
            />
          </label>

          <label className="procedimento-material-field procedimento-material-field-wide">
            <span>Nome do material</span>
            <Select
              value={form.materialId ?? undefined}
              options={Array.isArray(materiais) ? materiais.map((item) => ({ value: item.id, label: `${item.codigo} - ${item.nome}` })) : []}
              onChange={(value) => onMaterialChange?.(value || null)}
              disabled={loading || saving || !form.listaId}
              loading={loading || saving}
              placeholder="Selecione..."
            />
          </label>

          <div className="procedimento-material-line brana-modal-meta-row">
            <span className="procedimento-material-line-label">Valor de custo unitário</span>
            <Input value={formatMaterialMoney(form.custoUnd)} readOnly className="procedimento-material-value-input procedimento-material-value-input-cyan brana-readonly-surface" />
          </div>

          <div className="procedimento-material-line brana-modal-meta-row">
            <span className="procedimento-material-line-label">Quantidade média utilizada</span>
            <InputNumber
              value={form.quantidade === '' || form.quantidade === null || form.quantidade === undefined ? 0 : Number(form.quantidade)}
              min={0}
              step={1}
              controls
              className="procedimento-material-quantity"
              onChange={(value) => onChangeField?.('quantidade', value ?? '0')}
              disabled={loading || saving}
            />
          </div>

          <div className="procedimento-material-line brana-modal-meta-row">
            <span className="procedimento-material-line-label">Valor de custo total</span>
            <Input value={formatMaterialMoney(form.custoTotal)} readOnly className="procedimento-material-value-input procedimento-material-value-input-cyan brana-readonly-surface" />
          </div>
        </div>

      </div>
    </BranaModal>
  );
}
