import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.get('/stats', authenticate, async (_req, res, next) => {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const [totalProducts, stockAgg, lowStock, salesData, prevSalesData] = await Promise.all([
      prisma.product.count(),
      prisma.product.aggregate({ _sum: { stock: true } }),
      prisma.product.findMany({ select: { stock: true, minStock: true } }).then((ps) => ps.filter((p) => p.stock <= p.minStock).length),
      prisma.sale.findMany({
        where: { createdAt: { gte: startOfMonth } },
        select: { total: true, createdAt: true },
      }),
      prisma.sale.findMany({
        where: { createdAt: { gte: startOfPrevMonth, lt: startOfMonth } },
        select: { total: true },
      }),
    ])

    const outOfStock = await prisma.product.count({ where: { stock: 0 } })
    const totalRevenue = salesData.reduce((s, r) => s + r.total, 0)
    const prevRevenue = prevSalesData.reduce((s, r) => s + r.total, 0)
    const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0

    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    const last6Months = await prisma.sale.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { total: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    })
    const monthlyRevenueMap: Record<string, number> = {}
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      monthlyRevenueMap[key] = 0
    }
    for (const sale of last6Months) {
      const d = new Date(sale.createdAt)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (key in monthlyRevenueMap) monthlyRevenueMap[key]! += sale.total
    }
    const monthlyRevenue = Object.entries(monthlyRevenueMap).map(([month, revenue]) => ({ month, revenue }))

    res.json({
      data: {
        totalProducts,
        totalStock: stockAgg._sum.stock ?? 0,
        outOfStock,
        lowStock,
        totalRevenue,
        revenueChange,
        monthlyRevenue,
      },
    })
  } catch (e) {
    next(e)
  }
})

router.get('/recent-sales', authenticate, async (_req, res, next) => {
  try {
    const sales = await prisma.sale.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        items: { select: { productName: true, quantity: true, total: true } },
      },
    })
    const data = sales.map((s) => ({
      ...s,
      userName: s.user.name,
      user: undefined,
    }))
    res.json({ data })
  } catch (e) {
    next(e)
  }
})

router.get('/low-stock', authenticate, async (_req, res, next) => {
  try {
    const all = await prisma.product.findMany({
      orderBy: { stock: 'asc' },
      include: { category: { select: { name: true } } },
    })
    const data = all
      .filter((p) => p.stock <= p.minStock)
      .slice(0, 10)
      .map((p) => ({ ...p, categoryName: p.category.name }))
    res.json({ data })
  } catch (e) {
    next(e)
  }
})

router.get('/top-products', authenticate, async (_req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const items = await prisma.saleItem.findMany({
      where: { sale: { createdAt: { gte: thirtyDaysAgo } } },
      select: { productName: true, quantity: true, total: true },
    })
    const aggregated: Record<string, { unitsSold: number; revenue: number }> = {}
    for (const item of items) {
      if (!aggregated[item.productName]) aggregated[item.productName] = { unitsSold: 0, revenue: 0 }
      aggregated[item.productName]!.unitsSold += item.quantity
      aggregated[item.productName]!.revenue += item.total
    }
    const top = Object.entries(aggregated)
      .map(([productName, val]) => ({ productName, ...val }))
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5)
    res.json({ data: top })
  } catch (e) {
    next(e)
  }
})

export default router
