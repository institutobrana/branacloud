import { useMemo } from 'react';
import { getAdminAccessState } from './adminAccess.js';

export function useAdminAccess(user, loading) {
  return useMemo(() => getAdminAccessState(user, loading), [user, loading]);
}
