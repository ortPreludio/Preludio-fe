import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMyTickets } from '../../lib/services/tickets.service';
import { Section } from '../../components/layout/Section/Section';
import QRCode from "react-qr-code";
import './EventTickets.css';

export function EventTickets() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetchMyTickets()
            .then(allTickets => {
                // Filter tickets for this event
                const eventTickets = allTickets.filter(
                    t => t.evento && t.evento._id === eventId
                );
                setTickets(eventTickets);

                if (eventTickets.length === 0) {
                    setError('No se encontraron tickets para este evento');
                }
            })
            .catch(e => setError(e.message || 'Error al cargar los tickets'))
            .finally(() => setLoading(false));
    }, [eventId]);

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % tickets.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + tickets.length) % tickets.length);
    };

    if (loading) return <div className="page"><div className="loader">Cargando tickets…</div></div>;
    if (error) return <div className="page"><div className="error">{error}</div></div>;
    if (tickets.length === 0) return <div className="page"><div className="error">No hay tickets disponibles</div></div>;

    const currentTicket = tickets[currentIndex];
    const evento = currentTicket.evento;

    const fechaEvento = new Date(evento.fecha).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const fechaCompra = new Date(currentTicket.createdAt || currentTicket.fechaCompra).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="page event-tickets-page">
            <Section>
                {/* Ticket Counter */}
                <div className="event-tickets__header">
                    <button onClick={() => navigate('/mistickets')} className="btn btn-ghost">
                        ← Volver a Mis Tickets
                    </button>
                    <div className="event-tickets__counter">
                        Ticket {currentIndex + 1} de {tickets.length}
                    </div>
                </div>

                {/* Carousel Container */}
                <div className="event-tickets__carousel">
                    {tickets.length > 1 && (
                        <button
                            className="carousel-arrow carousel-arrow--left"
                            onClick={goToPrevious}
                            aria-label="Ticket anterior"
                        >
                            ❮
                        </button>
                    )}

                    {/* Ticket Display */}
                    <div className="ticket-container">
                        {/* Header */}
                        <div className="ticket-header" style={{ backgroundImage: `url(${evento.imagen || '/placeholder.png'})` }}>
                            <div className="ticket-header-overlay">
                                <h1 className="ticket-event-title">{evento.titulo}</h1>
                                <div className="ticket-event-meta">
                                    <span>📅 {fechaEvento}</span>
                                    <span>📍 {evento.ubicacion?.lugar}</span>
                                </div>
                            </div>
                        </div>

                        <div className="ticket-body">
                            {/* Left Column: Info */}
                            <div className="ticket-info-column">
                                <div className="ticket-section">
                                    <h3 className="ticket-section-title">Información del Ticket</h3>
                                    <div className="ticket-data-grid">
                                        <div className="ticket-data-item">
                                            <span className="label">Tipo de Entrada</span>
                                            <span className="value highlight">{currentTicket.tipoEntrada || 'General'}</span>
                                        </div>
                                        <div className="ticket-data-item">
                                            <span className="label">Estado</span>
                                            <span className={`status-badge status-${currentTicket.estado?.toLowerCase()}`}>
                                                {currentTicket.estado || 'ACTIVO'}
                                            </span>
                                        </div>
                                        <div className="ticket-data-item">
                                            <span className="label">ID del Ticket</span>
                                            <span className="value code">{currentTicket._id}</span>
                                        </div>
                                        <div className="ticket-data-item">
                                            <span className="label">Precio</span>
                                            <span className="value">${currentTicket.precioPagado?.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="ticket-section">
                                    <h3 className="ticket-section-title">Datos del Comprador</h3>
                                    <div className="ticket-data-grid">
                                        <div className="ticket-data-item">
                                            <span className="label">Nombre</span>
                                            <span className="value">{currentTicket.comprador?.nombre} {currentTicket.comprador?.apellido}</span>
                                        </div>
                                        <div className="ticket-data-item">
                                            <span className="label">Email</span>
                                            <span className="value">{currentTicket.comprador?.email}</span>
                                        </div>
                                        <div className="ticket-data-item">
                                            <span className="label">Fecha de Compra</span>
                                            <span className="value">{fechaCompra}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: QR */}
                            <div className="ticket-qr-column">
                                <div className="qr-card">
                                    <h3 className="ticket-section-title">Código QR</h3>
                                    <div className="qr-wrapper">
                                        <QRCode
                                            value={currentTicket.codigoQR}
                                            size={180}
                                        />
                                    </div>
                                    <p className="qr-instruction">Presenta este código al ingresar</p>
                                    <p className="qr-id-ref">{currentTicket._id}</p>
                                </div>
                            </div>
                        </div>

                        <div className="ticket-footer">
                            <button className="btn btn-ghost" onClick={() => navigate('/mistickets')}>
                                ← Volver
                            </button>
                            <button className="btn btn-primary" onClick={() => window.print()}>
                                🖨️ Imprimir
                            </button>
                        </div>
                    </div>

                    {tickets.length > 1 && (
                        <button
                            className="carousel-arrow carousel-arrow--right"
                            onClick={goToNext}
                            aria-label="Ticket siguiente"
                        >
                            ❯
                        </button>
                    )}
                </div>

                {/* Dots Indicator */}
                {tickets.length > 1 && (
                    <div className="event-tickets__dots">
                        {tickets.map((_, index) => (
                            <button
                                key={index}
                                className={`dot ${index === currentIndex ? 'dot--active' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                                aria-label={`Ir al ticket ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </Section>
        </div>
    );
}
