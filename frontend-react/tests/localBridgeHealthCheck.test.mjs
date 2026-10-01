import test from 'node:test';
import assert from 'node:assert/strict';
import { checkLocalBridgeConnection } from '../src/features/editorTextos/api/localSignatureBridgeApi.js';

test('checks only the read-only bridge health route', async () => {
  let call;
  const result = await checkLocalBridgeConnection({
    origin: 'https://192.168.3.41:5173',
    fetchImpl: async (url, init) => {
      call = { url, init };
      return { status: 200, ok: true };
    },
  });
  assert.equal(call.url, 'https://localhost:8765/v1/diagnostics/health');
  assert.equal(call.init.method, 'GET');
  assert.equal(call.init.headers.Origin, 'https://192.168.3.41:5173');
  assert.equal('body' in call.init, false);
  assert.deepEqual({ status: result.status, ok: result.ok, operationCreated: result.operationCreated }, { status: 200, ok: true, operationCreated: false });
});

test('reports transport failure without creating an operation', async () => {
  const result = await checkLocalBridgeConnection({ origin: 'https://192.168.3.41:5173', fetchImpl: async () => { throw new TypeError('network'); } });
  assert.equal(result.error, 'NETWORK_ERROR');
  assert.equal(result.operationCreated, false);
  assert.equal(result.url, 'https://localhost:8765/v1/diagnostics/health');
});

test('rejects arbitrary bridge endpoints', async () => {
  await assert.rejects(() => checkLocalBridgeConnection({ bridgeUrl: 'https://localhost:8765/v1/pairing-requests', origin: 'https://192.168.3.41:5173' }), /Bridge local HTTPS inválido/);
});
