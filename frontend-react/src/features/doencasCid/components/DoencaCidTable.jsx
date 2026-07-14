import { Typography } from 'antd';

import { BranaTable } from '../../../components/BranaTable.jsx';
import { TableColumnFilterHeader } from '../../../components/TableColumnFilterHeader.jsx';

export function DoencaCidTable({
  items,
  selectedId,
  loading,
  sortState,
  currentPage,
  pageSize,
  totalItems,
  onSort,
  onSelect,
  onEdit,
  onPageChange,
}) {
  const selectedKey = Number(selectedId || 0) || null;
  const filterColumns = [
    { key: 'codigo', label: 'Código', visible: true, locked: true },
    { key: 'descricao', label: 'Doença', visible: true, locked: true },
  ];

  const renderHeader = (columnKey, label) => (
    <TableColumnFilterHeader
      label={label}
      activeSort={sortState.key === columnKey ? sortState.order : null}
      onSortAsc={() => onSort?.(columnKey, 'asc')}
      onSortDesc={() => onSort?.(columnKey, 'desc')}
      columns={filterColumns}
      onToggleColumn={() => {}}
    />
  );

  const columns = [
    {
      key: 'codigo',
      title: renderHeader('codigo', 'Código'),
      dataIndex: 'codigo',
      width: 120,
      render: (value) => <Typography.Text strong>{value || '-'}</Typography.Text>,
    },
    {
      key: 'descricao',
      title: renderHeader('descricao', 'Doença'),
      dataIndex: 'descricao',
      render: (value) => value || '-',
    },
  ];

  return (
    <div className="module-table-shell doencas-cid-table-shell">
      <div className="users-grid-shell" role="grid" aria-label="Listagem de doenças CID">
        <BranaTable
          rowKey="id"
          className="module-table auxiliary-compact-table"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize,
            total: totalItems,
            showSizeChanger: false,
            onChange: (page) => onPageChange?.(page),
          }}
          size="small"
          tableLayout="fixed"
          dataSource={items}
          columns={columns}
          rowClassName={(record) => (selectedKey === Number(record.id || 0) ? 'users-table-row-selected' : '')}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: selectedKey ? [selectedKey] : [],
            onChange: (keys) => onSelect?.(Number(keys[0] || 0) || null),
          }}
          onRow={(record) => ({
            role: 'row',
            'aria-selected': selectedKey === Number(record.id || 0),
            'data-row-id': record.id,
            'data-selected': selectedKey === Number(record.id || 0) ? 'true' : 'false',
            onClick: () => onSelect?.(Number(record.id || 0) || null),
            onDoubleClick: () => onEdit?.(record),
          })}
          locale={{ emptyText: 'Nenhum CID cadastrado.' }}
        />
      </div>
    </div>
  );
}
