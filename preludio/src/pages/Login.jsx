import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { apiLogin } from '../api/auth.js';
import { useAuth } from '../state/auth.jsx';

export function Login() {
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const sp = new URLSearchParams(location.search);
  const returnTo = sp.get('returnTo') && sp.get('returnTo').startsWith('/')
    ? sp.get('returnTo')
    : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isValidPassword = password.length >= 8;
  const isValid = isValidEmail && isValidPassword;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || loading) return;
    setLoading(true); setError(null);

    try {
      const data = await apiLogin({ email: email.trim().toLowerCase(), password });
      setToken(data.token);
      setUser(data.user);
      navigate(returnTo, { replace: true });   // 👈 redirige a returnTo o '/'
    } catch (err) {
      setError(err?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container auth-form">
        <h2>Iniciar sesión</h2>
        <form onSubmit={onSubmit} noValidate>
          <label className="form-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              aria-invalid={email ? String(!isValidEmail) : undefined}
            />
          </label>

          <label className="form-field">
            <span>Contraseña</span>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="current-password"
                style={{ paddingRight: 90 }}
                aria-invalid={password ? String(!isValidPassword) : undefined}
              />
              <button
                type="button"
                className="btn btn-ghost"
                style={{ position: 'absolute', right: 4, top: 4, padding: '6px 10px' }}
                onClick={() => setShowPwd(s => !s)}
                aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPwd ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            <small className="text-muted">Mínimo 8 caracteres.</small>
          </label>

          {error && <div className="error" aria-live="polite">{error}</div>}

          <button className="btn btn-primary" type="submit" disabled={!isValid || loading}>
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <p className="text-muted" style={{ marginTop: 12 }}>
          ¿No tenés cuenta?{" "}
          <Link to={`/register?returnTo=${encodeURIComponent(returnTo)}`}>Crear cuenta</Link>
        </p>
      </div>
    </div>
  );
}
