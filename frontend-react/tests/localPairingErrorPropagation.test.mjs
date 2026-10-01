import test from 'node:test';
import assert from 'node:assert/strict';
import { getLocalPairingStatus } from '../src/features/editorTextos/api/localSignatureBridgeApi.js';

const pairing = { request_id: 'request-1', provisionalKey: new Uint8Array(32), bridgeUrl: 'https://localhost:8765', origin: 'https://192.168.3.41:5173' };

test('preserves the sanitized bridge error code from pairing GET', async () => {
  await assert.rejects(
    () => getLocalPairingStatus({ pairing, fetchImpl: async () => ({ ok: false, status: 401, json: async () => ({ error_code: 'MAC_INVALID' }) }) }),
    (error) => error.message === 'MAC_INVALID (HTTP 401)' && error.status === 401 && error.code === 'MAC_INVALID',
  );
});

test('preserves only sanitized signer diagnostics from a 502', async () => {
  const { signLocalOperation } = await import('../src/features/editorTextos/api/localSignatureBridgeApi.js');
  const localPairing = { session_id: 'session-1', sessionKey: new Uint8Array(32), origin: pairing.origin, bridgeUrl: pairing.bridgeUrl };
  const prepared = { blob: new Blob([new Uint8Array([1, 2, 3])]) };
  await assert.rejects(
    () => signLocalOperation({ pairing: localPairing, operationId: 'operation-1', prepared, fetchImpl: async () => ({
      ok: false, status: 502,
      json: async () => ({ error_code: 'SIGNER_FAILED', phase: 'provider_sign', detail_code: 'DOTNET_HELPER_FAILED', windows_error_code: '0x80090016', secret: 'must-not-leak' }),
    }) }),
    (error) => error.message === 'SIGNER_FAILED (HTTP 502): phase=provider_sign, detail_code=DOTNET_HELPER_FAILED, windows_error_code=0x80090016'
      && error.diagnostic.detail_code === 'DOTNET_HELPER_FAILED'
      && !error.message.includes('secret'),
  );
});

test('invalid 502 payload becomes a transport-safe diagnostic', async () => {
  const { signLocalOperation } = await import('../src/features/editorTextos/api/localSignatureBridgeApi.js');
  const localPairing = { session_id: 'session-1', sessionKey: new Uint8Array(32), origin: pairing.origin, bridgeUrl: pairing.bridgeUrl };
  await assert.rejects(
    () => signLocalOperation({ pairing: localPairing, operationId: 'operation-1', prepared: { blob: new Blob([new Uint8Array([1])]) }, fetchImpl: async () => ({ ok: false, status: 502, json: async () => { throw new Error('invalid'); } }) }),
    (error) => error.message === 'Falha ao iniciar assinatura local. (HTTP 502)' && error.code === 'INVALID_ERROR_RESPONSE',
  );
});
