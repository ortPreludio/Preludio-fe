import { createContext, useContext, useEffect, useState } from "react";
import { apiLogin, apiLogout } from "../api/auth.js";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("user") || "null"); } catch { return null; }
  });

  useEffect(() => {
    if (user) sessionStorage.setItem("user", JSON.stringify(user));
    else sessionStorage.removeItem("user");
  }, [user]);

  // Validamos fetcheando a server si el user está logueado, sino borramos sessionstorage de user
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          // backend returns { user: {...} }
          setUser(data.user || null);
        } else {
          // Clearear user
          setUser(null);
        }
      } catch (err) {
        if (!mounted) return;
        setUser(null);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const login = async ({ email, password }) => {
    const { user } = await apiLogin({ email, password }); // cookie is set by server
    setUser(user);
    return user;
  };

  const logout = async () => {
    try { await apiLogout(); } finally { setUser(null); }
  };

  const setToken = () => {};

  return (
    <AuthCtx.Provider value={{ user, setUser, login, logout, setToken }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() { return useContext(AuthCtx); }
