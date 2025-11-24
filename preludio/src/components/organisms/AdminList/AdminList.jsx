import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminStore } from '../../../store/adminStore.js';
import './AdminList.css';

export function AdminList({
    view,
    rows,
    loading,
    error,
    page,
    maxPage,
    setPage,
    columns: initialColumns
}) {
    // Use Zustand store instead of local state + localStorage
    const { getVisibleColumns, getActiveColumns, toggleColumn: storeToggleColumn, resetColumns } = useAdminStore();

    // Get visibility state (true/false for each column)
    const visibleColumnsState = getVisibleColumns(view);

    // Get array of active column keys (for filtering table columns)
    const visibleColumnKeys = getActiveColumns(view);

    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [openMenuRowId, setOpenMenuRowId] = useState(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openMenuRowId && !event.target.closest('.actions-mobile')) {
                setOpenMenuRowId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openMenuRowId]);

    const toggleColumn = (key) => {
        storeToggleColumn(view, key);
    };

    // Filter columns based on visibility from store (for TABLE display)
    const activeColumns = initialColumns.filter(c => visibleColumnKeys.includes(c.key));

    if (loading) return <div className="loader">Cargando…</div>;
    if (error) return <div className="alert alert-error">Error: {error}</div>;

    return (
        <div className="admin-list">
            {/* Column Config Toggle */}
            <div className="admin-toolbar">
                <button
                    className="config-btn"
                    onClick={() => setIsConfigOpen(!isConfigOpen)}
                >
                    <span>⚙️ Configurar columnas</span>
                </button>
            </div>

            {/* Column Toggles Panel */}
            {isConfigOpen && (
                <div className="config-panel">
                    <div className="config-header">
                        <h3 className="config-title">Columnas visibles</h3>
                        <button
                            className="btn btn-xs btn-ghost"
                            onClick={() => resetColumns(view)}
                            title="Restaurar valores por defecto"
                        >
                            Resetear
                        </button>
                    </div>
                    <div className="config-options">
                        {initialColumns.map(col => (
                            <label key={col.key} className="config-label">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-xs checkbox-primary"
                                    checked={visibleColumnsState[col.key] || false}
                                    onChange={() => toggleColumn(col.key)}
                                />
                                <span>{col.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            {activeColumns.map(c => <th key={c.key}>{c.label}</th>)}
                            <th style={{ textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 && (
                            <tr><td colSpan={activeColumns.length + 1} style={{ textAlign: 'center', padding: '32px', color: 'var(--muted)' }}>Sin resultados.</td></tr>
                        )}
                        {rows.map(row => {
                            const id = row._id || row.id || row.uuid;
                            const isMenuOpen = openMenuRowId === id;

                            return (
                                <tr key={id}>
                                    {activeColumns.map(c => (
                                        <td key={c.key}>
                                            {c.render ? c.render(row) : row[c.key]}
                                        </td>
                                    ))}
                                    <td className="actions-cell">
                                        {/* Desktop Actions */}
                                        <div className="actions-desktop">
                                            <Link
                                                className="btn-action primary"
                                                to={view === 'users' ? `/users/edit/${id}` : `/events/edit/${id}`}
                                            >
                                                Editar
                                            </Link>
                                            <Link
                                                className="btn-action"
                                                to={view === 'users' ? `/users/${id}` : `/events/${id}`}
                                            >
                                                Detalles
                                            </Link>
                                        </div>

                                        {/* Mobile Actions (Three dots) */}
                                        <div className="actions-mobile">
                                            <button
                                                className="btn-dots"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuRowId(isMenuOpen ? null : id);
                                                }}
                                            >
                                                ⋮
                                            </button>

                                            {isMenuOpen && (
                                                <div className="mobile-menu">
                                                    <Link
                                                        className="menu-item"
                                                        to={view === 'users' ? `/users/edit/${id}` : `/events/edit/${id}`}
                                                        onClick={() => setOpenMenuRowId(null)}
                                                    >
                                                        Editar
                                                    </Link>
                                                    <Link
                                                        className="menu-item"
                                                        to={view === 'users' ? `/users/${id}` : `/events/${id}`}
                                                        onClick={() => setOpenMenuRowId(null)}
                                                    >
                                                        Detalles
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="join mt-4 flex justify-center">
                <button className="btn join-item btn-sm" onClick={() => setPage(1)} disabled={page <= 1}>«</button>
                <button className="btn join-item btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>‹</button>
                <button className="btn join-item btn-ghost btn-sm no-animation pointer-events-none">
                    Página {page} / {maxPage}
                </button>
                <button className="btn join-item btn-sm" onClick={() => setPage(p => Math.min(maxPage, p + 1))} disabled={page >= maxPage}>›</button>
                <button className="btn join-item btn-sm" onClick={() => setPage(maxPage)} disabled={page >= maxPage}>»</button>
            </div>
        </div>
    );
}
