import { Alert, Tabs } from 'antd';

import { BranaModal } from '../../components/BranaModal.jsx';
import { CenarioAnualFooter } from './components/CenarioAnualFooter.jsx';
import './cenarioAnual.css';

export function CenarioAnualModal({
  open,
  title,
  activeTab,
  onTabChange,
  onCancel,
  onClose,
  onSave,
  footerPrimaryDisabled = true,
  footerPrimaryLoading = false,
  footerPrimaryLabel = 'Gravar',
  footerSecondaryLabel = 'Cancelar',
  items,
  width = 760,
  error = '',
}) {
  return (
    <BranaModal
      open={open}
      centered
      width={width}
      style={{ maxWidth: 'calc(100vw - 16px)' }}
      destroyOnHidden={false}
      maskClosable
      keyboard
      onCancel={onCancel}
      footer={null}
      title={<span className="cenario-anual-modal-title">{title}</span>}
      className="cenario-anual-modal"
      styles={{ body: { padding: 0 } }}
    >
      <div className="cenario-anual-modal-shell brana-modal-section">
        {error ? (
          <Alert
            type="warning"
            showIcon
            message="Atenção"
            description={error}
            className="cenario-anual-modal-alert"
          />
        ) : null}

        <Tabs
          type="card"
          className="cenario-anual-modal-tabs"
          activeKey={activeTab}
          onChange={onTabChange}
          items={items}
        />

        <CenarioAnualFooter
          onCancel={onClose || onCancel}
          onSave={onSave}
          primaryDisabled={footerPrimaryDisabled}
          primaryLoading={footerPrimaryLoading}
          primaryLabel={footerPrimaryLabel}
          secondaryLabel={footerSecondaryLabel}
        />
      </div>
    </BranaModal>
  );
}
