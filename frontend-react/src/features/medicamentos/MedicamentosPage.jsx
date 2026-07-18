import { Alert } from 'antd';
import { useEffect } from 'react';

import { MedicamentosTable } from './MedicamentosTable.jsx';
import { useMedicamentos } from './useMedicamentos.js';
import './medicamentos.css';

export function MedicamentosPage() {
  const {
    filteredItems,
    groups,
    apresentacoes,
    filters,
    sortState,
    setSortState,
    visibleColumns,
    handleToggleVisibleColumn,
    group,
    name,
    apresentacao,
    loading,
    loadingGroups,
    error,
    totalItems,
    selectedId,
    setSelectedId,
    setGroup,
    setName,
    setApresentacao,
    clearFilter,
    setFilters,
  } = useMedicamentos();

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('brana-medicamentos-state', {
          detail: {
            groups,
            apresentacoes,
            group,
            name,
            apresentacao,
            loadingGroups,
          },
        }),
    );
  }, [apresentacoes, group, loadingGroups, name, apresentacao, groups]);

  useEffect(() => {
    const onToolbarFilter = (event) => {
      const field = String(event?.detail?.field || '').trim();
      const value = event?.detail?.value;
      if (field === 'group') {
        setGroup(value || '');
      }
      if (field === 'name') {
        setName(value || '');
      }
      if (field === 'apresentacao') {
        setApresentacao(value || '');
      }
    };

    window.addEventListener('brana-medicamentos-toolbar-filter', onToolbarFilter);
    return () => window.removeEventListener('brana-medicamentos-toolbar-filter', onToolbarFilter);
  }, [setGroup, setName]);

  const totalLabel = `${totalItems === 1 ? '1 item' : `${totalItems} itens`}`;

  return (
    <div className="medicamentos-page">
      <div className="medicamentos-table-shell">
        {error ? <Alert type="error" showIcon message="Falha ao carregar medicamentos." description={error} className="medicamentos-error" /> : null}
        <MedicamentosTable
          items={filteredItems}
          loading={loading}
          selectedId={selectedId}
          onSelect={setSelectedId}
          filters={filters}
          sortState={sortState}
          onSort={setSortState}
          visibleColumns={visibleColumns}
          onToggleVisibleColumn={handleToggleVisibleColumn}
          onFilterApply={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
          onFilterClear={(key) => clearFilter?.(key)}
          footerLabel={totalLabel}
        />
      </div>
    </div>
  );
}
