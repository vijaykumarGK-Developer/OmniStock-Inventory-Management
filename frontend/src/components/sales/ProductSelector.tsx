import { useState, useEffect } from 'react'
import { getAll } from '../../services/productService'
import { Skeleton } from '../ui/Skeleton'
import { formatCurrency } from '../../utils/formatCurrency'
import type { Product } from '../../../shared/types'

const categories = [
  { id: 0, name: 'All' },
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Accessories' },
  { id: 3, name: 'Food & Beverages' },
  { id: 4, name: 'Stationery' },
  { id: 5, name: 'Cleaning Supplies' },
]

interface ProductSelectorProps {
  onAddToCart: (product: Product) => void
}

export function ProductSelector({ onAddToCart }: ProductSelectorProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(0)

  useEffect(() => {
    setLoading(true)
    getAll({ page: 1, limit: 50, search: search || undefined, categoryId: activeCategory || undefined })
      .then((res) => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, activeCategory])

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    if (activeCategory && p.categoryId !== activeCategory) return false
    return true
  })

  return (
    <div>
      <div className="relative mb-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-lg pointer-events-none">search</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="rounded-2xl pl-12 pr-14 py-4 bg-surface-container border border-surface-variant w-full font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary transition-colors"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant">
          <span className="material-symbols-outlined text-lg">qr_code_scanner</span>
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`rounded-full px-5 py-2 font-body-sm text-body-sm whitespace-nowrap transition-colors ${
              activeCategory === cat.id
                ? 'bg-primary-container text-primary-fixed'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-surface border border-surface-variant rounded-2xl p-4">
              <Skeleton className="aspect-square rounded-xl mb-3" />
              <Skeleton width="70%" height={14} />
              <Skeleton width="40%" height={16} className="mt-2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => {
            const outOfStock = product.stock === 0
            return (
              <div
                key={product.id}
                onClick={() => !outOfStock && onAddToCart(product)}
                className={`bg-surface border border-surface-variant rounded-2xl p-4 hover:shadow-soft hover:border-primary-fixed-dim transition-all cursor-pointer ${
                  outOfStock ? 'border-error/30 opacity-75' : ''
                }`}
              >
                <div className="aspect-square bg-surface-container-low rounded-xl flex items-center justify-center mb-3 relative">
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant/40">inventory_2</span>
                  {outOfStock && (
                    <span className="absolute top-2 right-2 bg-error text-white text-xs font-bold px-2 py-0.5 rounded-full">OUT</span>
                  )}
                </div>
                <p className="font-body-sm text-body-sm text-on-surface line-clamp-1" title={product.name}>{product.name}</p>
                <p className="font-title-sm text-title-sm text-primary mt-1">{formatCurrency(product.price)}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
