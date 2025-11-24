const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export function buildQuery(params = {}) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    sp.set(k, String(v));
  });
  const q = sp.toString();
  return q ? `?${q}` : "";
}

/**
 * request(path, { method, body, headers, token, withCredentials })
 * - withCredentials: send cookies (default true)
 * - token: optional Bearer
 */
export async function request(
  path,
  { method = "GET", body, headers, token, withCredentials = true } = {}
) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: withCredentials ? "include" : "same-origin", // <-- send cookies
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text().catch(() => "");
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      // Si ya estamos en login/register, no redirigir
      // Error de credenciales debe mostrarse en el formulario
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/login' || currentPath === '/register';

      if (!isAuthPage) {
        // Si expiró la sesión, redirigir a login
        const here = window.location.pathname + window.location.search;
        window.location.assign(`/login?returnTo=${encodeURIComponent(here)}`);
        return;
      }
    }

    const msg = data?.message || data?.error || data?.errorMsg || res.statusText || "Error";
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
