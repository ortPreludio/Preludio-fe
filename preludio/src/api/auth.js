
import { request } from './client.js'
export function apiRegister(body) { return request('/auth/register', { method: 'POST', body }) }
export function apiLogin(body) { return request('/auth/login', { method: 'POST', body }) }
