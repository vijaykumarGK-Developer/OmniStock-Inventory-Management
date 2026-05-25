import api from './api'
import type { Supplier, CreateSupplierDto, UpdateSupplierDto, SupplierFilters, ApiResponse } from '../../shared/types'

export function getAll(filters: SupplierFilters): Promise<ApiResponse<Supplier[]>> {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') params.set(key, String(val))
  })
  return api.get(`/suppliers?${params}`).then((r) => r.data)
}

export function getById(id: number): Promise<Supplier> {
  return api.get(`/suppliers/${id}`).then((r) => r.data.data)
}

export function create(data: CreateSupplierDto): Promise<Supplier> {
  return api.post('/suppliers', data).then((r) => r.data.data)
}

export function update(id: number, data: UpdateSupplierDto): Promise<Supplier> {
  return api.put(`/suppliers/${id}`, data).then((r) => r.data.data)
}

export function deleteSupplier(id: number): Promise<void> {
  return api.delete(`/suppliers/${id}`)
}
