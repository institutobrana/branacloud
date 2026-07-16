import { message } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

import { listarProteticos, listarServicosProtetico } from '../servicosProteticoApi.js';
import { filterServicos, sortServicos } from '../utils/servicosProteticoFilters.js';
import { createRequestSequenceGate } from '../utils/servicosProteticoRace.js';

export const INITIAL_VISIBLE_COLUMNS = {
  codigo: true,
  nome: true,
  indice: true,
  preco: true,
  prazo: true,
};

export const EMPTY_FILTERS = {
  codigo: '',
  nome: '',
  indice: '',
  preco: '',
  prazo: '',
};

export function toggleVisibleColumnMap(current, key) {
  const next = { ...(current || INITIAL_VISIBLE_COLUMNS) };
  const activeKeys = Object.entries(next).filter(([, value]) => value !== false);
  const isCurrentlyVisible = next[key] !== false;
  if (isCurrentlyVisible && activeKeys.length <= 1) {
    return current || INITIAL_VISIBLE_COLUMNS;
  }
  next[key] = !isCurrentlyVisible;
  return next;
}

export function useServicosProtetico() {
  const [proteticos, setProteticos] = useState([]);
  const [selectedProteticoId, setSelectedProteticoId] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [loadingProteticos, setLoadingProteticos] = useState(true);
  const [loadingServicos, setLoadingServicos] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [sortState, setSortState] = useState({ key: 'nome', order: 'asc' });
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [visibleColumns, setVisibleColumns] = useState(INITIAL_VISIBLE_COLUMNS);
  const [reloadToken, setReloadToken] = useState(0);
  const loadSeqRef = useRef(createRequestSequenceGate());

  const loadProteticos = async () => {
    setLoadingProteticos(true);
    setError('');
    try {
      const data = await listarProteticos();
      setProteticos(data);
      setSelectedProteticoId((current) => {
        if (current && data.some((item) => item.id === current)) return current;
        return data[0]?.id ?? null;
      });
    } catch (err) {
      setProteticos([]);
      setSelectedProteticoId(null);
      const nextError = err?.message || 'Falha ao carregar proteticos.';
      setError(nextError);
      message.error(nextError);
    } finally {
      setLoadingProteticos(false);
    }
  };

  const loadServicos = async (proteticoId) => {
    const requestSeq = loadSeqRef.current.next();
    const id = Number(proteticoId || 0) || 0;
    if (!id) {
      setServicos([]);
      setSelectedId(null);
      return;
    }

    setLoadingServicos(true);
    setError('');
    try {
      const data = await listarServicosProtetico(id);
      if (!loadSeqRef.current.isCurrent(requestSeq)) return;
      setServicos(data);
      setSelectedId((current) => (data.some((item) => item.id === current) ? current : data[0]?.id ?? null));
    } catch (err) {
      if (!loadSeqRef.current.isCurrent(requestSeq)) return;
      setServicos([]);
      setSelectedId(null);
      const nextError = err?.message || 'Falha ao carregar servicos de protetico.';
      setError(nextError);
      message.error(nextError);
    } finally {
      setLoadingServicos(false);
    }
  };

  useEffect(() => {
    void loadProteticos();
  }, []);

  useEffect(() => {
    setSelectedId(null);
    setFilters(EMPTY_FILTERS);
    void loadServicos(selectedProteticoId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProteticoId, reloadToken]);

  const filteredServicos = useMemo(() => filterServicos(servicos, filters), [filters, servicos]);
  const sortedServicos = useMemo(() => sortServicos(filteredServicos, sortState), [filteredServicos, sortState]);

  useEffect(() => {
    setSelectedId((current) => (sortedServicos.some((item) => item.id === current) ? current : null));
  }, [sortedServicos]);

  const selectedItem = useMemo(
    () => sortedServicos.find((item) => item.id === selectedId) || null,
    [selectedId, sortedServicos],
  );

  const totalItems = sortedServicos.length;
  const hasSelection = Boolean(selectedItem);
  const selectedProtetico = useMemo(
    () => proteticos.find((item) => item.id === selectedProteticoId) || null,
    [proteticos, selectedProteticoId],
  );

  const handleSelectProteticoId = (value) => {
    loadSeqRef.current.bump();
    setSelectedId(null);
    setServicos([]);
    setFilters(EMPTY_FILTERS);
    setSelectedProteticoId(Number(value || 0) || null);
  };

  const refreshServicos = () => {
    setReloadToken((current) => current + 1);
  };

  const handleToggleVisibleColumn = (key) => {
    setVisibleColumns((current) => toggleVisibleColumnMap(current, key));
  };

  return {
    proteticos,
    selectedProteticoId,
    setSelectedProteticoId: handleSelectProteticoId,
    selectedProtetico,
    servicos: sortedServicos,
    totalItems,
    loading: loadingProteticos || loadingServicos,
    loadingProteticos,
    loadingServicos,
    error,
    selectedId,
    setSelectedId,
    selectedItem,
    hasSelection,
    sortState,
    setSortState,
    filters,
    setFilters,
    refreshServicos,
    visibleColumns,
    handleToggleVisibleColumn,
  };
}
