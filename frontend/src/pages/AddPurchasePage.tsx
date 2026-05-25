import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Textarea } from '../components/ui/Textarea'
import { Button } from '../components/ui/Button'
import { create } from '../services/purchaseService'
import { getAll as getSuppliers } from '../services/supplierService'
import { getAll as getProducts } from '../services/productService'
import { formatCurrency } from '../utils/formatCurrency'
import type { Supplier, Product } from '../../shared/types'

interface LineItem {
  productId: number
  productName: string
  quantity: number
  unitPrice: number
}

export default function AddPurchasePage() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const [form, setForm] = useState({
    supplierId: '',
    orderDate: new Date().toISOString().slice(0, 10),
    expectedDate: '',
    notes: '',
  })

  const [items, setItems] = useState<LineItem[]>([
    { productId: 0, productName: '', quantity: 1, unitPrice: 0 },
  ])

  useEffect(() => {
    getSuppliers({ page: 1, limit: 100 }).then((r) => setSuppliers(r.data)).catch(() => {})
    getProducts({ page: 1, limit: 100 }).then((r) => setProducts(r.data)).catch(() => {})
  }, [])

  const total = useMemo(() =>
    items.reduce((s, i) => s + i.quantity * i.unitPrice, 0),
    [items]
  )

  const addItem = () => {
    setItems((prev) => [...prev, { productId: 0, productName: '', quantity: 1, unitPrice: 0 }])
  }

  const removeItem = (idx: number) => {
    if (items.length <= 1) return
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  const updateItem = (idx: number, field: keyof LineItem, value: number | string) => {
    setItems((prev) => {
      const next = [...prev]
      if (field === 'productId') {
        const pid = Number(value)
        const prod = products.find((p) => p.id === pid)
        next[idx] = { ...next[idx], productId: pid, productName: prod?.name ?? '', unitPrice: prod?.price ?? 0 }
      } else {
        next[idx] = { ...next[idx], [field]: typeof value === 'string' ? Number(value) : value }
      }
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.supplierId) { setError('Please select a supplier'); return }
    if (items.some((i) => !i.productId)) { setError('All items must have a product selected'); return }

    setSaving(true)
    setError(null)
    try {
      await create({
        supplierId: Number(form.supplierId),
        orderDate: form.orderDate || undefined,
        expectedDate: form.expectedDate || undefined,
        notes: form.notes || undefined,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
      })
      navigate('/purchases')
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to create purchase order'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  const supplierOptions = suppliers.map((s) => ({ value: String(s.id), label: s.name }))
  const productOptions = products.map((p) => ({ value: String(p.id), label: `${p.name} (${p.sku})` }))

  return (
    <div className="max-w-3xl mx-auto">
      <Card title="New Purchase Order" subtitle="Create a purchase order for your supplier" icon="orders"
        action={<Button variant="ghost" onClick={() => navigate('/purchases')}>Cancel</Button>}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Supplier *"
              placeholder="Select supplier..."
              options={supplierOptions}
              value={form.supplierId}
              onChange={(e) => setForm((prev) => ({ ...prev, supplierId: e.target.value }))}
            />
            <Input label="Order Date" type="date" value={form.orderDate} onChange={(e) => setForm((prev) => ({ ...prev, orderDate: e.target.value }))} />
            <Input label="Expected Delivery" type="date" value={form.expectedDate} onChange={(e) => setForm((prev) => ({ ...prev, expectedDate: e.target.value }))} />
          </div>

          <div>
            <label className="font-label-uppercase text-label-uppercase text-on-surface-variant mb-3 block">Items *</label>
            <div className="bg-surface-container-low rounded-xl border border-surface-variant overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-surface-dim">
                    <th className="px-3 py-2 font-label-uppercase text-label-uppercase text-on-surface-variant text-left">Product</th>
                    <th className="px-3 py-2 font-label-uppercase text-label-uppercase text-on-surface-variant text-center w-24">Qty</th>
                    <th className="px-3 py-2 font-label-uppercase text-label-uppercase text-on-surface-variant text-right w-28">Unit Price</th>
                    <th className="px-3 py-2 font-label-uppercase text-label-uppercase text-on-surface-variant text-right w-28">Total</th>
                    <th className="px-3 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx} className="border-t border-surface-variant/30">
                      <td className="px-3 py-2">
                        <select
                          value={item.productId || ''}
                          onChange={(e) => updateItem(idx, 'productId', e.target.value)}
                          className="w-full bg-surface-container border border-surface-variant rounded-lg px-3 py-2 font-body-md text-body-md text-on-surface outline-none"
                        >
                          <option value="">Select product...</option>
                          {productOptions.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity || ''}
                          onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                          className="w-full bg-surface-container border border-surface-variant rounded-lg px-3 py-2 font-body-md text-body-md text-on-surface text-center outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={item.unitPrice || ''}
                          onChange={(e) => updateItem(idx, 'unitPrice', e.target.value)}
                          className="w-full bg-surface-container border border-surface-variant rounded-lg px-3 py-2 font-body-md text-body-md text-on-surface text-right outline-none"
                        />
                      </td>
                      <td className="px-3 py-2 text-right font-mono tabular-nums text-on-surface">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {items.length > 1 && (
                          <button type="button" onClick={() => removeItem(idx)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-surface-container-high text-error">
                            <span className="material-symbols-outlined text-lg">close</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" onClick={addItem} className="mt-2 flex items-center gap-1 text-primary-container hover:underline font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-lg">add</span>
              Add Item
            </button>
          </div>

          <Textarea label="Notes" value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Additional notes..." rows={3} />

          <div className="flex justify-end items-center gap-6 pt-2 border-t border-surface-variant/30">
            <div className="text-right">
              <p className="font-body-sm text-body-sm text-on-surface-variant">Total</p>
              <p className="font-headline-md text-headline-md text-primary">{formatCurrency(total)}</p>
            </div>
          </div>

          {error && <p className="text-error font-body-md">{error}</p>}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => navigate('/purchases')}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Creating...' : 'Create Purchase Order'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
