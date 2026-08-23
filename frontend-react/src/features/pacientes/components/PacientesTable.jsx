import { Empty, Spin, Tag, Typography } from 'antd';
import { BranaTable } from '../../../components/BranaTable.jsx';

export function PacientesTable({
  items,
  loading,
  error,
  selectedId,
  selectedRowKeys,
  count,
  onSelect,
}) {
  const columns = [
    {
      key: 'nome',
      title: 'Nome',
      dataIndex: 'nome',
      ellipsis: true,
      render: (value) => <span title={value || ''}>{value || '-'}</span>,
    },
    {
      key: 'codigo',
      title: 'Número',
      dataIndex: 'codigo',
      width: 120,
      align: 'center',
      render: (value) => <Typography.Text strong>{value ?? '-'}</Typography.Text>,
    },
  ];

  return (
    <div className="pacientes-table-shell">
      {error ? <div className="pacientes-table-error"><Tag color="red">Erro</Tag><Typography.Text type="danger">{error}</Typography.Text></div> : null}
      <div className="module-table-shell">
        <div className="users-grid-shell pacientes-grid-shell" role="grid" aria-label="Listagem de pacientes">
          <BranaTable
            rowKey="id"
            className="module-table auxiliary-compact-table pacientes-table"
            loading={loading}
            pagination={false}
            size="small"
            tableLayout="fixed"
            scroll={{ y: 480 }}
            dataSource={items}
            columns={columns}
            rowClassName={(record) => (Number(record.id) === Number(selectedId) ? 'users-table-row-selected' : '')}
            rowSelection={{
              type: 'radio',
              selectedRowKeys: selectedRowKeys || [],
              onChange: (keys, rows) => onSelect?.(rows?.[0] || null),
            }}
            onRow={(record) => ({
              role: 'row',
              'aria-selected': Number(record.id) === Number(selectedId),
              'data-row-id': record.id,
              'data-selected': Number(record.id) === Number(selectedId) ? 'true' : 'false',
              onClick: () => onSelect?.(record),
              onDoubleClick: () => onSelect?.(record),
            })}
            locale={{
              emptyText: loading ? (
                <div className="pacientes-state">
                  <Spin />
                  <Typography.Text type="secondary">Carregando pacientes...</Typography.Text>
                </div>
              ) : (
                <Empty description="Nenhum paciente encontrado." />
              ),
            }}
          />
        </div>
      </div>

      <div className="pacientes-table-footer" aria-live="polite">
        <Typography.Text type="secondary">{count} {count === 1 ? 'paciente' : 'pacientes'}</Typography.Text>
      </div>
    </div>
  );
}
