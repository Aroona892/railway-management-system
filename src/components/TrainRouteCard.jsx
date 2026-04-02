import './TrainRouteCard.css'

/**
 * Gradient 3D-style card for a sample train route.
 */
export function TrainRouteCard({
  routeName,
  from,
  to,
  duration,
  badge,
  variant = 'a',
}) {
  return (
    <article className={`route-card route-card--${variant}`}>
      <div className="route-card__inner">
        {badge && <span className="route-card__badge">{badge}</span>}
        <h3 className="route-card__title">{routeName}</h3>
        <p className="route-card__route">
          <span className="route-card__city">{from}</span>
          <span className="route-card__arrow" aria-hidden>
            →
          </span>
          <span className="route-card__city">{to}</span>
        </p>
        <p className="route-card__meta">
          <span className="route-card__duration">{duration}</span>
          <span className="route-card__hint">Express service</span>
        </p>
      </div>
    </article>
  )
}
