import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { request } from '../../api/client.js';
import { Section } from '../../components/layout/Section/Section.jsx';
import { EventCard } from '../../components/molecules/EventCard/EventCard.jsx';

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        request(`/events/${id}`)
            .then(data => setEvent(data))
            .catch(e => setError(e.message || 'Error al cargar evento'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="page"><div className="loader">Cargando evento…</div></div>;
    if (error) return <div className="page"><div className="error">{error}</div></div>;
    if (!event) return <div className="page"><div className="error">Evento no encontrado</div></div>;

    return (
        <div className="page">
            <div className="container auth-form" style={{ maxWidth: '800px' }}>
                <h2>Detalles del Evento</h2>
                <div className="grid2" style={{ alignItems: 'start' }}>
                    <div>
                        <EventCard event={event} />
                    </div>
                    <div className="profile-card">
                        <p><strong>ID:</strong> {event._id || event.id || event.uuid}</p>
                        <p><strong>Título:</strong> {event.titulo}</p>
                        <p><strong>Categoría:</strong> {event.categoria}</p>
                        <p><strong>Estado:</strong> {event.estadoPublicacion}</p>
                        <p><strong>Precio Base:</strong> ${event.precioBase ?? event.precio ?? 0}</p>
                        <p><strong>Capacidad:</strong> {event.capacidadTotal ?? event.capacidad ?? 0}</p>
                        <p><strong>Butacas disponibles:</strong> {event.entradasDisponibles ?? event.ticketsDisponibles ?? 0}</p>
                        <p><strong>Ubicación:</strong> {event.ubicacion ? `${event.ubicacion.lugar}, ${event.ubicacion.ciudad}` : '—'}</p>
                        <p><strong>Descripción:</strong></p>
                        <p className="text-muted" style={{ fontSize: '0.9em' }}>{event.descripcion}</p>

                        <div style={{ marginTop: 20, display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-ghost" onClick={() => navigate('/administration?view=events')}>Volver</button>
                            <button className="btn btn-primary" onClick={() => navigate(`/events/edit/${id}`)}>Editar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
