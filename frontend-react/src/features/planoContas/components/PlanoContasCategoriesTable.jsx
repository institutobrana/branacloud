import { Typography } from 'antd';

import { BranaTable } from '../../../components/BranaTable.jsx';

export function PlanoContasCategoriesTable({ categories, selectedCategoryId, loading, onSelectCategory }) {
  const selectedKey = selectedCategoryId == null ? [] : [String(selectedCategoryId)];

  return (
    <BranaTable
      rowKey={(record) => String(record.id)}
      className="module-table auxiliary-compact-table plano-contas-table"
      loading={loading}
      pagination={false}
      size="small"
      tableLayout="fixed"
      dataSource={categories}
      columns={[
        {
          key: 'nome',
          title: 'Nome da categoria',
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
        {
          key: 'tributavel',
          title: 'Tributável',
          dataIndex: 'tributavel',
          width: 110,
          align: 'center',
          render: (value) => (value ? 'Sim' : 'Não'),
        },
      ]}
      rowSelection={{
        type: 'radio',
        selectedRowKeys: selectedKey,
        onChange: (keys) => onSelectCategory?.(keys[0] ?? null),
      }}
      rowClassName={(record) => (String(record.id) === String(selectedCategoryId ?? '') ? 'users-table-row-selected' : '')}
      onRow={(record) => ({
        role: 'row',
        'aria-selected': String(record.id) === String(selectedCategoryId ?? ''),
        onClick: () => onSelectCategory?.(record.id),
      })}
      locale={{ emptyText: 'Nenhuma categoria cadastrada para este grupo.' }}
    />
  );
}
