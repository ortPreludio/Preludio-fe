import { Section } from '../components/layout/Section.jsx'
import { EventGrid } from '../components/organisms/EventGrid.jsx'
import { useEffect, useState } from 'react'
import { fetchPublicEvents } from '../api/events.js'

export function Shows() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [order, setOrder] = useState('asc')
  const [categoria, setCategoria] = useState('')

  useEffect(() => {
    setLoading(true); setError(null)
    fetchPublicEvents({ sort: 'fecha', order, categoria: categoria || undefined, limit: 12 })
      .then(js => setItems(Array.isArray(js) ? js : js.items || []))
      .catch(e => setError(e.message || 'Error'))
      .finally(() => setLoading(false))
  }, [order, categoria])

  return (
    <div className="page">
      <Section title="Todos los eventos">
        <div className="toolbar">
          <label>Orden:
            <select onChange={(e)=> setOrder(e.target.value)} value={order}>
              <option value="asc">Ascendente</option>
              <option value="desc">Descendente</option>
            </select>
          </label>
          <label>Categoría:
            <select onChange={(e)=> setCategoria(e.target.value)} value={categoria}>
              <option value="">Todas</option>
              <option value="Concierto">Concierto</option>
              <option value="Teatro">Teatro</option>
              <option value="Deporte">Deporte</option>
              <option value="Festival">Festival</option>
              <option value="Otro">Otro</option>
            </select>
          </label>
        </div>
        {loading && <div className="loader">Cargando eventos…</div>}
        {error && <div className="error">Error: {error}</div>}
        {!loading && !error && <EventGrid items={items} />}
      </Section>
    </div>
  )
}
