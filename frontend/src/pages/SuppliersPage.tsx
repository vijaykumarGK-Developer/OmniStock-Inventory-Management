import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Table } from '../components/ui/Table'
import { Badge } from '../components/ui/Badge'
import { SearchInput } from '../components/ui/SearchInput'
import { Pagination } from '../components/ui/Pagination'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { useSuppliers } from '../hooks/useSuppliers'
import { deleteSupplier } from '../services/supplierService'
import { useNotification } from '../context/NotificationContext'
import { useAuth } from '../context/AuthContext'
import type { TableColumn } from '../components/ui/Table'
import type { Supplier } from '../../shared/types'

const statusBadge: Record<string, 'success' | 'neutral'> = {
  active: 'success',
  inactive: 'neutral',
}

export default function SuppliersPage() {
  const navigate = useNavigate()
  const { addNotification } = useNotification()
  const { user } = useAuth()
  const isStaff = user?.role === 'staff'
  const isAdmin = user?.role === 'admin'
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleting, setDeleting] = useState<number | null>(null)

  const { data: suppliers, total, loading, error, refetch } = useSuppliers({ search, page, limit: 12 })

  const totalPages = Math.ceil(total / 12)

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return
    setDeleting(id)
    try {
      await deleteSupplier(id)
      addNotification('success', 'Supplier deleted', 'Supplier has been removed.')
      refetch()
    } catch {
      addNotification('error', 'Delete failed', 'Could not delete supplier')
    } finally {
      setDeleting(null)
    }
  }

  const columns: TableColumn<Supplier>[] = [
    {
      key: 'name', label: 'Supplier Name', sortable: true,
      render: (s) => (
        <div>
          <p className="font-body-md text-body-md text-on-surface">{s.name}</p>
          {s.city && <p className="font-body-sm text-body-sm text-on-surface-variant">{s.city}{s.state ? `, ${s.state}` : ''}</p>}
        </div>
      ),
    },
    {
      key: 'contactPerson', label: 'Contact Person',
      render: (s) => s.contactPerson ? <span className="text-on-surface">{s.contactPerson}</span> : <span className="text-on-surface-variant italic">—</span>,
    },
    {
      key: 'phone', label: 'Phone / Email',
      render: (s) => (
        <div>
          <p className="font-body-md text-body-md text-on-surface">{s.phone}</p>
          {s.email && <p className="font-body-sm text-body-sm text-on-surface-variant">{s.email}</p>}
        </div>
      ),
    },
    {
      key: 'status', label: 'Status', align: 'center',
      render: (s) => <Badge variant={statusBadge[s.status] ?? 'neutral'}>{s.status}</Badge>,
    },
    {
      key: 'actions', label: 'Actions', align: 'right',
      render: (s) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/suppliers/edit/${s.id}`) }}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container-high text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
          </button>
          {isAdmin && (
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(s.id) }}
              disabled={deleting === s.id}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container-high text-error"
            >
              <span className="material-symbols-outlined text-lg">{deleting === s.id ? 'hourglass_top' : 'delete'}</span>
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-background">Suppliers</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage your suppliers</p>
        </div>
        {!isStaff && (
          <Button onClick={() => navigate('/suppliers/add')}>
            <span className="material-symbols-outlined">add</span>
            Add Supplier
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="stat" accentColor="primary" title="Total Suppliers" subtitle={`${total} registered`} icon="business" />
        <Card variant="stat" accentColor="secondary" title="Active Partners" subtitle={`${suppliers.filter((s) => s.status === 'active').length} suppliers`} icon="handshake" />
        <Card variant="stat" accentColor="tertiary" title="Inactive" subtitle={`${suppliers.filter((s) => s.status === 'inactive').length} suppliers`} icon="pause_circle" />
      </div>

      <div className="flex items-center gap-3">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search suppliers..." className="max-w-sm" />
        <div className="flex-1" />
      </div>

      {error ? (
        <Card>
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <span className="material-symbols-outlined text-4xl text-error">error</span>
            <p className="font-body-md text-body-md text-on-surface-variant">{error}</p>
            <Button variant="outline" onClick={refetch}>Retry</Button>
          </div>
        </Card>
      ) : !loading && suppliers.length === 0 ? (
        <EmptyState
          icon="business"
          title="No suppliers yet"
          description="Get started by adding your first supplier."
          action={<Button onClick={() => navigate('/suppliers/add')}>Add Supplier</Button>}
        />
      ) : (
        <>
          <Table columns={columns} data={suppliers as unknown as Record<string, unknown>[]} loading={loading} emptyMessage="No suppliers found" emptyIcon="business" />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
