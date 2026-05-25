import { useState, useRef, type ChangeEvent } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'
import type { Product, CreateProductDto } from '../../../shared/types'

const categoryOptions = [
  { value: '', label: 'Select category' },
  { value: '1', label: 'Electronics' },
  { value: '2', label: 'Accessories' },
  { value: '3', label: 'Food & Beverages' },
  { value: '4', label: 'Stationery' },
  { value: '5', label: 'Cleaning Supplies' },
]

const unitOptions = [
  { value: 'pcs', label: 'Pieces (pcs)' },
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'box', label: 'Box' },
  { value: 'meter', label: 'Meter' },
  { value: 'liter', label: 'Liter' },
  { value: 'pair', label: 'Pair' },
  { value: 'set', label: 'Set' },
]

interface ProductFormProps {
  initialData?: Product
  onSubmit: (data: CreateProductDto) => Promise<void>
  onCancel: () => void
  loading?: boolean
  skuError?: string
}

type FormErrors = Partial<Record<keyof CreateProductDto | 'categoryId', string>>

export function ProductForm({ initialData, onSubmit, onCancel, loading, skuError }: ProductFormProps) {
  const [name, setName] = useState(initialData?.name ?? '')
  const [sku, setSku] = useState(initialData?.sku ?? '')
  const [categoryId, setCategoryId] = useState(String(initialData?.categoryId ?? ''))
  const [brand, setBrand] = useState(initialData?.brand ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [price, setPrice] = useState(String(initialData?.price ?? ''))
  const [costPrice, setCostPrice] = useState(String(initialData?.costPrice ?? ''))
  const [stock, setStock] = useState(String(initialData?.stock ?? ''))
  const [minStock, setMinStock] = useState(String(initialData?.minStock ?? ''))
  const [unit, setUnit] = useState(initialData?.unit ?? 'pcs')
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? '')
  const [errors, setErrors] = useState<FormErrors>({})
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const validate = (): boolean => {
    const errs: FormErrors = {}
    if (!name || name.length < 2) errs.name = 'Name must be at least 2 characters'
    if (!sku) errs.sku = 'SKU is required'
    else if (!/^[A-Z0-9-]+$/.test(sku)) errs.sku = 'SKU must be uppercase alphanumeric'
    if (!categoryId) errs.categoryId = 'Category is required'
    if (!price || Number(price) <= 0) errs.price = 'Price must be greater than 0'
    if (stock === '' || Number(stock) < 0) errs.stock = 'Stock must be 0 or more'
    if (minStock === '' || Number(minStock) < 0) errs.minStock = 'Min stock must be 0 or more'
    if (!unit) errs.unit = 'Unit is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    const data: CreateProductDto = {
      name: name.trim(),
      sku: sku.toUpperCase(),
      categoryId: Number(categoryId),
      brand: brand || undefined,
      description: description || undefined,
      price: Number(price),
      costPrice: costPrice ? Number(costPrice) : undefined,
      stock: Number(stock),
      minStock: Number(minStock),
      unit,
      imageUrl: imageUrl || undefined,
    }
    await onSubmit(data)
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <Input label="Product Name *" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} placeholder="Enter product name" />
          <Input label="SKU *" value={sku} onChange={(e) => setSku(e.target.value.toUpperCase())} error={skuError || errors.sku} placeholder="PROD-001" disabled={!!initialData} />
          <Select label="Category *" options={categoryOptions} value={categoryId} onChange={(e) => setCategoryId(e.target.value)} />
          <Input label="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Brand name (optional)" />
          <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={1000} placeholder="Product description..." />
        </div>
        <div className="flex flex-col gap-4">
          <Input label="Price *" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} error={errors.price} placeholder="0.00" />
          <Input label="Cost Price" type="number" step="0.01" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} placeholder="0.00 (optional)" />
          <Input label="Stock *" type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} error={errors.stock} placeholder="0" />
          <Input label="Min Stock *" type="number" min="0" value={minStock} onChange={(e) => setMinStock(e.target.value)} error={errors.minStock} placeholder="5" />
          <Select label="Unit *" options={unitOptions} value={unit} onChange={(e) => setUnit(e.target.value)} error={errors.unit} />
          <Input label="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />

          <div
            className="border-2 border-dashed border-surface-container-highest rounded-xl p-8 text-center hover:border-primary-container transition-colors cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            {(preview || imageUrl) ? (
              <img src={preview ?? imageUrl} alt="Preview" className="max-h-32 mx-auto rounded-lg" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant/50">image</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Click to upload image</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button variant="ghost" onClick={onCancel} type="button">Cancel</Button>
        <Button variant="primary" loading={loading} type="submit">{initialData ? 'Update Product' : 'Create Product'}</Button>
      </div>
    </form>
  )
}
