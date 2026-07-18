import { message } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { listarGruposMedicamento, listarMedicamentos } from './medicamentosApi.js';

function normalizeText(value) {
  return String(value || '').trim();
}

function sortByText(left, right, key) {
  const leftValue = String(left?.[key] ?? '').toLowerCase();
  const rightValue = String(right?.[key] ?? '').toLowerCase();
  return leftValue.localeCompare(rightValue, 'pt-BR', { sensitivity: 'base' });
}

function toggleVisibleColumnMap(current, key) {
  const next = { ...(current || {}) };
  const isVisible = next[key] !== false;
  const visibleKeys = Object.entries(next).filter(([, value]) => value !== false);
  if (isVisible && visibleKeys.length <= 1) {
    return current || next;
  }
  next[key] = !isVisible;
  return next;
}

function resolveGroupValueFromGroups(groups, value) {
  const text = normalizeText(value);
  if (!text) return '';
  const match = groups.find((item) => {
    const label = normalizeText(item?.descricao || item?.codigo || '');
    return label.localeCompare(text, 'pt-BR', { sensitivity: 'base' }) === 0;
  });
  return normalizeText(match?.descricao || match?.codigo || '');
}

export const INITIAL_VISIBLE_COLUMNS = {
  nome: true,
  grupo: true,
  apresentacao: true,
};

export function useMedicamentos() {
  const [items, setItems] = useState([]);
  const [groups, setGroups] = useState([]);
  const [apresentacoes, setApresentacoes] = useState([]);
  const [filters, setFilters] = useState({ nome: '', grupo: '', apresentacao: '' });
  const [sortState, setSortState] = useState({ key: 'nome', order: 'asc' });
  const [visibleColumns, setVisibleColumns] = useState(INITIAL_VISIBLE_COLUMNS);
  const [loading, setLoading] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [total, setTotal] = useState(0);
  const requestSeqRef = useRef(0);
  const debounceRef = useRef(null);

  const selectedItem = useMemo(
    () => items.find((item) => Number(item.id) === Number(selectedId)) || null,
    [items, selectedId],
  );

  const filteredItems = useMemo(() => {
    const presentationFilter = normalizeText(filters.apresentacao);
    if (!presentationFilter) return items;
    return items.filter((item) => normalizeText(item?.apresentacao) === presentationFilter);
  }, [filters.apresentacao, items]);

  const sortedItems = useMemo(() => {
    const next = [...filteredItems];
    const { key, order } = sortState;
    if (!key || !order) return next;

    next.sort((left, right) => {
      const comparison = sortByText(left, right, key);
      return order === 'asc' ? comparison : -comparison;
    });

    return next;
  }, [filteredItems, sortState]);

  const loadGroups = async (signal) => {
    setLoadingGroups(true);
    try {
      const next = await listarGruposMedicamento({ signal });
      setGroups(next);
    } catch (err) {
      if (signal?.aborted) return;
      setGroups([]);
    } finally {
      if (!signal?.aborted) {
        setLoadingGroups(false);
      }
    }
  };

  const loadMedicamentos = async ({ currentFilters = filters, signal } = {}) => {
    const currentRequestId = ++requestSeqRef.current;
    setLoading(true);
    setError('');
    try {
      const response = await listarMedicamentos(
        {
          grupo: currentFilters.grupo,
          nome: currentFilters.nome,
          limit: 1000,
          skip: 0,
        },
        { signal },
      );

      if (signal?.aborted || currentRequestId !== requestSeqRef.current) {
        return;
      }

      setItems(response.itens);
      setTotal(response.total);
      setApresentacoes(
        [...new Set(response.itens.map((item) => String(item?.apresentacao || '').trim()).filter(Boolean))].sort((left, right) =>
          left.localeCompare(right, 'pt-BR', { sensitivity: 'base' }),
        ),
      );
      setSelectedId((current) => {
        const currentNumber = Number(current);
        return response.itens.some((item) => Number(item.id) === currentNumber) ? currentNumber : response.itens[0]?.id ?? null;
      });
    } catch (err) {
      if (signal?.aborted || currentRequestId !== requestSeqRef.current) {
        return;
      }
      setItems([]);
      setTotal(0);
      setApresentacoes([]);
      setSelectedId(null);
      const nextError = err?.message || 'Falha ao carregar medicamentos.';
      setError(nextError);
      message.error(nextError);
    } finally {
      if (!signal?.aborted && currentRequestId === requestSeqRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadGroups(controller.signal);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    const controller = new AbortController();
    debounceRef.current = window.setTimeout(() => {
      void loadMedicamentos({ currentFilters: filters, signal: controller.signal });
    }, 260);

    return () => {
      controller.abort();
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [filters]);

  useEffect(() => {
    setSelectedId((current) => {
      if (current == null) return sortedItems[0]?.id ?? null;
      return sortedItems.some((item) => Number(item.id) === Number(current)) ? current : null;
    });
  }, [sortedItems]);

  const setFilterValue = (key, value) => {
    const nextValue = normalizeText(value);
    setFilters((current) => ({
      ...current,
      [key]: key === 'grupo' ? resolveGroupValueFromGroups(groups, nextValue) : nextValue,
    }));
  };

  const clearFilter = (key) => {
    setFilters((current) => ({ ...current, [key]: '' }));
  };

  const handleToggleVisibleColumn = useCallback((key) => {
    setVisibleColumns((current) => toggleVisibleColumnMap(current, key));
  }, []);

  return {
    items: sortedItems,
    filteredItems: sortedItems,
    groups,
    apresentacoes,
    filters,
    sortState,
    setSortState,
    visibleColumns,
    handleToggleVisibleColumn,
    group: filters.grupo,
    name: filters.nome,
    apresentacao: filters.apresentacao,
    loading,
    loadingGroups,
    error,
    totalItems: sortedItems.length,
    selectedId,
    selectedItem,
    setSelectedId,
    setGroup: (value) => setFilterValue('grupo', value),
    setName: (value) => setFilterValue('nome', value),
    setApresentacao: (value) => setFilterValue('apresentacao', value),
    setFilters,
    clearFilter,
    reload: () => void loadMedicamentos({ currentFilters: filters }),
  };
}
