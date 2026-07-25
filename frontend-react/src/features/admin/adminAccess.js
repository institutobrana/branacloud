export function canAccessPlatformAdmin(user) {
  return Boolean(user && (user.is_master || user.is_superadmin));
}

export function getAdminAccessState(user, loading) {
  if (loading) {
    return {
      loading: true,
      authorized: false,
      denied: false,
      reason: 'Sessao carregando.',
    };
  }

  if (!user) {
    return {
      loading: false,
      authorized: false,
      denied: true,
      reason: 'Sessao indisponivel ou expirada.',
    };
  }

  if (canAccessPlatformAdmin(user)) {
    return {
      loading: false,
      authorized: true,
      denied: false,
      reason: '',
    };
  }

  return {
    loading: false,
    authorized: false,
    denied: true,
    reason: 'Acesso negado ao Painel ADM.',
  };
}
