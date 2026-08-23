import { useEffect, useMemo, useRef, useState } from 'react';
import {
  atualizarPacientesMenuPreferences,
  listarPacientesMenu,
  listarPacientesMenuOptions,
  navegarPacientes,
  obterPacientesMenuPreferences,
  obterPaciente,
} from '../pacientesApi.js';

const DEFAULT_PREFERENCES = {
  cir_menu_pac: 0,
  status_menu_pac: 0,
  visualizacao_menu_pac: 1,
  pesquisa_menu_pac: 1,
  active_ord_menu_pac: 0,
};

function safeText(value) {
  return String(value ?? '').trim();
}

function formatNome(item) {
  const nomeCompleto = safeText(item?.nome_completo);
  if (nomeCompleto) return nomeCompleto;
  return [safeText(item?.nome), safeText(item?.sobrenome)].filter(Boolean).join(' ').trim();
}

function normalizeMenuItem(item) {
  return {
    id: Number(item?.id || 0) || 0,
    codigo: Number(item?.codigo || 0) || 0,
    nome: safeText(item?.nome || formatNome(item)),
    nome_completo: safeText(item?.nome_paciente || item?.nome_completo || formatNome(item)),
    status: item?.status ?? null,
    id_prestador: Number(item?.id_prestador || 0) || 0,
    valor_coluna2: safeText(item?.valor_coluna2),
  };
}

export function usePacientes() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [error, setError] = useState('');
  const [optionsError, setOptionsError] = useState('');
  const [count, setCount] = useState(0);
  const [queryDraft, setQueryDraft] = useState('');
  const [query, setQuery] = useState('');
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [optionSets, setOptionSets] = useState({
    cirurgioes: [],
    filtro_status: [],
    visualizacao: [],
    pesquisa: [],
  });
  const [detailLoading, setDetailLoading] = useState(false);
  const [navigationLoading, setNavigationLoading] = useState(false);
  const mountedRef = useRef(false);

  const selectedRowKeys = useMemo(() => (selectedId ? [selectedId] : []), [selectedId]);
  const selectedRecord = useMemo(() => items.find((item) => Number(item.id) === Number(selectedId)) || null, [items, selectedId]);

  const emitState = (detail = {}) => {
    window.dispatchEvent(new CustomEvent('brana-pacientes-state', { detail }));
  };

  const emitUiState = (detail = {}) => {
    window.dispatchEvent(new CustomEvent('brana-pacientes-ui-state', { detail }));
  };

  const loadMenu = async ({ nextQuery = query, nextPreferences = preferences, preserveSelection = true } = {}) => {
    setLoading(true);
    setError('');
    try {
      const response = await listarPacientesMenu(nextQuery, nextPreferences, { limit: 80, offset: 0 });
      const data = Array.isArray(response?.items) ? response.items.map(normalizeMenuItem) : [];
      setItems(data);
      setCount(Number(response?.total || data.length || 0));
      if (data.length) {
        const currentSelection = preserveSelection
          ? data.find((item) => Number(item.id) === Number(selectedId)) || data[0]
          : data[0];
        if (currentSelection) {
          setSelectedId(Number(currentSelection.id));
          setSelectedPatient(currentSelection);
        }
      } else {
        setSelectedId(null);
        setSelectedPatient(null);
      }
      return data;
    } catch (err) {
      setItems([]);
      setCount(0);
      setSelectedId(null);
      setSelectedPatient(null);
      setError(err?.message || 'Falha ao carregar pacientes.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const loadOptions = async () => {
    setOptionsLoading(true);
    setOptionsError('');
    try {
      const [prefsResponse, optionsResponse] = await Promise.all([
        obterPacientesMenuPreferences(),
        listarPacientesMenuOptions(),
      ]);
      const nextPreferences = {
        ...DEFAULT_PREFERENCES,
        ...(prefsResponse?.values || {}),
      };
      setPreferences(nextPreferences);
      setOptionSets({
        cirurgioes: Array.isArray(optionsResponse?.cirurgioes) ? optionsResponse.cirurgioes : [],
        filtro_status: Array.isArray(optionsResponse?.filtro_status) ? optionsResponse.filtro_status : [],
        visualizacao: Array.isArray(optionsResponse?.visualizacao) ? optionsResponse.visualizacao : [],
        pesquisa: Array.isArray(optionsResponse?.pesquisa) ? optionsResponse.pesquisa : [],
      });
      return nextPreferences;
    } catch (err) {
      setOptionsError(err?.message || 'Falha ao carregar opções do menu.');
      return DEFAULT_PREFERENCES;
    } finally {
      setOptionsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      const nextPreferences = await loadOptions();
      if (!active) return;
      await loadMenu({ nextPreferences, preserveSelection: false });
      mountedRef.current = true;
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    emitState({
      items,
      selectedId,
      selectedPatient,
      loading,
      error,
      count,
      query,
      queryDraft,
      preferences,
      options: optionSets,
      selectedRowKeys,
      detailLoading,
      navigationLoading,
      hasSelection: Boolean(selectedId),
      optionsLoading,
      optionsError,
    });
  }, [count, detailLoading, error, items, loading, navigationLoading, optionSets, optionsError, optionsLoading, preferences, query, queryDraft, selectedId, selectedPatient, selectedRowKeys]);

  useEffect(() => {
    const onAction = async (event) => {
      const action = String(event?.detail?.action || '').trim();
      if (!action) return;

      if (action === 'set-search') {
        setQueryDraft(String(event?.detail?.value || ''));
        return;
      }

      if (action === 'apply-search') {
        const nextQuery = safeText(event?.detail?.value ?? queryDraft);
        setQueryDraft(nextQuery);
        setQuery(nextQuery);
        await loadMenu({ nextQuery, preserveSelection: false });
        return;
      }

      if (action === 'set-preference') {
        const key = String(event?.detail?.key || '').trim();
        if (!Object.prototype.hasOwnProperty.call(DEFAULT_PREFERENCES, key)) return;
        const rawValue = event?.detail?.value;
        const nextPreferences = {
          ...preferences,
          [key]: Number(rawValue ?? DEFAULT_PREFERENCES[key]) || 0,
        };
        setPreferences(nextPreferences);
        try {
          const response = await atualizarPacientesMenuPreferences(nextPreferences);
          const saved = {
            ...nextPreferences,
            ...(response?.values || {}),
          };
          setPreferences(saved);
          await loadMenu({ nextQuery: query, nextPreferences: saved, preserveSelection: false });
        } catch (err) {
          setOptionsError(err?.message || 'Falha ao salvar preferências do menu.');
        }
        return;
      }

      if (action === 'refresh') {
        await loadMenu({ nextQuery: query, nextPreferences: preferences });
        return;
      }

      if (action === 'select-item') {
        const record = event?.detail?.record || null;
        if (record) {
          await handleSelect(record);
        }
        return;
      }

      if (action === 'navigate') {
        const direction = String(event?.detail?.direction || '').trim();
        if (!['first', 'prev', 'next', 'last'].includes(direction)) return;
        await handleNavigate(direction);
      }
    };

    window.addEventListener('brana-pacientes-toolbar-action', onAction);
    return () => window.removeEventListener('brana-pacientes-toolbar-action', onAction);
  }, [preferences, query, queryDraft]);

  const handleSelect = async (record) => {
    const id = Number(record?.id || 0) || 0;
    if (!id) return;
    setSelectedId(id);
    setSelectedPatient(record);
    setDetailLoading(true);
    try {
      const detail = await obterPaciente(id);
      setSelectedPatient(detail || record);
    } catch {
      setSelectedPatient(record);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleNavigate = async (direction) => {
    setNavigationLoading(true);
    try {
      const next = await navegarPacientes(selectedId, direction);
      if (next?.id) {
        const normalized = normalizeMenuItem(next);
        setSelectedId(normalized.id);
        setSelectedPatient(next);
        const exists = items.some((item) => Number(item.id) === Number(normalized.id));
        if (!exists) {
          await loadMenu({ nextQuery: query, nextPreferences: preferences, preserveSelection: false });
        }
        return next;
      }
      return null;
    } finally {
      setNavigationLoading(false);
    }
  };

  const reload = async () => {
    await loadMenu({ nextQuery: query, nextPreferences: preferences });
  };

  return {
    items,
    selectedId,
    selectedPatient,
    loading: loading || optionsLoading,
    error: error || optionsError,
    count,
    query,
    queryDraft,
    setQueryDraft,
    preferences,
    optionSets,
    selectedRowKeys,
    detailLoading,
    navigationLoading,
    hasSelection: Boolean(selectedId),
    selectedRecord,
    setSelectedId,
    handleSelect,
    handleNavigate,
    reload,
    loadMenu,
  };
}
