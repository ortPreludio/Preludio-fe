import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../state/auth.jsx';
import { apiUpdateProfile } from '../api/auth.js';
import { request } from '../api/client.js'; // 👈 Agregá este import


export function Edit() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId'); // 👈 Obtener userId de la URL

  const [form, setForm] = useState({
    nombre:'', apellido:'', dni:'', email:'', telefono:'', fechaNacimiento:''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const maxDate = useMemo(() => new Date().toISOString().slice(0,10), []);
  const set = (k,v)=> setForm(prev=>({...prev,[k]:v}));

   useEffect(() => {
    // Si hay userId en la URL (admin editando otro usuario)
    if (userId) {
      setLoading(true);
      
      request(`/users/${userId}`)
        .then(userData => {
          setForm({
            nombre: userData.nombre || '',
            apellido: userData.apellido || '',
            dni: userData.dni || '',
            email: userData.email || '',
            telefono: userData.telefono || '',
            fechaNacimiento: userData.fechaNacimiento ? userData.fechaNacimiento.slice(0,10) : ''
          });
        })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    } 
    // Si NO hay userId, es el usuario editando su propio perfil
    else if (user) {
      setForm({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        dni: user.dni || '',
        email: user.email || '',
        telefono: user.telefono || '',
        fechaNacimiento: user.fechaNacimiento ? user.fechaNacimiento.slice(0,10) : ''
      });
    }
  }, [user, userId]);

  const isValid =
    form.nombre.trim() &&
    form.apellido.trim() &&
    /^\d{7,10}$/.test(form.dni.trim()) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
    /^\d{6,15}$/.test(form.telefono.trim()) &&
    form.fechaNacimiento && form.fechaNacimiento <= maxDate;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || loading) return;
    setLoading(true); 
    setError(null);
    setSuccess(false);

    const payload = {
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      dni: form.dni.trim(),
      email: form.email.trim().toLowerCase(),
      telefono: form.telefono.trim(),
      fechaNacimiento: form.fechaNacimiento
    };

    try {
      // Si hay userId, el admin está editando otro usuario
      if (userId) {
        // 👇 Usá request en lugar de fetch
        await request(`/users/${userId}`, {
          method: 'PUT',
          body: payload
        });
        
        setSuccess(true);
        setTimeout(() => navigate('/administration'), 2000);
      } 
      // Si NO hay userId, es el usuario editando su propio perfil
      else {
        const data = await apiUpdateProfile(payload);
        setUser(data.user);
        setSuccess(true);
        setTimeout(() => navigate('/profile'), 2000);
      }
    } catch (err) {
      setError(err?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!user && !userId) {
    navigate('/login');
    return null;
  }

  if (loading && userId) {
    return (
      <div className="page">
        <div className="loader">Cargando datos del usuario…</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container auth-form">
        <h2>{userId ? 'Editar Usuario' : 'Editar perfil'}</h2>
        <form onSubmit={onSubmit} noValidate>
          <div className="grid2">
            <label className="form-field"><span>Nombre</span>
              <input value={form.nombre} onChange={e=>set('nombre',e.target.value)} required autoComplete="given-name" />
            </label>
            <label className="form-field"><span>Apellido</span>
              <input value={form.apellido} onChange={e=>set('apellido',e.target.value)} required autoComplete="family-name" />
            </label>
          </div>

          <label className="form-field"><span>DNI</span>
            <input value={form.dni} onChange={e=>set('dni',e.target.value)} required inputMode="numeric"
                   pattern="^\\d{7,10}$" title="Solo números, entre 7 y 10 dígitos" autoComplete="off" />
          </label>

          <label className="form-field"><span>Email</span>
            <input type="email" value={form.email} onChange={e=>set('email',e.target.value)} required autoComplete="email" />
          </label>

          <label className="form-field"><span>Teléfono</span>
            <input value={form.telefono} onChange={e=>set('telefono',e.target.value)} required
                   type="tel" inputMode="tel" pattern="^\\d{6,15}$" title="Solo números, entre 6 y 15 dígitos"
                   autoComplete="tel" />
          </label>

          <label className="form-field"><span>Fecha de nacimiento</span>
            <input type="date" value={form.fechaNacimiento} onChange={e=>set('fechaNacimiento',e.target.value)}
                   required max={maxDate} autoComplete="bday" />
          </label>

          {error && <div className="error" aria-live="polite">{error}</div>}
          {success && <div className="success" aria-live="polite">{userId ? 'Usuario actualizado correctamente' : 'Perfil actualizado correctamente'}</div>}

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" type="submit" disabled={!isValid || loading}>
              {loading ? 'Guardando…' : 'Guardar cambios'}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => navigate(userId ? '/administration' : '/profile')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}