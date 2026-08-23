import { Typography } from 'antd';
import { useEffect } from 'react';
import { PacientesTable } from './components/PacientesTable.jsx';
import { usePacientes } from './hooks/usePacientes.js';
import './pacientes.css';

export function PacientesPage() {
  const {
    items,
    selectedId,
    loading,
    error,
    count,
    selectedRowKeys,
    handleSelect,
  } = usePacientes();

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('brana-pacientes-ui-state', {
        detail: {
          loading,
          selectedId,
        },
      }),
    );
  }, [loading, selectedId]);

  return (
    <div className="pacientes-page">
      <div className="pacientes-page-header">
        <div>
          <Typography.Title level={2} className="pacientes-page-title">
            Pacientes
          </Typography.Title>
          <Typography.Text type="secondary" className="pacientes-page-subtitle">
            Cadastro → Pacientes
          </Typography.Text>
        </div>
        <Typography.Text type="secondary" className="pacientes-page-counter">
          {count} {count === 1 ? 'paciente' : 'pacientes'}
        </Typography.Text>
      </div>

      <PacientesTable
        items={items}
        loading={loading}
        error={error}
        selectedId={selectedId}
        selectedRowKeys={selectedRowKeys}
        count={count}
        onSelect={handleSelect}
      />
    </div>
  );
}
