import { useNavigate } from 'react-router-dom'
import { useDashboard } from '../hooks/useDashboard'
import { StatCard } from '../components/dashboard/StatCard'
import { RevenueChart } from '../components/dashboard/RevenueChart'
import { RecentSales } from '../components/dashboard/RecentSales'
import { LowStockTable } from '../components/dashboard/LowStockTable'
import { TopProducts } from '../components/dashboard/TopProducts'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Skeleton, SkeletonCard } from '../components/ui/Skeleton'
import { formatCurrency } from '../utils/formatCurrency'

const quickActions = [
  { label: 'Add Product', icon: 'inventory_2', subtitle: 'Create new...', path: '/products/add' },
  { label: 'New Sale', icon: 'point_of_sale', subtitle: 'Create new...', path: '/sales' },
  { label: 'Add Supplier', icon: 'business', subtitle: 'Create new...', path: '/suppliers/add' },
  { label: 'New Purchase', icon: 'orders', subtitle: 'Create new...', path: '/purchases/add' },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const { stats, recentSales, lowStock, topProducts, loading, error, refetch } = useDashboard()

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-background">Dashboard</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Overview of your inventory</p>
          </div>
        </div>
        <Card>
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="material-symbols-outlined text-4xl text-error">error</span>
            <p className="font-body-md text-body-md text-on-surface-variant">{error}</p>
            <Button variant="outline-primary" onClick={refetch}>Retry</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-background">Dashboard</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Overview of your inventory</p>
        </div>
        <Button variant="ghost" onClick={refetch} disabled={loading}>
          <span className="material-symbols-outlined">refresh</span>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard title="Total Products" value={stats?.totalProducts ?? 0} icon="inventory_2" accentColor="primary" />
            <StatCard title="Total Stock" value={stats?.totalStock ?? 0} icon="inventory" accentColor="secondary" />
            <StatCard
              title="Out of Stock"
              value={stats?.outOfStock ?? 0}
              icon="cancel"
              accentColor="tertiary"
            />
            <StatCard
              title="Low Stock"
              value={stats?.lowStock ?? 0}
              icon="warning"
              accentColor="tertiary"
              trend={stats ? { value: `${stats.lowStock} items`, direction: 'up', isPositive: false } : undefined}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          {loading ? <SkeletonCard /> : <RevenueChart data={stats?.monthlyRevenue ?? []} />}
        </div>
        <div className="lg:col-span-4">
          {loading ? <SkeletonCard /> : <RecentSales sales={recentSales} />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          {loading ? <SkeletonCard /> : <LowStockTable products={lowStock} />}
        </div>
        <div className="lg:col-span-4">
          {loading ? <SkeletonCard /> : <TopProducts products={topProducts} />}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="bg-gradient-to-br from-surface-container to-surface-container-low border border-surface-variant rounded-2xl p-5 shadow-sm hover:bg-surface-container-high transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-primary-container">{action.icon}</span>
              <div>
                <p className="font-title-sm text-title-sm text-on-surface">{action.label}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{action.subtitle}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
