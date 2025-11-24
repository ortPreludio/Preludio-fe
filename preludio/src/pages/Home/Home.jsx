import { Link } from 'react-router-dom';
import './Home.css';
import { Hero } from '../../components/layout/Hero/Hero.jsx'
import { Section } from '../../components/layout/Section/Section.jsx'
import { EventGrid } from '../../components/organisms/EventGrid/EventGrid.jsx'
import { EventCarousel } from '../../components/organisms/EventCarousel/EventCarousel.jsx'
import { useEffect } from 'react'
import { useEventsStore } from '../../store/eventsStore.js'

export function Home() {
  const { events, loading, error, fetchEvents, isStale } = useEventsStore();

  useEffect(() => {
    // Fetch events if store is empty or data is stale
    if (events.length === 0 || isStale()) {
      fetchEvents({ sort: 'fecha', order: 'asc', limit: 12 });
    }
  }, [events.length, fetchEvents, isStale]);

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
              <EventCarousel items={events} />
            </div>
            {/* Mobile: Grid */}
            <div className="home-event-grid">
              <EventGrid items={events} />
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
