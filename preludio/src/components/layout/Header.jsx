import { useAuth } from '../../context/AuthContext.jsx'

export function Header(){
  const { user, logout } = useAuth()
  return (
    <header className="site-header">
      <div className="container">
        <div className="brand"><a href="#/">Preludio</a></div>
        <nav className="nav"><a href="#/" className="nav-link">Shows</a></nav>
        <div className="actions">
          {user ? (
            <>
              <span className="welcome">Hola, {user.nombre}</span>
              <a className="btn btn-ghost" href="#/" onClick={(e)=>{e.preventDefault(); logout();}}>Cerrar sesión</a>
            </>
          ) : (
            <>
              <a className="btn btn-ghost" href="#/login">Iniciar sesión</a>
              <a className="btn btn-primary" href="#/register">Crear cuenta</a>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
