import bcrypt from 'bcryptjs'
import { Router } from 'express'

import { envServer } from '../../../config/env.js'
import { User } from '../../../models/User.js'
import { signAccessToken } from '../../../auth/tokens.js'
import { validate } from '../../../middleware/validate.js'
import { HttpError } from '../../../utils/http-error.js'
import { asyncHandler } from '../../../utils/async-handler.js'
import { loginSchema, registerSchema } from './schemas.js'

export const authRouter = Router()

authRouter.post(
  '/register',
  validate({ body: registerSchema }),
  asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body

    const existing = await User.findOne({ email }).lean()
    if (existing) throw new HttpError(409, 'Email already in use')

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role ?? 'PASSENGER',
    })

    const token = signAccessToken(
      { userId: user._id.toString(), role: user.role },
      { secret: envServer.JWT_SECRET, expiresIn: envServer.JWT_EXPIRES_IN },
    )

    res.status(201).json({
      token,
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
    })
  }),
)

authRouter.post(
  '/login',
  validate({ body: loginSchema }),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) throw new HttpError(401, 'Invalid credentials')

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) throw new HttpError(401, 'Invalid credentials')

    const token = signAccessToken(
      { userId: user._id.toString(), role: user.role },
      { secret: envServer.JWT_SECRET, expiresIn: envServer.JWT_EXPIRES_IN },
    )

    res.json({
      token,
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
    })
  }),
)

