import { Alert, Button, Space, Typography } from 'antd';

import { BranaModal } from '../../../components/BranaModal.jsx';
import '../indicesFinanceiros.css';

export function IndiceFinanceiroDeleteDialog({
  open,
  loading = false,
  error = '',
  target = null,
  onCancel,
  onConfirm,
}) {
  const nome = String(target?.nome ?? '').trim();
  const sigla = String(target?.sigla ?? '').trim();

  return (
    <BranaModal
      open={open}
      title="Exclui índice financeiro"
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
          Deseja excluir o índice financeiro
          {nome ? <strong>{` ${nome}`}</strong> : null}
          {sigla ? <strong>{` (${sigla})`}</strong> : null}?
        </Typography.Text>
        <Typography.Text type="secondary">
          Esta ação remove definitivamente o cadastro quando o índice não estiver em uso.
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
