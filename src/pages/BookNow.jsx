import { useState } from 'react'
import './BookNow.css'

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

export function BookNow() {
  const [selectedTrainId, setSelectedTrainId] = useState(1)
  const [formData, setFormData] = useState({
    journeyDate: '',
    seatClass: '',
    numPassengers: 1,
    passengers: [{ name: '', age: '', gender: '', cnic: '' }],
    contactPhone: '',
    contactEmail: ''
  })

  const [showModal, setShowModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const selectedTrain = AVAILABLE_TRAINS.find(train => train.id === selectedTrainId) || AVAILABLE_TRAINS[0]

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === 'numPassengers') {
      const num = parseInt(value) || 1
      setFormData(prev => ({
        ...prev,
        numPassengers: num,
        passengers: Array.from({ length: num }, (_, i) => prev.passengers[i] || { name: '', age: '', gender: '', cnic: '' })
      }))
    } else if (name.startsWith('passenger-')) {
      const [, indexStr, field] = name.split('-')
      const index = parseInt(indexStr)
      setFormData(prev => ({
        ...prev,
        passengers: prev.passengers.map((p, i) => i === index ? { ...p, [field]: value } : p)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Travel Information
    if (!formData.journeyDate) {
      newErrors.journeyDate = 'Please select a journey date'
    }
    if (!formData.seatClass) {
      newErrors.seatClass = 'Please select a seat class'
    }
    if (formData.numPassengers < 1) {
      newErrors.numPassengers = 'Number of passengers must be at least 1'
    }

    // Passenger Details
    formData.passengers.forEach((passenger, index) => {
      if (!passenger.name.trim()) {
        newErrors[`passenger-${index}-name`] = 'Full name is required'
      } else if (!/^[a-zA-Z\s]+$/.test(passenger.name.trim())) {
        newErrors[`passenger-${index}-name`] = 'Full name should contain only letters and spaces'
      }

      if (!passenger.age || isNaN(passenger.age) || passenger.age < 1 || passenger.age > 120) {
        newErrors[`passenger-${index}-age`] = 'Please enter a valid age (1-120)'
      }

      if (!passenger.gender) {
        newErrors[`passenger-${index}-gender`] = 'Please select a gender'
      }

      if (!passenger.cnic.trim()) {
        newErrors[`passenger-${index}-cnic`] = 'CNIC/ID number is required'
      }
    })

    // Contact Details
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'Phone number is required'
    } else if (!/^[0-9+\-\s]+$/.test(formData.contactPhone.trim())) {
      newErrors.contactPhone = 'Phone number should contain only numbers, spaces, + or -'
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      setShowModal(true)
    }
  }

  const handleConfirmBooking = () => {
    setShowModal(false)
    setShowSuccess(true)
    // Here you would typically send the data to an API
  }

  const handleEditDetails = () => {
    setShowModal(false)
  }
  return (
    <div className="book-now-page">
      <div className="book-now-container">
        <header className="book-now-header">
          <h1 className="book-now-title">Book Your Train Ticket</h1>
          <p className="book-now-subtitle">Secure and easy booking for your railway journey</p>
        </header>

        <section className="train-selection-section">
          <h2 className="section-title">Select Your Train</h2>
          <div className="train-selection-form">
            <div className="form-group">
              <label htmlFor="train-select">Available Trains</label>
              <select
                id="train-select"
                value={selectedTrainId}
                onChange={(e) => setSelectedTrainId(Number(e.target.value))}
              >
                {AVAILABLE_TRAINS.map(train => (
                  <option key={train.id} value={train.id}>
                    {train.name} ({train.source} → {train.destination})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="train-info-section">
          <h2 className="section-title">Train Information</h2>
          <div className="train-details">
            <div className="detail-pair">
              <div className="detail-item">
                <span className="detail-label">Train Name</span>
                <span className="detail-value">{selectedTrain.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Train Number</span>
                <span className="detail-value">{selectedTrain.number}</span>
              </div>
            </div>
            <div className="detail-pair">
              <div className="detail-item">
                <span className="detail-label">From</span>
                <span className="detail-value">{selectedTrain.source}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">To</span>
                <span className="detail-value">{selectedTrain.destination}</span>
              </div>
            </div>
            <div className="detail-pair">
              <div className="detail-item">
                <span className="detail-label">Departure</span>
                <span className="detail-value">{selectedTrain.departureTime}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Arrival</span>
                <span className="detail-value">{selectedTrain.arrivalTime}</span>
              </div>
            </div>
            <div className="detail-pair">
              <div className="detail-item">
                <span className="detail-label">Available Seats</span>
                <span className="detail-value">{selectedTrain.availableSeats}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Fare per Ticket</span>
                <span className="detail-value">PKR {selectedTrain.fare}</span>
              </div>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit}>
          <section className="travel-info-section">
            <h2 className="section-title">Travel Information</h2>
            <div className="travel-form">
              <div className="form-group">
                <label htmlFor="journey-date">Journey Date</label>
                <input
                  type="date"
                  id="journey-date"
                  name="journeyDate"
                  value={formData.journeyDate}
                  onChange={handleInputChange}
                  className={errors.journeyDate ? 'error' : ''}
                  required
                />
                {errors.journeyDate && <span className="error-message">{errors.journeyDate}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="seat-class">Seat/Class</label>
                <select
                  id="seat-class"
                  name="seatClass"
                  value={formData.seatClass}
                  onChange={handleInputChange}
                  className={errors.seatClass ? 'error' : ''}
                  required
                >
                  <option value="">Select Class</option>
                  <option value="economy">Economy</option>
                  <option value="business">Business</option>
                  <option value="first-class">First Class</option>
                </select>
                {errors.seatClass && <span className="error-message">{errors.seatClass}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="passengers">Number of Passengers</label>
                <input
                  type="number"
                  id="passengers"
                  name="numPassengers"
                  min="1"
                  max="10"
                  value={formData.numPassengers}
                  onChange={handleInputChange}
                  className={errors.numPassengers ? 'error' : ''}
                  required
                />
                {errors.numPassengers && <span className="error-message">{errors.numPassengers}</span>}
              </div>
            </div>
          </section>

        <section className="passenger-details-section">
          <h2 className="section-title">Passenger Details</h2>
          <div className="passengers-container">
            {formData.passengers.map((passenger, index) => (
              <div key={index} className="passenger-card">
                <h3 className="passenger-title">Passenger {index + 1}</h3>
                <div className="passenger-form">
                  <div className="form-group">
                    <label htmlFor={`passenger-${index}-name`}>Full Name</label>
                    <input
                      type="text"
                      id={`passenger-${index}-name`}
                      name={`passenger-${index}-name`}
                      value={passenger.name}
                      onChange={handleInputChange}
                      className={errors[`passenger-${index}-name`] ? 'error' : ''}
                      required
                    />
                    {errors[`passenger-${index}-name`] && <span className="error-message">{errors[`passenger-${index}-name`]}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor={`passenger-${index}-age`}>Age</label>
                    <input
                      type="number"
                      id={`passenger-${index}-age`}
                      name={`passenger-${index}-age`}
                      min="1"
                      max="120"
                      value={passenger.age}
                      onChange={handleInputChange}
                      className={errors[`passenger-${index}-age`] ? 'error' : ''}
                      required
                    />
                    {errors[`passenger-${index}-age`] && <span className="error-message">{errors[`passenger-${index}-age`]}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor={`passenger-${index}-gender`}>Gender</label>
                    <select
                      id={`passenger-${index}-gender`}
                      name={`passenger-${index}-gender`}
                      value={passenger.gender}
                      onChange={handleInputChange}
                      className={errors[`passenger-${index}-gender`] ? 'error' : ''}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors[`passenger-${index}-gender`] && <span className="error-message">{errors[`passenger-${index}-gender`]}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor={`passenger-${index}-cnic`}>CNIC/ID Card Number</label>
                    <input
                      type="text"
                      id={`passenger-${index}-cnic`}
                      name={`passenger-${index}-cnic`}
                      pattern="[0-9]{13}"
                      placeholder="1234567890123"
                      value={passenger.cnic}
                      onChange={handleInputChange}
                      className={errors[`passenger-${index}-cnic`] ? 'error' : ''}
                      required
                    />
                    {errors[`passenger-${index}-cnic`] && <span className="error-message">{errors[`passenger-${index}-cnic`]}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="contact-details-section">
          <h2 className="section-title">Contact Details</h2>
          <div className="contact-form">
            <div className="form-group">
              <label htmlFor="contact-phone">Phone Number</label>
              <input
                type="tel"
                id="contact-phone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                className={errors.contactPhone ? 'error' : ''}
                required
              />
              {errors.contactPhone && <span className="error-message">{errors.contactPhone}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="contact-email">Email</label>
              <input
                type="email"
                id="contact-email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                className={errors.contactEmail ? 'error' : ''}
                required
              />
              {errors.contactEmail && <span className="error-message">{errors.contactEmail}</span>}
            </div>
          </div>
        </section>

        <section className="fare-summary-section">
          <h2 className="section-title">Fare Summary</h2>
          <div className="fare-details">
            <div className="fare-row">
              <span className="fare-label">Ticket Fare ({formData.numPassengers} × PKR {selectedTrain.fare}):</span>
              <span className="fare-value">PKR {selectedTrain.fare * formData.numPassengers}</span>
            </div>
            <div className="fare-row">
              <span className="fare-label">Service Charges:</span>
              <span className="fare-value">PKR 100</span>
            </div>
            <div className="fare-row total">
              <span className="fare-label">Total Amount:</span>
              <span className="fare-value">PKR {selectedTrain.fare * formData.numPassengers + 100}</span>
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
        </form>

        {showSuccess && (
          <section className="success-section">
            <div className="success-message">
              <h2 className="success-title">Booking Successful!</h2>
              <p className="success-text">
                Your train ticket has been booked successfully. A confirmation email has been sent to {formData.contactEmail}.
              </p>
              <p className="success-text">
                Please check your email for the booking details and e-ticket.
              </p>
            </div>
          </section>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Confirm Your Booking</h2>
            <div className="booking-summary">
              <div className="summary-item">
                <span className="summary-label">Train:</span>
                <span className="summary-value">{selectedTrain.name} ({selectedTrain.number})</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Route:</span>
                <span className="summary-value">{selectedTrain.source} → {selectedTrain.destination}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Date:</span>
                <span className="summary-value">{formData.journeyDate}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Class:</span>
                <span className="summary-value">{formData.seatClass}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Passengers:</span>
                <span className="summary-value">{formData.numPassengers}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Passenger Names:</span>
                <span className="summary-value">
                  {formData.passengers.map(p => p.name).join(', ')}
                </span>
              </div>
              <div className="summary-item total">
                <span className="summary-label">Total Amount:</span>
                <span className="summary-value">PKR {selectedTrain.fare * formData.numPassengers + 100}</span>
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-edit" onClick={handleEditDetails}>
                Edit Details
              </button>
              <button type="button" className="btn btn-confirm" onClick={handleConfirmBooking}>
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}