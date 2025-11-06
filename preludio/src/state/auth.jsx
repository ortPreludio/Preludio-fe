import { createContext, useContext, useEffect, useState } from "react";
import { apiLogin, apiLogout } from "../api/auth.js";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

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
