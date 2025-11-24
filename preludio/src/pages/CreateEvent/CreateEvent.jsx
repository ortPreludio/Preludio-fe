import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { request } from '../../lib/infra/http-client.js';
import { EventCard } from '../../components/molecules/Cards/EventCard/EventCard.jsx';
import EventForm from '../../components/organisms/EventForm/EventForm.jsx';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewEvent, setPreviewEvent] = useState(null);
  const initialValues = useMemo(() => ({}), []);

  const onSubmit = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      await request('/events', { method: 'POST', body: payload });
      navigate('/administration?view=events');
    } catch (err) {
      setError(err?.message || 'Error creando evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="edit-threecol container">
        <aside className="preview-col">
          <h3>Vista previa</h3>
          {previewEvent ? (
            <EventCard event={previewEvent} />
          ) : (
            <div className="loader">Complete el formulario para ver la vista previa</div>
          )}
        </aside>

        <div className="form-wrap">
          <div className="container auth-form">
            <h2>Crear Evento</h2>
            {error && <div className="error" aria-live="polite">{error}</div>}
            <EventForm
              initial={initialValues}
              onSubmit={onSubmit}
              submitLabel={loading ? 'Creando…' : 'Crear Evento'}
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
