import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartProvider, useCart } from '../components/sales/CartContext'
import { ProductSelector } from '../components/sales/ProductSelector'
import { CartPanel } from '../components/sales/CartPanel'
import { InvoiceModal } from '../components/sales/InvoiceModal'
import { create } from '../services/saleService'
import { useNotification } from '../context/NotificationContext'
import type { Sale, Product } from '../../shared/types'

function SalesPageContent() {
  const { state, dispatch } = useCart()
  const navigate = useNavigate()
  const { addNotification } = useNotification()
  const [placing, setPlacing] = useState(false)
  const [completedSale, setCompletedSale] = useState<Sale | null>(null)
  const [showInvoice, setShowInvoice] = useState(false)

  const handleAddToCart = (product: Product) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        stock: product.stock,
      },
    })
  }

  const handlePlaceOrder = async () => {
    setPlacing(true)
    try {
      const sale = await create({
        customerName: state.customerName || undefined,
        customerPhone: state.customerPhone || undefined,
        paymentMethod: state.paymentMethod,
        discount: state.discount,
        items: state.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      })
      addNotification('success', 'Sale created', `Invoice ${sale.invoiceNo} generated.`)
      setCompletedSale(sale)
      setShowInvoice(true)
      dispatch({ type: 'CLEAR_CART' })
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Sale failed'
      addNotification('error', 'Sale failed', msg)
    } finally {
      setPlacing(false)
    }
  }

  const handleNewSale = () => {
    setShowInvoice(false)
    setCompletedSale(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-background">Sales / POS</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Point of Sale terminal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8">
          <ProductSelector onAddToCart={handleAddToCart} />
        </div>
        <div className="lg:col-span-4">
          <CartPanel onPlaceOrder={handlePlaceOrder} placing={placing} />
        </div>
      </div>

      <InvoiceModal
        sale={completedSale}
        isOpen={showInvoice}
        onClose={() => setShowInvoice(false)}
        onNewSale={handleNewSale}
      />
    </div>
  )
}

export default function SalesPage() {
  return (
    <CartProvider>
      <SalesPageContent />
    </CartProvider>
  )
}
