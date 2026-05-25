import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { createPurchaseSchema, updateStatusSchema, purchaseQuerySchema } from '../validators/purchase.js'

const router = Router()

function mapPurchase(p: Record<string, unknown>) {
  const supplier = p.supplier as { name: string } | undefined
  const user = p.user as { name: string } | undefined
  const items = (p.items as Array<Record<string, unknown>>)?.map((i) => {
    const prod = i.product as { name: string } | undefined
    return {
      ...i,
      productName: prod?.name ?? null,
      product: undefined,
    }
  })
  return {
    ...p,
    supplierName: supplier?.name ?? null,
    userName: user?.name ?? null,
    supplier: undefined,
    user: undefined,
    items,
  }
}

router.post('/', authenticate, authorize('admin', 'manager'), validate(createPurchaseSchema), async (req, res, next) => {
  try {
    const { supplierId, orderDate, expectedDate, notes, items } = req.body
    const userId = req.user!.id

    const lastPo = await prisma.purchase.findFirst({
      orderBy: { id: 'desc' },
      select: { poNumber: true },
    })
    const lastSeq = lastPo ? parseInt(lastPo.poNumber.split('-')[2] ?? '0', 10) : 0
    const poNumber = `PO-${new Date().getFullYear()}-${String(lastSeq + 1).padStart(6, '0')}`

    const lineItems = items.map((item: { productId: number; quantity: number; unitPrice: number }) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.quantity * item.unitPrice,
    }))
    const total = lineItems.reduce((sum: number, i: { total: number }) => sum + i.total, 0)

    const purchase = await prisma.purchase.create({
      data: {
        poNumber,
        supplierId,
        orderDate: orderDate ? new Date(orderDate) : new Date(),
        expectedDate: expectedDate ? new Date(expectedDate) : null,
        notes: notes ?? null,
        total,
        status: 'pending',
        userId,
        items: { create: lineItems },
      },
      include: {
        supplier: { select: { name: true } },
        items: { include: { product: { select: { name: true } } } },
        user: { select: { name: true } },
      },
    })
    res.status(201).json({ data: mapPurchase(purchase as unknown as Record<string, unknown>) })
  } catch (e) {
    next(e)
  }
})

router.get('/', authenticate, async (req, res, next) => {
  try {
    const query = purchaseQuerySchema.parse(req.query)
    const { search, status, sortBy, sortOrder, page, limit } = query

    const where: Record<string, unknown> = {}
    if (search) {
      where.OR = [
        { poNumber: { contains: search } },
        { supplier: { name: { contains: search } } },
      ]
    }
    if (status) where.status = status

    const orderBy: Record<string, string> = sortBy
      ? { [sortBy]: sortOrder ?? 'desc' }
      : { createdAt: 'desc' }

    const [purchases, total] = await Promise.all([
      prisma.purchase.findMany({
        where,
        orderBy,
        include: {
          supplier: { select: { name: true } },
          items: { include: { product: { select: { name: true } } } },
          user: { select: { name: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.purchase.count({ where }),
    ])

    const data = purchases.map((p) => mapPurchase(p as unknown as Record<string, unknown>))
    res.json({ data, total, page, limit })
  } catch (e) {
    next(e)
  }
})

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const purchase = await prisma.purchase.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        supplier: { select: { name: true } },
        items: { include: { product: { select: { name: true } } } },
        user: { select: { name: true } },
      },
    })
    if (!purchase) {
      res.status(404).json({ error: 'Purchase not found' })
      return
    }
    res.json({ data: mapPurchase(purchase as unknown as Record<string, unknown>) })
  } catch (e) {
    next(e)
  }
})

router.put('/:id/status', authenticate, authorize('admin', 'manager'), validate(updateStatusSchema), async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const { status: newStatus } = req.body
    const userId = req.user!.id

    const purchase = await prisma.purchase.findUnique({
      where: { id },
      include: { items: true },
    })
    if (!purchase) {
      res.status(404).json({ error: 'Purchase not found' })
      return
    }
    if (purchase.status === newStatus) {
      const same = await prisma.purchase.findUnique({
        where: { id },
        include: {
          supplier: { select: { name: true } },
          items: { include: { product: { select: { name: true } } } },
          user: { select: { name: true } },
        },
      })
      res.json({ data: mapPurchase(same as unknown as Record<string, unknown>) })
      return
    }

    await prisma.$transaction(async (tx) => {
      if (newStatus === 'received') {
        for (const item of purchase.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          })
          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              type: 'IN',
              quantity: item.quantity,
              reference: 'Purchase',
              referenceId: purchase.poNumber,
              notes: `PO received`,
              userId,
            },
          })
        }
      }
      if (newStatus === 'cancelled' && purchase.status === 'received') {
        for (const item of purchase.items) {
          const product = await tx.product.findUnique({ where: { id: item.productId }, select: { stock: true } })
          if (!product || product.stock < item.quantity) {
            throw new Error(`Insufficient stock to cancel PO for product ${item.productId}`)
          }
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              type: 'OUT',
              quantity: item.quantity,
              reference: 'Purchase',
              referenceId: purchase.poNumber,
              notes: `PO cancelled after receipt`,
              userId,
            },
          })
        }
      }
      await tx.purchase.update({
        where: { id },
        data: { status: newStatus },
      })
    })

    const updated = await prisma.purchase.findUnique({
      where: { id },
      include: {
        supplier: { select: { name: true } },
        items: { include: { product: { select: { name: true } } } },
        user: { select: { name: true } },
      },
    })
    res.json({ data: mapPurchase(updated as unknown as Record<string, unknown>) })
  } catch (e: unknown) {
    const err = e as { message?: string; code?: string }
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Purchase not found' })
      return
    }
    if (err.message?.includes('Insufficient stock')) {
      res.status(400).json({ error: err.message })
      return
    }
    next(e)
  }
})

router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const purchase = await prisma.purchase.findUnique({ where: { id }, select: { status: true } })
    if (!purchase) {
      res.status(404).json({ error: 'Purchase not found' })
      return
    }
    if (purchase.status !== 'pending') {
      res.status(409).json({ error: 'Can only delete pending purchase orders' })
      return
    }
    await prisma.purchase.delete({ where: { id } })
    res.json({ data: { id } })
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2025') {
      res.status(404).json({ error: 'Purchase not found' })
      return
    }
    next(e)
  }
})

export default router
