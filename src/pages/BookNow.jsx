import { useState } from 'react'
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
  const [formData, setFormData] = useState({
    journeyDate: '',
    seatClass: '',
    passengers: 1,
    fullName: '',
    age: '',
    gender: '',
    cnic: '',
    phone: '',
    email: ''
  })

  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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
    if (formData.passengers < 1) {
      newErrors.passengers = 'Number of passengers must be at least 1'
    }

    // Passenger Details
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    if (!formData.age || isNaN(formData.age) || formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age (1-120)'
    }
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender'
    }
    if (!formData.cnic.trim()) {
      newErrors.cnic = 'CNIC/ID number is required'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      // Here you would typically send the data to an API
      alert('Booking submitted successfully! A confirmation email will be sent.')
      // Reset form or redirect
    }
  }
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
                  name="passengers"
                  min="1"
                  max="10"
                  value={formData.passengers}
                  onChange={handleInputChange}
                  className={errors.passengers ? 'error' : ''}
                  required
                />
                {errors.passengers && <span className="error-message">{errors.passengers}</span>}
              </div>
            </div>
          </section>

        <section className="passenger-details-section">
          <h2 className="section-title">Passenger Details</h2>
          <div className="passenger-form">
            <div className="form-group">
              <label htmlFor="full-name">Full Name</label>
              <input
                type="text"
                id="full-name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={errors.fullName ? 'error' : ''}
                required
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                min="1"
                max="120"
                value={formData.age}
                onChange={handleInputChange}
                className={errors.age ? 'error' : ''}
                required
              />
              {errors.age && <span className="error-message">{errors.age}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={errors.gender ? 'error' : ''}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <span className="error-message">{errors.gender}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="cnic">CNIC/ID Card Number</label>
              <input
                type="text"
                id="cnic"
                name="cnic"
                pattern="[0-9]{13}"
                placeholder="1234567890123"
                value={formData.cnic}
                onChange={handleInputChange}
                className={errors.cnic ? 'error' : ''}
                required
              />
              {errors.cnic && <span className="error-message">{errors.cnic}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={errors.phone ? 'error' : ''}
                required
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                required
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>
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
        </form>
      </div>
    </div>
  )
}