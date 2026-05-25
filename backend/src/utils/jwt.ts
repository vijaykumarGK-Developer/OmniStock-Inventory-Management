import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'

const JWT_SECRET = process.env.JWT_SECRET ?? crypto.randomBytes(32).toString('hex')

export function generateToken(user: { id: number; email: string; role: string }): string {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: '7d',
  })
}

export function verifyToken(token: string): { id: number; email: string; role: string } {
  return jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string }
}
