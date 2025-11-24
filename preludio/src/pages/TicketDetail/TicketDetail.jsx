import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTicketById } from '../../lib/services/tickets.service';
import { Section } from '../../components/layout/Section/Section';
import { Text } from '../../components/atoms/Text/Text';
import QRCode from "react-qr-code"; 
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
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const fechaCompra = new Date(ticket.createdAt || ticket.fechaCompra).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="page ticket-page">
            <Section>
                <div className="ticket-container">
                    {/* Ticket Header / Event Image */}
                    <div className="ticket-header" style={{ backgroundImage: `url(${ticket.evento?.imagen || '/placeholder.png'})` }}>
                        <div className="ticket-header-overlay">
                            <h1 className="ticket-event-title">{ticket.evento?.titulo}</h1>
                            <div className="ticket-event-meta">
                                <span>📅 {fechaEvento}</span>
                                <span>📍 {ticket.evento?.ubicacion?.lugar}</span>
                            </div>
                        </div>
                    </div>

                    <div className="ticket-body">
                        {/* Left Column: Ticket Info */}
                        <div className="ticket-info-column">
                            <div className="ticket-section">
                                <h3 className="ticket-section-title">Información del Ticket</h3>
                                <div className="ticket-data-grid">
                                    <div className="ticket-data-item">
                                        <span className="label">Tipo de Entrada</span>
                                        <span className="value highlight">{ticket.tipoEntrada || 'General'}</span>
                                    </div>
                                    <div className="ticket-data-item">
                                        <span className="label">Estado</span>
                                        <span className={`status-badge status-${ticket.estado?.toLowerCase()}`}>
                                            {ticket.estado || 'ACTIVO'}
                                        </span>
                                    </div>
                                    <div className="ticket-data-item">
                                        <span className="label">ID del Ticket</span>
                                        <span className="value code">{ticket._id}</span>
                                    </div>
                                    <div className="ticket-data-item">
                                        <span className="label">Precio</span>
                                        <span className="value">${ticket.precioPagado?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="ticket-section">
                                <h3 className="ticket-section-title">Datos del Comprador</h3>
                                <div className="ticket-data-grid">
                                    <div className="ticket-data-item">
                                        <span className="label">Nombre</span>
                                        <span className="value">{ticket.comprador?.nombre} {ticket.comprador?.apellido}</span>
                                    </div>
                                    <div className="ticket-data-item">
                                        <span className="label">Email</span>
                                        <span className="value">{ticket.comprador?.email}</span>
                                    </div>
                                    <div className="ticket-data-item">
                                        <span className="label">Fecha de Compra</span>
                                        <span className="value">{fechaCompra}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* QR Code Section */}
                        <div className="ticket-detail__qr-section">
                            <h3 className="ticket-detail__section-title">Código QR</h3>
                            <div className="ticket-detail__qr-wrapper">
                                <div className="ticket-detail__qr">
                                    <QRCode 
                                        value={ticket.codigoQR}   // << EL QR REAL
                                        size={180}
                                    />
                                    <p className="ticket-detail__qr-id">{ticket._id}</p>
                                    <small>Presenta este código en el evento</small>
                                </div>
                                <p className="qr-instruction">Presenta este código al ingresar</p>
                                <p className="qr-id-ref">{ticket._id}</p>
                            </div>
                        </div>
                    </div>

                    <div className="ticket-footer">
                        <button className="btn btn-ghost" onClick={() => navigate('/mistickets')}>
                            ← Volver
                        </button>
                        <button className="btn btn-primary" onClick={() => window.print()}>
                            🖨️ Descargar / Imprimir
                        </button>
                    </div>
                </div>
            </Section>
        </div>
    );
}
