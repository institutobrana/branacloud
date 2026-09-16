import test from 'node:test';
import assert from 'node:assert/strict';

import {
  AUTH_BROWSER_RESUME_DEDUP_MS,
  createAuthBrowserSessionSync,
} from '../src/features/auth/authBrowserSessionSync.js';
import { AUTH_TOKEN_STORAGE_KEY } from '../src/features/auth/authStorage.js';

function createEventHarness() {
  const listeners = new Map();
  const calls = { storage: 0, visibilitychange: 0, focus: 0 };

  const addEventListener = (eventName, handler) => {
    calls[eventName] = (calls[eventName] || 0) + 1;
    listeners.set(`${eventName}:${handler.name}:${calls[eventName]}`, { eventName, handler });
  };

  const removeEventListener = (eventName, handler) => {
    for (const [key, entry] of listeners.entries()) {
      if (entry.eventName === eventName && entry.handler === handler) {
        listeners.delete(key);
      }
    }
  };

  const emit = (eventName, payload = {}) => {
    for (const entry of listeners.values()) {
      if (entry.eventName === eventName) {
        entry.handler(payload);
      }
    }
  };

  return { addEventListener, removeEventListener, emit, listeners, calls };
}

function createHarness(overrides = {}) {
  const events = createEventHarness();
  const state = {
    authenticated: true,
    loggingOut: false,
    token: 'token-a',
    storageToken: 'token-a',
    visibilityState: 'visible',
  };
  const calls = {
    externalToken: [],
    externalLogout: 0,
    resume: 0,
  };
  let now = 0;

  const sync = createAuthBrowserSessionSync({
    getSessionState: () => ({
      authenticated: state.authenticated,
      loggingOut: state.loggingOut,
      token: state.token,
    }),
    onExternalToken: (token) => {
      calls.externalToken.push(token);
      state.token = token;
      state.storageToken = token;
      if (overrides.onExternalToken) {
        overrides.onExternalToken(token, state, calls);
      }
    },
    onExternalLogout: () => {
      calls.externalLogout += 1;
      state.authenticated = false;
      state.token = '';
      state.storageToken = '';
      if (overrides.onExternalLogout) {
        overrides.onExternalLogout(state, calls);
      }
    },
    onResumeRequest: () => {
      calls.resume += 1;
      if (overrides.onResumeRequest) {
        overrides.onResumeRequest(state, calls);
      }
    },
    getStoredToken: () => state.storageToken,
    addEventListener: events.addEventListener,
    removeEventListener: events.removeEventListener,
    documentRef: {
      get visibilityState() {
        return state.visibilityState;
      },
      get hidden() {
        return state.visibilityState !== 'visible';
      },
    },
    windowRef: {},
    now: () => now,
    dedupMs: AUTH_BROWSER_RESUME_DEDUP_MS,
  });

  return {
    sync,
    events,
    state,
    calls,
    setNow(value) {
      now = value;
    },
  };
}

test('registra e remove listeners uma vez e start/stop sao idempotentes', () => {
  const harness = createHarness();
  const first = harness.sync.start();
  const second = harness.sync.start();

  assert.deepEqual(first, { started: true, running: true });
  assert.deepEqual(second, { started: true, running: true });
  assert.equal(harness.events.calls.storage, 1);
  assert.equal(harness.events.calls.visibilitychange, 1);
  assert.equal(harness.events.calls.focus, 1);
  assert.equal(harness.sync.isRunning(), true);

  const stopped = harness.sync.stop();
  const stoppedAgain = harness.sync.stop();
  assert.deepEqual(stopped, { stopped: true, running: false });
  assert.deepEqual(stoppedAgain, { stopped: false, running: false });
  assert.equal(harness.sync.isRunning(), false);
  assert.equal(harness.events.listeners.size, 0);
});

test('storage atualiza token externo e ignora chave ou valor iguais', () => {
  const harness = createHarness();
  harness.sync.start();

  harness.events.emit('storage', {
    key: AUTH_TOKEN_STORAGE_KEY,
    newValue: 'token-b',
  });

  assert.deepEqual(harness.calls.externalToken, ['token-b']);
  assert.equal(harness.state.token, 'token-b');
  assert.equal(harness.state.storageToken, 'token-b');
  assert.equal(harness.calls.externalLogout, 0);

  harness.events.emit('storage', {
    key: AUTH_TOKEN_STORAGE_KEY,
    newValue: 'token-b',
  });
  harness.events.emit('storage', {
    key: 'outra-chave',
    newValue: 'token-c',
  });

  assert.deepEqual(harness.calls.externalToken, ['token-b']);
});

test('storage removido e clear sem token invalidam sessao sem loop', () => {
  const harness = createHarness();
  harness.sync.start();

  harness.state.storageToken = '';
  harness.events.emit('storage', {
    key: AUTH_TOKEN_STORAGE_KEY,
    newValue: null,
  });

  assert.equal(harness.calls.externalLogout, 1);
  assert.equal(harness.state.authenticated, false);
  assert.equal(harness.state.token, '');

  harness.state.authenticated = true;
  harness.state.token = 'token-a';
  harness.state.storageToken = '';
  harness.events.emit('storage', {
    key: null,
    newValue: null,
  });

  assert.equal(harness.calls.externalLogout, 2);
});

test('clear com token ainda presente e chave diferente nao invalida', () => {
  const harness = createHarness();
  harness.sync.start();
  harness.state.storageToken = 'token-presente';

  harness.events.emit('storage', {
    key: null,
    newValue: null,
  });

  assert.equal(harness.calls.externalLogout, 0);
});

test('visibilitychange e focus usam dedupe e respeitam logout ou ausencia de token', () => {
  const harness = createHarness();
  harness.sync.start();
  harness.setNow(1000);

  harness.events.emit('visibilitychange');
  harness.events.emit('focus');
  assert.equal(harness.calls.resume, 1);

  harness.setNow(1200);
  harness.events.emit('visibilitychange');
  assert.equal(harness.calls.resume, 1);

  harness.setNow(2000);
  harness.events.emit('focus');
  assert.equal(harness.calls.resume, 2);

  harness.state.loggingOut = true;
  harness.setNow(3000);
  harness.events.emit('visibilitychange');
  assert.equal(harness.calls.resume, 2);

  harness.state.loggingOut = false;
  harness.state.authenticated = false;
  harness.state.token = '';
  harness.setNow(4000);
  harness.events.emit('focus');
  assert.equal(harness.calls.resume, 2);
});

test('stop interrompe listeners e nova inicializacao volta a funcionar', () => {
  const harness = createHarness();
  harness.sync.start();
  harness.sync.stop();
  harness.events.emit('storage', { key: AUTH_TOKEN_STORAGE_KEY, newValue: 'token-x' });
  assert.equal(harness.calls.externalToken.length, 0);

  harness.sync.start();
  harness.events.emit('storage', { key: AUTH_TOKEN_STORAGE_KEY, newValue: 'token-y' });
  assert.deepEqual(harness.calls.externalToken, ['token-y']);
});
