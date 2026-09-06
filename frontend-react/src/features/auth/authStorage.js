export const AUTH_TOKEN_STORAGE_KEY = 'brana_token';

export function getToken() {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function setToken(token) {
  if (typeof window === 'undefined') return;
  try {
    if (token) window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    else window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    // armazenamento indisponivel; falha silenciosa para nao quebrar o boot
  }
}

export function clearToken() {
  setToken('');
}

export function getAuthToken() {
  return getToken();
}

export function setAuthToken(token) {
  setToken(token);
}

export function clearAuthToken() {
  clearToken();
}
