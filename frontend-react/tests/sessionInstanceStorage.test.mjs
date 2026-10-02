import assert from 'node:assert/strict';
import test from 'node:test';

global.window = {
  sessionStorage: {
    values: new Map(),
    getItem(key) { return this.values.get(key) ?? null; },
    setItem(key, value) { this.values.set(key, String(value)); },
    removeItem(key) { this.values.delete(key); },
  },
};

const storage = await import('../src/shared/sessionInstance/sessionInstanceStorage.js');

test('session instance storage is isolated from PatientInUse storage', () => {
  storage.setSessionInstanceId('instance-a');
  assert.equal(storage.getSessionInstanceId(), 'instance-a');
  assert.equal(storage.SESSION_INSTANCE_STORAGE_KEY, 'brana.session.instanceId');
  assert.notEqual(storage.SESSION_INSTANCE_STORAGE_KEY, 'brana.fichaClinica.pacienteEmUso');
  storage.clearSessionInstanceId();
  assert.equal(storage.getSessionInstanceId(), '');
});
