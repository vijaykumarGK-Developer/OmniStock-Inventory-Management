import { useState, useEffect, useCallback } from 'react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Card } from '../components/ui/Card'
import { Table } from '../components/ui/Table'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { SkeletonCard } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { formatCurrency } from '../utils/formatCurrency'
import { getSales, getStock, getPurchases, getProfit } from '../services/reportService'
import type { TableColumn } from '../components/ui/Table'

const tabs = [
  { key: 'sales', label: 'Sales Report', icon: 'bar_chart' },
  { key: 'stock', label: 'Stock Report', icon: 'inventory' },
  { key: 'purchase', label: 'Purchase Report', icon: 'orders' },
  { key: 'profit', label: 'Profit & Loss', icon: 'account_balance' },
]

const ranges = [
  { key: '7d', label: '7D', days: 7 },
  { key: '30d', label: '30D', days: 30 },
  { key: '90d', label: '90D', days: 90 },
]

function rangeDates(days: number) {
  const to = new Date().toISOString().slice(0, 10)
  const from = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10)
  return { from, to }
}

const tooltipStyle = {
  contentStyle: { background: '#1e1e2e', border: '1px solid #2d3449', borderRadius: 12 },
  labelStyle: { color: '#c7c4d8' },
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color?: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-container border border-surface-variant rounded-xl px-4 py-3 shadow-lg">
      <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-body-md text-body-md text-on-surface" style={{ color: p.color }}>
          {p.name}: ₹{p.value.toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  )
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('sales')
  const [range, setRange] = useState('30d')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<Record<string, unknown>>({})

  const getRange = useCallback(() => {
    if (range === 'custom' && customFrom && customTo) return { from: customFrom, to: customTo }
    const r = ranges.find((r) => r.key === range)
    return r ? rangeDates(r.days) : rangeDates(30)
  }, [range, customFrom, customTo])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { from, to } = getRange()
      let result: Record<string, unknown>
      if (activeTab === 'sales') result = await getSales({ from, to })
      else if (activeTab === 'stock') result = await getStock()
      else if (activeTab === 'purchase') result = await getPurchases({ from, to })
      else result = await getProfit({ from, to })
      setData(result)
    } catch (e: unknown) {
      setError((e as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to load report')
    } finally {
      setLoading(false)
    }
  }, [activeTab, getRange])

  useEffect(() => { fetchData() }, [fetchData])

  const pillClass = (key: string) =>
    `px-4 py-2 rounded-xl font-label-sm text-label-sm transition-colors cursor-pointer ${
      activeTab === key
        ? 'bg-primary-container text-primary-fixed'
        : 'text-on-surface-variant hover:bg-surface-container-high'
    }`

  const rangePillClass = (key: string) =>
    `px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors cursor-pointer ${
      range === key
        ? 'bg-primary-container text-primary-fixed'
        : 'text-on-surface-variant hover:bg-surface-container-high'
    }`

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-headline-lg text-headline-lg text-on-background">Reports</h1>
        <Card>
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="material-symbols-outlined text-4xl text-error">error</span>
            <p className="font-body-md text-body-md text-on-surface-variant">{error}</p>
            <Button variant="outline-primary" onClick={fetchData}>Retry</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline-lg text-headline-lg text-on-background">Reports & Analytics</h1>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {tabs.map((t) => (
          <button key={t.key} className={pillClass(t.key)} onClick={() => setActiveTab(t.key)}>
            <span className="material-symbols-outlined text-lg mr-1.5 align-middle">{t.icon}</span>
            {t.label}
          </button>
        ))}
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          {ranges.map((r) => (
            <button key={r.key} className={rangePillClass(r.key)} onClick={() => setRange(r.key)}>{r.label}</button>
          ))}
          <button className={rangePillClass('custom')} onClick={() => setRange('custom')}>Custom</button>
          {range === 'custom' && (
            <div className="flex items-center gap-2 ml-2">
              <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="bg-surface-container border border-surface-variant rounded-lg px-2 py-1.5 text-sm text-on-surface outline-none" />
              <span className="text-on-surface-variant">—</span>
              <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="bg-surface-container border border-surface-variant rounded-lg px-2 py-1.5 text-sm text-on-surface outline-none" />
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-12"><SkeletonCard /></div>
          <div className="lg:col-span-8"><SkeletonCard /></div>
          <div className="lg:col-span-4"><SkeletonCard /></div>
        </div>
      ) : (
        <>
          {activeTab === 'sales' && <SalesReport data={data as SalesReportData} />}
          {activeTab === 'stock' && <StockReport data={data as StockReportData} />}
          {activeTab === 'purchase' && <PurchaseReport data={data as PurchaseReportData} />}
          {activeTab === 'profit' && <ProfitReport data={data as ProfitReportData} />}
        </>
      )}
    </div>
  )
}

interface SalesReportData {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  dailyRevenue: { date: string; revenue: number }[]
  topProducts: { productName: string; unitsSold: number }[]
}

function SalesReport({ data }: { data: SalesReportData }) {
  if (!data || !data.dailyRevenue?.length) {
    return <EmptyState icon="bar_chart" title="No sales data" description="No sales in the selected period" />
  }
  const columns: TableColumn<{ productName: string; unitsSold: number }>[] = [
    { key: 'productName', label: 'Product' },
    { key: 'unitsSold', label: 'Units Sold', align: 'right' },
  ]
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="stat" accentColor="primary" title="Total Revenue" icon="payments">
          <p className="font-headline-lg text-headline-lg text-on-surface">{formatCurrency(data.totalRevenue)}</p>
        </Card>
        <Card variant="stat" accentColor="secondary" title="Total Orders" icon="receipt">
          <p className="font-headline-lg text-headline-lg text-on-surface">{data.totalOrders}</p>
        </Card>
        <Card variant="stat" accentColor="tertiary" title="Avg Order Value" icon="trending_up">
          <p className="font-headline-lg text-headline-lg text-on-surface">{formatCurrency(data.averageOrderValue)}</p>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <div className="bg-gradient-to-br from-surface-container to-surface-container-low border border-surface-variant rounded-2xl p-6 shadow-sm">
            <h3 className="font-title-md text-title-md text-on-surface mb-4">Revenue Over Time</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.dailyRevenue}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#2d3449" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#c7c4d8" tick={{ fill: '#c7c4d8', fontSize: 11 }} />
                <YAxis stroke="#c7c4d8" tick={{ fill: '#c7c4d8', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} fill="url(#colorRev)" name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="bg-gradient-to-br from-surface-container to-surface-container-low border border-surface-variant rounded-2xl p-6 shadow-sm">
            <h3 className="font-title-md text-title-md text-on-surface mb-4">Top Products</h3>
            <Table columns={columns} data={data.topProducts as unknown as Record<string, unknown>[]} emptyMessage="No products sold" />
          </div>
        </div>
      </div>
    </div>
  )
}

interface StockReportData {
  totalStockValue: number
  stockByCategory: { category: string; value: number }[]
  lowStockCount: number
  outOfStockCount: number
  products: { id: number; name: string; sku: string; stock: number; minStock: number; categoryName: string; stockValue: number }[]
}

function StockReport({ data }: { data: StockReportData }) {
  if (!data || !data.products?.length) {
    return <EmptyState icon="inventory" title="No stock data" description="Add products to see stock reports" />
  }
  const columns: TableColumn<{ name: string; sku: string; stock: number; minStock: number; categoryName: string; stockValue: number }>[] = [
    { key: 'name', label: 'Product' },
    { key: 'sku', label: 'SKU' },
    { key: 'categoryName', label: 'Category' },
    { key: 'stock', label: 'Stock', align: 'right' },
    { key: 'minStock', label: 'Min', align: 'center' },
    { key: 'stockValue', label: 'Value', align: 'right', render: (r) => <span className="font-mono">{formatCurrency(r.stockValue)}</span> },
  ]
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="stat" accentColor="primary" title="Total Stock Value" icon="payments">
          <p className="font-headline-lg text-headline-lg text-on-surface">{formatCurrency(data.totalStockValue)}</p>
        </Card>
        <Card variant="stat" accentColor="secondary" title="Categories" icon="category">
          <p className="font-headline-lg text-headline-lg text-on-surface">{data.stockByCategory.length}</p>
        </Card>
        <Card variant="stat" accentColor="tertiary" title="Low Stock" icon="warning">
          <p className="font-headline-lg text-headline-lg text-on-surface">{data.lowStockCount}</p>
        </Card>
        <Card variant="stat" accentColor="tertiary" title="Out of Stock" icon="cancel">
          <p className="font-headline-lg text-headline-lg text-on-surface">{data.outOfStockCount}</p>
        </Card>
      </div>
      <div className="bg-gradient-to-br from-surface-container to-surface-container-low border border-surface-variant rounded-2xl p-6 shadow-sm">
        <h3 className="font-title-md text-title-md text-on-surface mb-4">Stock Value by Category</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data.stockByCategory}>
            <CartesianGrid stroke="#2d3449" strokeDasharray="3 3" />
            <XAxis dataKey="category" stroke="#c7c4d8" tick={{ fill: '#c7c4d8', fontSize: 11 }} />
            <YAxis stroke="#c7c4d8" tick={{ fill: '#c7c4d8', fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Table columns={columns} data={data.products as unknown as Record<string, unknown>[]} emptyMessage="No products" />
    </div>
  )
}

interface PurchaseReportData {
  totalSpent: number
  totalOrders: number
  bySupplier: { name: string; total: number }[]
  monthlyBreakdown: { month: string; total: number }[]
}

function PurchaseReport({ data }: { data: PurchaseReportData }) {
  if (!data || !data.monthlyBreakdown?.length) {
    return <EmptyState icon="orders" title="No purchase data" description="No purchases in the selected period" />
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card variant="stat" accentColor="primary" title="Total Spent" icon="payments">
          <p className="font-headline-lg text-headline-lg text-on-surface">{formatCurrency(data.totalSpent)}</p>
        </Card>
        <Card variant="stat" accentColor="secondary" title="Total Orders" icon="orders">
          <p className="font-headline-lg text-headline-lg text-on-surface">{data.totalOrders}</p>
        </Card>
      </div>
      <div className="bg-gradient-to-br from-surface-container to-surface-container-low border border-surface-variant rounded-2xl p-6 shadow-sm">
        <h3 className="font-title-md text-title-md text-on-surface mb-4">Monthly Purchases</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data.monthlyBreakdown}>
            <CartesianGrid stroke="#2d3449" strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#c7c4d8" tick={{ fill: '#c7c4d8', fontSize: 11 }} />
            <YAxis stroke="#c7c4d8" tick={{ fill: '#c7c4d8', fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Total" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

interface ProfitReportData {
  totalRevenue: number
  totalCost: number
  grossProfit: number
  profitMargin: number
  monthlyBreakdown: { month: string; revenue: number; cost: number }[]
}

function ProfitReport({ data }: { data: ProfitReportData }) {
  if (!data || !data.monthlyBreakdown?.length) {
    return <EmptyState icon="account_balance" title="No profit data" description="No sales data in the selected period" />
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="stat" accentColor="primary" title="Total Revenue" icon="payments">
          <p className="font-headline-lg text-headline-lg text-on-surface">{formatCurrency(data.totalRevenue)}</p>
        </Card>
        <Card variant="stat" accentColor="tertiary" title="Total Cost" icon="money_off">
          <p className="font-headline-lg text-headline-lg text-on-surface">{formatCurrency(data.totalCost)}</p>
        </Card>
        <Card variant="stat" accentColor="secondary" title="Gross Profit" icon="trending_up">
          <p className="font-headline-lg text-headline-lg text-on-surface">{formatCurrency(data.grossProfit)}</p>
        </Card>
        <Card variant="stat" accentColor="secondary" title="Profit Margin" icon="percent">
          <p className="font-headline-lg text-headline-lg text-on-surface">{data.profitMargin.toFixed(1)}%</p>
        </Card>
      </div>
      <div className="bg-gradient-to-br from-surface-container to-surface-container-low border border-surface-variant rounded-2xl p-6 shadow-sm">
        <h3 className="font-title-md text-title-md text-on-surface mb-4">Revenue vs Cost</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.monthlyBreakdown}>
            <CartesianGrid stroke="#2d3449" strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#c7c4d8" tick={{ fill: '#c7c4d8', fontSize: 11 }} />
            <YAxis stroke="#c7c4d8" tick={{ fill: '#c7c4d8', fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#c7c4d8' }} />
            <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} name="Revenue" />
            <Line type="monotone" dataKey="cost" stroke="#EF4444" strokeWidth={2} name="Cost" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
