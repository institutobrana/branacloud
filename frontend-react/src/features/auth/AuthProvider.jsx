import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { clearToken, getToken, setToken } from './authStorage.js';
import { getMe, login as loginRequest, logout as logoutRequest, renewAuthToken } from './authApi.js';
import { createAuthRenewalController } from './authRenewalController.js';
import { shouldRunAuthRenewal } from './authProviderSession.js';
import { createAuthBrowserSessionSync } from './authBrowserSessionSync.js';

const AuthContext = createContext(null);

function createSessionFlags() {
  return {
    authenticated: false,
    loggingOut: false,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(() => getToken());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const controllerRef = useRef(null);
  const browserEventsRef = useRef(null);
  const flagsRef = useRef(createSessionFlags());
  const latestRef = useRef({ token: getToken(), user: null, loading: true, error: '' });
  const mountedRef = useRef(false);

  latestRef.current = { token, user, loading, error };

  const formatSessionError = (err) => {
    if (err?.status === 401) {
      return 'Login aceito, mas nao foi possivel validar a sessao em /me.';
    }
    if (err?.status === 403) {
      return 'Login aceito, mas nao foi possivel validar a sessao em /me.';
    }
    if (err?.message) {
      return err.message;
    }
    return 'Sessao invalida.';
  };

  const stopController = () => {
    if (controllerRef.current) {
      controllerRef.current.stop();
    }
  };

  const invalidateLocalSession = () => {
    stopController();
    flagsRef.current.authenticated = false;
    flagsRef.current.loggingOut = false;
    clearToken();
    setTokenState('');
    setUser(null);
    setError('');
  };

  const ensureController = () => {
    if (controllerRef.current) {
      return controllerRef.current;
    }

    controllerRef.current = createAuthRenewalController({
      renewToken: renewAuthToken,
      getToken,
      setToken,
      clearToken,
      onSessionInvalid: () => {
        if (!mountedRef.current) return;
        invalidateLocalSession();
      },
    });

    return controllerRef.current;
  };

  const ensureBrowserEvents = () => {
    if (browserEventsRef.current) {
      return browserEventsRef.current;
    }

    browserEventsRef.current = createAuthBrowserSessionSync({
      getSessionState: () => ({
        authenticated: flagsRef.current.authenticated,
        loggingOut: flagsRef.current.loggingOut,
        token: latestRef.current.token,
      }),
      onExternalToken: (nextToken) => {
        if (!mountedRef.current) return;
        if (flagsRef.current.loggingOut) return;
        if (!nextToken) return;

        const currentToken = latestRef.current.token || getToken();
        if (nextToken === currentToken) {
          return;
        }

        const controller = ensureController();
        const currentUser = latestRef.current.user;
        setToken(nextToken);
        setTokenState(nextToken);

        if (flagsRef.current.authenticated && currentUser) {
          controller.syncExternalToken(nextToken);
          return;
        }

        void syncSession(nextToken, { preserveTokenOnFailure: true });
      },
      onExternalLogout: () => {
        if (!mountedRef.current) return;
        if (flagsRef.current.loggingOut) return;
        invalidateLocalSession();
      },
      onResumeRequest: () => {
        if (!mountedRef.current) return;
        if (flagsRef.current.loggingOut) return;
        if (!flagsRef.current.authenticated) return;
        if (!latestRef.current.token) return;

        const controller = ensureController();
        void controller.renewNow();
      },
      addEventListener: window.addEventListener.bind(window),
      removeEventListener: window.removeEventListener.bind(window),
    });

    return browserEventsRef.current;
  };

  const maybeStartController = (tokenCandidate = latestRef.current.token) => {
    const controller = ensureController();
    if (!controller) return;
    if (shouldRunAuthRenewal({
      authenticated: flagsRef.current.authenticated,
      loggingOut: flagsRef.current.loggingOut,
      token: tokenCandidate,
    })) {
      controller.start();
      return;
    }
    controller.stop();
  };

  const syncSession = async (nextToken = getToken(), { preserveTokenOnFailure = false } = {}) => {
    if (!nextToken) {
      flagsRef.current.authenticated = false;
      setUser(null);
      setTokenState('');
      clearToken();
      setLoading(false);
      return null;
    }

    try {
      const me = await getMe(nextToken);
      flagsRef.current.authenticated = true;
      flagsRef.current.loggingOut = false;
      setUser(me);
      setTokenState(nextToken);
      setToken(nextToken);
      setError('');
      maybeStartController(nextToken);
      return me;
    } catch (err) {
      const definitive = err?.status === 401 || err?.status === 403;
      flagsRef.current.authenticated = false;
      if (definitive) {
        stopController();
      }
      setUser(null);
      if (preserveTokenOnFailure) {
        setTokenState(nextToken);
        setToken(nextToken);
      } else {
        setTokenState('');
        clearToken();
      }
      setError(formatSessionError(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    void syncSession(token);
    const browserEvents = ensureBrowserEvents();
    browserEvents.start();
    return () => {
      mountedRef.current = false;
      browserEvents.stop();
      stopController();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async (credentials) => {
    setLoading(true);
    setError('');
    let accessToken = '';
    try {
      const loginResult = await loginRequest(credentials);
      accessToken = loginResult?.accessToken || '';
      if (!accessToken) {
        throw new Error('Token de acesso nao retornado pelo backend.');
      }
      setToken(accessToken);
      setTokenState(accessToken);
      try {
        const me = await getMe(accessToken);
        flagsRef.current.authenticated = true;
        flagsRef.current.loggingOut = false;
        setUser(me);
        setError('');
        maybeStartController(accessToken);
        return me;
      } catch (meError) {
        const sessionMessage = formatSessionError(meError);
        flagsRef.current.authenticated = false;
        setUser(null);
        setTokenState(accessToken);
        setToken(accessToken);
        setError(sessionMessage);
        if (meError?.status === 401 || meError?.status === 403) {
          stopController();
        }
        throw new Error(sessionMessage);
      }
    } catch (err) {
      if (!accessToken) {
        clearToken();
        setTokenState('');
      }
      setUser(null);
      setError(err?.message || 'Falha ao autenticar.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    flagsRef.current.loggingOut = true;
    flagsRef.current.authenticated = false;
    stopController();
    const currentToken = token || getToken();
    try {
      if (currentToken) {
        await logoutRequest(currentToken);
      }
    } catch {
      // logout visual segue mesmo se o backend ja tiver invalidado a sessao
    } finally {
      clearToken();
      setTokenState('');
      setUser(null);
      setError('');
      flagsRef.current.loggingOut = false;
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
