import {
  normalizeAgendaContatoBoolean,
  normalizeAgendaContatoText,
  normalizeNullableInteger,
} from './agendaContatosNormalizers.js';

const TEXT_FIELDS = [
  'nome', 'tipo', 'contato', 'endereco', 'complemento', 'bairro', 'cidade', 'cep', 'uf', 'pais',
  'tel1_tipo', 'tel1', 'tel2_tipo', 'tel2', 'tel3_tipo', 'tel3', 'tel4_tipo', 'tel4',
  'email', 'homepage', 'palavra_chave_1', 'palavra_chave_2', 'registro', 'especialidade', 'observacoes',
];

export function buildAgendaContatoPayload(formState = {}) {
  const payload = {};
  TEXT_FIELDS.forEach((field) => {
    payload[field] = normalizeAgendaContatoText(formState[field]);
  });
  payload.aniversario_dia = normalizeNullableInteger(formState.aniversario_dia);
  payload.aniversario_mes = normalizeNullableInteger(formState.aniversario_mes);
  payload.incluir_malas_diretas = normalizeAgendaContatoBoolean(formState.incluir_malas_diretas);
  payload.incluir_preferidos = normalizeAgendaContatoBoolean(formState.incluir_preferidos);
  return payload;
}
