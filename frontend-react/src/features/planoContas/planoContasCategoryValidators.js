export function sanitizePlanoContasCategoryPayload(payload = {}) {
  return {
    nome: String(payload.nome ?? '').trim(),
    tipo: String(payload.tipo ?? '').trim(),
    grupo_id: Number(payload.grupo_id ?? 0) || 0,
    tributavel: Boolean(payload.tributavel),
  };
}

export function validatePlanoContasCategoryPayload(payload = {}) {
  const sanitized = sanitizePlanoContasCategoryPayload(payload);
  const errors = {};

  if (!sanitized.nome) {
    errors.nome = 'Informe o nome da categoria.';
  }

  if (!sanitized.tipo) {
    errors.tipo = 'Informe o tipo da categoria.';
  }

  if (!sanitized.grupo_id) {
    errors.grupo_id = 'Selecione um grupo.';
  }

  return {
    sanitized,
    errors,
    valid: Object.keys(errors).length === 0,
  };
}
