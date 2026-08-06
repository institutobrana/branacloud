import { Alert, Button, Typography } from 'antd';

import { BranaTable } from '../../../components/BranaTable.jsx';
import { formatIndiceFinanceiroCotacaoData, formatIndiceFinanceiroCotacaoValor } from '../indicesFinanceirosFormatters.js';

const columns = [
  {
    key: 'data',
    title: 'Data',
    dataIndex: 'data',
    render: (value) => formatIndiceFinanceiroCotacaoData(value),
  },
  {
    key: 'cotacao',
    title: 'Cotação',
    dataIndex: 'valor',
    width: 140,
    render: (value) => formatIndiceFinanceiroCotacaoValor(value),
  },
];

export function IndicesCotacoesTable({
  rows = [],
  loading = false,
  error = '',
  selectedKey = null,
  onSelect,
  onRetry,
  hasSelectedIndex = false,
}) {
  return (
    <div className="indices-financeiros-section">
      <Typography.Title level={5} className="indices-financeiros-section-title">
        Cotações para reais
      </Typography.Title>
      {error ? (
        <Alert
          type="error"
          showIcon
          message="Não foi possível carregar as cotações."
          description={error}
          action={
            <Button type="link" onClick={onRetry}>
              Tentar novamente
            </Button>
          }
        />
      ) : null}
      <BranaTable
        rowKey="cotacaoId"
        size="small"
        pagination={false}
        loading={loading}
        columns={columns}
        dataSource={rows}
        rowClassName={(record) => (Number(record?.cotacaoId) === Number(selectedKey) ? 'brana-table-row-selected' : '')}
        onRow={(record) => ({
          onClick: () => onSelect?.(record?.cotacaoId),
        })}
        rowSelection={{
          type: 'radio',
          selectedRowKeys: selectedKey == null ? [] : [selectedKey],
          onChange: (keys) => onSelect?.(keys?.[0] ?? null),
        }}
        locale={{
          emptyText: hasSelectedIndex
            ? 'Nenhuma cotação cadastrada.'
            : 'Selecione um índice para visualizar as cotações.',
        }}
      />
    </div>
  );
}
