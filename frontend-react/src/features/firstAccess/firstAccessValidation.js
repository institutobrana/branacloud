export const FIRST_ACCESS_MIN_PASSWORD_LENGTH = 6;

export function validateFirstAccessValues(values = {}) {
  const senha = String(values.senha || '');
  const confirmaSenha = String(values.confirmaSenha || values.confirma_senha || '');
  const errors = {};

  if (!senha) {
    errors.senha = 'Informe a senha interna.';
  } else if (senha.length < FIRST_ACCESS_MIN_PASSWORD_LENGTH) {
    errors.senha = 'A senha deve ter no minimo 6 caracteres.';
  }

  if (!confirmaSenha) {
    errors.confirmaSenha = 'Confirme a senha interna.';
  } else if (senha && senha !== confirmaSenha) {
    errors.confirmaSenha = 'A confirmacao de senha nao confere.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildFirstAccessPayload(values = {}) {
  return {
    senha: String(values.senha || ''),
    confirma_senha: String(values.confirmaSenha || values.confirma_senha || ''),
  };
}
