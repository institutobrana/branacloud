import { Tag, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { BranaTable } from '../../../../components/BranaTable.jsx';
import { TableColumnFilterHeader } from '../../../../components/TableColumnFilterHeader.jsx';
import {
  formatClinicDate,
  formatClinicStatus,
  formatClinicUsers,
  normalizePlanLabel,
  statusTagColor,
} from '../utils/adminClinicsFormatters.js';
import { ADMIN_CLINICS_FILTER_COLUMNS, ADMIN_CLINICS_TABLE_SCROLL_Y } from '../utils/adminClinicsTable.js';

export const ADMIN_CLINICS_TABLE_COLUMNS = ADMIN_CLINICS_FILTER_COLUMNS.map((column) => column.label);

export function ClinicsTable({
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
      columns={ADMIN_CLINICS_FILTER_COLUMNS.map((column) => ({
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
        width: 76,
        visible: visibleColumns?.id !== false,
        render: (value) => <Typography.Text strong>{value || '-'}</Typography.Text>,
      },
      {
        title: renderHeader('clinica', 'Clínica'),
        dataIndex: 'nome',
        key: 'clinica',
        width: 360,
        visible: visibleColumns?.clinica !== false,
        ellipsis: true,
        render: (value, record) => (
          <div className="admin-clinics-name-cell">
            <Typography.Text strong>{value || 'Clínica não identificada'}</Typography.Text>
            <Typography.Text type="secondary">{record.email || '-'}</Typography.Text>
          </div>
        ),
      },
      {
        title: renderHeader('usuarios', 'Usuários'),
        key: 'usuarios',
        width: 100,
        visible: visibleColumns?.usuarios !== false,
        render: (_, record) => formatClinicUsers(record.usuariosAtivos, record.usuariosTotal),
      },
      {
        title: renderHeader('plano', 'Plano'),
        dataIndex: 'tipoConta',
        key: 'plano',
        width: 130,
        visible: visibleColumns?.plano !== false,
        render: (value, record) => normalizePlanLabel(record.plano || value),
      },
      {
        title: renderHeader('trialAte', 'Trial até'),
        dataIndex: 'trialAte',
        key: 'trialAte',
        width: 130,
        visible: visibleColumns?.trialAte !== false,
        render: (value) => formatClinicDate(value),
      },
      {
        title: renderHeader('status', 'Status'),
        dataIndex: 'assinaturaStatus',
        key: 'status',
        width: 120,
        visible: visibleColumns?.status !== false,
        render: (value) => <Tag color={statusTagColor(value)}>{formatClinicStatus(value)}</Tag>,
      },
    ],
    [draftFilters, filters, sortState, visibleColumns],
  );

  const resolvedColumns = useMemo(() => allColumns.filter((column) => column.visible), [allColumns]);

  return (
    <div className="admin-clinics-table-shell">
      <div className="admin-clinics-table-frame">
        <div className="admin-clinics-table-grid" role="grid" aria-label="Listagem de clínicas">
          <BranaTable
            rowKey="id"
            size="small"
            sticky
            tableLayout="fixed"
            scroll={{ y: ADMIN_CLINICS_TABLE_SCROLL_Y }}
            pagination={false}
            loading={loading}
            dataSource={rows}
            columns={resolvedColumns}
            className="module-table auxiliary-compact-table admin-clinics-table"
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
            locale={{ emptyText: 'Nenhuma clínica encontrada.' }}
          />
        </div>
        <div className="admin-clinics-table-footer" aria-live="polite">
          <Typography.Text type="secondary">{footerLabel}</Typography.Text>
        </div>
      </div>
    </div>
  );
}
