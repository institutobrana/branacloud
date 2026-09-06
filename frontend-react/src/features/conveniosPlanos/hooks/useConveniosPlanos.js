import { useCallback, useEffect, useMemo, useState } from 'react';
import { listarConveniosPlanos } from '../conveniosPlanosApi.js';
import { mapConvenio, mapPlano } from '../utils/conveniosPlanosMappers.js';

export function useConveniosPlanos() {
  const [convenios, setConvenios] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [selectedConvenioId, setSelectedConvenioId] = useState(null);
  const [selectedPlanoId, setSelectedPlanoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const planosVisiveis = useMemo(() => planos.filter((item) => item.convenioId === selectedConvenioId), [planos, selectedConvenioId]);
  const load = useCallback(async (preferredId = null, preferredPlanoId = null) => {
    setLoading(true); setError('');
    try {
      const data = await listarConveniosPlanos();
      const nextConvenios = data.convenios.map(mapConvenio);
      const nextPlanos = data.planos.map(mapPlano);
      const nextSelectedConvenioId = nextConvenios.some((item) => item.id === preferredId) ? preferredId : (nextConvenios.some((item) => item.id === selectedConvenioId) ? selectedConvenioId : (nextConvenios[0]?.id ?? null));
      setConvenios(nextConvenios); setPlanos(nextPlanos);
      setSelectedConvenioId(nextSelectedConvenioId);
      const candidate = preferredPlanoId ?? null;
      setSelectedPlanoId(candidate && nextPlanos.some((item) => item.id === candidate && item.convenioId === nextSelectedConvenioId) ? candidate : null);
    } catch (err) { setConvenios([]); setPlanos([]); setSelectedConvenioId(null); setSelectedPlanoId(null); setError(err?.message || 'Falha ao carregar convênios e planos.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const selectConvenio = (id) => { setSelectedConvenioId(id); setSelectedPlanoId(null); };
  const selectPlano = (id) => setSelectedPlanoId(id);
  return { convenios, planosVisiveis, selectedConvenioId, selectedPlanoId, loading, error, reload: load, selectConvenio, selectPlano };
}
