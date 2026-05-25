import { describe, it, expect } from 'vitest'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

describe('Password hashing', () => {
  it('should hash and compare password correctly', async () => {
    const plain = 'testpassword123'
    const hash = bcrypt.hashSync(plain, 12)
    expect(hash).not.toBe(plain)
    expect(bcrypt.compareSync(plain, hash)).toBe(true)
    expect(bcrypt.compareSync('wrongpassword', hash)).toBe(false)
  })
})

describe('JWT utilities', () => {
  it('should sign and verify a token', () => {
    const secret = 'test-secret'
    const payload = { id: 1, email: 'test@test.com', role: 'admin' }
    const token = jwt.sign(payload, secret, { expiresIn: '7d' })
    expect(typeof token).toBe('string')

    const decoded = jwt.verify(token, secret) as typeof payload
    expect(decoded.id).toBe(1)
    expect(decoded.email).toBe('test@test.com')
    expect(decoded.role).toBe('admin')
  })

  it('should reject invalid token', () => {
    expect(() => jwt.verify('invalid-token', 'secret')).toThrow()
  })
})
