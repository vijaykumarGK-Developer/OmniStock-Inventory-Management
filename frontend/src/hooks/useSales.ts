import { useState, useEffect, useCallback, useRef } from 'react'
import { getAll } from '../services/saleService'
import type { Sale } from '../../shared/types'

interface UseSalesResult {
  data: Sale[]
  total: number
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useSales(params: Record<string, string | number | undefined>): UseSalesResult {
  const [data, setData] = useState<Sale[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const paramsRef = useRef(params)
  paramsRef.current = params

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getAll(paramsRef.current)
      setData(res.data)
      setTotal(res.total ?? 0)
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to load sales'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [JSON.stringify(params), fetch])

  return { data, total, loading, error, refetch: fetch }
}
