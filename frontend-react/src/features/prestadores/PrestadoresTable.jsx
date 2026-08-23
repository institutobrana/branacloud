import { Alert, Typography } from 'antd';

import { BranaTable } from '../../components/BranaTable.jsx';
import { TableColumnFilterHeader } from '../../components/TableColumnFilterHeader.jsx';
import { getPrestadoresColumns } from './prestadoresColumns.js';

const TABLE_SCROLL_Y = 480;
const PRESTADORES_FILTER_DEBUG = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

function renderStatus(ativo) {
  const isActive = Boolean(ativo);
  return (
    <span title={isActive ? 'Ativo' : 'Inativo'} aria-label={isActive ? 'Prestador ativo' : 'Prestador inativo'}>
      <span style={{ color: isActive ? '#2fbf2f' : '#d32f2f', fontSize: '14px', lineHeight: 1 }}>●</span>
    </span>
  );
}

export function PrestadoresTable({ items = [], selectedId, loading, error, footerLabel, onSelect, onDoubleClick }) {
  const columnsConfig = getPrestadoresColumns();
  if (PRESTADORES_FILTER_DEBUG) {
    // TEMP DEBUG — remover após diagnóstico do filtro de Prestadores
    console.info('[PRESTADORES_FILTER_DEBUG] TABLE_DATASOURCE', {
      itemsCount: Array.isArray(items) ? items.length : 0,
      codes: Array.isArray(items) ? items.map((item) => String(item?.codigo ?? '').trim()) : [],
    });
    console.info('[PRESTADORES_FILTER_DEBUG] FOOTER', {
      label: String(footerLabel || '0 prestadores'),
      filteredCount: Array.isArray(items) ? items.length : 0,
    });
  }

  const renderHeader = (columnKey, label) => (
    <TableColumnFilterHeader
      label={label}
      dataColumnKey={columnKey}
      columns={columnsConfig.map((column) => ({
        ...column,
        visible: true,
        locked: true,
      }))}
      onToggleColumn={() => {}}
      filterValue=""
      onFilterValueChange={() => {}}
      onFilterApply={() => {}}
      onFilterClear={() => {}}
      activeFilter={false}
    />
  );

  const columns = [
    {
      key: 'codigo',
      title: renderHeader('codigo', 'Código'),
      dataIndex: 'codigo',
      width: 74,
      render: (value) => <Typography.Text strong>{value || '-'}</Typography.Text>,
    },
    {
      key: 'nome',
      title: renderHeader('nome', 'Nome'),
      dataIndex: 'nome',
      width: 336,
      ellipsis: true,
      render: (value) => <span title={value || ''}>{value || '-'}</span>,
    },
    {
      key: 'fone1',
      title: renderHeader('fone1', 'Fone 1'),
      dataIndex: 'fone1',
      width: 128,
      align: 'center',
      render: (value) => <span title={value || ''}>{value || '-'}</span>,
    },
    {
      key: 'fone2',
      title: renderHeader('fone2', 'Fone 2'),
      dataIndex: 'fone2',
      width: 128,
      align: 'center',
      render: (value) => <span title={value || ''}>{value || '-'}</span>,
    },
    {
      key: 'status',
      title: renderHeader('status', 'Status'),
      dataIndex: 'ativo',
      width: 100,
      align: 'center',
      render: (value) => renderStatus(value),
    },
  ];

  return (
    <div className="servicos-protetico-table-shell prestadores-table-shell">
      <div className="servicos-protetico-table-frame prestadores-table-frame">
        <div className="servicos-protetico-table-grid prestadores-table-grid" role="grid" aria-label="Listagem de corpo clínico">
          <BranaTable
            rowKey="id"
            className="module-table auxiliary-compact-table servicos-protetico-table prestadores-table"
            loading={loading}
            pagination={false}
            size="small"
            tableLayout="fixed"
            scroll={{ y: TABLE_SCROLL_Y }}
            dataSource={items}
            columns={columns}
            rowSelection={{
              type: 'radio',
              selectedRowKeys: selectedId ? [selectedId] : [],
              onChange: (keys) => onSelect?.(Number(keys[0] || 0) || null),
            }}
            onRow={(record) => ({
              role: 'row',
              'aria-selected': Number(record.id) === Number(selectedId),
              onClick: () => onSelect?.(Number(record.id) || null),
              onDoubleClick: () => onDoubleClick?.(record),
            })}
            locale={{ emptyText: error ? <Alert type="error" message={error} showIcon /> : 'Nenhum prestador cadastrado.' }}
          />
        </div>

        <div className="servicos-protetico-table-footer prestadores-table-footer" aria-live="polite">
          <Typography.Text type="secondary">{footerLabel || '0 prestadores'}</Typography.Text>
        </div>
      </div>
    </div>
  );
}
