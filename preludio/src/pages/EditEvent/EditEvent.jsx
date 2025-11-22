import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventForm from '../../components/organisms/EventForm/EventForm.jsx';
import { EventCard } from '../../components/molecules/EventCard/EventCard.jsx';
import { request } from '../../api/client.js';

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [previewEvent, setPreviewEvent] = useState(null);

  useEffect(() => {
    setLoading(true);
    request(`/events/${id}`)
      .then(data => {
        const payload = {
          titulo: data.titulo,
          descripcion: data.descripcion,
          categoria: data.categoria,
          fecha: data.fecha ? data.fecha.slice(0, 10) : '',
          hora: data.hora,
          ubicacion: data.ubicacion || {},
          precioBase: data.precioBase ?? data.precio ?? 0,
          capacidadTotal: data.capacidadTotal ?? data.capacidad ?? 0,
          imagen: data.imagen || '',
          estadoPublicacion: data.estadoPublicacion || 'PENDING',
        };
        setInitial(payload);
        setPreviewEvent(data);
      })
      .catch(e => setError(e.message || 'Error cargando evento'))
      .finally(() => setLoading(false));
  }, [id]);

  const onSubmit = async (payload) => {
    setSaving(true); setError(null);
    try {
      await request(`/events/${id}`, { method: 'PUT', body: payload });
      navigate('/administration?view=events');
    } catch (err) {
      setError(err.message || 'Error guardando evento');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="page"><div className="loader">Cargando evento…</div></div>;

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
            {error && <div className="error">{error}</div>}
            <EventForm
              initial={initial}
              onSubmit={onSubmit}
              submitLabel={saving ? 'Guardando…' : 'Guardar cambios'}
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
