import mongoose from 'mongoose'

const stationSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, trim: true },
  },
  { timestamps: true },
)

stationSchema.index({ code: 1 }, { unique: true })

export const Station = mongoose.model('Station', stationSchema)

