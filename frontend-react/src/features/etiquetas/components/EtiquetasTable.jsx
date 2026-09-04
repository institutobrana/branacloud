import { Typography } from 'antd';
import { BranaTable } from '../../../components/BranaTable.jsx';

export function EtiquetasTable({ modelos, loading, selectedId, onSelect, onDoubleClickEdit }) {
  const columns = [
    { title: 'Nome do modelo', dataIndex: 'nome', key: 'nome' },
    { title: 'Arquivo de modelo', dataIndex: 'nome_arquivo', key: 'nome_arquivo' },
    { title: 'Padrão', dataIndex: 'padrao_nome', key: 'padrao_nome', render: (value) => value || 'Definido pelo usuário' },
  ];
  return (
    <div className="etiquetas-table-shell">
      <BranaTable
        rowKey="id" loading={loading} pagination={false} size="small" dataSource={modelos}
        columns={columns} className="module-table auxiliary-compact-table etiquetas-table"
        rowClassName={(record) => Number(record.id) === Number(selectedId) ? 'users-table-row-selected' : ''}
        rowSelection={{ type: 'radio', selectedRowKeys: selectedId ? [selectedId] : [], onChange: (keys) => onSelect(keys[0] || null) }}
        onRow={(record) => ({ role: 'row', 'aria-selected': Number(record.id) === Number(selectedId), onClick: () => onSelect(record.id), onDoubleClick: () => onDoubleClickEdit(record) })}
        locale={{ emptyText: 'Nenhum modelo de etiqueta cadastrado.' }}
      />
      <div className="etiquetas-table-footer" aria-live="polite"><Typography.Text type="secondary">{modelos.length} {modelos.length === 1 ? 'etiqueta' : 'etiquetas'}</Typography.Text></div>
    </div>
  );
}
