import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { request } from '../../lib/infra/http-client.js';
import { useAuth } from '../../store/authStore.js';
import { formatDateISOToLong } from '../../utils/format.js';
import './EventDetails.css';

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isAdmin = user?.rol === 'ADMIN';

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

    const image = event.imagen || '/placeholder.png';
    const fecha = formatDateISOToLong(event.fecha);
    const ubicacion = event.ubicacion
        ? `${event.ubicacion.lugar}, ${event.ubicacion.ciudad}, ${event.ubicacion.provincia}`
        : '—';

    return (
        <div className="event-detail-page">
            {/* Hero Banner with Image */}
            <div className="event-hero">
                <div className="event-hero__background" style={{ backgroundImage: `url(${image})` }} />
                <div className="event-hero__overlay">
                    <div className="event-hero__content container">
                        <div className="event-hero__image-wrapper">
                            <img src={image} alt={event.titulo} className="event-hero__image" />
                        </div>
                        <div className="event-hero__info">
                            <h1 className="event-hero__title">{event.titulo}</h1>
                            <div className="event-hero__meta">
                                <span className="event-hero__category">{event.categoria}</span>
                                {isAdmin && <span className="event-hero__status">{event.estadoPublicacion}</span>}
                            </div>
                            <div className="event-hero__details">
                                <div className="event-detail-item">
                                    <span className="event-detail-icon">📅</span>
                                    <div>
                                        <div className="event-detail-label">Fecha y hora</div>
                                        <div className="event-detail-value">{fecha}{event.hora ? ` • ${event.hora} hs` : ''}</div>
                                    </div>
                                </div>
                                <div className="event-detail-item">
                                    <span className="event-detail-icon">📍</span>
                                    <div>
                                        <div className="event-detail-label">Ubicación</div>
                                        <div className="event-detail-value">{ubicacion}</div>
                                    </div>
                                </div>
                                <div className="event-detail-item">
                                    <span className="event-detail-icon">💰</span>
                                    <div>
                                        <div className="event-detail-label">Precio desde</div>
                                        <div className="event-detail-value">${event.precioBase ?? event.precio ?? 0}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Information Section */}
            <div className="event-content container">
                <div className="event-content__main">
                    <section className="event-section">
                        <h2>Descripción del Evento</h2>
                        <p className="event-description">{event.descripcion || 'Sin descripción disponible.'}</p>
                    </section>

                    {isAdmin && (
                        <section className="event-section">
                            <h2>Información Administrativa</h2>
                            <div className="admin-info-grid">
                                <div className="admin-info-item">
                                    <span className="admin-info-label">ID:</span>
                                    <span className="admin-info-value">{event._id || event.id || event.uuid}</span>
                                </div>
                                <div className="admin-info-item">
                                    <span className="admin-info-label">Capacidad Total:</span>
                                    <span className="admin-info-value">{event.capacidadTotal ?? event.capacidad ?? 0}</span>
                                </div>
                                <div className="admin-info-item">
                                    <span className="admin-info-label">Entradas Disponibles:</span>
                                    <span className="admin-info-value">{event.entradasDisponibles ?? event.ticketsDisponibles ?? 0}</span>
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar with CTA */}
                <aside className="event-sidebar">
                    <div className="event-cta-card">
                        <div className="event-cta-price">
                            <span className="event-cta-price-label">Desde</span>
                            <span className="event-cta-price-value">${event.precioBase ?? event.precio ?? 0}</span>
                        </div>
                        <button
                            onClick={() => navigate(`/checkout?evento=${id}`)}
                            className="btn btn-primary btn-block"
                        >
                            Comprar Entradas
                        </button>
                        <div className="event-cta-actions">
                            <button className="btn btn-ghost btn-block" onClick={() => navigate(-1)}>
                                ← Volver
                            </button>
                            {isAdmin && (
                                <button className="btn btn-primary btn-block" onClick={() => navigate(`/events/edit/${id}`)}>
                                    ✏️ Editar Evento
                                </button>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
