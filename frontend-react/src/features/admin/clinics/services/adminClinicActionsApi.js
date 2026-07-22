import { buildApiUrl } from '../../../../services/api.js';
import { getToken } from '../../../auth/authStorage.js';

export const ADMIN_CLINIC_TRIAL_EXTRA_MIN_DAYS = 1;
export const ADMIN_CLINIC_TRIAL_EXTRA_MAX_DAYS = 3650;
export const ADMIN_CLINIC_TRIAL_EXTRA_INITIAL_DAYS = 10;
export const ADMIN_CLINIC_STATUS_REASON_MAX_LENGTH = 500;
export const ADMIN_CLINIC_DEMO_PLAN = 'DEMO';
export const ADMIN_CLINIC_MONTHLY_PLAN = 'MENSAL';
export const ADMIN_CLINIC_ANNUAL_PLAN = 'ANUAL';
export const ADMIN_CLINIC_SUPER_ADMIN_PLAN = 'SUPERADMIN';
export const ADMIN_CLINIC_NEW_ACCOUNT_PASSWORD_MIN_LENGTH = 6;

function buildAuthHeaders() {
  const token = getToken();
  if (!token) {
    const error = new Error('Sessão expirada.');
    error.status = 401;
    throw error;
  }

  const headers = new Headers();
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', 'application/json');
  return headers;
}

export function normalizeTrialExtraDays(value) {
  if (value === null || value === undefined || String(value).trim() === '') {
    throw new Error('Informe uma quantidade inteira de dias.');
  }
  const numberValue = Number(value);
  if (!Number.isInteger(numberValue)) {
    throw new Error('Informe uma quantidade inteira de dias.');
  }
  if (numberValue < ADMIN_CLINIC_TRIAL_EXTRA_MIN_DAYS || numberValue > ADMIN_CLINIC_TRIAL_EXTRA_MAX_DAYS) {
    throw new Error(
      `Informe dias entre ${ADMIN_CLINIC_TRIAL_EXTRA_MIN_DAYS} e ${ADMIN_CLINIC_TRIAL_EXTRA_MAX_DAYS}.`,
    );
  }
  return numberValue;
}

export async function extendAdminClinicTrial(clinicaId, dias, { signal } = {}) {
  const resolvedId = Number(clinicaId);
  if (!Number.isInteger(resolvedId) || resolvedId < 1) {
    throw new Error('Selecione uma clínica válida.');
  }

  const resolvedDays = normalizeTrialExtraDays(dias);
  const response = await fetch(buildApiUrl(`/superadmin/clinicas/${resolvedId}/trial-extra`), {
    method: 'PATCH',
    headers: buildAuthHeaders(),
    body: JSON.stringify({ dias: resolvedDays }),
    signal,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error((data && (data.detail || data.message)) || 'Falha ao prorrogar período de teste.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function normalizeClinicStatusReason(value) {
  const reason = String(value || '').trim();
  if (reason.length > ADMIN_CLINIC_STATUS_REASON_MAX_LENGTH) {
    throw new Error(`Informe um motivo com até ${ADMIN_CLINIC_STATUS_REASON_MAX_LENGTH} caracteres.`);
  }
  return reason;
}

export function normalizeNewClinicAccountPayload(values = {}) {
  const nomeClinica = String(values.nomeClinica ?? values.nome_clinica ?? '').trim();
  const adminNome = String(values.adminNome ?? values.admin_nome ?? '').trim();
  const adminEmail = String(values.adminEmail ?? values.admin_email ?? '').trim().toLowerCase();
  const adminSenha = String(values.adminSenha ?? values.admin_senha ?? '');
  const adminConfirmaSenha = String(values.adminConfirmaSenha ?? values.admin_confirma_senha ?? '');

  if (!nomeClinica) {
    throw new Error('Informe o nome da clínica.');
  }
  if (!adminNome) {
    throw new Error('Informe o nome do administrador.');
  }
  if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(adminEmail)) {
    throw new Error('Informe um e-mail válido.');
  }
  if (adminSenha.length < ADMIN_CLINIC_NEW_ACCOUNT_PASSWORD_MIN_LENGTH) {
    throw new Error(`Senha deve ter no mínimo ${ADMIN_CLINIC_NEW_ACCOUNT_PASSWORD_MIN_LENGTH} caracteres.`);
  }
  if (adminSenha !== adminConfirmaSenha) {
    throw new Error('Confirmação de senha não confere.');
  }

  return {
    nome_clinica: nomeClinica,
    admin_nome: adminNome,
    admin_email: adminEmail,
    admin_senha: adminSenha,
    admin_confirma_senha: adminConfirmaSenha,
  };
}

export async function createAdminClinicAccount(values, { signal } = {}) {
  const payload = normalizeNewClinicAccountPayload(values);
  const response = await fetch(buildApiUrl('/superadmin/clinicas/nova-conta'), {
    method: 'POST',
    headers: buildAuthHeaders(),
    body: JSON.stringify(payload),
    signal,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error((data && (data.detail || data.message)) || 'Falha ao criar nova conta.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function updateAdminClinicStatus({ clinicId, ativo, motivo = '', signal } = {}) {
  const resolvedId = Number(clinicId);
  if (!Number.isInteger(resolvedId) || resolvedId < 1) {
    throw new Error('Selecione uma clínica válida.');
  }
  if (typeof ativo !== 'boolean') {
    throw new Error('Informe o status da clínica.');
  }

  const resolvedReason = normalizeClinicStatusReason(motivo);
  const response = await fetch(buildApiUrl(`/superadmin/clinicas/${resolvedId}/status`), {
    method: 'PATCH',
    headers: buildAuthHeaders(),
    body: JSON.stringify({ ativo, motivo: resolvedReason }),
    signal,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error((data && (data.detail || data.message)) || 'Falha ao atualizar status da clínica.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function setAdminClinicPlan({ clinicId, plano, manterAtivo = true, dias, signal } = {}) {
  const resolvedId = Number(clinicId);
  if (!Number.isInteger(resolvedId) || resolvedId < 1) {
    throw new Error('Selecione uma clínica válida.');
  }
  const resolvedPlan = String(plano || '').trim().toUpperCase();
  if (!resolvedPlan) {
    throw new Error('Informe o plano da clínica.');
  }

  const payload = { plano: resolvedPlan, manter_ativo: Boolean(manterAtivo) };
  if (dias !== undefined && dias !== null) {
    payload.dias = dias;
  }
  const response = await fetch(buildApiUrl(`/superadmin/clinicas/${resolvedId}/plano`), {
    method: 'PATCH',
    headers: buildAuthHeaders(),
    body: JSON.stringify(payload),
    signal,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error((data && (data.detail || data.message)) || 'Falha ao atualizar plano da clínica.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function setAdminClinicDemo({ clinicId, signal } = {}) {
  return setAdminClinicPlan({ clinicId, plano: ADMIN_CLINIC_DEMO_PLAN, manterAtivo: true, signal });
}

export function setAdminClinicMonthlyPlan({ clinicId, signal } = {}) {
  return setAdminClinicPlan({ clinicId, plano: ADMIN_CLINIC_MONTHLY_PLAN, manterAtivo: true, signal });
}

export function setAdminClinicAnnualPlan({ clinicId, signal } = {}) {
  return setAdminClinicPlan({ clinicId, plano: ADMIN_CLINIC_ANNUAL_PLAN, manterAtivo: true, signal });
}

export function setAdminClinicSuperAdminPlan({ clinicId, signal } = {}) {
  return setAdminClinicPlan({ clinicId, plano: ADMIN_CLINIC_SUPER_ADMIN_PLAN, manterAtivo: true, signal });
}
