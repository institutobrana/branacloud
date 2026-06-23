import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearToken, getToken, setToken } from './authStorage.js';
import { getMe, login as loginRequest, logout as logoutRequest } from './authApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(() => getToken());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const syncSession = async (nextToken = getToken()) => {
    if (!nextToken) {
      setUser(null);
      setTokenState('');
      clearToken();
      setLoading(false);
      return null;
    }

    try {
      const me = await getMe(nextToken);
      setUser(me);
      setTokenState(nextToken);
      setToken(nextToken);
      setError('');
      return me;
    } catch (err) {
      setUser(null);
      setTokenState('');
      clearToken();
      setError(err?.message || 'Sessão inválida.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncSession(token);
  }, []);

  const signIn = async (credentials) => {
    setLoading(true);
    setError('');
    try {
      const { accessToken } = await loginRequest(credentials);
      if (!accessToken) {
        throw new Error('Token de acesso não retornado pelo backend.');
      }
      setToken(accessToken);
      setTokenState(accessToken);
      const me = await syncSession(accessToken);
      if (!me) {
        throw new Error('Não foi possível validar a sessão após o login.');
      }
      return me;
    } catch (err) {
      clearToken();
      setTokenState('');
      setUser(null);
      setError(err?.message || 'Falha ao autenticar.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    const currentToken = token || getToken();
    try {
      if (currentToken) {
        await logoutRequest(currentToken);
      }
    } catch {
      // logout visual segue mesmo se o backend já tiver invalidado a sessão
    } finally {
      clearToken();
      setTokenState('');
      setUser(null);
      setError('');
    }
  };

  const refreshSession = async () => syncSession(token || getToken());

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      loading,
      error,
      signIn,
      signOut,
      refreshSession,
      clearError: () => setError(''),
    }),
    [user, token, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }
  return context;
}
