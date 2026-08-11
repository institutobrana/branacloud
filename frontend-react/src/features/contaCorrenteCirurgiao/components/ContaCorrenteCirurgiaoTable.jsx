import { Typography } from 'antd';

import { BranaTable } from '../../../components/BranaTable.jsx';
import { formatMoney } from '../../servicosProtetico/utils/servicosProteticoFormatters.js';

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('pt-BR');
}

function renderMoney(value, isDebit = false) {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount) || amount === 0) return '-';
  const className = isDebit ? 'conta-corrente-cirurgiao-cell-debit' : 'conta-corrente-cirurgiao-cell-credit';
  return <Typography.Text className={className}>{formatMoney(amount)}</Typography.Text>;
}

export function ContaCorrenteCirurgiaoTable({
  items,
  selectedId,
  onSelect,
  onDoubleClick,
}) {
  const selectedKeys = selectedId == null ? [] : [String(selectedId)];

  return (
    <div className="conta-corrente-cirurgiao-table-shell">
      <BranaTable
        className="module-table auxiliary-compact-table conta-corrente-cirurgiao-table"
        rowKey={(record) => String(record.id)}
        dataSource={items}
        pagination={false}
        size="small"
        tableLayout="fixed"
        sticky
        scroll={{ y: 520 }}
        locale={{ emptyText: 'Nenhum lançamento para exibir.' }}
        columns={[
          {
            key: 'data',
            title: 'Data',
            dataIndex: 'data_lancamento',
            width: 120,
            render: (value) => <span className="conta-corrente-cirurgiao-cell-date">{formatDate(value)}</span>,
          },
          {
            key: 'lancamento',
            title: 'Lançamento',
            dataIndex: 'categoria_nome',
            width: 180,
            render: (value) => <span title={value || ''}>{value || '-'}</span>,
          },
          {
            key: 'historico',
            title: 'Histórico',
            dataIndex: 'historico',
            ellipsis: true,
            render: (value) => <span title={value || ''}>{value || '-'}</span>,
          },
          {
            key: 'debito',
            title: 'Débito',
            dataIndex: 'valor',
            width: 120,
            align: 'right',
            render: (value, record) => (String(record?.tipo || '').toUpperCase() === 'D' ? renderMoney(value, true) : '-'),
          },
          {
            key: 'credito',
            title: 'Crédito',
            dataIndex: 'valor',
            width: 120,
            align: 'right',
            render: (value, record) => (String(record?.tipo || '').toUpperCase() === 'C' ? renderMoney(value, false) : '-'),
          },
        ]}
        rowClassName={(record, index) => {
          const isSelected = String(record.id) === String(selectedId ?? '');
          const isDebit = String(record?.tipo || '').toUpperCase() === 'D';
          return [
            isSelected ? 'users-table-row-selected' : '',
            isDebit ? 'conta-corrente-cirurgiao-row-debit' : 'conta-corrente-cirurgiao-row-credit',
            index % 2 === 0 ? 'brana-table-row-even' : 'brana-table-row-odd',
          ].filter(Boolean).join(' ');
        }}
        rowSelection={{
          type: 'radio',
          selectedRowKeys: selectedKeys,
          onChange: (keys) => onSelect?.(keys[0] ?? null),
        }}
        onRow={(record) => ({
          role: 'row',
          'aria-selected': String(record.id) === String(selectedId ?? ''),
          onClick: () => onSelect?.(record.id),
          onDoubleClick: () => onDoubleClick?.(record),
        })}
      />
    </div>
  );
}
