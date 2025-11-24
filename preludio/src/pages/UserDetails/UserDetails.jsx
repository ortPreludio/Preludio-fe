import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { request } from '../../lib/infra/http-client.js';
import { Section } from '../../components/layout/Section/Section.jsx';

export default function UserDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        
        Promise.all([
            request(`/users/${id}`),
            request(`/tickets/user/${id}`)
        ])
        .then(([userData, ticketsData]) => {
            setUser(userData);
            setTickets(ticketsData || []);
        })
        .catch(e => {
            console.error(e);
            setError(e.message || 'Error al cargar datos');
        })
        .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="page"><div className="loader">Cargando datos…</div></div>;
    if (error) return <div className="page"><div className="error">{error}</div></div>;
    if (!user) return <div className="page"><div className="error">Usuario no encontrado</div></div>;

    const born = user.fechaNacimiento ? new Date(user.fechaNacimiento).toLocaleDateString('es-AR') : 'No especificado';

    return (
        <div className="page">
            <div className="container auth-form" style={{ maxWidth: '1200px' }}>
                <h2>Detalles del Usuario</h2>
                
                <div className="profile-grid">
                    <Section title="Información Personal">
                        <div className="profile-card">
                            <p><strong>ID:</strong> {user._id || user.id || user.uuid}</p>
                            <p><strong>Nombre:</strong> {user.nombre} {user.apellido}</p>
                            <p><strong>DNI:</strong> {user.dni || '—'}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Teléfono:</strong> {user.telefono || '—'}</p>
                            <p><strong>Fecha de nacimiento:</strong> {born}</p>
                            <p><strong>Rol:</strong> {user.rol}</p>
                            <p><strong>Creado:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleString() : '—'}</p>

                            <div style={{ marginTop: 12, display: 'flex', gap: '1rem' }}>
                                <button className="btn btn-ghost" onClick={() => navigate('/administration')}>Volver</button>
                                <button className="btn btn-primary" onClick={() => navigate(`/users/edit/${id}`)}>Editar</button>
                            </div>
                        </div>
                    </Section>

                    <Section title={`Entradas Adquiridas (${tickets.length})`}>
                        {tickets.length === 0 ? (
                            <p style={{ color: '#666', fontStyle: 'italic' }}>Este usuario no ha comprado entradas aún.</p>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="table" style={{ width: '100%', marginTop: '1rem' }}>
                                    <thead>
                                        <tr>
                                            <th>Evento</th>
                                            <th>Fecha Evento</th>
                                            <th>Fecha Compra</th>
                                            <th>Cantidad</th>
                                            <th>Total</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tickets.map((ticket) => (
                                            <tr key={ticket._id || ticket.id}>
                                                <td>{ticket.evento?.titulo || 'Evento desconocido'}</td>
                                                <td>
                                                    {ticket.evento?.fecha 
                                                        ? new Date(ticket.evento.fecha).toLocaleDateString('es-AR') 
                                                        : '—'}
                                                </td>
                                                <td>
                                                    {ticket.createdAt 
                                                        ? new Date(ticket.createdAt).toLocaleDateString('es-AR') 
                                                        : '—'}
                                                </td>
                                                <td>{ticket.cantidad || 1}</td>
                                                <td>${ticket.total || ticket.precioTotal || 0}</td>
                                                <td>
                                                    <span 
                                                        style={{
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '0.85rem',
                                                            backgroundColor: ticket.estado === 'ACTIVO' ? '#22c55e' : '#6b7280',
                                                            color: 'white'
                                                        }}
                                                    >
                                                        {ticket.estado || 'ACTIVO'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => navigate(`/ticket/${ticket._id || ticket.id}`)}
                                                        style={{ 
                                                            padding: '4px 12px', 
                                                            fontSize: '0.875rem' 
                                                        }}
                                                    >
                                                        Ver Detalle
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Section>
                </div>
            </div>
        </div>
    );
}