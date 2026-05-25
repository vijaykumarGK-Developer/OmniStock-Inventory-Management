import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(2).max(100),
  sku: z.string().regex(/^[A-Z0-9-]+$/, 'SKU must be uppercase alphanumeric with hyphens'),
  categoryId: z.number().int().positive(),
  brand: z.string().max(100).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  price: z.number().positive(),
  costPrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0),
  minStock: z.number().int().min(0),
  unit: z.string().min(1).max(20),
  imageUrl: z.string().url().optional().nullable(),
})

export const updateProductSchema = createProductSchema.partial().omit({ sku: true })

export const productQuerySchema = z.object({
  search: z.string().optional(),
  categoryId: z.coerce.number().int().optional(),
  stockStatus: z.enum(['in', 'low', 'out']).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
})
