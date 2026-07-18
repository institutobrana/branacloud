import { Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';

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

export function MedicamentosTable({
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

  const allColumns = useMemo(
    () =>
      FILTER_COLUMNS.map((column) => ({
        key: column.key,
        title: renderHeader(column.key, column.label),
        dataIndex: column.key,
        width: column.key === 'nome' ? '48%' : column.key === 'grupo' ? '30%' : '22%',
        render: renderText,
        visible: visibleColumns?.[column.key] !== false,
        locked: !canToggleColumn(column.key),
      })),
    [visibleColumns, filters, draftFilters, sortState],
  );

  const resolvedColumns = useMemo(() => allColumns.filter((column) => column.visible), [allColumns]);

  function renderHeader(columnKey, label) {
    return (
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
        onFilterValueChange={(value) => {
          setDraftFilters((current) => ({ ...current, [columnKey]: value }));
        }}
        onFilterApply={() => onFilterApply?.(columnKey, draftFilters?.[columnKey] ?? '')}
        onFilterClear={() => {
          setDraftFilters((current) => ({ ...current, [columnKey]: '' }));
          onFilterClear?.(columnKey);
        }}
        activeFilter={Boolean(String(filters?.[columnKey] ?? '').trim())}
      />
    );
  }

  const selectedRowKeys = selectedId ? [selectedId] : [];

  return (
    <div className="medicamentos-table-frame">
      <BranaTable
        className="module-table auxiliary-compact-table medicamentos-table"
        dataSource={items}
        columns={resolvedColumns}
        rowKey="id"
        loading={loading}
        pagination={false}
        size="small"
        sticky
        tableLayout="fixed"
        scroll={{ y: 'calc(100vh - 258px)' }}
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
          className: Number(record.id) === Number(selectedId) ? 'is-selected' : '',
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
