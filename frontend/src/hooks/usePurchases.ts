import { useState, useEffect, useCallback, useRef } from 'react'
import { getAll } from '../services/purchaseService'
import type { Purchase, PurchaseFilters } from '../../shared/types'

interface UsePurchasesResult {
  data: Purchase[]
  total: number
  loading: boolean
  error: string | null
  refetch: () => void
}

export function usePurchases(filters: PurchaseFilters): UsePurchasesResult {
  const [data, setData] = useState<Purchase[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const filtersRef = useRef(filters)
  filtersRef.current = filters

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getAll(filtersRef.current)
      setData(res.data)
      setTotal(res.total ?? 0)
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to load purchases'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [JSON.stringify(filters), fetch])

  return { data, total, loading, error, refetch: fetch }
}
