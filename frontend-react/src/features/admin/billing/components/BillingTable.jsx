import { Tag, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { BranaTable } from '../../../../components/BranaTable.jsx';
import { TableColumnFilterHeader } from '../../../../components/TableColumnFilterHeader.jsx';
import { ADMIN_BILLING_FILTER_COLUMNS, ADMIN_BILLING_TABLE_SCROLL_Y } from '../constants/adminBillingColumns.js';
import {
  adminBillingStatusTagColor,
  formatAdminBillingDate,
  formatAdminBillingMoney,
  formatAdminBillingPlan,
  formatAdminBillingStatus,
} from '../utils/adminBillingFormatters.js';

export const ADMIN_BILLING_TABLE_COLUMNS = ADMIN_BILLING_FILTER_COLUMNS.map((column) => column.label);

export function BillingTable({
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
  emptyText = 'Nenhuma cobrança encontrada.',
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
      columns={ADMIN_BILLING_FILTER_COLUMNS.map((column) => ({
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
        title: renderHeader('clinica', 'Clínica'),
        dataIndex: 'clinicaNome',
        key: 'clinica',
        width: 250,
        visible: visibleColumns?.clinica !== false,
        ellipsis: true,
        render: (value, record) => (
          <div className="admin-billing-clinic-cell">
            <Typography.Text>{value || 'Clínica não identificada'}</Typography.Text>
            <Typography.Text type="secondary">{record.clinicaId ? `#${record.clinicaId}` : '-'}</Typography.Text>
          </div>
        ),
      },
      {
        title: renderHeader('plano', 'Plano'),
        dataIndex: 'plano',
        key: 'plano',
        width: 126,
        visible: visibleColumns?.plano !== false,
        render: (value) => formatAdminBillingPlan(value),
      },
      {
        title: renderHeader('status', 'Status'),
        dataIndex: 'status',
        key: 'status',
        width: 150,
        visible: visibleColumns?.status !== false,
        render: (value) => <Tag color={adminBillingStatusTagColor(value)}>{formatAdminBillingStatus(value)}</Tag>,
      },
      {
        title: renderHeader('valor', 'Valor'),
        key: 'valor',
        width: 126,
        visible: visibleColumns?.valor !== false,
        render: (_, record) => formatAdminBillingMoney(record.valor, record.moeda),
      },
      {
        title: renderHeader('origem', 'Origem'),
        dataIndex: 'origem',
        key: 'origem',
        width: 130,
        visible: visibleColumns?.origem !== false,
        render: (value) => value || '-',
      },
      {
        title: renderHeader('criadoEm', 'Data'),
        dataIndex: 'criadoEm',
        key: 'criadoEm',
        width: 156,
        visible: visibleColumns?.criadoEm !== false,
        render: (value) => formatAdminBillingDate(value),
      },
    ],
    [draftFilters, filters, sortState, visibleColumns],
  );

  const resolvedColumns = useMemo(() => allColumns.filter((column) => column.visible), [allColumns]);

  return (
    <div className="admin-billing-table-shell">
      <div className="admin-billing-table-frame">
        <div className="admin-billing-table-grid" role="grid" aria-label="Listagem de cobranças">
          <BranaTable
            rowKey="id"
            size="small"
            sticky
            tableLayout="fixed"
            scroll={{ y: ADMIN_BILLING_TABLE_SCROLL_Y }}
            pagination={false}
            loading={loading}
            dataSource={rows}
            columns={resolvedColumns}
            className="module-table auxiliary-compact-table admin-billing-table"
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
        <div className="admin-billing-table-footer" aria-live="polite">
          <Typography.Text type="secondary">{footerLabel}</Typography.Text>
        </div>
      </div>
    </div>
  );
}
