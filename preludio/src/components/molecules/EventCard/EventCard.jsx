import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../atoms/Button/Button.jsx'
import './EventCard.css';
import { Text } from '../../atoms/Text/Text.jsx'
import { formatDateISOToLong } from '../../../utils/format.js'

export function EventCard({ event }) {
  const navigate = useNavigate();
  const fecha = formatDateISOToLong(event.fecha)
  const image = event.imagen || '/placeholder.png'
  const id = event._id
  const precio = event.precioBase ?? event.precio ?? 0

  const handleBuy = () => {
    navigate(`/checkout?evento=${event._id}`);
  };

  return (
    <article className="event-card">
      <div className="event-card__media" style={{ '--event-image': `url(${image})` }}>
        <img src={image} alt={event.titulo} loading="lazy" />
      </div>
      <div className="event-card__body">
        <h3 className="event-card__title">{event.titulo}</h3>
        <Text muted>{fecha}{event.hora ? ` • ${event.hora} hs` : ''}</Text>
      </div>
      <div className="event-card__footer">
        {id ? (
          <Link to={`/events/${id}`} className="btn btn-ghost">Más info</Link>
        ) : (
          <Button variant="ghost" disabled>Más info</Button>
        )}
        <Button variant="primary" onClick={handleBuy}>Comprar</Button>
      </div>
    </article>
  )
}
