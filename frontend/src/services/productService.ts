import api from './api'
import type { Product, ProductFilters, CreateProductDto, UpdateProductDto, ApiResponse } from '../../shared/types'

export function getAll(filters: ProductFilters): Promise<ApiResponse<Product[]>> {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') params.set(key, String(val))
  })
  return api.get(`/products?${params}`).then((r) => r.data)
}

export function getById(id: number): Promise<Product> {
  return api.get(`/products/${id}`).then((r) => r.data.data)
}

export function create(data: CreateProductDto): Promise<Product> {
  return api.post('/products', data).then((r) => r.data.data)
}

export function update(id: number, data: UpdateProductDto): Promise<Product> {
  return api.put(`/products/${id}`, data).then((r) => r.data.data)
}

export function deleteProduct(id: number): Promise<void> {
  return api.delete(`/products/${id}`)
}
