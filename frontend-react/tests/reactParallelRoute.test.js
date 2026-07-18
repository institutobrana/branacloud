import test from 'node:test';
import assert from 'node:assert/strict';

import { appPath, getAppBasePath, getFrontendBasePath, isUnderAppBase, loginPath } from '../src/app/basePath.js';
import { API_BASE_URL, buildApiUrl } from '../src/services/api.js';

test('base path reconhece o React em /react sem duplicar prefixo', () => {
  assert.equal(getFrontendBasePath('/react'), '/react');
  assert.equal(getAppBasePath('/react'), '/react');
  assert.equal(getAppBasePath('/react/'), '/react');
  assert.equal(getAppBasePath('/react/tabelas/procedimentos'), '/react');

  assert.equal(appPath('', '/react'), '/react');
  assert.equal(appPath('/tabelas/procedimentos', '/react'), '/react/tabelas/procedimentos');
  assert.equal(appPath('tabelas/procedimentos', '/react'), '/react/tabelas/procedimentos');
  assert.equal(loginPath('/react'), '/react/login');
  assert.equal(isUnderAppBase('/react/tabelas/procedimentos', '/react'), true);
  assert.equal(isUnderAppBase('/app/tabelas/procedimentos', '/react'), false);
});

test('API padrao permanece no mesmo host via /api', () => {
  assert.equal(API_BASE_URL, '/api');
  assert.equal(buildApiUrl('/login'), '/api/login');
  assert.equal(buildApiUrl('/me'), '/api/me');
  assert.equal(buildApiUrl('/auth/renew'), '/api/auth/renew');
});
