import { buildApiUrl } from '../../../services/api.js';

async function requestJson(path, options = {}) {
  const token = window.localStorage.getItem('brana_token') || '';
  if (!token) throw new Error('Sessão expirada.');
  const response = await fetch(buildApiUrl(path), { ...options, headers: { Authorization: `Bearer ${token}`, ...(options.headers || {}) } });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.detail || 'Falha ao carregar modelos de etiqueta.');
  return data;
}

export async function listarEtiquetasModelos() {
  const data = await requestJson('/config/etiquetas/modelos');
  return Array.isArray(data?.modelos) ? data.modelos : [];
}

export async function listarEtiquetasPadroes() {
  const data = await requestJson('/config/etiquetas/padroes');
  return Array.isArray(data?.padroes) ? data.padroes : [];
}

export async function listarEtiquetasArquivos() {
  const data = await requestJson('/config/etiquetas/arquivos');
  return Array.isArray(data?.arquivos) ? data.arquivos : [];
}

export async function criarEtiquetaModelo(payload) {
  return requestJson('/config/etiquetas/modelos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
}

export async function atualizarEtiquetaModelo(id, payload) {
  return requestJson(`/config/etiquetas/modelos/${encodeURIComponent(String(id))}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
}

export async function excluirEtiquetaModelo(id) {
  return requestJson(`/config/etiquetas/modelos/${encodeURIComponent(String(id))}`, { method: 'DELETE' });
}
