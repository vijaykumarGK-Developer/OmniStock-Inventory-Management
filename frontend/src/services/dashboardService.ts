import api from './api'
import type { DashboardStats, Sale, Product } from '../../shared/types'

export function getStats(): Promise<DashboardStats> {
  return api.get('/dashboard/stats').then((r) => r.data.data)
}

export function getRecentSales(): Promise<Sale[]> {
  return api.get('/dashboard/recent-sales').then((r) => r.data.data)
}

export function getLowStock(): Promise<Product[]> {
  return api.get('/dashboard/low-stock').then((r) => r.data.data)
}

export function getTopProducts(): Promise<{ productName: string; unitsSold: number; revenue: number }[]> {
  return api.get('/dashboard/top-products').then((r) => r.data.data)
}
