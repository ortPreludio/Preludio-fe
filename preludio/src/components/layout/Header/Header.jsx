import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../state/authHook.js";
import { useState, useEffect } from "react";
import "./Header.css";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // estado para el menú celu
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false); // estado para el submenú del perfil en celu

  // bloquear el scroll del body cuando el menú movil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMobileMenuOpen]);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/");
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileProfileOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileProfile = () => {
    setIsMobileProfileOpen(!isMobileProfileOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setIsMobileProfileOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container">
        {/*BOTÓN HAMBURGUESA*/}
        <button
          className="hamburger-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </button>

        <div className="brand">
          <Link to="/" onClick={closeMobileMenu}>
            <img src="/assets/logo-preludio.png" alt="Logo de Preludio" className="header-logo" />
          </Link>
        </div>

        {/* NAV - Desktop y Mobile */}
        <nav className={`nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
          <NavLink to="/" end className="nav-link" onClick={closeMobileMenu}>Inicio</NavLink>
          <NavLink to="/shows" className="nav-link" onClick={closeMobileMenu}>Shows</NavLink>
          <NavLink to="/comollegar" className="nav-link" onClick={closeMobileMenu}>Cómo Llegar</NavLink>
          <NavLink to="/premium" className="nav-link" onClick={closeMobileMenu}>Premium</NavLink>
          <NavLink to="/faq" className="nav-link" onClick={closeMobileMenu}>Ayuda/FAQ</NavLink>

          {/* ACCIONES DENTRO DEL MENÚ MOBILE */}
          <div className="nav-actions-mobile">
            {user ? (
              <>
                {/* Botón colapsable "Perfil" */}
                <button
                  className={`mobile-profile-toggle ${isMobileProfileOpen ? 'open' : ''}`}
                  onClick={toggleMobileProfile}
                >
                  <span>Perfil</span>
                  <span className="arrow">{isMobileProfileOpen ? '▲' : '▼'}</span>
                </button>

                {/* Submenú del perfil */}
                <div className={`mobile-profile-submenu ${isMobileProfileOpen ? 'open' : ''}`}>
                  <p className="mobile-welcome">Hola, {user.nombre}</p>
                  <NavLink to="/profile" className="nav-link submenu-link" onClick={closeMobileMenu}>
                    Perfil
                  </NavLink>
                  <NavLink to="/mistickets" className="nav-link submenu-link" onClick={closeMobileMenu}>
                    Mis Tickets
                  </NavLink>
                  <NavLink to="/perfil/cambiar-password" className="nav-link submenu-link" onClick={closeMobileMenu}>
                    Cambiar contraseña
                  </NavLink>
                  <button className="nav-link logout-mobile" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </div>

                {user?.rol === "ADMIN" && (
                  <NavLink to="/administration" className="nav-link" onClick={closeMobileMenu}>
                    Administration
                  </NavLink>
                )}
              </>
            ) : (
              <>
                <Link className="btn btn-ghost btn-mobile" to="/login" onClick={closeMobileMenu}>
                  Iniciar sesión
                </Link>
                <Link className="btn btn-primary btn-mobile" to="/register" onClick={closeMobileMenu}>
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* ACCIONES DESKTOP (ocultas en mobile) */}
        <div className="actions actions-desktop">
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

      {/* OVERLAY para cerrar el menú mobile al hacer click fuera */}
      <div
        className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      />
    </header>
  );
}
