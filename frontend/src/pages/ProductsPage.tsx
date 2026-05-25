import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { useDebounce } from '../hooks/useDebounce'
import { deleteProduct } from '../services/productService'
import { ProductFilters } from '../components/products/ProductFilters'
import { ProductTable } from '../components/products/ProductTable'
import { EmptyState } from '../components/ui/EmptyState'
import { SkeletonText } from '../components/ui/Skeleton'
import { Pagination } from '../components/ui/Pagination'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Button } from '../components/ui/Button'
import { useNotification } from '../context/NotificationContext'
import { useAuth } from '../context/AuthContext'
import type { ProductFilters as ProductFiltersType } from '../../shared/types'

export default function ProductsPage() {
  const navigate = useNavigate()
  const { addNotification } = useNotification()
  const { user } = useAuth()
  const isStaff = user?.role === 'staff'
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<ProductFiltersType>({ page: 1, limit: 12 })
  const debouncedSearch = useDebounce(search, 300)
  const mergedFilters = { ...filters, search: debouncedSearch || undefined, page: filters.page ?? 1, limit: filters.limit ?? 12 }
  const { data, total, loading, error, refetch } = useProducts(mergedFilters)
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null)

  const handleFilterChange = useCallback((patch: Partial<ProductFiltersType>) => {
    setFilters((prev) => ({ ...prev, ...patch, page: 1 }))
  }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteProduct(deleteTarget.id)
      addNotification('success', 'Product deleted', `${deleteTarget.name} has been deleted.`)
      setDeleteTarget(null)
      refetch()
    } catch { /* error handled by interceptor */ }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-background">Product Management</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage your product catalog</p>
        </div>
        {!isStaff && (
          <Button onClick={() => navigate('/products/add')}>
            <span className="material-symbols-outlined text-lg">add</span>
            Add Product
          </Button>
        )}
      </div>

      <ProductFilters
        filters={{ ...filters, search }}
        onFilterChange={handleFilterChange}
        onSearchChange={(v) => setSearch(v)}
      />

      {error ? (
        <div className="bg-surface-container border border-surface-variant rounded-2xl">
          <EmptyState icon="error" title="Error loading products" description={error}
            action={<Button variant="secondary" onClick={refetch}>Retry</Button>} />
        </div>
      ) : !loading && data.length === 0 ? (
        search ? (
          <div className="bg-surface-container border border-surface-variant rounded-2xl">
            <EmptyState icon="search_off" title={`No results found for "${search}"`}
              description="Try adjusting your search criteria"
              action={<Button variant="outline-primary" onClick={() => setSearch('')}>Clear Search</Button>} />
          </div>
        ) : (
          <div className="bg-surface-container border border-surface-variant rounded-2xl">
            <EmptyState icon="inventory_2" title="No products yet"
              description="Add your first product to start tracking inventory"
              action={<Button onClick={() => navigate('/products/add')}>Add Product</Button>} />
          </div>
        )
      ) : (
        <ProductTable
          products={data}
          loading={loading}
          onEdit={(p) => navigate(`/products/${p.id}/edit`)}
          onDelete={(p) => setDeleteTarget(p)}
          allowDelete={!isStaff}
        />
      )}

      {total > 12 && (
        <Pagination
          page={filters.page ?? 1}
          totalPages={Math.ceil(total / (filters.limit ?? 12))}
          onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        variant="danger"
        confirmLabel="Delete"
      />
    </div>
  )
}
