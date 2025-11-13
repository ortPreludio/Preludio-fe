import { request } from "./client.js";

// Server sets cookies (token + refreshToken); response returns { user }
export function apiLogin({ email, password }) {
  return request("/auth/login", { method: "POST", body: { email, password } });
}

export function apiRegister(body) {
  return request("/auth/register", { method: "POST", body });
}

export function apiUpdateProfile(body) { return request('/auth/profile', { method: "PUT", body })}
// Clear cookies on the server
export function apiLogout() {
  return request("/auth/logout", { method: "POST" });
}