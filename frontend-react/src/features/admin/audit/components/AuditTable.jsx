import { Tag, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { BranaTable } from '../../../../components/BranaTable.jsx';
import { TableColumnFilterHeader } from '../../../../components/TableColumnFilterHeader.jsx';
import { ADMIN_AUDIT_FILTER_COLUMNS, ADMIN_AUDIT_TABLE_SCROLL_Y } from '../constants/adminAuditColumns.js';
import { formatAdminAuditAction, formatAdminAuditActor, formatAdminAuditDate, formatAdminAuditTarget } from '../utils/adminAuditFormatters.js';

export function AuditTable({
  rows,
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
  emptyText = 'Nenhum evento encontrado.',
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
      columns={ADMIN_AUDIT_FILTER_COLUMNS.map((column) => ({
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
      activeFilter={Boolean(String(filters?.[columnKey] ?? '').trim()) || sortState?.key === columnKey}
    />
  );

  const allColumns = useMemo(
    () => [
      {
        title: renderHeader('id', 'ID'),
        dataIndex: 'id',
        key: 'id',
        width: 74,
        visible: visibleColumns?.id !== false,
        render: (value) => <Typography.Text strong>{value || '-'}</Typography.Text>,
      },
      {
        title: renderHeader('criadoEm', 'Data'),
        dataIndex: 'criadoEm',
        key: 'criadoEm',
        width: 156,
        visible: visibleColumns?.criadoEm !== false,
        render: (value) => formatAdminAuditDate(value),
      },
      {
        title: renderHeader('acao', 'Ação'),
        dataIndex: 'acao',
        key: 'acao',
        width: 260,
        visible: visibleColumns?.acao !== false,
        ellipsis: true,
        render: (value) => <Typography.Text>{formatAdminAuditAction(value)}</Typography.Text>,
      },
      {
        title: renderHeader('actorEmail', 'Autor'),
        dataIndex: 'actorEmail',
        key: 'actorEmail',
        width: 260,
        visible: visibleColumns?.actorEmail !== false,
        ellipsis: true,
        render: (value) => <Typography.Text>{formatAdminAuditActor(value)}</Typography.Text>,
      },
      {
        title: renderHeader('alvo', 'Alvo'),
        key: 'alvo',
        width: 240,
        visible: visibleColumns?.alvo !== false,
        ellipsis: true,
        render: (_, record) => (
          <div className="admin-audit-target-cell">
            <Typography.Text>{formatAdminAuditTarget(record.alvoTipo, record.alvoId)}</Typography.Text>
            {record.ip ? <Tag>{record.ip}</Tag> : null}
          </div>
        ),
      },
    ],
    [draftFilters, filters, onFilterApply, onFilterClear, onSort, onToggleVisibleColumn, sortState, visibleColumns],
  );

  const resolvedColumns = useMemo(() => allColumns.filter((column) => column.visible), [allColumns]);

  return (
    <div className="admin-audit-table-shell">
      <div className="admin-audit-table-frame">
        <div className="admin-audit-table-grid" role="grid" aria-label="Listagem de auditoria">
          <BranaTable
            rowKey="id"
            size="small"
            sticky
            tableLayout="fixed"
            scroll={{ y: ADMIN_AUDIT_TABLE_SCROLL_Y }}
            pagination={false}
            loading={loading}
            dataSource={rows}
            columns={resolvedColumns}
            className="module-table auxiliary-compact-table admin-audit-table"
            rowSelection={{
              type: 'radio',
              selectedRowKeys: selectedId === null || selectedId === undefined ? [] : [selectedId],
              onChange: (keys) => {
                const nextKey = keys[0] ?? null;
                onSelect?.(nextKey === null ? null : Number(nextKey));
              },
            }}
            onRow={(record) => ({
              onClick: () => onSelect?.(record.id),
              className: Number(record.id) === Number(selectedId) ? 'is-selected' : '',
              'data-row-id': record.id,
              'aria-selected': Number(record.id) === Number(selectedId),
            })}
            locale={{ emptyText }}
          />
        </div>
        <div className="admin-audit-table-footer" aria-live="polite">
          <Typography.Text type="secondary">{footerLabel}</Typography.Text>
        </div>
      </div>
    </div>
  );
}
