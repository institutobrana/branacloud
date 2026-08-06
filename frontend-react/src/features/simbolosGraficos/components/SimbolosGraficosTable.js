import React from 'react';
import { Table, Typography } from 'antd';
import { getSimbolosGraficosTableColumns } from '../simbolosGraficosColumns.js';

export function SimbolosGraficosTable({
  rows = [],
  selectedId = null,
  onSelect,
  footerLabel = '',
  ariaLabel = 'Tabela de símbolos gráficos',
}) {
  const columns = getSimbolosGraficosTableColumns();
  const selectedRowKeys = selectedId ? [selectedId] : [];
  const scrollX = columns.reduce((sum, column) => sum + (Number(column.width) || 0), 0) + 36;

  return React.createElement(
    'div',
    { className: 'admin-users-table-shell simbolos-graficos-table-shell', 'aria-label': ariaLabel },
    React.createElement(
      'div',
      { className: 'admin-users-table-frame simbolos-graficos-table-frame' },
      React.createElement(Table, {
        className: 'brana-table module-table auxiliary-compact-table simbolos-graficos-table',
        dataSource: rows,
        columns,
        rowKey: 'id',
        pagination: false,
        size: 'small',
        sticky: true,
        tableLayout: 'fixed',
        scroll: { x: scrollX, y: 520 },
        rowSelection: {
          type: 'radio',
          selectedRowKeys,
          onChange: (keys) => onSelect?.(keys[0] ?? null),
        },
        locale: {
          emptyText: 'Nenhum símbolo gráfico encontrado.',
        },
        onRow: (record) => ({
          onClick: () => onSelect?.(record.id),
          'data-row-id': record.id,
          'aria-selected': Number(record.id) === Number(selectedId),
        }),
      }),
      React.createElement(
        'div',
        { className: 'admin-users-table-footer simbolos-graficos-table-footer', 'aria-live': 'polite' },
        React.createElement(Typography.Text, { type: 'secondary' }, footerLabel || (rows.length === 1 ? '1 símbolo' : `${rows.length} símbolos`)),
      ),
    ),
  );
}
