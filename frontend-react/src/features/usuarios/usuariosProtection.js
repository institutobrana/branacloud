export function isProtectedBaseAccount(user) {
  if (!user) return false;
  const names = [user.nome, user.apelido].map((value) => String(value || '').trim().toLocaleLowerCase('pt-BR'));
  return Boolean(user.is_system_user) || names.includes('clínica') || names.includes('clinica');
}
