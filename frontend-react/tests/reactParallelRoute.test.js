import test from 'node:test';
import assert from 'node:assert/strict';

import { appPath, getAppBasePath, getFrontendBasePath, isUnderAppBase, loginPath } from '../src/app/basePath.js';
import { API_BASE_URL, buildApiUrl } from '../src/services/api.js';

test('base path reconhece o React principal em /app sem duplicar prefixo', () => {
  assert.equal(getFrontendBasePath('/app'), '/app');
  assert.equal(getAppBasePath('/app'), '/app');
  assert.equal(getAppBasePath('/app/'), '/app');
  assert.equal(getAppBasePath('/app/login'), '/app');
  assert.equal(getAppBasePath('/app/tabelas/procedimentos'), '/app');

  assert.equal(appPath('', '/app'), '/app');
  assert.equal(appPath('/login', '/app'), '/app/login');
  assert.equal(appPath('/tabelas/procedimentos', '/app'), '/app/tabelas/procedimentos');
  assert.equal(appPath('tabelas/procedimentos', '/app'), '/app/tabelas/procedimentos');
  assert.equal(loginPath('/app'), '/app/login');
  assert.equal(isUnderAppBase('/app/tabelas/procedimentos', '/app'), true);
  assert.equal(isUnderAppBase('/react/tabelas/procedimentos', '/app'), false);
  assert.notEqual(appPath('/login', '/app'), '/app/app/login');
  assert.notEqual(loginPath('/app'), '/react/login');
});

test('API padrao permanece no mesmo host via /api', () => {
  assert.equal(API_BASE_URL, '/api');
  assert.equal(buildApiUrl('/login'), '/api/login');
  assert.equal(buildApiUrl('/me'), '/api/me');
  assert.equal(buildApiUrl('/auth/renew'), '/api/auth/renew');
});
