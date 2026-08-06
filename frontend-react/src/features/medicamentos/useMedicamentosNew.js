import { message } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

import { listarGruposMedicamento, listarMedicamentos } from './medicamentosApi.js';

function normalizeText(value) {
  return String(value || '').trim();
}

function sortByText(left, right, key) {
  const leftValue = String(left?.[key] ?? '').toLowerCase();
  const rightValue = String(right?.[key] ?? '').toLowerCase();
  return leftValue.localeCompare(rightValue, 'pt-BR', { sensitivity: 'base' });
}

const INITIAL_VISIBLE_COLUMNS = {
  nome: true,
  grupo: true,
  apresentacao: true,
};

export function useMedicamentosNew() {
  const [items, setItems] = useState([]);
  const [groups, setGroups] = useState([]);
  const [filters, setFilters] = useState({ nome: '', grupo: '', apresentacao: '' });
  const [sortState, setSortState] = useState({ key: 'nome', order: 'asc' });
  const [visibleColumns, setVisibleColumns] = useState(INITIAL_VISIBLE_COLUMNS);
  const [loading, setLoading] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const requestSeqRef = useRef(0);
  const debounceRef = useRef(null);

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

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoadingGroups(true);
        const next = await listarGruposMedicamento({ signal: controller.signal });
        setGroups(next);
      } catch (err) {
        if (!controller.signal.aborted) setGroups([]);
      } finally {
        if (!controller.signal.aborted) setLoadingGroups(false);
      }
    })();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    const controller = new AbortController();
    debounceRef.current = window.setTimeout(() => {
      const currentRequestId = ++requestSeqRef.current;
      (async () => {
        try {
          setLoading(true);
          setError('');
          const response = await listarMedicamentos(
            { grupo: filters.grupo, nome: filters.nome, limit: 1000, skip: 0 },
            { signal: controller.signal },
          );
          if (controller.signal.aborted || currentRequestId !== requestSeqRef.current) return;
          setItems(response.itens);
          setSelectedId((current) => {
            const currentNumber = Number(current);
            return response.itens.some((item) => Number(item.id) === currentNumber) ? currentNumber : response.itens[0]?.id ?? null;
          });
        } catch (err) {
          if (controller.signal.aborted || currentRequestId !== requestSeqRef.current) return;
          setItems([]);
          setSelectedId(null);
          const nextError = err?.message || 'Falha ao carregar medicamentos.';
          setError(nextError);
          message.error(nextError);
        } finally {
          if (!controller.signal.aborted && currentRequestId === requestSeqRef.current) setLoading(false);
        }
      })();
    }, 260);
    return () => {
      controller.abort();
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [filters.grupo, filters.nome]);

  useEffect(() => {
    setSelectedId((current) => {
      if (current == null) return sortedItems[0]?.id ?? null;
      return sortedItems.some((item) => Number(item.id) === Number(current)) ? current : null;
    });
  }, [sortedItems]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('brana-medicamentos-state', {
        detail: {
          groups,
          group: filters.grupo,
          name: filters.nome,
          apresentacao: filters.apresentacao,
          loadingGroups,
        },
      }),
    );
  }, [filters.apresentacao, filters.grupo, filters.nome, groups, loadingGroups]);

  useEffect(() => {
    const onToolbarFilter = (event) => {
      const field = String(event?.detail?.field || '').trim();
      const value = event?.detail?.value;
      if (field === 'group') {
        setFilters((current) => ({ ...current, grupo: normalizeText(value) }));
      }
      if (field === 'name') {
        setFilters((current) => ({ ...current, nome: normalizeText(value) }));
      }
      if (field === 'apresentacao') {
        setFilters((current) => ({ ...current, apresentacao: normalizeText(value) }));
      }
    };

    window.addEventListener('brana-medicamentos-toolbar-filter', onToolbarFilter);
    return () => window.removeEventListener('brana-medicamentos-toolbar-filter', onToolbarFilter);
  }, []);

  const totalItems = sortedItems.length;

  const clearFilter = (key) => {
    setFilters((current) => ({ ...current, [key]: '' }));
  };

  const handleToggleVisibleColumn = (key) => {
    setVisibleColumns((current) => {
      const next = { ...current };
      const visibleCount = Object.values(next).filter((value) => value !== false).length;
      const isVisible = next[key] !== false;
      if (isVisible && visibleCount <= 1) return current;
      next[key] = !isVisible;
      return next;
    });
  };

  return {
    items: sortedItems,
    filters,
    sortState,
    setSortState,
    visibleColumns,
    handleToggleVisibleColumn,
    loading,
    loadingGroups,
    error,
    totalItems,
    selectedId,
    setSelectedId,
    group: filters.grupo,
    groups,
    name: filters.nome,
    setGroup: (value) => setFilters((current) => ({ ...current, grupo: normalizeText(value) })),
    setName: (value) => setFilters((current) => ({ ...current, nome: normalizeText(value) })),
    clearFilter,
    setFilters,
  };
}
