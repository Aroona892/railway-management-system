import './FeatureCard.css'

/**
 * Feature card component for displaying app modules/features.
 */
export function FeatureCard({ title, description, icon }) {
  return (
    <article className="feature-card">
      <div className="feature-card__inner">
        <div className="feature-card__icon" aria-hidden>
          {icon}
        </div>
        <h3 className="feature-card__title">{title}</h3>
        <p className="feature-card__description">{description}</p>
      </div>
    </article>
  )
}