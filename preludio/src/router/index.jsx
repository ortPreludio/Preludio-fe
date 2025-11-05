import { useEffect, useState } from 'react'
import { Home } from '../pages/Home.jsx'
import { Login } from '../pages/Login.jsx'
import { Register } from '../pages/Register.jsx'

function useHashPath(){
  const [path, setPath] = useState(window.location.hash.slice(1) || '/')
  useEffect(()=>{
    const onHash = () => setPath(window.location.hash.slice(1) || '/')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const navigate = (to) => { window.location.hash = to }
  return { path, navigate }
}

export function AppRouter(){
  const { path } = useHashPath()
  const View = path === '/login' ? Login : path === '/register' ? Register : Home
  return <View />
}
