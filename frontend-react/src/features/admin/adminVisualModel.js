import { ADMIN_SECTIONS, getAdminSectionByKey } from './adminNavigation.js';

export const ADMIN_TITLE = 'Painel ADM';
export const ADMIN_SUBTITLE = 'Administração da plataforma Brana Cloud';
export const ADMIN_RETURN_LABEL = 'Retornar';

export function getAdminHeaderModel(activeKey = 'overview') {
  const current = getAdminSectionByKey(activeKey);
  return {
    title: ADMIN_TITLE,
    subtitle: ADMIN_SUBTITLE,
    breadcrumb: ['ADM', current.label],
    returnLabel: ADMIN_RETURN_LABEL,
    currentLabel: current.label,
  };
}

export function getAdminNavigationModel(activeKey = 'overview') {
  return ADMIN_SECTIONS.map((section) => ({
    key: section.key,
    label: section.label,
    status: section.status || '',
    available: section.available,
    active: section.key === activeKey,
  }));
}

export function getAdminHomeModel(activeKey = 'overview') {
  const current = getAdminSectionByKey(activeKey);
  const plannedSections = ADMIN_SECTIONS.filter((section) => !section.available && section.key !== current.key);
  return {
    title: current.label,
    copy: current.available
      ? 'Supervisão da plataforma Brana Cloud em estrutura limpa e pronta para os próximos módulos.'
      : 'Este módulo está em migração. A estrutura visual está pronta para receber a paridade funcional futura.',
    status: current.available ? 'Ativo' : 'Em migração',
    plannedSections: plannedSections.map((section) => section.label),
  };
}
