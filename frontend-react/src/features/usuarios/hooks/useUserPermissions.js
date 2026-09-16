import { useCallback, useEffect, useRef, useState } from 'react';
import { atualizarFuncaoPermissaoUsuario, atualizarPermissoesUsuario, atualizarPerfisUsuario, obterPerfisUsuario, obterPermissoesUsuario, obterSchemaPermissoes } from '../services/userPermissionsApi.js';

export function useUserPermissions(password = '') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const debounceRef = useRef(null);
  const functionDebounceRef = useRef(null);
  const pendingRef = useRef(null);
  const pendingFunctionRef = useRef(null);
  const load = useCallback(async (userId, includeProfiles = false) => {
    setLoading(true); setError('');
    try {
      const [schema, user, profiles] = await Promise.all([
        obterSchemaPermissoes(password), obterPermissoesUsuario(userId, password),
        includeProfiles ? obterPerfisUsuario(userId, password) : Promise.resolve(null),
      ]);
      setData({ schema, user, profiles });
    }
    catch (err) { setData(null); setError(err?.message || 'Falha ao carregar permissões.'); }
    finally { setLoading(false); }
  }, [password]);
  const clear = useCallback(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (functionDebounceRef.current) window.clearTimeout(functionDebounceRef.current);
    debounceRef.current = null;
    functionDebounceRef.current = null;
    pendingRef.current = null;
    pendingFunctionRef.current = null;
    setData(null);
    setError('');
  }, []);
  const cancelPendingWrites = useCallback(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (functionDebounceRef.current) window.clearTimeout(functionDebounceRef.current);
    debounceRef.current = null;
    functionDebounceRef.current = null;
    pendingRef.current = null;
    pendingFunctionRef.current = null;
  }, []);
  const patchModuleLevel = useCallback((userId, moduleCode, level) => {
    const current = data?.user?.permissoes;
    if (!userId || !moduleCode || !current) return;
    const permissoes = { ...current, [moduleCode]: level };
    setData((previous) => previous ? { ...previous, user: { ...previous.user, permissoes } } : previous);
    pendingRef.current = { userId, permissoes };
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      const pending = pendingRef.current;
      pendingRef.current = null;
      if (!pending) return;
      setSaving(true);
      try {
        await atualizarPermissoesUsuario(pending.userId, pending.permissoes, password);
        setError('');
      } catch (err) {
        setError(err?.message || 'Falha ao atualizar permissões.');
        await load(pending.userId, false);
      } finally { setSaving(false); }
    }, 500);
  }, [data, load, password]);
  const patchProfileAssignments = useCallback(async (userId, profileId, providerIds) => {
    if (!userId || !profileId || !data?.profiles) return;
    const previous = data.profiles;
    const assignments = { ...(previous.assignments || {}), [String(profileId)]: providerIds };
    setData((current) => current ? { ...current, profiles: { ...current.profiles, assignments } } : current);
    setSaving(true);
    try { await atualizarPerfisUsuario(userId, profileId, providerIds, password); setError(''); }
    catch (err) { setError(err?.message || 'Falha ao atualizar perfil de acesso.'); await load(userId, true); }
    finally { setSaving(false); }
  }, [data, load, password]);
  const patchFunctionLevel = useCallback((userId, moduleCode, functionCode, level) => {
    if (!userId || !moduleCode || !functionCode || !data?.user) return;
    const functions = Object.fromEntries(Object.entries(data.user.functions || {}).map(([module, values]) => [module, { ...values }]));
    functions[moduleCode] = { ...(functions[moduleCode] || {}), [functionCode]: level };
    setData((previous) => previous ? { ...previous, user: { ...previous.user, functions } } : previous);
    pendingFunctionRef.current = { userId, functions };
    if (functionDebounceRef.current) window.clearTimeout(functionDebounceRef.current);
    functionDebounceRef.current = window.setTimeout(async () => {
      const pending = pendingFunctionRef.current;
      pendingFunctionRef.current = null;
      if (!pending) return;
      setSaving(true);
      try {
        await atualizarFuncaoPermissaoUsuario(pending.userId, pending.functions, password);
        setError('');
      } catch (err) {
        setError(err?.message || 'Falha ao atualizar permissão da função.');
        await load(pending.userId, false);
      } finally { setSaving(false); }
    }, 500);
  }, [data, load, password]);
  useEffect(() => () => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (functionDebounceRef.current) window.clearTimeout(functionDebounceRef.current);
  }, []);
  return { data, loading, error, saving, load, clear, cancelPendingWrites, patchModuleLevel, patchFunctionLevel, patchProfileAssignments };
}
