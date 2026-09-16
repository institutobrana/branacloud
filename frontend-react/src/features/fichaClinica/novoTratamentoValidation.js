export function validateNovoTratamento(form, patientId) {
  const errors = {};
  if (!Number(patientId)) errors.paciente_id = 'Selecione um paciente.';
  return { valid: Object.keys(errors).length === 0, errors };
}
