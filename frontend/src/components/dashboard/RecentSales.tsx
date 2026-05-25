import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import type { Sale } from '../../../shared/types'

interface RecentSalesProps {
  sales: Sale[]
}

export function RecentSales({ sales }: RecentSalesProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-gradient-to-br from-surface-container to-surface-container-low border border-surface-variant rounded-2xl p-6 shadow-sm">
      <h3 className="font-title-md text-title-md text-on-surface mb-4">Recent Sales</h3>
      <div className="flex flex-col gap-3">
        {sales.length === 0 ? (
          <p className="font-body-md text-body-md text-on-surface-variant text-center py-8">No recent sales</p>
        ) : (
          sales.map((sale) => (
            <div key={sale.id} className="flex items-center gap-3 py-2 border-b border-surface-variant/20 last:border-0">
              <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary-container text-lg">receipt</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body-md text-body-md text-on-surface truncate">{sale.invoiceNo}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{sale.customerName}</p>
              </div>
              <div className="text-right">
                <p className="font-body-md text-body-md text-on-surface">{formatCurrency(sale.total)}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{formatDate(sale.createdAt, 'relative')}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <button onClick={() => navigate('/sales')} className="mt-4 text-primary-container font-label-sm text-label-sm hover:underline flex items-center gap-1">
        View All →
      </button>
    </div>
  )
}
