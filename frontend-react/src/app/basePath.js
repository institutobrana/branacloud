function normalizePrefix(value) {
  const raw = String(value || '').trim();
  if (!raw || raw === '/') {
    return '/app';
  }
  const normalized = raw.startsWith('/') ? raw : `/${raw}`;
  return normalized.replace(/\/+$/, '');
}

function getCurrentPathname(pathname) {
  if (pathname != null) {
    return String(pathname || '/');
  }
  if (typeof window === 'undefined') {
    return '';
  }
  return window.location.pathname || '/';
}

export function getFrontendBasePath(pathname) {
  const path = getCurrentPathname(pathname);
  if (!path) {
    return '/app';
  }

  if (path === '/react' || path.startsWith('/react/')) {
    return '/react';
  }
  if (path === '/legado' || path.startsWith('/legado/')) {
    return '/legado';
  }
  if (path === '/frontend' || path.startsWith('/frontend/')) {
    return '/frontend';
  }
  return '/app';
}

export function getAppBasePath(pathname) {
  const base = getFrontendBasePath(pathname);
  return base === '/frontend' ? '/legado' : base;
}

export function appPath(suffix = '', basePath = getAppBasePath()) {
  const base = normalizePrefix(basePath);
  const normalizedSuffix = String(suffix || '').replace(/^\/+/, '');
  return normalizedSuffix ? `${base}/${normalizedSuffix}` : base;
}

export function loginPath(basePath = getAppBasePath()) {
  return `${normalizePrefix(basePath)}/login`;
}

export function isUnderAppBase(pathname, basePath = getAppBasePath()) {
  const base = normalizePrefix(basePath);
  const path = String(pathname || '/');
  return path === base || path.startsWith(`${base}/`);
}
