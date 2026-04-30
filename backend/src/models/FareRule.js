import mongoose from 'mongoose'

const fareRuleSchema = new mongoose.Schema(
  {
    class: { type: String, required: true, enum: ['SL', '3A', '2A', '1A', 'CC', '2S'] },
    currency: { type: String, default: 'INR', trim: true },
    baseFare: { type: Number, required: true, min: 0 },
    perKm: { type: Number, required: true, min: 0 },
    minFare: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

fareRuleSchema.index({ class: 1 }, { unique: true })
fareRuleSchema.index({ isActive: 1 })

export const FareRule = mongoose.model('FareRule', fareRuleSchema)

