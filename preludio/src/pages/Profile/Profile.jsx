import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { request } from '../../api/client.js';
import { Section } from '../../components/layout/Section/Section.jsx';
import { MisTickets } from '../MisTickets/MisTickets.jsx';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true); setError(null);
    request('/users/me')
      .then(data => {
        const u = data?.user || data;
        setUser(u);
      })
      .catch(e => setError(e.message || 'Error al cargar perfil'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><div className="loader">Cargando perfil…</div></div>;
  if (error) return <div className="page"><div className="error">{error}</div></div>;
  if (!user) return null;

  const born = user.fechaNacimiento ? new Date(user.fechaNacimiento).toLocaleDateString('es-AR') : 'No especificado';

  return (
    <div className="page">
      <div className="container auth-form">
        <h2>Mi perfil</h2>
        <div className="profile-grid">
          <Section>
            <div className="profile-card">
              <p><strong>Nombre:</strong> {user.nombre} {user.apellido}</p>
              <p><strong>DNI:</strong> {user.dni || '—'}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Teléfono:</strong> {user.telefono || '—'}</p>
              <p><strong>Fecha de nacimiento:</strong> {born}</p>
              <p><strong>Rol:</strong> {user.rol}</p>

              <div style={{ marginTop: 12 }}>
                <button className="btn btn-primary" onClick={() => navigate('/edit')}>Editar perfil</button>
              </div>
            </div>
          </Section>

          <Section title="Historial de Tickets">
            <MisTickets />
          </Section>
        </div>
      </div>
    </div>
  );
}
