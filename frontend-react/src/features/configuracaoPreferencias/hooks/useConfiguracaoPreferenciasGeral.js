import { useCallback, useEffect, useState } from 'react';
import { getGeneralPreferences, updateGeneralPreferences } from '../api/configuracaoPreferenciasApi.js';
import { buildGeneralPayload, normalizeGeneralValues } from '../utils/configuracaoPreferenciasNormalizers.js';

export function useConfiguracaoPreferenciasGeral(open) {
  const [values, setValues] = useState(() => normalizeGeneralValues());
  const [options, setOptions] = useState({ tabelas_intervencoes: [], convenios: [] });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    setLoading(true);
    setError('');
    getGeneralPreferences().then((data) => {
      if (cancelled) return;
      setValues(normalizeGeneralValues(data?.values));
      setOptions(data?.options || {});
      setUser(data?.user || null);
    }).catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [open]);

  const update = useCallback((patch) => setValues((current) => ({ ...current, ...patch })), []);
  const save = useCallback(async () => {
    setSaving(true); setError('');
    try {
      const data = await updateGeneralPreferences(buildGeneralPayload(values));
      setValues(normalizeGeneralValues(data?.values));
      setOptions(data?.options || options);
      setUser(data?.user || user);
      return data;
    } catch (err) { setError(err.message); throw err; }
    finally { setSaving(false); }
  }, [options, user, values]);

  return { values, options, user, loading, saving, error, update, save };
}
