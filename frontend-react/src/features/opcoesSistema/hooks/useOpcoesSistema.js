import { useCallback, useEffect, useState } from 'react';
import { getOpcoesSistema, normalizeOpcoesSistemaError, patchOpcoesSistema } from '../api/opcoesSistemaApi.js';
import { normalizeOpcoesSistema } from '../normalizers/opcoesSistemaNormalizers.js';
import { buildSystemOptionsPayload, mergeSystemOptionsPreservingUnknowns } from '../payload/systemOptionsPayload.js';

export function useOpcoesSistema(open) {
  const [values, setValues] = useState(() => normalizeOpcoesSistema());
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [protectedRequired, setProtectedRequired] = useState(false);
  const [rawConfigSnapshot, setRawConfigSnapshot] = useState({});
  const [editedChanges, setEditedChanges] = useState({});
  const [protectedPassword, setProtectedPassword] = useState('');
  const load = useCallback((password = '') => {
    let cancelled = false;
    setLoading(true); setError(''); setSaveError('');
    getOpcoesSistema(password).then((data) => { if (!cancelled) { setProtectedRequired(false); setRawConfigSnapshot(data?.values || {}); setEditedChanges({}); setValues(normalizeOpcoesSistema(data?.values)); setOptions(data?.options || {}); } })
      .catch((err) => { if (!cancelled) { if (err?.code === 'protected_password_required') { setProtectedRequired(true); setError(password ? 'Senha inválida.' : ''); } else setError(normalizeOpcoesSistemaError(err)); } }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    if (!open) return undefined;
    setProtectedPassword(''); setProtectedRequired(false);
    return load();
  }, [load, open]);
  const update = useCallback((section, patch) => {
    setValues((current) => ({ ...current, [section]: { ...current[section], ...patch } }));
    setEditedChanges((current) => mergeSystemOptionsPreservingUnknowns(current, { [section]: patch }));
  }, []);
  const payloadPreview = buildSystemOptionsPayload(rawConfigSnapshot, editedChanges);
  const isDirty = Object.keys(editedChanges).length > 0;
  const resetEdits = useCallback(() => {
    setEditedChanges({});
    setValues(normalizeOpcoesSistema(rawConfigSnapshot));
    setSaveError('');
  }, [rawConfigSnapshot]);
  const save = useCallback(async () => {
    if (!isDirty) return { skipped: true };
    setLoading(true); setSaveError('');
    try {
      const data = await patchOpcoesSistema(payloadPreview, protectedPassword);
      const persisted = data?.values || payloadPreview;
      setRawConfigSnapshot(persisted); setEditedChanges({}); setValues(normalizeOpcoesSistema(persisted));
      return { skipped: false, data };
    } catch (err) {
      setSaveError(normalizeOpcoesSistemaError(err, 'Não foi possível salvar as opções do sistema.'));
      throw err;
    } finally { setLoading(false); }
  }, [isDirty, payloadPreview, protectedPassword]);
  return { values, options, loading, error, saveError, protectedRequired, update, payloadPreview, isDirty, save, resetEdits, protectedPassword, setProtectedPassword, retry: (password = protectedPassword) => load(password) };
}
