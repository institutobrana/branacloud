import { Button } from 'antd';

export function CenarioAnualFooter({ onCancel, onSave, primaryDisabled, primaryLoading, primaryLabel, secondaryLabel }) {
  return (
    <div className="cenario-anual-modal-footer">
      <Button type="primary" disabled={primaryDisabled} loading={primaryLoading} onClick={onSave}>
        {primaryLabel || 'Gravar'}
      </Button>
      <Button onClick={onCancel}>
        {secondaryLabel || 'Cancelar'}
      </Button>
    </div>
  );
}
