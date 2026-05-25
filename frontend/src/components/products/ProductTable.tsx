import { Table, type TableColumn } from '../ui/Table'
import { Badge } from '../ui/Badge'
import { formatCurrency } from '../../utils/formatCurrency'
import type { Product } from '../../../shared/types'

interface ProductTableProps {
  products: Product[]
  loading: boolean
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  allowDelete?: boolean
}

function StockBar({ stock, minStock }: { stock: number; minStock: number }) {
  const pct = Math.min(100, (stock / (stock + minStock || 1)) * 100)
  const color = stock === 0 ? '#991B1B' : stock <= minStock ? '#F97316' : '#29a195'
  return (
    <div className="w-20 h-2 rounded-full bg-surface-container-highest overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

export function ProductTable({ products, loading, onEdit, onDelete, allowDelete = true }: ProductTableProps) {
  const columns: TableColumn<Product>[] = [
    {
      key: 'name',
      label: 'Product',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center">
            <span className="material-symbols-outlined text-sm text-on-surface-variant">inventory_2</span>
          </div>
          <div>
            <p className="font-body-md text-body-md text-on-surface line-clamp-1" title={item.name}>{item.name}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate" title={item.sku}>{item.sku}</p>
          </div>
        </div>
      ),
    },
    { key: 'categoryName', label: 'Category' },
    {
      key: 'price',
      label: 'Price',
      align: 'right',
      render: (item) => <span className="font-body-md text-body-md text-on-surface">{formatCurrency(item.price)}</span>,
    },
    {
      key: 'stock',
      label: 'Stock',
      align: 'right',
      render: (item) => (
        <div className="flex items-center gap-2 justify-end">
          <span>{item.stock}</span>
          <StockBar stock={item.stock} minStock={item.minStock} />
        </div>
      ),
    },
    { key: 'minStock', label: 'Min Stock', align: 'right' },
    {
      key: 'status',
      label: 'Status',
      render: (item) => {
        const variant = item.stock === 0 ? 'error' : item.stock <= item.minStock ? 'warning' : 'success'
        const label = item.stock === 0 ? 'Out of Stock' : item.stock <= item.minStock ? 'Low Stock' : 'In Stock'
        return <Badge variant={variant}>{label}</Badge>
      },
    },
    {
      key: 'actions',
      label: '',
      render: (item) => (
        <div className="flex items-center gap-1">
          <button onClick={() => onEdit(item)} className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-lg">edit</span>
          </button>
          {allowDelete && (
            <button onClick={() => onDelete(item)} className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-error transition-colors">
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
          )}
        </div>
      ),
    },
  ]

  return <Table columns={columns} data={products} loading={loading} emptyMessage="No products found" emptyIcon="inventory_2" rowClassName={(p) => ('stock' in p && typeof p.stock === 'number' && p.stock === 0 ? 'bg-error/5' : undefined)} />
}
