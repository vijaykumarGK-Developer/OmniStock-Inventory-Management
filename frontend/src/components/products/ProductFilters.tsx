import { SearchInput } from '../ui/SearchInput'
import { Select } from '../ui/Select'
import type { ProductFilters as ProductFiltersType } from '../../../shared/types'

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: '1', label: 'Electronics' },
  { value: '2', label: 'Accessories' },
  { value: '3', label: 'Food & Beverages' },
  { value: '4', label: 'Stationery' },
  { value: '5', label: 'Cleaning Supplies' },
]

const stockOptions = [
  { value: '', label: 'All Stock' },
  { value: 'in', label: 'In Stock' },
  { value: 'low', label: 'Low Stock' },
  { value: 'out', label: 'Out of Stock' },
]

const sortOptions = [
  { value: 'createdAt_desc', label: 'Newest' },
  { value: 'name_asc', label: 'Name A-Z' },
  { value: 'name_desc', label: 'Name Z-A' },
  { value: 'price_asc', label: 'Price Low-High' },
  { value: 'price_desc', label: 'Price High-Low' },
]

interface ProductFiltersProps {
  filters: ProductFiltersType
  onFilterChange: (filters: Partial<ProductFiltersType>) => void
  onSearchChange?: (search: string) => void
}

export function ProductFilters({ filters, onFilterChange, onSearchChange }: ProductFiltersProps) {
  const sortValue = filters.sortBy ? `${filters.sortBy}_${filters.sortOrder ?? 'asc'}` : 'createdAt_desc'

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="w-full sm:w-64">
          <SearchInput
            value={filters.search ?? ''}
            onChange={(v) => onSearchChange ? onSearchChange(v) : onFilterChange({ search: v || undefined })}
            placeholder="Search products..."
          />
      </div>
      <Select
        options={categoryOptions}
        value={String(filters.categoryId ?? '')}
        onChange={(e) => onFilterChange({ categoryId: e.target.value ? Number(e.target.value) : undefined })}
      />
      <Select
        options={stockOptions}
        value={filters.stockStatus ?? ''}
        onChange={(e) => onFilterChange({ stockStatus: (e.target.value || undefined) as ProductFiltersType['stockStatus'] })}
      />
      <Select
        options={sortOptions}
        value={sortValue}
        onChange={(e) => {
          const [sortBy, sortOrder] = e.target.value.split('_')
          onFilterChange({ sortBy, sortOrder: sortOrder as 'asc' | 'desc' })
        }}
      />
    </div>
  )
}
