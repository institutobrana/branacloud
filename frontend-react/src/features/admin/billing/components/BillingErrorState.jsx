import { Alert } from 'antd';

export function BillingErrorState({ error, onRetry }) {
  return (
    <Alert
      type="error"
      showIcon
      message="Não foi possível carregar cobranças"
      description={error || 'Tente atualizar a listagem.'}
      action={
        <button type="button" className="admin-billing-inline-retry" onClick={onRetry}>
          Tentar novamente
        </button>
      }
    />
  );
}
