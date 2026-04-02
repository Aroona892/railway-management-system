import './Footer.css'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__col">
          <h3 className="footer__heading">Company</h3>
          <ul className="footer__list">
            <li><a href="#about">About</a></li>
            <li><a href="#careers">Careers</a></li>
          </ul>
        </div>

        <div className="footer__col">
          <h3 className="footer__heading">Support</h3>
          <ul className="footer__list">
            <li><a href="#contact">Contact</a></li>
            <li><a href="#faqs">FAQs</a></li>
          </ul>
        </div>

        <div className="footer__col">
          <h3 className="footer__heading">Legal</h3>
          <ul className="footer__list">
            <li><a href="#privacy">Privacy</a></li>
            <li><a href="#terms">Terms</a></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright">© {new Date().getFullYear()} PakRail. All rights reserved.</p>
        <a href="/admin" className="footer__admin-link">Admin Portal</a>
      </div>
    </footer>
  )
}
