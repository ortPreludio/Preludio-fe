import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../state/auth.jsx";
import "../../styles/index.css";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="container">
        <div className="brand">
          <Link to="/">Preludio</Link>
        </div>

        <nav className="nav">
          <NavLink to="/shows" end className="nav-link">
            Shows
          </NavLink>
        </nav>

        <div className="actions">
          {user ? (
            <>
              <span className="welcome">Hola, {user.nombre} ({user.rol}) </span>
              <button className="btn btn-ghost" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login">
                Iniciar sesión
              </Link>
              <Link className="btn btn-primary" to="/register">
                Crear cuenta
              </Link>
            </>
          )}
          <nav className="Administration">
            {user?.rol === "ADMIN" && (
              <Link className="btn btn-ghost" to="/administration">
                Administration
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
