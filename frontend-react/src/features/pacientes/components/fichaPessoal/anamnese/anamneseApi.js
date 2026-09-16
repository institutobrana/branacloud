import { buildApiUrl } from '../../../../../services/api.js';
import { getToken } from '../../../../auth/authStorage.js';

async function requestJson(path, options = {}) {
  const token = getToken();
  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers: { ...(options.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.detail || 'Falha ao carregar a Anamnese.');
  return data;
}

export function listarQuestionarios() {
  return requestJson('/anamnese/questionarios');
}

export function obterPerguntasERespostas(pacienteId, questionarioId) {
  return requestJson(`/anamnese/pacientes/${encodeURIComponent(String(pacienteId))}/respostas?questionario_id=${encodeURIComponent(String(questionarioId))}`);
}

export function salvarRespostaAnamnese(pacienteId, payload) {
  return requestJson(`/anamnese/pacientes/${encodeURIComponent(String(pacienteId))}/respostas`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
