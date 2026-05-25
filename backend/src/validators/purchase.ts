import { z } from 'zod'

export const createPurchaseSchema = z.object({
  supplierId: z.number().int().positive(),
  orderDate: z.string().optional(),
  expectedDate: z.string().optional(),
  notes: z.string().optional().nullable(),
  items: z.array(z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().min(1),
    unitPrice: z.number().positive(),
  })).min(1),
})

export const updateStatusSchema = z.object({
  status: z.enum(['pending', 'ordered', 'received', 'cancelled']),
})

export const purchaseQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['pending', 'ordered', 'received', 'cancelled']).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
})
