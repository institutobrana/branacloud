import { useMemo, useState } from 'react';
import {
  ADMIN_USERS_EMPTY_FILTERS,
  ADMIN_USERS_VISIBLE_COLUMNS,
  formatAdminUsersFooterLabel,
  processAdminUsersRows,
  toggleAdminUserVisibleColumn,
} from '../constants/adminUsersColumns.js';

export function useAdminUsersTableState(rows = [], totalFromBackend = 0, selectedId = null) {
  const [sortState, setSortState] = useState({ key: 'nome', order: 'asc' });
  const [filters, setFilters] = useState(ADMIN_USERS_EMPTY_FILTERS);
  const [visibleColumns, setVisibleColumns] = useState(ADMIN_USERS_VISIBLE_COLUMNS);

  const processedRows = useMemo(() => processAdminUsersRows(rows, filters, sortState), [filters, rows, sortState]);
  const footerLabel = useMemo(
    () => formatAdminUsersFooterLabel(processedRows.length, totalFromBackend || rows.length, selectedId),
    [processedRows.length, rows.length, selectedId, totalFromBackend],
  );

  const applyFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: String(value || '').trim() }));
  };

  const clearFilter = (key) => {
    setFilters((current) => ({ ...current, [key]: '' }));
  };

  const toggleVisibleColumn = (key) => {
    setVisibleColumns((current) => toggleAdminUserVisibleColumn(current, key));
  };

  return {
    rows: processedRows,
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
