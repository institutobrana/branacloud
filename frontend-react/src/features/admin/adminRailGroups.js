import { canAccessPlatformAdmin } from './adminAccess.js';

export function getAdminMainGroups(user, groups = []) {
  return canAccessPlatformAdmin(user)
    ? groups
    : groups.filter((group) => group.key !== 'adm');
}
