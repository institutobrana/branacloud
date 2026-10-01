import assert from 'node:assert/strict';
import test from 'node:test';
import { prepareLocalPdf } from '../src/features/editorTextos/api/localSignatureBridgeApi.js';

const input = new Blob([Buffer.from('%PDF-test')], { type: 'application/pdf' });
const response = (status, payload, headers = {}) => new Response(payload == null ? null : payload instanceof Uint8Array ? payload : JSON.stringify(payload), { status, headers });

test('preserves structured backend detail and HTTP status', async () => {
  await assert.rejects(
    () => prepareLocalPdf({ pdf: input, fetchImpl: async () => response(400, { detail: 'SIGNATURE_ANCHOR_MISSING' }) }),
    (error) => error.message === 'PREPARE_HTTP_400: SIGNATURE_ANCHOR_MISSING' && error.status === 400 && error.code === 'SIGNATURE_ANCHOR_MISSING',
  );
});

test('uses a distinct sanitized code when the HTTP error has no detail', async () => {
  await assert.rejects(
    () => prepareLocalPdf({ pdf: input, fetchImpl: async () => response(502, null) }),
    (error) => error.message === 'PREPARE_HTTP_502: INVALID_ERROR_RESPONSE' && error.status === 502 && error.code === 'INVALID_ERROR_RESPONSE',
  );
});

test('uses a transport code for network failure', async () => {
  await assert.rejects(
    () => prepareLocalPdf({ pdf: input, fetchImpl: async () => { throw new TypeError('network details omitted'); } }),
    (error) => error.message === 'PREPARE_NETWORK_ERROR' && error.code === 'PREPARE_NETWORK_ERROR' && error.status === undefined,
  );
});

test('keeps the successful preparation contract unchanged', async () => {
  const prepared = new Blob([Buffer.from('%PDF-1.4 prepared')], { type: 'application/pdf' });
  const bytes = new Uint8Array(await prepared.arrayBuffer());
  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
  const hash = [...new Uint8Array(hashBuffer)].map((value) => value.toString(16).padStart(2, '0')).join('');
  const result = await prepareLocalPdf({
    pdf: input,
    fetchImpl: async () => response(200, bytes, {
      'X-Prepared-Pdf-SHA256': hash,
      'X-Pdf-Field-Name': 'BranaSignature_1',
      'X-Pdf-Field-Page': '0',
      'X-Pdf-Field-Rect': '[1,2,3,4]',
    }),
  });
  assert.equal(result.sha256, hash);
  assert.equal(result.fieldName, 'BranaSignature_1');
  assert.deepEqual(result.rect, [1, 2, 3, 4]);
});
