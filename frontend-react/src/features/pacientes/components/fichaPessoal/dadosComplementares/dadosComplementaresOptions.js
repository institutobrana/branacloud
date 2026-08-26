export const COMPLEMENTARY_TEXT_FIELDS = [
  'responsavel', 'cpf_responsavel', 'nome_pai', 'nome_mae', 'nome_conjuge', 'cpf_conjuge',
  'profissao_conjuge', 'apelido', 'naturalidade', 'nacionalidade', 'profissao', 'local_trabalho',
  'horario_trab', 'end_tra', 'com_tra', 'cep_tra',
];

export const COMPLEMENTARY_SELECT_FIELDS = [
  'unidade_atendimento', 'cirurgiao_responsavel', 'estado_civil_comp', 'bai_tra', 'cid_tra',
  'est_tra', 'palavra_chave_1', 'palavra_chave_2', 'palavra_chave_3', 'palavra_chave_4',
];

export const EMPTY_COMPLEMENTARY = {
  ...Object.fromEntries(COMPLEMENTARY_TEXT_FIELDS.map((field) => [field, ''])),
  ...Object.fromEntries(COMPLEMENTARY_SELECT_FIELDS.map((field) => [field, ''])),
  publico: false,
  titular: false,
};

export function normalizeComplementary(extra = {}) {
  const source = extra && typeof extra === 'object' ? extra : {};
  const next = { ...EMPTY_COMPLEMENTARY };
  [...COMPLEMENTARY_TEXT_FIELDS, ...COMPLEMENTARY_SELECT_FIELDS].forEach((field) => {
    next[field] = source[field] == null ? '' : String(source[field]);
  });
  next.publico = Boolean(source.publico);
  next.titular = Boolean(source.titular);
  return next;
}

export function optionsWithCurrent(options = [], current = '') {
  const values = Array.isArray(options) ? options.map((item) => String(item ?? '').trim()).filter(Boolean) : [];
  const value = String(current ?? '');
  return value && !values.includes(value) ? [value, ...values] : values;
}
