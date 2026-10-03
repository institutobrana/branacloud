import { buildApiUrl } from '../../services/api.js';

async function requestJson(path, token, options = {}) {
  let response;
  try {
    response = await fetch(buildApiUrl(path), {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
  } catch (cause) {
    const error = new Error('Falha de conexão com o serviço de lease clínico.');
    error.cause = cause;
    throw error;
  }
  let data = null;
  try { data = await response.json(); } catch { data = null; }
  if (!response.ok) {
    const error = new Error(data?.detail?.code || data?.message || 'Falha no lease clínico.');
    error.status = response.status;
    error.code = data?.detail?.code || data?.code || '';
    error.data = data;
    throw error;
  }
  return data;
}

export function getClinicalLeaseStatus(token, patientId, instanceId) {
  return requestJson(`/clinical-locks/${encodeURIComponent(String(patientId))}`, token, {
    headers: { 'X-Session-Instance-Id': instanceId },
  });
}

export function acquireClinicalLease(token, patientId, instanceId) {
  return requestJson(`/clinical-locks/${encodeURIComponent(String(patientId))}/acquire`, token, {
    method: 'POST',
    headers: { 'X-Session-Instance-Id': instanceId },
  });
}

export function sendClinicalLeaseHeartbeat(token, patientId, instanceId, leaseToken) {
  return requestJson(`/clinical-locks/${encodeURIComponent(String(patientId))}/heartbeat`, token, {
    method: 'POST',
    headers: {
      'X-Session-Instance-Id': instanceId,
      'X-Clinical-Lease-Token': leaseToken,
    },
  });
}

export function releaseClinicalLease(token, patientId, instanceId, leaseToken, options = {}) {
  return requestJson(`/clinical-locks/${encodeURIComponent(String(patientId))}/release`, token, {
    method: 'POST',
    keepalive: options.keepalive === true,
    headers: {
      'X-Session-Instance-Id': instanceId,
      'X-Clinical-Lease-Token': leaseToken,
    },
  });
}
