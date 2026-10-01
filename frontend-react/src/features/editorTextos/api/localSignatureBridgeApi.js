import { buildApiUrl } from '../../../services/api.js';
import { getToken } from '../../auth/authStorage.js';

export const LOCAL_BRIDGE_URL = 'https://localhost:8765';
export const LOCAL_FIELD_NAME = 'BranaSignature_1';
const READ_ONLY_BRIDGE_HEALTH_PATH = '/v1/diagnostics/health';

const b64url = (bytes) => { let binary = ''; for (const byte of bytes) binary += String.fromCharCode(byte); return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, ''); };
const randomBytes = (size) => { const bytes = new Uint8Array(size); crypto.getRandomValues(bytes); return bytes; };
const requiredHeader = (response, name) => { const value = response.headers.get(name); if (!value) throw new Error(`Resposta de preparação sem o header ${name}.`); return value; };
const prepareErrorCode = (payload) => {
  const detail = typeof payload?.detail === 'string' ? payload.detail.trim() : '';
  const code = typeof payload?.error_code === 'string' ? payload.error_code.trim() : '';
  return detail || code || 'INVALID_ERROR_RESPONSE';
};
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

export async function prepareLocalPdf({ pdf, pdfFilename, documentName, signatureBoxes = [], fetchImpl = fetch }) {
  if (!(pdf instanceof Blob) || pdf.size === 0) throw new Error('PDF Oasis inválido para preparação local.');
  const inputHash = await sha256Hex(new Uint8Array(await pdf.arrayBuffer()));
  const form = new FormData(); form.append('pdf_file', pdf, pdfFilename || 'documento.pdf'); if (documentName) form.append('document_name', documentName);
  if (signatureBoxes.length > 0) form.append('signature_boxes_json', JSON.stringify({ pdf_sha256: inputHash, boxes: signatureBoxes }));
  const headers = new Headers(); const token = getToken(); if (token) headers.set('Authorization', `Bearer ${token}`);
  let response;
  try {
    response = await fetchImpl(buildApiUrl('/editor-textos/preparar-pdf-assinatura-local'), { method: 'POST', headers, body: form });
  } catch {
    const error = new Error('PREPARE_NETWORK_ERROR');
    error.code = 'PREPARE_NETWORK_ERROR';
    throw error;
  }
  if (!response.ok) {
    let payload = null;
    try { payload = await response.json(); } catch { /* resposta sem JSON */ }
    const error = new Error(`PREPARE_HTTP_${response.status}: ${prepareErrorCode(payload)}`);
    error.status = response.status;
    error.code = prepareErrorCode(payload);
    throw error;
  }
  const preparedBlob = await response.blob(); const expectedHash = requiredHeader(response, 'X-Prepared-Pdf-SHA256').toLowerCase();
  const fieldName = requiredHeader(response, 'X-Pdf-Field-Name'); const page = requiredHeader(response, 'X-Pdf-Field-Page'); const rect = requiredHeader(response, 'X-Pdf-Field-Rect');
  if (fieldName !== LOCAL_FIELD_NAME) throw new Error('Campo de assinatura local inesperado.');
  const actualHash = await sha256Hex(new Uint8Array(await preparedBlob.arrayBuffer()));
  if (actualHash !== expectedHash) throw new Error('Hash do PDF preparado divergente.');
  return { blob: preparedBlob, sha256: actualHash, fieldName, page: Number(page), rect: JSON.parse(rect) };
}

function assertBridgeUrl(url) { const parsed = new URL(url); if (parsed.protocol !== 'https:' || parsed.hostname !== 'localhost' || parsed.port !== '8765' || !['', '/'].includes(parsed.pathname) || parsed.search || parsed.hash) throw new Error('Bridge local HTTPS inválido.'); }

export async function checkLocalBridgeConnection({ bridgeUrl = LOCAL_BRIDGE_URL, fetchImpl = fetch, origin = globalThis.location?.origin } = {}) {
  assertBridgeUrl(bridgeUrl);
  if (!origin) throw new Error('Origem do Oasis indisponível.');
  const url = `${bridgeUrl}${READ_ONLY_BRIDGE_HEALTH_PATH}`;
  const timestamp = new Date().toISOString();
  try {
    const response = await fetchImpl(url, { method: 'GET', headers: { Origin: origin } });
    return { url, timestamp, status: response.status, ok: response.ok, operationCreated: false };
  } catch {
    return { url, timestamp, error: 'NETWORK_ERROR', operationCreated: false };
  }
}

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

export async function getLocalPairingStatus({ pairing, fetchImpl = fetch } = {}) { if (!pairing?.request_id || !pairing.provisionalKey) throw new Error('Pareamento provisório inválido.'); const path = `/v1/pairing-requests/${encodeURIComponent(pairing.request_id)}`; const headers = await authHeaders({ key: pairing.provisionalKey, method: 'GET', path, origin: pairing.origin, sessionId: pairing.request_id, operationId: pairing.request_id, parameters: { operation_id: pairing.request_id } }); const response = await fetchImpl(`${pairing.bridgeUrl}${path}`, { method: 'GET', headers: { ...headers, Origin: pairing.origin } }); if (!response.ok) return bridgeError(response, 'Falha ao consultar pareamento local.'); const payload = await response.json(); if (payload.session_id) pairing.sessionKey = await deriveHkdfKey({ keyPair: pairing.keyPair, bridgePublicKey: pairing.bridge_ephemeral_public_key, origin: pairing.origin, requestId: pairing.request_id, clientNonce: pairing.clientNonce, bridgeNonce: pairing.bridge_nonce, sessionId: payload.session_id }); return { ...pairing, ...payload }; }

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function waitForLocalPairingApproval({ pairing, fetchImpl = fetch, timeoutMs = 120000, intervalMs = 500 } = {}) {
  const deadline = Date.now() + timeoutMs;
  let current = pairing;
  while (Date.now() < deadline) {
    current = await getLocalPairingStatus({ pairing: current, fetchImpl });
    if (current.state === 'APPROVED') return current;
    if (['DENIED', 'CANCELLED', 'EXPIRED', 'FAILED'].includes(current.state)) throw new Error(`Pareamento local terminou em ${current.state}.`);
    await wait(Math.min(intervalMs, Math.max(0, deadline - Date.now())));
  }
  throw new Error('Tempo de aprovação do pareamento expirado.');
}

const bridgeError = async (response, fallback) => {
  let payload = {};
  try { payload = await response.json(); } catch { /* resposta não JSON */ }
  const error = new Error(payload.error_code || fallback);
  error.status = response.status;
  error.code = typeof payload.error_code === 'string' ? payload.error_code : 'INVALID_ERROR_RESPONSE';
  // Preserve only the server's allow-listed diagnostic fields. Never expose
  // response text, tokens, MACs, PDF bytes, or exception messages in the UI.
  const diagnostic = {};
  for (const key of ['phase', 'detail_code', 'windows_error_code', 'upstream_code']) {
    if (typeof payload[key] === 'string' && /^[A-Za-z0-9_.-]+$/.test(payload[key])) diagnostic[key] = payload[key];
  }
  if (Number.isInteger(payload.upstream_status) && payload.upstream_status >= 100 && payload.upstream_status <= 599) diagnostic.upstream_status = payload.upstream_status;
  if (Object.keys(diagnostic).length > 0) error.diagnostic = diagnostic;
  const suffix = Object.keys(diagnostic).map((key) => `${key}=${diagnostic[key]}`).join(', ');
  error.message = `${payload.error_code || fallback} (HTTP ${response.status})${suffix ? `: ${suffix}` : ''}`;
  throw error;
};

const backendAuthorizationRequest = async (path, payload, fetchImpl) => {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  const token = getToken(); if (token) headers.set('Authorization', `Bearer ${token}`);
  let response;
  try { response = await fetchImpl(buildApiUrl(path), { method: 'POST', headers, body: JSON.stringify(payload) }); }
  catch { const error = new Error('AUTHORIZATION_NETWORK_ERROR'); error.code = 'AUTHORIZATION_NETWORK_ERROR'; throw error; }
  if (!response.ok) {
    let payloadBody = {}; try { payloadBody = await response.json(); } catch { /* sanitized fallback */ }
    const code = typeof payloadBody.detail === 'string' ? payloadBody.detail : 'AUTHORIZATION_REQUEST_REJECTED';
    const error = new Error(`AUTHORIZATION_HTTP_${response.status}: ${code}`); error.status = response.status; error.code = code; throw error;
  }
  return response.json();
};

export async function getAvailableSignatureCertificates({ fetchImpl = fetch } = {}) {
  const headers = new Headers();
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  let response;
  try {
    response = await fetchImpl(buildApiUrl('/signature-certificates/available'), { method: 'GET', headers });
  } catch {
    const error = new Error('SIGNATURE_CERTIFICATES_UNAVAILABLE');
    error.code = 'SIGNATURE_CERTIFICATES_UNAVAILABLE';
    throw error;
  }
  if (!response.ok) {
    const error = new Error(response.status === 404 ? 'SIGNATURE_AUTHORIZATION_UNAVAILABLE' : `SIGNATURE_CERTIFICATES_HTTP_${response.status}`);
    error.status = response.status;
    error.code = error.message;
    throw error;
  }
  const payload = await response.json();
  if (!Array.isArray(payload?.certificates)) {
    const error = new Error('SIGNATURE_CERTIFICATES_INVALID_RESPONSE');
    error.code = 'SIGNATURE_CERTIFICATES_INVALID_RESPONSE';
    throw error;
  }
  return payload;
}

export async function getWindowsPublicCertificates({ pairing, fetchImpl = fetch } = {}) {
  if (!pairing?.session_id || !pairing.sessionKey || pairing.state && pairing.state !== 'APPROVED') {
    const error = new Error('WINDOWS_CERTIFICATE_PAIRING_REQUIRED');
    error.code = 'WINDOWS_CERTIFICATE_PAIRING_REQUIRED';
    throw error;
  }
  const path = '/v1/certificates/windows/available';
  const operationId = 'CERTIFICATE_LIST';
  const parameters = { operation_id: operationId };
  const headers = await authHeaders({ key: pairing.sessionKey, method: 'GET', path, origin: pairing.origin, sessionId: pairing.session_id, operationId, parameters });
  let response;
  try {
    response = await fetchImpl(`${pairing.bridgeUrl}${path}`, { method: 'GET', headers: { ...headers, Origin: pairing.origin, 'X-Brana-Operation-Id': operationId } });
  } catch {
    const error = new Error('WINDOWS_CERTIFICATE_NETWORK_ERROR');
    error.code = 'WINDOWS_CERTIFICATE_NETWORK_ERROR';
    throw error;
  }
  if (!response.ok) return bridgeError(response, 'Falha ao listar certificados Windows.');
  const payload = await response.json();
  if (payload?.certificate_source !== 'WINDOWS_STORE' || !Array.isArray(payload.certificates)) {
    const error = new Error('WINDOWS_CERTIFICATE_INVALID_RESPONSE');
    error.code = 'WINDOWS_CERTIFICATE_INVALID_RESPONSE';
    throw error;
  }
  return payload;
}

const isSha256 = (value) => typeof value === 'string' && /^[0-9a-f]{64}$/i.test(value);

/** Pure source+DER join. Names, issuers, thumbprints and binding IDs are never join keys. */
export function crossSignatureIdentities({ activeBindings, windowsCertificates, authorizationFlowEnabled = true } = {}) {
  if (authorizationFlowEnabled !== true || !Array.isArray(activeBindings) || !Array.isArray(windowsCertificates)) {
    const error = new Error('SIGNATURE_IDENTITY_CROSSING_UNAVAILABLE');
    error.code = 'SIGNATURE_IDENTITY_CROSSING_UNAVAILABLE';
    throw error;
  }
  const windows = windowsCertificates.filter((item) => item?.certificate_source === 'WINDOWS_STORE' && isSha256(item.certificate_der_sha256) && item.status === 'PUBLIC_METADATA_VALID' && item.chain_valid === true);
  const seenWindows = new Set();
  const options = [];
  for (const binding of activeBindings) {
    if (binding?.status && binding.status !== 'ACTIVE') continue;
    const source = binding?.certificate_source;
    const hash = String(binding?.certificate_der_sha256 || '').toLowerCase();
    if (!isSha256(hash) || (source !== 'WINDOWS_STORE' && source !== 'FILE_PKCS12')) continue;
    if (source === 'WINDOWS_STORE') {
      const candidate = windows.find((item) => item.certificate_der_sha256.toLowerCase() === hash);
      if (!candidate || seenWindows.has(hash)) continue;
      seenWindows.add(hash);
      options.push({ source, bindingId: binding.binding_id, certificateDerSha256: hash, certificate_der_sha256: hash, label: candidate.subject || 'Certificado Windows', public: candidate });
      continue;
    }
    // FILE_PKCS12 is selectable only when the backend binding came from the
    // public .cer registration route. The PFX itself is deliberately unknown here.
    if (binding.public_certificate_registered === false) continue;
    options.push({ source, bindingId: binding.binding_id, certificateDerSha256: hash, certificate_der_sha256: hash, label: binding.certificate_subject || 'Identidade em arquivo cadastrada; PFX será escolhido localmente depois', public: binding });
  }
  if (options.length === 0) {
    const error = new Error('NO_AUTHORIZED_SIGNATURE_IDENTITIES');
    error.code = 'NO_AUTHORIZED_SIGNATURE_IDENTITIES';
    throw error;
  }
  return options;
}

export async function createLocalSignatureReservationRequest({ operationId, preparedPdfSha256, certificateDerSha256, certificateSource, fieldName = LOCAL_FIELD_NAME, policyOid = '2.16.76.1.7.1.11.1.3', ttlSeconds = 120, fetchImpl = fetch } = {}) {
  if (!operationId || !preparedPdfSha256 || !certificateDerSha256) throw new Error('RESERVATION_REQUEST_INCOMPLETE');
  return backendAuthorizationRequest('/signature-reservation-requests', { operation_id: operationId, prepared_pdf_sha256: preparedPdfSha256, certificado_der_sha256: certificateDerSha256, certificate_source: certificateSource, field_name: fieldName, policy_oid: policyOid, ttl_seconds: ttlSeconds }, fetchImpl);
}

export async function getLocalSignatureReservationRequest({ requestId, fetchImpl = fetch } = {}) {
  if (!requestId) throw new Error('RESERVATION_REQUEST_ID_MISSING');
  const token = getToken(); const headers = new Headers(); if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetchImpl(buildApiUrl(`/signature-reservation-requests/${encodeURIComponent(requestId)}`), { method: 'GET', headers });
  if (!response.ok) { const error = new Error(`RESERVATION_REQUEST_HTTP_${response.status}`); error.status = response.status; throw error; }
  return response.json();
}

export async function reserveLocalSignatureAuthorization({ operationId, preparedPdfSha256, certificateDerSha256, certificateSource, fieldName = LOCAL_FIELD_NAME, policyOid = '2.16.76.1.7.1.11.1.3', ttlSeconds = 120, fetchImpl = fetch } = {}) {
  if (!operationId || !preparedPdfSha256 || !certificateDerSha256) throw new Error('Vínculos da autorização local incompletos.');
  return backendAuthorizationRequest('/signature-authorizations/reserve', { operation_id: operationId, prepared_pdf_sha256: preparedPdfSha256, certificado_der_sha256: certificateDerSha256, certificate_source: certificateSource, field_name: fieldName, policy_oid: policyOid, ttl_seconds: ttlSeconds }, fetchImpl);
}

export async function confirmLocalSignatureAuthorization({ authorizationId, password, operationId, preparedPdfSha256, certificateDerSha256, certificateSource, fieldName = LOCAL_FIELD_NAME, policyOid = '2.16.76.1.7.1.11.1.3', ttlSeconds = 120, fetchImpl = fetch } = {}) {
  if (!authorizationId || typeof password !== 'string' || !operationId || !preparedPdfSha256 || !certificateDerSha256) throw new Error('Confirmação da autorização local incompleta.');
  return backendAuthorizationRequest('/signature-authorizations', { authorization_id: authorizationId, password, operation_id: operationId, prepared_pdf_sha256: preparedPdfSha256, certificado_der_sha256: certificateDerSha256, certificate_source: certificateSource, field_name: fieldName, policy_oid: policyOid, ttl_seconds: ttlSeconds }, fetchImpl);
}

export async function bindLocalSignatureReservation({ pairing, requestId, challenge, operationId, preparedPdfSha256, certificateDerSha256, certificateSource, fetchImpl = fetch } = {}) {
  if (!pairing?.session_id || !pairing.sessionKey || !requestId || !challenge || !operationId || !preparedPdfSha256 || !certificateDerSha256) throw new Error('Desafio de reserva local incompleto.');
  const path = '/v1/signature-reservation-requests/bind-installation';
  const parameters = { request_id: requestId, challenge, operation_id: operationId, prepared_pdf_sha256: preparedPdfSha256, certificado_der_sha256: certificateDerSha256, certificate_source: certificateSource, field_name: LOCAL_FIELD_NAME, policy_oid: '2.16.76.1.7.1.11.1.3' };
  const headers = await authHeaders({ key: pairing.sessionKey, method: 'POST', path, origin: pairing.origin, sessionId: pairing.session_id, operationId, parameters });
  const response = await fetchImpl(`${pairing.bridgeUrl}${path}`, { method: 'POST', headers: { ...headers, Origin: pairing.origin, 'Content-Type': 'application/json' }, body: JSON.stringify(parameters) });
  if (!response.ok) return bridgeError(response, 'Falha ao vincular instalação local.');
  return response.json();
}

export async function createLocalSignatureOperation({ pairing, prepared, operationId: requestedOperationId, authorizationId, certificateDerSha256, certificateSource, profile = 'pades-ad-rb-1.3', policyOid = '2.16.76.1.7.1.11.1.3', fetchImpl = fetch } = {}) {
  if (!pairing?.session_id || !pairing.sessionKey || !prepared?.blob) throw new Error('Sessão local ou PDF preparado inválido.');
  const body = new Uint8Array(await prepared.blob.arrayBuffer()); const operationId = requestedOperationId || b64url(randomBytes(16)); const path = '/v1/signature-operations'; const parameters = { operation_id: operationId, field_name: LOCAL_FIELD_NAME, policy_oid: policyOid, profile }; if (authorizationId) parameters.authorization_id = authorizationId; if (certificateDerSha256) parameters.certificate_der_sha256 = certificateDerSha256; if (certificateSource) parameters.certificate_source = certificateSource;
  const headers = await authHeaders({ key: pairing.sessionKey, method: 'POST', path, origin: pairing.origin, sessionId: pairing.session_id, operationId, body, parameters });
  Object.assign(headers, { 'Origin': pairing.origin, 'X-Brana-Operation-Id': operationId, 'X-Brana-Field-Name': LOCAL_FIELD_NAME, 'X-Brana-Policy-OID': policyOid, 'X-Brana-Profile': profile }); if (authorizationId) headers['X-Brana-Authorization-Id'] = authorizationId; if (certificateDerSha256) headers['X-Brana-Certificate-DER-SHA256'] = certificateDerSha256; if (certificateSource) headers['X-Brana-Certificate-Source'] = certificateSource;
  const response = await fetchImpl(`${pairing.bridgeUrl}${path}`, { method: 'POST', headers, body }); if (!response.ok) return bridgeError(response, 'Falha ao criar operação local.'); return { ...(await response.json()), operationId, body, profile, policyOid };
}

export async function getLocalOperationStatus({ pairing, operationId, fetchImpl = fetch } = {}) {
  if (!pairing?.session_id || !pairing.sessionKey || !operationId) throw new Error('Operação local inválida.'); const path = `/v1/signature-operations/${encodeURIComponent(operationId)}`; const headers = await authHeaders({ key: pairing.sessionKey, method: 'GET', path, origin: pairing.origin, sessionId: pairing.session_id, operationId, parameters: { operation_id: operationId } }); const response = await fetchImpl(`${pairing.bridgeUrl}${path}`, { method: 'GET', headers: { ...headers, Origin: pairing.origin } }); if (!response.ok) return bridgeError(response, 'Falha ao consultar operação local.'); return response.json();
}

export async function waitForLocalOperationApproval({ pairing, operationId, fetchImpl = fetch, timeoutMs = 120000, intervalMs = 500 } = {}) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const current = await getLocalOperationStatus({ pairing, operationId, fetchImpl });
    if (current.state === 'APPROVED') return current;
    if (['DENIED', 'CANCELLED', 'EXPIRED', 'FAILED'].includes(current.state)) throw new Error(`Operação local terminou em ${current.state}.`);
    await wait(Math.min(intervalMs, Math.max(0, deadline - Date.now())));
  }
  throw new Error('Tempo de aprovação da operação expirado.');
}

export async function signLocalOperation({ pairing, operationId, authorizationId, certificateDerSha256, certificateSource, prepared, profile = 'pades-ad-rb-1.3', policyOid = '2.16.76.1.7.1.11.1.3', fetchImpl = fetch } = {}) {
  if (!pairing?.session_id || !pairing.sessionKey || !operationId || !prepared?.blob) throw new Error('Operação local ou PDF preparado inválido.'); const body = new Uint8Array(await prepared.blob.arrayBuffer()); const path = `/v1/signature-operations/${encodeURIComponent(operationId)}/sign`; const parameters = { operation_id: operationId, field_name: LOCAL_FIELD_NAME, policy_oid: policyOid, profile }; if (authorizationId) parameters.authorization_id = authorizationId; if (certificateDerSha256) parameters.certificate_der_sha256 = certificateDerSha256; if (certificateSource) parameters.certificate_source = certificateSource; const headers = await authHeaders({ key: pairing.sessionKey, method: 'POST', path, origin: pairing.origin, sessionId: pairing.session_id, operationId, body, parameters }); Object.assign(headers, { 'Origin': pairing.origin, 'X-Brana-Operation-Id': operationId, 'X-Brana-Field-Name': LOCAL_FIELD_NAME, 'X-Brana-Policy-OID': policyOid, 'X-Brana-Profile': profile }); if (authorizationId) headers['X-Brana-Authorization-Id'] = authorizationId; if (certificateDerSha256) headers['X-Brana-Certificate-DER-SHA256'] = certificateDerSha256; if (certificateSource) headers['X-Brana-Certificate-Source'] = certificateSource; const response = await fetchImpl(`${pairing.bridgeUrl}${path}`, { method: 'POST', headers, body }); if (!response.ok) return bridgeError(response, 'Falha ao iniciar assinatura local.'); return response.json();
}

export async function getLocalSignatureResult({ pairing, operationId, fetchImpl = fetch } = {}) { if (!pairing?.session_id || !pairing.sessionKey || !operationId) throw new Error('Operação local inválida.'); const path = `/v1/signature-operations/${encodeURIComponent(operationId)}/result`; const headers = await authHeaders({ key: pairing.sessionKey, method: 'GET', path, origin: pairing.origin, sessionId: pairing.session_id, operationId, parameters: { operation_id: operationId } }); const response = await fetchImpl(`${pairing.bridgeUrl}${path}`, { method: 'GET', headers: { ...headers, Origin: pairing.origin } }); if (!response.ok) return bridgeError(response, 'Resultado local indisponível.'); return { blob: await response.blob(), response };
}

export async function isRecoveredPdfValid({ blob, prepared } = {}) {
  if (!(blob instanceof Blob) || blob.size < 5 || !prepared?.sha256) return false;
  const bytes = new Uint8Array(await blob.arrayBuffer());
  return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && new TextDecoder().decode(bytes).includes('/ByteRange');
}

export async function cancelLocalOperation({ pairing, operationId, fetchImpl = fetch } = {}) { if (!pairing?.session_id || !pairing.sessionKey || !operationId) throw new Error('Operação local inválida.'); const path = `/v1/signature-operations/${encodeURIComponent(operationId)}`; const headers = await authHeaders({ key: pairing.sessionKey, method: 'DELETE', path, origin: pairing.origin, sessionId: pairing.session_id, operationId }); const response = await fetchImpl(`${pairing.bridgeUrl}${path}`, { method: 'DELETE', headers: { ...headers, Origin: pairing.origin } }); if (!response.ok) return bridgeError(response, 'Falha ao cancelar operação local.'); return response.json(); }

export async function revokeLocalSession({ pairing, bridgeUrl = LOCAL_BRIDGE_URL, sessionId, fetchImpl = fetch } = {}) { assertBridgeUrl(bridgeUrl); if (!sessionId || !pairing?.sessionKey) throw new Error('Sessão local não autenticada.'); const path = `/v1/sessions/${encodeURIComponent(sessionId)}`; const headers = await authHeaders({ key: pairing.sessionKey, method: 'DELETE', path, origin: pairing.origin, sessionId, operationId: sessionId }); return fetchImpl(`${bridgeUrl}${path}`, { method: 'DELETE', headers: { ...headers, Origin: pairing.origin } }); }
