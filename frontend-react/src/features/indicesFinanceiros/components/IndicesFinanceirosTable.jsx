import { Alert, Button, Space, Typography } from 'antd';

import { BranaTable } from '../../../components/BranaTable.jsx';

const columns = [
  {
    key: 'nome',
    title: 'Índice',
    dataIndex: 'nome',
  },
  {
    key: 'sigla',
    title: 'Sigla',
    dataIndex: 'sigla',
    width: 120,
  },
  {
    key: 'valorAtual',
    title: 'Valor atual',
    dataIndex: 'valorAtual',
    width: 140,
  },
];

export function IndicesFinanceirosTable({
  rows = [],
  loading = false,
  error = '',
  selectedNumero = null,
  selectedRow = null,
  onSelect,
  onRetry,
}) {
  return (
    <div className="indices-financeiros-section">
      <Typography.Title level={5} className="indices-financeiros-section-title">
        Índices financeiros
      </Typography.Title>
      {error ? (
        <Alert
          type="error"
          showIcon
          message="Não foi possível carregar os índices financeiros."
          description={error}
          action={
            <Button type="link" onClick={onRetry}>
              Tentar novamente
            </Button>
          }
        />
      ) : null}
      <BranaTable
        rowKey="numero"
        size="small"
        pagination={false}
        loading={loading}
        columns={columns}
        dataSource={rows}
        rowClassName={(record) => (Number(record?.numero) === Number(selectedNumero) ? 'brana-table-row-selected' : '')}
        onRow={(record) => ({
          onClick: () => onSelect?.(record?.numero),
        })}
        rowSelection={{
          type: 'radio',
          selectedRowKeys: selectedNumero == null ? [] : [selectedNumero],
          onChange: (keys) => onSelect?.(keys?.[0] ?? null),
        }}
        locale={{ emptyText: loading ? 'Carregando índices financeiros...' : 'Nenhum índice carregado.' }}
      />
      {selectedNumero != null && selectedRow ? (
        <Space className="indices-financeiros-selection-summary" size={8} wrap>
          <Typography.Text type="secondary">Selecionado:</Typography.Text>
          <Typography.Text strong>{selectedRow.nome}</Typography.Text>
          <Typography.Text type="secondary">({selectedRow.sigla})</Typography.Text>
        </Space>
      ) : null}
    </div>
  );
}
