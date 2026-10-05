import { useEffect, useMemo, useState } from 'react';
import { Space, Typography, message } from 'antd';

import { BranaCard } from '../../components/BranaCard.jsx';
import { BranaTable } from '../../components/BranaTable.jsx';
import { TableColumnFilterHeader } from '../../components/TableColumnFilterHeader.jsx';
import { listarProcedimentosGenericos, listarProcedimentosGenericosEspecialidades } from './procedimentosGenericosApi.js';
import { ProcedimentoGenericoFasesModal } from './ProcedimentoGenericoFasesModal.jsx';
import { ProcedimentoGenericoMateriaisModal } from './ProcedimentoGenericoMateriaisModal.jsx';
import { ProcedimentoGenericoModal } from './ProcedimentoGenericoModal.jsx';

function statusDot(inativo) {
  return <span className={`auxiliary-table-status-dot${inativo ? ' is-inactive' : ' is-active'}`} aria-hidden="true" />;
}

export function ProcedimentosGenericosPage({ q, especialidade, novoProcedimentoToken }) {
  const [items, setItems] = useState([]);
  const [specialidades, setSpecialidades] = useState([]);
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
  const [fasesOpen, setFasesOpen] = useState(false);
  const [fasesItemId, setFasesItemId] = useState(null);
  const [materiaisOpen, setMateriaisOpen] = useState(false);
  const [materiaisItemId, setMateriaisItemId] = useState(null);

  const selectedItem = useMemo(() => items.find((item) => item.id === selectedId) || null, [items, selectedId]);

  const especialidadeNomePorCodigo = useMemo(() => {
    const map = new Map();
    specialidades.forEach((item) => {
      const codigo = String(item?.codigo || '').trim();
      const nome = String(item?.nome || '').trim();
      if (codigo) map.set(codigo, nome || codigo);
    });
    return map;
  }, [specialidades]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('brana-procedimentos-genericos-especialidades', {
          detail: { especialidades: specialidades },
        }),
      );
    }
  }, [specialidades]);

  const loadItems = async () => {
    setLoading(true);
    setError('');
    try {
      const [listaProcedimentos, listaEspecialidades] = await Promise.all([
        listarProcedimentosGenericos({ q, especialidade }),
        listarProcedimentosGenericosEspecialidades(),
      ]);
      setItems(listaProcedimentos);
      setSpecialidades(Array.isArray(listaEspecialidades) ? listaEspecialidades : []);
      setSelectedId((current) => (listaProcedimentos.some((item) => item.id === current) ? current : listaProcedimentos[0]?.id ?? null));
    } catch (err) {
      setItems([]);
      setSpecialidades([]);
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

  const openNewModal = () => {
    setModalMode('novo');
    setModalItemId(null);
    setModalOpen(true);
    setModalFocusToken((current) => current + 1);
  };

  const openEditModal = (target = selectedItem) => {
    if (!target) {
      message.warning('Selecione um registro para alterar.');
      return;
    }
    setModalMode('editar');
    setModalItemId(target.id);
    setModalOpen(true);
    setModalFocusToken((current) => current + 1);
  };

  const openFasesModal = () => {
    if (!selectedItem) {
      message.warning('Selecione um registro para configurar fases.');
      return;
    }
    setFasesItemId(selectedItem.id);
    setFasesOpen(true);
  };

  const openMateriaisModal = () => {
    if (!selectedItem) {
      message.warning('Selecione um registro para configurar materiais.');
      return;
    }
    setMateriaisItemId(selectedItem.id);
    setMateriaisOpen(true);
  };

  useEffect(() => {
    const onToolbarAction = (event) => {
      const action = String(event?.detail?.action || '').trim();
      if (action === 'novo') {
        openNewModal();
      } else if (action === 'alterar') {
        openEditModal();
      } else if (action === 'fases') {
        openFasesModal();
      } else if (action === 'materiais') {
        openMateriaisModal();
      }
    };

    window.addEventListener('brana-procedimentos-genericos-toolbar-action', onToolbarAction);
    return () => window.removeEventListener('brana-procedimentos-genericos-toolbar-action', onToolbarAction);
  }, [selectedItem]);

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
      width: '16%',
      render: (value) => <Typography.Text strong>{value || '-'}</Typography.Text>,
    },
    {
      key: 'descricao',
      title: renderFilterTitle('descricao', 'Procedimento genérico'),
      dataIndex: 'descricao',
      ellipsis: true,
      render: (value) => value || '-',
    },
    {
      key: 'especialidade',
      title: renderFilterTitle('especialidade', 'Especialidade'),
      dataIndex: 'especialidade',
      width: '28%',
      ellipsis: true,
      render: (value) => especialidadeNomePorCodigo.get(String(value || '').trim()) || value || '-',
    },
    {
      key: 'status',
      title: renderFilterTitle('status', 'Status', true),
      dataIndex: 'inativo',
      width: 40,
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
                scroll={{ y: 480 }}
                dataSource={sortedItems}
                columns={columns}
                rowSelection={{
                  type: 'radio',
                  columnWidth: 28,
                  selectedRowKeys: selectedItem ? [selectedItem.id] : [],
                  onChange: (keys) => setSelectedId(keys[0] ?? null),
                }}
                onRow={(record) => ({
                  className: selectedItem?.id === record.id ? 'users-table-row-selected' : '',
                  onClick: () => setSelectedId(record.id),
                  onDoubleClick: (event) => {
                    if (event.target.closest('input, button, a, select, textarea, label, [role="button"]')) return;
                    setSelectedId(record.id);
                    openEditModal(record);
                  },
                })}
                locale={{ emptyText: 'Nenhum procedimento genérico cadastrado.' }}
              />
              <div className="procedimentos-genericos-table-footer" aria-live="polite">
                <Typography.Text type="secondary">
                  {items.length} {items.length === 1 ? 'procedimento genérico' : 'procedimentos genéricos'}
                </Typography.Text>
              </div>
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

      <ProcedimentoGenericoFasesModal
        open={fasesOpen}
        procedureId={fasesItemId}
        onClose={() => {
          setFasesOpen(false);
          setFasesItemId(null);
        }}
        onSaved={() => {
          void loadItems();
        }}
      />

      <ProcedimentoGenericoMateriaisModal
        open={materiaisOpen}
        procedureId={materiaisItemId}
        onClose={() => {
          setMateriaisOpen(false);
          setMateriaisItemId(null);
        }}
        onSaved={() => {
          void loadItems();
        }}
      />
    </Space>
  );
}
