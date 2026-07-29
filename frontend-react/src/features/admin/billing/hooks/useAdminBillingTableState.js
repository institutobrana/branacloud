import { useMemo, useState } from 'react';
import {
  ADMIN_BILLING_EMPTY_FILTERS,
  ADMIN_BILLING_VISIBLE_COLUMNS,
  formatAdminBillingFooterLabel,
  processAdminBillingRows,
  toggleAdminBillingVisibleColumn,
} from '../constants/adminBillingColumns.js';

export function useAdminBillingTableState(rows = [], totalFromBackend = 0, selectedId = null) {
  const [globalSearch, setGlobalSearch] = useState('');
  const [sortState, setSortState] = useState({ key: 'criadoEm', order: 'desc' });
  const [filters, setFilters] = useState(ADMIN_BILLING_EMPTY_FILTERS);
  const [visibleColumns, setVisibleColumns] = useState(ADMIN_BILLING_VISIBLE_COLUMNS);

  const processedRows = useMemo(
    () => processAdminBillingRows(rows, filters, sortState, globalSearch),
    [filters, globalSearch, rows, sortState],
  );

  const footerLabel = useMemo(
    () => formatAdminBillingFooterLabel(processedRows.length, totalFromBackend || rows.length, selectedId),
    [processedRows.length, rows.length, selectedId, totalFromBackend],
  );

  const applyFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: String(value || '').trim() }));
  };

  const clearFilter = (key) => {
    setFilters((current) => ({ ...current, [key]: '' }));
  };

  const toggleVisibleColumn = (key) => {
    setVisibleColumns((current) => toggleAdminBillingVisibleColumn(current, key));
  };

  return {
    rows: processedRows,
    globalSearch,
    setGlobalSearch,
    filters,
    sortState,
    setSortState,
    applyFilter,
    clearFilter,
    visibleColumns,
    toggleVisibleColumn,
    footerLabel,
  };
}
