import { LockOutlined } from '@ant-design/icons';
import { Tag, Tooltip, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { BranaTable } from '../../../../components/BranaTable.jsx';
import { TableColumnFilterHeader } from '../../../../components/TableColumnFilterHeader.jsx';
import {
  ADMIN_USERS_FILTER_COLUMNS,
  ADMIN_USERS_TABLE_SCROLL_Y,
} from '../constants/adminUsersColumns.js';
import {
  adminUserPresenceTagColor,
  adminUserStatusTagColor,
  formatAdminUserDate,
  formatAdminUserPresence,
  formatAdminUserPresenceTooltip,
  formatAdminUserProfile,
  formatAdminUserSetupStatus,
  formatAdminUserStatus,
  normalizeAdminUserPlanLabel,
} from '../utils/adminUsersFormatters.js';

export const ADMIN_USERS_TABLE_COLUMNS = ADMIN_USERS_FILTER_COLUMNS.map((column) => column.label);

export function UsersTable({
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
      columns={ADMIN_USERS_FILTER_COLUMNS.map((column) => ({
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
        title: renderHeader('nome', 'Nome'),
        dataIndex: 'nome',
        key: 'nome',
        width: 210,
        visible: visibleColumns?.nome !== false,
        ellipsis: true,
        render: (value, record) => (
          <div className="admin-users-name-cell">
            <Typography.Text strong>{value || 'Usuário não identificado'}</Typography.Text>
            {record.isSystemUser ? (
              <Typography.Text type="secondary">
                <LockOutlined /> Usuário de sistema
              </Typography.Text>
            ) : null}
          </div>
        ),
      },
      {
        title: renderHeader('email', 'E-mail'),
        dataIndex: 'email',
        key: 'email',
        width: 250,
        visible: visibleColumns?.email !== false,
        ellipsis: true,
        render: (value) => value || '-',
      },
      {
        title: renderHeader('clinica', 'Clínica'),
        dataIndex: 'clinicaNome',
        key: 'clinica',
        width: 220,
        visible: visibleColumns?.clinica !== false,
        ellipsis: true,
        render: (value, record) => (
          <div className="admin-users-clinic-cell">
            <Typography.Text>{value || 'Clínica não identificada'}</Typography.Text>
            <Typography.Text type="secondary">{record.clinicaId ? `#${record.clinicaId}` : '-'}</Typography.Text>
          </div>
        ),
      },
      {
        title: renderHeader('clinicaEmail', 'E-mail clínica'),
        dataIndex: 'clinicaEmail',
        key: 'clinicaEmail',
        width: 240,
        visible: visibleColumns?.clinicaEmail !== false,
        ellipsis: true,
        render: (value) => value || '-',
      },
      {
        title: renderHeader('plano', 'Plano'),
        dataIndex: 'clinicaPlano',
        key: 'plano',
        width: 126,
        visible: visibleColumns?.plano !== false,
        render: (value) => normalizeAdminUserPlanLabel(value),
      },
      {
        title: renderHeader('perfil', 'Perfil'),
        key: 'perfil',
        width: 138,
        visible: visibleColumns?.perfil !== false,
        render: (_, record) => formatAdminUserProfile(record),
      },
      {
        title: renderHeader('status', 'Status'),
        dataIndex: 'ativo',
        key: 'status',
        width: 116,
        visible: visibleColumns?.status !== false,
        render: (value) => <Tag color={adminUserStatusTagColor(value)}>{formatAdminUserStatus(value)}</Tag>,
      },
      {
        title: renderHeader('online', 'Online'),
        key: 'online',
        width: 142,
        visible: visibleColumns?.online !== false,
        render: (_, record) => (
          <Tooltip title={formatAdminUserPresenceTooltip(record)}>
            <Tag color={adminUserPresenceTagColor(record)}>{formatAdminUserPresence(record)}</Tag>
          </Tooltip>
        ),
      },
      {
        title: renderHeader('setup', 'Primeiro acesso'),
        dataIndex: 'setupCompleted',
        key: 'setup',
        width: 150,
        visible: visibleColumns?.setup !== false,
        render: (value) => formatAdminUserSetupStatus(value),
      },
      {
        title: renderHeader('trialAte', 'Trial até'),
        dataIndex: 'clinicaTrialAte',
        key: 'trialAte',
        width: 130,
        visible: visibleColumns?.trialAte !== false,
        render: (value) => formatAdminUserDate(value),
      },
    ],
    [draftFilters, filters, sortState, visibleColumns],
  );

  const resolvedColumns = useMemo(() => allColumns.filter((column) => column.visible), [allColumns]);

  return (
    <div className="admin-users-table-shell">
      <div className="admin-users-table-frame">
        <div className="admin-users-table-grid" role="grid" aria-label="Listagem de usuários">
          <BranaTable
            rowKey="id"
            size="small"
            sticky
            tableLayout="fixed"
            scroll={{ y: ADMIN_USERS_TABLE_SCROLL_Y }}
            pagination={false}
            loading={loading}
            dataSource={rows}
            columns={resolvedColumns}
            className="module-table auxiliary-compact-table admin-users-table"
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
            locale={{ emptyText: 'Nenhum usuário encontrado.' }}
          />
        </div>
        <div className="admin-users-table-footer" aria-live="polite">
          <Typography.Text type="secondary">{footerLabel}</Typography.Text>
        </div>
      </div>
    </div>
  );
}
