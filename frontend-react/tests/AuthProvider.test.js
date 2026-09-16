import test from 'node:test';
import assert from 'node:assert/strict';

import { shouldRunAuthRenewal } from '../src/features/auth/authProviderSession.js';

test('shouldRunAuthRenewal depende de autenticacao, token e estado nao encerrado', () => {
  assert.equal(shouldRunAuthRenewal({ authenticated: false, loggingOut: false, token: 'x' }), false);
  assert.equal(shouldRunAuthRenewal({ authenticated: true, loggingOut: true, token: 'x' }), false);
  assert.equal(shouldRunAuthRenewal({ authenticated: true, loggingOut: false, token: '' }), false);
  assert.equal(shouldRunAuthRenewal({ authenticated: true, loggingOut: false, token: 'x' }), true);
});
