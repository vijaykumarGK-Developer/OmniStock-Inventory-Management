import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

router.get('/sales', authenticate, authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const from = req.query.from ? new Date(req.query.from as string) : new Date(Date.now() - 30 * 86400000)
    const to = req.query.to ? new Date(req.query.to as string) : new Date()

    const sales = await prisma.sale.findMany({
      where: { createdAt: { gte: from, lte: to } },
      include: { items: true },
      orderBy: { createdAt: 'asc' },
    })

    const totalRevenue = sales.reduce((s, r) => s + r.total, 0)
    const totalOrders = sales.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    const dailyMap: Record<string, number> = {}
    for (const sale of sales) {
      const day = sale.createdAt.toISOString().slice(0, 10)
      dailyMap[day] = (dailyMap[day] ?? 0) + sale.total
    }
    const dailyRevenue = Object.entries(dailyMap).map(([date, revenue]) => ({ date, revenue }))

    const productMap: Record<string, number> = {}
    for (const sale of sales) {
      for (const item of sale.items) {
        productMap[item.productName] = (productMap[item.productName] ?? 0) + item.quantity
      }
    }
    const topProducts = Object.entries(productMap)
      .map(([productName, unitsSold]) => ({ productName, unitsSold }))
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5)

    res.json({ data: { totalRevenue, totalOrders, averageOrderValue, dailyRevenue, topProducts } })
  } catch (e) {
    next(e)
  }
})

router.get('/stock', authenticate, authorize('admin', 'manager'), async (_req, res, next) => {
  try {
    const products = await prisma.product.findMany({ include: { category: { select: { name: true } } } })
    const lowStockCount = products.filter((p) => p.stock <= p.minStock && p.stock > 0).length
    const outOfStockCount = products.filter((p) => p.stock === 0).length

    const totalStockValue = products.reduce((s, p) => s + (p.costPrice ?? 0) * p.stock, 0)

    const categoryMap: Record<string, number> = {}
    for (const p of products) {
      const name = p.category.name
      categoryMap[name] = (categoryMap[name] ?? 0) + (p.costPrice ?? 0) * p.stock
    }
    const stockByCategory = Object.entries(categoryMap).map(([category, value]) => ({ category, value }))

    const productList = products.map((p) => ({
      ...p,
      categoryName: p.category.name,
      stockValue: (p.costPrice ?? 0) * p.stock,
    }))

    res.json({ data: { totalStockValue, stockByCategory, lowStockCount, outOfStockCount, products: productList } })
  } catch (e) {
    next(e)
  }
})

router.get('/purchases', authenticate, authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const from = req.query.from ? new Date(req.query.from as string) : new Date(Date.now() - 90 * 86400000)
    const to = req.query.to ? new Date(req.query.to as string) : new Date()

    const purchases = await prisma.purchase.findMany({
      where: { orderDate: { gte: from, lte: to } },
      include: { supplier: { select: { name: true } } },
      orderBy: { orderDate: 'asc' },
    })

    const totalSpent = purchases.reduce((s, p) => s + p.total, 0)

    const supplierMap: Record<string, number> = {}
    for (const p of purchases) {
      supplierMap[p.supplier.name] = (supplierMap[p.supplier.name] ?? 0) + p.total
    }
    const bySupplier = Object.entries(supplierMap).map(([name, total]) => ({ name, total }))

    const monthlyMap: Record<string, number> = {}
    for (const p of purchases) {
      const key = `${p.orderDate.getFullYear()}-${String(p.orderDate.getMonth() + 1).padStart(2, '0')}`
      monthlyMap[key] = (monthlyMap[key] ?? 0) + p.total
    }
    const monthlyBreakdown = Object.entries(monthlyMap).map(([month, total]) => ({ month, total }))

    res.json({ data: { totalSpent, bySupplier, monthlyBreakdown, totalOrders: purchases.length } })
  } catch (e) {
    next(e)
  }
})

router.get('/profit', authenticate, authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const from = req.query.from ? new Date(req.query.from as string) : new Date(Date.now() - 90 * 86400000)
    const to = req.query.to ? new Date(req.query.to as string) : new Date()

    const sales = await prisma.sale.findMany({
      where: { createdAt: { gte: from, lte: to } },
      include: { items: true },
      orderBy: { createdAt: 'asc' },
    })

    const productIds = [...new Set(sales.flatMap((s) => s.items.map((i) => i.productId)))]
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, costPrice: true },
    })
    const costMap: Record<number, number> = {}
    for (const p of products) { costMap[p.id] = p.costPrice ?? 0 }

    const totalRevenue = sales.reduce((s, r) => s + r.total, 0)
    let totalCost = 0
    for (const sale of sales) {
      for (const item of sale.items) {
        totalCost += (costMap[item.productId] ?? 0) * item.quantity
      }
    }
    const grossProfit = totalRevenue - totalCost
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0

    const monthlyMap: Record<string, { revenue: number; cost: number }> = {}
    for (const sale of sales) {
      const key = `${sale.createdAt.getFullYear()}-${String(sale.createdAt.getMonth() + 1).padStart(2, '0')}`
      if (!monthlyMap[key]) monthlyMap[key] = { revenue: 0, cost: 0 }
      monthlyMap[key].revenue += sale.total
      for (const item of sale.items) {
        monthlyMap[key].cost += (costMap[item.productId] ?? 0) * item.quantity
      }
    }
    const monthlyBreakdown = Object.entries(monthlyMap).map(([month, val]) => ({ month, ...val }))

    res.json({ data: { totalRevenue, totalCost, grossProfit, profitMargin, monthlyBreakdown } })
  } catch (e) {
    next(e)
  }
})

export default router
