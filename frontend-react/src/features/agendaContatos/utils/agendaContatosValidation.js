import { normalizeAgendaContatoText } from './agendaContatosNormalizers.js';

export function validateAgendaContatoForm(formState) {
  const errors = {};
  if (!normalizeAgendaContatoText(formState?.nome)) {
    errors.nome = 'Informe o nome.';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
