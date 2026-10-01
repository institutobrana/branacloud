import test from 'node:test';
import assert from 'node:assert/strict';
import { createLocalSignatureOperation, signLocalOperation } from '../src/features/editorTextos/api/localSignatureBridgeApi.js';

globalThis.window = { location: { origin: 'https://localhost:5173' } };
globalThis.localStorage = { getItem: () => null };

test('reuses reserved operation and authorization IDs in HMAC-bound headers', async () => {
  const pairing = { session_id: 'S'.repeat(22), sessionKey: new Uint8Array(32).fill(3), origin: window.location.origin, bridgeUrl: 'https://localhost:8765' };
  const prepared = { blob: new Blob([new Uint8Array([37, 80, 68, 70, 45, 49])]) };
  const seen = [];
  const fetchImpl = async (url, options) => {
    seen.push({ url, options });
    return new Response(JSON.stringify({ operation_id: 'O'.repeat(22), state: 'APPROVED' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
  const operation = await createLocalSignatureOperation({ pairing, prepared, operationId: 'O'.repeat(22), authorizationId: 'A'.repeat(43), fetchImpl });
  assert.equal(operation.operationId, 'O'.repeat(22));
  assert.equal(seen[0].options.headers['X-Brana-Authorization-Id'], 'A'.repeat(43));
  await signLocalOperation({ pairing, operationId: 'O'.repeat(22), authorizationId: 'A'.repeat(43), prepared, fetchImpl });
  assert.equal(seen[1].options.headers['X-Brana-Authorization-Id'], 'A'.repeat(43));
});
