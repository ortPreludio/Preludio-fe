import { EventCard } from '../molecules/EventCard.jsx'
export function EventGrid({ items = [] }) {
  if (!items.length) return <div className="empty">No hay eventos disponibles</div>
  return (
    <div className="event-grid">
      {items.map(ev => <EventCard key={ev._id || ev.id} event={ev} />)}
    </div>
  )
}
