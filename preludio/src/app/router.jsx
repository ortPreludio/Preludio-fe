import { useEffect, useState } from 'react';

function parseHash() {
  const raw = (window.location.hash || '#/').slice(1);
  const [pathname, query = ''] = raw.split('?');
  return {
    pathname: pathname || '/',
    search: new URLSearchParams(query),
  };
}

export function useHashRouter() {
  const [{ pathname, search }, setState] = useState(parseHash());

  useEffect(() => {
    const onHash = () => setState(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (to, { replace = false } = {}) => {
    const target = '#' + (to.startsWith('/') ? to : '/' + to);
    replace ? window.location.replace(target) : (window.location.hash = target);
  };

  return { path: pathname, search, navigate };
}
