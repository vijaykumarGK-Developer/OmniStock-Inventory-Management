import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Toggle } from '../components/ui/Toggle'
import { Button } from '../components/ui/Button'
import { create } from '../services/supplierService'

export default function AddSupplierPage() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', contactPerson: '', phone: '', email: '',
    address: '', city: '', state: '', status: 'active' as const,
  })

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Name and Phone are required')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await create({
        name: form.name,
        contactPerson: form.contactPerson || undefined,
        phone: form.phone,
        email: form.email || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
        status: form.status,
      })
      navigate('/suppliers')
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to create supplier'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card title="Add Supplier" subtitle="Register a new supplier" icon="business"
        action={<Button variant="ghost" onClick={() => navigate('/suppliers')}>Cancel</Button>}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Supplier Name *" value={form.name} onChange={update('name')} placeholder="Supplier name" icon="badge" />
            <Input label="Contact Person" value={form.contactPerson} onChange={update('contactPerson')} placeholder="Contact person" icon="person" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Phone *" value={form.phone} onChange={update('phone')} placeholder="+91 98765 43210" icon="call" />
            <Input label="Email" value={form.email} onChange={update('email')} placeholder="supplier@example.com" icon="mail" type="email" />
          </div>
          <Textarea label="Address" value={form.address} onChange={update('address')} placeholder="Full address" rows={3} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="City" value={form.city} onChange={update('city')} placeholder="City" icon="location_city" />
            <Input label="State" value={form.state} onChange={update('state')} placeholder="State" icon="map" />
          </div>
          <div className="flex items-center gap-4">
            <Toggle checked={form.status === 'active'} onChange={(v) => setForm((prev) => ({ ...prev, status: v ? 'active' : 'inactive' }))} label="Active" />
            {!form.status && <span className="font-body-sm text-body-sm text-on-surface-variant">Set supplier status</span>}
          </div>
          {error && <p className="text-error font-body-md">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => navigate('/suppliers')}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Create Supplier'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
