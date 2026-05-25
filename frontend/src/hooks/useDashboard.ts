import { useState, useEffect, useCallback, useRef } from 'react'
import { getStats, getRecentSales, getLowStock, getTopProducts } from '../services/dashboardService'
import type { DashboardStats, Sale, Product } from '../../shared/types'

interface DashboardData {
  stats: DashboardStats | null
  recentSales: Sale[]
  lowStock: Product[]
  topProducts: { productName: string; unitsSold: number; revenue: number }[]
}

interface UseDashboardResult extends DashboardData {
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useDashboard(): UseDashboardResult {
  const [data, setData] = useState<DashboardData>({ stats: null, recentSales: [], lowStock: [], topProducts: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mounted = useRef(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [stats, recentSales, lowStock, topProducts] = await Promise.all([
        getStats(),
        getRecentSales(),
        getLowStock(),
        getTopProducts(),
      ])
      if (mounted.current) setData({ stats, recentSales, lowStock, topProducts })
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to load dashboard'
      if (mounted.current) setError(msg)
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    fetch()
    return () => { mounted.current = false }
  }, [fetch])

  return { ...data, loading, error, refetch: fetch }
}
