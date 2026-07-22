import { appPath } from '../../app/basePath.js';

export const ADMIN_ROUTE_SUFFIX = 'adm';

export function adminPath() {
  return appPath(ADMIN_ROUTE_SUFFIX);
}

export function isAdminRoutePath(pathname) {
  const path = String(pathname || '').replace(/\/+$/, '');
  const base = adminPath();
  return path === base || path === `${appPath()}/${ADMIN_ROUTE_SUFFIX}` || path.startsWith(`${base}/`);
}
