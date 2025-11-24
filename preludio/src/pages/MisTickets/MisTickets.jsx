import { Section } from '../../components/layout/Section/Section.jsx'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/authStore.js'; // Importación necesaria
import { fetchMyTickets } from '../../lib/services/tickets.service.js'; // Función de API
import './MisTickets.css'
import { TicketCard } from '../../components/molecules/Cards/TicketCard/TicketCard.jsx';

export function MisTickets() {
    const { user } = useAuth();
    const navigate = useNavigate();
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

        fetchMyTickets({ order })
            .then(arr => setTickets(arr))
            .catch(e => setError(e.message || 'Error al cargar tus tickets. Intenta recargar.'))
            .finally(() => setLoading(false));

    }, [user, order])

    const handleViewTicket = (ticketId) => {
        navigate(`/ticket/${ticketId}`);
    };

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
                            onChange={(e) => setOrder(e.target.value)}
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
                        <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>¡Vaya! Parece que aún no tienes tickets.</p>
                        <p style={{ marginTop: 8 }}>Visita la sección de Shows para encontrar tu próximo evento.</p>
                    </div>
                )}

                {!loading && !error && tickets.length > 0 && (
                    <div className="ticket-grid">
                        {tickets.map(ticket => (
                            ticket.evento && <TicketCard key={ticket._id} ticket={ticket} onViewTicket={handleViewTicket} />
                        ))}
                    </div>
                )}
            </Section>
        </div>
    )
}