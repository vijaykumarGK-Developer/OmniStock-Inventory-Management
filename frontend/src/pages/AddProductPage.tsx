import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { create } from '../services/productService'
import { ProductForm } from '../components/products/ProductForm'
import type { CreateProductDto } from '../../shared/types'

export default function AddProductPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [skuError, setSkuError] = useState<string | undefined>()

  const handleSubmit = async (data: CreateProductDto) => {
    setLoading(true)
    setSkuError(undefined)
    try {
      await create(data)
      navigate('/products')
    } catch (e: unknown) {
      const err = e as { response?: { status?: number; data?: { error?: string } } }
      if (err.response?.status === 409 && err.response?.data?.error?.toLowerCase().includes('sku')) {
        setSkuError(err.response.data.error)
      }
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <ProductForm onSubmit={handleSubmit} onCancel={() => navigate('/products')} loading={loading} skuError={skuError} />
    </div>
  )
}
