import { Button, Modal, Tooltip, Typography } from 'antd';
import { buildAdminBillingDetailsSections } from '../utils/adminBillingDetails.js';

const LONG_DETAIL_LABELS = new Set(['Clínica', 'Status', 'Origem', 'Payment ID', 'Referência externa']);

function isLongDetailItem(label) {
  return LONG_DETAIL_LABELS.has(label);
}

function renderDetailValue(item) {
  const longValue = isLongDetailItem(item.label);
  const className = longValue ? 'admin-billing-details-value admin-billing-details-value--long' : 'admin-billing-details-value';

  if (!longValue) {
    return <span className={className}>{item.value}</span>;
  }

  return (
    <Tooltip title={item.value}>
      <span className={className}>{item.value}</span>
    </Tooltip>
  );
}

function renderDetailsGrid(section) {
  return (
    <div className="admin-billing-details-grid" role="table" aria-label={section.title}>
      {section.items.map((item, index) => (
        <div className="admin-billing-details-pair" role="row" key={`${section.title}-${item.label}-${index}`}>
          <div className="admin-billing-details-label" role="rowheader">
            {item.label}
          </div>
          <div className="admin-billing-details-content" role="cell">
            {renderDetailValue(item)}
          </div>
        </div>
      ))}
    </div>
  );
}

export function BillingDetailsModal({ open, billing, onClose }) {
  const sections = buildAdminBillingDetailsSections(billing);

  return (
    <Modal
      open={open}
      title="Detalhes da cobrança"
      onCancel={onClose}
      centered
      width={800}
      className="admin-billing-details-modal"
      footer={[
        <Button key="close" size="small" onClick={onClose}>
          Fechar
        </Button>,
      ]}
    >
      <div className="admin-billing-details-sections">
        {sections.map((section) => (
          <section className="admin-billing-details-section" key={section.title}>
            <Typography.Title level={5}>{section.title}</Typography.Title>
            {renderDetailsGrid(section)}
          </section>
        ))}
      </div>
    </Modal>
  );
}
