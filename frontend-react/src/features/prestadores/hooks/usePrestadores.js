import { message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { listarPrestadores } from '../prestadoresApi.js';
import { listarEspecialidadesAtivas } from '../../tabelasAuxiliares/auxiliaresApi.js';

export const EMPTY_PRESTADORES_FILTERS = {
  especialidade: '',
  nome: '',
};

const PRESTADORES_FILTER_DEBUG = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

function normalizeSearchText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

export function usePrestadores() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [filters, setFilters] = useState(EMPTY_PRESTADORES_FILTERS);
  const [catalogoEspecialidades, setCatalogoEspecialidades] = useState([]);

  const loadPrestadores = useCallback(async (cancelledRef = { current: false }, options = {}) => {
    const preserveSelection = options?.preserveSelection !== false;
    setLoading(true);
    setError('');
    try {
      const [prestadoresData, especialidadesData] = await Promise.all([
        listarPrestadores(),
        listarEspecialidadesAtivas(),
      ]);
      if (cancelledRef.current) return;
      setItems(prestadoresData);
      setCatalogoEspecialidades(Array.isArray(especialidadesData) ? especialidadesData : []);
      setSelectedId((current) => {
        if (preserveSelection && prestadoresData.some((item) => item.id === current)) {
          return current;
        }
        return preserveSelection ? (prestadoresData[0]?.id ?? null) : null;
      });
    } catch (err) {
      if (cancelledRef.current) return;
      setItems([]);
      setCatalogoEspecialidades([]);
      setSelectedId(null);
      const nextError = err?.message || 'Falha ao carregar prestadores.';
      setError(nextError);
      message.error(nextError);
    } finally {
      if (!cancelledRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cancelledRef = { current: false };
    void loadPrestadores(cancelledRef);
    return () => {
      cancelledRef.current = true;
    };
  }, [loadPrestadores]);

  const especialidades = useMemo(() => {
    return catalogoEspecialidades.map((item) => ({
      value: item.nome || item.codigo,
      label: item.nome || item.codigo,
    }));
  }, [catalogoEspecialidades]);

  const filteredItems = useMemo(() => {
    const especialidade = normalizeSearchText(filters.especialidade);
    const nome = normalizeSearchText(filters.nome);
    const result = items.filter((item) => {
      const itemEspecialidade = normalizeSearchText(item?.especialidade);
      const alvo = normalizeSearchText(`${item?.nome || ''} ${item?.fone1 || ''} ${item?.fone2 || ''} ${item?.codigo || ''}`);
      const matchesEspecialidade =
        !especialidade ||
        especialidade === '__todas__' ||
        itemEspecialidade === especialidade;
      return (
        matchesEspecialidade &&
        (!nome || alvo.includes(nome))
      );
    });
    if (PRESTADORES_FILTER_DEBUG) {
      // TEMP DEBUG — remover após diagnóstico do filtro de Prestadores
      console.info('[PRESTADORES_FILTER_DEBUG] FILTER_STATE', {
        nome: String(filters.nome ?? ''),
        especialidade: String(filters.especialidade ?? ''),
      });
      console.info('[PRESTADORES_FILTER_DEBUG] FILTER_RESULT', {
        search: String(filters.nome ?? ''),
        originalCount: items.length,
        filteredCount: result.length,
        filteredCodes: result.map((item) => String(item?.codigo ?? '').trim()),
        filteredNames: result.map((item) => String(item?.nome ?? '').trim()),
      });
    }
    return result;
  }, [filters, items]);

  useEffect(() => {
    setSelectedId((current) => (filteredItems.some((item) => item.id === current) ? current : filteredItems[0]?.id ?? null));
  }, [filteredItems]);

  const selectedItem = useMemo(
    () => filteredItems.find((item) => item.id === selectedId) || null,
    [filteredItems, selectedId],
  );

  const hasSelection = Boolean(selectedItem);
  const totalItems = filteredItems.length;
  const footerLabel = totalItems === 1 ? '1 prestador' : `${totalItems} prestadores`;

  if (PRESTADORES_FILTER_DEBUG) {
    // TEMP DEBUG — remover após diagnóstico do filtro de Prestadores
    console.info('[PRESTADORES_FILTER_DEBUG] HOOK_OUTPUT', {
      itemsCount: items.length,
      filteredCount: filteredItems.length,
      codes: filteredItems.map((item) => String(item?.codigo ?? '').trim()),
    });
  }

  return {
    items: filteredItems,
    loading,
    error,
    filters,
    setFilters,
    selectedId,
    setSelectedId,
    selectedItem,
    hasSelection,
    especialidades,
    totalItems,
    footerLabel,
    reload: loadPrestadores,
  };
}
