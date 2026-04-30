import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['ADMIN', 'STAFF', 'PASSENGER'],
      default: 'PASSENGER',
      index: true,
    },
  },
  { timestamps: true },
)

export const User = mongoose.model('User', userSchema)

