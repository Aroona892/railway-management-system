import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchSchedules } from '../services/schedulesService'
import './Schedules.css'

function formatDateYmd(date) {
  const d = new Date(date)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function getRouteEndpoints(schedule) {
  const stops = schedule?.route?.stops
  if (!Array.isArray(stops) || stops.length === 0) return { from: '—', to: '—' }
  const sorted = stops.slice().sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
  const first = sorted[0]?.station
  const last = sorted[sorted.length - 1]?.station
  const from = first?.city || first?.name || first?.code || '—'
  const to = last?.city || last?.name || last?.code || '—'
  return { from, to }
}

export function Schedules() {
  const navigate = useNavigate()
  const [date, setDate] = useState(() => formatDateYmd(new Date()))
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [items, setItems] = useState([])

  const query = useMemo(() => ({ date, from, to, active: true }), [date, from, to])

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      setError('')
      try {
        const next = await fetchSchedules(query)
        if (!cancelled) setItems(next)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load schedules')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [query])

  const handleClear = () => {
    setFrom('')
    setTo('')
  }

  return (
    <div className="schedules-page">
      <div className="schedules-container">
        <header className="schedules-header">
          <h1 className="schedules-title">Train Schedules</h1>
          <p className="schedules-subtitle">
            Search schedules by date and route, then continue to booking.
          </p>
        </header>

        <section className="schedules-panel">
          <div className="schedules-filters">
            <div className="filter-field">
              <label className="filter-label" htmlFor="schedule-date">
                Date
              </label>
              <input
                id="schedule-date"
                type="date"
                className="filter-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="filter-field">
              <label className="filter-label" htmlFor="schedule-from">
                From (code/city)
              </label>
              <input
                id="schedule-from"
                className="filter-input"
                placeholder="e.g., KHI / Karachi"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>

            <div className="filter-field">
              <label className="filter-label" htmlFor="schedule-to">
                To (code/city)
              </label>
              <input
                id="schedule-to"
                className="filter-input"
                placeholder="e.g., LHE / Lahore"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            <div className="filter-actions">
              <button type="button" className="btn btn-secondary" onClick={handleClear}>
                Clear
              </button>
              <button type="button" className="btn btn-primary" onClick={() => navigate('/book-now')}>
                Book Now
              </button>
            </div>
          </div>

          <div className="schedules-results">
            <div className="results-head">
              <h2 className="results-title">Results</h2>
              <div className="results-meta">
                {loading ? 'Loading…' : `${items.length} schedule${items.length === 1 ? '' : 's'}`}
              </div>
            </div>

            {error ? <div className="alert alert-error">{error}</div> : null}

            {!loading && !error && items.length === 0 ? (
              <div className="empty-state">
                <h3 className="empty-title">No schedules found</h3>
                <p className="empty-text">
                  Try a different date or broaden your From/To filters.
                </p>
              </div>
            ) : null}

            <div className="schedule-list" aria-busy={loading ? 'true' : 'false'}>
              {items.map((s) => {
                const trainName = s?.train?.name || 'Train'
                const trainNo = s?.train?.number || '—'
                const routeName = s?.route?.name || 'Route'
                const { from: fromLabel, to: toLabel } = getRouteEndpoints(s)
                const depTime = s?.departureTime || '—'
                const depDate = s?.departureDate ? formatDateYmd(s.departureDate) : date
                const runsOn = Array.isArray(s?.runsOn) ? s.runsOn.join(', ') : '—'

                return (
                  <article key={s._id} className="schedule-card">
                    <div className="schedule-top">
                      <div className="schedule-main">
                        <h3 className="schedule-train">
                          {trainName}{' '}
                          <span className="schedule-trainNo">({trainNo})</span>
                        </h3>
                        <div className="schedule-routeName">{routeName}</div>
                      </div>

                      <div className="schedule-pill">
                        <div className="pill-label">Departs</div>
                        <div className="pill-value">
                          {depDate} • {depTime}
                        </div>
                      </div>
                    </div>

                    <div className="schedule-routeRow">
                      <div className="route-point">
                        <span className="route-label">From</span>
                        <span className="route-value">{fromLabel}</span>
                      </div>
                      <div className="route-arrow">→</div>
                      <div className="route-point">
                        <span className="route-label">To</span>
                        <span className="route-value">{toLabel}</span>
                      </div>
                    </div>

                    <div className="schedule-grid">
                      <div className="detail-item">
                        <span className="detail-label">Runs on</span>
                        <span className="detail-value">{runsOn}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Status</span>
                        <span className="detail-value">{s?.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Stops</span>
                        <span className="detail-value">{s?.route?.stops?.length ?? 0}</span>
                      </div>
                    </div>

                    <div className="schedule-actions">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                          navigate('/book-now', {
                            state: {
                              selectedTrain: {
                                name: trainName,
                                number: trainNo,
                                source: fromLabel,
                                destination: toLabel,
                                departureTime: depTime,
                              },
                            },
                          })
                        }
                      >
                        Book this train
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

