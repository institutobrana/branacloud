import { Button, Modal, Tooltip, Typography } from 'antd';
import { buildAdminAuditDetailsSections } from '../utils/adminAuditDetails.js';

const LONG_DETAIL_LABELS = new Set(['Ação', 'E-mail', 'Resumo']);

function isLongDetailItem(label) {
  return LONG_DETAIL_LABELS.has(label);
}

function renderDetailValue(item) {
  const longValue = isLongDetailItem(item.label);
  const className = longValue ? 'admin-audit-details-value admin-audit-details-value--long' : 'admin-audit-details-value';

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
    <div className="admin-audit-details-grid" role="table" aria-label={section.title}>
      {section.items.map((item, index) => (
        <div className="admin-audit-details-pair" role="row" key={`${section.title}-${item.label}-${index}`}>
          <div className="admin-audit-details-label" role="rowheader">
            {item.label}
          </div>
          <div className="admin-audit-details-content" role="cell">
            {renderDetailValue(item)}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AuditDetailsModal({ open, audit, onClose }) {
  const sections = buildAdminAuditDetailsSections(audit);

  return (
    <Modal
      open={open}
      title="Detalhes do evento"
      onCancel={onClose}
      centered
      width={800}
      className="admin-audit-details-modal"
      footer={[
        <Button key="close" size="small" onClick={onClose}>
          Fechar
        </Button>,
      ]}
    >
      <div className="admin-audit-details-sections">
        {sections.map((section) => (
          <section className="admin-audit-details-section" key={section.title}>
            <Typography.Title level={5}>{section.title}</Typography.Title>
            {renderDetailsGrid(section)}
          </section>
        ))}
      </div>
    </Modal>
  );
}
