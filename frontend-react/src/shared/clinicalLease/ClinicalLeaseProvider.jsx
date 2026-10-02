import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../features/auth/AuthProvider.jsx';
import { usePatientInUse } from '../patientInUse/PatientInUseContext.jsx';
import { useSessionInstance } from '../sessionInstance/SessionInstanceProvider.jsx';
import { getClinicalLeaseStatus, sendClinicalLeaseHeartbeat } from './clinicalLeaseApi.js';
import { CLINICAL_HEARTBEAT_INTERVAL_SECONDS } from './clinicalLeaseConfig.js';

const ClinicalLeaseContext = createContext(null);

export function ClinicalLeaseProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const { instanceId, status: instanceStatus } = useSessionInstance();
  const { patient } = usePatientInUse();
  const [lease, setLease] = useState({ state: patient?.id ? 'UNKNOWN' : 'AVAILABLE', patient_id: patient?.id || null, expires_at: null, error: null });
  const heartbeatInFlight = useRef(false);
  const timerRef = useRef(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const applyStatus = useCallback((next) => {
    setLease({
      state: next?.state || 'UNKNOWN',
      patient_id: next?.patient_id || null,
      expires_at: next?.expires_at || null,
      lease_token: next?.state === 'OWNER' ? (next?.lease_token || null) : null,
      error: null,
    });
  }, []);

  const revalidate = useCallback(async () => {
    if (!token || !isAuthenticated || instanceStatus !== 'ready' || !instanceId || !patient?.id) {
      stopTimer();
      setLease({ state: patient?.id ? 'UNKNOWN' : 'AVAILABLE', patient_id: patient?.id || null, expires_at: null, error: null });
      return null;
    }
    try {
      const next = await getClinicalLeaseStatus(token, patient.id, instanceId);
      applyStatus(next);
      return next;
    } catch (error) {
      stopTimer();
      setLease((current) => ({ ...current, state: 'UNKNOWN', error: error.code || error.message }));
      return null;
    }
  }, [applyStatus, instanceId, instanceStatus, isAuthenticated, patient?.id, stopTimer, token]);

  const heartbeat = useCallback(async () => {
    if (heartbeatInFlight.current || lease.state !== 'OWNER' || !lease.lease_token || !patient?.id || !instanceId || !token) return null;
    heartbeatInFlight.current = true;
    try {
      const next = await sendClinicalLeaseHeartbeat(token, patient.id, instanceId, lease.lease_token);
      applyStatus({ ...next, lease_token: lease.lease_token });
      return next;
    } catch (error) {
      stopTimer();
      setLease((current) => ({ ...current, state: error.code === 'CLINICAL_PATIENT_LEASE_NOT_OWNER' ? 'RESTRICTED' : 'UNKNOWN', error: error.code || error.message, lease_token: null }));
      return null;
    } finally {
      heartbeatInFlight.current = false;
    }
  }, [applyStatus, instanceId, lease.lease_token, lease.state, patient?.id, stopTimer, token]);

  useEffect(() => { void revalidate(); }, [revalidate]);

  useEffect(() => {
    stopTimer();
    if (lease.state === 'OWNER' && lease.lease_token) {
      timerRef.current = window.setInterval(() => { void heartbeat(); }, CLINICAL_HEARTBEAT_INTERVAL_SECONDS * 1000);
    }
    return stopTimer;
  }, [heartbeat, lease.lease_token, lease.state, stopTimer]);

  useEffect(() => {
    const onFocus = () => { if (lease.state === 'OWNER') void heartbeat(); else void revalidate(); };
    const onVisibility = () => { if (document.visibilityState === 'visible') onFocus(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => { window.removeEventListener('focus', onFocus); document.removeEventListener('visibilitychange', onVisibility); };
  }, [heartbeat, lease.state, revalidate]);

  const value = useMemo(() => ({ ...lease, revalidate, heartbeat }), [heartbeat, lease, revalidate]);
  return <ClinicalLeaseContext.Provider value={value}>{children}</ClinicalLeaseContext.Provider>;
}

export function useClinicalLease() {
  const value = useContext(ClinicalLeaseContext);
  if (!value) throw new Error('useClinicalLease deve ser usado dentro de ClinicalLeaseProvider.');
  return value;
}
