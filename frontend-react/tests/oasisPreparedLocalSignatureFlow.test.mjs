import assert from 'node:assert/strict';
import { prepareLocalPdf, createLocalPairing, LOCAL_BRIDGE_URL } from '../src/features/editorTextos/api/localSignatureBridgeApi.js';

globalThis.window = { location: { origin: 'https://localhost:5173' } };
globalThis.localStorage = { getItem: () => null };

const headers = new Headers({ 'X-Prepared-Pdf-SHA256': 'bad', 'X-Pdf-Field-Name': 'BranaSignature_1', 'X-Pdf-Field-Page': '0', 'X-Pdf-Field-Rect': '[1,2,3,4]' });
let prepareCalls = 0;
const fakeFetch = async () => { prepareCalls += 1; return new Response(new Blob([new Uint8Array([1, 2, 3])], { type: 'application/pdf' }), { status: 200, headers }); };
await assert.rejects(() => prepareLocalPdf({ pdf: new Blob([new Uint8Array([9])]), pdfFilename: 'synthetic.pdf', fetchImpl: fakeFetch }), /Hash/);
assert.equal(prepareCalls, 1);
await assert.rejects(() => createLocalPairing({ bridgeUrl: 'http://localhost:8765', fetchImpl: fakeFetch }), /HTTPS/);
assert.equal(LOCAL_BRIDGE_URL, 'https://localhost:8765');

let pairingCalls = 0;
const pairingFetch = async (url, options) => { pairingCalls += 1; assert.equal(url, `${LOCAL_BRIDGE_URL}/v1/pairing-requests`); assert.equal(options.method, 'POST'); const body = JSON.parse(options.body); assert.equal(body.client_instance_id.length > 0, true); assert.equal(body.client_nonce.length > 0, true); assert.equal(body.client_ecdh_public_key.length, 87); const bridgePair = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']); const bridgePublic = new Uint8Array(await crypto.subtle.exportKey('raw', bridgePair.publicKey)); const bridgeB64 = Buffer.from(bridgePublic).toString('base64url'); return new Response(JSON.stringify({ state: 'PENDING', request_id: 'AAAAAAAAAAAAAAAAAAAAAA', bridge_nonce: 'AAAAAAAAAAAAAAAAAAAAAA', bridge_ephemeral_public_key: bridgeB64, client_instance_id: body.client_instance_id, expires_at: 9999999999, approval_code: 'ABCDEFGH', protocol: 'brana-bridge-v1' }), { status: 200, headers: { 'Content-Type': 'application/json' } }); };
const pairing = await createLocalPairing({ fetchImpl: pairingFetch });
assert.equal(pairing.state, 'PENDING'); assert.equal(pairingCalls, 1);

console.log('oasisPreparedLocalSignatureFlow: PASS');
