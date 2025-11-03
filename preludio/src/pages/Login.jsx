import { useState } from 'react'
import { apiLogin } from '../api/auth.js'
import { useAuth } from '../state/auth.jsx'
import { Header } from '../components/layout/Header.jsx'

export function Login() {
  const { setToken, setUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const data = await apiLogin({ email, password })
      setToken(data.token); setUser(data.user)
      window.location.hash = '/'
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <Header />
      <div className="container auth-form">
        <h2>Iniciar sesión</h2>
        <form onSubmit={onSubmit}>
          <label className="form-field"><span>Email</span>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email" />
          </label>
          <label className="form-field"><span>Contraseña</span>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password" />
          </label>
          {error && <div className="error">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
        </form>
        <p className="text-muted">¿No tenés cuenta? <a href="#/register">Crear cuenta</a></p>
      </div>
    </div>
  )
}
