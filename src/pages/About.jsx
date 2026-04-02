import './About.css'

export function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        <header className="about-header">
          <h1 className="about-title">About PakRail</h1>
          <p className="about-subtitle">Modernizing rail travel across Pakistan</p>
        </header>

        <section className="about-section">
          <h2 className="about-section__title">Our Mission</h2>
          <p className="about-section__text">
            PakRail is dedicated to transforming how Pakistanis travel by rail. We provide a modern,
            user-friendly platform that makes booking tickets, tracking trains, and managing
            reservations simple and accessible for everyone.
          </p>
        </section>

        <section className="about-section">
          <h2 className="about-section__title">What We Offer</h2>
          <ul className="about-list">
            <li>Real-time train tracking and live arrival updates</li>
            <li>Instant online seat booking with secure payments</li>
            <li>Easy reservation management and cancellations</li>
            <li>Comprehensive route information and schedules</li>
            <li>Mobile-optimized platform for all devices</li>
          </ul>
        </section>

        <section className="about-section">
          <h2 className="about-section__title">Our Vision</h2>
          <p className="about-section__text">
            We envision a future where rail travel in Pakistan is seamless, transparent, and
            accessible to all. By leveraging modern technology, we're making it easier than ever
            to connect with loved ones, explore new destinations, and experience the convenience
            of efficient rail transportation.
          </p>
        </section>

        <section className="about-section">
          <h2 className="about-section__title">Why Choose PakRail?</h2>
          <p className="about-section__text">
            With PakRail, you get a trusted partner for your rail journeys. Our platform combines
            reliability, transparency, and user-centric design to deliver the best booking experience
            in Pakistan. From search to booking to travel, we're here to make every step smooth and
            enjoyable.
          </p>
        </section>
      </div>
    </div>
  )
}
