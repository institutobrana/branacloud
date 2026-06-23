const DEFAULT_API_BASE_URL = 'http://localhost:8000';

export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  DEFAULT_API_BASE_URL;

export function buildApiUrl(path) {
  const base = String(API_BASE_URL || '').replace(/\/+$/, '');
  const normalizedPath = `/${String(path || '').replace(/^\/+/, '')}`;
  return `${base}${normalizedPath}`;
}
