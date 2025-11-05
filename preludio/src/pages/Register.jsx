import { useState } from 'react'
import { Header } from '../components/layout/Header.jsx'
import { authService } from '../services/authService.js'
import { useAuth } from '../context/AuthContext.jsx'

export function Register(){
  const { setToken, setUser } = useAuth()
  const [form, setForm] = useState({ nombre:'', apellido:'', dni:'', email:'', password:'', telefono:'', fechaNacimiento:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const set = (k,v)=> setForm(prev => ({...prev, [k]: v}))

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const data = await authService.register(form)
      setToken(data.token); setUser(data.user)
      window.location.hash = '/'
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <Header />
      <div className="container auth-form">
        <h2>Crear cuenta</h2>
        <form onSubmit={onSubmit}>
          <div className="grid2">
            <label className="form-field"><span>Nombre</span><input value={form.nombre} onChange={e=>set('nombre', e.target.value)} required /></label>
            <label className="form-field"><span>Apellido</span><input value={form.apellido} onChange={e=>set('apellido', e.target.value)} required /></label>
          </div>
          <label className="form-field"><span>DNI</span><input value={form.dni} onChange={e=>set('dni', e.target.value)} required /></label>
          <label className="form-field"><span>Email</span><input type="email" value={form.email} onChange={e=>set('email', e.target.value)} required /></label>
          <label className="form-field"><span>Contraseña</span><input type="password" value={form.password} onChange={e=>set('password', e.target.value)} required /></label>
          <label className="form-field"><span>Teléfono</span><input value={form.telefono} onChange={e=>set('telefono', e.target.value)} required /></label>
          <label className="form-field"><span>Fecha de nacimiento</span><input type="date" value={form.fechaNacimiento} onChange={e=>set('fechaNacimiento', e.target.value)} required /></label>
          {error && <div className="error">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Creando...' : 'Crear cuenta'}</button>
        </form>
        <p className="text-muted">¿Ya tenés cuenta? <a href="#/login">Iniciar sesión</a></p>
      </div>
    </div>
  )
}
