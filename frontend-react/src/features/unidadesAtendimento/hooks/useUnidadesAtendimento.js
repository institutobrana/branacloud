import { message } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  atualizarUnidadeAtendimento,
  criarUnidadeAtendimento,
  listarAuxiliaresPorTipo,
  listarUnidadesAtendimento,
  obterProximoCodigoUnidadeAtendimento,
} from '../services/unidadesAtendimentoApi.js';
import { EMPTY_UNIDADE_ATENDIMENTO_FORM, buildUnidadeAtendimentoPayload, mapUnidadeAtendimentoToForm } from '../utils/unidadeAtendimentoMappers.js';
import { validateUnidadeAtendimentoValues } from '../utils/unidadeAtendimentoValidation.js';
import { UNIDADE_ATENDIMENTO_PHONE_TYPES, UNIDADE_ATENDIMENTO_UFS } from '../constants/unidadeAtendimentoOptions.js';

function normalizeText(value) {
  return String(value ?? '').trim();
}

function applyFilters(items, filters) {
  return (items || []).filter((item) => {
    const codigo = normalizeText(filters.codigo);
    const nome = normalizeText(filters.nome);
    const fone1 = normalizeText(filters.fone1);
    const fone2 = normalizeText(filters.fone2);
    const status = normalizeText(filters.status);

    if (codigo && !normalizeText(item.codigo).toLowerCase().includes(codigo.toLowerCase())) return false;
    if (nome && !normalizeText(item.nome).toLowerCase().includes(nome.toLowerCase())) return false;
    if (fone1 && !normalizeText(item.fone1).toLowerCase().includes(fone1.toLowerCase())) return false;
    if (fone2 && !normalizeText(item.fone2).toLowerCase().includes(fone2.toLowerCase())) return false;
    if (status) {
      const current = item.inativo ? 'inativo' : 'ativo';
      if (!current.includes(status.toLowerCase())) return false;
    }
    return true;
  });
}

function sortItems(items, sortState) {
  const next = [...items];
  const { key, order } = sortState || {};
  if (!key || !order) return next;
  next.sort((left, right) => {
    const a = String(left?.[key] ?? '').toLowerCase();
    const b = String(right?.[key] ?? '').toLowerCase();
    const comparison = a.localeCompare(b, 'pt-BR', { sensitivity: 'base' });
    return order === 'asc' ? comparison : -comparison;
  });
  return next;
}

export function useUnidadesAtendimento() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [filters, setFilters] = useState({ codigo: '', nome: '', fone1: '', fone2: '', status: '' });
  const [sortState, setSortState] = useState({ key: 'codigo', order: 'asc' });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [modalSaving, setModalSaving] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalValues, setModalValues] = useState(EMPTY_UNIDADE_ATENDIMENTO_FORM);
  const [nextCodeLoading, setNextCodeLoading] = useState(false);
  const [comboOptions, setComboOptions] = useState({
    logradouroOptions: [],
    bairroOptions: [],
    cidadeOptions: [],
  });
  const requestSeqRef = useRef(0);

  const filteredItems = useMemo(() => applyFilters(items, filters), [filters, items]);
  const sortedItems = useMemo(() => sortItems(filteredItems, sortState), [filteredItems, sortState]);

  useEffect(() => {
    const currentSelected = Number(selectedId || 0) || null;
    if (!currentSelected) return;
    const exists = items.some((item) => Number(item.id) === Number(currentSelected));
    if (!exists) {
      setSelectedId(null);
    }
  }, [items, selectedId]);

  const loadItems = useCallback(async () => {
    const seq = ++requestSeqRef.current;
    setLoading(true);
    setError('');
    try {
      const data = await listarUnidadesAtendimento();
      if (seq !== requestSeqRef.current) return;
      setItems(data);
      setSelectedId((current) => {
        const currentId = Number(current || 0) || null;
        if (!currentId) return data[0]?.id ?? null;
        return data.some((item) => Number(item.id) === Number(currentId)) ? currentId : data[0]?.id ?? null;
      });
    } catch (err) {
      if (seq !== requestSeqRef.current) return;
      setItems([]);
      setSelectedId(null);
      const nextError = err?.message || 'Falha ao carregar unidades de atendimento.';
      setError(nextError);
      message.error(nextError);
    } finally {
      if (seq === requestSeqRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  useEffect(() => {
    let cancelled = false;
    const loadCombos = async () => {
      try {
        const [logradouroItems, bairroItems, cidadeItems] = await Promise.all([
          listarAuxiliaresPorTipo('Tipos de logradouro'),
          listarAuxiliaresPorTipo('Bairro'),
          listarAuxiliaresPorTipo('Cidade'),
        ]);
        if (cancelled) return;
        const toOptions = (items) =>
          (Array.isArray(items) ? items : [])
            .map((item) => ({
              value: String(item?.descricao ?? item?.name ?? '').trim(),
              label: String(item?.descricao ?? item?.name ?? '').trim(),
            }))
            .filter((item) => item.value);
        setComboOptions({
          logradouroOptions: toOptions(logradouroItems),
          bairroOptions: toOptions(bairroItems),
          cidadeOptions: toOptions(cidadeItems),
        });
      } catch {
        if (cancelled) return;
        setComboOptions({
          logradouroOptions: [],
          bairroOptions: [],
          cidadeOptions: [],
        });
      }
    };
    void loadCombos();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedItem = useMemo(
    () => items.find((item) => Number(item.id) === Number(selectedId)) || null,
    [items, selectedId],
  );

  const openCreateModal = useCallback(async () => {
    setModalMode('create');
    setModalValues(EMPTY_UNIDADE_ATENDIMENTO_FORM);
    setModalError('');
    setModalOpen(true);
    setNextCodeLoading(true);
    try {
      const codigo = await obterProximoCodigoUnidadeAtendimento();
      setModalValues((current) => ({ ...current, codigo: codigo || current.codigo }));
    } catch (err) {
      const nextError = err?.message || 'Falha ao obter o proximo codigo.';
      setModalError(nextError);
      message.error(nextError);
    } finally {
      setNextCodeLoading(false);
    }
  }, []);

  const openEditModal = useCallback((item) => {
    if (!item?.id) return;
    setModalMode('edit');
    setModalValues(mapUnidadeAtendimentoToForm(item));
    setModalError('');
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    if (modalSaving) return;
    setModalOpen(false);
    setModalError('');
    setModalValues(EMPTY_UNIDADE_ATENDIMENTO_FORM);
    setModalMode('create');
  }, [modalSaving]);

  const submitModal = useCallback(async (values) => {
    const validation = validateUnidadeAtendimentoValues(values);
    if (!validation.valid) {
      return { valid: false, errors: validation.errors };
    }

    setModalSaving(true);
    setModalError('');
    try {
      const payload = buildUnidadeAtendimentoPayload(values, {
        qtdSala: modalMode === 'edit' ? selectedItem?.qtd_sala : undefined,
      });
      const saved = modalMode === 'edit'
        ? await atualizarUnidadeAtendimento(values.id, payload)
        : await criarUnidadeAtendimento(payload);

      await loadItems();
      if (saved?.id) {
        setSelectedId(saved.id);
      }
      setModalOpen(false);
      setModalValues(EMPTY_UNIDADE_ATENDIMENTO_FORM);
      setModalMode('create');
      message.success(modalMode === 'edit' ? 'Unidade atualizada com sucesso.' : 'Unidade criada com sucesso.');
      return { valid: true, item: saved };
    } catch (err) {
      const nextError = err?.message || 'Falha ao salvar unidade de atendimento.';
      setModalError(nextError);
      message.error(nextError);
      return { valid: false, error: nextError };
    } finally {
      setModalSaving(false);
    }
  }, [loadItems, modalMode, selectedItem]);

  useEffect(() => {
    setSelectedId((current) => {
      if (current == null) return sortedItems[0]?.id ?? null;
      return sortedItems.some((item) => Number(item.id) === Number(current)) ? current : null;
    });
  }, [sortedItems]);

  const applyFilter = useCallback((key, value) => {
    const nextValue = normalizeText(value);
    setFilters((current) => ({ ...current, [key]: nextValue }));
  }, []);

  const clearFilter = useCallback((key) => {
    setFilters((current) => ({ ...current, [key]: '' }));
  }, []);

  return {
    items: sortedItems,
    loading,
    error,
    selectedId,
    selectedItem,
    setSelectedId,
    filters,
    sortState,
    setSortState,
    applyFilter,
    clearFilter,
    modalOpen,
    modalMode,
    modalSaving,
    modalError,
    modalValues,
    nextCodeLoading,
    comboOptions,
    ufOptions: UNIDADE_ATENDIMENTO_UFS,
    openCreateModal,
    openEditModal,
    closeModal,
    submitModal,
    reload: loadItems,
  };
}
