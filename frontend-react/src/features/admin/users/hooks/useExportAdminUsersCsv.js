import { useCallback, useRef, useState } from 'react';
import { exportAdminUsersCsv } from '../services/adminUsersApi.js';
import { downloadAdminUsersCsv } from '../utils/adminUsersCsvDownload.js';

export function useExportAdminUsersCsv() {
  const exportingRef = useRef(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  const exportCsv = useCallback(async (query = {}) => {
    if (exportingRef.current) return null;

    exportingRef.current = true;
    setExporting(true);
    setError('');

    try {
      const result = await exportAdminUsersCsv(query);
      const downloadedFileName = downloadAdminUsersCsv(result);
      return { ...result, downloadedFileName };
    } catch (err) {
      const message = err?.message || 'Falha ao exportar CSV de usuarios.';
      setError(message);
      throw err;
    } finally {
      exportingRef.current = false;
      setExporting(false);
    }
  }, []);

  return {
    error,
    exporting,
    exportCsv,
  };
}
