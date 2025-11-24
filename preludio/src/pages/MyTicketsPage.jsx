import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyTickets } from '../lib/services/tickets.service';

/**
 * MyTicketsPage - Página para ver los tickets del usuario
 * Muestra todos los tickets comprados por el usuario autenticado
 */
export default function MyTicketsPage() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchMyTickets({ order: 'desc' });
            setTickets(data);
        } catch (err) {
            setError(err.message || 'Error al cargar tickets');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-UY', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="text-xl text-gray-600">Cargando tickets...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Mis Tickets</h1>
                <button
                    onClick={() => navigate('/shows')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Comprar más tickets
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {tickets.length === 0 ? (
                <div className="bg-gray-100 border border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-xl text-gray-600 mb-4">No tienes tickets aún</p>
                    <button
                        onClick={() => navigate('/shows')}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Ver Eventos Disponibles
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tickets.map((ticket) => (
                        <div
                            key={ticket._id}
                            className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
                        >
                            {/* Imagen del evento */}
                            {ticket.evento?.imagen && (
                                <img
                                    src={ticket.evento.imagen}
                                    alt={ticket.evento?.titulo || 'Evento'}
                                    className="w-full h-48 object-cover"
                                />
                            )}

                            <div className="p-4">
                                {/* Título del evento */}
                                <h3 className="text-xl font-bold mb-2">
                                    {ticket.evento?.titulo || 'Evento sin título'}
                                </h3>

                                {/* Fecha y hora */}
                                <div className="text-gray-600 mb-2">
                                    <p>📅 {formatDate(ticket.evento?.fecha)}</p>
                                    <p>🕐 {ticket.evento?.hora}</p>
                                </div>

                                {/* Ubicación */}
                                {ticket.evento?.ubicacion && (
                                    <div className="text-gray-600 mb-2">
                                        <p>📍 {ticket.evento.ubicacion.lugar}</p>
                                        <p className="text-sm">{ticket.evento.ubicacion.ciudad}</p>
                                    </div>
                                )}

                                {/* Precio y tipo */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">
                                            {ticket.tipoEntrada || 'General'}
                                        </span>
                                        <span className="font-bold text-lg">
                                            ${ticket.precioPagado || ticket.evento?.precioBase || 0}
                                        </span>
                                    </div>
                                </div>

                                {/* Estado */}
                                <div className="mt-2">
                                    <span
                                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${ticket.estado === 'USADO'
                                                ? 'bg-gray-200 text-gray-700'
                                                : ticket.estado === 'CANCELADO'
                                                    ? 'bg-red-200 text-red-700'
                                                    : 'bg-green-200 text-green-700'
                                            }`}
                                    >
                                        {ticket.estado || 'ACTIVO'}
                                    </span>
                                </div>

                                {/* Código QR (placeholder) */}
                                <div className="mt-4 text-center">
                                    <button
                                        onClick={() => navigate(`/ticket/${ticket._id}`)}
                                        className="text-blue-500 hover:text-blue-700 text-sm font-semibold"
                                    >
                                        Ver código QR →
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
