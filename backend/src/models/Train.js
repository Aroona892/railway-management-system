import mongoose from 'mongoose'

const coachSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, trim: true },
    class: {
      type: String,
      required: true,
      enum: ['SL', '3A', '2A', '1A', 'CC', '2S'],
    },
    seatCount: { type: Number, required: true, min: 1 },
  },
  { _id: false },
)

const trainSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    coaches: { type: [coachSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

trainSchema.index({ number: 1 }, { unique: true })

export const Train = mongoose.model('Train', trainSchema)

