import { Section } from '../components/layout/Section.jsx'
import { useState, useEffect } from 'react'
import { useAuth } from '../state/auth.jsx'; // Importación necesaria
import { fetchMyTickets } from '../api/tickets.js'; // Función de API

// Componente individual para mostrar un ticket
const TicketCard = ({ ticket }) => {
    // Convertir la fecha de compra y la fecha del evento para mostrar
    const fechaCompra = new Date(ticket.fechaCompra).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    // Asumimos que ticket.evento.fecha es una fecha válida.
    const fechaEvento = new Date(ticket.evento.fecha).toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' });

    // Status visual is handled by CSS classes (.ticket-status.valid / .ticket-status.cancel)

    return (
        <div className="ticket-card">
            <div className="ticket-body">
                <div className="ticket-header">
                    <h3>{ticket.evento.titulo || ticket.evento.nombre}</h3>
                    <span className={`ticket-status ${ticket.estado === 'Válido' ? 'valid' : ticket.estado === 'Cancelado' ? 'cancel' : ''}`}>
                        {ticket.estado}
                    </span>
                </div>

                <p style={{marginBottom:6}}><strong>Tipo de entrada:</strong> {ticket.tipoEntrada}</p>
                <p style={{marginBottom:6}}><strong>Fecha del evento:</strong> {fechaEvento}</p>
                <p style={{marginBottom:12}}><strong>Lugar:</strong> {ticket.evento.ubicacion?.lugar || ticket.evento.lugar || 'Ubicación no especificada'}</p>

                <div className="ticket-meta">
                    <p className="ticket-price">${ticket.precioPagado.toFixed(2)}</p>
                    <p style={{fontSize:12, color:'var(--muted)'}}>Comprado: {fechaCompra}</p>
                </div>

                {ticket.estado === 'Válido' && (
                    <button 
                        className="ticket-cta"
                        onClick={() => console.log(`Mostrando QR para Ticket ID: ${ticket._id}`)} 
                    >
                        Ver Ticket y QR
                    </button>
                )}
            </div>
        </div>
    );
};

export function MisTickets() {
    const { user, token } = useAuth(); 
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [order, setOrder] = useState('desc'); // Para ordenar en el frontend o enviar al backend

    useEffect(() => {
        // Solo intenta cargar si el usuario está autenticado
        if (!user) {
            setLoading(false);
            return; 
        }
        
        setLoading(true); setError(null);

        fetchMyTickets(order)
            .then(arr => setTickets(arr))
            .catch(e => setError(e.message || 'Error al cargar tus tickets. Intenta recargar.'))
            .finally(() => setLoading(false));
            
    }, [user, order]) 

    if (!user) {
        return null;
    }
    
    return (
        <div className="page">
            <Section title="Mis Entradas Compradas">
                <div className="tickets-toolbar">
                    <h2>Total de Tickets: {tickets.length}</h2>
                    <label>Ordenar por fecha de compra:
                        <select 
                            onChange={(e)=> setOrder(e.target.value)} 
                            value={order}
                            className="select"
                        >
                            <option value="desc">Más Recientes Primero</option>
                            <option value="asc">Más Antiguos Primero</option>
                        </select>
                    </label>
                </div>

                {loading && <div className="ticket-loader">Cargando tus tickets…</div>}
                {error && <div className="error ticket-loader">Error: {error}</div>}
                
                {!loading && !error && tickets.length === 0 && (
                    <div className="ticket-empty">
                        <p style={{margin:0, fontSize:'1.25rem', fontWeight:700}}>¡Vaya! Parece que aún no tienes tickets.</p>
                        <p style={{marginTop:8}}>Visita la sección de Shows para encontrar tu próximo evento.</p>
                    </div>
                )}

                {!loading && !error && tickets.length > 0 && (
                    <div className="ticket-grid">
                        {tickets.map(ticket => (
                            ticket.evento && <TicketCard key={ticket._id} ticket={ticket} />
                        ))}
                    </div>
                )}
            </Section>
        </div>
    )
}