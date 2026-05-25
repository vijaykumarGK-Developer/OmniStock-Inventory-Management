import api from './api'
import type { Sale, CreateSaleDto, ApiResponse } from '../../shared/types'

export function getAll(params: Record<string, string | number | undefined>): Promise<ApiResponse<Sale[]>> {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') searchParams.set(key, String(val))
  })
  return api.get(`/sales?${searchParams}`).then((r) => r.data)
}

export function getById(id: number): Promise<Sale> {
  return api.get(`/sales/${id}`).then((r) => r.data.data)
}

export function create(data: CreateSaleDto): Promise<Sale> {
  return api.post('/sales', data).then((r) => r.data.data)
}
