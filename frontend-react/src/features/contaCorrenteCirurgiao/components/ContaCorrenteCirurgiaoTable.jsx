import { Typography } from 'antd';
import { useEffect, useRef } from 'react';

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

function isDebitTipo(tipo) {
  const normalized = String(tipo || '').trim().toLowerCase();
  return normalized === 'd' || normalized === 'debito' || normalized === 'débito';
}

function isCreditTipo(tipo) {
  const normalized = String(tipo || '').trim().toLowerCase();
  return normalized === 'c' || normalized === 'credito' || normalized === 'crédito';
}

function isSituacaoAberta(situacao) {
  const normalized = String(situacao || '').trim().toLowerCase();
  return normalized === 'aberto';
}

export function ContaCorrenteCirurgiaoTable({
  items,
  selectedId,
  onSelect,
  onDoubleClick,
}) {
  const selectedKeys = selectedId == null ? [] : [String(selectedId)];
  const shellRef = useRef(null);

  useEffect(() => {
    const root = shellRef.current;
    if (!root || selectedId == null) return;
    const row = root.querySelector(`tbody > tr[data-row-key="${CSS.escape(String(selectedId))}"]`);
    row?.scrollIntoView?.({ block: 'nearest' });
  }, [selectedId, items]);

  const isEditableTarget = (target) => {
    const tagName = target?.tagName?.toLowerCase?.() || '';
    return tagName === 'input' || tagName === 'textarea' || tagName === 'select' || target?.isContentEditable;
  };

  const moveSelection = (direction) => {
    if (!items.length) return;
    const currentIndex = items.findIndex((item) => String(item.id) === String(selectedId ?? ''));
    const fallbackIndex = direction > 0 ? -1 : items.length;
    const safeIndex = currentIndex < 0 ? fallbackIndex : currentIndex;
    const nextIndex = Math.min(items.length - 1, Math.max(0, safeIndex + direction));
    const nextRow = items[nextIndex];
    if (!nextRow) return;
    onSelect?.(nextRow.id);
  };

  const handleKeyDown = (event) => {
    if (isEditableTarget(event.target)) return;
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (event.key === 'ArrowDown') {
      moveSelection(1);
    } else {
      moveSelection(-1);
    }
  };

  return (
    <div
      ref={shellRef}
      className="conta-corrente-cirurgiao-table-shell"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseDown={() => shellRef.current?.focus?.()}
    >
      <BranaTable
        className="module-table auxiliary-compact-table conta-corrente-cirurgiao-table"
        rowKey={(record) => String(record.id)}
        dataSource={items}
        pagination={false}
        size="small"
        tableLayout="fixed"
        sticky
        scroll={{ y: 364 }}
        locale={{ emptyText: 'Nenhum lançamento para exibir.' }}
        columns={[
          {
            key: 'data',
            title: 'Data',
            dataIndex: 'data_lancamento',
            width: 120,
            onHeaderCell: () => ({ className: 'conta-corrente-cirurgiao-th-center' }),
            render: (value) => (
              <span className="conta-corrente-cirurgiao-cell-date conta-corrente-cirurgiao-cell-date-center">
                {formatDate(value)}
              </span>
            ),
          },
          {
            key: 'lancamento',
            title: 'Lançamento',
            dataIndex: 'categoria_nome',
            width: 180,
            onHeaderCell: () => ({ className: 'conta-corrente-cirurgiao-th-center' }),
            render: (value) => <span title={value || ''}>{value || '-'}</span>,
          },
          {
            key: 'historico',
            title: 'Histórico',
            dataIndex: 'historico',
            ellipsis: true,
            onHeaderCell: () => ({
              className: 'conta-corrente-cirurgiao-th-center',
              style: { width: 303 },
            }),
            onCell: () => ({ className: 'conta-corrente-cirurgiao-cell-historico' }),
            render: (value) => (
              <span className="conta-corrente-cirurgiao-historico-text" title={value || ''}>
                {value || '-'}
              </span>
            ),
          },
          {
            key: 'debito',
            title: 'Débito',
            dataIndex: 'valor',
            width: 120,
            onHeaderCell: () => ({
              className: 'conta-corrente-cirurgiao-th-center',
              style: { textAlign: 'right' },
            }),
            render: (value, record) => (isDebitTipo(record?.tipo) ? renderMoney(value, true) : '-'),
          },
          {
            key: 'credito',
            title: 'Crédito',
            dataIndex: 'valor',
            width: 120,
            onHeaderCell: () => ({
              className: 'conta-corrente-cirurgiao-th-center',
              style: { textAlign: 'right' },
            }),
            render: (value, record) => (isCreditTipo(record?.tipo) ? renderMoney(value, false) : '-'),
          },
        ]}
        rowClassName={(record, index) => {
          const isSelected = String(record.id) === String(selectedId ?? '');
          const isDebitOpen = isDebitTipo(record?.tipo) && isSituacaoAberta(record?.situacao);
          return [
            isSelected ? 'users-table-row-selected' : '',
            isDebitOpen ? 'conta-corrente-cirurgiao-row-debit' : '',
            index % 2 === 0 ? 'brana-table-row-even' : 'brana-table-row-odd',
          ].filter(Boolean).join(' ');
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
