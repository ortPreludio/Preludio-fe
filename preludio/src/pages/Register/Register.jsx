import { useMemo, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { apiRegister } from '../../api/auth.js';
import { useAuth } from '../../store/authStore.js';
import { PasswordInput } from '../../components/atoms/PasswordInput/PasswordInput.jsx';

export function Register() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const sp = new URLSearchParams(location.search);
  const returnTo = sp.get('returnTo') && sp.get('returnTo').startsWith('/')
    ? sp.get('returnTo')
    : '/';

  const [form, setForm] = useState({
    nombre: '', apellido: '', dni: '', email: '', password: '', telefono: '', fechaNacimiento: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const maxDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const isValid =
    form.nombre.trim() &&
    form.apellido.trim() &&
    /^\d{7,10}$/.test(form.dni.trim()) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
    form.password.length >= 8 &&
    /^\d{6,15}$/.test(form.telefono.trim()) &&
    form.fechaNacimiento && form.fechaNacimiento <= maxDate;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || loading) return;
    setLoading(true); setError(null);

    const payload = {
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      dni: form.dni.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      telefono: form.telefono.trim(),
      fechaNacimiento: form.fechaNacimiento
    };

    try {
      const data = await apiRegister(payload);
      // Backend sets cookies and returns { user }
      if (data && data.user) {
        setUser(data.user);
        navigate(returnTo, { replace: true });
      } else {
        throw new Error('Respuesta del servidor inválida');
      }
    } catch (err) {
      setError(err?.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container auth-form">
        <h2>Crear cuenta</h2>
        <form onSubmit={onSubmit} noValidate>
          <div className="grid2">
            <label className="form-field"><span>Nombre</span>
              <input value={form.nombre} onChange={e => set('nombre', e.target.value)} required autoComplete="given-name" />
            </label>
            <label className="form-field"><span>Apellido</span>
              <input value={form.apellido} onChange={e => set('apellido', e.target.value)} required autoComplete="family-name" />
            </label>
          </div>

          <label className="form-field"><span>DNI</span>
            <input value={form.dni} onChange={e => set('dni', e.target.value)} required inputMode="numeric"
              pattern="^\d{7,10}$" title="Solo números, entre 7 y 10 dígitos" autoComplete="off" />
          </label>

          <label className="form-field"><span>Email</span>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required autoComplete="email" />
          </label>

          <label className="form-field">
            <span>Contraseña</span>
            <PasswordInput
              value={form.password}
              onChange={e => set('password', e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
            <small className="text-muted">Mínimo 8 caracteres.</small>
          </label>

          <label className="form-field"><span>Teléfono</span>
            <input value={form.telefono} onChange={e => set('telefono', e.target.value)} required
              type="tel" inputMode="tel" pattern="^\\d{6,15}$" title="Solo números, entre 6 y 15 dígitos"
              autoComplete="tel" />
          </label>

          <label className="form-field"><span>Fecha de nacimiento</span>
            <input type="date" value={form.fechaNacimiento} onChange={e => set('fechaNacimiento', e.target.value)}
              required max={maxDate} autoComplete="bday" />
          </label>

          {error && <div className="error" aria-live="polite">{error}</div>}

          <button className="btn btn-primary" type="submit" disabled={!isValid || loading}>
            {loading ? 'Creando…' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-muted" style={{ marginTop: 12 }}>
          ¿Ya tenés cuenta?{" "}
          <Link to={`/login?returnTo=${encodeURIComponent(returnTo)}`}>Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}
