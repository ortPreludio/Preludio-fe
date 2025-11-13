import { useEffect, useMemo, useState } from "react";
import { Section } from "../components/layout/Section.jsx";
import { fetchUsers } from "../api/users.js";
import { fetchAdminEvents } from "../api/events.js";
import { useNavigate } from 'react-router-dom'

export function Administration() {
  const navigate = useNavigate()
  const [view, setView] = useState("users"); // "users" | "events"
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // server-side pagination + search
  const [page, setPage] = useState(1);      // 1-based
  const [perPage, setPerPage] = useState(10);
  const [q, setQ] = useState("");

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
          q,
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
  }, [view, page, perPage, q, sortDefaults]);

  // columnas por vista
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

  const maxPage = Math.max(1, Math.ceil((total || 0) / (perPage || 1)));
  
  const handleEditUser = (userId) => {
    navigate(`/edit?userId=${userId}`) // Pasamos el ID como query param
  }

  return (
    <div className="page">
      <Section title="Administración">
        {/* Toggle de vistas */}
        <div className="toolbar mb-3 flex gap-2">
          <button
            className={`btn ${view === "users" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => { setView("users"); setPage(1); }}
          >
            Users
          </button>
          <button
            className={`btn ${view === "events" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => { setView("events"); setPage(1); }}
          >
            Events
          </button>
        </div>

        {/* Filtros server-side */}
        <div className="rounded-box border p-3 mb-3 flex flex-wrap items-end gap-3">
          <div className="grow">
            <label className="label"><span className="label-text">Buscar</span></label>
            <input
              className="input input-bordered w-full"
              placeholder={view === "users" ? "Nombre, email, DNI…" : "Título, lugar, ciudad…"}
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
            />
          </div>
          <div>
            <label className="label"><span className="label-text">Items por página</span></label>
            <select
              className="select select-bordered"
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
            >
              {[5,10,25,50,100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="ml-auto text-sm opacity-75">Total: <b>{total}</b></div>
        </div>

        {/* Estado */}
        {loading && <div className="loader">Cargando…</div>}
        {error && <div className="alert alert-error">Error: {error}</div>}

        {/* Tabla */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  {columns.map(c => <th key={c.key}>{c.label}</th>)}
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr><td colSpan={columns.length + 1}>Sin resultados.</td></tr>
                )}
                {rows.map(row => {
                  const id = row._id || row.id || row.uuid;
                  return (
                    <tr key={id}>
                      {columns.map(c => (
                        <td key={c.key}>
                          {c.render ? c.render(row) : row[c.key]}
                        </td>
                      ))}
                      <td className="flex gap-2">
                        {/*<a className="btn btn-warning btn-xs" href={`/administration/${view}/${id}/edit`}>Editar</a>*/}
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEditUser(id)}
                        >
                          Editar
                        </button>
                        <a className="btn btn-info btn-xs" href={`/administration/${view}/${id}`}>Detalles</a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {!loading && !error && (
          <div className="join mt-4">
            <button className="btn join-item" onClick={() => setPage(1)} disabled={page <= 1}>Primera</button>
            <button className="btn join-item" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Anterior</button>
            <button className="btn join-item btn-ghost no-animation">
              Página {page} / {maxPage}
            </button>
            <button className="btn join-item" onClick={() => setPage(p => Math.min(maxPage, p + 1))} disabled={page >= maxPage}>Siguiente</button>
            <button className="btn join-item" onClick={() => setPage(maxPage)} disabled={page >= maxPage}>Última</button>
          </div>
        )}
      </Section>
    </div>
  );
}
