import { useCallback, useEffect, useState } from 'react';
import { getEnvironmentPreferences, updateEnvironmentPreferences } from '../api/configuracaoPreferenciasApi.js';
import { AMBIENTE_DEFAULT_STYLE } from '../constants/ambienteConstants.js';
import { normalizeEnvironment, normalizeStyle } from '../utils/ambienteNormalizers.js';

export function useConfiguracaoPreferenciasAmbiente(open) {
  const [values, setValues] = useState(() => normalizeEnvironment());
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false; setLoading(true); setError('');
    getEnvironmentPreferences().then((data) => { if (!cancelled) { setValues(normalizeEnvironment(data?.values)); setOptions(data?.options || {}); } })
      .catch((err) => { if (!cancelled) setError(err.message); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [open]);
  const selectSection = useCallback((section) => setValues((current) => ({ ...current, secao_ativa: section })), []);
  const updateSectionStyle = useCallback((section, style) => setValues((current) => ({ ...current, secoes: { ...current.secoes, [section]: normalizeStyle(style, options) } })), [options]);
  const restoreSection = useCallback((section) => updateSectionStyle(section, AMBIENTE_DEFAULT_STYLE), [updateSectionStyle]);
  const save = useCallback(async () => {
    setSaving(true); setError('');
    try { const data = await updateEnvironmentPreferences(values); setValues(normalizeEnvironment(data?.values)); setOptions(data?.options || options); return data; }
    catch (err) { setError(err.message); throw err; } finally { setSaving(false); }
  }, [options, values]);
  return { values, options, loading, saving, error, selectSection, updateSectionStyle, restoreSection, save };
}
