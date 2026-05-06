export async function fetchSchedules({ date, from, to, active } = {}) {
  const params = new URLSearchParams()
  if (date) params.set('date', date)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  if (active !== undefined && active !== null && active !== '') params.set('active', String(active))

  const url = `/api/v1/schedules${params.size ? `?${params.toString()}` : ''}`

  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Failed to load schedules (${res.status})`)
  }
  const data = await res.json()
  return data.items ?? []
}

