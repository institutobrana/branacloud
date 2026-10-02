const STORAGE_KEY = 'brana.session.instanceId';

export function getSessionInstanceId() {
  if (typeof window === 'undefined') return '';
  try { return String(window.sessionStorage.getItem(STORAGE_KEY) || ''); } catch { return ''; }
}

export function setSessionInstanceId(value) {
  if (typeof window === 'undefined') return;
  try { window.sessionStorage.setItem(STORAGE_KEY, String(value || '')); } catch { /* memória do provider segue válida */ }
}

export function clearSessionInstanceId() {
  if (typeof window === 'undefined') return;
  try { window.sessionStorage.removeItem(STORAGE_KEY); } catch { /* limpeza best-effort */ }
}

export { STORAGE_KEY as SESSION_INSTANCE_STORAGE_KEY };
