import { useEffect, useMemo, useState } from 'react';
import { Space, Typography, message } from 'antd';

import { BranaCard } from '../../components/BranaCard.jsx';
import { BranaTable } from '../../components/BranaTable.jsx';
import { TableColumnFilterHeader } from '../../components/TableColumnFilterHeader.jsx';
import { listarProcedimentosGenericos } from './procedimentosGenericosApi.js';
import { ProcedimentoGenericoModal } from './ProcedimentoGenericoModal.jsx';

function statusDot(inativo) {
  return <span className={`auxiliary-table-status-dot${inativo ? ' is-inactive' : ' is-active'}`} aria-hidden="true" />;
}

export function ProcedimentosGenericosPage({ q, especialidade, novoProcedimentoToken }) {
  const [items, setItems] = useState([]);
  const [sortState, setSortState] = useState({ key: null, order: null });
  const [visibleColumns, setVisibleColumns] = useState({
    codigo: true,
    descricao: true,
    especialidade: true,
    status: true,
  });
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('novo');
  const [modalItemId, setModalItemId] = useState(null);
  const [modalFocusToken, setModalFocusToken] = useState(0);

  const selectedItem = useMemo(() => items.find((item) => item.id === selectedId) || null, [items, selectedId]);
  const especialidades = useMemo(() => {
    const seen = new Set();
    return items
      .map((item) => item.especialidade)
      .filter(Boolean)
      .filter((item) => {
        if (seen.has(item)) return false;
        seen.add(item);
        return true;
      })
      .sort((left, right) => left.localeCompare(right, 'pt-BR', { sensitivity: 'base' }));
  }, [items]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('brana-procedimentos-genericos-especialidades', {
          detail: { especialidades },
        }),
      );
    }
  }, [especialidades]);

  const loadItems = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listarProcedimentosGenericos({ q, especialidade });
      setItems(data);
      setSelectedId((current) => (data.some((item) => item.id === current) ? current : data[0]?.id ?? null));
    } catch (err) {
      setItems([]);
      setSelectedId(null);
      setError(err?.message || 'Falha ao carregar procedimentos genéricos.');
      message.error(err?.message || 'Falha ao carregar procedimentos genéricos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, [q, especialidade]);

  useEffect(() => {
    if (!novoProcedimentoToken) return;
    setModalMode('novo');
    setModalItemId(null);
    setModalOpen(true);
    setModalFocusToken((current) => current + 1);
  }, [novoProcedimentoToken]);

  const sortedItems = useMemo(() => {
    const nextItems = [...items];
    if (!sortState.key || !sortState.order) return nextItems;

    nextItems.sort((left, right) => {
      const leftValue = String(left?.[sortState.key] ?? '').toLowerCase();
      const rightValue = String(right?.[sortState.key] ?? '').toLowerCase();
      const comparison = leftValue.localeCompare(rightValue, 'pt-BR', { sensitivity: 'base' });
      return sortState.order === 'asc' ? comparison : -comparison;
    });

    return nextItems;
  }, [items, sortState.key, sortState.order]);

  const filterColumns = [
    { key: 'codigo', label: 'Código', visible: true },
    { key: 'descricao', label: 'Procedimento genérico', visible: true },
    { key: 'especialidade', label: 'Especialidade', visible: true },
    { key: 'status', label: 'Status', visible: true, locked: true },
  ];

  const renderFilterTitle = (columnKey, label, hideLabel = false) => (
    <TableColumnFilterHeader
      label={label}
      activeSort={sortState.key === columnKey ? sortState.order : null}
      onSortAsc={columnKey === 'status' ? undefined : () => setSortState({ key: columnKey, order: 'asc' })}
      onSortDesc={columnKey === 'status' ? undefined : () => setSortState({ key: columnKey, order: 'desc' })}
      columns={filterColumns}
      onToggleColumn={(key) => setVisibleColumns((current) => ({ ...current, [key]: !current[key] }))}
      hideLabel={hideLabel}
    />
  );

  const allColumns = [
    {
      key: 'codigo',
      title: renderFilterTitle('codigo', 'Código'),
      dataIndex: 'codigo',
      width: 110,
      render: (value) => <Typography.Text strong>{value || '-'}</Typography.Text>,
    },
    {
      key: 'descricao',
      title: renderFilterTitle('descricao', 'Procedimento genérico'),
      dataIndex: 'descricao',
      width: 240,
      render: (value) => value || '-',
    },
    {
      key: 'especialidade',
      title: renderFilterTitle('especialidade', 'Especialidade'),
      dataIndex: 'especialidade',
      width: 180,
      render: (value) => value || '-',
    },
    {
      key: 'status',
      title: renderFilterTitle('status', 'Status', true),
      dataIndex: 'inativo',
      width: 72,
      align: 'center',
      render: (_, record) => statusDot(record.inativo),
    },
  ];

  const columns = allColumns.filter((column) => visibleColumns[column.key] !== false);

  return (
    <Space direction="vertical" size={10} style={{ width: '100%', marginTop: 8 }}>
      <div className="auxiliary-shell-frame procedimentos-genericos-frame">
        {error ? <Typography.Text type="danger">{error}</Typography.Text> : null}

        <BranaCard className="auxiliary-main-card procedimentos-genericos-card">
          <div className="module-table-shell procedimentos-genericos-shell">
            <div className="users-grid-shell procedimentos-genericos-grid" role="grid" aria-label="Listagem de procedimentos genéricos">
              <BranaTable
                rowKey="id"
                className="module-table auxiliary-compact-table procedimentos-genericos-table"
                loading={loading}
                pagination={false}
                size="small"
                tableLayout="fixed"
                dataSource={sortedItems}
                columns={columns}
                rowSelection={{
                  type: 'radio',
                  selectedRowKeys: selectedItem ? [selectedItem.id] : [],
                  onChange: (keys) => setSelectedId(keys[0] ?? null),
                }}
                onRow={(record) => ({
                  className: selectedItem?.id === record.id ? 'users-table-row-selected' : '',
                  onClick: () => setSelectedId(record.id),
                })}
                locale={{ emptyText: 'Nenhum procedimento genérico cadastrado.' }}
              />
            </div>
          </div>
        </BranaCard>
      </div>

      <ProcedimentoGenericoModal
        open={modalOpen}
        mode={modalMode}
        itemId={modalItemId}
        focusToken={modalFocusToken}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          void loadItems();
        }}
      />
    </Space>
  );
}
