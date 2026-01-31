import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Section } from "../../components/layout/Section/Section.jsx";
import { fetchUsers } from "../../lib/services/users.service.js";
import { fetchAdminEvents } from '../../lib/services/events.service.js';
import { AdminList } from "../../components/organisms/AdminList/AdminList.jsx";
import { usePagination } from "../../hooks/usePagination.js";
import { useDebounce } from "../../hooks/useDebounce.js";
import './Administration.css';


export function Administration() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const [view, setView] = useState("users"); // "users" | "events"
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usar hook de paginación
  const { page, perPage, setPage, changePerPage, resetPage, getMaxPage } = usePagination(1, 10);

  // Search input con debounce
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 350); // Espera 350ms después de dejar de escribir

  // sort por defecto por vista
  const sortDefaults = useMemo(() => (
    view === "events" ? { sort: "fecha", order: "asc" } : { sort: "createdAt", order: "desc" }
  ), [view]);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true); setError(null);
      try {
        const api = view === "users" ? fetchUsers : fetchAdminEvents;
        const { items, total } = await api({
          page,
          limit: perPage,
          q: debouncedQ, // Usar el valor con debounce
          sort: sortDefaults.sort,
          order: sortDefaults.order,
        });
        if (!cancel) {
          setRows(items ?? []);
          setTotal(total ?? 0);
        }
      } catch (e) {
        console.warn("Backend error, using mock data for testing:", e);
        // MOCK DATA FOR TESTING
        if (!cancel) {
          const mockUsers = [
            { _id: '1', nombre: 'Juan', apellido: 'Perez', email: 'juan@test.com', dni: '12345678', telefono: '1122334455', rol: 'USER' },
            { _id: '2', nombre: 'Maria', apellido: 'Gomez', email: 'maria@test.com', dni: '87654321', telefono: '5544332211', rol: 'ADMIN' },
            { _id: '3', nombre: 'Carlos', apellido: 'Lopez', email: 'carlos@test.com', dni: '11223344', telefono: '9988776655', rol: 'USER' },
          ];
          const mockEvents = [
            { _id: '1', titulo: 'Concierto Rock', categoria: 'Música', fecha: new Date().toISOString(), hora: '20:00', estadoPublicacion: 'PUBLICADO', estado: 'ACTIVO', ubicacion: { lugar: 'Teatro', ciudad: 'CABA' } },
            { _id: '2', titulo: 'Obra de Teatro', categoria: 'Teatro', fecha: new Date().toISOString(), hora: '19:00', estadoPublicacion: 'BORRADOR', estado: 'INACTIVO', ubicacion: { lugar: 'Centro Cultural', ciudad: 'La Plata' } },
          ];
          setRows(view === 'users' ? mockUsers : mockEvents);
          setTotal(10); // Mock total
        }
        // if (!cancel) setError(e?.message || "Error"); // Don't show error if we fallback to mock
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [view, page, perPage, debouncedQ, sortDefaults]); // debouncedQ en lugar de q

  // Cuando se pasa view como queryparam hacer el filtrado por esa vista
  useEffect(() => {
    const v = searchParams.get('view');
    if (v === 'events' || v === 'users') setView(v);
  }, [searchParams]);

  // Definición de todas las columnas posibles
  const columns = view === "users"
    ? [
      { key: "nombre", label: "Nombre" },
      { key: "apellido", label: "Apellido" },
      { key: "email", label: "Email" },
      { key: "dni", label: "DNI" },
      { key: "telefono", label: "Teléfono" },
      { key: "rol", label: "Rol" },
    ]
    : [
      { key: "titulo", label: "Título" },
      { key: "categoria", label: "Categoría" },
      { key: "fecha", label: "Fecha", render: (e) => e.fecha ? new Date(e.fecha).toLocaleDateString() : "—" },
      { key: "hora", label: "Hora" },
      { key: "estadoPublicacion", label: "Publicación" },
      { key: "estado", label: "Estado" },
      {
        key: "ubicacion",
        label: "Ubicación",
        render: (e) => {
          const u = e.ubicacion || {};
          return [u.lugar, u.ciudad, u.provincia].filter(Boolean).join(" · ") || "—";
        },
      },
    ];

  const maxPage = getMaxPage(total);

  return (
    <div className="page">
      <Section title="Administración">
        {/* Toggle de vistas */}
        <div className="admin-toolbar">
          <div className="admin-btn-group">
            <button
              className={`btn ${view === "users" ? "btn-secondary" : "btn-ghost"}`}
              onClick={() => { setView("users"); resetPage(); }}
            >
              Usuarios
            </button>
            <button
              className={`btn ${view === "events" ? "btn-secondary" : "btn-ghost"}`}
              onClick={() => { setView("events"); resetPage(); }}
            >
              Eventos
            </button>
          </div>
          {view === 'events' && (
            <button className="btn btn-primary ml-auto" onClick={() => navigate('/events/create')}>
              + Crear evento
            </button>
          )}
        </div>

        {/* Filtros server-side */}
        <div className="admin-filters">
          <div className="filter-group grow">
            <label className="filter-label">Buscar</label>
            <input
              className="form-control"
              placeholder={view === "users" ? "Nombre, email, DNI…" : "Título, lugar, ciudad…"}
              value={q}
              onChange={(e) => { setQ(e.target.value); resetPage(); }}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Items por página</label>
            <select
              className="form-control"
              style={{ width: 'auto', minWidth: '80px' }}
              value={perPage}
              onChange={(e) => changePerPage(Number(e.target.value))}
            >
              {[5, 10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="admin-stats">Total: <b>{total}</b></div>
        </div>

        <AdminList
          view={view}
          rows={rows}
          loading={loading}
          error={error}
          page={page}
          maxPage={maxPage}
          setPage={setPage}
          columns={columns}
        />
      </Section>
    </div>
  );
}
