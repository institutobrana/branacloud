import { useCallback, useRef, useState } from 'react';
import { extendAdminClinicTrial } from '../services/adminClinicActionsApi.js';

export function useExtendClinicTrial() {
  const [loading, setLoading] = useState(false);
  const runningRef = useRef(false);

  const execute = useCallback(async ({ clinicaId, dias }) => {
    if (runningRef.current) return null;
    runningRef.current = true;
    setLoading(true);
    try {
      return await extendAdminClinicTrial(clinicaId, dias);
    } finally {
      runningRef.current = false;
      setLoading(false);
    }
  }, []);

  return {
    loading,
    execute,
  };
}
