import { useAuth } from '../../context/AuthContext.jsx';
import { Link } from '../../router/index.jsx';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="container">
        <div className="brand">
          <Link to="/">Preludio</Link>
        </div>

        <nav className="nav">
          <Link className="nav-link" to="/">Shows</Link>
        </nav>

        <div className="actions">
          {user ? (
            <>
              <span className="welcome">Hola, {user.nombre}</span>
              <a
                className="btn btn-ghost"
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              >
                Cerrar sesión
              </a>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login">Iniciar sesión</Link>
              <Link className="btn btn-primary" to="/register">Crear cuenta</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
