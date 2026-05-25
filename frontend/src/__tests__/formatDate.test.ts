import { describe, it, expect } from 'vitest'
import { formatDate } from '../utils/formatDate'

describe('formatDate', () => {
  it('should return relative time for recent dates', () => {
    const now = new Date()
    const result = formatDate(now, 'relative')
    expect(result).toBe('Just now')
  })

  it('should return minutes ago', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000)
    const result = formatDate(fiveMinAgo, 'relative')
    expect(result).toContain('min')
  })

  it('should return short format by default', () => {
    const date = new Date('2026-05-25')
    const result = formatDate(date)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})
