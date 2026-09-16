import { buildApiUrl } from '../../../services/api.js';
import { getToken } from '../../auth/authStorage.js';

async function requestJson(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(buildApiUrl(path), { ...options, headers });
  let data = null;
  try { data = await response.json(); } catch { /* respostas sem corpo */ }
  if (!response.ok) {
    const error = new Error(data?.detail || 'Falha na operação do Editor de Textos.');
    error.status = response.status;
    throw error;
  }
  return data;
}

export const editorTextosApi = {
  listDocuments() { return requestJson('/editor-textos/modelos'); },
  getDocument(id) { return requestJson(`/editor-textos/modelos/${encodeURIComponent(String(id))}`); },
  createDocument(payload) {
    return requestJson('/editor-textos/modelos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  },
  updateDocument(id, payload) {
    return requestJson(`/editor-textos/modelos/${encodeURIComponent(String(id))}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  },
  renameDocument(id, name) {
    return requestJson(`/editor-textos/modelos/${encodeURIComponent(String(id))}/renomear`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome: name }) });
  },
  deleteDocument(id) {
    return requestJson(`/editor-textos/modelos/${encodeURIComponent(String(id))}`, { method: 'DELETE' });
  },
};
