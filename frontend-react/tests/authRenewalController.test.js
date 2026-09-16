import test from 'node:test';
import assert from 'node:assert/strict';

import {
  AUTH_RENEW_INTERVAL_MS,
  AUTH_RENEW_RETRY_DELAYS_MS,
  createAuthRenewalController,
} from '../src/features/auth/authRenewalController.js';

function createTimerHarness() {
  let nextId = 1;
  const timers = new Map();
  const schedule = (fn, delay) => {
    const id = nextId += 1;
    timers.set(id, { fn, delay });
    return id;
  };
  const cancel = (id) => {
    timers.delete(id);
  };
  return {
    schedule,
    cancel,
    timers,
    runFirst() {
      const entry = timers.entries().next();
      if (entry.done) return false;
      const [id, timer] = entry.value;
      timers.delete(id);
      timer.fn();
      return true;
    },
  };
}

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function flushAsync() {
  return new Promise((resolve) => setImmediate(resolve));
}

function createHarness({ token = 'token-inicial', renewImpl } = {}) {
  const storage = { token };
  const calls = [];
  const invalidations = [];
  const timers = createTimerHarness();
  const renewToken =
    renewImpl ||
    (async (currentToken) => {
      calls.push(currentToken);
      return { accessToken: `${currentToken}-novo`, tokenType: 'bearer', expiresIn: 3600 };
    });

  const controller = createAuthRenewalController({
    renewToken,
    getToken: () => storage.token,
    setToken: (next) => {
      storage.token = next;
    },
    clearToken: () => {
      storage.token = '';
    },
    onSessionInvalid: () => invalidations.push('invalid'),
    setTimeout: timers.schedule,
    clearTimeout: timers.cancel,
  });

  return { controller, storage, calls, invalidations, timers };
}

test('nao inicia sem token e start e idempotente', () => {
  const harness = createHarness({ token: '' });
  const first = harness.controller.start();
  const second = harness.controller.start();
  assert.equal(first.started, false);
  assert.equal(second.started, false);
  assert.equal(harness.timers.timers.size, 0);
});

test('start agenda renovacao e renewNow compartilha a mesma promise', async () => {
  const deferredRenew = deferred();
  let renewCalls = 0;
  const harness = createHarness({
    renewImpl: async (token) => {
      renewCalls += 1;
      harness.calls.push(token);
      return deferredRenew.promise;
    },
  });

  const startResult = harness.controller.start();
  assert.equal(startResult.started, true);
  assert.equal(harness.timers.timers.size, 1);
  const timer = [...harness.timers.timers.values()][0];
  assert.equal(timer.delay, AUTH_RENEW_INTERVAL_MS);

  const p1 = harness.controller.renewNow();
  const p2 = harness.controller.renewNow();
  assert.strictEqual(p1, p2);
  await flushAsync();
  assert.equal(renewCalls, 1);

  deferredRenew.resolve({
    accessToken: 'token-novo',
    tokenType: 'bearer',
    expiresIn: 3600,
  });

  await p1;
  assert.equal(harness.storage.token, 'token-novo');
  assert.equal(harness.timers.timers.size, 1);
  assert.equal(harness.invalidations.length, 0);
});

test('start repetido nao duplica timer', () => {
  const harness = createHarness();
  harness.controller.start();
  harness.controller.start();
  assert.equal(harness.timers.timers.size, 1);
});

test('stop invalida resposta obsoleta e impede novo agendamento', async () => {
  const deferredRenew = deferred();
  const harness = createHarness({
    renewImpl: async () => deferredRenew.promise,
  });

  harness.controller.start();
  const promise = harness.controller.renewNow();
  harness.controller.stop();

  deferredRenew.resolve({
    accessToken: 'token-obsoleto',
    tokenType: 'bearer',
    expiresIn: 3600,
  });
  await promise;

  assert.equal(harness.storage.token, 'token-inicial');
  assert.equal(harness.timers.timers.size, 0);
  assert.equal(harness.invalidations.length, 0);
});

test('sessao nova nao e sobrescrita por resposta antiga', async () => {
  const firstRenew = deferred();
  const secondRenew = deferred();
  let renewCount = 0;
  const harness = createHarness({
    renewImpl: async () => {
      renewCount += 1;
      if (renewCount === 1) return firstRenew.promise;
      return secondRenew.promise;
    },
  });

  harness.controller.start();
  const p1 = harness.controller.renewNow();
  harness.controller.stop();
  harness.storage.token = 'token-segundo';
  harness.controller.start();
  const p2 = harness.controller.renewNow();

  firstRenew.resolve({ accessToken: 'token-antigo', tokenType: 'bearer', expiresIn: 3600 });
  secondRenew.resolve({ accessToken: 'token-novo', tokenType: 'bearer', expiresIn: 3600 });

  await Promise.all([p1, p2]);

  assert.equal(harness.storage.token, 'token-novo');
});

test('syncExternalToken invalida operacao antiga e usa token novo', async () => {
  const firstRenew = deferred();
  let renewCount = 0;
  const harness = createHarness({
    renewImpl: async () => {
      renewCount += 1;
      if (renewCount === 1) return firstRenew.promise;
      return { accessToken: `${harness.storage.token}-renovado`, tokenType: 'bearer', expiresIn: 3600 };
    },
  });

  harness.controller.start();
  const pending = harness.controller.renewNow();
  harness.controller.syncExternalToken('token-externo');

  firstRenew.resolve({ accessToken: 'token-obsoleto', tokenType: 'bearer', expiresIn: 3600 });
  await pending;

  assert.equal(harness.storage.token, 'token-externo');
  assert.equal(harness.timers.timers.size, 1);
  assert.equal(harness.timers.runFirst(), true);
  await flushAsync();
  assert.equal(harness.storage.token, 'token-externo-renovado');
});

test('401 encerra controlador e chama invalida uma vez', async () => {
  const harness = createHarness({
    renewImpl: async () => {
      const error = new Error('Sessao expirada');
      error.status = 401;
      throw error;
    },
  });

  harness.controller.start();
  await harness.controller.renewNow();
  assert.equal(harness.controller.isRunning(), false);
  assert.equal(harness.storage.token, '');
  assert.equal(harness.invalidations.length, 1);
});

test('500 agenda retry sem invalidar sessao', async () => {
  let attempts = 0;
  const harness = createHarness({
    renewImpl: async () => {
      attempts += 1;
      if (attempts === 1) {
        const error = new Error('falha temporaria');
        error.status = 500;
        throw error;
      }
      return { accessToken: 'token-restaurado', tokenType: 'bearer', expiresIn: 3600 };
    },
  });

  harness.controller.start();
  await harness.controller.renewNow();
  assert.equal(harness.invalidations.length, 0);
  assert.equal(harness.timers.timers.size, 1);
  assert.equal([...harness.timers.timers.values()][0].delay, AUTH_RENEW_RETRY_DELAYS_MS[0]);
  harness.timers.runFirst();
  await flushAsync();
  await flushAsync();
  assert.equal(harness.storage.token, 'token-restaurado');
});

test('resposta sem access_token encerra a sessao', async () => {
  const harness = createHarness({
    renewImpl: async () => ({ tokenType: 'bearer', expiresIn: 3600 }),
  });

  harness.controller.start();
  await harness.controller.renewNow();
  assert.equal(harness.storage.token, '');
  assert.equal(harness.invalidations.length, 1);
  assert.equal(harness.controller.isRunning(), false);
});
