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

  // Small IntersectionObserver to add .in-view when sections enter viewport
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.animate-on-scroll'));
    if (!els.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.12 });

    els.forEach(el => obs.observe(el));

    return () => obs.disconnect();
  }, []);

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
            {/* Ubicar aquí las dos tarjetas: Cómo llegar + Estacionamiento (moved abajo to always render) */}
          </>
        )}
        {/* Las tarjetas de ubicación deben mostrarse siempre, incluso si los eventos están cargando */}
        <div className="home-locations animate-on-scroll">
          <a href="https://www.google.com/maps/search/?api=1&query=Humboldt+450" target="_blank" rel="noopener noreferrer" className="location-card" aria-label="Cómo llegar Humboldt 450">
            <svg className="location-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <path d="M12 21s8-4.5 8-11a8 8 0 10-16 0c0 6.5 8 11 8 11z" fill="currentColor" />
              <circle cx="12" cy="10.5" r="2.2" fill="var(--bg-2)" />
            </svg>
            <div className="location-content">
              <h3>Cómo llegar</h3>
              <p>Humboldt 450 — Encuentra la mejor ruta para llegar a tu próximo show.</p>
            </div>
          </a>

          <a href="https://www.google.com/maps/search/estacionamiento+Humboldt+450" target="_blank" rel="noopener noreferrer" className="location-card" aria-label="Estacionamiento cerca de Humboldt 450">
            <svg className="location-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <path d="M3 13c0-1.1.9-2 2-2h1l1-3h10l1 3h1c1.1 0 2 .9 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-2-2v-1H6v1a2 2 0 0 1-2 2H4a1 1 0 0 1-1-1v-4z" fill="currentColor"/>
              <circle cx="7.5" cy="16.5" r="1" fill="var(--bg-2)" />
              <circle cx="16.5" cy="16.5" r="1" fill="var(--bg-2)" />
            </svg>
            <div className="location-content">
              <h3>Estacionamiento</h3>
              <p>Busca estacionamientos y opciones de parking cercanas al lugar.</p>
            </div>
          </a>
        </div>
      </Section>
      
      {/* FAQ CTA - sólo un enlace bonito a la página interna de FAQs */}
      <Section title="Preguntas Frecuentes">
        <div className="home-faq animate-on-scroll">
          <div className="faq-cta-card">
            <div className="faq-cta-card__content">
              <h3>Preguntas frecuentes</h3>
              <p className="faq-intro">Respondemos todas las dudas sobre entradas, acceso, seguridad y servicios.</p>
            </div>
            <div className="faq-cta-card__action">
              <Link to="/faq" className="btn btn-primary">Ir a Preguntas frecuentes →</Link>
            </div>
          </div>
        </div>
      </Section>
      <Section title="¿Qué opinan nuestros usuarios?">
        <div className="reviews-cta">
          <p>Lee las experiencias de otros usuarios o comparte la tuya</p>
          <Link to="/reviews" className="btn-reviews">
            Ver todas las reseñas
          </Link>
        </div>
      </Section>
    </div>
  )
}
