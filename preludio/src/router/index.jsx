import { useEffect, useState } from 'react';

export function navigate(to, { replace = false } = {}) {
  if (replace) window.history.replaceState({}, '', to);
  else window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function Link({ to, replace, onClick, children, ...rest }) {
  return (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
        navigate(to, { replace });
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

/** routes: [{ path: '/login', component: Login }, ...]
 *  fallback: { component: Home }
 */
export function Router({ routes = [], fallback }) {
  const [path, setPath] = useState(window.location.pathname || '/');

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname || '/');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const match = routes.find((r) => r.path === path) || fallback;
  const View = match?.component ?? (() => null);
  return <View />;
}
