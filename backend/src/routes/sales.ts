import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { createSaleSchema } from '../validators/sale.js'
import { paginationSchema, saleSearchSchema } from '../validators/common.js'

const router = Router()

router.post('/', authenticate, validate(createSaleSchema), async (req, res, next) => {
  try {
    const { customerName, customerPhone, paymentMethod, discount, items } = req.body
    
    // Get authenticated user from request (set by authenticate middleware)
    const userId = req.user?.id
    if (!userId) {
      res.status(401).json({ error: 'Authentication required' })
      return
    }
    
    // Handle customerPhone: convert undefined to null, empty string to null
    const processedCustomerPhone = customerPhone === undefined ? null : (customerPhone === '' ? null : customerPhone)
    
    const saleWithItems = await prisma.$transaction(async (tx) => {
      // 1. Validate products and check stock
      const validatedItems = []
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } })
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`)
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`)
        }
        validatedItems.push({ product, quantity: item.quantity })
      }
      
      // 2. Calculate subtotal
      const subtotal = validatedItems.reduce((sum, { product, quantity }) => 
        sum + (product.price * quantity), 0)
      
      // 3. Calculate tax (18%)
      const tax = subtotal * 0.18
      
      // 4. Calculate total
      const total = subtotal + tax - discount
      
      // 5. Generate invoice number
      const currentYear = new Date().getFullYear()
      const lastSale = await tx.sale.findFirst({
        where: {
          invoiceNo: {
            startsWith: `INV-${currentYear}-`
          }
        },
        orderBy: {
          id: 'desc'
        }
      })
      
      let sequence = 1
      if (lastSale) {
        const lastInvoice = lastSale.invoiceNo
        const match = lastInvoice.match(/INV-(\d{4})-(\d+)/)
        if (match && match[1] && match[2] && match[1] == currentYear.toString()) {
          sequence = (parseInt(match[2]) ?? 0) + 1
        }
      }
      const invoiceNo = `INV-${currentYear}-${sequence.toString().padStart(8, '0')}`
      
      // 6. Create Sale with items
      const sale = await tx.sale.create({
        data: {
          invoiceNo,
          customerName,
          customerPhone: processedCustomerPhone,
          paymentMethod,
          discount,
          subtotal,
          tax,
          total,
          user: {
            connect: {
              id: Number(userId)
            }
          },
          items: {
            create: validatedItems.map(({ product, quantity }) => ({
              productName: product.name,
              productId: product.id,
              quantity: Number(quantity),
              unitPrice: product.price,
              total: product.price * quantity
            }))
          }
        },
        include: {
          items: true
        }
      })
      
      // 7. Decrement product stock
      for (const { product, quantity } of validatedItems) {
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: quantity } }
        })
      }
      
      // 8. Create StockMovement records
      for (const { product, quantity } of validatedItems) {
        await tx.stockMovement.create({
          data: {
            productId: product.id,
            quantity,
            type: 'OUT',
            reference: 'Sale',
            referenceId: invoiceNo,
            notes: 'Sold via POS',
            userId: Number(userId)
          }
        })
      }
      
      return sale
    })
    
    res.status(201).json({ data: saleWithItems })
  } catch (e: unknown) {
    if ((e as Error).message?.startsWith('Product not found')) {
      res.status(404).json({ error: (e as Error).message })
      return
    }
    if ((e as Error).message?.startsWith('Insufficient stock')) {
      res.status(400).json({ error: (e as Error).message })
      return
    }
    next(e)
  }
})

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { search, page, limit } = saleSearchSchema.parse(req.query)
    
    const where: Record<string, unknown> = {}
    if (search) {
      where.OR = [
        { invoiceNo: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    const [sales, total] = await prisma.$transaction([
      prisma.sale.findMany({
        where,
        include: { items: true, user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.sale.count({ where })
    ])
    
    res.json({ data: sales, total, page: Number(page), limit: Number(limit) })
  } catch (e) {
    next(e)
  }
})

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const sale = await prisma.sale.findUnique({
      where: { id: Number(req.params.id) },
      include: { 
        items: true,
        user: { select: { name: true } }
      }
    })
    
    if (!sale) {
      res.status(404).json({ error: 'Sale not found' })
      return
    }
    
    res.json({ data: sale })
  } catch (e) {
    next(e)
  }
})

export default router
