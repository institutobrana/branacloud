import {
  formatAdminUserDate,
  formatAdminUserDateTime,
  formatAdminUserPresence,
  formatAdminUserPresenceTooltip,
  formatAdminUserProfile,
  formatAdminUserProtection,
  formatAdminUserSetupStatus,
  formatAdminUserStatus,
  normalizeAdminUserPlanLabel,
} from './adminUsersFormatters.js';

export const ADMIN_USERS_UNAVAILABLE_LABEL = 'Não disponível';

function hasValue(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

export function formatAdminUserDetailValue(value) {
  return hasValue(value) ? String(value).trim() : ADMIN_USERS_UNAVAILABLE_LABEL;
}

export function formatAdminUserDetailBoolean(value) {
  if (value === true) return 'Sim';
  if (value === false) return 'Não';
  return ADMIN_USERS_UNAVAILABLE_LABEL;
}

function formatDateDetail(value) {
  const formatted = formatAdminUserDate(value);
  return formatted === '-' ? ADMIN_USERS_UNAVAILABLE_LABEL : formatted;
}

function formatDateTimeDetail(value) {
  const formatted = formatAdminUserDateTime(value);
  return formatted === '-' ? ADMIN_USERS_UNAVAILABLE_LABEL : formatted;
}

function formatPlanDetail(value) {
  const formatted = normalizeAdminUserPlanLabel(value);
  return formatted === '-' ? ADMIN_USERS_UNAVAILABLE_LABEL : formatted;
}

export function buildAdminUserDetailsSections(user = null) {
  if (!user) return [];

  return [
    {
      title: 'Identificação',
      items: [
        { label: 'ID', value: formatAdminUserDetailValue(user.id) },
        { label: 'Nome', value: formatAdminUserDetailValue(user.nome) },
        { label: 'E-mail', value: formatAdminUserDetailValue(user.email) },
        { label: 'Tipo/perfil', value: formatAdminUserProfile(user) },
        { label: 'Administrador', value: formatAdminUserDetailBoolean(user.isAdmin) },
        { label: 'Status', value: formatAdminUserStatus(user.ativo) },
        { label: 'Usuário protegido', value: user.isSystemUser ? 'Sim' : formatAdminUserDetailBoolean(user.isOwnerAccount) },
      ],
    },
    {
      title: 'Conta',
      items: [
        { label: 'Clínica', value: formatAdminUserDetailValue(user.clinicaNome) },
        { label: 'ID da clínica', value: formatAdminUserDetailValue(user.clinicaId) },
        { label: 'E-mail da clínica', value: formatAdminUserDetailValue(user.clinicaEmail) },
        { label: 'Plano', value: formatPlanDetail(user.clinicaPlano) },
        { label: 'Status da clínica', value: formatAdminUserStatus(user.clinicaAtiva) },
        { label: 'Trial até', value: formatDateDetail(user.clinicaTrialAte) },
      ],
    },
    {
      title: 'Vínculos',
      items: [
        { label: 'Unidade', value: formatAdminUserDetailValue(user.unidadeNome) },
        { label: 'Prestador', value: formatAdminUserDetailValue(user.prestadorNome) },
        { label: 'Usuário sistêmico', value: user.isSystemUser ? 'Sim' : 'Não' },
        { label: 'Primeiro acesso', value: formatAdminUserSetupStatus(user.setupCompleted) },
        { label: 'Online', value: formatAdminUserPresence(user) },
        {
          label: 'Última atividade',
          value: user.lastSeenAt ? formatDateTimeDetail(user.lastSeenAt) : formatAdminUserPresenceTooltip(user),
        },
      ],
    },
    {
      title: 'Sistema',
      items: [
        { label: 'Data de inclusão', value: formatDateDetail(user.createdAt || user.dataInclusao) },
        { label: 'Data de alteração', value: formatDateDetail(user.updatedAt || user.dataAlteracao) },
        { label: 'Último acesso', value: formatDateDetail(user.lastAccessAt || user.ultimoAcesso) },
        { label: 'Proteção', value: formatAdminUserProtection(user) },
      ],
    },
  ];
}
