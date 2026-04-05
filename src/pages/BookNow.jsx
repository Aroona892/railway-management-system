import './BookNow.css'

const TRAIN_DATA = {
  name: 'Green Line Express',
  number: 'GLE-123',
  source: 'Karachi Cantonment',
  destination: 'Islamabad',
  departureTime: '08:00 AM',
  arrivalTime: '05:00 AM (Next Day)',
  availableSeats: 45,
  fare: 2500
}

export function BookNow() {
  return (
    <div className="book-now-page">
      <div className="book-now-container">
        <header className="book-now-header">
          <h1 className="book-now-title">Book Your Train Ticket</h1>
          <p className="book-now-subtitle">Secure and easy booking for your railway journey</p>
        </header>

        <section className="train-info-section">
          <h2 className="section-title">Train Information</h2>
          <div className="train-details">
            <div className="detail-pair">
              <div className="detail-item">
                <span className="detail-label">Train Name</span>
                <span className="detail-value">{TRAIN_DATA.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Train Number</span>
                <span className="detail-value">{TRAIN_DATA.number}</span>
              </div>
            </div>
            <div className="detail-pair">
              <div className="detail-item">
                <span className="detail-label">From</span>
                <span className="detail-value">{TRAIN_DATA.source}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">To</span>
                <span className="detail-value">{TRAIN_DATA.destination}</span>
              </div>
            </div>
            <div className="detail-pair">
              <div className="detail-item">
                <span className="detail-label">Departure</span>
                <span className="detail-value">{TRAIN_DATA.departureTime}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Arrival</span>
                <span className="detail-value">{TRAIN_DATA.arrivalTime}</span>
              </div>
            </div>
            <div className="detail-pair">
              <div className="detail-item">
                <span className="detail-label">Available Seats</span>
                <span className="detail-value">{TRAIN_DATA.availableSeats}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Fare per Ticket</span>
                <span className="detail-value">PKR {TRAIN_DATA.fare}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="travel-info-section">
          <h2 className="section-title">Travel Information</h2>
          <form className="travel-form">
            <div className="form-group">
              <label htmlFor="journey-date">Journey Date</label>
              <input type="date" id="journey-date" name="journey-date" required />
            </div>
            <div className="form-group">
              <label htmlFor="seat-class">Seat/Class</label>
              <select id="seat-class" name="seat-class" required>
                <option value="">Select Class</option>
                <option value="economy">Economy</option>
                <option value="business">Business</option>
                <option value="first-class">First Class</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="passengers">Number of Passengers</label>
              <input type="number" id="passengers" name="passengers" min="1" max="10" required />
            </div>
          </form>
        </section>

        <section className="passenger-details-section">
          <h2 className="section-title">Passenger Details</h2>
          <form className="passenger-form">
            <div className="form-group">
              <label htmlFor="full-name">Full Name</label>
              <input type="text" id="full-name" name="full-name" required />
            </div>
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input type="number" id="age" name="age" min="1" max="120" required />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select id="gender" name="gender" required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="cnic">CNIC/ID Card Number</label>
              <input type="text" id="cnic" name="cnic" pattern="[0-9]{13}" placeholder="1234567890123" required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
          </form>
        </section>

        <section className="fare-summary-section">
          <h2 className="section-title">Fare Summary</h2>
          <div className="fare-details">
            <div className="fare-row">
              <span className="fare-label">Ticket Fare:</span>
              <span className="fare-value">PKR {TRAIN_DATA.fare}</span>
            </div>
            <div className="fare-row">
              <span className="fare-label">Service Charges:</span>
              <span className="fare-value">PKR 100</span>
            </div>
            <div className="fare-row total">
              <span className="fare-label">Total Amount:</span>
              <span className="fare-value">PKR {TRAIN_DATA.fare + 100}</span>
            </div>
          </div>
        </section>

        <section className="booking-confirmation-section">
          <h2 className="section-title">Booking Confirmation</h2>
          <p className="confirmation-note">
            By proceeding with the booking, you agree to our terms and conditions.
            A confirmation email will be sent to your registered email address after successful booking.
          </p>
          <div className="action-buttons">
            <button type="button" className="btn btn-cancel">Cancel</button>
            <button type="submit" className="btn btn-book">Book Ticket</button>
          </div>
        </section>
      </div>
    </div>
  )
}