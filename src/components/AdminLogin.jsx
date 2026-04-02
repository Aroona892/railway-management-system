import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminDashboard } from './AdminDashboard'
import './AdminLogin.css'

export function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const authStatus = localStorage.getItem('isAdminAuth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const validEmails = ['l227473@lhr.nu.edu.pk', 'l227506@lhr.nu.edu.pk']
    const validPassword = '123456'

    if (validEmails.includes(email) && password === validPassword) {
      localStorage.setItem('isAdminAuth', 'true')
      setIsAuthenticated(true)
    } else {
      setError('Invalid admin credentials')
    }
  }

  if (isAuthenticated) {
    return <AdminDashboard />
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1 className="admin-login-title">PakRail Admin Portal</h1>
          <p className="admin-login-subtitle">Access the administrative dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label htmlFor="admin-email" className="admin-form-label">Email address</label>
            <input
              type="email"
              id="admin-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="admin-form-input"
              placeholder="admin@pakrail.com"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-password" className="admin-form-label">Password</label>
            <input
              type="password"
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="admin-form-input"
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="admin-error-message">{error}</p>}

          <button type="submit" className="admin-login-btn">
            Access Admin Portal
          </button>
        </form>
      </div>
    </div>
  )
}