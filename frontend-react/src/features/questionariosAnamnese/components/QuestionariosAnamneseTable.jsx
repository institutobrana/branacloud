import { Empty, Typography } from 'antd';
import { BranaTable } from '../../../components/BranaTable.jsx';

export function QuestionariosAnamneseTable({
  perguntas,
  loading,
  selectedId,
  onSelect,
  tableScrollY,
  footerLabel,
}) {
  const columns = [
    {
      title: 'Nº',
      dataIndex: 'numero',
      key: 'numero',
      width: 86,
      align: 'center',
      render: (value) => <Typography.Text>{value ?? '-'}</Typography.Text>,
    },
    {
      title: 'Texto da pergunta',
      dataIndex: 'texto',
      key: 'texto',
      render: (value) => <Typography.Text>{value || '-'}</Typography.Text>,
    },
  ];

  return (
    <div className="questionarios-anamnese-table-shell">
      <div className="questionarios-anamnese-table-frame">
        <div className="questionarios-anamnese-table-grid" role="grid" aria-label="Listagem de perguntas de anamnese">
          <BranaTable
            rowKey="id"
            size="small"
            sticky
            tableLayout="fixed"
            scroll={{ y: tableScrollY }}
            pagination={false}
            loading={loading}
            dataSource={perguntas}
            columns={columns}
            className="module-table auxiliary-compact-table questionarios-anamnese-table"
            rowSelection={{
              type: 'radio',
              selectedRowKeys: selectedId === null || selectedId === undefined ? [] : [selectedId],
              onChange: (keys) => {
                const nextKey = keys[0] ?? null;
                onSelect?.(nextKey);
              },
            }}
            onRow={(record) => ({
              onClick: () => onSelect?.(record.id),
              className: Number(record.id) === Number(selectedId) ? 'is-selected' : '',
              'aria-selected': Number(record.id) === Number(selectedId),
            })}
            locale={{
              emptyText: <Empty description="Nenhuma pergunta disponivel para o questionario selecionado." />,
            }}
          />
        </div>
        <div className="questionarios-anamnese-table-footer" aria-live="polite">
          <Typography.Text type="secondary">{footerLabel}</Typography.Text>
        </div>
      </div>
    </div>
  );
}
