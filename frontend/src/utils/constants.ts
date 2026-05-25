export const STOCK_STATUS = {
  IN_STOCK: 'in',
  LOW_STOCK: 'low',
  OUT_OF_STOCK: 'out',
} as const

export const ORDER_STATUS = {
  PENDING: 'pending',
  ORDERED: 'ordered',
  RECEIVED: 'received',
  CANCELLED: 'cancelled',
} as const

export const PAYMENT_METHODS = ['cash', 'card', 'upi', 'credit'] as const

export const ROLES = ['admin', 'manager', 'staff'] as const
