import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventForm from '../../components/organisms/EventForm/EventForm.jsx';
import { request } from '../../api/client.js';

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    request(`/events/${id}`)
      .then(data => {
        const payload = {
          titulo: data.titulo,
          descripcion: data.descripcion,
          categoria: data.categoria,
          fecha: data.fecha ? data.fecha.slice(0,10) : '',
          hora: data.hora,
          ubicacion: data.ubicacion || {},
          precioBase: data.precioBase ?? data.precio ?? 0,
          capacidadTotal: data.capacidadTotal ?? data.capacidad ?? 0,
          imagen: data.imagen || '',
          estadoPublicacion: data.estadoPublicacion || 'PENDING',
        };
        setInitial(payload);
      })
      .catch(e => setError(e.message || 'Error cargando evento'))
      .finally(() => setLoading(false));
  }, [id]);

  const onSubmit = async (payload) => {
    setSaving(true); setError(null);
    try {
      await request(`/events/${id}`, { method: 'PUT', body: payload });
      navigate('/administration');
    } catch (err) {
      setError(err.message || 'Error guardando evento');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="page"><div className="loader">Cargando evento…</div></div>;

  return (
    <div className="page">
      <div className="container auth-form">
        <h2>Editar Evento</h2>
        {error && <div className="error">{error}</div>}
        <EventForm initial={initial} onSubmit={onSubmit} submitLabel={saving ? 'Guardando…' : 'Guardar cambios'} />
      </div>
    </div>
  );
}
