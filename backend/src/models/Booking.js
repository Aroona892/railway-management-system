import mongoose from 'mongoose'

const passengerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 1 },
    gender: { type: String, required: true, trim: true },
  },
  { _id: false },
)

const seatAssignmentSchema = new mongoose.Schema(
  {
    passengerName: { type: String, required: true },
    coachCode: { type: String, required: true },
    seatNumber: { type: Number, required: true },
    classType: { type: String, required: true },
  },
  { _id: false },
)

const bookingSchema = new mongoose.Schema(
  {
    pnr: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    trainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Train',
      required: true,
    },
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Schedule',
      required: true,
      index: true,
    },
    fromStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
      required: true,
    },
    toStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
      required: true,
    },
    // Stored as YYYY-MM-DD string so seat-availability queries can match exactly
    date: { type: String, required: true },
    classType: {
      type: String,
      required: true,
      enum: ['SL', '3A', '2A', '1A', 'CC', '2S'],
    },
    passengers: { type: [passengerSchema], required: true },
    seatsAssigned: { type: [seatAssignmentSchema], default: [] },
    status: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED'],
      default: 'CONFIRMED',
    },
    cancelledAt: { type: Date },
  },
  { timestamps: true },
)

// Compound index used by availability and seat-allocation queries
bookingSchema.index({ scheduleId: 1, date: 1, classType: 1, status: 1 })

export const Booking = mongoose.model('Booking', bookingSchema)