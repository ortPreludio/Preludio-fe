import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { request } from '../../api/client.js';
import { Section } from '../../components/layout/Section/Section.jsx';

export default function UserDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        request(`/users/${id}`)
            .then(data => setUser(data))
            .catch(e => setError(e.message || 'Error al cargar usuario'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="page"><div className="loader">Cargando usuario…</div></div>;
    if (error) return <div className="page"><div className="error">{error}</div></div>;
    if (!user) return <div className="page"><div className="error">Usuario no encontrado</div></div>;

    const born = user.fechaNacimiento ? new Date(user.fechaNacimiento).toLocaleDateString('es-AR') : 'No especificado';

    return (
        <div className="page">
            <div className="container auth-form">
                <h2>Detalles del Usuario</h2>
                <div className="profile-grid">
                    <Section>
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
                </div>
            </div>
        </div>
    );
}
