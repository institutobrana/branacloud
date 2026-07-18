import { useEffect, useMemo, useRef, useState } from 'react';
import {
  atualizarVinculoMaterialProcedimento,
  desvincularMaterialProcedimento,
  listarMateriaisDaLista,
  listarMateriaisListas,
  listarProcedimentoMateriais,
  vincularMaterialProcedimento,
} from '../procedimentosMateriaisApi.js';
import {
  normalizeMaterialList,
  normalizeMaterialListItem,
  normalizeProcedimentoMateriaisState,
} from '../procedimentosMateriaisMappers.js';

const emptyCatalog = Object.freeze({
  listas: [],
  materiais: [],
});

const emptyEditor = Object.freeze({
  open: false,
  mode: 'new',
  loading: false,
  saving: false,
  error: '',
  procedimentoId: null,
  listaId: null,
  materialId: null,
  quantidade: '0',
  relacao: '',
  preco: '',
  custoUnd: '',
  custoTotal: '',
  busca: '',
});

const emptyState = Object.freeze({
  loading: false,
  error: '',
  items: [],
  total_materiais: 0,
  total_custo_und: 0,
  total_custo: 0,
  selectedCodigo: '',
  selectedItem: null,
  editor: emptyEditor,
  catalog: emptyCatalog,
});

function resolveCatalogItem(materiais, materialId) {
  return (Array.isArray(materiais) ? materiais : []).find((item) => Number(item?.id || 0) === Number(materialId || 0)) || null;
}

function normalizeSearchText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

function materialMatchesSearch(material, searchText) {
  if (!searchText) return true;
  const code = normalizeSearchText(material?.codigo);
  const name = normalizeSearchText(material?.nome);
  return code.includes(searchText) || name.includes(searchText);
}

export function useProcedimentoMateriais({ procedimentoId, open, onMutate } = {}) {
  const [state, setState] = useState(emptyState);
  const requestSeqRef = useRef(0);
  const materialInteractionRef = useRef(false);

  const setCatalog = (updater) => {
    setState((current) => ({
      ...current,
      catalog: typeof updater === 'function' ? updater(current.catalog) : updater,
    }));
  };

  const reloadMaterialList = async (listaId) => {
    const materials = await listarMateriaisDaLista({ listaId, q: '', classificacao: '__todos__' });
    setCatalog((current) => ({
      ...current,
      materiais: Array.isArray(materials) ? materials.map(normalizeMaterialListItem) : [],
    }));
    return materials;
  };

  const openEditor = async ({ mode = 'new', vinculo = null } = {}) => {
    if (!Number(procedimentoId || 0)) {
      setState((current) => ({
        ...current,
        editor: {
          ...emptyEditor,
          error: 'Salve o procedimento antes de vincular materiais.',
        },
      }));
      return;
    }

    const seq = ++requestSeqRef.current;
    setState((current) => ({
      ...current,
      editor: {
        ...current.editor,
        open: true,
        mode,
        loading: true,
        saving: false,
        error: '',
        procedimentoId,
      },
    }));

    try {
      const listas = await listarMateriaisListas();
      if (seq !== requestSeqRef.current) return;
      const normalizedListas = Array.isArray(listas) ? listas.map(normalizeMaterialList) : [];
      const nextListaId = Number(vinculo?.lista_id || normalizedListas[0]?.id || 0) || null;
      materialInteractionRef.current = false;
      setCatalog((current) => ({
        ...current,
        listas: normalizedListas,
      }));
      setState((current) => ({
        ...current,
        editor: {
          ...current.editor,
          open: true,
          mode,
          loading: false,
          saving: false,
          error: '',
          procedimentoId,
          listaId: nextListaId,
          materialId: Number(vinculo?.material_id || 0) || null,
          quantidade: String(vinculo?.quantidade ?? '0'),
          relacao: vinculo ? String(vinculo?.relacao ?? '') : '',
          preco: vinculo ? String(vinculo?.preco ?? '') : '',
          custoUnd: vinculo ? String(vinculo?.custo_und ?? '') : '',
          custoTotal: vinculo ? String(vinculo?.custo_total ?? '') : '',
          busca: '',
        },
      }));
      if (nextListaId) {
        await reloadMaterialList(nextListaId);
      }
    } catch (error) {
      if (seq !== requestSeqRef.current) return;
      setState((current) => ({
        ...current,
        editor: {
          ...current.editor,
          loading: false,
          error: String(error?.message || 'Falha ao abrir vinculo de material.'),
        },
      }));
    }
  };

  const closeEditor = () => {
    requestSeqRef.current += 1;
    materialInteractionRef.current = false;
    setState((current) => ({
      ...current,
      editor: emptyEditor,
    }));
  };

  const refresh = async (nextProcedureId = procedimentoId) => {
    if (!open || !Number(nextProcedureId || 0)) {
      requestSeqRef.current += 1;
      setState((current) => ({
        ...current,
        loading: false,
        error: '',
        items: [],
        total_materiais: 0,
        total_custo_und: 0,
        total_custo: 0,
        selectedCodigo: '',
        selectedItem: null,
      }));
      return;
    }

    const seq = ++requestSeqRef.current;
    setState((current) => ({ ...current, loading: true, error: '' }));

    try {
      const data = await listarProcedimentoMateriais(nextProcedureId);
      if (seq !== requestSeqRef.current) return;
      const normalized = normalizeProcedimentoMateriaisState(data);
      setState((current) => ({
        ...current,
        loading: false,
        error: '',
        items: normalized.itens,
        total_materiais: normalized.total_materiais,
        total_custo_und: normalized.total_custo_und,
        total_custo: normalized.total_custo,
        selectedCodigo: normalized.itens[0]?.codigo || '',
        selectedItem: normalized.itens[0] || null,
      }));
    } catch (error) {
      if (seq !== requestSeqRef.current) return;
      setState((current) => ({
        ...current,
        loading: false,
        error: String(error?.message || 'Falha ao carregar materiais vinculados.'),
        items: [],
        total_materiais: 0,
        total_custo_und: 0,
        total_custo: 0,
        selectedCodigo: '',
        selectedItem: null,
      }));
    }
  };

  useEffect(() => {
    void refresh(procedimentoId);
  }, [procedimentoId, open]);

  const selectItem = (codigo) => {
    materialInteractionRef.current = true;
    setState((current) => {
      const selectedItem = current.items.find((item) => String(item?.codigo || '') === String(codigo || '')) || null;
      return {
        ...current,
        selectedCodigo: String(codigo || ''),
        selectedItem,
      };
    });
  };

  const updateEditorField = (field, value) => {
    setState((current) => {
      const nextEditor = { ...current.editor, [field]: value };
      if (field === 'listaId') {
        nextEditor.materialId = null;
        nextEditor.busca = '';
        materialInteractionRef.current = false;
      }
      if (field === 'quantidade') {
        const quantidade = Number(String(value ?? '').replace(',', '.')) || 0;
        const custoUnd = Number(nextEditor.custoUnd || 0);
        if (Number.isFinite(quantidade) && Number.isFinite(custoUnd)) {
          nextEditor.custoTotal = String(custoUnd * quantidade);
        }
      }
      return { ...current, editor: nextEditor };
    });
  };

  const syncEditorWithMaterial = (material) => {
    setState((current) => ({
      ...current,
      editor: {
        ...current.editor,
        materialId: material?.id || null,
        relacao: material?.relacao != null ? String(material.relacao) : '',
        preco: material?.preco != null ? String(material.preco) : '',
        custoUnd: material?.custo != null ? String(material.custo) : '0',
        custoTotal: material?.custo != null ? String(Number(material.custo || 0) * Number(current.editor.quantidade || 0)) : '0',
      },
    }));
  };

  const resolveSelectedMaterial = () => {
    const materiais = state.catalog.materiais || [];
    return resolveCatalogItem(materiais, state.editor.materialId);
  };

  const materiaisFiltrados = useMemo(() => {
    const busca = normalizeSearchText(state.editor.busca);
    const materiais = Array.isArray(state.catalog.materiais) ? state.catalog.materiais : [];
    return materiais.filter((item) => materialMatchesSearch(item, busca));
  }, [state.catalog.materiais, state.editor.busca]);

  useEffect(() => {
    if (!open) return;
    if (state.editor.loading) return;
    if (!state.editor.listaId) return;

    const materiais = Array.isArray(state.catalog.materiais) ? state.catalog.materiais : [];
    if (!materiais.length) {
      if (state.editor.materialId) {
        syncEditorWithMaterial(null);
      }
      return;
    }

    const materialAtual = resolveCatalogItem(materiais, state.editor.materialId);
    const busca = normalizeSearchText(state.editor.busca);
    const materialVisivel = materialAtual
      ? materiaisFiltrados.some((item) => Number(item.id || 0) === Number(materialAtual.id || 0))
      : false;

    if (state.editor.mode === 'edit' && !materialInteractionRef.current && state.editor.materialId && materialVisivel) {
      return;
    }

    const primeiro = materiaisFiltrados[0] || null;
    if (primeiro) {
      if (Number(state.editor.materialId || 0) !== Number(primeiro.id || 0)) {
        syncEditorWithMaterial(primeiro);
      }
      return;
    }

    if (busca || state.editor.materialId || Number(state.editor.custoUnd || 0) || Number(state.editor.custoTotal || 0)) {
      syncEditorWithMaterial(null);
    }
  }, [
    materiaisFiltrados,
    open,
    state.catalog.materiais,
    state.editor.busca,
    state.editor.listaId,
    state.editor.loading,
    state.editor.materialId,
    state.editor.custoUnd,
    state.editor.custoTotal,
    state.editor.mode,
  ]);

  const saveEditor = async () => {
    const editor = state.editor;
    const quantidade = Number(String(editor.quantidade || '').replace(',', '.'));
    const material = resolveSelectedMaterial();

    if (!Number(editor.procedimentoId || 0)) {
      setState((current) => ({
        ...current,
        editor: { ...current.editor, error: 'Salve o procedimento antes de vincular materiais.' },
      }));
      return false;
    }

    if (!material) {
      setState((current) => ({
        ...current,
        editor: { ...current.editor, error: 'Selecione um material.' },
      }));
      return false;
    }

    if (!Number.isFinite(quantidade) || quantidade <= 0) {
      setState((current) => ({
        ...current,
        editor: { ...current.editor, error: 'Informe uma quantidade valida.' },
      }));
      return false;
    }

    setState((current) => ({
      ...current,
      editor: { ...current.editor, saving: true, error: '' },
    }));

    try {
      if (editor.mode === 'edit') {
        await atualizarVinculoMaterialProcedimento({
          procedimentoId: editor.procedimentoId,
          codigo: material.codigo || resolveSelectedMaterial()?.codigo || '',
          quantidade,
        });
      } else {
        await vincularMaterialProcedimento({
          procedimentoId: editor.procedimentoId,
          materialId: material.id,
          quantidade,
        });
      }
      requestSeqRef.current += 1;
      await refresh(editor.procedimentoId);
      closeEditor();
      onMutate?.();
      return true;
    } catch (error) {
      setState((current) => ({
        ...current,
        editor: {
          ...current.editor,
          saving: false,
          error: String(error?.message || 'Falha ao salvar vinculo.'),
        },
      }));
      return false;
    }
  };

  const deleteSelected = async () => {
    const selected = state.selectedItem;
    if (!selected || !Number(procedimentoId || 0)) return false;

    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      await desvincularMaterialProcedimento({
        procedimentoId,
        codigo: selected.codigo,
      });
      await refresh(procedimentoId);
      onMutate?.();
      return true;
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        error: String(error?.message || 'Falha ao desvincular material.'),
      }));
      return false;
    }
  };

  return {
    state,
    materiaisFiltrados,
    actions: {
      refresh,
      openEditor,
      closeEditor,
      selectItem,
      updateEditorField,
      syncEditorWithMaterial,
      saveEditor,
      deleteSelected,
      reloadMaterialList,
    },
  };
}
