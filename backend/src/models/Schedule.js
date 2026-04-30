import mongoose from 'mongoose'

const scheduleSchema = new mongoose.Schema(
  {
    train: { type: mongoose.Schema.Types.ObjectId, ref: 'Train', required: true, index: true },
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true, index: true },
    departureDate: { type: Date, required: true, index: true },
    departureTime: { type: String, required: true, trim: true }, // HH:mm (local)
    runsOn: {
      type: [String],
      default: [],
      enum: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

scheduleSchema.index({ train: 1, departureDate: 1 })

export const Schedule = mongoose.model('Schedule', scheduleSchema)

