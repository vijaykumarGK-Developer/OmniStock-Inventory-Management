import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getById, update } from '../services/productService'
import { ProductForm } from '../components/products/ProductForm'
import { SkeletonText } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import type { Product, CreateProductDto } from '../../shared/types'

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [skuError, setSkuError] = useState<string | undefined>()

  useEffect(() => {
    if (!id) return
    getById(Number(id))
      .then(setProduct)
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (data: CreateProductDto) => {
    if (!id) return
    setSaving(true)
    setSkuError(undefined)
    try {
      await update(Number(id), data)
      navigate('/products')
    } catch (e: unknown) {
      const err = e as { response?: { status?: number; data?: { error?: string } } }
      if (err.response?.status === 409 && err.response?.data?.error?.toLowerCase().includes('sku')) {
        setSkuError(err.response.data.error)
      }
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-surface-container border border-surface-variant rounded-2xl p-6">
        <SkeletonText lines={8} />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="bg-surface-container border border-surface-variant rounded-2xl">
        <EmptyState icon="error" title="Error" description={error ?? 'Product not found'} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-background">Edit Product</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Update product details</p>
      </div>
      <ProductForm initialData={product} onSubmit={handleSubmit} onCancel={() => navigate('/products')} loading={saving} skuError={skuError} />
    </div>
  )
}
