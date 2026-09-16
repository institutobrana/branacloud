import { useCallback, useEffect, useState } from 'react';
import { getUserDataPreferences, updateUserDataPreferences } from '../api/configuracaoPreferenciasApi.js';
import { buildDadosUsuarioPayload, normalizeDadosUsuario } from '../utils/dadosUsuarioNormalizers.js';

export function useConfiguracaoPreferenciasDadosUsuario(open, targetUser) {
  const targetUserId = Number(targetUser?.id || 0) || null;
  const [values, setValues] = useState(() => normalizeDadosUsuario());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    setLoading(true); setError('');
    getUserDataPreferences(targetUserId).then((data) => { if (!cancelled) { setValues(normalizeDadosUsuario(data?.values)); setUser(data?.user || null); } })
      .catch((err) => { if (!cancelled) setError(err.message); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [open, targetUserId]);
  const update = useCallback((patch) => setValues((current) => ({ ...current, ...patch })), []);
  const save = useCallback(async () => {
    setSaving(true); setError('');
    try { const data = await updateUserDataPreferences(buildDadosUsuarioPayload(values), targetUserId); setValues(normalizeDadosUsuario(data?.values)); setUser(data?.user || user); return data; }
    catch (err) { setError(err.message); throw err; } finally { setSaving(false); }
  }, [targetUserId, user, values]);
  return { values, user, loading, saving, error, update, save };
}
