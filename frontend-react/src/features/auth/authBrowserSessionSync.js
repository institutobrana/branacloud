import { AUTH_TOKEN_STORAGE_KEY, getToken as getStoredTokenFromStorage } from './authStorage.js';

export const AUTH_BROWSER_RESUME_DEDUP_MS = 750;

function normalizeToken(value) {
  return String(value || '').trim();
}

function isVisibleDocument(documentRef) {
  if (!documentRef) return true;
  if (typeof documentRef.visibilityState === 'string') {
    return documentRef.visibilityState === 'visible';
  }
  if (typeof documentRef.hidden === 'boolean') {
    return !documentRef.hidden;
  }
  return true;
}

export function createAuthBrowserSessionSync({
  getSessionState,
  onExternalToken,
  onExternalLogout,
  onResumeRequest,
  getStoredToken = getStoredTokenFromStorage,
  addEventListener = window.addEventListener.bind(window),
  removeEventListener = window.removeEventListener.bind(window),
  documentRef = document,
  windowRef = window,
  now = Date.now,
  dedupMs = AUTH_BROWSER_RESUME_DEDUP_MS,
} = {}) {
  if (typeof getSessionState !== 'function') {
    throw new TypeError('getSessionState e obrigatorio.');
  }
  if (typeof onExternalToken !== 'function') {
    throw new TypeError('onExternalToken e obrigatorio.');
  }
  if (typeof onExternalLogout !== 'function') {
    throw new TypeError('onExternalLogout e obrigatorio.');
  }
  if (typeof onResumeRequest !== 'function') {
    throw new TypeError('onResumeRequest e obrigatorio.');
  }

  let running = false;
  let lastResumeAt = 0;

  const shouldIgnoreSync = () => {
    const state = getSessionState() || {};
    return Boolean(!state.token || state.loggingOut);
  };

  const requestResume = () => {
    if (shouldIgnoreSync()) return false;
    const current = now();
    if (current - lastResumeAt < dedupMs) {
      return false;
    }
    lastResumeAt = current;
    onResumeRequest();
    return true;
  };

  const handleStorageEvent = (event) => {
    if (!running) return;

    const state = getSessionState() || {};
    if (state.loggingOut) return;

    if (event?.key === null) {
      if (!getStoredToken()) {
        onExternalLogout();
      }
      return;
    }

    if (event?.key !== AUTH_TOKEN_STORAGE_KEY) return;

    const newToken = normalizeToken(event?.newValue);
    if (!newToken) {
      if (!getStoredToken()) {
        onExternalLogout();
      }
      return;
    }

    if (newToken === normalizeToken(state.token)) {
      return;
    }

    onExternalToken(newToken);
  };

  const handleVisibilityChange = () => {
    if (!running) return;
    if (!isVisibleDocument(documentRef)) return;
    requestResume();
  };

  const handleFocus = () => {
    if (!running) return;
    if (!isVisibleDocument(documentRef)) return;
    requestResume();
  };

  const start = () => {
    if (running) {
      return { started: true, running: true };
    }

    addEventListener('storage', handleStorageEvent);
    addEventListener('visibilitychange', handleVisibilityChange);
    addEventListener('focus', handleFocus);
    running = true;

    return { started: true, running: true };
  };

  const stop = () => {
    if (!running) {
      return { stopped: false, running: false };
    }

    removeEventListener('storage', handleStorageEvent);
    removeEventListener('visibilitychange', handleVisibilityChange);
    removeEventListener('focus', handleFocus);
    running = false;
    return { stopped: true, running: false };
  };

  return {
    start,
    stop,
    isRunning: () => running,
    handleStorageEvent,
    handleVisibilityChange,
    handleFocus,
  };
}
