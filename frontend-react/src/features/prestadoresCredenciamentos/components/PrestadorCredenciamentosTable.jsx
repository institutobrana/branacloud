import { Alert, Table, Typography } from 'antd';
import { formatCredenciamentoDate, formatCredenciamentoPrestador, formatCredenciamentoValue } from '../utils/prestadorCredenciamentosFormatters.js';

export function PrestadorCredenciamentosTable({ items, loading, error, selectedId, onSelect, onDoubleClick }) {
  const columns = [
    { title: 'Código', dataIndex: 'codigo', key: 'codigo', render: (value) => <Typography.Text strong>{String(value || '')}</Typography.Text> },
    { title: 'Prestador', key: 'prestador', render: (_, item) => formatCredenciamentoPrestador(item) },
    { title: 'Convênio', dataIndex: 'convenio_nome', key: 'convenio_nome' },
    { title: 'Início', dataIndex: 'inicio', key: 'inicio', render: formatCredenciamentoDate },
    { title: 'Fim', dataIndex: 'fim', key: 'fim', render: formatCredenciamentoDate },
    { title: 'Valor US', dataIndex: 'valor_us', key: 'valor_us', render: formatCredenciamentoValue },
  ];
  return (
    <Table
      className="prestador-cred-table"
      rowKey="id"
      loading={loading}
      pagination={false}
      size="small"
      dataSource={items}
      columns={columns}
      rowSelection={{ type: 'radio', selectedRowKeys: selectedId ? [selectedId] : [], onChange: (keys) => onSelect(keys[0] || null) }}
      onRow={(record) => ({ onClick: () => onSelect(record.id), onDoubleClick: () => onDoubleClick?.(record), 'aria-selected': record.id === selectedId })}
      locale={{ emptyText: error ? <Alert type="error" message={error} showIcon /> : 'Nenhum credenciamento encontrado.' }}
    />
  );
}
