import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    train: {
      id: Number,
      name: String,
      number: String,
      source: String,
      destination: String,
      departureTime: String,
      arrivalTime: String,
      fare: Number
    },
    travelDetails: {
      journeyDate: String,
      seatClass: String,
      numPassengers: Number
    },
    passengers: [
      {
        name: String,
        age: Number,
        gender: String,
        cnic: String
      }
    ],
    contact: {
      phone: String,
      email: String
    },
    pricing: {
      ticketTotal: Number,
      serviceCharge: Number,
      totalAmount: Number
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed'
    },
    emailSent: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Booking', bookingSchema)
