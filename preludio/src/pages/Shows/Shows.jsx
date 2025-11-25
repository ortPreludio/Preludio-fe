import { Section } from '../../components/layout/Section/Section.jsx'
import { EventGrid } from '../../components/organisms/EventGrid/EventGrid.jsx'
import { useEffect, useMemo, useState } from 'react'
import { useEventsStore } from '../../store/eventsStore.js'
import ShowsFilters from './ShowsFilters.jsx'
import './Shows.css'

export function Shows() {
  const { events, loading, error, fetchEvents } = useEventsStore();

  // NOTE: initial fetch moved below so we can include filter-driven params

  // Filter state
  const [order, setOrder] = useState('asc');
  const [categoria, setCategoria] = useState('');
  const [publicacion, setPublicacion] = useState('');
  // Removed `lugar` filter (we keep the UI focused and simple)
  const [price, setPrice] = useState('all'); // all | free | paid
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [availability, setAvailability] = useState('all'); // all | available | soldout | nodata

  // Fetch events when backend-supported filters change
  useEffect(() => {
    // Build params the backend already supports to reduce transfer
    const params = { sort: 'fecha', order, limit: 200 };
    if (categoria) params.categoria = categoria;
    if (publicacion) params.estadoPublicacion = publicacion;
    if (dateFrom) params.from = dateFrom;
    if (dateTo) params.to = dateTo;

    // Fetch from backend using the service; remaining filters (price/availability)
    // will be applied client-side over the returned items.
    fetchEvents(params);
  }, [fetchEvents, order, categoria, publicacion, dateFrom, dateTo]);

  // Derived filter options from available events (only valid options)
  const options = useMemo(() => {
    const cats = new Set();
    const pubs = new Set();
    // removed lugares collection - not needed for simplified filters
    events.forEach(e => {
      if (e.categoria) cats.add(e.categoria);
      if (e.estadoPublicacion) pubs.add(e.estadoPublicacion);
      // keep other derived options only
    });
    return {
      categorias: Array.from(cats).sort(),
      publicaciones: Array.from(pubs).sort(),
      // no lugares
    };
  }, [events]);

  // Apply filters client-side for fast UI updates
  const filtered = useMemo(() => {
    let list = Array.isArray(events) ? [...events] : [];

    // Publication filter
    if (publicacion) list = list.filter(e => e.estadoPublicacion === publicacion);

    // Category filter
    if (categoria) list = list.filter(e => e.categoria === categoria);

    // Price filter
    if (price === 'free') list = list.filter(e => Number(e.precioBase || 0) === 0);
    if (price === 'paid') list = list.filter(e => Number(e.precioBase || 0) > 0);

    // Date range
    if (dateFrom) {
      const from = new Date(dateFrom);
      list = list.filter(e => new Date(e.fecha) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      // include the whole day
      to.setHours(23,59,59,999);
      list = list.filter(e => new Date(e.fecha) <= to);
    }

    // Availability filter (requires entradasDisponibles present)
    if (availability === 'available') {
      list = list.filter(e => typeof e.entradasDisponibles === 'number' ? e.entradasDisponibles > 0 : true);
    }
    if (availability === 'soldout') {
      list = list.filter(e => typeof e.entradasDisponibles === 'number' ? e.entradasDisponibles === 0 : false);
    }

    // Order
    list.sort((a, b) => {
      const da = new Date(a.fecha).getTime() || 0;
      const db = new Date(b.fecha).getTime() || 0;
      return order === 'asc' ? da - db : db - da;
    });

    return list;
  }, [events, publicacion, categoria, price, dateFrom, dateTo, availability, order]);

  // If there's a field/state called `evento` used in other contexts: note that
  // within this Shows page we do not use a local `evento` state. The word
  // `evento` appears as a property inside ticket objects elsewhere (e.g. ticket.evento)
  // which is data, not a UI state. Therefore there is no visible 'evento' state
  // to show/clean here. If you have a specific `evento` state you want reviewed,
  // tell me where it is and I'll adjust it (hide or move to internal logic).

  return (
    <div className="page">
      <Section title="Todos los eventos">
        <ShowsFilters
          order={order} setOrder={setOrder}
          categoria={categoria} setCategoria={setCategoria}
          publicacion={publicacion} setPublicacion={setPublicacion}
          price={price} setPrice={setPrice}
          availability={availability} setAvailability={setAvailability}
          dateFrom={dateFrom} setDateFrom={setDateFrom}
          dateTo={dateTo} setDateTo={setDateTo}
          options={options}
          onClear={() => { setCategoria(''); setPublicacion(''); setPrice('all'); setAvailability('all'); setDateFrom(''); setDateTo(''); }}
        />

        {loading && <div className="loader">Cargando eventos…</div>}
        {error && <div className="error">Error: {error}</div>}
        {!loading && !error && <EventGrid items={filtered} />}
      </Section>
    </div>
  )
}
