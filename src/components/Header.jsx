import { useState } from 'react'
import './Header.css'

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#book', label: 'Book Tickets' },
  { href: '#schedules', label: 'Schedules' },
  { href: '#freight', label: 'Freight' },
  { href: '#about', label: 'About' },
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
          <a href="#home" className="site-header__brand">
            <span className="site-header__brand-mark">PakRail</span>
            <span className="site-header__brand-sub">Pakistan Railways</span>
          </a>

          <ul
            id="site-header-menu"
            className={`site-header__links ${menuOpen ? 'site-header__links--open' : ''}`}
          >
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="site-header__link"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div className="site-header__actions">
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
