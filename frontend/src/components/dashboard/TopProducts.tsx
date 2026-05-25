import { formatCurrency } from '../../utils/formatCurrency'

interface TopProductsProps {
  products: { productName: string; unitsSold: number; revenue: number }[]
}

export function TopProducts({ products }: TopProductsProps) {
  const maxUnits = Math.max(...products.map((p) => p.unitsSold), 1)

  return (
    <div className="bg-gradient-to-br from-surface-container to-surface-container-low border border-surface-variant rounded-2xl p-6 shadow-sm">
      <h3 className="font-title-md text-title-md text-on-surface mb-4">Top Products</h3>
      <div className="flex flex-col gap-4">
        {products.length === 0 ? (
          <p className="font-body-md text-body-md text-on-surface-variant text-center py-8">No sales data</p>
        ) : (
          products.map((p, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-body-md text-body-md text-on-surface truncate flex-1">{p.productName}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant ml-2">{p.unitsSold} sold</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-6 bg-surface-variant rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-container to-primary"
                    style={{ width: `${(p.unitsSold / maxUnits) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-body-sm text-on-surface-variant w-20 text-right">{formatCurrency(p.revenue)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
