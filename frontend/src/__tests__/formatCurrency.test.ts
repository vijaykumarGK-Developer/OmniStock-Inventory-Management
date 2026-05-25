import { describe, it, expect } from 'vitest'
import { formatCurrency } from '../utils/formatCurrency'

describe('formatCurrency', () => {
  it('should format number with ₹ symbol and en-IN locale', () => {
    const result = formatCurrency(799)
    expect(result).toContain('₹')
    expect(result).toContain('799')
  })

  it('should format zero correctly', () => {
    const result = formatCurrency(0)
    expect(result).toBe('₹0.00')
  })

  it('should format large numbers with locale separators', () => {
    const result = formatCurrency(150000)
    expect(result).toContain('₹')
    expect(result).toContain('000')
  })

  it('should show two decimal places', () => {
    const result = formatCurrency(99.5)
    expect(result).toMatch(/₹\d+[\d,]*\.50/)
  })
})
