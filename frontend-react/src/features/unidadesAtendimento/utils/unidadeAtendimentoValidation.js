export function validateUnidadeAtendimentoValues(values) {
  const errors = {};
  const nome = String(values?.nome ?? '').trim();

  if (!nome) {
    errors.nome = 'Informe o nome da unidade.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
