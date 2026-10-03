import { Alert } from 'antd';
import { useClinicalLease } from './ClinicalLeaseProvider.jsx';

const messages = {
  RESTRICTED: (ownerDisplayName) => ownerDisplayName
    ? `O usuário ${ownerDisplayName} está utilizando este módulo no momento.`
    : 'Este módulo está sendo utilizado por outra sessão.',
  UNKNOWN: () => 'Não foi possível confirmar a disponibilidade para alterações clínicas.',
};

export function ClinicalLeaseStatusBanner() {
  const { state, ownerDisplayName } = useClinicalLease();
  if (state !== 'RESTRICTED' && state !== 'UNKNOWN') return null;
  const message = messages[state](ownerDisplayName);
  return (
    <Alert
      className="ficha-clinica-lease-status-banner"
      role="status"
      aria-live="polite"
      type={state === 'RESTRICTED' ? 'warning' : 'info'}
      showIcon
      message={message}
    />
  );
}
