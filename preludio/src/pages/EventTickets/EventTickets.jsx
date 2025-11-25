import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMyTickets } from '../../lib/services/tickets.service';
import { Section } from '../../components/layout/Section/Section';
import { TicketDisplay } from '../../components/organisms/TicketDisplay/TicketDisplay';
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
                    <TicketDisplay
                        ticket={currentTicket}
                        onBack={() => navigate('/mistickets')}
                        onPrint={() => window.print()}
                    />

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
