import './TicketCard.css';

export const TicketCard = ({ ticket, onViewTicket }) => {
    // Convertir la fecha de compra y la fecha del evento para mostrar
    const fechaCompra = new Date(ticket.fechaCompra).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

    // Asumimos que ticket.evento.fecha es una fecha válida.
    const fechaEvento = new Date(ticket.evento.fecha).toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' });

    // Status display - normalize to show properly
    const getStatusDisplay = (estado) => {
        if (!estado) return 'VALIDO';
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
        if (normalized === 'CANCELADO') return 'cancel';
        return '';
    };

    // Check if ticket is valid - handle both 'VALIDO' and 'Válido'
    const isValidTicket = (estado) => {
        if (!estado) return true; // Default is valid
        const normalized = estado.toUpperCase();
        return normalized === 'VALIDO' || normalized === 'VÁLIDO';
    };

    const statusDisplay = getStatusDisplay(ticket.estado);
    const statusClass = getStatusClass(ticket.estado);
    const canViewTicket = isValidTicket(ticket.estado);

    return (
        <div className="ticket-card">
            <div className="ticket-body">
                <div className="ticket-header">
                    <h3>{ticket.evento.titulo || ticket.evento.nombre}</h3>
                    <span className={`ticket-status ${statusClass}`}>
                        {statusDisplay}
                    </span>
                </div>

                <p className="ticket-info"><strong>Tipo de entrada:</strong> {ticket.tipoEntrada}</p>
                <p className="ticket-info"><strong>Fecha del evento:</strong> {fechaEvento}</p>
                <p className="ticket-info"><strong>Lugar:</strong> {ticket.evento.ubicacion?.lugar || ticket.evento.lugar || 'Ubicación no especificada'}</p>

                <div className="ticket-meta">
                    <p className="ticket-price">${ticket.precioPagado.toFixed(2)}</p>
                    <p className="ticket-date">Comprado: {fechaCompra}</p>
                </div>

                {canViewTicket && (
                    <button
                        className="ticket-cta"
                        onClick={() => onViewTicket(ticket._id)}
                    >
                        Ver Ticket y QR
                    </button>
                )}
            </div>
        </div>
    );
};
