// Helpers for hash routing: #/path?query
function getHashParts() {
  const raw = (window.location.hash || '#/').slice(1); // '/path?x=y'
  const [path, search = ''] = raw.split('?');
  return { path: path || '/', search };
}

function sanitizeInternalPath(to) {
  if (!to) return '/';
  // only internal paths
  if (to.startsWith('/') && !to.startsWith('//') && !to.includes('://')) return to;
  return '/';
}

/**
 * Return the desired target after auth.
 * - If there is ?returnTo=..., use it (sanitized).
 * - If not, use the current path unless it's /login or /register (fallback '/').
 */
export function getReturnTo() {
  const { path, search } = getHashParts();
  const params = new URLSearchParams(search);
  const fromParam = params.get('returnTo');

  const currentSafe =
    path === '/login' || path === '/register' ? '/' : path;

  return sanitizeInternalPath(fromParam || currentSafe);
}

/** Replace current hash with target so Back button doesn't return to /login */
export function redirectAfterAuth() {
  const to = getReturnTo() || '/';
  const newHash = '#' + to;

  // Use replace so the previous /login stays out of history
  if (window.location.hash !== newHash) {
    window.location.replace(newHash);
  } else {
    // force routers that rely on hashchange
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }
}

/** Build auth links that preserve returnTo */
export function authHref(target /* 'login' | 'register' */) {
  const to = getReturnTo() || '/';
  return `#/${target}?returnTo=${encodeURIComponent(to)}`;
}
