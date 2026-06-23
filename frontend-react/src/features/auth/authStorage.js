const TOKEN_KEY = 'brana_token';

export function getToken() {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function setToken(token) {
  if (typeof window === 'undefined') return;
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // armazenamento indisponível; falha silenciosa para não quebrar o boot
  }
}

export function clearToken() {
  setToken('');
}
