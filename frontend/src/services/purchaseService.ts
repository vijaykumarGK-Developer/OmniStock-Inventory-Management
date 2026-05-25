import api from './api'
import type { Purchase, CreatePurchaseDto, UpdateStatusDto, PurchaseFilters, ApiResponse } from '../../shared/types'

export function getAll(filters: PurchaseFilters): Promise<ApiResponse<Purchase[]>> {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') params.set(key, String(val))
  })
  return api.get(`/purchases?${params}`).then((r) => r.data)
}

export function getById(id: number): Promise<Purchase> {
  return api.get(`/purchases/${id}`).then((r) => r.data.data)
}

export function create(data: CreatePurchaseDto): Promise<Purchase> {
  return api.post('/purchases', data).then((r) => r.data.data)
}

export function updateStatus(id: number, data: UpdateStatusDto): Promise<Purchase> {
  return api.put(`/purchases/${id}/status`, data).then((r) => r.data.data)
}

export function deletePurchase(id: number): Promise<void> {
  return api.delete(`/purchases/${id}`)
}
