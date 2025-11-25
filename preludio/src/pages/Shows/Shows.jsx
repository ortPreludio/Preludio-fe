import { Section } from '../../components/layout/Section/Section.jsx'
import { EventGrid } from '../../components/organisms/EventGrid/EventGrid.jsx'
import { useEffect, useState, useRef, useCallback } from 'react'
import { fetchPublicEvents } from '../../lib/services/events.service.js'

export function Shows() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState('asc');
  const [categoria, setCategoria] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const loadingRef = useRef(false);

  // Reset to page 1 when filters change
  useEffect(() => {
    setEvents([]);
    setPage(1);
    setHasMore(true);
  }, [order, categoria]);

  // Fetch events based on current page and filters
  useEffect(() => {
    if (!hasMore || loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    fetchPublicEvents({
      sort: 'fecha',
      order,
      categoria: categoria || undefined,
      page,
      limit: 6 // Load 6 events per page
    })
      .then(data => {
        const newEvents = data.items || [];
        const total = data.total || 0;

        setEvents(prev => page === 1 ? newEvents : [...prev, ...newEvents]);

        // Check if there are more events to load
        const loadedCount = page === 1 ? newEvents.length : events.length + newEvents.length;
        setHasMore(loadedCount < total);

        setLoading(false);
        loadingRef.current = false;
      })
      .catch(e => {
        setError(e.message || 'Error al cargar eventos');
        setLoading(false);
        loadingRef.current = false;
      });
  }, [page, order, categoria]);

  // Intersection Observer callback
  const lastEventRef = useCallback((node) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
        setPage(prev => prev + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  }, [loading, hasMore]);

  return (
    <div className="page shows-page">
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

        {error && <div className="error">Error: {error}</div>}

        {events.length > 0 && (
          <>
            <EventGrid items={events} />
            {/* Invisible element to trigger loading more */}
            {hasMore && <div ref={lastEventRef} style={{ height: '20px' }} />}
          </>
        )}

        {loading && <div className="loader-inline">Cargando eventos...</div>}

        {!loading && events.length === 0 && !error && (
          <div className="empty">No se encontraron eventos</div>
        )}

        {!hasMore && events.length > 0 && (
          <div className="loader-inline" style={{ opacity: 0.6 }}>
            No hay más eventos
          </div>
        )}
      </Section>
    </div>
  )
}
