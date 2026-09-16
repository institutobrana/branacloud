export const MIN_PASSWORD_LENGTH = 6;

export function validateAlterarSenhaValues(values = {}) {
  const errors = {};
  const currentPassword = String(values.currentInternalPassword ?? '');
  const newPassword = String(values.newInternalPassword ?? '');
  const confirmPassword = String(values.confirmInternalPassword ?? '');

  if (!currentPassword) errors.currentInternalPassword = 'Informe a senha interna atual.';
  if (!newPassword) errors.newInternalPassword = 'Informe a nova senha interna.';
  else if (newPassword.length < MIN_PASSWORD_LENGTH) errors.newInternalPassword = 'A senha deve ter no minimo 6 caracteres.';
  if (!confirmPassword) errors.confirmInternalPassword = 'Confirme a nova senha interna.';
  else if (newPassword !== confirmPassword) errors.confirmInternalPassword = 'A confirmacao de senha interna nao confere.';

  return { valid: Object.keys(errors).length === 0, errors };
}
