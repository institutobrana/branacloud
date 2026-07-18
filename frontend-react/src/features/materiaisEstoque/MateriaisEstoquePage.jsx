import { useEffect, useMemo, useState } from 'react';
import { Button, Input, Modal, Select, Space, Typography, message } from 'antd';

import { BranaCard } from '../../components/BranaCard.jsx';
import { BranaTable } from '../../components/BranaTable.jsx';
import { TableColumnFilterHeader } from '../../components/TableColumnFilterHeader.jsx';
import {
  alterarMaterial,
  alterarTabelaMateriais,
  criarMaterial,
  criarTabelaMateriais,
  excluirMaterial,
  excluirTabelaMateriais,
  listarAuxiliaresPorTipo,
  listarMateriais,
  listarMateriaisListas,
} from './materiaisEstoqueApi.js';
import { MateriaisTabelaModal } from './MateriaisTabelaModal.jsx';
import { MateriaisMaterialModal } from './MateriaisMaterialModal.jsx';

const DEFAULT_COLUMNS = {
  codigo: true,
  nome: true,
  preco: true,
  relacao: true,
  custo: true,
};

function formatMoney(value) {
  const next = Number(value || 0);
  return Number.isFinite(next)
    ? next.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0,00';
}

function sortByLabel(left, right, field) {
  const leftValue = String(left?.[field] ?? '').toLowerCase();
  const rightValue = String(right?.[field] ?? '').toLowerCase();
  return leftValue.localeCompare(rightValue, 'pt-BR', { sensitivity: 'base' });
}

export function MateriaisEstoquePage({ onClose, toolbarState }) {
  const [listas, setListas] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [classificacoes, setClassificacoes] = useState([]);
  const [selectedListaId, setSelectedListaId] = useState(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [q, setQ] = useState('');
  const [classificacao, setClassificacao] = useState('__todos__');
  const [loading, setLoading] = useState(false);
  const [loadingListas, setLoadingListas] = useState(false);
  const [loadingMateriais, setLoadingMateriais] = useState(false);
  const [sortState, setSortState] = useState({ key: null, order: null });
  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_COLUMNS);
  const [listaModalOpen, setListaModalOpen] = useState(false);
  const [listaModalMode, setListaModalMode] = useState('new');
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [materialModalMode, setMaterialModalMode] = useState('new');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteModalTarget, setDeleteModalTarget] = useState('');
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalMessage, setInfoModalMessage] = useState('');

  useEffect(() => {
    const onFilter = (event) => {
      const field = String(event?.detail?.field || '').trim();
      const value = event?.detail?.value;
      if (field === 'lista') {
        setSelectedListaId(Number(value || 0) || null);
      } else if (field === 'classificacao') {
        setClassificacao(String(value || '__todos__'));
      } else if (field === 'q') {
        setQ(String(value || ''));
      }
    };

    window.addEventListener('brana-materiais-estoque-toolbar-filter', onFilter);
    return () => window.removeEventListener('brana-materiais-estoque-toolbar-filter', onFilter);
  }, []);

  useEffect(() => {
    const onAction = (event) => {
      const action = String(event?.detail?.action || '').trim();
      if (action === 'material-novo') {
        openNewMaterial();
      } else if (action === 'material-alterar') {
        openEditMaterial();
      } else if (action === 'material-eliminar') {
        if (!selectedItem) {
          message.warning('Selecione um material.');
          return;
        }
        setDeleteModalTarget('material');
        setDeleteModalOpen(true);
      } else if (action === 'tabela-nova') {
        openNewLista();
      } else if (action === 'tabela-alterar') {
        openEditLista();
      } else if (action === 'tabela-eliminar') {
        if (!selectedLista) {
          message.warning('Selecione uma tabela.');
          return;
        }
        setDeleteModalTarget('lista');
        setDeleteModalOpen(true);
      }
    };

    window.addEventListener('brana-materiais-estoque-toolbar-action', onAction);
    return () => window.removeEventListener('brana-materiais-estoque-toolbar-action', onAction);
  }, [selectedMaterialId, selectedListaId]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('brana-materiais-estoque-state', {
        detail: {
          listas,
          classificacoes,
          selectedListaId,
          q,
          classificacao,
          loadingListas,
        },
      }),
    );
  }, [classificacoes, classificacao, listas, loadingListas, q, selectedListaId]);

  const selectedLista = useMemo(() => listas.find((item) => item.id === selectedListaId) || null, [listas, selectedListaId]);
  const selectedItem = useMemo(() => materiais.find((item) => item.id === selectedMaterialId) || null, [materiais, selectedMaterialId]);

  const loadListas = async (preferId = null) => {
    setLoadingListas(true);
    try {
      const data = await listarMateriaisListas();
      setListas(data);
      const nextId = preferId && data.some((item) => item.id === preferId) ? preferId : data[0]?.id ?? null;
      setSelectedListaId(nextId);
      return nextId;
    } catch (error) {
      message.error(error?.message || 'Falha ao carregar tabelas de materiais.');
      setListas([]);
      setSelectedListaId(null);
      return null;
    } finally {
      setLoadingListas(false);
    }
  };

  const loadClassificacoes = async () => {
    try {
      const items = await listarAuxiliaresPorTipo('Tipos de material');
      setClassificacoes(items);
    } catch {
      setClassificacoes([]);
    }
  };

  const loadMateriais = async (listaId = selectedListaId, search = q, cls = classificacao) => {
    if (!listaId) {
      setMateriais([]);
      setSelectedMaterialId(null);
      return;
    }

    setLoadingMateriais(true);
    try {
      const data = await listarMateriais({ listaId, q: search, classificacao: cls });
      setMateriais(data);
      setSelectedMaterialId((current) => (data.some((item) => item.id === current) ? current : data[0]?.id ?? null));
    } catch (error) {
      setMateriais([]);
      setSelectedMaterialId(null);
      message.error(error?.message || 'Falha ao carregar materiais.');
    } finally {
      setLoadingMateriais(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    void Promise.all([loadClassificacoes(), loadListas()]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    void loadMateriais(selectedListaId, q, classificacao);
  }, [selectedListaId]);

  const sortedMaterials = useMemo(() => {
    const nextItems = [...materiais];
    if (!sortState.key || !sortState.order) return nextItems;

    nextItems.sort((left, right) => {
      const comparison = sortByLabel(left, right, sortState.key);
      return sortState.order === 'asc' ? comparison : -comparison;
    });

    return nextItems;
  }, [materiais, sortState.key, sortState.order]);

  const filterColumns = [
    { key: 'codigo', label: 'Código', visible: visibleColumns.codigo },
    { key: 'nome', label: 'Nome', visible: visibleColumns.nome },
    { key: 'preco', label: 'Preço', visible: visibleColumns.preco },
    { key: 'relacao', label: 'Relação', visible: visibleColumns.relacao },
    { key: 'custo', label: 'Valor de custo unitário', visible: visibleColumns.custo },
  ];

  const renderHeader = (columnKey, label) => (
    <TableColumnFilterHeader
      label={label}
      activeSort={sortState.key === columnKey ? sortState.order : null}
      onSortAsc={() => setSortState({ key: columnKey, order: 'asc' })}
      onSortDesc={() => setSortState({ key: columnKey, order: 'desc' })}
      columns={filterColumns}
      onToggleColumn={(key) => setVisibleColumns((current) => ({ ...current, [key]: !current[key] }))}
    />
  );

  const columns = [
    {
      key: 'codigo',
      title: renderHeader('codigo', 'Código'),
      dataIndex: 'codigo',
      width: 110,
      render: (value) => <Typography.Text strong>{value || '-'}</Typography.Text>,
    },
    {
      key: 'nome',
      title: renderHeader('nome', 'Nome'),
      dataIndex: 'nome',
      width: 300,
      render: (value) => value || '-',
    },
    {
      key: 'preco',
      title: renderHeader('preco', 'Preço'),
      dataIndex: 'preco',
      width: 110,
      align: 'center',
      render: (value) => formatMoney(value),
    },
    {
      key: 'relacao',
      title: renderHeader('relacao', 'Relação'),
      dataIndex: 'relacao',
      width: 110,
      align: 'center',
      render: (value) => formatMoney(value),
    },
    {
      key: 'custo',
      title: renderHeader('custo', 'Valor de custo unitário'),
      dataIndex: 'custo',
      width: 130,
      align: 'center',
      render: (value) => formatMoney(value),
    },
  ].filter((column) => visibleColumns[column.key] !== false);

  const openNewLista = () => {
    setListaModalMode('new');
    setListaModalOpen(true);
  };

  const openEditLista = () => {
    if (!selectedLista) {
      message.warning('Selecione uma tabela para alterar.');
      return;
    }
    setListaModalMode('edit');
    setListaModalOpen(true);
  };

  const openNewMaterial = () => {
    if (!selectedLista) {
      message.warning('Selecione uma tabela.');
      return;
    }
    setMaterialModalMode('new');
    setMaterialModalOpen(true);
  };

  const openEditMaterial = () => {
    if (!selectedItem) {
      message.warning('Selecione um material para alterar.');
      return;
    }
    setMaterialModalMode('edit');
    setMaterialModalOpen(true);
  };

  const handleDeleteLista = async () => {
    try {
      await excluirTabelaMateriais(selectedLista.id);
      message.success('Tabela excluída com sucesso.');
      const nextId = await loadListas();
      await loadMateriais(nextId, q, classificacao);
    } catch (error) {
      setInfoModalMessage(error?.message || 'Falha ao excluir tabela.');
      setInfoModalOpen(true);
    }
  };

  const handleDeleteMaterial = async () => {
    try {
      await excluirMaterial(selectedItem.id);
      message.success('Material excluído com sucesso.');
      await loadMateriais();
    } catch (error) {
      message.error(error?.message || 'Falha ao excluir material.');
    }
  };

  const handleSaveLista = async (payload) => {
    try {
      const saved = listaModalMode === 'edit'
        ? await alterarTabelaMateriais(selectedLista.id, payload)
        : await criarTabelaMateriais(payload);
      message.success(listaModalMode === 'edit' ? 'Tabela alterada com sucesso.' : 'Tabela criada com sucesso.');
      setListaModalOpen(false);
      const nextId = await loadListas(saved.id);
      await loadMateriais(nextId, q, classificacao);
    } catch (error) {
      message.error(error?.message || 'Falha ao salvar tabela.');
    }
  };

  const handleSaveMaterial = async (payload) => {
    try {
      const saved = materialModalMode === 'edit'
        ? await alterarMaterial(selectedItem.id, payload)
        : await criarMaterial(payload);
      message.success(materialModalMode === 'edit' ? 'Material alterado com sucesso.' : 'Material criado com sucesso.');
      setMaterialModalOpen(false);
      setSelectedMaterialId(saved.id);
      await loadMateriais();
    } catch (error) {
      message.error(error?.message || 'Falha ao salvar material.');
    }
  };

  const handleSearch = () => {
    void loadMateriais(selectedListaId, q, classificacao);
  };

  const handleListaChange = async (value) => {
    const nextId = Number(value || 0) || null;
    setSelectedListaId(nextId);
    await loadMateriais(nextId, q, classificacao);
  };

  const handleClassificacaoChange = async (value) => {
    const next = value || '__todos__';
    setClassificacao(next);
    await loadMateriais(selectedListaId, q, next);
  };

  const handleRowClick = (record) => {
    setSelectedMaterialId(record.id);
  };

  const classOptions = [
    { value: '__mais_usados__', label: 'Mais usados' },
    { value: '__todos__', label: 'Todos' },
    ...classificacoes.map((item) => ({ value: item, label: item })),
  ];

  return (
    <div className="materiais-estoque-page">
      <BranaCard className="materiais-estoque-card">
        <div className="materiais-estoque-table-shell">
          <BranaTable
            rowKey="id"
            className="module-table auxiliary-compact-table materiais-estoque-table"
            loading={loading || loadingMateriais}
            pagination={false}
            dataSource={sortedMaterials}
            columns={columns}
            tableLayout="fixed"
            rowSelection={{
              type: 'radio',
              selectedRowKeys: selectedItem ? [selectedItem.id] : [],
              onChange: (keys) => setSelectedMaterialId(keys[0] ?? null),
            }}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              className: selectedItem?.id === record.id ? 'is-selected' : '',
            })}
            locale={{ emptyText: 'Nenhum material encontrado.' }}
          />
        </div>

        <Typography.Text className="materiais-estoque-total">
          Total de materiais: {materiais.length}
        </Typography.Text>
      </BranaCard>

      <MateriaisTabelaModal
        open={listaModalOpen}
        mode={listaModalMode}
        lista={listaModalMode === 'edit' ? selectedLista : null}
        onClose={() => setListaModalOpen(false)}
        onSaved={handleSaveLista}
        onLoadError={(error) => message.error(error?.message || 'Falha ao carregar índices.')}
      />

      <MateriaisMaterialModal
        open={materialModalOpen}
        mode={materialModalMode}
        listaId={selectedListaId}
        item={materialModalMode === 'edit' ? selectedItem : null}
        onClose={() => setMaterialModalOpen(false)}
        onSaved={handleSaveMaterial}
        onLoadError={(error) => message.error(error?.message || 'Falha ao carregar auxiliares.')}
      />

      <Modal
        open={deleteModalOpen}
        title={deleteModalTarget === 'material' ? 'Excluir material' : 'Excluir tabela'}
        okText="Excluir"
        cancelText="Cancelar"
        okButtonProps={{ danger: true }}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={async () => {
          setDeleteModalOpen(false);
          if (deleteModalTarget === 'material') {
            await handleDeleteMaterial();
          } else if (deleteModalTarget === 'lista') {
            await handleDeleteLista();
          }
        }}
        centered
      >
        <Typography.Paragraph style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
          {deleteModalTarget === 'material'
            ? `Deseja realmente excluir o material '${selectedItem?.nome || ''}' (Cód: ${selectedItem?.codigo || ''})?`
            : `Deseja realmente excluir a tabela '${selectedLista?.nome || ''}'?\n\nTodos os materiais desta tabela serão excluídos.`}
        </Typography.Paragraph>
      </Modal>

      <Modal
        open={infoModalOpen}
        title="Aviso"
        okText="OK"
        cancelButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setInfoModalOpen(false)}
        onOk={() => setInfoModalOpen(false)}
        centered
      >
        <Typography.Paragraph style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
          {infoModalMessage}
        </Typography.Paragraph>
      </Modal>
    </div>
  );
}
