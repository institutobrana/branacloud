import assert from 'node:assert/strict';
import { waitForLocalOperationApproval, isRecoveredPdfValid } from '../src/features/editorTextos/api/localSignatureBridgeApi.js';

globalThis.window = { location: { origin: 'https://localhost:5173' } };
globalThis.localStorage = { getItem: () => null };

const pairing = { session_id: 'SSSSSSSSSSSSSSSSSSSS', sessionKey: new Uint8Array(32).fill(3), origin: window.location.origin, bridgeUrl: 'https://localhost:8765' };
let statusCalls = 0;
const statusFetch = async (url) => {
  statusCalls += 1;
  return new Response(JSON.stringify({ operation_id: 'OP', state: statusCalls < 2 ? 'PENDING' : 'APPROVED' }), { status: 200 });
};
assert.equal((await waitForLocalOperationApproval({ pairing, operationId: 'OP', fetchImpl: statusFetch, intervalMs: 0 })).state, 'APPROVED');
assert.equal(statusCalls, 2);

const pdf = new Blob([new TextEncoder().encode('%PDF-1.7\n/ByteRange [0 1 2 3]\n')], { type: 'application/pdf' });
assert.equal(await isRecoveredPdfValid({ blob: pdf, prepared: { sha256: 'known' } }), true);
assert.equal(await isRecoveredPdfValid({ blob: new Blob([new TextEncoder().encode('not-pdf')]), prepared: { sha256: 'known' } }), false);

let signCalls = 0;
const deniedFetch = async () => new Response(JSON.stringify({ state: 'DENIED' }), { status: 200 });
await assert.rejects(() => waitForLocalOperationApproval({ pairing, operationId: 'OP2', fetchImpl: deniedFetch, intervalMs: 0 }), /DENIED/);
assert.equal(signCalls, 0);
console.log('oasisLocalApprovalRecovery: PASS');
