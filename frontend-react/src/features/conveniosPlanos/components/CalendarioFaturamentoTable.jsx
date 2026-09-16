import { BranaTable } from '../../../components/BranaTable.jsx';

export function CalendarioFaturamentoTable({ items, loading, selectedId, onSelect, onDoubleClick }) {
  const columns = [
    { title: 'Convênio', dataIndex: 'convenio_nome', key: 'convenio_nome', width: '40%' },
    { title: 'Data fechamento', dataIndex: 'data_fechamento', key: 'data_fechamento', width: '30%' },
    { title: 'Data pagamento', dataIndex: 'data_pagamento', key: 'data_pagamento', width: '30%' },
  ];
  return <BranaTable rowKey="row_id" className="module-table auxiliary-compact-table convenios-planos-calendar-table" dataSource={items} columns={columns} loading={loading} pagination={false} size="small" tableLayout="fixed" rowClassName={(record) => (Number(record.row_id) === Number(selectedId) ? 'users-table-row-selected' : '')} rowSelection={{ type: 'radio', selectedRowKeys: selectedId ? [selectedId] : [], onChange: (keys) => onSelect(keys[0] ?? null) }} onRow={(record) => ({ role: 'row', 'aria-selected': Number(record.row_id) === Number(selectedId), onClick: () => onSelect(record.row_id), onDoubleClick: () => onDoubleClick?.(record) })} />;
}
