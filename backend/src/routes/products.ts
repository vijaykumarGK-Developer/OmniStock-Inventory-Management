import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { createProductSchema, updateProductSchema, productQuerySchema } from '../validators/product.js'

const router = Router()

router.get('/', authenticate, async (req, res, next) => {
  try {
    const query = productQuerySchema.parse(req.query)
    const { search, categoryId, stockStatus, sortBy, sortOrder, page, limit } = query

    const where: Record<string, unknown> = {}
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
      ]
    }
    if (categoryId) where.categoryId = categoryId

    const orderBy: Record<string, string> = sortBy
      ? { [sortBy]: sortOrder ?? 'asc' }
      : { createdAt: 'desc' }

    let products = await prisma.product.findMany({
      where,
      orderBy,
      include: { category: { select: { name: true } } },
      skip: (page - 1) * limit,
      take: limit,
    })

    if (stockStatus) {
      products = products.filter((p) => {
        if (stockStatus === 'out') return p.stock === 0
        if (stockStatus === 'low') return p.stock > 0 && p.stock <= p.minStock
        if (stockStatus === 'in') return p.stock > p.minStock
        return true
      })
    }

    const total = await prisma.product.count({ where })
    const data = products.map((p) => ({ ...p, categoryName: p.category.name }))

    res.json({ data, total, page, limit })
  } catch (e) {
    next(e)
  }
})

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: { category: { select: { name: true } } },
    })
    if (!product) {
      res.status(404).json({ error: 'Product not found' })
      return
    }
    res.json({ data: { ...product, categoryName: product.category.name } })
  } catch (e) {
    next(e)
  }
})

router.post('/', authenticate, authorize('admin', 'manager'), validate(createProductSchema), async (req, res, next) => {
  try {
    const { categoryId, ...data } = req.body
    const product = await prisma.product.create({
      data: { ...data, categoryId, category: { connect: { id: categoryId } } },
      include: { category: { select: { name: true } } },
    })
    res.status(201).json({ data: { ...product, categoryName: product.category.name } })
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2002') {
      res.status(409).json({ error: 'SKU already exists' })
      return
    }
    next(e)
  }
})

router.put('/:id', authenticate, authorize('admin', 'manager'), validate(updateProductSchema), async (req, res, next) => {
  try {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: req.body,
      include: { category: { select: { name: true } } },
    })
    res.json({ data: { ...product, categoryName: product.category.name } })
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2025') {
      res.status(404).json({ error: 'Product not found' })
      return
    }
    next(e)
  }
})

router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: Number(req.params.id) } })
    res.json({ data: { id: Number(req.params.id) } })
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2025') {
      res.status(404).json({ error: 'Product not found' })
      return
    }
    next(e)
  }
})

export default router
