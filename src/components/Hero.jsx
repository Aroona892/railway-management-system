import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Hero.css'

/**
 * Hero headline + floating ticket booking widget (3D-style card).
 */
const TRAIN_CITIES = [
  'Karachi Cantonment',
  'Karachi City',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Peshawar'
]
export function Hero() {
  const navigate = useNavigate()
  const [origin, setOrigin] = useState('Karachi Cantonment')
  const [destination, setDestination] = useState('Lahore')
  const [date, setDate] = useState('')
  const [passengers, setPassengers] = useState('1')

  return (
    <section className="hero" id="home">
      <div className="hero__bg" aria-hidden />
      <div className="hero__inner">
        <div className="hero__copy">
          <p className="hero__eyebrow">National rail network</p>
          <h1 className="hero__title">
            Travel smarter across
            <span className="hero__title-line"> Pakistan</span>
          </h1>
          <p className="hero__lead">
            Book seats, check live schedules, and manage your reservations — all from one modern
            platform for Pakistan Railways.
          </p>
        </div>

        <div className="hero__widget-wrap" id="book">
          <div className="booking-widget">
            <div className="booking-widget__glow" aria-hidden />
            <header className="booking-widget__head">
              <h2 className="booking-widget__title">Book your journey</h2>
              <p className="booking-widget__sub">Same-day and advance tickets</p>
            </header>
            <form
              className="booking-widget__form"
              onSubmit={(e) => {
               e.preventDefault()
               navigate('/schedules')
              }}
            >
              <label className="booking-widget__field">
                <span className="booking-widget__label">From</span>
                <select
                 value={origin}
                 onChange={(e) => setOrigin(e.target.value)}
                 className="booking-widget__input booking-widget__select"
                >
                 {TRAIN_CITIES.map((city) => (
                  <option key={city} value={city}>
                   {city}
                  </option>
                 ))}
                </select>
              </label>
              <label className="booking-widget__field">
               <span className="booking-widget__label">To</span>
               <select
                 value={destination}
                 onChange={(e) => setDestination(e.target.value)}
                 className="booking-widget__input booking-widget__select"
               >
                 {TRAIN_CITIES.map((city) => (
                  <option key={city} value={city}>
                   {city}
                  </option>
                ))}
               </select>
              </label>
              <label className="booking-widget__field">
                <span className="booking-widget__label">Date</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="booking-widget__input"
                />
              </label>
              <label className="booking-widget__field">
                <span className="booking-widget__label">Passengers</span>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  className="booking-widget__input booking-widget__select"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={String(n)}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" className="booking-widget__submit">
                Search trains
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
