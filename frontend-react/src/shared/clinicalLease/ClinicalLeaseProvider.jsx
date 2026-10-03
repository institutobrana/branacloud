import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../features/auth/AuthProvider.jsx';
import { usePatientInUse } from '../patientInUse/PatientInUseContext.jsx';
import { useSessionInstance } from '../sessionInstance/SessionInstanceProvider.jsx';
import { acquireClinicalLease, getClinicalLeaseStatus, releaseClinicalLease, sendClinicalLeaseHeartbeat } from './clinicalLeaseApi.js';
import { CLINICAL_HEARTBEAT_INTERVAL_SECONDS } from './clinicalLeaseConfig.js';

const ClinicalLeaseContext = createContext(null);

export function ClinicalLeaseProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const { instanceId, status: instanceStatus } = useSessionInstance();
  const { patient } = usePatientInUse();
  const [lease, setLease] = useState({ state: patient?.id ? 'UNKNOWN' : 'AVAILABLE', patient_id: patient?.id || null, expires_at: null, ownerDisplayName: null, error: null });
  const heartbeatInFlight = useRef(false);
  const acquireInFlight = useRef(false);
  const revalidateInFlight = useRef(null);
  const releaseInFlight = useRef(false);
  const leaseOperationVersion = useRef(0);
  const timerRef = useRef(null);
  const pagehidePatientRef = useRef(null);
  const pagehideStateRef = useRef('AVAILABLE');
  const pagehideTokenRef = useRef(null);
  const pagehideSessionRef = useRef(null);

  pagehidePatientRef.current = patient?.id || null;
  pagehideStateRef.current = lease.state;
  pagehideTokenRef.current = lease.lease_token || null;
  pagehideSessionRef.current = instanceId || null;

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const applyStatus = useCallback((next) => {
    const nextState = next?.state || 'UNKNOWN';
    setLease({
      state: nextState,
      patient_id: next?.patient_id || null,
      expires_at: next?.expires_at || null,
      lease_token: nextState === 'OWNER' ? (next?.lease_token || null) : null,
      ownerDisplayName: nextState === 'RESTRICTED' ? (next?.owner?.display_name || null) : null,
      error: null,
    });
  }, []);

  const revalidate = useCallback(async () => {
    if (revalidateInFlight.current) return revalidateInFlight.current;
    const request = (async () => {
      if (!token || !isAuthenticated || instanceStatus !== 'ready' || !instanceId || !patient?.id) {
        stopTimer();
        setLease({ state: patient?.id ? 'UNKNOWN' : 'AVAILABLE', patient_id: patient?.id || null, expires_at: null, ownerDisplayName: null, error: null });
        return null;
      }
      const expectedPatientId = patient.id;
      const expectedInstanceId = instanceId;
      try {
        const next = await getClinicalLeaseStatus(token, expectedPatientId, expectedInstanceId);
        if (patient?.id !== expectedPatientId || instanceId !== expectedInstanceId) return null;
        if (next?.state === 'AVAILABLE') {
          return await acquireLease(expectedPatientId, expectedInstanceId);
        }
        applyStatus(next);
        return next;
      } catch (error) {
        if (patient?.id === expectedPatientId && instanceId === expectedInstanceId) {
          stopTimer();
          setLease((current) => ({ ...current, state: 'UNKNOWN', ownerDisplayName: null, error: error.code || error.message }));
        }
        return null;
      }
    })();
    revalidateInFlight.current = request;
    try {
      return await request;
    } finally {
      if (revalidateInFlight.current === request) revalidateInFlight.current = null;
    }
  }, [applyStatus, instanceId, instanceStatus, isAuthenticated, patient?.id, stopTimer, token]);

  const acquireLease = useCallback(async (patientId = patient?.id, expectedInstanceId = instanceId) => {
    if (acquireInFlight.current || !token || !isAuthenticated || instanceStatus !== 'ready' || !patientId || !expectedInstanceId) return null;
    acquireInFlight.current = true;
    try {
      const next = await acquireClinicalLease(token, patientId, expectedInstanceId);
      if (patient?.id !== patientId || instanceId !== expectedInstanceId) return null;
      applyStatus(next);
      return next;
    } catch (error) {
      if (patient?.id === patientId && instanceId === expectedInstanceId) {
        stopTimer();
        setLease((current) => ({ ...current, state: 'UNKNOWN', ownerDisplayName: null, lease_token: null, error: error.code || error.message }));
      }
      return null;
    } finally {
      acquireInFlight.current = false;
    }
  }, [applyStatus, instanceId, instanceStatus, isAuthenticated, patient?.id, stopTimer, token]);

  const heartbeat = useCallback(async () => {
    if (releaseInFlight.current || heartbeatInFlight.current || lease.state !== 'OWNER' || !lease.lease_token || !patient?.id || !instanceId || !token) return null;
    heartbeatInFlight.current = true;
    const operationVersion = leaseOperationVersion.current;
    const heartbeatToken = lease.lease_token;
    try {
      const next = await sendClinicalLeaseHeartbeat(token, patient.id, instanceId, heartbeatToken);
      if (operationVersion !== leaseOperationVersion.current || releaseInFlight.current) return null;
      applyStatus({ ...next, lease_token: heartbeatToken });
      return next;
    } catch (error) {
      stopTimer();
      setLease((current) => ({ ...current, state: error.code === 'CLINICAL_PATIENT_LEASE_NOT_OWNER' ? 'RESTRICTED' : 'UNKNOWN', ownerDisplayName: null, error: error.code || error.message, lease_token: null }));
      return null;
    } finally {
      heartbeatInFlight.current = false;
    }
  }, [applyStatus, instanceId, lease.lease_token, lease.state, patient?.id, stopTimer, token]);

  const release = useCallback(async () => {
    if (releaseInFlight.current) return null;
    const snapshot = {
      patientId: patient?.id,
      instanceId,
      leaseToken: lease.lease_token,
    };
    if (lease.state !== 'OWNER' || !snapshot.patientId || !snapshot.instanceId || !snapshot.leaseToken || !token) {
      stopTimer();
      setLease({ state: 'AVAILABLE', patient_id: null, expires_at: null, ownerDisplayName: null, lease_token: null, error: null });
      return null;
    }

    releaseInFlight.current = true;
    leaseOperationVersion.current += 1;
    stopTimer();
    try {
      return await releaseClinicalLease(token, snapshot.patientId, snapshot.instanceId, snapshot.leaseToken);
    } catch (error) {
      setLease((current) => ({ ...current, error: error.code || error.message }));
      return null;
    } finally {
      setLease({ state: 'AVAILABLE', patient_id: null, expires_at: null, ownerDisplayName: null, lease_token: null, error: null });
      releaseInFlight.current = false;
    }
  }, [instanceId, lease.lease_token, lease.state, patient?.id, stopTimer, token]);

  useEffect(() => { void revalidate(); }, [revalidate]);

  useEffect(() => {
    stopTimer();
    if (lease.state === 'OWNER' && lease.lease_token) {
      timerRef.current = window.setInterval(() => { void heartbeat(); }, CLINICAL_HEARTBEAT_INTERVAL_SECONDS * 1000);
    }
    return stopTimer;
  }, [heartbeat, lease.lease_token, lease.state, stopTimer]);

  useEffect(() => {
    if (lease.state !== 'RESTRICTED' || !patient?.id || instanceStatus !== 'ready' || !instanceId) return undefined;
    const timer = window.setInterval(() => {
      void revalidate();
    }, 20000);
    return () => {
      window.clearInterval(timer);
    };
  }, [instanceId, instanceStatus, lease.state, patient?.id, revalidate]);

  useEffect(() => {
    const onFocus = () => { if (lease.state === 'OWNER') void heartbeat(); else void revalidate(); };
    const onVisibility = () => { if (document.visibilityState === 'visible') onFocus(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => { window.removeEventListener('focus', onFocus); document.removeEventListener('visibilitychange', onVisibility); };
  }, [heartbeat, lease.state, revalidate]);

  useEffect(() => {
    const onPageHide = (event) => {
      if (event.persisted || pagehideStateRef.current !== 'OWNER' || releaseInFlight.current) return;
      const patientId = pagehidePatientRef.current;
      const sessionId = pagehideSessionRef.current;
      const leaseToken = pagehideTokenRef.current;
      if (!patientId || !sessionId || !leaseToken || !token) return;

      releaseInFlight.current = true;
      leaseOperationVersion.current += 1;
      stopTimer();
      void releaseClinicalLease(token, patientId, sessionId, leaseToken, { keepalive: true }).catch(() => undefined);
    };

    window.addEventListener('pagehide', onPageHide);
    return () => window.removeEventListener('pagehide', onPageHide);
  }, [stopTimer, token]);

  const value = useMemo(() => ({ ...lease, acquire: acquireLease, revalidate, heartbeat, release }), [acquireLease, heartbeat, lease, release, revalidate]);
  return <ClinicalLeaseContext.Provider value={value}>{children}</ClinicalLeaseContext.Provider>;
}

export function useClinicalLease() {
  const value = useContext(ClinicalLeaseContext);
  if (!value) throw new Error('useClinicalLease deve ser usado dentro de ClinicalLeaseProvider.');
  return value;
}
