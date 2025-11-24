import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Section } from "../../components/layout/Section/Section.jsx";
import { fetchUsers } from "../../lib/services/users.service.js";
import { fetchAdminEvents } from '../../lib/services/events.service.js';
import { AdminList } from "../../components/organisms/AdminList/AdminList.jsx";
import { usePagination } from "../../hooks/usePagination.js";
import { useDebounce } from "../../hooks/useDebounce.js";

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
        if (!cancel) setError(e?.message || "Error");
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
        <div className="toolbar mb-6 flex gap-2 border-b border-[rgba(255,255,255,0.1)] pb-4">
          <button
            className={`btn ${view === "users" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => { setView("users"); resetPage(); }}
          >
            Usuarios
          </button>
          <button
            className={`btn ${view === "events" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => { setView("events"); resetPage(); }}
          >
            Eventos
          </button>
          {view === 'events' && (
            <button className="btn btn-success ml-auto" onClick={() => navigate('/events/create')}>
              + Crear evento
            </button>
          )}
        </div>

        {/* Filtros server-side */}
        <div className="rounded-box border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] p-4 mb-6 flex flex-wrap items-end gap-4">
          <div className="grow">
            <label className="label"><span className="label-text text-muted">Buscar</span></label>
            <input
              className="input input-bordered w-full bg-[rgba(0,0,0,0.2)]"
              placeholder={view === "users" ? "Nombre, email, DNI…" : "Título, lugar, ciudad…"}
              value={q}
              onChange={(e) => { setQ(e.target.value); resetPage(); }}
            />
          </div>
          <div>
            <label className="label"><span className="label-text text-muted">Items por página</span></label>
            <select
              className="select select-bordered bg-[rgba(0,0,0,0.2)]"
              value={perPage}
              onChange={(e) => changePerPage(Number(e.target.value))}
            >
              {[5, 10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="ml-auto text-sm text-muted pb-3">Total: <b className="text-text">{total}</b></div>
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
