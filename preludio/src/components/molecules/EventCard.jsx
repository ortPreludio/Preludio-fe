import { Button } from '../atoms/Button.jsx'
import { Text } from '../atoms/Text.jsx'
import { formatDateISOToLong } from '../../utils/format.js'

export function EventCard({ event }) {
  const fecha = formatDateISOToLong(event.fecha)
  const image = event.imagen || '/placeholder.png'
  const moreInfo = event.moreInfoUrl || null
  const buy = event.buyUrl || null

  return (
    <article className="event-card">
      <div className="event-card__media">
        <img src={image} alt={event.titulo} loading="lazy" />
      </div>
      <div className="event-card__body">
        <h3 className="event-card__title">{event.titulo}</h3>
        <Text muted>{fecha}{event.hora ? ` • ${event.hora} hs` : ''}</Text>
      </div>
      <div className="event-card__footer">
        <Button variant="ghost" as="a" href={moreInfo || '#'} disabled={!moreInfo}>Más info</Button>
        <Button variant="primary" as="a" href={buy || '#'} disabled={!buy}>Comprar</Button>
      </div>
    </article>
  )
}
