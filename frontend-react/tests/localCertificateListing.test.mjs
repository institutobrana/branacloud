import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';

globalThis.crypto ??= webcrypto;
globalThis.btoa ??= (value) => Buffer.from(value, 'binary').toString('base64');

const {
  getWindowsPublicCertificates,
  crossSignatureIdentities,
} = await import('../src/features/editorTextos/api/localSignatureBridgeApi.js');

const hashA = 'a'.repeat(64);
const hashB = 'b'.repeat(64);
const pairing = {
  state: 'APPROVED',
  session_id: 'session-test',
  sessionKey: new Uint8Array(32).fill(7),
  origin: 'https://localhost:5173',
  bridgeUrl: 'https://localhost:8765',
};

const jsonResponse = (status, payload) => new Response(JSON.stringify(payload), {
  status,
  headers: { 'content-type': 'application/json' },
});

let captured;
const windowsPayload = {
  certificate_source: 'WINDOWS_STORE',
  certificates: [
    { certificate_source: 'WINDOWS_STORE', certificate_der_sha256: hashA, status: 'PUBLIC_METADATA_VALID', chain_valid: true, subject: 'Windows A' },
    { certificate_source: 'WINDOWS_STORE', certificate_der_sha256: hashB, status: 'PUBLIC_METADATA_VALID', chain_valid: true, subject: 'Windows B' },
  ],
};

const list = await getWindowsPublicCertificates({
  pairing,
  fetchImpl: async (url, init) => {
    captured = { url, init };
    return jsonResponse(200, windowsPayload);
  },
});
assert.equal(captured.url, 'https://localhost:8765/v1/certificates/windows/available');
assert.equal(captured.init.headers['X-Brana-Operation-Id'], 'CERTIFICATE_LIST');
assert.equal(captured.init.headers.Origin, pairing.origin);
assert.equal(captured.init.headers['X-Brana-Request-MAC'].length, 64);
assert.equal(list.certificates.length, 2);

const options = crossSignatureIdentities({
  activeBindings: [
    { status: 'ACTIVE', binding_id: 'win-a', certificate_source: 'WINDOWS_STORE', certificate_der_sha256: hashA },
    { status: 'ACTIVE', binding_id: 'file-a', certificate_source: 'FILE_PKCS12', certificate_der_sha256: hashA, public_certificate_registered: true },
    { status: 'REVOKED', binding_id: 'revoked', certificate_source: 'WINDOWS_STORE', certificate_der_sha256: hashB },
  ],
  windowsCertificates: list.certificates,
});
assert.deepEqual(options.map((item) => item.source), ['WINDOWS_STORE', 'FILE_PKCS12']);
assert.equal(options[0].certificateDerSha256, options[1].certificateDerSha256);
assert.notEqual(options[0].bindingId, options[1].bindingId);
assert.match(options[1].label, /PFX será escolhido localmente depois/);

await assert.rejects(
  () => getWindowsPublicCertificates({ pairing: { ...pairing, state: 'PENDING' }, fetchImpl: async () => jsonResponse(200, windowsPayload) }),
  (error) => error.code === 'WINDOWS_CERTIFICATE_PAIRING_REQUIRED',
);
await assert.rejects(
  () => getWindowsPublicCertificates({ pairing, fetchImpl: async () => jsonResponse(401, { error_code: 'AUTHENTICATION_REQUIRED' }) }),
  (error) => error.code === 'AUTHENTICATION_REQUIRED' && error.status === 401,
);
assert.throws(
  () => crossSignatureIdentities({ activeBindings: [{ status: 'ACTIVE', certificate_source: 'WINDOWS_STORE', certificate_der_sha256: hashA }], windowsCertificates: [], authorizationFlowEnabled: true }),
  (error) => error.code === 'NO_AUTHORIZED_SIGNATURE_IDENTITIES',
);
assert.throws(
  () => crossSignatureIdentities({ activeBindings: [{ status: 'ACTIVE', certificate_source: 'FILE_PKCS12', certificate_der_sha256: hashA, public_certificate_registered: false }], windowsCertificates: list.certificates }),
  (error) => error.code === 'NO_AUTHORIZED_SIGNATURE_IDENTITIES',
);
assert.throws(
  () => crossSignatureIdentities({ activeBindings: [], windowsCertificates: list.certificates, authorizationFlowEnabled: false }),
  (error) => error.code === 'SIGNATURE_IDENTITY_CROSSING_UNAVAILABLE',
);

console.log('TEST_LOCAL_CERTIFICATE_LISTING=PASS');
console.log('CERTIFICATE_LIST_OPERATION_ID=CERTIFICATE_LIST');
console.log('NO_LEGACY_CERTIFICATE_FALLBACK=PASS');
console.log('CROSS_SOURCE_SAME_DER_DISTINCT=PASS');
