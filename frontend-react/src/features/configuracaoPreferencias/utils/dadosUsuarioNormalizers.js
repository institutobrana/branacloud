export const DADOS_USUARIO_FIELDS = ['nome', 'endereco', 'bairro', 'cidade', 'cep', 'uf', 'pais', 'telefones', 'cro', 'cpf'];
const TECHNICAL_FIELDS = ['apelido', 'email', 'tipo_usuario', 'prestador_nome', 'unidade_nome'];

export function normalizeDadosUsuario(values = {}) {
  const source = values || {};
  return {
    ...source,
    ...DADOS_USUARIO_FIELDS.reduce((out, field) => ({ ...out, [field]: String(source[field] ?? '') }), {}),
    ...TECHNICAL_FIELDS.reduce((out, field) => ({ ...out, [field]: source[field] ?? null }), {}),
  };
}

export function buildDadosUsuarioPayload(values = {}) {
  const normalized = normalizeDadosUsuario(values);
  return [...DADOS_USUARIO_FIELDS, ...TECHNICAL_FIELDS].reduce((out, field) => ({ ...out, [field]: normalized[field] }), {});
}
