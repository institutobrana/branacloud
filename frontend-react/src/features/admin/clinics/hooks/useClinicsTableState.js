import { useMemo, useState } from 'react';
import {
  ADMIN_CLINICS_EMPTY_FILTERS,
  ADMIN_CLINICS_VISIBLE_COLUMNS,
  formatAdminClinicsFooterLabel,
  processAdminClinicsRows,
  toggleAdminClinicVisibleColumn,
} from '../utils/adminClinicsTable.js';

export function useClinicsTableState(rows = [], totalFromBackend = 0) {
  const [sortState, setSortState] = useState({ key: 'clinica', order: 'asc' });
  const [filters, setFilters] = useState(ADMIN_CLINICS_EMPTY_FILTERS);
  const [visibleColumns, setVisibleColumns] = useState(ADMIN_CLINICS_VISIBLE_COLUMNS);

  const processedRows = useMemo(() => processAdminClinicsRows(rows, filters, sortState), [filters, rows, sortState]);
  const footerLabel = useMemo(
    () => formatAdminClinicsFooterLabel(processedRows.length, totalFromBackend || rows.length),
    [processedRows.length, rows.length, totalFromBackend],
  );

  const applyFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: String(value || '').trim() }));
  };

  const clearFilter = (key) => {
    setFilters((current) => ({ ...current, [key]: '' }));
  };

  const clearFilters = () => {
    setFilters(ADMIN_CLINICS_EMPTY_FILTERS);
  };

  const toggleVisibleColumn = (key) => {
    setVisibleColumns((current) => toggleAdminClinicVisibleColumn(current, key));
  };

  return {
    rows: processedRows,
    filters,
    sortState,
    setSortState,
    applyFilter,
    clearFilter,
    clearFilters,
    visibleColumns,
    toggleVisibleColumn,
    footerLabel,
  };
}
