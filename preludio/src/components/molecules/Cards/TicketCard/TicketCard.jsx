import './TicketCard.css';

export const TicketCard = ({ ticket, onViewTicket }) => {
    const fechaCompra = new Date(ticket.fechaCompra).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const fechaEvento = new Date(ticket.evento.fecha).toLocaleDateString('es-ES', {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    });

    const getStatusDisplay = (estado) => {
        if (!estado) return 'Válido';
        const normalized = estado.toUpperCase();
        if (normalized === 'VALIDO' || normalized === 'VÁLIDO') return 'Válido';
        if (normalized === 'USADO') return 'Usado';
        if (normalized === 'CANCELADO') return 'Cancelado';
        return estado;
    };

    const getStatusClass = (estado) => {
        if (!estado) return 'valid';
        const normalized = estado.toUpperCase();
        if (normalized === 'VALIDO' || normalized === 'VÁLIDO') return 'valid';
        if (normalized === 'USADO') return 'used';
        if (normalized === 'CANCELADO') return 'cancelled';
        return '';
    };

    const isValidTicket = (estado) => {
        if (!estado) return true;
        const normalized = estado.toUpperCase();
        return normalized === 'VALIDO' || normalized === 'VÁLIDO';
    };

    const statusDisplay = getStatusDisplay(ticket.estado);
    const statusClass = getStatusClass(ticket.estado);
    const canViewTicket = isValidTicket(ticket.estado);
    const eventImage = ticket.evento.imagen || '/placeholder.png';

    return (
        <article className="ticket-card">
            {/* Header con imagen del evento y título*/}
            <div className="ticket-card__header" style={{ backgroundImage: `url(${eventImage})` }}>
                <div className="ticket-card__overlay">
                    <h3 className="ticket-card__title">{ticket.evento.titulo || ticket.evento.nombre}</h3>
                    <span className={`ticket-card__status ${statusClass}`}>
                        {statusDisplay}
                    </span>
                </div>
            </div>

            {/* Cuerpo del ticket */}
            <div className="ticket-card__body">
                <div className="ticket-card__details">
                    <div className="ticket-card__detail">
                        <span className="label">🎫 Tipo</span>
                        <span className="value">{ticket.tipoEntrada}</span>
                    </div>
                    <div className="ticket-card__detail">
                        <span className="label">📅 Fecha</span>
                        <span className="value">{fechaEvento}</span>
                    </div>
                    <div className="ticket-card__detail">
                        <span className="label">📍 Lugar</span>
                        <span className="value">{ticket.evento.ubicacion?.lugar || 'Ubicación no especificada'}</span>
                    </div>
                </div>

                <div className="ticket-card__footer">
                    <div className="ticket-card__price-section">
                        <span className="ticket-card__price">${ticket.precioPagado.toFixed(2)}</span>
                        <span className="ticket-card__purchase-date">Comprado: {fechaCompra}</span>
                    </div>

                    {canViewTicket && (
                        <button
                            className="ticket-card__cta"
                            onClick={() => onViewTicket(ticket._id)}
                        >
                            Ver Ticket y QR →
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
};
