import { Alert, Button } from 'antd';

export function ClinicsErrorState({ error, onRetry }) {
  return (
    <Alert
      type="error"
      showIcon
      message="Não foi possível carregar as clínicas"
      description={error || 'Tente novamente em instantes.'}
      action={
        <Button size="small" onClick={onRetry}>
          Tentar novamente
        </Button>
      }
    />
  );
}
