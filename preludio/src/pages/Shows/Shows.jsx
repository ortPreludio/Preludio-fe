import { Section } from '../../components/layout/Section/Section.jsx'
import { EventGrid } from '../../components/organisms/EventGrid/EventGrid.jsx'
import { useEffect, useState } from 'react'
import { useEventsStore } from '../../store/eventsStore.js'

export function Shows() {
  const { events, loading, error, fetchEvents } = useEventsStore();
  const [order, setOrder] = useState('asc')
  const [categoria, setCategoria] = useState('')

  useEffect(() => {
    // Fetch events with current filters
    fetchEvents({
      sort: 'fecha',
      order,
      categoria: categoria || undefined,
      limit: 100 // Get more events for the Shows page
    });
  }, [order, categoria, fetchEvents])

  return (
    <div className="page">
      <Section title="Todos los eventos">
        <div className="toolbar">
          <label>Orden:
            <select onChange={(e) => setOrder(e.target.value)} value={order}>
              <option value="asc">Ascendente</option>
              <option value="desc">Descendente</option>
            </select>
          </label>
          <label>Categoría:
            <select onChange={(e) => setCategoria(e.target.value)} value={categoria}>
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
        {!loading && !error && <EventGrid items={events} />}
      </Section>
    </div>
  )
}
