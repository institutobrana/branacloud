import { useCallback, useRef, useState } from 'react';
import { setAdminClinicSuperAdminPlan } from '../services/adminClinicActionsApi.js';

export function useSetClinicSuperAdminPlan() {
  const [loading, setLoading] = useState(false);
  const runningRef = useRef(false);

  const execute = useCallback(async ({ clinicId }) => {
    if (runningRef.current) return null;
    runningRef.current = true;
    setLoading(true);
    try {
      return await setAdminClinicSuperAdminPlan({ clinicId });
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
