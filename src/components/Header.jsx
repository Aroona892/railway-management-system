import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '#book', label: 'Book Tickets' },
  { to: '#schedules', label: 'Schedules' },
  { to: '/about', label: 'About' },
]

/**
 * Floating pill navbar: fixed below top, desktop links + mobile hamburger.
 * Conditionally renders simplified view for Admin pages.
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation();
  
  // Check if we are on the admin dashboard or admin login page
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <header className="site-header">
      <div className="site-header__shell">
        <nav
          className="site-header__nav"
          aria-label="Primary"
        >
          {/* Logo is always visible */}
          <Link to="/" className="site-header__brand">
            <span className="site-header__brand-mark">PakRail</span>
            <span className="site-header__brand-sub">Pakistan Railways</span>
          </Link>

          {!isAdminPage ? (
            /* --- PASSENGER VIEW (Normal links & buttons) --- */
            <>
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
            </>
          ) : (
            /* --- ADMIN VIEW (Simplified) --- */
            <div className="site-header__actions">
              <Link to="/" className="site-header__cta">
                Return Home
              </Link>
            </div>
          )}
        </nav>
      </div>
      
      {/* Only show mobile menu backdrop if it's open and NOT on an admin page */}
      {menuOpen && !isAdminPage && (
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