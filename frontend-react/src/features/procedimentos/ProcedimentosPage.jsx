import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Typography, message } from 'antd';

import { BranaCard } from '../../components/BranaCard.jsx';
import { BranaTable } from '../../components/BranaTable.jsx';
import { BranaModal } from '../../components/BranaModal.jsx';
import { TableColumnFilterHeader } from '../../components/TableColumnFilterHeader.jsx';
import {
  listarProcedimentos,
  listarProcedimentosFiltros,
  listarProcedimentosGenericosCombos,
  listarSimbolosGraficoProcedimentos,
  obterProcedimentoDetalhe,
  obterProximoCodigoProcedimento,
  salvarProcedimento,
  excluirProcedimento,
  criarTabelaProcedimentos,
  atualizarTabelaProcedimentos,
  excluirTabelaProcedimentos,
  previewReajusteTabela,
  aplicarReajusteTabela,
} from './procedimentosApi.js';
import {
  createEmptyProcedimentoForm,
  buildProcedimentoPayload,
  createSpecialtyNameMap,
  extractProcedimentoSymbolPayload,
  hydrateProcedimentoSymbolState,
  normalizeProcedimentoSymbol,
  parseMoneyInput,
  toMoneyInputValue,
  resolveProcedimentoSymbolPreviewCandidates,
  resolveSpecialtyName,
} from './procedimentosEditorMappers.js';
import { getFirstProcedimentoRequiredIssue, validateProcedimentoForm } from './procedimentosEditorValidators.js';
import { ProcedimentoEditorModal } from './components/ProcedimentoEditorModal.jsx';
import { ProcedimentoTabelaModal, createTabelaForm, validateTabelaForm, buildTabelaPayload } from './components/ProcedimentoTabelaModal.jsx';
import { ProcedimentoReajusteModal, reajustePreviewKey } from './components/ProcedimentoReajusteModal.jsx';
import './procedimentos.css';

const TABLE_VISIBLE_ROWS = 15;
// Minimum readable width; horizontal scrolling is only a narrow-workspace fallback.
const TABLE_MIN_WIDTH = 900;
// Initial compact density: 22px text + 4px padding + 1px border.
// Replace this estimate with the rendered row height without changing its CSS.
const TABLE_INITIAL_ROW_HEIGHT = 27;

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
    observacoes: String(item?.observacoes || '').trim(),
  }));
}

export function ProcedimentosPage() {
  const tableGridRef = useRef(null);
  const [tableScrollY, setTableScrollY] = useState(TABLE_VISIBLE_ROWS * TABLE_INITIAL_ROW_HEIGHT);
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
  const [requiredIssue, setRequiredIssue] = useState(null);
  const [editorForm, setEditorForm] = useState(createEmptyProcedimentoForm());
  const editorChangedFields = useRef(new Set());
  const [procedimentoGenericoOptions, setProcedimentoGenericoOptions] = useState([]);
  const [simboloOptions, setSimboloOptions] = useState([]);
  const [indices, setIndices] = useState([]);
  const [tiposTiss, setTiposTiss] = useState([]);
  const [tabelaModal, setTabelaModal] = useState({ open: false, mode: 'new', codigo: null });
  const [tabelaForm, setTabelaForm] = useState(createTabelaForm());
  const [tabelaError, setTabelaError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [actionSaving, setActionSaving] = useState(false);
  const actionInFlight = useRef(false);
  const [reajusteOpen, setReajusteOpen] = useState(false);
  const [reajusteForm, setReajusteForm] = useState({ tabela_id: null, percentual: '1,00', modo: 'aumentar' });
  const [reajustePreview, setReajustePreview] = useState(null);
  const [reajusteLoading, setReajusteLoading] = useState(false);
  const [reajusteError, setReajusteError] = useState('');
  const previewGeneration = useRef(0);
  const listGeneration = useRef(0);

  const selectedItem = useMemo(() => procedimentos.find((item) => item.id === selectedId) || null, [procedimentos, selectedId]);
  const selectedTabela = tabelas.find((item) => item.id === selectedTabelaId) || null;
  const modalOpen = editorOpen || tabelaModal.open || Boolean(deleteTarget) || reajusteOpen;
  const actionsBusy = loading || loadingListas || editorLoading || editorSaving || actionSaving || modalOpen;
  const tabelaAtiva = Boolean(selectedTabela && !selectedTabela.inativo);
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
      setSimboloOptions([]);
      message.error(err?.message || 'Falha ao carregar combos do editor.');
      throw err;
    }
  };

  const loadListas = async (preferredId = null) => {
    setLoadingListas(true);
    try {
      const data = await listarProcedimentosFiltros();
      setTabelas(data.tabelas);
      setEspecialidades(data.especialidades);
      setIndices(data.indices || []);
      setTiposTiss(data.tiposTiss || []);
      const nextId = data.tabelas.find((item) => item.id === (preferredId ?? selectedTabelaId))?.id || data.tabelas[0]?.id || null;
      setSelectedTabelaId(nextId);
      return nextId;
    } catch (err) {
      setTabelas([]);
      setEspecialidades([]);
      setSelectedTabelaId(null);
      setError(err?.message || 'Falha ao carregar filtros de procedimentos.');
      message.error(err?.message || 'Falha ao carregar filtros de procedimentos.');
      return null;
    } finally {
      setLoadingListas(false);
    }
  };

  const loadProcedimentos = async (tabelaId = selectedTabelaId, especialidade = selectedEspecialidade, q = search) => {
    const generation = ++listGeneration.current;
    if (!tabelaId) {
      setProcedimentos([]);
      setSelectedId(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await listarProcedimentos({ tabelaId, especialidade, q });
      if (generation !== listGeneration.current) return;
      setProcedimentos(data);
      setSelectedId((current) => (data.some((item) => item.id === current) ? current : data[0]?.id || null));
    } catch (err) {
      if (generation !== listGeneration.current) return;
      setProcedimentos([]);
      setSelectedId(null);
      setError(err?.message || 'Falha ao carregar procedimentos.');
      message.error(err?.message || 'Falha ao carregar procedimentos.');
    } finally {
      if (generation === listGeneration.current) setLoading(false);
    }
  };

  useEffect(() => {
    void loadListas();
    void loadLookups().catch(() => {}); // Load already reports the error; modal callers handle rejection.
  }, []);

  useEffect(() => {
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
          modalOpen,
          canCreateProcedimento: tabelaAtiva && !actionsBusy,
          canEditProcedimento: tabelaAtiva && Boolean(selectedItem) && !actionsBusy,
          canDeleteProcedimento: tabelaAtiva && Boolean(selectedItem) && !actionsBusy,
          canCreateTabela: !loadingListas && !actionsBusy,
          canEditTabela: Boolean(selectedTabela) && !actionsBusy,
          canDeleteTabela: Boolean(selectedTabela) && !actionsBusy,
          canReajusteTabela: tabelaAtiva && !actionsBusy,
        },
      }),
    );
  }, [actionsBusy, modalOpen, tabelaAtiva, especialidades, loadingListas, search, selectedEspecialidade, selectedItem?.id, selectedTabelaId, tabelas]);

  const openNewModal = async () => {
    if (actionsBusy || !tabelaAtiva) return;
    if (!selectedTabelaId) {
      message.warning('Selecione uma tabela.');
      return;
    }
    editorChangedFields.current = new Set(selectedEspecialidade ? ['especialidade'] : []);
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
    if (actionsBusy || !tabelaAtiva) return;
    const targetId = Number(procedimentoId || 0) || 0;
    const target = procedimentos.find((item) => item.id === targetId) || null;
    if (!target) {
      message.warning('Selecione um procedimento para alterar.');
      return;
    }
    editorChangedFields.current = new Set();
    setEditorOpen(true);
    setEditorMode('edit');
    setEditorLoading(true);
    setEditorError('');
    try {
      const nextSimbolos = await loadLookups();
      // Drop compatibility metadata even if an older API returns it; keep other fields unchanged.
      const { mostrar_simbolo: _deprecatedFlag, ...detalhe } = await obterProcedimentoDetalhe(target.id);
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

  const refreshTabela = async (codigo) => {
    const nextId = await loadListas(codigo);
    setSelectedId(null);
    // A changed selection is loaded by the filter effect; refresh unchanged tables here.
    if (nextId === selectedTabelaId) await loadProcedimentos(nextId);
  };

  const openTabelaModal = (mode) => {
    if (actionsBusy || (mode === 'edit' && !selectedTabela)) return;
    setTabelaForm(createTabelaForm(mode === 'edit' ? selectedTabela : null, indices, tiposTiss));
    setTabelaError('');
    setTabelaModal({ open: true, mode, codigo: mode === 'edit' ? selectedTabela.codigo : null });
  };

  const handleSaveTabela = async () => {
    if (!tabelaModal.open || actionInFlight.current) return;
    const validation = validateTabelaForm(tabelaForm, tabelaModal.mode, tabelas);
    if (validation) { setTabelaError(validation); return; }
    actionInFlight.current = true;
    setActionSaving(true);
    setTabelaError('');
    try {
      const payload = buildTabelaPayload(tabelaForm, tabelaModal.mode);
      const saved = tabelaModal.mode === 'new'
        ? await criarTabelaProcedimentos(payload)
        : await atualizarTabelaProcedimentos(tabelaModal.codigo, payload);
      setTabelaModal((current) => ({ ...current, open: false }));
      message.success('Tabela salva com sucesso.');
      await refreshTabela(saved.codigo);
    } catch (err) {
      setTabelaError(err?.message || 'Falha ao gravar tabela.');
    } finally {
      actionInFlight.current = false;
      setActionSaving(false);
    }
  };

  const openDelete = (kind) => {
    if (actionsBusy) return;
    if (kind === 'procedimento') {
      if (!selectedItem || !tabelaAtiva) return;
      setDeleteTarget({ kind, id: selectedItem.id, codigo: selectedItem.codigo, nome: selectedItem.nome });
    } else {
      if (!selectedTabela) return;
      setDeleteTarget({ kind, codigo: selectedTabela.codigo, nome: selectedTabela.nome });
    }
    setDeleteError('');
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || actionInFlight.current) return;
    actionInFlight.current = true;
    setActionSaving(true);
    setDeleteError('');
    try {
      let result;
      if (deleteTarget.kind === 'procedimento') {
        result = await excluirProcedimento(deleteTarget.id);
        setDeleteTarget(null);
        await loadProcedimentos();
      } else {
        result = await excluirTabelaProcedimentos(deleteTarget.codigo);
        setDeleteTarget(null);
        await refreshTabela(null);
      }
      message.success(result?.detail || 'Exclusão concluída.');
    } catch (err) {
      setDeleteError(err?.message || 'Falha ao excluir.');
    } finally {
      actionInFlight.current = false;
      setActionSaving(false);
    }
  };

  const openReajuste = () => {
    if (actionsBusy || !tabelaAtiva) return;
    previewGeneration.current++;
    setReajusteForm({ tabela_id: selectedTabela.codigo, percentual: '1,00', modo: 'aumentar' });
    setReajustePreview(null);
    setReajusteError('');
    setReajusteOpen(true);
  };

  const changeReajuste = (field, value) => {
    previewGeneration.current++;
    setReajustePreview(null);
    setReajusteError('');
    setReajusteForm((current) => ({ ...current, [field]: value }));
  };

  const handlePreviewReajuste = async () => {
    const tabela = tabelas.find((item) => item.id === reajusteForm.tabela_id);
    if (!reajusteOpen || reajusteLoading || actionInFlight.current) return;
    const percentual = parseMoneyInput(reajusteForm.percentual);
    if (!tabela || tabela.inativo || !Number.isFinite(percentual) || percentual <= 0) {
      setReajusteError('Selecione uma tabela ativa e informe um percentual maior que zero.');
      return;
    }
    const generation = ++previewGeneration.current;
    const key = reajustePreviewKey(reajusteForm);
    setReajusteLoading(true);
    setReajustePreview(null);
    setReajusteError('');
    try {
      const data = await previewReajusteTabela(reajusteForm);
      if (generation === previewGeneration.current) setReajustePreview({ key, data });
    } catch (err) {
      if (generation === previewGeneration.current) setReajusteError(err?.message || 'Falha ao preparar reajuste.');
    } finally {
      setReajusteLoading(false);
    }
  };

  const handleApplyReajuste = async () => {
    const tabela = tabelas.find((item) => item.id === reajusteForm.tabela_id);
    if (!reajusteOpen || actionInFlight.current || reajusteLoading || !tabela || tabela.inativo
      || !reajustePreview?.data.total || reajustePreview.key !== reajustePreviewKey(reajusteForm)) return;
    actionInFlight.current = true;
    setActionSaving(true);
    setReajusteError('');
    try {
      // Keep the public code from the form, never the local PK returned in the preview.
      const result = await aplicarReajusteTabela({ ...reajusteForm, tabela_id: String(reajusteForm.tabela_id), confirmar: true });
      setReajusteOpen(false);
      message.success(result?.mensagem || 'Reajuste aplicado com sucesso.');
      await refreshTabela(reajusteForm.tabela_id);
    } catch (err) {
      setReajusteError(err?.message || 'Falha ao aplicar reajuste.');
    } finally {
      previewGeneration.current++;
      setReajustePreview(null);
      actionInFlight.current = false;
      setActionSaving(false);
    }
  };

  useEffect(() => {
    const onToolbarAction = (event) => {
      if (actionsBusy) return;
      const action = String(event?.detail?.action || '').trim();
      if (action === 'novo') {
        void openNewModal();
      } else if (action === 'alterar') {
        void openEditModal(selectedItem?.id || null);
      } else if (action === 'eliminar') openDelete('procedimento');
      else if (action === 'nova-tabela') openTabelaModal('new');
      else if (action === 'altera-tabela') openTabelaModal('edit');
      else if (action === 'elimina-tabela') openDelete('tabela');
      else if (action === 'reajusta-tabela') openReajuste();
    };

    const onToolbarFilter = (event) => {
      if (modalOpen || actionInFlight.current) return;
      const field = String(event?.detail?.field || '').trim();
      const value = event?.detail?.value;
      if (field === 'tabela') {
        listGeneration.current++;
        setProcedimentos([]);
        setSelectedId(null);
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
  }, [actionsBusy, modalOpen, selectedItem, selectedTabelaId, selectedEspecialidade, tabelas, indices, tiposTiss]);

  const handleFieldChange = (field, value) => {
    editorChangedFields.current.add(field);
    setEditorForm((current) => {
      if (field === 'simbolo_catalogo_id') {
        const nextOption = (Array.isArray(simboloOptions) ? simboloOptions : []).find((item) => Number(item.catalogId || item.value || 0) === Number(value || 0));
        return {
          ...current,
          simbolo_catalogo_id: Number(value || 0) || null,
          simbolo_grafico: nextOption?.codigo || '',
          simbolo_grafico_legacy_id: nextOption?.legacyId || null,
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
    const issue = getFirstProcedimentoRequiredIssue(editorForm, {
      genericOptions: procedimentoGenericoOptions,
      specialtyOptions: especialidadeOptions,
    });
    if (issue) {
      setRequiredIssue(issue);
      return;
    }
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
      const payload = buildProcedimentoPayload(editorForm, { changedFields: editorMode === 'new' ? null : editorChangedFields.current });
      if ('simbolo_grafico' in payload) {
        const symbolPayload = extractProcedimentoSymbolPayload(simboloOptions, editorForm);
        payload.simbolo_grafico = symbolPayload.simbolo_grafico;
        payload.simbolo_grafico_legacy_id = symbolPayload.simbolo_grafico_legacy_id;
      }
      const saved = await salvarProcedimento({
        id: editorForm.id,
        payload,
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

  useEffect(() => {
    const row = tableGridRef.current?.querySelector('.ant-table-tbody > tr.ant-table-row');
    if (!row || loading) return undefined;
    const measure = () => {
      const height = row.getBoundingClientRect().height;
      if (height > 0) setTableScrollY(height * TABLE_VISIBLE_ROWS);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    return () => observer.disconnect();
  }, [loading, sortedProcedimentos]);

  const columns = [
    {
      key: 'codigo',
      title: renderHeader('codigo', 'Código'),
      dataIndex: 'codigo',
      width: 80,
      render: (value) => <Typography.Text strong>{formatCode(value)}</Typography.Text>,
    },
    {
      key: 'nome',
      title: renderHeader('nome', 'Procedimento'),
      dataIndex: 'nome',
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
      width: 70,
      align: 'center',
      render: (value) => String(value ?? 0),
    },
    {
      key: 'preco',
      title: renderHeader('preco', 'Preço'),
      dataIndex: 'preco',
      width: 104,
      align: 'right',
      render: (value) => formatMoney(value),
    },
    {
      key: 'custo',
      title: renderHeader('custo', 'Custo'),
      dataIndex: 'custo',
      width: 104,
      align: 'right',
      render: (value) => formatMoney(value),
    },
    {
      key: 'custo_lab',
      title: renderHeader('custo_lab', 'Custo Lab.'),
      dataIndex: 'custo_lab',
      width: 104,
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
            <div className="procedimentos-list-frame">
            <div ref={tableGridRef} className="users-grid-shell procedimentos-genericos-grid procedimentos-main-grid" role="grid" aria-label="Listagem de procedimentos">
              <BranaTable
                rowKey="id"
                className="module-table auxiliary-compact-table procedimentos-table"
                loading={loading}
                pagination={false}
                size="small"
                tableLayout="fixed"
                scroll={{ x: TABLE_MIN_WIDTH, y: tableScrollY }}
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
            <div className="procedimentos-table-footer" aria-live="polite">
              <Typography.Text type="secondary">{rows.length} {rows.length === 1 ? 'procedimento' : 'procedimentos'}</Typography.Text>
            </div>
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
          setRequiredIssue(null);
        }}
      />
      <BranaModal open={Boolean(requiredIssue)} title="Aviso" okText="OK" maskClosable={false}
        cancelButtonProps={{ style: { display: 'none' } }}
        onOk={() => setRequiredIssue(null)} onCancel={() => setRequiredIssue(null)}>
        <Typography.Paragraph>{requiredIssue?.message}</Typography.Paragraph>
      </BranaModal>
      <ProcedimentoTabelaModal open={tabelaModal.open} mode={tabelaModal.mode} form={tabelaForm}
        indices={indices} tiposTiss={tiposTiss} tabelas={tabelas} saving={actionSaving} error={tabelaError}
        onChange={(field, value) => setTabelaForm((current) => ({ ...current, [field]: value }))}
        onSave={() => void handleSaveTabela()}
        onClose={() => { if (!actionInFlight.current) setTabelaModal((current) => ({ ...current, open: false })); }} />
      <BranaModal open={Boolean(deleteTarget)} title={deleteTarget?.kind === 'tabela' ? 'Elimina tabela' : 'Elimina procedimento'}
        maskClosable={false} closable={!actionSaving} confirmLoading={actionSaving}
        okText="Sim" cancelText="Não" okButtonProps={{ danger: true }} cancelButtonProps={{ disabled: actionSaving }}
        onOk={() => void handleConfirmDelete()}
        onCancel={() => { if (!actionInFlight.current) setDeleteTarget(null); }}>
        {deleteError ? <Alert type="error" message={deleteError} showIcon /> : null}
        <Typography.Paragraph>Deseja eliminar “{deleteTarget?.nome}” (código {deleteTarget?.codigo})?</Typography.Paragraph>
        {deleteTarget?.kind === 'tabela' ? <Typography.Paragraph>Todos os procedimentos desta tabela serão eliminados.</Typography.Paragraph> : null}
      </BranaModal>
      <ProcedimentoReajusteModal open={reajusteOpen} form={reajusteForm} tabelas={tabelas} preview={reajustePreview}
        loading={reajusteLoading} saving={actionSaving} error={reajusteError} onChange={changeReajuste}
        onPreview={() => void handlePreviewReajuste()} onApply={() => void handleApplyReajuste()}
        onClose={() => {
          if (actionInFlight.current || reajusteLoading) return;
          previewGeneration.current++;
          setReajusteOpen(false);
          setReajustePreview(null);
        }} />
    </div>
  );
}
