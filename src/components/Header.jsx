import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '#book', label: 'Book Tickets' },
  { to: '#schedules', label: 'Schedules' },
  { to: '/about', label: 'About' },
]

/**
 * Floating pill navbar: fixed below top, desktop links + mobile hamburger.
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="site-header__shell">
        <nav
          className="site-header__nav"
          aria-label="Primary"
        >
          <Link to="/" className="site-header__brand">
            <span className="site-header__brand-mark">PakRail</span>
            <span className="site-header__brand-sub">Pakistan Railways</span>
          </Link>

          <ul
            id="site-header-menu"
            className={`site-header__links ${menuOpen ? 'site-header__links--open' : ''}`}
          >
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                {to.startsWith('#') ? (
                  <a
                    href={to}
                    className="site-header__link"
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    to={to}
                    className="site-header__link"
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="site-header__actions">
            <Link to="/login" className="site-header__login">
              Login
            </Link>
            <Link to="/signup" className="site-header__signup">
              Sign Up
            </Link>
            <a href="#book" className="site-header__cta">
              Book Now
            </a>
            <button
              type="button"
              className="site-header__menu-btn"
              aria-expanded={menuOpen}
              aria-controls="site-header-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="site-header__menu-icon" aria-hidden />
            </button>
          </div>
        </nav>
      </div>
      {menuOpen && (
        <button
          type="button"
          className="site-header__backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  )
}
