import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { TrainRouteCard } from './components/TrainRouteCard'
import { FeatureCard } from './components/FeatureCard'
import { Footer } from './components/Footer'
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

const FEATURES = [
  {
    title: 'Live Route Tracking',
    description: 'Stay ahead with real-time train status, live arrival predictions, and route updates.',
    icon: '🔍',
  },
  {
    title: 'Instant Seat Booking',
    description: 'Lock your favorite seat in seconds and enjoy fast, secure checkout from your phone.',
    icon: '🎫',
  },
  {
    title: 'Manage Reservations',
    description: 'Easily modify or cancel your upcoming trips with flexible, hassle-free controls.',
    icon: '📋',
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
        <section
          className="features-section"
          id="features"
        >
          <div className="features-section__inner">
            <header className="features-section__head">
              <h2 className="features-section__title">Why travel with PakRail?</h2>
              <p className="features-section__lead">Everything you need for a seamless journey.</p>
            </header>
            <div className="features-section__grid">
              {FEATURES.map((props) => (
                <FeatureCard key={props.title} {...props} />
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}

export default App
