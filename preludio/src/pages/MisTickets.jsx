import { Section } from '../components/layout/Section.jsx'
import { useState, useEffect } from 'react'
import { useAuth } from '../state/auth.jsx'; // Importación necesaria
import { fetchMyTickets } from '../api/tickets.js'; // Función de API

// Componente individual para mostrar un ticket
const TicketCard = ({ ticket }) => {
    // Convertir la fecha de compra y la fecha del evento para mostrar
    const fechaCompra = new Date(ticket.fechaCompra).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    // Asumimos que ticket.evento.fecha es una fecha válida. Si no, se mostrará "Invalid Date".
    const fechaEvento = new Date(ticket.evento.fecha).toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' });

    // Estilos basados en el estado
    let statusClass = "bg-gray-200 text-gray-800";
    if (ticket.estado === 'Válido') {
        statusClass = "bg-green-100 text-green-700 font-semibold";
    } else if (ticket.estado === 'Cancelado') {
        statusClass = "bg-red-100 text-red-700 opacity-75";
    }

    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden transform hover:scale-[1.02] transition duration-300 ease-in-out border-t-4 border-indigo-500">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{ticket.evento.nombre}</h3>
                    <span className={`px-3 py-1 text-xs rounded-full ${statusClass}`}>
                        {ticket.estado}
                    </span>
                </div>

                <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Tipo de entrada:</span> {ticket.tipoEntrada}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Fecha del evento:</span> {fechaEvento}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                    <span className="font-semibold">Lugar:</span> {ticket.evento.lugar || 'Ubicación no especificada'}
                </p>
                
                <div className="border-t pt-4 flex justify-between items-center">
                    <p className="text-lg font-extrabold text-indigo-600">
                        ${ticket.precioPagado.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                        Comprado: {fechaCompra}
                    </p>
                </div>
                
                {ticket.estado === 'Válido' && (
                    <button 
                        className="mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 rounded-lg transition duration-200"
                        // Usar console.log en lugar de alert()
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
        // Solo intenta cargar si el usuario está autenticado y tenemos el token
        if (!user || !token) {
            setLoading(false);
            return; 
        }
        
        setLoading(true); setError(null);

        // Llamamos a la API con el token de autenticación
        // Nota: La función fetchMyTickets (en el otro archivo) debe manejar la adición del token en el header.
        fetchMyTickets(token, order)
            .then(js => {
                setTickets(Array.isArray(js) ? js : js.tickets || []);
            })
            .catch(e => {
                setError(e.message || 'Error al cargar tus tickets. Intenta recargar.');
            })
            .finally(() => setLoading(false))
            
    }, [user, token, order]) 

    if (!user) {
        return null;
    }
    
    return (
        <div className="page">
            <Section title="Mis Entradas Compradas">
                <div className="toolbar flex justify-between items-center mb-6 p-3 bg-gray-50 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-800">Total de Tickets: {tickets.length}</h2>
                    <label className="text-gray-700 font-medium">Ordenar por fecha de compra:
                        <select 
                            onChange={(e)=> setOrder(e.target.value)} 
                            value={order}
                            className="ml-2 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="desc">Más Recientes Primero</option>
                            <option value="asc">Más Antiguos Primero</option>
                        </select>
                    </label>
                </div>

                {loading && <div className="loader text-center text-indigo-600 text-lg p-10">Cargando tus tickets…</div>}
                {error && <div className="error text-center text-red-600 p-4 bg-red-50 rounded-lg">Error: {error}</div>}
                
                {!loading && !error && tickets.length === 0 && (
                    <div className="text-center p-10 bg-yellow-50 rounded-lg border-2 border-yellow-300">
                        <p className="text-xl text-yellow-800 font-bold">¡Vaya! Parece que aún no tienes tickets.</p>
                        <p className="text-md text-yellow-700 mt-2">Visita la sección de Shows para encontrar tu próximo evento.</p>
                    </div>
                )}

                {!loading && !error && tickets.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tickets.map(ticket => (
                            // Muestra el ticket solo si tiene la referencia al evento (populado correctamente)
                            ticket.evento && <TicketCard key={ticket._id} ticket={ticket} />
                        ))}
                    </div>
                )}
            </Section>
        </div>
    )
}