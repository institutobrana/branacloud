import assert from 'node:assert/strict';
import { DEV_FAKE_BRIDGE_MARKER, runDevFakeSignatureFlow } from '../src/features/editorTextos/api/devFakeSignatureHarness.js';

assert.equal(DEV_FAKE_BRIDGE_MARKER, 'brana-dev-fake-bridge-v1');
const observed = [];
const result = await runDevFakeSignatureFlow({ pdfBlob: new Blob([new TextEncoder().encode('%PDF synthetic')], { type: 'application/pdf' }), onTrace: (event) => observed.push(event) });
assert.equal(result.marker, DEV_FAKE_BRIDGE_MARKER);
assert.equal(result.signCalls, 1);
assert.deepEqual(result.trace.slice(0, 2).map((event) => event.event), ['EXPORT_ONCE', 'PAIRING_APPROVED']);
assert.deepEqual(observed.map((event) => event.event), result.trace.map((event) => event.event));
assert.equal(result.resultHash, result.downloadHash);
assert.equal(result.trace.find((event) => event.event === 'RESULT_RECOVERED').cryptographic_signature, false);
assert.match(await result.result.text(), /xref/);
console.log('devFakeSignatureHarness: PASS');
