import { Typography } from 'antd';
import { useEffect, useState } from 'react';

import { BranaTable } from '../../components/BranaTable.jsx';
import { TableColumnFilterHeader } from '../../components/TableColumnFilterHeader.jsx';
import { getPrestadoresColumns } from './prestadoresColumns.js';

const TABLE_SCROLL_Y = 480;

export function PrestadoresTable({ selectedId }) {
  const [draftFilters, setDraftFilters] = useState({
    codigo: '',
    nome: '',
    fone1: '',
    fone2: '',
    status: '',
  });

  const columnsConfig = getPrestadoresColumns();

  useEffect(() => {
    setDraftFilters({
      codigo: '',
      nome: '',
      fone1: '',
      fone2: '',
      status: '',
    });
  }, []);

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
      filterValue={draftFilters[columnKey] ?? ''}
      onFilterValueChange={(value) => setDraftFilters((current) => ({ ...current, [columnKey]: value }))}
      onFilterApply={() => {}}
      onFilterClear={() => setDraftFilters((current) => ({ ...current, [columnKey]: '' }))}
      activeFilter={Boolean(String(draftFilters[columnKey] ?? '').trim())}
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
      dataIndex: 'status',
      width: 100,
      align: 'center',
      render: (value) => <span title={value || ''}>{value || '-'}</span>,
    },
  ];

  const footerLabel = '0 prestadores';

  return (
    <div className="servicos-protetico-table-shell prestadores-table-shell">
      <div className="servicos-protetico-table-frame prestadores-table-frame">
        <div className="servicos-protetico-table-grid prestadores-table-grid" role="grid" aria-label="Listagem de corpo clínico">
          <BranaTable
            rowKey="id"
            className="module-table auxiliary-compact-table servicos-protetico-table prestadores-table"
            loading={false}
            pagination={false}
            size="small"
            tableLayout="fixed"
            scroll={{ y: TABLE_SCROLL_Y }}
            dataSource={[]}
            columns={columns}
            rowSelection={{
              type: 'radio',
              selectedRowKeys: selectedId ? [selectedId] : [],
            }}
            locale={{ emptyText: null }}
          />
        </div>

        <div className="servicos-protetico-table-footer prestadores-table-footer" aria-live="polite">
          <Typography.Text type="secondary">{footerLabel}</Typography.Text>
        </div>
      </div>
    </div>
  );
}
