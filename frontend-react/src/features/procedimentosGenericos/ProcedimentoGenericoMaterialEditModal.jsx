import { Modal, Select } from 'antd';

function formatMoney(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
}

export function ProcedimentoGenericoMaterialEditModal({
  open,
  title,
  loading = false,
  listas = [],
  listaId = '',
  busca = '',
  materiais = [],
  materialId = '',
  quantidade = '0',
  custoUnitario = 0,
  custoTotal = 0,
  onChangeListaId,
  onChangeBusca,
  onChangeMaterialId,
  onChangeQuantidade,
  onCancel,
  onConfirm,
}) {
  const materialOptions = Array.isArray(materiais) ? materiais : [];

  return (
    <Modal
      open={open}
      centered
      destroyOnClose
      width={365}
      footer={null}
      onCancel={onCancel}
      title={title}
      confirmLoading={loading}
      className="procedimento-generico-material-edit-modal"
      closeIcon={<span aria-hidden="true">X</span>}
    >
      <div className="procedimento-generico-material-edit-body">
        <div className="procedimento-generico-material-edit-grid">
          <div className="procedimento-generico-material-edit-field">
            <label htmlFor="pgen-material-lista">Classificação:</label>
            <Select
              id="pgen-material-lista"
              value={listaId || undefined}
              placeholder="Selecione..."
              loading={loading}
              showSearch
              filterOption={(input, option) => String(option?.label || '').toLowerCase().includes(String(input || '').toLowerCase())}
              options={listas.map((item) => ({
                label: String(item?.nome || '').trim() || String(item?.id || '').trim(),
                value: String(item?.id || '').trim(),
              }))}
              onChange={(value) => onChangeListaId?.(String(value || ''))}
            />
          </div>

          <div className="procedimento-generico-material-edit-search">
            <label htmlFor="pgen-material-q">Material</label>
            <input
              id="pgen-material-q"
              type="text"
              value={busca}
              onChange={(event) => onChangeBusca?.(event.target.value)}
            />
          </div>

          <div className="procedimento-generico-material-edit-field">
            <label htmlFor="pgen-material-select">Nome do material:</label>
            <Select
              id="pgen-material-select"
              value={materialId || undefined}
              placeholder="Selecione..."
              loading={loading}
              showSearch
              filterOption={(input, option) => String(option?.label || '').toLowerCase().includes(String(input || '').toLowerCase())}
              options={materialOptions.map((item) => ({
                label: String(item?.nome || '').trim() || String(item?.codigo || '').trim(),
                value: String(item?.id || '').trim(),
              }))}
              onChange={(value) => onChangeMaterialId?.(String(value || ''))}
            />
          </div>

          <div className="procedimento-generico-material-edit-metric">
            <label htmlFor="pgen-material-custo-unit">Valor de custo unitário........................</label>
            <input id="pgen-material-custo-unit" type="text" value={formatMoney(custoUnitario)} readOnly />
          </div>

          <div className="procedimento-generico-material-edit-metric">
            <label htmlFor="pgen-material-quantidade">Quantidade média utilizada................</label>
            <input
              id="pgen-material-quantidade"
              className="metric-qtd"
              type="number"
              min="0"
              step="1"
              value={quantidade}
              onChange={(event) => onChangeQuantidade?.(event.target.value)}
            />
          </div>

          <div className="procedimento-generico-material-edit-metric">
            <label htmlFor="pgen-material-custo-total">Valor de custo total............................</label>
            <input id="pgen-material-custo-total" type="text" value={formatMoney(custoTotal)} readOnly />
          </div>
        </div>
      </div>

      <div className="procedimento-generico-material-edit-actions">
        <button type="button" className="procedimento-generico-material-edit-button is-primary" onClick={onConfirm} disabled={loading}>
          Ok
        </button>
        <button type="button" className="procedimento-generico-material-edit-button" onClick={onCancel} disabled={loading}>
          Cancela
        </button>
      </div>
    </Modal>
  );
}
