import { Section } from '../../components/layout/Section/Section.jsx'
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/authStore.js';
import { fetchMyTickets } from '../../lib/services/tickets.service.js';
import './MisTickets.css'
import { TicketCard } from '../../components/molecules/Cards/TicketCard/TicketCard.jsx';

export function MisTickets() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [order, setOrder] = useState('desc');

    useEffect(() => {
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

    // Group tickets by event
    const groupedTickets = useMemo(() => {
        const groups = {};
        tickets.forEach(ticket => {
            if (ticket.evento) {
                const eventId = ticket.evento._id;
                if (!groups[eventId]) {
                    groups[eventId] = {
                        evento: ticket.evento,
                        tickets: [],
                        firstTicket: ticket // Keep reference to first ticket for display
                    };
                }
                groups[eventId].tickets.push(ticket);
            }
        });
        return Object.values(groups);
    }, [tickets]);

    const handleViewTicket = (eventId, ticketIds) => {
        // If only one ticket, go directly to ticket detail
        if (ticketIds.length === 1) {
            navigate(`/ticket/${ticketIds[0]}`);
        } else {
            // Multiple tickets, go to event tickets carousel
            navigate(`/event-tickets/${eventId}`);
        }
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

                {!loading && !error && groupedTickets.length > 0 && (
                    <div className="ticket-grid">
                        {groupedTickets.map(group => (
                            <TicketCard
                                key={group.evento._id}
                                ticket={group.firstTicket}
                                ticketCount={group.tickets.length}
                                onViewTicket={() => handleViewTicket(
                                    group.evento._id,
                                    group.tickets.map(t => t._id)
                                )}
                            />
                        ))}
                    </div>
                )}
            </Section>
        </div>
    )
}