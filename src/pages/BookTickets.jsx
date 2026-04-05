import { useNavigate } from 'react-router-dom'
import './BookTickets.css'

const AVAILABLE_TRAINS = [
  {
    id: 1,
    name: 'Green Line Express',
    number: 'GLE-123',
    source: 'Karachi Cantonment',
    destination: 'Islamabad',
    departureTime: '08:00 AM',
    arrivalTime: '05:00 AM (Next Day)',
    availableSeats: 45,
    fare: 2500
  },
  {
    id: 2,
    name: 'Karachi Express',
    number: 'KE-456',
    source: 'Lahore',
    destination: 'Karachi City',
    departureTime: '10:00 PM',
    arrivalTime: '04:00 PM (Next Day)',
    availableSeats: 32,
    fare: 2200
  },
  {
    id: 3,
    name: 'Awam Express',
    number: 'AE-789',
    source: 'Peshawar',
    destination: 'Karachi',
    departureTime: '06:00 PM',
    arrivalTime: '05:00 AM (3 Days)',
    availableSeats: 28,
    fare: 1800
  },
  {
    id: 4,
    name: 'Tezgam Express',
    number: 'TE-101',
    source: 'Karachi City',
    destination: 'Lahore',
    departureTime: '02:00 PM',
    arrivalTime: '08:00 AM (Next Day)',
    availableSeats: 50,
    fare: 2400
  }
]

export function BookTickets() {
  const navigate = useNavigate()

  const handleBookNow = (train) => {
    navigate('/book-now', { state: { selectedTrain: train } })
  }

  return (
    <div className="book-tickets-page">
      <div className="book-tickets-container">
        <header className="book-tickets-header">
          <h1 className="book-tickets-title">Book Your Train Tickets</h1>
          <p className="book-tickets-subtitle">
            Select from available trains and continue to secure your booking
          </p>
        </header>

        <section className="available-trains-section">
          <h2 className="section-title">Available Trains</h2>

          <div className="trains-list">
            {AVAILABLE_TRAINS.map((train) => (
              <div key={train.id} className="train-card">
                <div className="train-card-top">
                  <div className="train-main-info">
                    <h3 className="train-name">{train.name}</h3>
                    <p className="train-number">Train No: {train.number}</p>
                  </div>
                  <div className="train-fare-box">
                    <span className="fare-label">Fare</span>
                    <span className="fare-amount">PKR {train.fare}</span>
                  </div>
                </div>

                <div className="train-route-row">
                  <div className="route-point">
                    <span className="route-label">From</span>
                    <span className="route-value">{train.source}</span>
                  </div>
                  <div className="route-arrow">→</div>
                  <div className="route-point">
                    <span className="route-label">To</span>
                    <span className="route-value">{train.destination}</span>
                  </div>
                </div>

                <div className="train-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Departure</span>
                    <span className="detail-value">{train.departureTime}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Arrival</span>
                    <span className="detail-value">{train.arrivalTime}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Available Seats</span>
                    <span className="detail-value">{train.availableSeats}</span>
                  </div>
                </div>

                <div className="train-card-actions">
                  <button
                    type="button"
                    className="btn btn-book"
                    onClick={() => handleBookNow(train)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}