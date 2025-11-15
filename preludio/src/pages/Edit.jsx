import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../state/auth.jsx';
import { apiUpdateProfile } from '../api/auth.js';
import { request } from '../api/client.js';
import { EventCard } from '../components/molecules/EventCard.jsx';
import EventForm from '../components/organisms/EventForm.jsx';
import UserForm from '../components/organisms/UserForm.jsx';


export function Edit() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const eventId = searchParams.get('eventId');

  const [userInitial, setUserInitial] = useState({
    nombre:'', apellido:'', dni:'', email:'', telefono:'', fechaNacimiento:''
  });
  const [eventInitial, setEventInitial] = useState(null);
  const [eventLoading, setEventLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewEvent, setPreviewEvent] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const maxDate = useMemo(() => new Date().toISOString().slice(0,10), []);

   useEffect(() => {
    // If editing an event (admin) - eventId in query param
    if (eventId) {
      setEventLoading(true);
      request(`/events/${eventId}`)
        .then(ev => {
          setEventInitial({
            titulo: ev.titulo,
            descripcion: ev.descripcion,
            categoria: ev.categoria,
            fecha: ev.fecha ? ev.fecha.slice(0,10) : '',
            hora: ev.hora,
            ubicacion: ev.ubicacion || {},
            precioBase: ev.precioBase ?? ev.precio ?? 0,
            capacidadTotal: ev.capacidadTotal ?? ev.capacidad ?? 0,
            imagen: ev.imagen || '',
            estadoPublicacion: ev.estadoPublicacion || 'PENDING',
          });
          setPreviewEvent(ev);
        })
        .catch(e => setError(e.message))
        .finally(() => setEventLoading(false));
      return;
    }

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
            fechaNacimiento: userData.fechaNacimiento ? userData.fechaNacimiento.slice(0,10) : ''
          });
        })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    } 
    // Si NO hay userId, es el usuario editando su propio perfil
    else if (user) {
      setUserInitial({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        dni: user.dni || '',
        email: user.email || '',
        telefono: user.telefono || '',
        fechaNacimiento: user.fechaNacimiento ? user.fechaNacimiento.slice(0,10) : ''
      });
    }
  }, [user, userId, eventId]);

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

  // Event submit handler (reused path)
  const onSubmitEvent = async (payload) => {
    if (!eventId) return;
    setLoading(true); setError(null);
    try {
      await request(`/events/${eventId}`, { method: 'PUT', body: payload });
      navigate('/administration?view=events');
    } catch (err) {
      setError(err?.message || 'Error al actualizar evento');
    } finally { setLoading(false); }
  };

  if (!user && !userId && !eventId) {
    navigate('/login');
    return null;
  }

  if (eventId && eventLoading) {
    return (
      <div className="page">
        <div className="loader">Cargando datos del evento…</div>
      </div>
    );
  }

  // If editing event, render EventForm
  if (eventId) {
    return (
      <div className="page">
        <div className="edit-threecol container">
          <aside className="preview-col">
            <h3>Vista previa</h3>
            {previewEvent ? <EventCard event={previewEvent} /> : <div className="loader">Cargando vista previa…</div>}
          </aside>

          <div className="form-wrap">
            <div className="container auth-form">
              <h2>Editar Evento</h2>
              {error && <div className="error" aria-live="polite">{error}</div>}
              <EventForm
                initial={eventInitial}
                onSubmit={onSubmitEvent}
                submitLabel={loading ? 'Guardando…' : 'Guardar cambios'}
                showCancel={true}
                onCancel={() => navigate('/administration?view=events')}
                onChange={setPreviewEvent}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container auth-form">
        <h2>{userId ? 'Editar Usuario' : 'Editar perfil'}</h2>
        <UserForm initial={userInitial} onSubmit={onSubmit} submitLabel={loading ? 'Guardando…' : 'Guardar cambios'} onCancel={() => navigate(userId ? '/administration' : '/profile')} />
        {error && <div className="error" aria-live="polite">{error}</div>}
        {success && <div className="success" aria-live="polite">{userId ? 'Usuario actualizado correctamente' : 'Perfil actualizado correctamente'}</div>}
      </div>
    </div>
  );
}