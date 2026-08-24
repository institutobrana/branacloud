import { useEffect } from 'react';
import { PacientesTable } from './components/PacientesTable.jsx';
import { usePacientes } from './hooks/usePacientes.js';
import './pacientes.css';

export function PacientesPage({ onOpenExisting }) {
  const {
    items,
    selectedId,
    loading,
    error,
    count,
    selectedRowKeys,
    handleSelect,
    preferences,
    optionSets,
    reload,
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

  useEffect(() => {
    const handleCreated = () => { reload(); };
    const handleDeleted = () => { reload(); };
    window.addEventListener('brana-paciente-created', handleCreated);
    window.addEventListener('brana-paciente-deleted', handleDeleted);
    return () => {
      window.removeEventListener('brana-paciente-created', handleCreated);
      window.removeEventListener('brana-paciente-deleted', handleDeleted);
    };
  }, [reload]);

  return (
    <div className="pacientes-page">
      <PacientesTable
        items={items}
        loading={loading}
        error={error}
        selectedId={selectedId}
        selectedRowKeys={selectedRowKeys}
        count={count}
        onSelect={handleSelect}
        alphabetOptions={optionSets.active_ord_menu_pac}
        activeAlphabet={preferences.active_ord_menu_pac}
        onDoubleClick={(record) => onOpenExisting?.(record?.id)}
      />
    </div>
  );
}
