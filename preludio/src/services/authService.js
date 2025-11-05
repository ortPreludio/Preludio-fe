import { http } from './http.js'
export const authService = {
  login: (email, password) => http('/auth/login', { method:'POST', body: { email, password } }),
  register: (payload) => http('/auth/register', { method:'POST', body: payload })
}
