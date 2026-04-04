import { useState } from 'react'
import './AdminDashboard.css'

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview')

  const menuItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'trains', label: 'Manage Trains' },
    { id: 'bookings', label: 'Passenger Bookings' },
  ]

  const mockTrains = [
    {
      id: 1,
      name: 'Green Line Express',
      route: 'Karachi to Islamabad',
      status: 'On Time',
      departure: '08:00',
      arrival: '20:30',
      capacity: 500,
      booked: 387
    },
    {
      id: 2,
      name: 'Karakoram Express',
      route: 'Karachi to Lahore',
      status: 'Delayed',
      departure: '22:00',
      arrival: '08:30',
      delay: '30 mins',
      capacity: 400,
      booked: 245
    },
    {
      id: 3,
      name: 'Awam Express',
      route: 'Karachi to Peshawar',
      status: 'On Time',
      departure: '16:00',
      arrival: '04:30',
      capacity: 350,
      booked: 298
    },
    {
      id: 4,
      name: 'Tezgam Express',
      route: 'Karachi to Quetta',
      status: 'Cancelled',
      departure: '14:00',
      arrival: '02:00',
      reason: 'Technical issues',
      capacity: 300,
      booked: 0
    }
  ]

  const mockRecentBookings = [
    {
      id: 1,
      passengerName: 'Ahmed Khan',
      route: 'Karachi to Lahore',
      train: 'Karakoram Express',
      seatNumber: '12A',
      bookingDate: '2026-04-03',
      status: 'Confirmed'
    },
    {
      id: 2,
      passengerName: 'Fatima Ali',
      route: 'Islamabad to Karachi',
      train: 'Green Line Express',
      seatNumber: '5B',
      bookingDate: '2026-04-03',
      status: 'Confirmed'
    },
    {
      id: 3,
      passengerName: 'Muhammad Saeed',
      route: 'Lahore to Peshawar',
      train: 'Awam Express',
      seatNumber: '8C',
      bookingDate: '2026-04-02',
      status: 'Confirmed'
    },
    {
      id: 4,
      passengerName: 'Ayesha Malik',
      route: 'Karachi to Quetta',
      train: 'Tezgam Express',
      seatNumber: '3A',
      bookingDate: '2026-04-02',
      status: 'Cancelled'
    },
    {
      id: 5,
      passengerName: 'Hassan Raza',
      route: 'Peshawar to Karachi',
      train: 'Awam Express',
      seatNumber: '15D',
      bookingDate: '2026-04-01',
      status: 'Confirmed'
    }
  ]

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__brand">
            <span className="admin-sidebar__brand-text">PakRail Admin</span>
          </div>
        </div>

        <nav className="admin-sidebar__nav">
          <ul className="admin-sidebar__menu">
            {menuItems.map((item) => (
              <li key={item.id} className="admin-sidebar__menu-item">
                <button
                  className={`admin-sidebar__menu-link ${
                    activeSection === item.id ? 'admin-sidebar__menu-link--active' : ''
                  }`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <span className="admin-sidebar__menu-text">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-sidebar__footer">
          <button className="admin-sidebar__logout">
            <span className="admin-sidebar__logout-text">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-main__header">
          <div className="admin-main__header-content">
            <h1 className="admin-main__title">
              {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
            </h1>
            <div className="admin-main__header-actions">
              <div className="admin-main__user">

                <span className="admin-main__user-name">Admin User</span>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-main__content">
          <div className="admin-content">
            {activeSection === 'overview' && (
              <div className="overview-stats">
                <div className="stat-card">
                  <div className="stat-card__content">
                    <h3 className="stat-card__value">1,245</h3>
                    <p className="stat-card__label">Total Bookings</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card__content">
                    <h3 className="stat-card__value">18</h3>
                    <p className="stat-card__label">Active Trains</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card__content">
                    <h3 className="stat-card__value">₨ 450,000</h3>
                    <p className="stat-card__label">Today's Revenue</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'trains' && (
              <div className="admin-section">
                <div className="admin-section__header">
                  <h2 className="admin-section__title">Train Management</h2>
                  <p className="admin-section__subtitle">Monitor and manage train operations</p>
                  <button className="admin-btn admin-btn--primary">Add New Train</button>
                </div>

                <div className="data-table">
                  <div className="data-table__header">
                    <div className="data-table__row">
                      <div className="data-table__cell data-table__cell--header">Train Name</div>
                      <div className="data-table__cell data-table__cell--header">Route</div>
                      <div className="data-table__cell data-table__cell--header">Status</div>
                      <div className="data-table__cell data-table__cell--header">Departure</div>
                      <div className="data-table__cell data-table__cell--header">Arrival</div>
                      <div className="data-table__cell data-table__cell--header">Capacity</div>
                      <div className="data-table__cell data-table__cell--header">Actions</div>
                    </div>
                  </div>

                  <div className="data-table__body">
                    {mockTrains.map((train) => (
                      <div key={train.id} className="data-table__row">
                        <div className="data-table__cell">
                          <div className="train-info">
                            <span className="train-info__name">{train.name}</span>
                          </div>
                        </div>
                        <div className="data-table__cell">{train.route}</div>
                        <div className="data-table__cell">
                          <span className={`status-badge status-badge--${train.status.toLowerCase().replace(' ', '-')}`}>
                            {train.status}
                            {train.delay && ` (${train.delay})`}
                          </span>
                        </div>
                        <div className="data-table__cell">{train.departure}</div>
                        <div className="data-table__cell">{train.arrival}</div>
                        <div className="data-table__cell">
                          <span className="capacity-info">
                            {train.booked}/{train.capacity}
                          </span>
                        </div>
                        <div className="data-table__cell">
                          <div className="action-buttons">
                            <button className="action-btn action-btn--edit">Edit</button>
                            <button className="action-btn action-btn--delete">Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'bookings' && (
              <div className="admin-section">
                <div className="admin-section__header">
                  <h2 className="admin-section__title">Passenger Bookings</h2>
                  <p className="admin-section__subtitle">Manage and track passenger reservations</p>
                </div>

                <div className="data-table">
                  <div className="data-table__header">
                    <div className="data-table__row">
                      <div className="data-table__cell data-table__cell--header">Passenger</div>
                      <div className="data-table__cell data-table__cell--header">Route</div>
                      <div className="data-table__cell data-table__cell--header">Train</div>
                      <div className="data-table__cell data-table__cell--header">Seat</div>
                      <div className="data-table__cell data-table__cell--header">Booking Date</div>
                      <div className="data-table__cell data-table__cell--header">Status</div>
                      <div className="data-table__cell data-table__cell--header">Actions</div>
                    </div>
                  </div>

                  <div className="data-table__body">
                    {mockRecentBookings.map((booking) => (
                      <div key={booking.id} className="data-table__row">
                        <div className="data-table__cell">
                          <div className="passenger-info">
                            <span className="passenger-info__name">{booking.passengerName}</span>
                          </div>
                        </div>
                        <div className="data-table__cell">{booking.route}</div>
                        <div className="data-table__cell">{booking.train}</div>
                        <div className="data-table__cell">
                          <span className="seat-badge">{booking.seatNumber}</span>
                        </div>
                        <div className="data-table__cell">{new Date(booking.bookingDate).toLocaleDateString()}</div>
                        <div className="data-table__cell">
                          <span className={`status-badge status-badge--${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="data-table__cell">
                          <div className="action-buttons">
                            <button className="action-btn action-btn--view">View</button>
                            <button className="action-btn action-btn--cancel">Cancel</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
