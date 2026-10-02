import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { registerSessionInstance, validateSessionInstance } from '../../features/auth/authApi.js';
import { clearSessionInstanceId, getSessionInstanceId, setSessionInstanceId } from './sessionInstanceStorage.js';

const SessionInstanceContext = createContext(null);
const COLLISION_CHANNEL_NAME = 'brana.session.instance';

function createTabNonce() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `${Date.now()}-${Math.random()}`;
}

export function SessionInstanceProvider({ token, authenticated, children }) {
  const [instanceId, setInstanceId] = useState(() => getSessionInstanceId());
  const [status, setStatus] = useState('idle');
  const initializedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    if (!token) {
      clearSessionInstanceId();
      setInstanceId('');
      setStatus('idle');
      return undefined;
    }
    if (!authenticated) {
      setStatus('loading');
      return undefined;
    }
    const channel = typeof BroadcastChannel === 'function' ? new BroadcastChannel(COLLISION_CHANNEL_NAME) : null;
    const tabNonce = createTabNonce();
    let collisionHandled = false;
    let presenceResolver = null;
    let presenceTimer = null;
    const announce = (id) => channel?.postMessage({ type: 'claim', instanceId: id, tabNonce });
    const registerFresh = async () => {
      const registered = await registerSessionInstance(token);
      if (cancelled) return;
      initializedRef.current = true;
      setSessionInstanceId(registered.instance_id);
      setInstanceId(registered.instance_id);
      setStatus('ready');
      announce(registered.instance_id);
    };
    const handleCollision = async () => {
      if (collisionHandled || cancelled) return;
      collisionHandled = true;
      clearSessionInstanceId();
      setInstanceId('');
      setStatus('loading');
      try { await registerFresh(); } catch {
        if (!cancelled) { setInstanceId(''); setStatus('error'); }
      }
    };
    if (channel) {
      channel.onmessage = (event) => {
        const message = event.data;
        if (!message || message.instanceId !== getSessionInstanceId() || message.tabNonce === tabNonce) return;
        if (message.type === 'probe') {
          channel.postMessage({ type: 'presence', instanceId: message.instanceId, tabNonce });
          return;
        }
        if (message.type === 'presence') {
          presenceResolver?.(true);
          presenceResolver = null;
        }
      };
    }
    setStatus('loading');
    const bootstrap = async () => {
      let current = getSessionInstanceId();
      if (current) {
        if (channel) {
          const duplicate = await new Promise((resolve) => {
            presenceResolver = resolve;
            presenceTimer = window.setTimeout(() => {
              presenceResolver = null;
              resolve(false);
            }, 100);
            channel.postMessage({ type: 'probe', instanceId: current, tabNonce });
          });
          if (duplicate) {
            await handleCollision();
            return;
          }
        } else if (!initializedRef.current) {
          const navigationType = window.performance?.getEntriesByType?.('navigation')?.[0]?.type;
          if (navigationType !== 'reload') {
            await handleCollision();
            return;
          }
        }
        try {
          const validated = await validateSessionInstance(token, current);
          if (!cancelled && !collisionHandled) { initializedRef.current = true; setInstanceId(validated.instance_id); setStatus('ready'); announce(validated.instance_id); }
          return;
        } catch { clearSessionInstanceId(); current = ''; }
      }
      try {
        await registerFresh();
      } catch {
        if (!cancelled) { setInstanceId(''); setStatus('error'); }
      }
    };
    void bootstrap();
    return () => { cancelled = true; if (presenceTimer) window.clearTimeout(presenceTimer); presenceResolver = null; channel?.close(); };
  }, [authenticated, token]);

  const value = useMemo(() => ({ instanceId, status }), [instanceId, status]);
  return <SessionInstanceContext.Provider value={value}>{children}</SessionInstanceContext.Provider>;
}

export function useSessionInstance() {
  const value = useContext(SessionInstanceContext);
  if (!value) throw new Error('useSessionInstance deve ser usado dentro de SessionInstanceProvider.');
  return value;
}
