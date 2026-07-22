import { Table, Tag } from 'antd';
import { formatLastAccess } from '../utils/adminOverviewFormatters.js';

function renderStatus(status) {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'online') {
    return <Tag color="green" aria-label="Status Ativo">Ativo</Tag>;
  }
  if (normalized === 'offline') {
    return <Tag color="red" aria-label="Status Inativo">Inativo</Tag>;
  }
  return <Tag aria-label="Status Indisponível">Indisponível</Tag>;
}

export function OverviewClinicAccessTable({ rows = [] }) {
  const dataSource = Array.isArray(rows)
    ? rows.map((item, index) => ({
        key: `${item.clinicaId ?? 'clinica'}-${index}`,
        ...item,
      }))
    : [];

  return (
    <section className="admin-overview-panel admin-overview-clinic-access">
      <Table
        size="small"
        pagination={false}
        rowSelection={null}
        dataSource={dataSource}
        className="admin-overview-clinic-access-table"
        columns={[
          {
            title: 'Clínica',
            dataIndex: 'clinicaNome',
            key: 'clinicaNome',
            render: (value) => value || 'Clínica não identificada',
          },
          {
            title: 'Usuário responsável',
            dataIndex: 'responsavelNome',
            key: 'responsavelNome',
            render: (value, record) => value || record.responsavelEmail || 'Não definido',
          },
          {
            title: 'Último acesso',
            dataIndex: 'ultimoAcesso',
            key: 'ultimoAcesso',
            render: (value, record) => formatLastAccess(value, record.hasUltimoAcesso),
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (value) => renderStatus(value),
          },
        ]}
      />
    </section>
  );
}
