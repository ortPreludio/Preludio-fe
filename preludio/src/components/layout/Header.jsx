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
          {/* MODIFICACIÓN: 
            Se reemplaza el texto "Preludio" con una etiqueta <img>.
            La ruta se establece a '/assets/logo-preludio.png',
            asumiendo que está dentro de tu carpeta 'public/'.
          */}
          <Link to="/">
            <img src="./../public/assets/logo-preludio.png" alt="Logo de Preludio" className="header-logo" />
          </Link>
        </div>

        <nav className="nav">
          <NavLink to="/shows" end className="nav-link">
            Shows
          </NavLink>
          <NavLink to="/comollegar" className="nav-link">
            Cómo Llegar
          </NavLink>
          <NavLink to="/premium" className="nav-link">
            Premium
          </NavLink>
          <NavLink to="/faq" className="nav-link">
            Ayuda/FAQ
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