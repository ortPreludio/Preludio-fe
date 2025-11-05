import { Button } from '../atoms/Button.jsx'
import { Text } from '../atoms/Text.jsx'

function fmt(dateISO){
  try{
    const d = new Date(dateISO)
    const m = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
    return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`
  } catch { return '' }
}

export function EventCard({ event }){
  const fecha = fmt(event.fecha)
  const image = event.imagen || '/placeholder.png'
  return (
    <article className="event-card">
      <div className="event-card__media"><img src={image} alt={event.titulo} loading="lazy" /></div>
      <div className="event-card__body">
        <h3 className="event-card__title">{event.titulo}</h3>
        <Text muted>{fecha}{event.hora ? ` • ${event.hora} hs` : ''}</Text>
      </div>
      <div className="event-card__footer">
        <Button variant="ghost" as="a" href={event.moreInfoUrl || '#'} disabled={!event.moreInfoUrl}>Más info</Button>
        <Button variant="primary" as="a" href={event.buyUrl || '#'} disabled={!event.buyUrl}>Comprar</Button>
      </div>
    </article>
  )
}
