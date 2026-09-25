import { buildApiUrl } from '../../../services/api.js';
import { getToken } from '../../auth/authStorage.js';

export const LOCAL_BRIDGE_URL = 'https://localhost:8765';
export const LOCAL_FIELD_NAME = 'BranaSignature_1';

const b64url = (bytes) => { let binary = ''; for (const byte of bytes) binary += String.fromCharCode(byte); return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, ''); };
const randomBytes = (size) => { const bytes = new Uint8Array(size); crypto.getRandomValues(bytes); return bytes; };
const requiredHeader = (response, name) => { const value = response.headers.get(name); if (!value) throw new Error(`Resposta de preparação sem o header ${name}.`); return value; };
const textBytes = (value) => new TextEncoder().encode(value);
const sha256Hex = async (value) => { const digest = await crypto.subtle.digest('SHA-256', value); return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join(''); };
const deriveHkdfKey = async ({ keyPair, bridgePublicKey, origin, requestId, clientNonce, bridgeNonce, sessionId }) => {
  const peer = await crypto.subtle.importKey('raw', Uint8Array.from(atob(bridgePublicKey.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - bridgePublicKey.length % 4) % 4)), (char) => char.charCodeAt(0)), { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const shared = await crypto.subtle.deriveBits({ name: 'ECDH', public: peer }, keyPair.privateKey, 256);
  const salt = await sha256Hex(textBytes(`brana-bridge-v1|salt|${origin}|${requestId}|${clientNonce}|${bridgeNonce}`));
  const hkdf = await crypto.subtle.importKey('raw', shared, 'HKDF', false, ['deriveBits']);
  return crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt: Uint8Array.from(salt.match(/../g).map((x) => parseInt(x, 16))), info: textBytes(`brana-bridge-v1|session|${origin}|${requestId}|${clientNonce}|${bridgeNonce}|${sessionId}`) }, hkdf, 256);
};
const authHeaders = async ({ key, method, path, origin, sessionId, operationId, body = new Uint8Array(), requestNonce = randomBytes(16), parameters = {} }) => {
  const timestamp = Math.floor(Date.now() / 1000); const nonce = b64url(requestNonce); const contentHash = await sha256Hex(body);
  const parameterText = Object.keys(parameters).sort().map((name) => `${name}=${parameters[name]}`).join('&');
  const canonical = ['brana-bridge-v1', method.toUpperCase(), path, origin.toLowerCase(), String(timestamp), nonce, sessionId, contentHash, String(body.byteLength), parameterText, operationId].join('\x1f');
  const hmacKey = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']); const signature = await crypto.subtle.sign('HMAC', hmacKey, textBytes(canonical));
  return { 'X-Brana-Bridge-Protocol': 'brana-bridge-v1', 'X-Brana-Session': sessionId, 'X-Brana-Timestamp': String(timestamp), 'X-Brana-Request-Nonce': nonce, 'X-Brana-Content-SHA256': contentHash, 'X-Brana-Request-MAC': [...new Uint8Array(signature)].map((b) => b.toString(16).padStart(2, '0')).join('') };
};

export async function prepareLocalPdf({ pdf, pdfFilename, documentName, fetchImpl = fetch }) {
  if (!(pdf instanceof Blob) || pdf.size === 0) throw new Error('PDF Oasis inválido para preparação local.');
  const form = new FormData(); form.append('pdf_file', pdf, pdfFilename || 'documento.pdf'); if (documentName) form.append('document_name', documentName);
  const headers = new Headers(); const token = getToken(); if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetchImpl(buildApiUrl('/editor-textos/preparar-pdf-assinatura-local'), { method: 'POST', headers, body: form });
  if (!response.ok) throw new Error('Falha ao preparar o PDF para o bridge local.');
  const preparedBlob = await response.blob(); const expectedHash = requiredHeader(response, 'X-Prepared-Pdf-SHA256').toLowerCase();
  const fieldName = requiredHeader(response, 'X-Pdf-Field-Name'); const page = requiredHeader(response, 'X-Pdf-Field-Page'); const rect = requiredHeader(response, 'X-Pdf-Field-Rect');
  if (fieldName !== LOCAL_FIELD_NAME) throw new Error('Campo de assinatura local inesperado.');
  const actualHash = await sha256Hex(new Uint8Array(await preparedBlob.arrayBuffer()));
  if (actualHash !== expectedHash) throw new Error('Hash do PDF preparado divergente.');
  return { blob: preparedBlob, sha256: actualHash, fieldName, page: Number(page), rect: JSON.parse(rect) };
}

function assertBridgeUrl(url) { const parsed = new URL(url); if (parsed.protocol !== 'https:' || parsed.hostname !== 'localhost' || parsed.port !== '8765') throw new Error('Bridge local HTTPS inválido.'); }

export async function createLocalPairing({ bridgeUrl = LOCAL_BRIDGE_URL, fetchImpl = fetch } = {}) {
  assertBridgeUrl(bridgeUrl);
  const keyPair = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const publicKey = new Uint8Array(await crypto.subtle.exportKey('raw', keyPair.publicKey)); const clientNonce = b64url(randomBytes(16)); const clientInstanceId = b64url(randomBytes(16));
  const response = await fetchImpl(`${bridgeUrl}/v1/pairing-requests`, { method: 'POST', headers: { Origin: window.location.origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ client_instance_id: clientInstanceId, client_nonce: clientNonce, client_ecdh_public_key: b64url(publicKey) }) });
  if (!response.ok) throw new Error('Bridge local indisponível ou pareamento rejeitado.');
  const payload = await response.json(); if (!payload.bridge_nonce || !payload.bridge_ephemeral_public_key || !payload.request_id) throw new Error('Resposta de pareamento sem material provisório.');
  const origin = window.location.origin; const provisionalKey = await deriveHkdfKey({ keyPair, bridgePublicKey: payload.bridge_ephemeral_public_key, origin, requestId: payload.request_id, clientNonce, bridgeNonce: payload.bridge_nonce, sessionId: payload.request_id });
  return { ...payload, keyPair, clientNonce, clientInstanceId, bridgeUrl, origin, provisionalKey };
}

export async function getLocalPairingStatus({ pairing, fetchImpl = fetch } = {}) { if (!pairing?.request_id || !pairing.provisionalKey) throw new Error('Pareamento provisório inválido.'); const path = `/v1/pairing-requests/${encodeURIComponent(pairing.request_id)}`; const headers = await authHeaders({ key: pairing.provisionalKey, method: 'GET', path, origin: pairing.origin, sessionId: pairing.request_id, operationId: pairing.request_id }); const response = await fetchImpl(`${pairing.bridgeUrl}${path}`, { method: 'GET', headers: { ...headers, Origin: pairing.origin } }); if (!response.ok) throw new Error('Falha ao consultar pareamento local.'); const payload = await response.json(); if (payload.session_id) pairing.sessionKey = await deriveHkdfKey({ keyPair: pairing.keyPair, bridgePublicKey: pairing.bridge_ephemeral_public_key, origin: pairing.origin, requestId: pairing.request_id, clientNonce: pairing.clientNonce, bridgeNonce: pairing.bridge_nonce, sessionId: payload.session_id }); return { ...pairing, ...payload }; }

const bridgeError = async (response, fallback) => { let payload = {}; try { payload = await response.json(); } catch { /* resposta não JSON */ } throw new Error(payload.error_code || fallback); };

export async function createLocalSignatureOperation({ pairing, prepared, profile = 'pades-ad-rb-1.3', policyOid = '2.16.76.1.7.1.11.1.3', fetchImpl = fetch } = {}) {
  if (!pairing?.session_id || !pairing.sessionKey || !prepared?.blob) throw new Error('Sessão local ou PDF preparado inválido.');
  const body = new Uint8Array(await prepared.blob.arrayBuffer()); const operationId = b64url(randomBytes(16)); const path = '/v1/signature-operations'; const parameters = { operation_id: operationId, field_name: LOCAL_FIELD_NAME, policy_oid: policyOid, profile };
  const headers = await authHeaders({ key: pairing.sessionKey, method: 'POST', path, origin: pairing.origin, sessionId: pairing.session_id, operationId, body, parameters });
  Object.assign(headers, { 'Origin': pairing.origin, 'X-Brana-Operation-Id': operationId, 'X-Brana-Field-Name': LOCAL_FIELD_NAME, 'X-Brana-Policy-OID': policyOid, 'X-Brana-Profile': profile });
  const response = await fetchImpl(`${pairing.bridgeUrl}${path}`, { method: 'POST', headers, body }); if (!response.ok) return bridgeError(response, 'Falha ao criar operação local.'); return { ...(await response.json()), operationId, body, profile, policyOid };
}

export async function getLocalOperationStatus({ pairing, operationId, fetchImpl = fetch } = {}) {
  if (!pairing?.session_id || !pairing.sessionKey || !operationId) throw new Error('Operação local inválida.'); const path = `/v1/signature-operations/${encodeURIComponent(operationId)}`; const headers = await authHeaders({ key: pairing.sessionKey, method: 'GET', path, origin: pairing.origin, sessionId: pairing.session_id, operationId }); const response = await fetchImpl(`${pairing.bridgeUrl}${path}`, { method: 'GET', headers: { ...headers, Origin: pairing.origin } }); if (!response.ok) return bridgeError(response, 'Falha ao consultar operação local.'); return response.json();
}

export async function signLocalOperation({ pairing, operationId, prepared, profile = 'pades-ad-rb-1.3', policyOid = '2.16.76.1.7.1.11.1.3', fetchImpl = fetch } = {}) {
  if (!pairing?.session_id || !pairing.sessionKey || !operationId || !prepared?.blob) throw new Error('Operação local ou PDF preparado inválido.'); const body = new Uint8Array(await prepared.blob.arrayBuffer()); const path = `/v1/signature-operations/${encodeURIComponent(operationId)}/sign`; const parameters = { operation_id: operationId, field_name: LOCAL_FIELD_NAME, policy_oid: policyOid, profile }; const headers = await authHeaders({ key: pairing.sessionKey, method: 'POST', path, origin: pairing.origin, sessionId: pairing.session_id, operationId, body, parameters }); Object.assign(headers, { 'Origin': pairing.origin, 'X-Brana-Operation-Id': operationId, 'X-Brana-Field-Name': LOCAL_FIELD_NAME, 'X-Brana-Policy-OID': policyOid, 'X-Brana-Profile': profile }); const response = await fetchImpl(`${pairing.bridgeUrl}${path}`, { method: 'POST', headers, body }); if (!response.ok) return bridgeError(response, 'Falha ao iniciar assinatura local.'); return response.json();
}

export async function getLocalSignatureResult({ pairing, operationId, fetchImpl = fetch } = {}) { if (!pairing?.session_id || !pairing.sessionKey || !operationId) throw new Error('Operação local inválida.'); const path = `/v1/signature-operations/${encodeURIComponent(operationId)}/result`; const headers = await authHeaders({ key: pairing.sessionKey, method: 'GET', path, origin: pairing.origin, sessionId: pairing.session_id, operationId }); const response = await fetchImpl(`${pairing.bridgeUrl}${path}`, { method: 'GET', headers: { ...headers, Origin: pairing.origin } }); if (!response.ok) return bridgeError(response, 'Resultado local indisponível.'); return { blob: await response.blob(), response };
}

export async function cancelLocalOperation({ pairing, operationId, fetchImpl = fetch } = {}) { if (!pairing?.session_id || !pairing.sessionKey || !operationId) throw new Error('Operação local inválida.'); const path = `/v1/signature-operations/${encodeURIComponent(operationId)}`; const headers = await authHeaders({ key: pairing.sessionKey, method: 'DELETE', path, origin: pairing.origin, sessionId: pairing.session_id, operationId }); const response = await fetchImpl(`${pairing.bridgeUrl}${path}`, { method: 'DELETE', headers: { ...headers, Origin: pairing.origin } }); if (!response.ok) return bridgeError(response, 'Falha ao cancelar operação local.'); return response.json(); }

export async function revokeLocalSession({ pairing, bridgeUrl = LOCAL_BRIDGE_URL, sessionId, fetchImpl = fetch } = {}) { assertBridgeUrl(bridgeUrl); if (!sessionId || !pairing?.sessionKey) throw new Error('Sessão local não autenticada.'); const path = `/v1/sessions/${encodeURIComponent(sessionId)}`; const headers = await authHeaders({ key: pairing.sessionKey, method: 'DELETE', path, origin: pairing.origin, sessionId, operationId: sessionId }); return fetchImpl(`${bridgeUrl}${path}`, { method: 'DELETE', headers: { ...headers, Origin: pairing.origin } }); }
