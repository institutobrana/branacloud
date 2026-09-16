import { useCallback, useEffect, useState } from 'react';
import { listarUsuarios } from '../services/usuariosApi.js';

export function useUsuarios() {
  const [rows, setRows] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [protectedRequired, setProtectedRequired] = useState(false); const [selectedUserId, setSelectedUserId] = useState(null); const [password, setPassword] = useState('');
  const refresh = useCallback(async (nextPassword = password) => { setLoading(true); setError(''); try { const data = await listarUsuarios(nextPassword); setRows(data); setPassword(nextPassword); setProtectedRequired(false); setSelectedUserId((current) => data.some((u) => Number(u.id) === Number(current)) ? current : null); return true; } catch (err) { if (err?.code === 'protected_password_required') { setProtectedRequired(true); setError(''); } else setError(err?.message || 'Falha ao carregar usuários.'); return false; } finally { setLoading(false); } }, [password]);
  useEffect(() => { void refresh(''); }, []);
  return { rows, loading, error, protectedRequired, setProtectedRequired, password, setPassword, selectedUserId, setSelectedUserId, refresh };
}
