export function classifyPlanoContasGroupError(error) {
  const status = Number(error?.status ?? 0) || 0;
  const code = String(error?.data?.code ?? '').trim();
  const detail = String(error?.data?.detail || error?.message || '').trim();

  if (status === 409 && code === 'SYSTEM_GROUP_PROTECTED') {
    return {
      kind: 'system-group-protected',
      status,
      code,
      message: detail || 'Grupo nativo do sistema. Nao pode ser excluido.',
      details: error?.data ?? null,
      originalError: error || null,
    };
  }

  if (status === 400 && /categorias vinculadas/i.test(detail)) {
    return {
      kind: 'group-has-categories',
      status,
      code: code || null,
      message: detail || 'Este grupo possui categorias vinculadas.',
      details: error?.data ?? null,
      originalError: error || null,
    };
  }

  return {
    kind: 'request-error',
    status: status || null,
    code: code || null,
    message: detail || 'Falha ao excluir o grupo.',
    details: error?.data ?? null,
    originalError: error || null,
  };
}
