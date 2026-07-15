import { Typography } from 'antd';

import { BranaTable } from '../../../components/BranaTable.jsx';

export function PlanoContasGroupsTable({ groups, selectedGroupId, loading, onSelectGroup }) {
  const selectedKey = selectedGroupId == null ? [] : [String(selectedGroupId)];

  return (
    <BranaTable
      rowKey={(record) => String(record.id)}
      className="module-table auxiliary-compact-table plano-contas-table"
      loading={loading}
      pagination={false}
      size="small"
      tableLayout="fixed"
      dataSource={groups}
      columns={[
        {
          key: 'nome',
          title: 'Nome do grupo',
          dataIndex: 'nome',
          render: (value) => <Typography.Text strong>{value || '-'}</Typography.Text>,
        },
        {
          key: 'tipo',
          title: 'Tipo',
          dataIndex: 'tipo',
          width: 120,
          render: (value) => value || '-',
        },
      ]}
      rowSelection={{
        type: 'radio',
        selectedRowKeys: selectedKey,
        onChange: (keys) => onSelectGroup?.(keys[0] ?? null),
      }}
      rowClassName={(record) => (String(record.id) === String(selectedGroupId ?? '') ? 'users-table-row-selected' : '')}
      onRow={(record) => ({
        role: 'row',
        'aria-selected': String(record.id) === String(selectedGroupId ?? ''),
        onClick: () => onSelectGroup?.(record.id),
      })}
      locale={{ emptyText: 'Nenhum grupo cadastrado.' }}
    />
  );
}
