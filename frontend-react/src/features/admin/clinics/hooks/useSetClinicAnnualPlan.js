import { useCallback, useRef, useState } from 'react';
import { setAdminClinicAnnualPlan } from '../services/adminClinicActionsApi.js';

export function useSetClinicAnnualPlan() {
  const [loading, setLoading] = useState(false);
  const runningRef = useRef(false);

  const execute = useCallback(async ({ clinicId }) => {
    if (runningRef.current) return null;
    runningRef.current = true;
    setLoading(true);
    try {
      return await setAdminClinicAnnualPlan({ clinicId });
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
