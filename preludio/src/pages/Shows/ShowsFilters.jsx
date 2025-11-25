import './Shows.css'
import { useState, useEffect } from 'react'
import { request } from '../../lib/infra/http-client'

export function ShowsFilters({
  sortBy, setSortBy,
  categoria, setCategoria,
  hideSoldOut, setHideSoldOut,
  onClear,
}) {
  const [categories, setCategories] = useState([]);

  // Buscar categorías desde backend al montar
  useEffect(() => {
    request('/events/categories')
      .then(data => {
        setCategories(data.categories || []);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        // Fallback
        setCategories(['CONCIERTO', 'TEATRO', 'DEPORTE', 'FESTIVAL', 'OTRO']);
      });
  }, []);

  return (
    <div className="toolbar">
      <label className="filter-label">Ordenar por:
        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
          <option value="fecha-asc">Fecha: más próximos</option>
          <option value="fecha-desc">Fecha: más lejanos</option>
          <option value="precioBase-asc">Precio: menor a mayor</option>
          <option value="precioBase-desc">Precio: mayor a menor</option>
        </select>
      </label>

      <label className="filter-label">Categoría:
        <select onChange={(e) => setCategoria(e.target.value)} value={categoria}>
          <option value="">Todas</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </label>

      <label className="filter-checkbox">
        <input
          type="checkbox"
          checked={hideSoldOut}
          onChange={(e) => setHideSoldOut(e.target.checked)}
        />
        <span>Ocultar eventos agotados</span>
      </label>

      <button className="btn" onClick={onClear}>Limpiar filtros</button>
    </div>
  )
}

export default ShowsFilters
