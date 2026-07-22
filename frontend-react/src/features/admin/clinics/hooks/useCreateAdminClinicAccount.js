import { useCallback, useRef, useState } from 'react';
import { createAdminClinicAccount } from '../services/adminClinicActionsApi.js';

export function useCreateAdminClinicAccount() {
  const [loading, setLoading] = useState(false);
  const runningRef = useRef(false);

  const execute = useCallback(async (values) => {
    if (runningRef.current) return null;
    runningRef.current = true;
    setLoading(true);
    try {
      return await createAdminClinicAccount(values);
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
