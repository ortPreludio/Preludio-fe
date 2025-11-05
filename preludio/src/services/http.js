const API_BASE = import.meta.env.VITE_API_BASE || '/api'

export function qs(params = {}){
  const sp = new URLSearchParams()
  for (const [k,v] of Object.entries(params)){
    if (v === undefined || v === null || v === '') continue
    sp.set(k, String(v))
  }
  const q = sp.toString()
  return q ? `?${q}` : ''
}

export async function http(path, { method='GET', body, headers } = {}){
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    body: body ? JSON.stringify(body) : undefined
  })
  const text = await res.text().catch(()=> '')
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  if (!res.ok){
    const msg = data?.message || res.statusText || 'Error'
    throw new Error(msg)
  }
  return data
}
