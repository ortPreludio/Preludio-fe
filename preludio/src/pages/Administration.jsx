import { Hero } from '../components/layout/Hero.jsx'
import { Section } from '../components/layout/Section.jsx'
import { EventGrid } from '../components/organisms/EventGrid.jsx'
import { useEffect, useState } from 'react'
import { fetchPublicEvents } from '../api/events.js'

export function Administration() {
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


  const handleFilter = (e) => {
    e.preventDefault();
    logout();
    navigate("/");
  };

  return (
    <div className="page">
      <Section title="Nuevos shows">
        <div className="toolbar">
          <button className="btn btn-ghost" onClick={handleFilter}>
            Users
          </button>
          <button className="btn btn-ghost" onClick={handleFilter}>
            Events
          </button>
        </div>
        {loading && <div className="loader">Cargando eventos…</div>}
        {error && <div className="error">Error: {error}</div>}
        {!loading && !error && <EventGrid items={items} />}
      </Section>
    </div>
  )
}
