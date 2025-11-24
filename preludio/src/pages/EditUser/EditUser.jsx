import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../state/authHook.js';
import { apiUpdateProfile } from '../../api/auth.js';
import { request } from '../../api/client.js';
import UserForm from '../../components/organisms/UserForm/UserForm.jsx';

export function EditUser() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // "id" will be the userId if present (admin route)

  // If accessing via /users/edit/:id, we have an ID.
  // If accessing via /profile/edit, we don't have an ID, so we edit "me".
  const userId = id;

  const [userInitial, setUserInitial] = useState({
    nombre: '', apellido: '', dni: '', email: '', telefono: '', fechaNacimiento: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Si hay userId en la URL (admin editando otro usuario)
    if (userId) {
      setLoading(true);

      request(`/users/${userId}`)
        .then(userData => {
          setUserInitial({
            nombre: userData.nombre || '',
            apellido: userData.apellido || '',
            dni: userData.dni || '',
            email: userData.email || '',
            telefono: userData.telefono || '',
            fechaNacimiento: userData.fechaNacimiento ? userData.fechaNacimiento.slice(0, 10) : '',
            rol: userData.rol || ''
          });
        })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    }
    // Si NO hay userId, es el usuario editando su propio perfil -> fetch authoritative data
    else if (user) {
      setLoading(true);
      request('/users/me')
        .then(userData => {
          // userData might be { user: { ... } } or a raw user depending on API shape
          const u = userData?.user || userData;
          setUserInitial({
            nombre: u.nombre || '',
            apellido: u.apellido || '',
            dni: u.dni || '',
            email: u.email || '',
            telefono: u.telefono || '',
            fechaNacimiento: u.fechaNacimiento ? u.fechaNacimiento.slice(0, 10) : '',
            rol: u.rol || ''
          });
        })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [user, userId]);

  // submit handler for user edits (called by UserForm)
  const onSubmit = async (payload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // Si hay userId, el admin está editando otro usuario
      if (userId) {
        await request(`/users/${userId}`, { method: 'PUT', body: payload });
        setSuccess(true);
        setTimeout(() => navigate('/administration'), 2000);
      } else {
        // Si NO hay userId, es el usuario editando su propio perfil
        const data = await apiUpdateProfile(payload);
        setUser(data.user);
        setSuccess(true);
        setTimeout(() => navigate('/profile'), 2000);
      }
    } catch (err) {
      setError(err?.message || 'Error al actualizar el perfil');
    } finally { setLoading(false); }
  };

  // Guard: if trying to edit another user by id, only allow ADMINs.
  if (userId && (!user || user.rol !== 'ADMIN')) {
    return <Navigate to="/forbidden" replace />;
  }

  if (!user && !userId) {
    navigate('/login');
    return null;
  }

  return (
    <div className="page">
      <div className="container auth-form">
        <h2>{userId ? 'Editar Usuario' : 'Editar perfil'}</h2>
        {/* If editing own profile as non-admin, restrict editable fields to email and telefono only */}
        {
          (() => {
            const isAdmin = !!(user && user.rol === 'ADMIN');
            // Non-admin owners may only edit email and telefono
            const disabled = (!userId && user && !isAdmin) ? ['nombre', 'apellido', 'dni', 'fechaNacimiento', 'rol'] : [];
            // If admin is editing another user, allow editing role and provide role options
            const roles = (userId && isAdmin) ? ['ADMIN', 'USUARIO'] : [];
            return (
              <UserForm
                initial={userInitial}
                onSubmit={onSubmit}
                submitLabel={loading ? 'Guardando…' : 'Guardar cambios'}
                onCancel={() => navigate(userId ? '/administration' : '/profile')}
                disabledFields={disabled}
                roles={roles}
              />
            );
          })()
        }
        {error && <div className="error" aria-live="polite">{error}</div>}
        {success && <div className="success" aria-live="polite">{userId ? 'Usuario actualizado correctamente' : 'Perfil actualizado correctamente'}</div>}
      </div>
    </div>
  );
}