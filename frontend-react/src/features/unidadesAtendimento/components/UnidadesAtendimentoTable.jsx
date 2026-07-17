import { Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { BranaTable } from '../../../components/BranaTable.jsx';
import { TableColumnFilterHeader } from '../../../components/TableColumnFilterHeader.jsx';
import { formatUnidadeStatus } from '../utils/unidadeAtendimentoMappers.js';
import { UNIDADE_ATENDIMENTO_COLUMNS } from '../constants/unidadeAtendimentoColumns.js';

function renderText(value) {
  const text = String(value ?? '').trim();
  return text || '-';
}

export function UnidadesAtendimentoTable({
  items,
  loading,
  selectedId,
  onSelect,
  onRowDoubleClick,
  filters,
  onFilterApply,
  onFilterClear,
  sortState,
  onSort,
  footerLabel,
}) {
  const [draftFilters, setDraftFilters] = useState(filters);

  useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  const columns = useMemo(() => [
    {
      key: 'codigo',
      title: (
        <TableColumnFilterHeader
          label="Código"
          activeSort={sortState.key === 'codigo' ? sortState.order : null}
          onSortAsc={() => onSort?.('codigo', 'asc')}
          onSortDesc={() => onSort?.('codigo', 'desc')}
          columns={UNIDADE_ATENDIMENTO_COLUMNS.map((column) => ({ ...column, visible: true, locked: column.key === 'codigo' }))}
          onToggleColumn={() => {}}
          filterValue={draftFilters.codigo}
          onFilterValueChange={(value) => setDraftFilters((current) => ({ ...current, codigo: value }))}
          onFilterApply={() => onFilterApply?.('codigo', draftFilters.codigo)}
          onFilterClear={() => {
            setDraftFilters((current) => ({ ...current, codigo: '' }));
            onFilterClear?.('codigo');
          }}
          activeFilter={Boolean(String(filters.codigo || '').trim())}
        />
      ),
      dataIndex: 'codigo',
      width: 96,
      align: 'center',
      render: renderText,
    },
    {
      key: 'nome',
      title: (
        <TableColumnFilterHeader
          label="Nome da unidade"
          activeSort={sortState.key === 'nome' ? sortState.order : null}
          onSortAsc={() => onSort?.('nome', 'asc')}
          onSortDesc={() => onSort?.('nome', 'desc')}
          columns={UNIDADE_ATENDIMENTO_COLUMNS.map((column) => ({ ...column, visible: true, locked: column.key === 'codigo' }))}
          onToggleColumn={() => {}}
          filterValue={draftFilters.nome}
          onFilterValueChange={(value) => setDraftFilters((current) => ({ ...current, nome: value }))}
          onFilterApply={() => onFilterApply?.('nome', draftFilters.nome)}
          onFilterClear={() => {
            setDraftFilters((current) => ({ ...current, nome: '' }));
            onFilterClear?.('nome');
          }}
          activeFilter={Boolean(String(filters.nome || '').trim())}
        />
      ),
      dataIndex: 'nome',
      width: 360,
      ellipsis: true,
      render: renderText,
    },
    {
      key: 'fone1',
      title: (
        <TableColumnFilterHeader
          label="Telefone 1"
          activeSort={sortState.key === 'fone1' ? sortState.order : null}
          onSortAsc={() => onSort?.('fone1', 'asc')}
          onSortDesc={() => onSort?.('fone1', 'desc')}
          columns={UNIDADE_ATENDIMENTO_COLUMNS.map((column) => ({ ...column, visible: true, locked: column.key === 'codigo' }))}
          onToggleColumn={() => {}}
          filterValue={draftFilters.fone1}
          onFilterValueChange={(value) => setDraftFilters((current) => ({ ...current, fone1: value }))}
          onFilterApply={() => onFilterApply?.('fone1', draftFilters.fone1)}
          onFilterClear={() => {
            setDraftFilters((current) => ({ ...current, fone1: '' }));
            onFilterClear?.('fone1');
          }}
          activeFilter={Boolean(String(filters.fone1 || '').trim())}
        />
      ),
      dataIndex: 'fone1',
      width: 160,
      render: renderText,
    },
    {
      key: 'fone2',
      title: (
        <TableColumnFilterHeader
          label="Telefone 2"
          activeSort={sortState.key === 'fone2' ? sortState.order : null}
          onSortAsc={() => onSort?.('fone2', 'asc')}
          onSortDesc={() => onSort?.('fone2', 'desc')}
          columns={UNIDADE_ATENDIMENTO_COLUMNS.map((column) => ({ ...column, visible: true, locked: column.key === 'codigo' }))}
          onToggleColumn={() => {}}
          filterValue={draftFilters.fone2}
          onFilterValueChange={(value) => setDraftFilters((current) => ({ ...current, fone2: value }))}
          onFilterApply={() => onFilterApply?.('fone2', draftFilters.fone2)}
          onFilterClear={() => {
            setDraftFilters((current) => ({ ...current, fone2: '' }));
            onFilterClear?.('fone2');
          }}
          activeFilter={Boolean(String(filters.fone2 || '').trim())}
        />
      ),
      dataIndex: 'fone2',
      width: 160,
      render: renderText,
    },
    {
      key: 'status',
      title: (
        <TableColumnFilterHeader
          label="Status"
          activeSort={sortState.key === 'status' ? sortState.order : null}
          onSortAsc={() => onSort?.('status', 'asc')}
          onSortDesc={() => onSort?.('status', 'desc')}
          columns={UNIDADE_ATENDIMENTO_COLUMNS.map((column) => ({ ...column, visible: true, locked: column.key === 'codigo' }))}
          onToggleColumn={() => {}}
          filterValue={draftFilters.status}
          onFilterValueChange={(value) => setDraftFilters((current) => ({ ...current, status: value }))}
          onFilterApply={() => onFilterApply?.('status', draftFilters.status)}
          onFilterClear={() => {
            setDraftFilters((current) => ({ ...current, status: '' }));
            onFilterClear?.('status');
          }}
          activeFilter={Boolean(String(filters.status || '').trim())}
        />
      ),
      dataIndex: 'status',
      width: 100,
      align: 'center',
      render: (_, record) => formatUnidadeStatus(record),
    },
  ], [draftFilters.codigo, draftFilters.fone1, draftFilters.fone2, draftFilters.nome, draftFilters.status, filters.fone1, filters.fone2, filters.nome, filters.status, onFilterApply, onFilterClear, onSort, sortState.key, sortState.order]);

  return (
    <div className="unidades-atendimento-table-shell">
      <BranaTable
        rowKey="id"
        className="module-table auxiliary-compact-table unidades-atendimento-table"
        loading={loading}
        pagination={false}
        size="small"
        sticky
        tableLayout="fixed"
        scroll={{ y: 'calc(100vh - 258px)' }}
        dataSource={items}
        columns={columns}
        rowSelection={{
          type: 'radio',
          selectedRowKeys: selectedId ? [selectedId] : [],
          onChange: (keys) => onSelect?.(keys[0] ?? null),
        }}
        locale={{ emptyText: 'Nenhuma unidade de atendimento cadastrada.' }}
        onRow={(record) => ({
          onClick: () => onSelect?.(record.id),
          onDoubleClick: () => onRowDoubleClick?.(record),
          className: Number(record.id) === Number(selectedId) ? 'is-selected' : '',
          'data-row-id': record.id,
          'aria-selected': Number(record.id) === Number(selectedId),
        })}
      />
      <div className="unidades-atendimento-table-footer" aria-live="polite">
        <Typography.Text type="secondary">{footerLabel}</Typography.Text>
      </div>
    </div>
  );
}
