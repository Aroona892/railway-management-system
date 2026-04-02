import { useState } from 'react'
import { Link } from 'react-router-dom'
import './SignUp.css'

export function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    cnicNumber: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    // TODO: Add signup API call here
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-card__header">
            <div className="signup-brand">
              <span className="signup-brand__name">PakRail</span>
              <span className="signup-brand__sub">Pakistan Railways</span>
            </div>
          </div>

          <div className="signup-card__content">
            <h1 className="signup-card__title">Create an Account</h1>
            <p className="signup-card__subtitle">Join PakRail to start your journey</p>

            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cnicNumber" className="form-label">
                  CNIC Number
                </label>
                <input
                  id="cnicNumber"
                  name="cnicNumber"
                  type="text"
                  required
                  value={formData.cnicNumber}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="12345-6789012-3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="you@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="signup-btn"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="signup-card__footer">
              <p className="signup-card__footer-text">
                Already have an account?{' '}
                <Link to="/login" className="signin-link">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
