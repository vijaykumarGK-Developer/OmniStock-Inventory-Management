import { z } from 'zod'

export const createSaleSchema = z.object({
  customerName: z.string().optional().default('Walk-in Customer'),
  customerPhone: z.string().optional().nullable(),
  paymentMethod: z.enum(['cash', 'card', 'upi', 'credit']),
  discount: z.number().min(0).optional().default(0),
  items: z.array(z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().min(1),
  })).min(1, "At least one item required"),
})
