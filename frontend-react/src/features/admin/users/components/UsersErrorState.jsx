import { Alert } from 'antd';

export function UsersErrorState({ error, onRetry }) {
  return (
    <Alert
      type="error"
      showIcon
      message="Não foi possível carregar usuários"
      description={error || 'Tente novamente em instantes.'}
      action={
        onRetry ? (
          <button type="button" className="admin-users-inline-retry" onClick={onRetry}>
            Tentar novamente
          </button>
        ) : null
      }
    />
  );
}
