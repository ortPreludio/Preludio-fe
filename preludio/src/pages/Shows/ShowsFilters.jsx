import React from 'react'
import './Shows.css'

export function ShowsFilters({
  order, setOrder,
  categoria, setCategoria,
  publicacion, setPublicacion,
  price, setPrice,
  availability, setAvailability,
  dateFrom, setDateFrom,
  dateTo, setDateTo,
  options,
  onClear,
}) {
  return (
    <div className="toolbar">
      <label className="filter-label">Orden:
        <select onChange={(e) => setOrder(e.target.value)} value={order}>
          <option value="asc">Más próximos</option>
          <option value="desc">Más recientes</option>
        </select>
      </label>

      <label className="filter-label">Categoría:
        <select onChange={(e) => setCategoria(e.target.value)} value={categoria}>
          <option value="">Todas</option>
          {options.categorias.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </label>

      <label className="filter-label">Publicación:
        <select onChange={(e) => setPublicacion(e.target.value)} value={publicacion}>
          <option value="">Todas</option>
          {options.publicaciones.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </label>

      <label className="filter-label">Precio:
        <select onChange={(e) => setPrice(e.target.value)} value={price}>
          <option value="all">Todos</option>
          <option value="free">Entrada gratuita</option>
          <option value="paid">Pagas</option>
        </select>
      </label>

      <label className="filter-label">Disponibilidad:
        <select onChange={(e) => setAvailability(e.target.value)} value={availability}>
          <option value="all">Todas</option>
          <option value="available">Con entradas</option>
          <option value="soldout">Agotadas</option>
        </select>
      </label>

      <div className="date-filters">
        <label className="date-field">Desde
          <div className="date-input-wrap">
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            <svg className="icon-calendar" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 11h10M7 15h10M7 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
          </div>
        </label>

        <label className="date-field">Hasta
          <div className="date-input-wrap">
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            <svg className="icon-calendar" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 11h10M7 15h10M7 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
          </div>
        </label>
      </div>

      <button className="btn" onClick={onClear}>Limpiar filtros</button>
    </div>
  )
}

export default ShowsFilters
