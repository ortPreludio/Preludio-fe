import { useEffect, useState } from 'react'
import { fetchPublicEvents } from '../api/events.js'

export function useEvents(initialParams = {}) {
  const [params, setParams] = useState(initialParams)
  const [data, setData] = useState({ items: [], total: 0, page: 1, limit: 20 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    let stop = false
    setLoading(true); setError(null)
    fetchPublicEvents(params).then(json => {
      if (stop) return
      const payload = Array.isArray(json) ? { items: json, total: json.length, page: 1, limit: json.length } : json
      setData(payload)
      setLoading(false)
    }).catch(err => {
      if (stop) return
      setError(err.message || String(err))
      setLoading(false)
    })
    return () => { stop = true }
  }, [paramsKey, params])

  return { ...data, loading, error, setParams }
}
