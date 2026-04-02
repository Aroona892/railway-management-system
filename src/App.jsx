import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { TrainRouteCard } from './components/TrainRouteCard'
import './App.css'

const SAMPLE_ROUTES = [
  {
    routeName: 'Green Line Express',
    from: 'Karachi Cantonment',
    to: 'Islamabad',
    duration: '~21 hours',
    badge: 'Popular',
    variant: 'a',
  },
  {
    routeName: 'Karachi Express',
    from: 'Lahore',
    to: 'Karachi City',
    duration: '~17 hours',
    badge: 'Daily',
    variant: 'b',
  },
  {
    routeName: 'Awam Express',
    from: 'Peshawar',
    to: 'Karachi',
    duration: '~32 hours',
    badge: 'Economy',
    variant: 'c',
  },
]

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <section
          className="routes-section"
          id="schedules"
          aria-labelledby="routes-heading"
        >
          <div className="routes-section__inner">
            <header className="routes-section__head">
              <h2 id="routes-heading" className="routes-section__title">
                Featured routes
              </h2>
              <p className="routes-section__lead">
                Sample intercity services — schedules and fares in the full system.
              </p>
            </header>
            <div className="routes-section__grid">
              {SAMPLE_ROUTES.map((props) => (
                <TrainRouteCard key={props.routeName} {...props} />
              ))}
            </div>
          </div>
        </section>
        <section id="freight" className="freight-teaser" aria-label="Freight">
          <div className="freight-teaser__inner">
            <p>
              <strong>Freight &amp; logistics</strong> — booking and tracking modules
              plug in here in the full management system.
            </p>
          </div>
        </section>
        <footer className="site-footer" id="about">
          <p className="site-footer__text">
            Pakistan Railways Management System — demo landing. Corporate and support
            links can connect from this area in production.
          </p>
        </footer>
      </main>
    </div>
  )
}

export default App
