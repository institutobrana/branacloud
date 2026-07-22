import { useCallback, useRef, useState } from 'react';
import { updateAdminClinicStatus } from '../services/adminClinicActionsApi.js';

export function useUpdateClinicStatus() {
  const [loading, setLoading] = useState(false);
  const runningRef = useRef(false);

  const execute = useCallback(async ({ clinicId, ativo, motivo }) => {
    if (runningRef.current) return null;
    runningRef.current = true;
    setLoading(true);
    try {
      return await updateAdminClinicStatus({ clinicId, ativo, motivo });
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
