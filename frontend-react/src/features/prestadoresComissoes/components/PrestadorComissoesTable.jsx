import { Alert, Table } from 'antd';
import { formatPrestadorComissaoRepasse } from '../utils/prestadorComissaoMappers.js';

export function PrestadorComissoesTable({ items, loading, error, selectedId, onSelect, onEdit }) {
  const columns = [
    { title: 'Vigência', dataIndex: 'vigencia', key: 'vigencia' },
    { title: 'Prestador', dataIndex: 'prestador_nome', key: 'prestador_nome' },
    { title: 'Convênio', dataIndex: 'convenio_nome', key: 'convenio_nome' },
    { title: 'Especialidade', dataIndex: 'especialidade', key: 'especialidade' },
    { title: 'Repasse', dataIndex: 'repasse', key: 'repasse', render: (_, record) => formatPrestadorComissaoRepasse(record) },
  ];
  return (
    <Table
      className="prestador-com-table"
      rowKey="id"
      size="small"
      pagination={false}
      loading={loading}
      dataSource={items}
      columns={columns}
      rowSelection={{ type: 'radio', selectedRowKeys: selectedId ? [selectedId] : [], onChange: (keys) => onSelect(keys[0] || null) }}
      onRow={(record) => ({ onClick: () => onSelect(record.id), onDoubleClick: () => onEdit(record.id), 'aria-selected': record.id === selectedId })}
      locale={{ emptyText: error ? <Alert type="error" message={error} showIcon /> : 'Nenhum fator encontrado.' }}
    />
  );
}
