import { Link } from 'react-router-dom';
import './Home.css';
import { Hero } from '../../components/layout/Hero/Hero.jsx'
import { Section } from '../../components/layout/Section/Section.jsx'
import { EventGrid } from '../../components/organisms/EventGrid/EventGrid.jsx'
import { EventCarousel } from '../../components/organisms/EventCarousel/EventCarousel.jsx'
import { useEffect, useState } from 'react'
import { fetchPublicEvents } from '../../api/events.js'

export function Home() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [order] = useState('asc')
  const [categoria] = useState('')

  useEffect(() => {
    setLoading(true); setError(null)
    fetchPublicEvents({ sort: 'fecha', order, categoria: categoria || undefined, limit: 12 })
      .then(js => setItems(Array.isArray(js) ? js : js.items || []))
      .catch(e => setError(e.message || 'Error'))
      .finally(() => setLoading(false))
  }, [order, categoria])

  return (
    <div className="page">
      <Hero />
      <Section title="Nuevos shows">
        {loading && <div className="loader">Cargando eventos…</div>}
        {error && <div className="error">Error: {error}</div>}
        {!loading && !error && (
          <>
            {/* Desktop: Carousel */}
            <div className="home-event-carousel">
              <EventCarousel items={items} />
            </div>
            {/* Mobile: Grid */}
            <div className="home-event-grid">
              <EventGrid items={items} />
            </div>
            {/* Ver todos button */}
            <div className="view-all-container">
              <Link to="/shows" className="btn btn-primary">Ver todos los shows →</Link>
            </div>
          </>
        )}
      </Section>
      <Section title="¿Qué opinan nuestros usuarios?">
        <div className="reviews-cta">
          <p>Lee las experiencias de otros usuarios o comparte la tuya</p>
          <Link to="/reviews" className="btn-reviews">
            Ver todas las reseñas ⭐
          </Link>
        </div>
      </Section>
    </div>
  )
}
