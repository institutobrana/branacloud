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

async function signPdf({ pdf, pdfFilename, certificate, password, documentName }) {
  const form = new FormData();
  form.append('pdf_file', pdf, pdfFilename);
  form.append('pfx_file', certificate, certificate.name);
  form.append('pfx_password', password);
  form.append('field_name', 'Signature1');
  form.append('use_existing_field', 'false');
  form.append('signature_profile', 'pades');
  form.append('use_editor_content', 'false');
  form.append('document_name', documentName || 'Documento');

  const headers = new Headers();
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(buildApiUrl('/editor-textos/assinar-pdf'), { method: 'POST', headers, body: form });
  const blob = await response.blob();
  if (!response.ok) {
    let message = 'Falha ao assinar o PDF.';
    try {
      const data = JSON.parse(await blob.text());
      message = data?.detail || message;
    } catch { /* resposta não JSON */ }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return {
    blob,
    filename: response.headers.get('X-Signed-Filename') || `${pdfFilename.replace(/\.pdf$/i, '')}_assinado.pdf`,
  };
}

export const editorTextosApi = {
  getRecipeAssistantContext({ patientId = null, medicationsLimit = 400 } = {}) {
    const params = new URLSearchParams({ medicamentos_limit: String(medicationsLimit) });
    if (patientId != null && Number(patientId) > 0) params.set('paciente_id', String(patientId));
    return requestJson(`/editor-textos/assistente-receitas/contexto?${params}`);
  },
  getRecipeAssistantMedications({ query = '', limit = 1000 } = {}) {
    const params = new URLSearchParams({ q: query, limit: String(limit) });
    return requestJson(`/editor-textos/assistente-receitas/medicamentos?${params}`);
  },
  getAtestadoAssistantContext({ patientId = null } = {}) {
    const params = new URLSearchParams();
    if (patientId != null && Number(patientId) > 0) params.set('paciente_id', String(patientId));
    const suffix = params.size ? `?${params}` : '';
    return requestJson(`/editor-textos/assistente-atestado/contexto${suffix}`);
  },
  getAtestadoAssistantCid({ query = '', letter = '*', preferredOnly = false, limit = 250 } = {}) {
    const params = new URLSearchParams({ limit: String(limit) });
    if (query) params.set('q', query);
    if (letter && letter !== '*') params.set('letra', letter);
    if (preferredOnly) params.set('apenas_preferidos', 'true');
    return requestJson(`/editor-textos/assistente-atestado/cid?${params}`);
  },
  listMergeFields() { return requestJson('/editor-textos/campos'); },
  mergeEditorTextContent({ content, patientId = null, surgeonId = null, extras = {}, preserveUnresolved = true, mode = 'html' }) {
    return requestJson('/editor-textos/mesclar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conteudo: String(content ?? ''),
        conteudo_formato: mode,
        paciente_id: patientId,
        cirurgiao_id: surgeonId,
        extras,
        preservar_nao_resolvido: preserveUnresolved,
      }),
    });
  },
  convertRtfImport(content) {
    return requestJson('/editor-textos/import/rtf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: String(content ?? '') }),
    });
  },
  listDocuments() { return requestJson('/editor-textos/modelos'); },
  signPdf,
  getDocument(id) { return requestJson(`/editor-textos/modelos/${encodeURIComponent(String(id))}`); },
  createDocument(payload) {
    return requestJson('/editor-textos/modelos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  },
  saveAsDocument(payload, replaceModelId = null) {
    return requestJson('/editor-textos/modelos/save-as', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, replace_model_id: replaceModelId }),
    });
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
