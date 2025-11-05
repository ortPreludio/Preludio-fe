import { useEffect, useState } from 'react'
import { Header } from '../components/layout/Header.jsx'
import { Hero } from '../components/layout/Hero.jsx'
import { Section } from '../components/layout/Section.jsx'
import { EventGrid } from '../components/organisms/EventGrid.jsx'
import { eventService } from '../services/eventService.js'

export function Home(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [order, setOrder] = useState('asc')
  const [categoria, setCategoria] = useState('')

  useEffect(()=>{
    setLoading(true); setError(null)
    eventService.listPublic({ sort:'fecha', order, categoria: categoria || undefined, limit: 12 })
      .then(data => setItems(Array.isArray(data) ? data : (data.items || [])))
      .catch(err => setError(err.message || 'Error'))
      .finally(()=> setLoading(false))
  }, [order, categoria])

  return (
    <div className="page">
      <Header />
      <Hero />
      <Section title="Nuevos shows">
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
