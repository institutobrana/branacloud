import { Typography } from 'antd';

import { BranaTable } from '../../components/BranaTable.jsx';
import { getPrestadoresColumns } from './prestadoresColumns.js';

export function PrestadoresTable({ selectedId }) {
  const columns = getPrestadoresColumns().map((column) => ({
    key: column.key,
    title: column.label,
    dataIndex: column.key,
    width: column.key === 'nome' ? 320 : 120,
    ellipsis: true,
    render: (value) => <span title={value || ''}>{value || '-'}</span>,
  }));

  return (
    <div className="prestadores-table-shell">
      <div className="prestadores-table-frame">
        <div className="prestadores-table-grid" role="grid" aria-label="Lista de corpo clínico">
          <BranaTable
            rowKey="id"
            className="module-table auxiliary-compact-table prestadores-table"
            loading={false}
            pagination={false}
            size="small"
            tableLayout="fixed"
            scroll={{ y: 480 }}
            dataSource={[]}
            columns={columns}
            rowSelection={{
              type: 'radio',
              selectedRowKeys: selectedId ? [selectedId] : [],
            }}
            locale={{ emptyText: 'Nenhum prestador cadastrado.' }}
          />
        </div>

        <div className="prestadores-table-footer" aria-live="polite">
          <Typography.Text type="secondary">0 prestadores</Typography.Text>
        </div>
      </div>
    </div>
  );
}

