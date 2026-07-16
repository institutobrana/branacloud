import { Typography } from 'antd';
import { useEffect, useState } from 'react';

import { BranaTable } from '../../../components/BranaTable.jsx';
import { TableColumnFilterHeader } from '../../../components/TableColumnFilterHeader.jsx';
import { formatMoney } from '../utils/servicosProteticoFormatters.js';

const TABLE_SCROLL_Y = 480;

export function ServicosProteticoTable({
  items,
  selectedId,
  loading,
  sortState,
  onSort,
  onSelect,
  filters,
  onFilterChange,
  visibleColumns,
  onToggleVisibleColumn,
  footerLabel,
}) {
  const [draftFilters, setDraftFilters] = useState(filters);

  useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  const visibleColumnCount = Object.values(visibleColumns || {}).filter((value) => value !== false).length;
  const canToggleColumn = (key) => (visibleColumns?.[key] === false ? true : visibleColumnCount > 1);

  const filterColumns = [
    { key: 'codigo', label: 'Código', visible: true },
    { key: 'nome', label: 'Serviço', visible: true },
    { key: 'indice', label: 'Índice', visible: true },
    { key: 'preco', label: 'Preço', visible: true },
    { key: 'prazo', label: 'Prazo', visible: true },
  ];

  const renderHeader = (columnKey, label) => (
    <TableColumnFilterHeader
      label={label}
      activeSort={sortState.key === columnKey ? sortState.order : null}
      onSortAsc={() => onSort?.(columnKey, 'asc')}
      onSortDesc={() => onSort?.(columnKey, 'desc')}
      columns={filterColumns.map((column) => ({
        ...column,
        visible: visibleColumns?.[column.key] !== false,
        locked: !canToggleColumn(column.key),
      }))}
      onToggleColumn={(key) => onToggleVisibleColumn?.(key)}
      filterValue={draftFilters?.[columnKey] ?? ''}
      onFilterValueChange={(value) => setDraftFilters((current) => ({ ...current, [columnKey]: value }))}
      onFilterApply={() => onFilterChange?.(columnKey, String(draftFilters?.[columnKey] ?? '').trim())}
      onFilterClear={() => {
        setDraftFilters((current) => ({ ...current, [columnKey]: '' }));
        onFilterChange?.(columnKey, '');
      }}
      activeFilter={Boolean(String(filters?.[columnKey] ?? '').trim())}
    />
  );

  const columns = [
    {
      key: 'codigo',
      title: renderHeader('codigo', 'Código'),
      dataIndex: 'codigo',
      width: 68,
      render: (value) => <Typography.Text strong>{value || '-'}</Typography.Text>,
    },
    {
      key: 'nome',
      title: renderHeader('nome', 'Serviço'),
      dataIndex: 'nome',
      width: 404,
      ellipsis: true,
      render: (value) => <span title={value || ''}>{value || '-'}</span>,
    },
    {
      key: 'indice',
      title: renderHeader('indice', 'Índice'),
      dataIndex: 'indice',
      width: 104,
      align: 'right',
      render: (value) => formatMoney(value),
    },
    {
      key: 'preco',
      title: renderHeader('preco', 'Preço'),
      dataIndex: 'preco',
      width: 110,
      align: 'right',
      render: (value) => formatMoney(value),
    },
    {
      key: 'prazo',
      title: renderHeader('prazo', 'Prazo'),
      dataIndex: 'prazo',
      width: 70,
      align: 'center',
      render: (value) => (value || value === 0 ? String(value) : '-'),
    },
  ];

  const resolvedColumns = columns.filter((column) => visibleColumns?.[column.key] !== false);

  return (
    <div className="servicos-protetico-table-shell">
      <div className="servicos-protetico-table-frame">
        <div className="servicos-protetico-table-grid" role="grid" aria-label="Listagem de serviços de protético">
          <BranaTable
            rowKey="id"
            className="module-table auxiliary-compact-table servicos-protetico-table"
            loading={loading}
            pagination={false}
            size="small"
            tableLayout="fixed"
            scroll={{ y: TABLE_SCROLL_Y }}
            dataSource={items}
            columns={resolvedColumns}
            rowClassName={(record) => (Number(record.id) === Number(selectedId) ? 'users-table-row-selected' : '')}
            rowSelection={{
              type: 'radio',
              selectedRowKeys: selectedId ? [selectedId] : [],
              onChange: (keys) => onSelect?.(Number(keys[0] || 0) || null),
            }}
            onRow={(record) => ({
              role: 'row',
              'aria-selected': Number(record.id) === Number(selectedId),
              'data-row-id': record.id,
              'data-selected': Number(record.id) === Number(selectedId) ? 'true' : 'false',
              onClick: () => onSelect?.(Number(record.id) || null),
            })}
            locale={{ emptyText: 'Nenhum serviço de protético cadastrado.' }}
          />
        </div>

        <div className="servicos-protetico-table-footer" aria-live="polite">
          <Typography.Text type="secondary">{footerLabel}</Typography.Text>
        </div>
      </div>
    </div>
  );
}
