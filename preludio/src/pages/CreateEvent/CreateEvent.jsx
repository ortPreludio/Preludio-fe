import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventForm from '../../components/organisms/EventForm/EventForm.jsx';
import { request } from '../../api/client.js';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (payload) => {
    setLoading(true); setError(null);
    try {
      await request('/events', { method: 'POST', body: payload });
      navigate('/administration');
    } catch (err) {
      setError(err.message || 'Error creando evento');
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="container auth-form">
        <h2>Crear Evento</h2>
        {error && <div className="error">{error}</div>}
        <EventForm onSubmit={onSubmit} submitLabel={loading ? 'Creando…' : 'Crear Evento'} />
      </div>
    </div>
  );
}
