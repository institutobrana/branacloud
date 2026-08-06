import { Alert } from 'antd';

import { MedicamentosTableNew } from './MedicamentosTableNew.jsx';
import { useMedicamentosNew } from './useMedicamentosNew.js';
import './medicamentos-new.css';

export function MedicamentosPageNew() {
  const {
    items,
    filters,
    sortState,
    setSortState,
    visibleColumns,
    handleToggleVisibleColumn,
    loading,
    error,
    totalItems,
    selectedId,
    setSelectedId,
    clearFilter,
    setFilters,
  } = useMedicamentosNew();

  const totalLabel = `${totalItems === 1 ? '1 item' : `${totalItems} itens`}`;

  return (
    <div className="medicamentos-page medicamentos-page-new">
      {error ? <Alert type="error" showIcon message="Falha ao carregar medicamentos." description={error} className="medicamentos-error" /> : null}
      <div className="medicamentos-table-shell">
        <MedicamentosTableNew
          items={items}
          loading={loading}
          selectedId={selectedId}
          onSelect={setSelectedId}
          filters={filters}
          sortState={sortState}
          onSort={setSortState}
          visibleColumns={visibleColumns}
          onToggleVisibleColumn={handleToggleVisibleColumn}
          onFilterApply={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
          onFilterClear={(key) => clearFilter(key)}
          footerLabel={totalLabel}
        />
      </div>
    </div>
  );
}
