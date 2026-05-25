import { z } from 'zod'

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
})

export const searchSchema = z.object({
  search: z.string().optional(),
})

export const saleSearchSchema = z.object({
  search: z.string().optional(),
}).extend(paginationSchema.shape)
