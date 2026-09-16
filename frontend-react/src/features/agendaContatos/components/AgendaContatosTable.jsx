import { Alert, Spin, Typography } from 'antd';
import { BranaTable } from '../../../components/BranaTable.jsx';
import { telefoneAgendaContato } from '../normalizers/agendaContatosNormalizers.js';

export function AgendaContatosTable({ items, selectedId, loading, error, onRetry, onSelect, onDoubleClick }) {
  const columns = [
    { title: 'Nome', dataIndex: 'nome', key: 'nome', ellipsis: true },
    { title: 'Tipo', dataIndex: 'tipo', key: 'tipo', width: 180, ellipsis: true },
    { title: 'Telefones', key: 'telefones', width: 300, ellipsis: true, render: (_, item) => <span title={telefoneAgendaContato(item)}>{telefoneAgendaContato(item)}</span> },
  ];
  return (
    <div className="agenda-contatos-content agenda-contatos-table-shell">
      {error ? <Alert type="error" showIcon message="Falha ao carregar Agenda de contatos." action={<button type="button" className="agenda-contatos-retry" onClick={onRetry}>Tentar novamente</button>} /> : null}
      <div className="agenda-contatos-table-frame">
        <div className="agenda-contatos-table-grid" role="grid" aria-label="Listagem de contatos">
          <BranaTable
          rowKey="id"
          className="module-table auxiliary-compact-table agenda-contatos-table"
          loading={{ spinning: loading, indicator: <Spin /> }}
          pagination={false}
          size="small"
          tableLayout="fixed"
          scroll={{ y: 480, x: 620 }}
          dataSource={items}
          columns={columns}
          rowClassName={(record) => (Number(record.id) === Number(selectedId) ? 'users-table-row-selected' : '')}
          rowSelection={{ type: 'radio', selectedRowKeys: selectedId ? [selectedId] : [], onChange: (keys) => onSelect(Number(keys[0] || 0) || null) }}
          onRow={(record) => ({ role: 'row', 'aria-selected': Number(record.id) === Number(selectedId), 'data-row-id': record.id, 'data-selected': Number(record.id) === Number(selectedId) ? 'true' : 'false', onClick: () => onSelect(Number(record.id) || null), onDoubleClick: () => onDoubleClick(record) })}
          locale={{ emptyText: loading ? ' ' : 'Nenhum contato encontrado.' }}
          />
        </div>
        <div className="agenda-contatos-table-footer" aria-live="polite">
          <Typography.Text type="secondary">{items.length} contatos</Typography.Text>
        </div>
      </div>
    </div>
  );
}
