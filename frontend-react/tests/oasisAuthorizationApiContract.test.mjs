import test from 'node:test';
import assert from 'node:assert/strict';
import { reserveLocalSignatureAuthorization, confirmLocalSignatureAuthorization } from '../src/features/editorTextos/api/localSignatureBridgeApi.js';

globalThis.window = { localStorage: { getItem: () => 'test-token' } };
const calls = [];
const fetchImpl = async (url, options) => {
  calls.push({ url, options });
  return new Response(JSON.stringify({ authorization_id: 'A'.repeat(43), status: calls.length === 1 ? 'RESERVED' : 'ISSUED' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};

test('real client API separates reservation from password confirmation', async () => {
  const reserved = await reserveLocalSignatureAuthorization({ operationId: 'O'.repeat(22), preparedPdfSha256: 'b'.repeat(64), certificateDerSha256: 'a'.repeat(64), fetchImpl });
  assert.equal(reserved.status, 'RESERVED');
  const issued = await confirmLocalSignatureAuthorization({ authorizationId: reserved.authorization_id, password: 'synthetic-only', operationId: 'O'.repeat(22), preparedPdfSha256: 'b'.repeat(64), certificateDerSha256: 'a'.repeat(64), fetchImpl });
  assert.equal(issued.status, 'ISSUED');
  assert.equal(calls[1].options.headers.get('Authorization'), 'Bearer test-token');
  assert.equal(JSON.parse(calls[1].options.body).authorization_id, reserved.authorization_id);
});
