import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTicketById } from '../../lib/services/tickets.service';
import { Section } from '../../components/layout/Section/Section';
import './TicketDetail.css';

export function TicketDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetchTicketById(id)
            .then(data => setTicket(data))
            .catch(e => setError(e.message || 'Error al cargar el ticket'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="page"><div className="loader">Cargando ticket…</div></div>;
    if (error) return <div className="page"><div className="error">{error}</div></div>;
    if (!ticket) return <div className="page"><div className="error">Ticket no encontrado</div></div>;

    const fechaEvento = new Date(ticket.evento?.fecha).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    const fechaCompra = new Date(ticket.createdAt || ticket.fechaCompra).toLocaleDateString('es-ES');

    return (
        <div className="page">
            <Section title="Detalles del Ticket">
                <div className="ticket-detail">
                    <div className="ticket-detail__header">
                        <div className="ticket-detail__image-wrapper">
                            {ticket.evento?.imagen && (
                                <img
                                    src={ticket.evento.imagen}
                                    alt={ticket.evento.titulo}
                                    className="ticket-detail__image"
                                />
                            )}
                        </div>
                        <div className="ticket-detail__info">
                            <h1 className="ticket-detail__title">{ticket.evento?.titulo || 'Evento'}</h1>
                            <span className={`ticket-detail__status ticket-detail__status--${ticket.estado?.toLowerCase() || 'activo'}`}>
                                {ticket.estado || 'ACTIVO'}
                            </span>
                        </div>
                    </div>

                    <div className="ticket-detail__body">
                        <div className="ticket-detail__section">
                            <h3 className="ticket-detail__section-title">Información del Evento</h3>
                            <div className="ticket-detail__grid">
                                <div className="ticket-detail__item">
                                    <span className="ticket-detail__label">📅 Fecha:</span>
                                    <span className="ticket-detail__value">{fechaEvento}</span>
                                </div>
                                <div className="ticket-detail__item">
                                    <span className="ticket-detail__label">🕐 Hora:</span>
                                    <span className="ticket-detail__value">{ticket.evento?.hora || '—'}</span>
                                </div>
                                <div className="ticket-detail__item">
                                    <span className="ticket-detail__label">📍 Lugar:</span>
                                    <span className="ticket-detail__value">
                                        {ticket.evento?.ubicacion?.lugar || '—'}
                                    </span>
                                </div>
                                <div className="ticket-detail__item">
                                    <span className="ticket-detail__label">🏙️ Ciudad:</span>
                                    <span className="ticket-detail__value">
                                        {ticket.evento?.ubicacion?.ciudad || '—'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="ticket-detail__section">
                            <h3 className="ticket-detail__section-title">Información del Ticket</h3>
                            <div className="ticket-detail__grid">
                                <div className="ticket-detail__item">
                                    <span className="ticket-detail__label">🎫 Tipo de entrada:</span>
                                    <span className="ticket-detail__value">{ticket.tipoEntrada || 'General'}</span>
                                </div>
                                <div className="ticket-detail__item">
                                    <span className="ticket-detail__label">💰 Precio pagado:</span>
                                    <span className="ticket-detail__value">${ticket.precioPagado?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="ticket-detail__item">
                                    <span className="ticket-detail__label">📅 Fecha de compra:</span>
                                    <span className="ticket-detail__value">{fechaCompra}</span>
                                </div>
                                <div className="ticket-detail__item">
                                    <span className="ticket-detail__label">🆔 ID del ticket:</span>
                                    <span className="ticket-detail__value ticket-detail__value--code">{ticket._id}</span>
                                </div>
                            </div>
                        </div>

                        {/* QR Code Section */}
                        <div className="ticket-detail__qr-section">
                            <h3 className="ticket-detail__section-title">Código QR</h3>
                            <div className="ticket-detail__qr-wrapper">
                                {/* Placeholder for QR code - you can integrate a library like 'qrcode.react' */}
                                <div className="ticket-detail__qr-placeholder">
                                    <p>Código QR del Ticket</p>
                                    <p className="ticket-detail__qr-id">{ticket._id}</p>
                                    <small>Presenta este código en el evento</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="ticket-detail__actions">
                        <button
                            className="btn btn-ghost"
                            onClick={() => navigate('/mistickets')}
                        >
                            ← Volver a Mis Tickets
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => window.print()}
                        >
                            🖨️ Imprimir Ticket
                        </button>
                    </div>
                </div>
            </Section>
        </div>
    );
}
