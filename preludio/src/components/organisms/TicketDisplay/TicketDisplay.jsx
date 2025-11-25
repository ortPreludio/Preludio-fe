import QRCode from "react-qr-code";
import './TicketDisplay.css';

export function TicketDisplay({ ticket, onBack, onPrint, showButtons = true }) {
    if (!ticket) return null;

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

                {/* Right Column: QR Code */}
                <div className="ticket-qr-column">
                    <div className="qr-card">
                        <h3 className="ticket-section-title">Código QR</h3>
                        <div className="qr-wrapper">
                            <QRCode
                                value={ticket.codigoQR}
                                size={180}
                            />
                        </div>
                        <p className="qr-instruction">Presenta este código al ingresar</p>
                        <p className="qr-id-ref">{ticket._id}</p>
                    </div>
                </div>
            </div>

            {showButtons && (
                <div className="ticket-footer">
                    <button className="btn btn-ghost" onClick={onBack}>
                        ← Volver
                    </button>
                    <button className="btn btn-primary" onClick={onPrint}>
                        🖨️ Descargar / Imprimir
                    </button>
                </div>
            )}
        </div>
    );
}
