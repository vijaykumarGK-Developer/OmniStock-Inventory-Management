import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { createSupplierSchema, updateSupplierSchema, supplierQuerySchema } from '../validators/supplier.js'

const router = Router()

router.get('/', authenticate, async (req, res, next) => {
  try {
    const query = supplierQuerySchema.parse(req.query)
    const { search, status, sortBy, sortOrder, page, limit } = query

    const where: Record<string, unknown> = {}
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { contactPerson: { contains: search } },
        { phone: { contains: search } },
      ]
    }
    if (status) where.status = status

    const orderBy: Record<string, string> = sortBy
      ? { [sortBy]: sortOrder ?? 'asc' }
      : { name: 'asc' }

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.supplier.count({ where }),
    ])

    res.json({ data: suppliers, total, page, limit })
  } catch (e) {
    next(e)
  }
})

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: Number(req.params.id) },
      include: { _count: { select: { purchases: true } } },
    })
    if (!supplier) {
      res.status(404).json({ error: 'Supplier not found' })
      return
    }
    res.json({ data: { ...supplier, purchaseCount: supplier._count.purchases } })
  } catch (e) {
    next(e)
  }
})

router.post('/', authenticate, authorize('admin', 'manager'), validate(createSupplierSchema), async (req, res, next) => {
  try {
    const supplier = await prisma.supplier.create({ data: req.body })
    res.status(201).json({ data: supplier })
  } catch (e) {
    next(e)
  }
})

router.put('/:id', authenticate, authorize('admin', 'manager'), validate(updateSupplierSchema), async (req, res, next) => {
  try {
    const supplier = await prisma.supplier.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    })
    res.json({ data: supplier })
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2025') {
      res.status(404).json({ error: 'Supplier not found' })
      return
    }
    next(e)
  }
})

router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const activePurchases = await prisma.purchase.count({
      where: { supplierId: id, status: { in: ['pending', 'ordered'] } },
    })
    if (activePurchases > 0) {
      res.status(409).json({ error: 'Cannot delete supplier with active purchases' })
      return
    }
    await prisma.supplier.delete({ where: { id } })
    res.json({ data: { id } })
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2025') {
      res.status(404).json({ error: 'Supplier not found' })
      return
    }
    next(e)
  }
})

export default router
