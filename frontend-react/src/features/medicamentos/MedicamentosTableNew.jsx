import { Typography } from 'antd';
import { useEffect, useState } from 'react';

import { BranaTable } from '../../components/BranaTable.jsx';
import { TableColumnFilterHeader } from '../../components/TableColumnFilterHeader.jsx';

function renderText(value) {
  const text = String(value || '').trim();
  return text || '-';
}

const FILTER_COLUMNS = [
  { key: 'nome', label: 'Nome', visible: true },
  { key: 'grupo', label: 'Grupo', visible: true },
  { key: 'apresentacao', label: 'Apresentação', visible: true },
];

const BASE_COLUMNS = [
  { key: 'nome', width: 330 },
  { key: 'grupo', width: 170 },
  { key: 'apresentacao', width: 170 },
];

export function MedicamentosTableNew({
  items,
  loading,
  selectedId,
  onSelect,
  filters,
  sortState,
  onSort,
  visibleColumns,
  onToggleVisibleColumn,
  onFilterApply,
  onFilterClear,
  footerLabel,
}) {
  const [draftFilters, setDraftFilters] = useState(filters);

  useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  const visibleColumnCount = Object.values(visibleColumns || {}).filter((value) => value !== false).length;
  const canToggleColumn = (key) => (visibleColumns?.[key] === false ? true : visibleColumnCount > 1);

  const renderHeader = (columnKey, label) => (
    <TableColumnFilterHeader
      label={label}
      dataColumnKey={columnKey}
      activeSort={sortState?.key === columnKey ? sortState?.order : null}
      onSortAsc={() => onSort?.(columnKey, 'asc')}
      onSortDesc={() => onSort?.(columnKey, 'desc')}
      columns={FILTER_COLUMNS.map((column) => ({
        ...column,
        visible: visibleColumns?.[column.key] !== false,
        locked: !canToggleColumn(column.key),
      }))}
      onToggleColumn={onToggleVisibleColumn}
      filterValue={draftFilters?.[columnKey] ?? ''}
      onFilterValueChange={(value) => setDraftFilters((current) => ({ ...current, [columnKey]: value }))}
      onFilterApply={() => onFilterApply?.(columnKey, draftFilters?.[columnKey] ?? '')}
      onFilterClear={() => {
        setDraftFilters((current) => ({ ...current, [columnKey]: '' }));
        onFilterClear?.(columnKey);
      }}
      activeFilter={Boolean(String(filters?.[columnKey] ?? '').trim())}
    />
  );

  const columns = BASE_COLUMNS.map((column) => ({
    key: column.key,
    title: renderHeader(column.key, column.key === 'apresentacao' ? 'Apresenta��o' : column.key.charAt(0).toUpperCase() + column.key.slice(1)),
    dataIndex: column.key,
    width: column.width,
    render: renderText,
  }));
  const resolvedColumns = columns.filter((column) => visibleColumns?.[column.key] !== false);
  const tableColumns = resolvedColumns.length > 0 ? resolvedColumns : columns;
  const selectedRowKeys = selectedId ? [selectedId] : [];
  const scrollX = BASE_COLUMNS.reduce((sum, column) => sum + column.width, 0) + 28;

  return (
    <div className="medicamentos-table-frame">
      <BranaTable
        className="module-table auxiliary-compact-table medicamentos-table"
        dataSource={items}
        columns={tableColumns}
        rowKey="id"
        loading={loading}
        pagination={false}
        size="small"
        sticky
        tableLayout="fixed"
        scroll={{ x: scrollX, y: 480 }}
        rowSelection={{
          type: 'radio',
          selectedRowKeys,
          onChange: (keys) => onSelect?.(keys[0] ?? null),
        }}
        locale={{
          emptyText: 'Nenhum medicamento encontrado.',
        }}
        onRow={(record) => ({
          onClick: () => onSelect?.(record.id),
          'data-row-id': record.id,
          'aria-selected': Number(record.id) === Number(selectedId),
        })}
      />
      <div className="medicamentos-table-footer" aria-live="polite">
        <Typography.Text type="secondary">{footerLabel}</Typography.Text>
      </div>
    </div>
  );
}
