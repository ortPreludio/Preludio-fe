import { useEffect, useState } from 'react'

export function useHashRouter() {
  const [path, setPath] = useState(window.location.hash.slice(1) || '/')
  useEffect(() => {
    const onHash = () => setPath(window.location.hash.slice(1) || '/')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const navigate = (to) => { window.location.hash = to }
  return { path, navigate }
}
