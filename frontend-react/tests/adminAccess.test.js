import test from 'node:test';
import assert from 'node:assert/strict';
import { canAccessPlatformAdmin, getAdminAccessState } from '../src/features/admin/adminAccess.js';

test('admin access stays loading while session validates', () => {
  const access = getAdminAccessState(null, true);
  assert.equal(access.loading, true);
  assert.equal(access.authorized, false);
  assert.equal(access.denied, false);
});

test('platform admin access is granted only to master session data', () => {
  const masterAccess = canAccessPlatformAdmin({ is_master: true });
  const adminAccess = canAccessPlatformAdmin({ is_admin: true, is_master: false });
  const superAccess = canAccessPlatformAdmin({ is_superadmin: true, is_master: false });
  assert.equal(masterAccess, true);
  assert.equal(adminAccess, false);
  assert.equal(superAccess, false);
});

test('admin access is denied for common users and missing master flag', () => {
  const access = getAdminAccessState({ is_admin: false, is_superadmin: false, is_master: false }, false);
  const missing = getAdminAccessState({ is_admin: true, is_superadmin: true }, false);
  assert.equal(access.authorized, false);
  assert.equal(access.denied, true);
  assert.equal(missing.authorized, false);
});
