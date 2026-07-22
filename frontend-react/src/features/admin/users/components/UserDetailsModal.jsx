import { LockOutlined } from '@ant-design/icons';
import { Button, Modal, Tag, Tooltip, Typography } from 'antd';
import { buildAdminUserDetailsSections } from '../utils/adminUsersDetails.js';

const LONG_DETAIL_LABELS = new Set([
  'E-mail',
  'Clínica',
  'ClÃ­nica',
  'E-mail da clínica',
  'E-mail da clÃ­nica',
  'Plano',
  'Trial até',
  'Trial atÃ©',
  'Última atividade',
  'Ãšltima atividade',
]);

function isLongDetailItem(label) {
  return LONG_DETAIL_LABELS.has(label);
}

function renderDetailValue(item) {
  const value = item.value;
  const longValue = isLongDetailItem(item.label);
  const className = longValue ? 'admin-users-details-value admin-users-details-value--long' : 'admin-users-details-value';

  if (!longValue) {
    return <span className={className}>{value}</span>;
  }

  return (
    <Tooltip title={value}>
              <span className={className}>{value}</span>
    </Tooltip>
  );
}

function renderDetailsGrid(section) {
  return (
    <div className="admin-users-details-grid" role="table" aria-label={section.title}>
      {section.items.map((item, index) => (
        <div className="admin-users-details-pair" role="row" key={`${section.title}-${item.label}-${index}`}>
          <div className="admin-users-details-label" role="rowheader">
            {item.label}
          </div>
          <div className="admin-users-details-content" role="cell">
            {renderDetailValue(item)}
          </div>
        </div>
      ))}
    </div>
  );
}

export function UserDetailsModal({ open, user, onClose }) {
  const sections = buildAdminUserDetailsSections(user);
  const protectedUser = Boolean(user?.isSystemUser || user?.isOwnerAccount);
  const protectedMessage =
    'Este usuário possui proteção administrativa informada pelo backend. Esta tela é somente leitura.';

  return (
    <Modal
      open={open}
      title="Detalhes do usuário"
      onCancel={onClose}
      centered
      width={800}
      className="admin-users-details-modal"
      footer={[
        <Button key="close" size="small" onClick={onClose}>
          Fechar
        </Button>,
      ]}
    >
      {protectedUser ? (
        <div className="admin-users-details-protected" role="note">
          <Tag color="gold" icon={<LockOutlined />}>
            Protegido
          </Tag>
          <Tooltip title={protectedMessage}>
            <Typography.Text type="secondary" className="admin-users-details-protected-text">
              {protectedMessage}
            </Typography.Text>
          </Tooltip>
        </div>
      ) : null}

      <div className="admin-users-details-sections">
        {sections.map((section) => (
          <section className="admin-users-details-section" key={section.title}>
            <Typography.Title level={5}>{section.title}</Typography.Title>
            {renderDetailsGrid(section)}
          </section>
        ))}
      </div>
    </Modal>
  );
}
