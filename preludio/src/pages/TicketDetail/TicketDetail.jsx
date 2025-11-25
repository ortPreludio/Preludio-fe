import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTicketById } from '../../lib/services/tickets.service';
import { Section } from '../../components/layout/Section/Section';
import { TicketDisplay } from '../../components/organisms/TicketDisplay/TicketDisplay';
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

    return (
        <div className="page ticket-page">
            <Section>
                <TicketDisplay
                    ticket={ticket}
                    onBack={() => navigate(-1)}
                    onPrint={() => window.print()}
                />
            </Section>
        </div>
    );
}
