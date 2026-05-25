import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { generateToken } from '../utils/jwt.js'
import { hashPassword, comparePassword } from '../utils/password.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { loginSchema, signupSchema } from '../validators/auth.js'

const router = Router()

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }
    const valid = await comparePassword(password, user.password)
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }
    const token = generateToken({ id: user.id, email: user.email, role: user.role })
    res.json({
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status, createdAt: user.createdAt.toISOString() },
        token,
      },
    })
  } catch (e) {
    next(e)
  }
})

router.post('/signup', validate(signupSchema), async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      res.status(409).json({ error: 'Email already registered' })
      return
    }
    const hashed = await hashPassword(password)
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    })
    const token = generateToken({ id: user.id, email: user.email, role: user.role })
    res.status(201).json({
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status, createdAt: user.createdAt.toISOString() },
        token,
      },
    })
  } catch (e) {
    next(e)
  }
})

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } })
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.json({
      data: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status, createdAt: user.createdAt.toISOString() },
    })
  } catch (e) {
    next(e)
  }
})

router.get('/users', authenticate, authorize('admin'), async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    })
    res.json({ data: users })
  } catch (e) {
    next(e)
  }
})

export default router
