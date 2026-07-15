export function sanitizePlanoContasGroupPayload(payload = {}) {
  return {
    nome: String(payload.nome ?? '').trim(),
    tipo: String(payload.tipo ?? '').trim(),
  };
}

export function validatePlanoContasGroupPayload(payload = {}) {
  const sanitized = sanitizePlanoContasGroupPayload(payload);
  const errors = {};

  if (!sanitized.nome) {
    errors.nome = 'Informe o nome do grupo.';
  }

  if (!sanitized.tipo) {
    errors.tipo = 'Informe o tipo do grupo.';
  }

  return {
    sanitized,
    errors,
    valid: Object.keys(errors).length === 0,
  };
}
