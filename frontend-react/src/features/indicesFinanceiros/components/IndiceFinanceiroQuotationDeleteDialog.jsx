import { Alert, Button, Space, Typography } from 'antd';

import { BranaModal } from '../../../components/BranaModal.jsx';
import '../indicesFinanceiros.css';
import { formatIndiceFinanceiroCotacaoData, formatIndiceFinanceiroCotacaoValor } from '../indicesFinanceirosFormatters.js';

export function IndiceFinanceiroQuotationDeleteDialog({
  open,
  loading = false,
  error = '',
  indice = null,
  cotacao = null,
  onCancel,
  onConfirm,
}) {
  const dataFormatada = formatIndiceFinanceiroCotacaoData(cotacao?.data);
  const valorFormatado = formatIndiceFinanceiroCotacaoValor(cotacao?.valor);

  return (
    <BranaModal
      open={open}
      title="Exclui cotação"
      centered
      width={430}
      destroyOnClose
      maskClosable={!loading}
      keyboard={!loading}
      onCancel={loading ? undefined : onCancel}
      footer={null}
    >
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Typography.Text>
          Deseja excluir a cotação de <strong>{dataFormatada}</strong> no valor de <strong>{valorFormatado}</strong>?
        </Typography.Text>
        <Typography.Text type="secondary">
          O índice
          {indice?.nome ? <strong>{` ${indice.nome}`}</strong> : null}
          {indice?.sigla ? <strong>{` (${indice.sigla})`}</strong> : null}
          {' '}
          permanecerá selecionado.
        </Typography.Text>
        {error ? <Alert type="error" showIcon message={error} /> : null}
        <div className="indices-financeiros-modal-actions">
          <Button danger type="primary" onClick={onConfirm} disabled={loading} className="indices-financeiros-modal-primary indices-financeiros-modal-danger">
            Excluir
          </Button>
          <Button onClick={onCancel} disabled={loading} className="indices-financeiros-modal-secondary">
            Cancelar
          </Button>
        </div>
      </Space>
    </BranaModal>
  );
}
