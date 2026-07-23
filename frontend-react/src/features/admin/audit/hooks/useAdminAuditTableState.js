import { useMemo, useState } from 'react';
import {
  ADMIN_AUDIT_EMPTY_FILTERS,
  ADMIN_AUDIT_VISIBLE_COLUMNS,
  formatAdminAuditFooterLabel,
  processAdminAuditRows,
  toggleAdminAuditVisibleColumn,
} from '../constants/adminAuditColumns.js';

export function useAdminAuditTableState(rows = [], totalFromBackend = 0, selectedId = null) {
  const [globalSearch, setGlobalSearch] = useState('');
  const [sortState, setSortState] = useState({ key: 'criadoEm', order: 'desc' });
  const [filters, setFilters] = useState(ADMIN_AUDIT_EMPTY_FILTERS);
  const [visibleColumns, setVisibleColumns] = useState(ADMIN_AUDIT_VISIBLE_COLUMNS);

  const processedRows = useMemo(
    () => processAdminAuditRows(rows, filters, sortState, globalSearch),
    [filters, globalSearch, rows, sortState],
  );

  const footerLabel = useMemo(
    () => formatAdminAuditFooterLabel(processedRows.length, totalFromBackend || rows.length, selectedId),
    [processedRows.length, rows.length, selectedId, totalFromBackend],
  );

  const applyFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: String(value || '').trim() }));
  };

  const clearFilter = (key) => {
    setFilters((current) => ({ ...current, [key]: '' }));
  };

  const toggleVisibleColumn = (key) => {
    setVisibleColumns((current) => toggleAdminAuditVisibleColumn(current, key));
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
