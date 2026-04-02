import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Login.css'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle login logic here (e.g., API call)
    console.log('Login attempt:', { email, password })
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="Enter your password"
            />
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="checkbox-input"
              />
              <label htmlFor="remember-me" className="checkbox-label">
                Remember me
              </label>
            </div>

            <div className="forgot-password">
              <a href="#" className="forgot-link">
                Forgot password?
              </a>
            </div>
          </div>

          <button type="submit" className="btn-primary">
            Log In
          </button>
        </form>

        <div className="login-footer">
          <p className="footer-text">
            Don't have an account?{' '}
            <Link to="/signup" className="signup-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
