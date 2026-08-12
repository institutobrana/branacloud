import { useEffect, useMemo, useState } from 'react';

import { listarLancamentosContaCirurgiao, listarPrestadoresCirurgiao } from '../contaCorrenteCirurgiaoApi.js';

export function useContaCorrenteCirurgiao() {
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [surgeonId, setSurgeonId] = useState(null);
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
  const [launchModal, setLaunchModal] = useState({ open: false, type: 'debito' });

  useEffect(() => {
    let active = true;
    setLoadingSurgeons(true);

    listarPrestadoresCirurgiao()
      .then((rows) => {
        if (!active) return;
        setSurgeonOptions(
          rows.map((item) => ({
            label: item.apelido || item.nome,
            value: item.id,
          })),
        );
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
  }, []);

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
  }, [month, year, surgeonId, viewMode]);

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
      loading: isLoading,
      error,
      setMonth,
      setYear,
      setSurgeonId,
      setViewMode,
      setSelectedId,
      openLaunchModal: (type) => setLaunchModal({ open: true, type }),
      closeLaunchModal: () => setLaunchModal({ open: false, type: 'debito' }),
      launchModal,
    }),
    [
      error,
      isLoading,
      items,
      month,
      selectedId,
      saldo,
      surgeonId,
      surgeonOptions,
      totalEntrada,
      totalSaida,
      launchModal,
      viewMode,
      year,
    ],
  );
}
