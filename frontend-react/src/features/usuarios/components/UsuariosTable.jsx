import { Table } from 'antd';

export function UsuariosTable({ rows, loading, selectedUserId, onSelect, onDoubleClick }) {
  const columns = [
    { title: 'Nome do usuário', dataIndex: 'nome', key: 'nome', width: 300, ellipsis: true },
    { title: 'Apelido', dataIndex: 'apelido', key: 'apelido', ellipsis: true },
    { title: 'Tipo', dataIndex: 'tipo_usuario', key: 'tipo_usuario', ellipsis: true },
    { title: 'Conectado', key: 'online', width: 105, align: 'center', render: (_, row) => row.online ? 'Sim' : 'Não' },
    { title: 'Status', key: 'ativo', width: 82, align: 'center', render: (_, row) => <span className={`usuarios-status-dot ${row.ativo ? 'is-active' : 'is-inactive'}`} title={row.ativo ? 'Ativo' : 'Inativo'} aria-label={row.ativo ? 'Status ativo' : 'Status inativo'}>●</span> },
  ];
  return <Table className="usuarios-main-table auxiliary-compact-table" rowKey="id" loading={loading} dataSource={rows} columns={columns} pagination={false} size="small" tableLayout="fixed" rowClassName={(row) => Number(row.id) === Number(selectedUserId) ? 'users-table-row-selected' : ''} rowSelection={{ type: 'radio', selectedRowKeys: selectedUserId ? [selectedUserId] : [], onChange: (keys) => onSelect(keys[0] ?? null) }} onRow={(row) => ({ onClick: () => onSelect(row.id), onDoubleClick: () => onDoubleClick?.(row) })} scroll={{ x: 760, y: 'calc(100vh - 250px)' }} />;
}
