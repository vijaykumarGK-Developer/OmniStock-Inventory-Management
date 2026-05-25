import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Table } from '../components/ui/Table'
import { Badge } from '../components/ui/Badge'
import { SearchInput } from '../components/ui/SearchInput'
import { Pagination } from '../components/ui/Pagination'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { usePurchases } from '../hooks/usePurchases'
import { updateStatus, deletePurchase } from '../services/purchaseService'
import { formatCurrency } from '../utils/formatCurrency'
import { formatDate } from '../utils/formatDate'
import { useNotification } from '../context/NotificationContext'
import { useAuth } from '../context/AuthContext'
import type { TableColumn } from '../components/ui/Table'
import type { Purchase } from '../../shared/types'

const statusBadge: Record<string, 'success' | 'warning' | 'info' | 'neutral'> = {
  received: 'success',
  ordered: 'info',
  pending: 'warning',
  cancelled: 'neutral',
}

export default function PurchasesPage() {
  const navigate = useNavigate()
  const { addNotification } = useNotification()
  const { user } = useAuth()
  const isStaff = user?.role === 'staff'
  const isAdmin = user?.role === 'admin'
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [statusUpdating, setStatusUpdating] = useState<number | null>(null)

  const { data: purchases, total, loading, error, refetch } = usePurchases({
    search,
    status: (statusFilter || undefined) as 'pending' | 'ordered' | 'received' | 'cancelled' | undefined,
    page,
    limit: 12,
  })

  const totalPages = Math.ceil(total / 12)

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this purchase order?')) return
    setDeleting(id)
    try {
      await deletePurchase(id)
      addNotification('success', 'Purchase deleted', 'Purchase order has been removed.')
      refetch()
    } catch { addNotification('error', 'Delete failed', 'Could not delete purchase') }
    finally { setDeleting(null) }
  }

  const handleReceive = async (id: number) => {
    setStatusUpdating(id)
    try {
      await updateStatus(id, { status: 'received' })
      addNotification('success', 'Purchase received', 'Stock has been updated.')
      refetch()
    } catch { addNotification('error', 'Status update failed', 'Could not update purchase status') }
    finally { setStatusUpdating(null) }
  }

  const columns: TableColumn<Purchase>[] = [
    {
      key: 'poNumber', label: 'PO Number',
      render: (p) => <span className="font-mono tabular-nums text-on-surface">{p.poNumber}</span>,
    },
    {
      key: 'supplierName', label: 'Supplier',
      render: (p) => <span className="text-on-surface">{p.supplierName}</span>,
    },
    {
      key: 'items', label: 'Items', align: 'center',
      render: (p) => <span className="text-on-surface-variant">{p.items.length}</span>,
    },
    {
      key: 'total', label: 'Total', align: 'right',
      render: (p) => <span className="font-mono tabular-nums text-on-surface">{formatCurrency(p.total)}</span>,
    },
    {
      key: 'status', label: 'Status', align: 'center',
      render: (p) => (
        <div className="flex items-center justify-center gap-2">
          <Badge variant={statusBadge[p.status] ?? 'neutral'}>{p.status}</Badge>
        </div>
      ),
    },
    {
      key: 'createdAt', label: 'Date',
      render: (p) => <span className="text-on-surface-variant">{formatDate(p.createdAt)}</span>,
    },
    {
      key: 'actions', label: 'Actions', align: 'right',
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          {!isStaff && p.status === 'pending' && (
            <button
              onClick={(e) => { e.stopPropagation(); handleReceive(p.id) }}
              disabled={statusUpdating === p.id}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container-high text-secondary"
              title="Receive"
            >
              <span className="material-symbols-outlined text-lg">download</span>
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/purchases/${p.id}`) }}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container-high text-on-surface-variant"
            title="View"
          >
            <span className="material-symbols-outlined text-lg">visibility</span>
          </button>
          {isAdmin && p.status === 'pending' && (
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(p.id) }}
              disabled={deleting === p.id}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container-high text-error"
              title="Delete"
            >
              <span className="material-symbols-outlined text-lg">{deleting === p.id ? 'hourglass_top' : 'delete'}</span>
            </button>
          )}
        </div>
      ),
    },
  ]

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'ordered', label: 'Ordered' },
    { value: 'received', label: 'Received' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-background">Purchase Orders</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage purchase orders</p>
        </div>
        {!isStaff && (
          <Button onClick={() => navigate('/purchases/add')}>
            <span className="material-symbols-outlined">add</span>
            New Purchase Order
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="stat" accentColor="primary" title="Total Orders" subtitle={`${total} total`} icon="orders" />
        <Card variant="stat" accentColor="tertiary" title="Pending" subtitle={`${purchases.filter((p) => p.status === 'pending').length} orders`} icon="pending" />
        <Card variant="stat" accentColor="secondary" title="Received" subtitle={`${purchases.filter((p) => p.status === 'received').length} orders`} icon="check_circle" />
        <Card variant="stat" accentColor="primary" title="Total Spent" subtitle={formatCurrency(purchases.reduce((s, p) => s + p.total, 0))} icon="payments" />
      </div>

      <div className="flex items-center gap-3">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search PO number or supplier..." className="max-w-sm" />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="bg-surface-container border border-surface-variant rounded-xl px-4 py-2.5 font-body-md text-body-md text-on-surface outline-none"
        >
          {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {error ? (
        <Card>
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <span className="material-symbols-outlined text-4xl text-error">error</span>
            <p className="font-body-md text-body-md text-on-surface-variant">{error}</p>
            <Button variant="outline-primary" onClick={refetch}>Retry</Button>
          </div>
        </Card>
      ) : !loading && purchases.length === 0 ? (
        <EmptyState
          icon="orders"
          title="No purchase orders yet"
          description="Create your first purchase order to get started."
          action={<Button onClick={() => navigate('/purchases/add')}>New Purchase Order</Button>}
        />
      ) : (
        <>
          <Table columns={columns} data={purchases as unknown as Record<string, unknown>[]} loading={loading} emptyMessage="No purchase orders found" emptyIcon="orders" />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
