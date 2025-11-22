import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../../../state/auth.jsx";
import { useState } from "react";
import "../../../styles/index.css";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/");
    setIsProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <header className="site-header">
      <div className="container">
        <div className="brand">
          <Link to="/" onClick={() => setIsProfileDropdownOpen(false)}>
            <img src="/assets/logo-preludio.png" alt="Logo de Preludio" className="header-logo" />
          </Link>
        </div>

        {/* NAV LIMPIO */}
        <nav className="nav">
          <NavLink to="/" end className="nav-link" onClick={() => setIsProfileDropdownOpen(false)}>Inicio</NavLink>
          <NavLink to="/shows" className="nav-link" onClick={() => setIsProfileDropdownOpen(false)}>Shows</NavLink>
          <NavLink to="/comollegar" className="nav-link" onClick={() => setIsProfileDropdownOpen(false)}>Cómo Llegar</NavLink>
          <NavLink to="/premium" className="nav-link" onClick={() => setIsProfileDropdownOpen(false)}>Premium</NavLink>
          <NavLink to="/faq" className="nav-link" onClick={() => setIsProfileDropdownOpen(false)}>Ayuda/FAQ</NavLink>
        </nav>

        <div className="actions">
          {user ? (
            <div className="profile-menu">
              <div
                className="profile-icon"
                onClick={toggleProfileDropdown}
                role="button"
              >
                <img
                  src="/assets/icon-user.png"
                  alt="Perfil"
                  className="profile-avatar"
                />
              </div>
              <div className={`profile-dropdown ${isProfileDropdownOpen ? "is-open" : ""}`}>
                <p className="dropdown-welcome"> Hola, {user.nombre} </p>
                <NavLink to="/profile" className="dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
                  Perfil
                </NavLink>

                <NavLink to="/mistickets" className="dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
                  Mis Tickets
                </NavLink>

                <NavLink to="/perfil/cambiar-password" className="dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
                  Cambiar contraseña
                </NavLink>

                <button className="dropdown-item logout" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login">Iniciar sesión</Link>
              <Link className="btn btn-primary" to="/register">Crear cuenta</Link>
            </>
          )}

          {user?.rol === "ADMIN" && (
            <Link className="btn btn-ghost" to="/administration" onClick={() => setIsProfileDropdownOpen(false)}>
              Administration
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
