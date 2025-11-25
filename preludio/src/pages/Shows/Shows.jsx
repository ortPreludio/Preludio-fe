import { Section } from '../../components/layout/Section/Section.jsx'
import { EventGrid } from '../../components/organisms/EventGrid/EventGrid.jsx'
import { useEffect, useState, useRef, useCallback } from 'react'
import { fetchPublicEvents } from '../../lib/services/events.service.js'
import ShowsFilters from './ShowsFilters.jsx'
import './Shows.css'

export function Shows() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter state (simplified)
  const [sortBy, setSortBy] = useState('fecha-asc');
  const [categoria, setCategoria] = useState('');
  const [hideSoldOut, setHideSoldOut] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const observerRef = useRef(null);
  const loadingRef = useRef(false);

  // Reset pagination when filters change
  useEffect(() => {
    setEvents([]);
    setPage(1);
    setHasMore(true);
    setTotal(0);
  }, [sortBy, categoria, hideSoldOut]);

  // Fetch events with pagination
  useEffect(() => {
    if (!hasMore && page > 1) return;
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    // Parse sortBy into sort field and order
    const [sortField, sortOrder] = sortBy.split('-');

    const params = {
      sort: sortField,
      order: sortOrder,
      page,
      limit: 6
    };

    if (categoria) params.categoria = categoria;
    if (hideSoldOut) params.hideSoldOut = 'true';

    fetchPublicEvents(params)
      .then(data => {
        const newEvents = data.items || [];
        const totalCount = data.total || 0;

        setEvents(prev => page === 1 ? newEvents : [...prev, ...newEvents]);
        setTotal(totalCount);
        setLoading(false);
        loadingRef.current = false;
      })
      .catch(e => {
        setError(e.message || 'Error al cargar eventos');
        setLoading(false);
        loadingRef.current = false;
      });
  }, [page, sortBy, categoria, hideSoldOut, hasMore]);

  // Update hasMore when events or total changes
  useEffect(() => {
    setHasMore(events.length < total);
  }, [events.length, total]);

  // Intersection Observer for infinite scroll
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

  const handleClearFilters = () => {
    setSortBy('fecha-asc');
    setCategoria('');
    setHideSoldOut(false);
  };

  return (
    <div className="page shows-page">
      <Section title="Todos los eventos">
        <ShowsFilters
          sortBy={sortBy} setSortBy={setSortBy}
          categoria={categoria} setCategoria={setCategoria}
          hideSoldOut={hideSoldOut} setHideSoldOut={setHideSoldOut}
          onClear={handleClearFilters}
        />

        {error && <div className="error">Error: {error}</div>}

        {events.length > 0 && (
          <>
            <EventGrid items={events} />
            {/* Trigger for loading more */}
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
