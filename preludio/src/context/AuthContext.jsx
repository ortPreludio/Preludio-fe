import { createContext, useContext, useEffect, useState } from 'react'

const AuthCtx = createContext(null)

export function AuthProvider({ children }){
  const [token, setToken] = useState(()=> localStorage.getItem('jwt') || null)
  const [user, setUser] = useState(()=> {
    try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null }
  })

  useEffect(()=>{
    token ? localStorage.setItem('jwt', token) : localStorage.removeItem('jwt')
  }, [token])
  useEffect(()=>{
    user ? localStorage.setItem('user', JSON.stringify(user)) : localStorage.removeItem('user')
  }, [user])

  const logout = () => { setToken(null); setUser(null) }

  return <AuthCtx.Provider value={{ token, setToken, user, setUser, logout }}>{children}</AuthCtx.Provider>
}

export function useAuth(){ return useContext(AuthCtx) }
