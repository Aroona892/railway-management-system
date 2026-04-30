import mongoose from 'mongoose'

const routeStopSchema = new mongoose.Schema(
  {
    station: { type: mongoose.Schema.Types.ObjectId, ref: 'Station', required: true },
    sequence: { type: Number, required: true, min: 0 },
    arrivalOffsetMin: { type: Number, min: 0 },
    departureOffsetMin: { type: Number, min: 0 },
    dayOffset: { type: Number, default: 0, min: 0 },
    platform: { type: String, trim: true },
  },
  { _id: false },
)

const routeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    stops: { type: [routeStopSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

routeSchema.index({ code: 1 }, { unique: true })
routeSchema.index({ isActive: 1 })

export const Route = mongoose.model('Route', routeSchema)

