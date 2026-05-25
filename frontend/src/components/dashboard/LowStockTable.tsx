import { useNavigate } from 'react-router-dom'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import type { Product } from '../../../shared/types'

interface LowStockTableProps {
  products: Product[]
}

export function LowStockTable({ products }: LowStockTableProps) {
  const navigate = useNavigate()
  const maxStock = Math.max(...products.map((p) => p.minStock), 1)

  return (
    <div className="bg-gradient-to-br from-surface-container to-surface-container-low border border-surface-variant rounded-2xl p-6 shadow-sm">
      <h3 className="font-title-md text-title-md text-on-surface mb-4">Low Stock Alert</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-surface-variant/30">
              <th className="px-3 py-2 font-label-uppercase text-label-uppercase text-on-surface-variant text-left">Product</th>
              <th className="px-3 py-2 font-label-uppercase text-label-uppercase text-on-surface-variant text-left">SKU</th>
              <th className="px-3 py-2 font-label-uppercase text-label-uppercase text-on-surface-variant text-left">Stock</th>
              <th className="px-3 py-2 font-label-uppercase text-label-uppercase text-on-surface-variant text-center">Min</th>
              <th className="px-3 py-2 font-label-uppercase text-label-uppercase text-on-surface-variant text-center">Status</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-12 text-center font-body-md text-body-md text-on-surface-variant">All products are well-stocked</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-surface-variant/20">
                  <td className="px-3 py-3 font-body-md text-body-md text-on-surface">{p.name}</td>
                  <td className="px-3 py-3 font-mono text-body-sm text-on-surface-variant">{p.sku}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-surface-variant rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${p.stock === 0 ? 'bg-error' : 'bg-tertiary'}`}
                          style={{ width: `${Math.min((p.stock / maxStock) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant w-6 text-right">{p.stock}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center font-body-md text-body-md text-on-surface-variant">{p.minStock}</td>
                  <td className="px-3 py-3 text-center">
                    <Badge variant={p.stock === 0 ? 'error' : 'warning'}>{p.stock === 0 ? 'Out' : 'Low'}</Badge>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Button variant="outline-primary" size="sm" onClick={() => navigate(`/products/${p.id}`)}>View</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
