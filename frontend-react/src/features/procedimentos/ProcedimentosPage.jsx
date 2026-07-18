import { useEffect, useMemo, useState } from 'react';
import { Typography, message } from 'antd';

import { BranaCard } from '../../components/BranaCard.jsx';
import { BranaTable } from '../../components/BranaTable.jsx';
import { TableColumnFilterHeader } from '../../components/TableColumnFilterHeader.jsx';
import {
  listarProcedimentos,
  listarProcedimentosFiltros,
  listarProcedimentosGenericosCombos,
  listarSimbolosGraficoProcedimentos,
  obterProcedimentoDetalhe,
  obterProximoCodigoProcedimento,
  salvarProcedimento,
} from './procedimentosApi.js';
import {
  createEmptyProcedimentoForm,
  createSpecialtyNameMap,
  extractProcedimentoSymbolPayload,
  hydrateProcedimentoSymbolState,
  normalizeProcedimentoSymbol,
  parseMoneyInput,
  toMoneyInputValue,
  resolveProcedimentoSymbolPreviewCandidates,
  resolveSpecialtyName,
} from './procedimentosEditorMappers.js';
import { validateProcedimentoForm } from './procedimentosEditorValidators.js';
import { ProcedimentoEditorModal } from './components/ProcedimentoEditorModal.jsx';
import './procedimentos.css';

function formatMoney(value) {
  const next = Number(value || 0);
  return Number.isFinite(next) ? next.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0,00';
}

function formatCode(value) {
  const next = Number(value || 0);
  if (!Number.isFinite(next) || next <= 0) return '-';
  return String(next).padStart(3, '0');
}

function buildProcedureGenericOptions(items) {
  return (Array.isArray(items) ? items : []).map((item) => ({
    value: Number(item?.value || 0) || 0,
    label: String(item?.label || '').trim(),
    codigo: String(item?.codigo || '').trim(),
    descricao: String(item?.descricao || '').trim(),
    especialidade: String(item?.especialidade || '').trim(),
    tempo: Number(item?.tempo || 0) || 0,
    custo_lab: Number(item?.custo_lab || 0) || 0,
    simbolo_grafico: String(item?.simbolo_grafico || '').trim(),
    simbolo_grafico_legacy_id: Number(item?.simbolo_grafico_legacy_id || 0) || null,
    mostrar_simbolo: Boolean(item?.mostrar_simbolo),
    observacoes: String(item?.observacoes || '').trim(),
  }));
}

export function ProcedimentosPage() {
  const [tabelas, setTabelas] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [procedimentos, setProcedimentos] = useState([]);
  const [sortState, setSortState] = useState({ key: null, order: null });
  const [visibleColumns, setVisibleColumns] = useState({
    codigo: true,
    nome: true,
    especialidade: true,
    tempo: true,
    preco: true,
    custo: true,
    custo_lab: true,
  });
  const [loading, setLoading] = useState(true);
  const [loadingListas, setLoadingListas] = useState(true);
  const [selectedTabelaId, setSelectedTabelaId] = useState(null);
  const [selectedEspecialidade, setSelectedEspecialidade] = useState('');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState('new');
  const [editorLoading, setEditorLoading] = useState(false);
  const [editorSaving, setEditorSaving] = useState(false);
  const [editorError, setEditorError] = useState('');
  const [editorForm, setEditorForm] = useState(createEmptyProcedimentoForm());
  const [procedimentoGenericoOptions, setProcedimentoGenericoOptions] = useState([]);
  const [simboloOptions, setSimboloOptions] = useState([]);

  const selectedItem = useMemo(() => procedimentos.find((item) => item.id === selectedId) || null, [procedimentos, selectedId]);
  const especialidadeNomePorCodigo = useMemo(() => createSpecialtyNameMap(especialidades), [especialidades]);

  const sortedProcedimentos = useMemo(() => {
    const nextItems = [...procedimentos];
    if (!sortState.key || !sortState.order) return nextItems;

    nextItems.sort((left, right) => {
      const leftRaw = left?.[sortState.key];
      const rightRaw = right?.[sortState.key];
      const isNumberSort = ['codigo', 'tempo', 'preco', 'custo', 'custo_lab'].includes(sortState.key);
      const leftValue =
        sortState.key === 'especialidade'
          ? resolveSpecialtyName(leftRaw, especialidadeNomePorCodigo)
          : leftRaw;
      const rightValue =
        sortState.key === 'especialidade'
          ? resolveSpecialtyName(rightRaw, especialidadeNomePorCodigo)
          : rightRaw;
      const comparison = isNumberSort
        ? Number(leftValue || 0) - Number(rightValue || 0)
        : String(leftValue ?? '').localeCompare(String(rightValue ?? ''), 'pt-BR', { sensitivity: 'base' });
      return sortState.order === 'asc' ? comparison : -comparison;
    });

    return nextItems;
  }, [especialidadeNomePorCodigo, procedimentos, sortState.key, sortState.order]);

  const especialidadeOptions = useMemo(
    () => [
      { value: '', label: '<<Todas>>' },
      ...especialidades.map((item) => ({ value: item.codigo, label: item.nome || item.codigo })),
    ],
    [especialidades],
  );

  const filterColumns = [
    { key: 'codigo', label: 'Código', visible: visibleColumns.codigo, locked: true },
    { key: 'nome', label: 'Procedimento', visible: visibleColumns.nome, locked: true },
    { key: 'especialidade', label: 'Especialidade', visible: visibleColumns.especialidade },
    { key: 'tempo', label: 'Tempo', visible: visibleColumns.tempo },
    { key: 'preco', label: 'Preço', visible: visibleColumns.preco },
    { key: 'custo', label: 'Custo', visible: visibleColumns.custo },
    { key: 'custo_lab', label: 'Custo lab.', visible: visibleColumns.custo_lab },
  ];

  const renderHeader = (columnKey, label, hideLabel = false) => (
    <TableColumnFilterHeader
      label={label}
      activeSort={sortState.key === columnKey ? sortState.order : null}
      onSortAsc={() => setSortState({ key: columnKey, order: 'asc' })}
      onSortDesc={() => setSortState({ key: columnKey, order: 'desc' })}
      columns={filterColumns}
      onToggleColumn={(key) => setVisibleColumns((current) => ({ ...current, [key]: !current[key] }))}
      hideLabel={hideLabel}
    />
  );

  const loadLookups = async () => {
    try {
      const [procedimentosGenericos, simbolos] = await Promise.all([
        listarProcedimentosGenericosCombos(),
        listarSimbolosGraficoProcedimentos(),
      ]);
      setProcedimentoGenericoOptions(buildProcedureGenericOptions(procedimentosGenericos));
      const nextSimbolos = (
        (Array.isArray(simbolos) ? simbolos : []).map((item) => {
          const normalized = normalizeProcedimentoSymbol(item);
          const previewCandidates = resolveProcedimentoSymbolPreviewCandidates([normalized.raw], {
            simbolo_catalogo_id: normalized.catalogId,
            simbolo_grafico: normalized.codigo,
            simbolo_grafico_legacy_id: normalized.legacyId,
          });
          return {
            ...normalized,
            previewSrc: previewCandidates[0] || '',
          };
        })
      );
      setSimboloOptions(nextSimbolos);
      return nextSimbolos;
    } catch (err) {
      message.error(err?.message || 'Falha ao carregar combos do editor.');
      return [];
    }
  };

  const loadListas = async () => {
    setLoadingListas(true);
    try {
      const data = await listarProcedimentosFiltros();
      setTabelas(data.tabelas);
      setEspecialidades(data.especialidades);
      setSelectedTabelaId((current) => current || data.tabelas[0]?.id || null);
    } catch (err) {
      setTabelas([]);
      setEspecialidades([]);
      setSelectedTabelaId(null);
      setError(err?.message || 'Falha ao carregar filtros de procedimentos.');
      message.error(err?.message || 'Falha ao carregar filtros de procedimentos.');
    } finally {
      setLoadingListas(false);
    }
  };

  const loadProcedimentos = async (tabelaId = selectedTabelaId, especialidade = selectedEspecialidade, q = search) => {
    if (!tabelaId) {
      setProcedimentos([]);
      setSelectedId(null);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await listarProcedimentos({ tabelaId, especialidade, q });
      setProcedimentos(data);
      setSelectedId((current) => (data.some((item) => item.id === current) ? current : data[0]?.id || null));
    } catch (err) {
      setProcedimentos([]);
      setSelectedId(null);
      setError(err?.message || 'Falha ao carregar procedimentos.');
      message.error(err?.message || 'Falha ao carregar procedimentos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadListas();
    void loadLookups();
  }, []);

  useEffect(() => {
    if (!selectedTabelaId) return;
    void loadProcedimentos(selectedTabelaId, selectedEspecialidade, search);
  }, [selectedTabelaId, selectedEspecialidade, search]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('brana-procedimentos-state', {
        detail: {
          tabelas,
          especialidades,
          selectedTabelaId,
          selectedEspecialidade,
          search,
          loadingListas,
          selectedItemId: selectedItem?.id || null,
        },
      }),
    );
  }, [especialidades, loadingListas, search, selectedEspecialidade, selectedItem?.id, selectedTabelaId, tabelas]);

  const openNewModal = async () => {
    if (!selectedTabelaId) {
      message.warning('Selecione uma tabela.');
      return;
    }
    setEditorOpen(true);
    setEditorMode('new');
    setEditorLoading(true);
    setEditorError('');
    try {
      await loadLookups();
      const proximoCodigo = await obterProximoCodigoProcedimento(selectedTabelaId);
      setEditorForm(
        createEmptyProcedimentoForm({
          tabelaId: selectedTabelaId,
          especialidade: selectedEspecialidade || '',
          codigo: String(proximoCodigo || ''),
          nome: '',
        }),
      );
    } catch (err) {
      setEditorError(err?.message || 'Falha ao preparar novo procedimento.');
      message.error(err?.message || 'Falha ao preparar novo procedimento.');
    } finally {
      setEditorLoading(false);
    }
  };

  const openEditModal = async (procedimentoId = selectedItem?.id || null) => {
    const targetId = Number(procedimentoId || 0) || 0;
    const target = procedimentos.find((item) => item.id === targetId) || null;
    if (!target) {
      message.warning('Selecione um procedimento para alterar.');
      return;
    }
    setEditorOpen(true);
    setEditorMode('edit');
    setEditorLoading(true);
    setEditorError('');
    try {
      const nextSimbolos = await loadLookups();
      const detalhe = await obterProcedimentoDetalhe(target.id);
      setEditorForm({
        ...createEmptyProcedimentoForm({
          tabelaId: detalhe.tabela_id || selectedTabelaId,
          especialidade: detalhe.especialidade || '',
          codigo: String(detalhe.codigo || ''),
          nome: detalhe.nome || '',
        }),
        ...detalhe,
        valor_repasse: toMoneyInputValue(detalhe.valor_repasse),
        valor_paciente: toMoneyInputValue(detalhe.preco),
        custo_lab: toMoneyInputValue(detalhe.custo_lab),
        ...hydrateProcedimentoSymbolState(nextSimbolos, detalhe),
      });
    } catch (err) {
      setEditorError(err?.message || 'Falha ao carregar procedimento.');
      message.error(err?.message || 'Falha ao carregar procedimento.');
    } finally {
      setEditorLoading(false);
    }
  };

  useEffect(() => {
    const onToolbarAction = (event) => {
      const action = String(event?.detail?.action || '').trim();
      if (action === 'novo') {
        void openNewModal();
      } else if (action === 'alterar') {
        void openEditModal(selectedItem?.id || null);
      }
    };

    const onToolbarFilter = (event) => {
      const field = String(event?.detail?.field || '').trim();
      const value = event?.detail?.value;
      if (field === 'tabela') {
        setSelectedTabelaId(Number(value || 0) || null);
      } else if (field === 'especialidade') {
        setSelectedEspecialidade(String(value || ''));
      } else if (field === 'search') {
        setSearch(String(value || ''));
      }
    };

    window.addEventListener('brana-procedimentos-toolbar-action', onToolbarAction);
    window.addEventListener('brana-procedimentos-toolbar-filter', onToolbarFilter);
    return () => {
      window.removeEventListener('brana-procedimentos-toolbar-action', onToolbarAction);
      window.removeEventListener('brana-procedimentos-toolbar-filter', onToolbarFilter);
    };
  }, [selectedItem, selectedTabelaId, selectedEspecialidade]);

  const handleFieldChange = (field, value) => {
    setEditorForm((current) => {
      if (field === 'simbolo_catalogo_id') {
        const nextOption = (Array.isArray(simboloOptions) ? simboloOptions : []).find((item) => Number(item.catalogId || item.value || 0) === Number(value || 0));
        return {
          ...current,
          simbolo_catalogo_id: Number(value || 0) || null,
          simbolo_grafico: nextOption?.codigo || '',
          simbolo_grafico_legacy_id: nextOption?.legacyId || null,
          mostrar_simbolo: !!nextOption,
        };
      }
      if (field === 'simbolo_grafico_legacy_id' || field === 'simbolo_grafico') {
        return {
          ...current,
          [field]: value,
        };
      }
      return { ...current, [field]: value };
    });
  };

  const handleSave = async () => {
    const errors = validateProcedimentoForm(editorForm);
    if (errors.length) {
      const nextError = errors[0];
      setEditorError(nextError);
      message.error(nextError);
      return;
    }

    setEditorSaving(true);
    setEditorError('');
    try {
      const symbolPayload = extractProcedimentoSymbolPayload(simboloOptions, editorForm);
      const saved = await salvarProcedimento({
        id: editorForm.id,
        payload: {
          codigo: Number(editorForm.codigo || 0) || 0,
          nome: String(editorForm.nome || '').trim(),
          tempo: Number(editorForm.tempo || 0) || 0,
          preco: parseMoneyInput(editorForm.valor_paciente),
          custo: 0,
          custo_lab: parseMoneyInput(editorForm.custo_lab),
          tabela_id: String(editorForm.tabela_id || selectedTabelaId || 1).trim() || '1',
          especialidade: String(editorForm.especialidade || '').trim() || null,
          procedimento_generico_id: Number(editorForm.procedimento_generico_id || 0) || null,
          simbolo_grafico: symbolPayload.simbolo_grafico,
          simbolo_grafico_legacy_id: symbolPayload.simbolo_grafico_legacy_id,
          mostrar_simbolo: symbolPayload.mostrar_simbolo,
          garantia_meses: Number(editorForm.garantia_meses || 0) || 0,
          forma_cobranca: String(editorForm.forma_cobranca || '').trim() || null,
          valor_repasse: parseMoneyInput(editorForm.valor_repasse),
          preferido: !!editorForm.preferido,
          inativo: !!editorForm.inativo,
          observacoes: String(editorForm.observacoes || '').trim() || null,
        },
      });
      message.success('Procedimento salvo com sucesso.');
      setEditorOpen(false);
      await loadProcedimentos(selectedTabelaId, selectedEspecialidade, search);
      setSelectedId(saved.id);
    } catch (err) {
      const nextError = err?.message || 'Falha ao gravar procedimento.';
      setEditorError(nextError);
      message.error(nextError);
    } finally {
      setEditorSaving(false);
    }
  };

  const rows = sortedProcedimentos.map((item) => ({
    ...item,
    key: item.id,
  }));

  const columns = [
    {
      key: 'codigo',
      title: renderHeader('codigo', 'Código'),
      dataIndex: 'codigo',
      width: 90,
      render: (value) => <Typography.Text strong>{formatCode(value)}</Typography.Text>,
    },
    {
      key: 'nome',
      title: renderHeader('nome', 'Procedimento'),
      dataIndex: 'nome',
      width: 340,
      render: (value) => value || '-',
    },
    {
      key: 'especialidade',
      title: renderHeader('especialidade', 'Especialidade'),
      dataIndex: 'especialidade',
      width: 150,
      render: (value) => resolveSpecialtyName(value, especialidadeNomePorCodigo),
    },
    {
      key: 'tempo',
      title: renderHeader('tempo', 'Tempo'),
      dataIndex: 'tempo',
      width: 82,
      align: 'center',
      render: (value) => String(value ?? 0),
    },
    {
      key: 'preco',
      title: renderHeader('preco', 'Preço'),
      dataIndex: 'preco',
      width: 112,
      align: 'right',
      render: (value) => formatMoney(value),
    },
    {
      key: 'custo',
      title: renderHeader('custo', 'Custo'),
      dataIndex: 'custo',
      width: 112,
      align: 'right',
      render: (value) => formatMoney(value),
    },
    {
      key: 'custo_lab',
      title: renderHeader('custo_lab', 'Custo Lab.'),
      dataIndex: 'custo_lab',
      width: 112,
      align: 'right',
      render: (value) => formatMoney(value),
    },
  ];

  return (
    <div className="procedimentos-page">
      <div className="auxiliary-shell-frame procedimentos-genericos-frame">
        {error ? <Typography.Text type="danger">{error}</Typography.Text> : null}

        <BranaCard className="auxiliary-main-card procedimentos-genericos-card">
          <div className="module-table-shell procedimentos-genericos-shell">
            <div className="users-grid-shell procedimentos-genericos-grid" role="grid" aria-label="Listagem de procedimentos">
              <BranaTable
                rowKey="id"
                className="module-table auxiliary-compact-table procedimentos-table"
                loading={loading}
                pagination={false}
                size="small"
                tableLayout="fixed"
                dataSource={rows}
                columns={columns}
                rowSelection={{
                  type: 'radio',
                  selectedRowKeys: selectedItem ? [selectedItem.id] : [],
                  onChange: (keys) => setSelectedId(keys[0] ?? null),
                }}
                onRow={(record) => ({
                  className: selectedItem?.id === record.id ? 'users-table-row-selected' : '',
                  onClick: () => setSelectedId(record.id),
                  onDoubleClick: () => {
                    setSelectedId(record.id);
                    void openEditModal(record.id);
                  },
                })}
                locale={{ emptyText: 'Nenhum procedimento cadastrado.' }}
              />
            </div>
          </div>
        </BranaCard>
      </div>

      <ProcedimentoEditorModal
        open={editorOpen}
        mode={editorMode}
        loading={editorLoading || loadingListas}
        saving={editorSaving}
        error={editorError}
        form={editorForm}
        especialidadeOptions={especialidadeOptions}
        procedimentoGenericoOptions={procedimentoGenericoOptions}
        simboloOptions={simboloOptions}
        onChangeField={handleFieldChange}
        onSave={() => void handleSave()}
        onClose={() => {
          setEditorOpen(false);
          setEditorError('');
          setEditorLoading(false);
        }}
      />
    </div>
  );
}
