import { buildApiUrl } from '../../../services/api.js';
import { getAuthToken } from '../../auth/authStorage.js';

export async function fetchAgendaFreeSlots({ weekdays, startTime, endTime, providerId, unitId, startDate, endDate, signal } = {}) {
  const token = getAuthToken();
  if (!token) throw new Error('Sessão autenticada não encontrada.');
  const params = new URLSearchParams({
    dias_semana: weekdays.join(','),
    hora_inicio: startTime,
    hora_fim: endTime,
    limit: '5000',
  });
  if (providerId) params.set('prestador_id', String(providerId));
  if (unitId) params.set('unidade_id', String(unitId));
  if (startDate) params.set('data_ini', startDate);
  if (endDate) params.set('data_fim', endDate);
  const response = await fetch(buildApiUrl(`/agenda-legado/horarios-livres?${params.toString()}`), {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.detail || `Falha ao pesquisar horários livres (${response.status}).`);
  if (!Array.isArray(payload)) throw new Error('Resposta inválida de horários livres.');
  return payload;
}
