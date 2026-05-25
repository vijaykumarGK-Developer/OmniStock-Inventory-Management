import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getById } from '../services/productService'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { SkeletonText } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { formatCurrency } from '../utils/formatCurrency'
import { cn } from '../utils/cn'
import type { Product } from '../../shared/types'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    getById(Number(id))
      .then(setProduct)
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="bg-surface-container border border-surface-variant rounded-2xl p-6">
        <SkeletonText lines={10} />
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

  const statusVariant = product.stock === 0 ? 'error' : product.stock <= product.minStock ? 'warning' : 'success'
  const statusLabel = product.stock === 0 ? 'Out of Stock' : product.stock <= product.minStock ? 'Low Stock' : 'In Stock'
  const margin = product.costPrice ? ((product.price - product.costPrice) / product.costPrice * 100).toFixed(1) : null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/products')}>
          <span className="material-symbols-outlined text-lg">chevron_left</span>
          Back
        </Button>
        <div className="flex-1" />
        <Button onClick={() => navigate(`/products/${product.id}/edit`)}>
          <span className="material-symbols-outlined text-lg">edit</span>
          Edit
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[300px] h-[300px] bg-surface-container-low rounded-2xl flex items-center justify-center shrink-0">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">inventory_2</span>
          )}
        </div>

        <div className="flex-1 bg-surface-container border border-surface-variant rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-background">{product.name}</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">{product.sku}</p>
            </div>
            <Badge variant={statusVariant}>{statusLabel}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Category</p>
              <p className="font-body-md text-body-md text-on-surface">{product.categoryName}</p>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Brand</p>
              <p className="font-body-md text-body-md text-on-surface">{product.brand ?? '—'}</p>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Price</p>
              <p className="font-body-md text-body-md text-on-surface">{formatCurrency(product.price)}</p>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Cost Price</p>
              <p className="font-body-md text-body-md text-on-surface">{product.costPrice ? formatCurrency(product.costPrice) : '—'}</p>
            </div>
            {margin && (
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Margin</p>
                <p className="font-body-md text-body-md text-secondary">{margin}%</p>
              </div>
            )}
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Unit</p>
              <p className="font-body-md text-body-md text-on-surface">{product.unit}</p>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Stock</p>
              <p className={cn('font-body-md text-body-md', product.stock === 0 ? 'text-error' : product.stock <= product.minStock ? 'text-tertiary' : 'text-secondary')}>{product.stock}</p>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Min Stock</p>
              <p className="font-body-md text-body-md text-on-surface">{product.minStock}</p>
            </div>
          </div>

          {product.description && (
            <div className="mt-4 pt-4 border-t border-surface-variant/50">
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Description</p>
              <p className="font-body-md text-body-md text-on-surface-variant">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container border border-surface-variant rounded-2xl p-6">
          <h2 className="font-title-md text-title-md text-on-surface mb-4">Stock Movement History</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Stock movement data will appear here once integrated.</p>
        </div>
        <div className="bg-surface-container border border-surface-variant rounded-2xl p-6">
          <h2 className="font-title-md text-title-md text-on-surface mb-4">Sales History</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Sales data will appear here once integrated.</p>
        </div>
      </div>
    </div>
  )
}
