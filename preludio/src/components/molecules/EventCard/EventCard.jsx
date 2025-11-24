import { Link } from 'react-router-dom';
import { Button } from '../../atoms/Button/Button.jsx';
import { BuyButton } from '../BuyButton/BuyButton.jsx';
import './EventCard.css';
import { Text } from '../../atoms/Text/Text.jsx';
import { formatDateISOToLong } from '../../../utils/format.js';

export function EventCard({ event }) {
  const fecha = formatDateISOToLong(event.fecha);
  const image = event.imagen || '/placeholder.png';
  const id = event._id;

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
        <BuyButton
          eventId={id}
          entradasDisponibles={event.entradasDisponibles}
        >
          Comprar
        </BuyButton>
      </div>
    </article>
  );
}
