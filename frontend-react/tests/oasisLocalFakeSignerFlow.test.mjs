import assert from 'node:assert/strict';
import { createLocalSignatureOperation, getLocalOperationStatus, getLocalPairingStatus, getLocalSignatureResult, prepareLocalPdf, signLocalOperation, LOCAL_FIELD_NAME } from '../src/features/editorTextos/api/localSignatureBridgeApi.js';

globalThis.window = { location: { origin: 'https://localhost:5173' } };
globalThis.localStorage = { getItem: () => null };

const preparedBytes = new Uint8Array([37, 80, 68, 70, 45, 49, 46, 55, 10, 37, 115, 121, 110, 116, 104, 101, 116, 105, 99]);
const digest = async (bytes) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map((byte) => byte.toString(16).padStart(2, '0')).join('');
const hash = await digest(preparedBytes);
const sessionKey = new Uint8Array(32).fill(7);
const pairing = { session_id: 'SSSSSSSSSSSSSSSSSSSSSS', sessionKey, origin: window.location.origin, bridgeUrl: 'https://localhost:8765' };
let exportCalls = 0;
let signCalls = 0;
let operationBody;

const fakeFetch = async (url, options = {}) => {
  if (url.includes('preparar-pdf-assinatura-local')) {
    exportCalls += 1;
    return new Response(new Blob([preparedBytes], { type: 'application/pdf' }), { status: 200, headers: { 'X-Prepared-Pdf-SHA256': hash, 'X-Pdf-Field-Name': LOCAL_FIELD_NAME, 'X-Pdf-Field-Page': '0', 'X-Pdf-Field-Rect': '[100,200,300,400]' } });
  }
  if (url.endsWith('/v1/signature-operations') && options.method === 'POST') {
    operationBody = new Uint8Array(options.body);
    return new Response(JSON.stringify({ operation_id: 'OOOOOOOOOOOOOOOOOOOOOO', state: 'APPROVED' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  if (url.endsWith('/sign')) {
    signCalls += 1;
    assert.deepEqual(new Uint8Array(options.body), preparedBytes);
    return new Response(JSON.stringify({ operation_id: 'OOOOOOOOOOOOOOOOOOOOOO', state: 'COMPLETED' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  if (url.endsWith('/result')) return new Response(new Blob([new Uint8Array([70, 65, 75, 69])], { type: 'application/pdf' }), { status: 200 });
  if (url.includes('/v1/signature-operations/')) return new Response(JSON.stringify({ state: 'COMPLETED' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  if (url.includes('/pairing-requests/')) return new Response(JSON.stringify({ state: 'APPROVED', session_id: pairing.session_id }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  throw new Error(`Unexpected fake bridge request: ${url}`);
};

const original = new Blob([new Uint8Array([1, 2, 3])], { type: 'application/pdf' });
const prepared = await prepareLocalPdf({ pdf: original, pdfFilename: 'synthetic.pdf', documentName: 'synthetic', fetchImpl: fakeFetch });
assert.equal(exportCalls, 1);
const operation = await createLocalSignatureOperation({ pairing, prepared, fetchImpl: fakeFetch });
assert.deepEqual(operationBody, preparedBytes);
assert.equal(operation.state, 'APPROVED');
assert.equal((await getLocalOperationStatus({ pairing, operationId: operation.operation_id, fetchImpl: fakeFetch })).state, 'COMPLETED');
assert.equal((await signLocalOperation({ pairing, operationId: operation.operation_id, prepared, fetchImpl: fakeFetch })).state, 'COMPLETED');
const result = await getLocalSignatureResult({ pairing, operationId: operation.operation_id, fetchImpl: fakeFetch });
assert.deepEqual(new Uint8Array(await result.blob.arrayBuffer()), new Uint8Array([70, 65, 75, 69]));
assert.equal(signCalls, 1);
assert.equal(exportCalls, 1);
console.log('oasisLocalFakeSignerFlow: PASS');
