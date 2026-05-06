import bcrypt from 'bcryptjs'

import { envServer } from '../src/config/env.js'
import { connectMongo } from '../src/db/connect.js'
import { User } from '../src/models/User.js'
import { Station } from '../src/models/Station.js'
import { Train } from '../src/models/Train.js'
import { Route } from '../src/models/Route.js'
import { FareRule } from '../src/models/FareRule.js'
import { Schedule } from '../src/models/Schedule.js'

async function upsertAdmin() {
  const email = envServer.SEED_ADMIN_EMAIL
  const existing = await User.findOne({ email })
  if (existing) return existing

  const passwordHash = await bcrypt.hash(envServer.SEED_ADMIN_PASSWORD, 10)
  return User.create({
    name: envServer.SEED_ADMIN_NAME,
    email,
    passwordHash,
    role: 'ADMIN',
  })
}

async function upsertStations() {
  const docs = [
    { code: 'LHR', name: 'Lahore Junction', city: 'Lahore' },
    { code: 'KHI', name: 'Karachi City', city: 'Karachi' },
    { code: 'ISB', name: 'Islamabad', city: 'Islamabad' },
  ]

  const out = []
  for (const d of docs) {
    const s = await Station.findOneAndUpdate({ code: d.code }, d, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    })
    out.push(s)
  }
  return out
}

async function upsertTrain() {
  return Train.findOneAndUpdate(
    { number: '101' },
    {
      number: '101',
      name: 'RMS Express',
      coaches: [
        { code: 'S1', class: 'SL', seatCount: 72 },
        { code: 'A1', class: '3A', seatCount: 64 },
      ],
      isActive: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )
}

async function upsertRoute(stations) {
  const byCode = new Map(stations.map((s) => [s.code, s]))
  const lhr = byCode.get('LHR')
  const isb = byCode.get('ISB')
  const khi = byCode.get('KHI')
  if (!lhr || !isb || !khi) throw new Error('Seed stations missing')

  return Route.findOneAndUpdate(
    { code: 'LHR-KHI' },
    {
      name: 'Lahore to Karachi',
      code: 'LHR-KHI',
      stops: [
        { station: lhr._id, sequence: 0, departureOffsetMin: 0, dayOffset: 0, platform: '1' },
        { station: isb._id, sequence: 1, arrivalOffsetMin: 180, departureOffsetMin: 200, dayOffset: 0 },
        { station: khi._id, sequence: 2, arrivalOffsetMin: 900, dayOffset: 0, platform: '2' },
      ],
      isActive: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )
}

async function upsertFares() {
  const rules = [
    { class: 'SL', baseFare: 50, perKm: 1.2, minFare: 50 },
    { class: '3A', baseFare: 150, perKm: 2.5, minFare: 150 },
  ]

  for (const r of rules) {
    await FareRule.findOneAndUpdate({ class: r.class }, r, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    })
  }
}

function nextDaysAtMidnightUtc(daysFromNow) {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  d.setUTCDate(d.getUTCDate() + daysFromNow)
  return d
}

async function upsertSchedules({ train, route }) {
  const docs = [
    {
      train: train._id,
      route: route._id,
      departureDate: nextDaysAtMidnightUtc(0),
      departureTime: '08:00',
      runsOn: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      isActive: true,
    },
    {
      train: train._id,
      route: route._id,
      departureDate: nextDaysAtMidnightUtc(1),
      departureTime: '20:30',
      runsOn: ['MON', 'WED', 'FRI', 'SUN'],
      isActive: true,
    },
    {
      train: train._id,
      route: route._id,
      departureDate: nextDaysAtMidnightUtc(2),
      departureTime: '14:15',
      runsOn: ['TUE', 'THU', 'SAT'],
      isActive: true,
    },
  ]

  for (const d of docs) {
    await Schedule.findOneAndUpdate(
      { train: d.train, route: d.route, departureDate: d.departureDate, departureTime: d.departureTime },
      d,
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )
  }
}

async function main() {
  await connectMongo(envServer.MONGODB_URI)

  const admin = await upsertAdmin()
  const stations = await upsertStations()
  const train = await upsertTrain()
  const route = await upsertRoute(stations)
  await upsertFares()
  await upsertSchedules({ train, route })

  console.log('Seed complete')
  console.log('Admin:', admin.email)
  console.log('Train:', train.number)
  console.log('Route:', route.code)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

