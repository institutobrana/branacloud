import { useCallback, useEffect, useState } from 'react';
import { getOdontogramPreferences, updateOdontogramPreferences } from '../api/configuracaoPreferenciasApi.js';
import { normalizeOdontogram, buildOdontogramPayload } from '../utils/odontogramaNormalizers.js';

export function useConfiguracaoPreferenciasOdontograma(open) {
  const [values, setValues] = useState(() => normalizeOdontogram());
  const [options, setOptions] = useState({ especialidades: [], filtros: [] });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    setLoading(true); setError('');
    getOdontogramPreferences().then((data) => {
      if (cancelled) return;
      setValues(normalizeOdontogram(data?.values));
      setOptions(data?.options || { especialidades: [], filtros: [] });
      setUser(data?.user || null);
    }).catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [open]);

  const update = useCallback((patch) => setValues((current) => ({ ...current, ...patch })), []);
  const save = useCallback(async () => {
    setSaving(true); setError('');
    try {
      const data = await updateOdontogramPreferences(buildOdontogramPayload(values));
      setValues(normalizeOdontogram(data?.values));
      setOptions(data?.options || options);
      setUser(data?.user || user);
      return data;
    } catch (err) { setError(err.message); throw err; }
    finally { setSaving(false); }
  }, [options, user, values]);

  return { values, options, user, loading, saving, error, update, save };
}
