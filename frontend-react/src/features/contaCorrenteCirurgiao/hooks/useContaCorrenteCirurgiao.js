import { useEffect, useMemo, useRef, useState } from 'react';

import { useAuth } from '../../auth/AuthProvider.jsx';
import { listarLancamentosContaCirurgiao, listarPrestadoresCirurgiao } from '../contaCorrenteCirurgiaoApi.js';

function resolveAuthenticatedUserPrestadorId(user) {
  if (!user) return null;
  const candidates = [user.prestador_id, user.prestadorId, user.prestador?.id, user.prestador?.prestador_id];
  for (const candidate of candidates) {
    const id = Number(candidate ?? 0);
    if (Number.isFinite(id) && id > 0) return id;
  }
  return null;
}

export function useContaCorrenteCirurgiao() {
  const { user } = useAuth();
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [surgeonId, setSurgeonIdState] = useState(null);
  const [viewMode, setViewMode] = useState('todos');
  const [surgeonOptions, setSurgeonOptions] = useState([]);
  const [items, setItems] = useState([]);
  const [totalEntrada, setTotalEntrada] = useState(0);
  const [totalSaida, setTotalSaida] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const [loadingSurgeons, setLoadingSurgeons] = useState(false);
  const [loadingLancamentos, setLoadingLancamentos] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const autoSelectedRef = useRef(false);
  const manualSelectionRef = useRef(false);
  const selectedRow = useMemo(
    () => items.find((item) => String(item.id) === String(selectedId ?? '')) || null,
    [items, selectedId],
  );

  const setSurgeonId = (nextSurgeonId) => {
    manualSelectionRef.current = true;
    setSurgeonIdState(nextSurgeonId);
  };

  useEffect(() => {
    let active = true;
    setLoadingSurgeons(true);

    listarPrestadoresCirurgiao()
      .then((rows) => {
        if (!active) return;
        const nextOptions = rows.map((item) => ({
          label: item.apelido || item.nome,
          value: item.id,
        }));
        setSurgeonOptions(nextOptions);

        const userPrestadorId = resolveAuthenticatedUserPrestadorId(user);
        if (!manualSelectionRef.current && !autoSelectedRef.current && userPrestadorId) {
          const matchedOption = nextOptions.find((item) => String(item.value) === String(userPrestadorId));
          if (matchedOption) {
            autoSelectedRef.current = true;
            setSurgeonIdState(matchedOption.value);
          }
        }
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.message || 'Falha ao consultar cirurgiões.');
        setSurgeonOptions([]);
      })
      .finally(() => {
        if (active) setLoadingSurgeons(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    if (manualSelectionRef.current || autoSelectedRef.current) return;
    const userPrestadorId = resolveAuthenticatedUserPrestadorId(user);
    if (!userPrestadorId) return;
    const matchedOption = surgeonOptions.find((item) => String(item.value) === String(userPrestadorId));
    if (!matchedOption) return;
    autoSelectedRef.current = true;
    setSurgeonIdState(matchedOption.value);
  }, [surgeonOptions, user]);

  useEffect(() => {
    if (!surgeonId) {
      setItems([]);
      setTotalEntrada(0);
      setTotalSaida(0);
      setSaldo(0);
      setSelectedId(null);
      return;
    }

    let active = true;
    setLoadingLancamentos(true);
    setError('');

    listarLancamentosContaCirurgiao({ month, year, surgeonId, viewMode })
      .then((payload) => {
        if (!active) return;
        setItems(payload.itens);
        setTotalEntrada(payload.totalEntrada);
        setTotalSaida(payload.totalSaida);
        setSaldo(payload.saldo);
        setSelectedId((current) => {
          if (current == null) {
            return payload.itens[0]?.id ?? null;
          }
          return payload.itens.some((item) => String(item.id) === String(current)) ? current : payload.itens[0]?.id ?? null;
        });
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.message || 'Falha ao consultar lançamentos.');
        setItems([]);
        setTotalEntrada(0);
        setTotalSaida(0);
        setSaldo(0);
        setSelectedId(null);
      })
      .finally(() => {
        if (active) setLoadingLancamentos(false);
      });

    return () => {
      active = false;
    };
  }, [month, year, surgeonId, viewMode, refreshToken]);

  const isLoading = loadingSurgeons || loadingLancamentos;

  return useMemo(
    () => ({
      month,
      year,
      surgeonId,
      viewMode,
      surgeonOptions,
      items,
      totalEntrada,
      totalSaida,
      saldo,
      selectedId,
      selectedRow,
      loading: isLoading,
      error,
      setMonth,
      setYear,
      setSurgeonId,
      setViewMode,
      setSelectedId,
      reloadLancamentos: () => setRefreshToken((current) => current + 1),
    }),
    [
      error,
      isLoading,
      items,
      month,
      selectedId,
      selectedRow,
      saldo,
      surgeonId,
      surgeonOptions,
      totalEntrada,
      totalSaida,
      viewMode,
      year,
    ],
  );
}
