import { useCallback, useEffect, useState } from 'react';
import { getModelPreferences, updateModelPreferences } from '../api/configuracaoPreferenciasApi.js';

const FIELDS = [
  'modelo_impresso_atestados_id', 'modelo_impresso_receitas_id', 'modelo_impresso_recibos_id',
  'modelo_padrao_etiquetas_id', 'modelo_texto_email_agenda_id', 'modelo_padrao_orcamentos_id',
  'modelo_texto_whatsapp_agenda_id',
];

function normalize(values) {
  return FIELDS.reduce((result, field) => ({ ...result, [field]: values?.[field] ?? null }), {});
}

export function useConfiguracaoPreferenciasModelos(open) {
  const [values, setValues] = useState(() => normalize());
  const [options, setOptions] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    setLoading(true); setError('');
    getModelPreferences().then((data) => {
      if (cancelled) return;
      setValues(normalize(data?.values));
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
      const data = await updateModelPreferences(values);
      setValues(normalize(data?.values));
      setOptions(data?.options || options);
      return data;
    } catch (err) { setError(err.message); throw err; }
    finally { setSaving(false); }
  }, [options, values]);
  return { values, options, user, loading, saving, error, update, save };
}
