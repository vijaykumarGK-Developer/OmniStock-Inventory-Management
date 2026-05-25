import { z } from 'zod'

export const createSupplierSchema = z.object({
  name: z.string().min(2).max(100),
  contactPerson: z.string().max(100).optional().nullable(),
  phone: z.string().min(1),
  email: z.string().email().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  status: z.enum(['active', 'inactive']).optional().default('active'),
})

export const updateSupplierSchema = createSupplierSchema.partial()

export const supplierQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
})
